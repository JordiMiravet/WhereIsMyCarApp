import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFormModalComponent } from './vehicle-form-modal';

describe('VehicleFormModalComponent', () => {
  let component: VehicleFormModalComponent;
  let fixture: ComponentFixture<VehicleFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
