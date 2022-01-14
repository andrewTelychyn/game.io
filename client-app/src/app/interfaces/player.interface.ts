import { Vector } from "ts-matrix";
import { Entity } from "./entity.interface";

export interface IPlayer extends Entity {
    velocity?: Vector;
    maxSpeed?: number;
}