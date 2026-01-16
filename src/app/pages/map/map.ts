import { Component } from '@angular/core';
import { MapViewComponent } from "../../features/map/components/map-view/map-view";
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ MapViewComponent ],
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
})

export class MapComponent {

}
