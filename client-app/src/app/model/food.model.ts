import { Vector } from "ts-matrix";
import { Entity } from "../interfaces/entity.interface";

export class Food implements Entity {
    public location: Vector;
    public size: number = 1;
    public color: string = 'red';
    public id: number;

    constructor(coord: [number, number]) {
        this.id = Date.now() + Math.round(Math.random() * 100);
        this.location = new Vector(coord);
    }

}