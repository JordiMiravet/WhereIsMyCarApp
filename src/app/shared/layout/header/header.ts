import { Component } from '@angular/core';
import { NavigationComponent } from "../navigation/navigation";
import { AuthActionsComponent } from "../auth-actions/auth-actions";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavigationComponent, AuthActionsComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent {
  
}
