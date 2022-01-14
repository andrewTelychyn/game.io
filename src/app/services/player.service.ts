import { Player } from "../interfaces/player.interface";

export class PlayerService {
    public players: Player[] = []

    private maxHeight!: number;
    private maxWidth!: number;

    constructor([width, height]: [number, number]) {
        this.maxHeight = height;
        this.maxWidth = width;
    }

    public removePlayer(id: number): void {
        this.players = this.players.filter(p => p.id !== id);
    }

    public createNewPlayer(): Player {
        const player: Player = {
            id: Date.now() + Math.round(Math.random() * 100),
            size: 3,
            location: [
                Math.round(Math.random() * this.maxWidth),
                Math.round(Math.random() * this.maxHeight),
            ],
            maxSpeed: 1,   
        }

        this.players.push(player);

        return player;
    }

    public getVisiblePlayers([minx, miny]: [number, number], [maxx, maxy]: [number, number]): Player[] {
        const players = this.players.filter((p) => {
            const [x, y] = p.location;
            return (x > minx && x < maxx && y > miny && y < maxy)
        })

        return players;
    }
}