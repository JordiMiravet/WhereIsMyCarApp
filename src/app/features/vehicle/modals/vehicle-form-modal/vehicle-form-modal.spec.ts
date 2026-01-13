import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFormModal } from './vehicle-form-modal';

describe('VehicleFormModal', () => {
  let component: VehicleFormModal;
  let fixture: ComponentFixture<VehicleFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
