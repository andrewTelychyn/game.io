import { Entity } from "./entity.interface";
import { Player } from "./player.interface";

export interface Package {
    food: Entity[],
    player: Player,
    gameInfo: {
        size: [number, number],
        interval: number,
    },
    otherPlayers: Player[],
}