import { Entity } from "../interfaces/entity.interface";

export class FoodService {
    public foods: Entity[] = [];

    private maxHeight!: number;
    private maxWidth!: number;

    constructor([width, height]: [number, number]) {
        this.maxHeight = height;
        this.maxWidth = width;
    }

    public removeFood(id: number): void {
        this.foods = this.foods.filter(f => f.id !== id);
    }

    public generateFood(amount: number = 1): void {
        for(let i = 0; i < amount; i++) {
            const food: Entity = {
                id: Date.now() + Math.round(Math.random() * 100),
                size: 1,
                location: [
                    Math.round(Math.random() * this.maxWidth),
                    Math.round(Math.random() * this.maxHeight),
                ],

            }

            this.foods.push(food);
        }
    }

    public getVisibleFood([minx, miny]: [number, number], [maxx, maxy]: [number, number]): Entity[] {
        const foods = this.foods.filter((f) => {
            const [x, y] = f.location;
            return (x > minx && x < maxx && y > miny && y < maxy)
        })

        return foods;
    }
}