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

    constructor(coord: [number, number]) {
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
        this.velocity = new Vector(direct).scale(this.maxSpeed);
    }
}