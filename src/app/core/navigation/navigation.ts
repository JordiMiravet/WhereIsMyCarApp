import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'nav[navigation]',
  imports: [RouterLink],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css'],
})
export class NavigationComponent {

}
