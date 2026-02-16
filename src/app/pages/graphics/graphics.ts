import { Component } from '@angular/core';
import { GraphicsView } from "../../features/graphics/components/graphics-view/graphics-view";

@Component({
  selector: 'app-graphics',
  standalone: true,
  imports: [ GraphicsView] ,
  templateUrl: './graphics.html',
  styleUrl: './graphics.css',
})
export class GraphicsComponent {

}
