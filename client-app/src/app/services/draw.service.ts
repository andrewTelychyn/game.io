import { ElementRef, Injectable } from "@angular/core";
import { interval } from "rxjs";
import { map, switchMap } from 'rxjs/operators';
import { Entity } from "../interfaces/entity.interface";
import { ConfigSevice } from "./config.service";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class DrawService {
    private context: CanvasRenderingContext2D | null = null;
    private canvas!: ElementRef<HTMLCanvasElement>;

    constructor(
        private dataService: DataService,
        private configService: ConfigSevice,
    ) {}

    public init(canvas: ElementRef<HTMLCanvasElement>): [number, number] {
        this.canvas = canvas;
        this.context = canvas.nativeElement.getContext('2d');

        this.startDrawingIteration();

        return [
            this.canvas.nativeElement.height,
            this.canvas.nativeElement.width
        ];
    }

    public clearCanvas(): void {
        this.context?.clearRect(0, 0, this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientWidth);
    }

    private startDrawingIteration() {
        this.configService.configSubject
            .pipe(
                map((obj) => obj.drawingInterval),
                switchMap((value) => interval(value))
            )
            .subscribe(() => {
                this.context?.clearRect(0, 0, this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientWidth);
                this.dataService.updateIteration(this.drawEntity.bind(this));
        })
    }

    private drawEntity(entity: Entity, [cx, cy]: [number, number]): void {
        if (!this.context || !entity.location || !entity.size || !entity.color) return;
    
        this.context?.beginPath();

        let [x, y] = entity.location;
        x -= cx;
        y -= cy;

        this.context.arc(x, y, entity.size, 0, 2 * Math.PI, false);
        this.context.fillStyle = entity.color;
        this.context.fill();
    }
}