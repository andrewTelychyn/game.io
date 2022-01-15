import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Entity } from "../interfaces/entity.interface";
import { Package } from "../interfaces/package.interface";
import { Player } from "../interfaces/player.interface";
import { ConfigSevice } from "./config.service";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    public player: Player | null = null;
    public otherPlayers: Player[] = [];
    public foods: Entity[] = [];
    public playerMovement: BehaviorSubject<[number, number]> = new BehaviorSubject([0, 0]);

    private maxWidth!: number;
    private maxHeight!: number;

    private canvasMaxWidth!: number;
    private canvasMaxHeight!: number;

    constructor(private configService: ConfigSevice) {}

    get location (): [number, number] {
        if (!this.player || !this.player.location) return [0, 0];
        return this.player.location;
    };

    public initCanvasRanges(maxWidth: number, maxHeight: number): void {
            this.canvasMaxHeight = maxHeight;
            this.canvasMaxWidth = maxWidth;
    }

    public updatePackages(data: Partial<Package>): void {

        if (data.player) {
            this.player = { 
                ...this.player,
                ...data.player,
             };
        }

        if (data.food) {
            const newArray: Entity[] = [];

            data.food.map((food) => {
                if (!food) return;

                let index = -1;
                const item = this.foods.find((f, i) => {
                    if (f.id === food.id) {
                        index = i;
                        return true;
                    }
                    return false;
                });
                
                if (!item || index < 0) newArray.push(food);
                else if (Object.values(food).length > 1) newArray.push({ ...item, ...food });

                this.foods.splice(index); 
            })

            this.foods = newArray.concat(this.foods);
        }

        if (data.otherPlayers) {
            this.otherPlayers = data.otherPlayers;
        }

        if (data.gameInfo) {
            [this.maxWidth, this.maxHeight] = data.gameInfo.size;

            this.configService.update({ 
                fieldSize: data.gameInfo.size,
                drawingInterval: data.gameInfo.interval,  
            });
        }
    }

    public updateIteration(drawCallback: (entity: Entity, correction: [number, number]) => void): void {
        if (!this.player) return;

        let [x, y] = this.location;
        const halfWidth = this.canvasMaxWidth / 2;
        const halfHeight = this.canvasMaxHeight / 2;

        if (x < halfWidth) x = 0;
        else if (this.maxWidth - halfWidth < x) x = this.maxWidth - this.canvasMaxWidth;
        else x -= halfWidth;

        if (y < halfHeight) y = 0;
        else if (this.maxHeight - halfHeight < y) y = this.maxHeight - this.canvasMaxHeight;
        else y -= halfHeight;
        
        this.foods.map(e => drawCallback(e, [x, y]));

        drawCallback(this.player, [x, y]);
        this.otherPlayers.map(o => drawCallback(o, [x, y]))

    }

    public handleMove(key: string): void {
        if (!this.player) return;

        if (key === 'w') this.playerMovement.next([0, -1]);
        if (key === 'a') this.playerMovement.next([-1, 0]);
        if (key === 's') this.playerMovement.next([0, 1]);
        if (key === 'd') this.playerMovement.next([1, 0]);
    }
}