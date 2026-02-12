import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFormModalComponent } from './event-form-modal';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EventFormModalComponent', () => {
  let component: EventFormModalComponent;
  let fixture: ComponentFixture<EventFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFormModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
