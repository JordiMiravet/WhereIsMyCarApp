import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEmptyStateComponent } from './vehicle-empty-state';

describe('VehicleEmptyStateComponent', () => {
  let component: VehicleEmptyStateComponent;
  let fixture: ComponentFixture<VehicleEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleEmptyStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
