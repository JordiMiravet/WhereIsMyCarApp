import { Component } from '@angular/core';
import { NavigationComponent } from "../navigation/navigation";

@Component({
  selector: 'header[header]',
  standalone: true,
  imports: [ NavigationComponent ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {

}
