import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [],
  templateUrl: './map-view.html',
  styleUrl: './map-view.css',
})

export class MapViewComponent implements OnInit {
  
  private map: any;
  private userMarker: L.Marker<any> | undefined;

  ngOnInit(): void {
      this.initMap();
  }

  private initMap() {
    this.map = L.map('map').setView([41.478, 2.310], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  }

  getlocation() {
    if (navigator.geolocation) {

      // const myIcon = L.icon({
      //   iconUrl:'aqui va la url de la ruta del icono porque este no me funciona',
      //   iconSize:[ 25,40 ]
      // })

      navigator.geolocation.getCurrentPosition((position) => {
        const coords : [ number, number ] = [ position.coords.latitude, position.coords.longitude ];

        if (this.userMarker) {
          this.userMarker = L.marker(coords);
        } else {
          this.userMarker = L.marker(coords, {
            draggable:true,
            /* icon:myIcon, */
          }).addTo(this.map).bindPopup('You vehicle are here').openPopup();

          this.userMarker.on('dragend', (event) => {
            const marker = event.target;
            const position = marker.getLatLng();
            marker.setLatLng(position).openPopup();
            this.map.setView(position, 19);
            console.log(`Marcador : ${position.lat}, ${position.lng}`)
          })
        }

        this.map.setView(coords, 19);

      }, () => {
        alert('No se pudo obtener la geolocalización')
      });

    } else {
      alert("Geolocalización no soportada por el navegador");
    }
  }
  
}
