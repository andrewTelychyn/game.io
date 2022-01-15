import { GAME_CONFIG } from "../game.config";
import { Entity } from "../interfaces/entity.interface";
import { Player } from "../interfaces/player.interface";
import { FoodService } from "./food.service";

export class PlayerService {
    public players: Player[] = []

    private maxHeight!: number;
    private maxWidth!: number;

    constructor([width, height]: [number, number], private foodService: FoodService) {
        this.maxHeight = height;
        this.maxWidth = width;
    }

    public movePlayer(id: number, [x, y]: [number, number]): void {
        const player = this.players.find(p => p.id === id);
        if (!player) return;

        const speed = player.maxSpeed || 1;
        player.velocity = [x * speed, y * speed];
    }

    public killPlayer(id: number): void {
        this.players = this.players.filter(p => p.id !== id);
    }

    public createNewPlayer(): Player {
        const player: Player = {
            id: Date.now() + Math.round(Math.random() * 100),
            size: 3,
            location: [
                Math.round(Math.random() * this.maxWidth),
                Math.round(Math.random() * this.maxHeight),
            ],
            maxSpeed: 3,
            velocity: [0, 0],
            color: 'black',
        }

        this.players.push(player);

        return player;
    }

    public getData(id: number, [minx, miny]: [number, number], [maxx, maxy]: [number, number]): Player[] {
        const player = this.players.find(p => p.id === id);
        let sum: number = 0;

        const players = this.players
            .filter(p => {
                if (p.id === id) return false;

                const [x, y] = p.location || [0, 0];
                return (x > minx && x < maxx && y > miny && y < maxy)
            })
            .filter((p) => this.checkColisions(player, p, sum))
            .map(p => ({
                id: p.id,
                location: p.location,
            }));

        if (player) {
            sum = this.checkFoodColisions(player, sum);
            player.updated = true;
            player.size = (player.size || 3) + sum;
        }

        return players;
    }

    private checkColisions(player1: Player | undefined, player2: Player, sum: number): boolean {
        if (!player2.location || !player2.size) return false;
        if (!player1 || !player1.location || !player1.size) return true;
        
        const distance = this.getDistance(player1.location, player2.location);
        if (distance < player1.size && player1.size > player2.size) {
            // bug
            sum += player2.size * GAME_CONFIG.EATING_COEF;
            this.killPlayer(player2.id);
            return false;
        }
        else if (distance < player2.size && player1.size < player2.size) {
            player2.size += player1.size * GAME_CONFIG.EATING_COEF;
            this.killPlayer(player1.id);
            return true;
        }
        
        return true;
    }

    private checkFoodColisions(player: Player, sum: number): number {
        let sumout = sum;

        this.foodService.foods.map((f) => {
            if (!f.location) return;
            if (!player || !player.location || !player.size) return;
            
            if (this.getDistance(player.location, f.location) < player.size) {
                sumout += (f.size || 1) * GAME_CONFIG.EATING_COEF;
                f.updated = true;
            }
        });

        return sumout;
    }

    private getDistance([x, y]: [number, number], [myx, myy]: [number, number]): number {
        return Math.sqrt((x - myx) ** 2 + (y - myy) ** 2)
    }
}