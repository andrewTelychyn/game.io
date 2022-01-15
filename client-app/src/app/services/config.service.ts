import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Config } from "../interfaces/config.interface";

@Injectable({
    providedIn: 'root'
})
export class ConfigSevice {
    public configSubject: BehaviorSubject<Config>;

    constructor() {
        this.configSubject = new BehaviorSubject({
            fieldSize: [200, 200],
            drawingInterval: 50,
            eatingCoef: 0.3,
        });
    }

    public update(obj: Partial<Config>): void {
        const value = {...this.configSubject.value, ...obj };
        this.configSubject.next(value);
    }

}