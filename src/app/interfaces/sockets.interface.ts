import { InitialPackage } from "./initial.package.interface";

export interface ServerToClientEvents {
    init: (data: InitialPackage) => void,
    update: (data: Partial<InitialPackage>) => void,
}

export interface ClientToServerEvents {
    hello: () => void;
}