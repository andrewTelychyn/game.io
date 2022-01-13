import { Injectable } from "@angular/core";
import { Vector } from "ts-matrix";
import { Entity } from "../interfaces/entity.interface";
import { Food } from "../model/food.model";
import { Player } from "../model/player.model";

const MAX_FOOD_AMOUNT = 20;

@Injectable({
    providedIn: 'root'
})
export class DataService {
    public player: Player | null = null;
    public foods: Food[] = [];

    private maxWidth!: number;
    private maxHeight!: number;

    public initGame(maxWidth: number, maxHeight: number): void {
        this.maxHeight = maxHeight;
        this.maxWidth = maxWidth;

        this.player = new Player([
            Math.round(Math.random() * this.maxWidth),
            Math.round(Math.random() * this.maxHeight)
        ]);
        this.generateFood();
    }

    public updateIteration(drawCallback: (entity: Entity) => void): void {
        if (!this.player) return;

        const increase = this.checkFoodColision();
        this.foods.map(i => drawCallback(i));

        this.player?.update(increase);
        drawCallback(this.player);

    }

    public handleMove(key: string): void {
        if (!this.player) return;

        if (key === 'w') this.player.move([0, -1]);
        if (key === 'a') this.player.move([-1, 0]);
        if (key === 's') this.player.move([0, 1]);
        if (key === 'd') this.player.move([1, 0]);
    }

    private checkFoodColision(): number {
        let sum: number = 0;

        this.foods = this.foods.filter((f) => {
            if (!this.player) return true;

            if (this.getDistance(this.player.location, f.location) < this.player.size) {
                console.log(this.getDistance(this.player.location, f.location), this.player.size);
                sum += f.size;
                return false;
            }
            return true;
        });

        return sum;
    }

    private generateFood(): void {
        for(let i = 0; i < MAX_FOOD_AMOUNT; i++) {
            this.foods.push(new Food([
                Math.round(Math.random() * this.maxWidth),
                Math.round(Math.random() * this.maxHeight)
            ]));
        }
    }

    private getDistance(vector1: Vector, vector2: Vector): number {
        let [x, y] = vector1.values;
        let [myx, myy] = vector2.values;
        return Math.sqrt((x - myx)**2 + (y - myy)**2)
    }
}