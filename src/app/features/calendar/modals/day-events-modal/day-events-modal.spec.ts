import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayEventsModalComponent } from './day-events-modal';

describe('DayEventsModalComponent', () => {
  let component: DayEventsModalComponent;
  let fixture: ComponentFixture<DayEventsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayEventsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayEventsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
