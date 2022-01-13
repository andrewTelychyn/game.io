import { ElementRef, Injectable } from "@angular/core";
import { interval } from "rxjs";
import { Vector } from "ts-matrix";
import { Entity } from "../interfaces/entity.interface";
import { ConfigSevice } from "./config.service";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})
export class DrawService {
    private context: CanvasRenderingContext2D | null = null;
    private canvas!: ElementRef<HTMLCanvasElement>;
    private mousePosition: Vector | null = null;

    constructor(
        private dataService: DataService,
        private configService: ConfigSevice,
    ) {}

    public init(canvas: ElementRef<HTMLCanvasElement>): [number, number] {
        this.canvas = canvas;
        this.context = canvas.nativeElement.getContext('2d');

        // this.addMouseEventListeners();
        this.startDrawingIteration();

        return [
            this.canvas.nativeElement.height,
            this.canvas.nativeElement.width
        ];
    }

    public clearCanvas(): void {
        this.context?.clearRect(0, 0, this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientWidth);
    }

    private addMouseEventListeners(): void {
        const rect = this.canvas.nativeElement.getBoundingClientRect();
        this.canvas.nativeElement.addEventListener('mousemove', (e) => {
            if (this.mousePosition) this.mousePosition = new Vector(this.getMousePos(e, rect));
        });
        
        this.canvas.nativeElement.addEventListener(
            'mouseenter',
            (e) => (this.mousePosition = new Vector(this.getMousePos(e, rect)))
        );
        this.canvas.nativeElement.addEventListener('mouseleave', (e) => (this.mousePosition = null));
    }

    private startDrawingIteration() {
        const config = this.configService.configSubject.value;

        interval(config.drawingInterval).subscribe((val) => {

            this.context?.clearRect(0, 0, this.canvas.nativeElement.clientWidth, this.canvas.nativeElement.clientWidth);
            
            this.dataService.updateIteration(this.drawEntity.bind(this));
        });
    }

    private drawEntity(entity: Entity, [cx, cy]: [number, number]): void {
        if (!this.context) return;
    
        this.context?.beginPath();
        let [x, y] = entity.location.values;
        x -= cx;
        y -= cy;

        this.context.arc(x, y, entity.size, 0, 2 * Math.PI, false);
        this.context.fillStyle = entity.color;
        this.context.fill();

        // this.context.lineWidth = 1;
        // this.context.strokeStyle = '#003300';
        // this.context.stroke();
    }

    private getMousePos(evt: MouseEvent, rect: DOMRect) {
        return [
            (evt.clientX - rect.left) / (rect.right - rect.left) * this.canvas.nativeElement.width,
            (evt.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.nativeElement.height
        ];
    }
}