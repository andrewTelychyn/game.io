import { GAME_CONFIG } from "../game.config";
import { FoodService } from "./food.service";
import { Package } from "../interfaces/package.interface";
import { PlayerService } from "./player.service";
import { Player } from "../interfaces/player.interface";

export class GameService {
    public playersService: PlayerService;
    public foodsService: FoodService;

    private width: number;
    private height: number;

    constructor() {
        [this.width, this.height] = GAME_CONFIG.FIELD_SIZE;

        this.foodsService = new FoodService([this.width, this.height]);
        this.foodsService.generateFood(GAME_CONFIG.MAX_FOOD);

        this.playersService = new PlayerService([this.width, this.height], this.foodsService);
    }

    public getUpdatePackage(id: number): Partial<Package> {
        const player = this.playersService.players.find(p => p.id === id);

        if (!player) return {}

        
        let packagePlayer: Player = {
            id: player.id,
            location: player.location
        };

        const [vx, vy] = player.velocity || [0, 0] 
        if (vx || vy) {
            let [x, y] = player.location || [0, 0];
            x += vx;
            y += vy;
            player.location = [x, y];
            player.velocity = [0, 0]

           packagePlayer.velocity = [0, 0];
           packagePlayer.location = [x, y]
        } 

        const limits = this.getLimitNumbers(player.location || [0, 0]);
        const otherPlayers = this.playersService.getData(id, limits.min, limits.max);
        const food = this.foodsService.getFood(id, limits.min, limits.max);

        if (player.updated) {
            packagePlayer.size = player.size;
            player.updated = false;
        }

        const updatePackage: Partial<Package> = {
            otherPlayers,
            food,
            player: packagePlayer,
        };

        // console.log(player.location);
        return updatePackage;
    }

    public getInitalPackage(): Package {
        const player = this.playersService.createNewPlayer();
        const limits = this.getLimitNumbers(player.location || [0, 0]);

        const initPackage: Package = {
            gameInfo: {
                size: [this.width, this.height],
                interval: GAME_CONFIG.INTERVAL,
            },
            player,
            otherPlayers: this.playersService.getData(player.id, limits.min, limits.max),
            food: this.foodsService.getFood(player.id, limits.min, limits.max),
        };

        return initPackage;
    }

    public movePlayer(id: number, direct: [number, number]): void {
        this.playersService.movePlayer(id, direct);
    }

    private getLimitNumbers([x, y]: [number, number]): {min: [number, number], max: [number, number]} {
        const height = this.height * GAME_CONFIG.VIEW_AREA_COEF;
        const width = this.width * GAME_CONFIG.VIEW_AREA_COEF;

        return {
            min: [
                x - width / 2,
                y - height / 2,
            ],
            max: [
                x + width / 2,
                y + height / 2,
            ],
        }
    }
}