import { InitialPackage, UpdatePackage } from "./package.interface";

export interface ServerToClientEvents {
    init: (data: InitialPackage) => void,
    update: (data: Partial<UpdatePackage>) => void,
}

export interface ClientToServerEvents {
    hello: () => void;
}