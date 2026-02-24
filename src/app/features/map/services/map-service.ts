import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})

export class MapService {

  private map!: L.Map;

  public locationIcon = L.icon({
    iconUrl: '/assets/icons/marker-icon.png',
    iconSize: [25, 40],
    iconRetinaUrl: '/assets/icons/marker-icon-2x.png',
    shadowUrl: '/assets/icons/marker-shadow.png',
    shadowAnchor: [9, 19],
  });

  public markerOptions: L.MarkerOptions =  {
    draggable: true,
    icon: this.locationIcon,
  }

  initMap(
    containerId: string,
    center: L.LatLngExpression, 
    zoom: number
  ): L.Map {
    this.map = L.map(containerId).setView(center, zoom);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    return this.map
  }

  getMap(): L.Map {
    return this.map;
  }
  
  
  createMarker(
    coords: L.LatLngExpression,
    title?: string,
    draggable: boolean = true
  ): L.Marker {

    const marker = L.marker(coords, {
      draggable: draggable,
      icon: this.locationIcon,
    }).addTo(this.map);

    if (title) { 
      marker.bindPopup(title) 
    }
    return marker;
  }

  setView(coords: L.LatLngExpression, zoom = 19): void {
    this.map.setView(coords, zoom);
  }

  removeLayer(layer: L.Layer): void {
    this.map.removeLayer(layer);
  }

}
