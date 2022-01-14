import { Entity } from "./entity.interface";

export interface Player extends Entity {
    velocity?: [number, number],
    maxSpeed?: number,
}