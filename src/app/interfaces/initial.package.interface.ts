import { Entity } from "./entity.interface";
import { Player } from "./player.interface";

export interface InitialPackage {
    food: Entity[],
    player: Player,
    filedInfo: {
        size: [number, number]
    },
    otherPlayers: Player[],
}