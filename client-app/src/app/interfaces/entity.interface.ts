import { Vector } from "ts-matrix";

export interface Entity {
    id: number,
    size?: number,
    color?: string,
    location?: [number, number],
}