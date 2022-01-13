import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Config } from "../interfaces/config.interface";
import { GAME_CONFIG } from '../../../../config/game.config';

@Injectable({
    providedIn: 'root'
})
export class ConfigSevice {
    public configSubject: BehaviorSubject<Config>;

    constructor() {
        this.configSubject = new BehaviorSubject({
            fieldSize: GAME_CONFIG.FIELD_SIZE as [number, number],
            drawingInterval: 50,
            maxFood: 100,
            eatingCoef: 0.3,
        });
    }

    public update(obj: Partial<Config>): void {
        const value = {...this.configSubject.value, ...obj };
        this.configSubject.next(value);
    }

}