import { Injectable } from "@angular/core";
import { Vector } from "ts-matrix";
import { Config } from "../interfaces/config.interface";
import { Entity } from "../interfaces/entity.interface";
import { InitialPackage, UpdatePackage } from "../interfaces/package.interface";
import { Food } from "../model/food.model";
import { Player } from "../model/player.model";
import { ConfigSevice } from "./config.service";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    public player: Player | null = null;
    public foods: Food[] = [];

    private maxWidth!: number;
    private maxHeight!: number;

    private canvasMaxWidth!: number;
    private canvasMaxHeight!: number;

    constructor(private configService: ConfigSevice) {}

    get location (): [number, number] {
        if (!this.player) return [0, 0];
        return this.player.location.values as [number, number];
    };

    public initGame(maxWidth: number, maxHeight: number): void {
        const config = this.configService.configSubject.value;

        this.canvasMaxHeight = maxHeight;
        this.canvasMaxWidth = maxWidth;

        [this.maxWidth, this.maxHeight] = config.fieldSize;

        this.player = new Player([
            Math.round(Math.random() * this.maxWidth),
            Math.round(Math.random() * this.maxHeight)
        ], [this.maxWidth, this.maxHeight]);

        this.generateFood();
    }

    public initServerGame(data: InitialPackage): void {
        this.player = new Player(
            data.player.location as any, // REMOVE ANY
            [this.maxWidth, this.maxHeight],
            data.player.id,
            data.player.maxSpeed
        );

        data.food.map(item => {
            const food = new Food(
                item.location as any,
                item.id,
                item.size
            );
            this.foods.push(food)
        })
    }

    public updateServerGame(data: UpdatePackage): void {
        data.food.map(item => {
            const food = new Food(
                item.location as any,
                item.id,
                item.size
            );
            this.foods.push(food)
        })
    }

    public updateIteration(drawCallback: (entity: Entity, corection: [number, number]) => void): void {
        if (!this.player) return;

        const increase = this.checkFoodColision();

        let [x, y] = this.location;
        const halfWidth = this.canvasMaxWidth / 2;
        const halfHeight = this.canvasMaxHeight / 2;

        if (x < halfWidth) x = 0;
        else if (this.maxWidth - halfWidth < x) x = this.maxWidth - this.canvasMaxWidth;
        else x -= halfWidth;

        if (y < halfHeight) y = 0;
        else if (this.maxHeight - halfHeight < y) y = this.maxHeight - this.canvasMaxHeight;
        else y -= halfHeight;
        
        this.filterObjectOffRange(this.foods).map(e => drawCallback(e, [x, y]));

        this.player?.update(increase);
        drawCallback(this.player, [x, y]);

    }

    public handleMove(key: string): void {
        if (!this.player) return;

        if (key === 'w') this.player.move([0, -1]);
        if (key === 'a') this.player.move([-1, 0]);
        if (key === 's') this.player.move([0, 1]);
        if (key === 'd') this.player.move([1, 0]);
    }

    private checkFoodColision(): number {
        const config = this.configService.configSubject.value;
        let sum: number = 0;

        this.foods = this.foods.filter((f) => {
            if (!this.player) return true;

            if (this.getDistance(this.player.location, f.location) < this.player.size) {
                console.log(this.getDistance(this.player.location, f.location), this.player.size);
                sum += f.size * config.eatingCoef;
                return false;
            }
            return true;
        });

        return sum;
    }

    private generateFood(): void {
        const config = this.configService.configSubject.value;

        for(let i = 0; i < config.maxFood; i++) {
            this.foods.push(new Food([
                Math.round(Math.random() * this.maxWidth),
                Math.round(Math.random() * this.maxHeight)
            ]));
        }
    }

    private filterObjectOffRange(entities: Entity[]): Entity[] {
        const [x, y] = this.location;

        return entities.filter((e) => {
            const [ex, ey] = e.location.values;

            return Math.abs(x - ex) < this.canvasMaxWidth / 1.5 || Math.abs(y - ey) < this.canvasMaxHeight / 1.5;
        });
    }

    private getDistance(vector1: Vector, vector2: Vector): number {
        let [x, y] = vector1.values;
        let [myx, myy] = vector2.values;
        return Math.sqrt((x - myx)**2 + (y - myy)**2)
    }
}