import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/layout/header/header';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, HeaderComponent ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('WhereIsMyCarApp');
}
