import { timer, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Server } from 'socket.io';
import { GAME_CONFIG } from './app/game.config';
import { ClientToServerEvents, ServerToClientEvents } from './app/interfaces/sockets.interface';
import { GameService } from './app/services/game.service';
import { enviroment } from './environments/environment';

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
    cors: {
        origin: enviroment.clientLink,
        methods: ['GET', 'POST'],
    }
});

const game = new GameService();

io.on("connection", (socket) => {
    console.log('connected');

    const initalPackage = game.getInitalPackage();
    const id = initalPackage.player.id;

    socket.emit("init", initalPackage);
    
    const time = GAME_CONFIG.INTERVAL;
    timer(time).pipe(
        switchMap(() => interval(time)),
    ).subscribe(() => {
        socket.emit('update', game.getUpdatePackage(id));
    })

    socket.on('hello', () => console.log('hello'));
});

io.listen(enviroment.serverPort);
