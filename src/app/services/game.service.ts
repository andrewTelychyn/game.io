import { GAME_CONFIG } from "../game.config";
import { FoodService } from "./food.service";
import { InitialPackage } from "../interfaces/initial.package.interface";
import { PlayerService } from "./player.service";

export class GameService {
    public playersService: PlayerService;
    public foodsService: FoodService;
    
    private width: number;
    private height: number;

    constructor() {
        [this.width, this.height] = GAME_CONFIG.FIELD_SIZE;

        this.foodsService = new FoodService([this.width, this.height]);
        this.playersService = new PlayerService([this.width, this.height]);
    }

    public getUpdatePackage(id: number): Partial<InitialPackage> {
        const player = this.playersService.players.find(p => p.id === id);

        if (!player) return {}

        const limits = this.getLimitNumbers(player.location);
        const updatePackage: Partial<InitialPackage> = {
            otherPlayers: this.playersService.getVisiblePlayers(limits.min, limits.max),
            food: this.foodsService.getVisibleFood(limits.min, limits.max),
        };

        return updatePackage;
    }

    public getInitalPackage(): InitialPackage {
        const player = this.playersService.createNewPlayer();
        const limits = this.getLimitNumbers(player.location);

        const initPackage: InitialPackage = {
            filedInfo: {
                size: [this.width, this.height],
            },
            player,
            otherPlayers: this.playersService.getVisiblePlayers(limits.min, limits.max),
            food: this.foodsService.getVisibleFood(limits.min, limits.max),
        };

        return initPackage;
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