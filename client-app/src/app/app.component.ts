import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { DataService } from './services/data.service';
import { DrawService } from './services/draw.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  title = 'client-app';

  constructor(
    private dataService: DataService,
    private drawService: DrawService,
    private socketService: SocketService,
  ) {}

  ngAfterViewInit(): void {
    this.socketService.init();

    const [height, width] = this.drawService.init(this.canvas);
    this.dataService.initGame(width, height);

    this.initKeyboardEvents();
  }

  private initKeyboardEvents(): void {
    fromEvent(document, 'keydown').subscribe((key: any) => {
      // console.log(key)
      this.dataService.handleMove(key.key);
    })
  }
}
