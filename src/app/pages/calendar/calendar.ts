import { Component } from '@angular/core';
import { CalendarViewComponent } from "../../features/calendar/components/calendar-view/calendar-view";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [ CalendarViewComponent ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})

export class CalendarComponent {}
