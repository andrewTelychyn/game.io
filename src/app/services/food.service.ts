import { Entity } from "../interfaces/entity.interface";

export class FoodService {
    public foods: Entity[] = [];

    private maxHeight!: number;
    private maxWidth!: number;

    private packageHistory: { [id: number]: number[]} = {};

    constructor([width, height]: [number, number]) {
        this.maxHeight = height;
        this.maxWidth = width;
    }

    public removeFood(id: number): void {
        console.log('removing food');
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
                color: 'red',
            }

            this.foods.push(food);
        }
    }

    public getFood(id: number, [minx, miny]: [number, number], [maxx, maxy]: [number, number]): Entity[] {
        if (!this.packageHistory[id]) this.packageHistory[id] = []; 

        const foods = this.foods.filter((f) => {
            const [x, y] = f.location || [0, 0];
            if (!(x > minx && x < maxx && y > miny && y < maxy)) {

                // this.packageHistory[id] = this.packageHistory[id].filter(i => i !== f.id);
                return false;
            }
            else return true;
        })

        // future optimization, yet more of a bug 
        return foods/*.filter(f => {
            if (f.updated) {
                console.log('here');
                return true;
            }
            if (!this.packageHistory[id].includes(f.id)) {
                this.packageHistory[id].push(f.id);
                return true
            };

            return false;
        })*/.map((f) => {
            if (f.updated) {
                console.log('here 2');
                f.updated = false;
                this.removeFood(f.id);
                return { id: f.id };
            }
            return f
        });
    }

    public removePlayer(id: number): void {
        if (this.packageHistory[id]) delete this.packageHistory[id];
    }
}