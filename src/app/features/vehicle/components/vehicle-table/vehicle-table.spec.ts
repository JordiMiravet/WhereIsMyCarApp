import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTableComponent } from './vehicle-table';
import { VehicleInterface } from '../../interfaces/vehicle';
import { signal, WritableSignal } from '@angular/core';

describe('VehicleTableComponent', () => {
  let component: VehicleTableComponent;
  let fixture: ComponentFixture<VehicleTableComponent>;

  const mockVehicles: VehicleInterface[] = [
    { name: 'Ferrari', model: 'F8', plate: 'F123', location: { lat: 41, lng: 2 } },
    { name: 'Lamborghini', model: 'Huracan', plate: 'L456', location: { lat: 42, lng: 3 } }
  ];

  const mockVehicleModal = {
    openEdit: jasmine.createSpy('openEdit')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('component creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('inputs', () => {
    it('should accept vehicles input as signal', () => {
      const vehiclesSignal: WritableSignal<VehicleInterface[]> = signal(mockVehicles);
      (component.vehicles as any) = vehiclesSignal;

      expect(component.vehicles()).toBe(mockVehicles)
    });

    it('should accept vehicleModal input', () => {
      (component.vehicleModal as any) = () => mockVehicleModal;
      expect(component.vehicleModal()).toBe(mockVehicleModal);
    });
  });

  describe('template rendering', () => {
    it('should render the table element', () => {
      const table = fixture.nativeElement.querySelector('table');
      expect(table).toBeTruthy();
    });

    it('should render the table header', () => {
      const thead = fixture.nativeElement.querySelector('thead');
      expect(thead).toBeTruthy();
    });

    it('should render the table body', () => {
      const tbody = fixture.nativeElement.querySelector('tbody');
      expect(tbody).toBeTruthy();
    });

    it('should render one table row per vehicle', () => {
      (component.vehicles as any) = () => mockVehicles;
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(mockVehicles.length);
    });

    it('should render vehicle name, model and plate in each row', () => {
      (component.vehicles as any) = () => mockVehicles;
      fixture.detectChanges();

      const textContent = fixture.nativeElement.textContent;

      expect(textContent).toContain(mockVehicles[0].name);
      expect(textContent).toContain(mockVehicles[0].model);
      expect(textContent).toContain(mockVehicles[0].plate);

      expect(textContent).toContain(mockVehicles[1].name);
      expect(textContent).toContain(mockVehicles[1].model);
      expect(textContent).toContain(mockVehicles[1].plate);
    });

    it('should render edit and delete buttons for each vehicle', () => {
      (component.vehicles as any) = () => mockVehicles;
      fixture.detectChanges();

      const editButtons = fixture.nativeElement.querySelectorAll('app-edit-button');
      const deleteButtons = fixture.nativeElement.querySelectorAll('app-delete-button');

      expect(editButtons.length).toBe(mockVehicles.length);
      expect(deleteButtons.length).toBe(mockVehicles.length);
    });
  });

  describe('actions', () => {
    it('should call vehicleModal.openEdit when edit button emits edit', () => {
      (component.vehicles as any) = () => mockVehicles;
      (component.vehicleModal as any) = () => mockVehicleModal;
      fixture.detectChanges();

      const editButton = fixture.nativeElement.querySelector('app-edit-button');
      editButton.dispatchEvent(new CustomEvent('edit', { detail: mockVehicles[0] }));

      expect(mockVehicleModal.openEdit).toHaveBeenCalledWith(mockVehicles[0]);
    });

    it('should emit deleteVehicle when delete button emits delete', () => {
      (component.vehicles as any) = () => mockVehicles;
      fixture.detectChanges();

      spyOn(component.deleteVehicle, 'emit');

      const deleteButton = fixture.nativeElement.querySelector('app-delete-button');
      deleteButton.dispatchEvent(new CustomEvent('delete', { detail: mockVehicles[0] }));

      expect(component.deleteVehicle.emit).toHaveBeenCalledWith(mockVehicles[0]);
    });
  });

  describe('@for tracking', () => {
    it('should track rows by vehicle plate', () => {
      (component.vehicles as any) = () => mockVehicles;
      fixture.detectChanges();

      const rowsBefore = fixture.nativeElement.querySelectorAll('tbody tr');
      (component.vehicles as any) = () => [mockVehicles[1], mockVehicles[0]];
      fixture.detectChanges();

      const rowsAfter = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rowsAfter.length).toBe(rowsBefore.length);
    });

  });

});
