import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { environment } from "src/environments/environment";
import { ClientToServerEvents, ServerToClientEvents } from "../interfaces/sockets.interface";
import { DataService } from "./data.service";

@Injectable({
    providedIn: "root"
})
export class SocketService {
    public socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(environment.serverLink);

    constructor(private dataService: DataService) {}
    
    public init(): void {
        this.socket.on('init', (data) => {
            console.log('init');
            this.dataService.updatePackages(data);
        })

        this.socket.on('update', (data) => {
            this.dataService.updatePackages(data);
        })
    
        this.socket.emit('hello');

        this.dataService.playerMovement.subscribe((data) => {
            this.socket.emit('move', data);
        })
    }
}