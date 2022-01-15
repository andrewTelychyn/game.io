import { Package } from "./package.interface";

export interface ServerToClientEvents {
    init: (data: Package) => void,
    update: (data: Partial<Package>) => void,
}

export interface ClientToServerEvents {
    hello: () => void;
    move: (direct: [number, number]) => void;
}