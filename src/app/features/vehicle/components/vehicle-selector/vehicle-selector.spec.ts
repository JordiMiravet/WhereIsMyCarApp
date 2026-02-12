import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSelectorComponent } from './vehicle-selector';
import { VehicleInterface } from '../../interfaces/vehicle';
import { signal, WritableSignal } from '@angular/core';

describe('VehicleSelectorComponent', () => {
  let component: VehicleSelectorComponent;
  let fixture: ComponentFixture<VehicleSelectorComponent>;

  const mockVehicles: VehicleInterface[] = [
    { name: 'Ferrari', model: 'F8 Tributo', plate: 'F123', location: { lat: 41.0, lng: 2.0 } },
    { name: 'Pagani', model: 'Huayra', plate: 'P456', location: { lat: 42.0, lng: 3.0 } }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleSelectorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('component creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('inputs', () => {
    it('should accept vehicles input', () => {
      const mockSignal = () => mockVehicles;
      (component.vehicles as any) = mockSignal;

      expect(component.vehicles()).toBe(mockVehicles);
    });

    it('should accept selectedPlate input', () => {
      const mockPlateSignal = () => 'F123';
      (component.selectedPlate as any) = mockPlateSignal;

      expect(component.selectedPlate()).toBe('F123');
    });
  });

  describe('template rendering', () => {
    it('should render the select element', () => {
      const select = fixture.nativeElement.querySelector('#vehicle-select');
      expect(select).toBeTruthy();
    });

    it('should render an option for each vehicle plus default option', () => {
      (component.vehicles as any) = () => mockVehicles;
      fixture.detectChanges();

      const allOptions = fixture.nativeElement.querySelectorAll('option');
      expect(allOptions.length).toBe(mockVehicles.length + 1);
    });

    it('should mark the selected option according to selectedPlate', () => {
      const vehiclesSignal: WritableSignal<VehicleInterface[]> = signal(mockVehicles);
      const selectedPlateSignal: WritableSignal<string | null> = signal('F123');

      (component.vehicles as any) = vehiclesSignal;
      (component.selectedPlate as any) = selectedPlateSignal;

      fixture.detectChanges();

      const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
      expect(select.value).toBe('F123');
    });
  });

  describe('events', () => {
    it('should emit vehicleSelected when a vehicle is selected', () => {
      (component.vehicles as any) = () => mockVehicles;
      fixture.detectChanges();
      spyOn(component.vehicleSelected, 'emit');

      const select: HTMLSelectElement = fixture.nativeElement.querySelector('#vehicle-select');
      select.value = 'P456';
      select.dispatchEvent(new Event('change'));

      expect(component.vehicleSelected.emit).toHaveBeenCalledWith(mockVehicles[1]);
    });

    it('should emit null when default option is selected', () => {
      (component.vehicles as any) = () => mockVehicles;
      fixture.detectChanges();
      spyOn(component.vehicleSelected, 'emit');

      const select: HTMLSelectElement = fixture.nativeElement.querySelector('#vehicle-select');
      select.value = '';
      select.dispatchEvent(new Event('change'));

      expect(component.vehicleSelected.emit).toHaveBeenCalledWith(null as any);
    });

    it('should not emit if selected plate does not match any vehicle', () => {
      (component.vehicles as any) = () => mockVehicles;
      fixture.detectChanges();

      spyOn(component.vehicleSelected, 'emit');

      component.onVehicleChange({
        target: { value: 'X999' }
      } as any);

      expect(component.vehicleSelected.emit).not.toHaveBeenCalled();
    });
  });

});
