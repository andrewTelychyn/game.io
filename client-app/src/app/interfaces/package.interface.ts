import { Entity } from "./entity.interface";
import { IPlayer } from "./player.interface";

export interface UpdatePackage {
    food: Entity[],
    otherPlayers: IPlayer[],
}

export interface InitialPackage {
    food: Entity[],
    player: IPlayer,
    filedInfo: {
        size: [number, number]
    },
    otherPlayers: IPlayer[],
}