import { Vector } from "ts-matrix";
import { Entity } from "../interfaces/entity.interface";
import { Food } from "./food.model";

export class Player implements Entity{
    public id: number;

    public location: Vector;
    public velocity: Vector;
    public size: number = 3;
    public color: string = 'black';

    public maxSpeed: number = 3;

    constructor(coord: [number, number], private limits: [number, number]) {
        this.id = Date.now() + Math.round(Math.random() * 100);

        this.location = new Vector(coord);
        this.velocity = new Vector([0, 0]);
    }

    public update(increase: number = 0): void {
        this.location = this.location.add(this.velocity);
        this.velocity = new Vector([0, 0]);

        this.size += increase;
    }

    public move(direct: [number, number]): void {
        const vector = new Vector(direct).scale(this.maxSpeed);
        if (this.isLimit(vector.values as [number, number])) return;
        else this.velocity = vector;
    }

    private isLimit(values: [number, number]): boolean {
        const [vx, vy] = values;
        const [x, y] = this.location.values;
        const [maxx, maxy] = this.limits;

        return vx + x < 0 || vx + x > maxx || vy + y < 0 || vy + y > maxy
    }
}