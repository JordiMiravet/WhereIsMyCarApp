import { Component, input, output } from '@angular/core';
import { EditButtonComponent } from '../../../../shared/components/buttons/edit-button/edit-button';
import { DeleteButtonComponent } from '../../../../shared/components/buttons/delete-button/delete-button';
import { CommonModule } from '@angular/common';
import { VehicleInterface } from '../../interfaces/vehicle';

@Component({
  selector: 'app-vehicle-table',
  standalone: true,
  imports: [ 
    EditButtonComponent, 
    DeleteButtonComponent, 
    CommonModule 
  ],
  templateUrl: './vehicle-table.html',
  styleUrl: './vehicle-table.css',
})
export class VehicleTableComponent {

  /*
    // En boton añadir usuario al vehiculo primero traer los posibles usuarios, una vez que se selecciona el usuario
    // tienes que hacer un update del vehiculo mandandole el id del vehiculo y el id del usuario
    // antes de hacer el update tengo que hacer el if de si no está, si no está se añade, si está que se envie un mensaje como que ya está
    // abres un vehiculo y te tiene que aparecer la lista de usuarios inscritos en ese vehiculo
    // y a cada usuario le puedes poner un iconito para eliminar, y cuando se aprete recoje ese id y lo deletea
  */
  
  vehicles = input<VehicleInterface[]>([]);
  vehicleModal = input<any>();

  deleteVehicle = output<VehicleInterface>();
  
}
