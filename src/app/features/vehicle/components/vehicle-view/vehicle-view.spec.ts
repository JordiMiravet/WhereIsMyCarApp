import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { VehicleInterface } from '../../interfaces/vehicle';
import { VehicleViewComponent } from './vehicle-view';
import { VehicleService } from '../../services/vehicle-service/vehicle-service';
import { VehicleModalService } from '../../services/vehicle-modal-service/vehicle-modal-service';
import { GeolocationService } from '../../../../shared/services/geolocation/geolocation-service';

const vehicleServiceMock = {
  vehicles: signal<VehicleInterface[]>([]),
  loadVehicles: jasmine.createSpy('loadVehicles'),
  addVehicles: jasmine.createSpy('addVehicles'),
  updateVehicle: jasmine.createSpy('updateVehicle'),
  deleteVehicle: jasmine.createSpy('deleteVehicle')
};

const VehicleModalServiceMock = {
  isOpen: signal(false),
  mode: signal<'create' | 'edit'>('create'),
  selectedVehicle: signal<VehicleInterface | null>(null),
  openCreate: jasmine.createSpy('openCreate'),
  close: jasmine.createSpy('close')
};

const geolocationServiceMock = {
  getCurrentLocation: jasmine.createSpy('getCurrentLocation')
};
/*
describe('VehicleViewComponent', () => {
  let component: VehicleViewComponent;
  let fixture: ComponentFixture<VehicleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleViewComponent],
      providers: [
        { provide: VehicleService, useValue: vehicleServiceMock },
        { provide: VehicleModalService, useValue: VehicleModalServiceMock },
        { provide: GeolocationService, useValue: geolocationServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component creation', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  });

  describe('Initial state', () => {

    it('should expose the vehicle list from VehicleService', () => {
      expect(component.vehicleList).toBe(vehicleServiceMock.vehicles);
    });

    it('should have confirm delete modal closed by default', () => {
      expect(component.isConfirmDeleteOpen()).toBe(false);
    });

    it('should have no vehicle selected for deletion by default', () => {
      expect(component.vehicleToDelete()).toBe(null);
    });

  });

  describe('Save vehicle', () => {

    it('should keep provided location when vehicle already has location', async () => {
      const vehicleMock: VehicleInterface = {
        name: 'Ferrari',
        model: 'F8',
        plate: '12345XC',
        location: { lat: 10, lng: 20 }
      };

      geolocationServiceMock.getCurrentLocation.calls.reset();
      await component.saveVehicle(vehicleMock);

      expect(geolocationServiceMock.getCurrentLocation).not.toHaveBeenCalled();
    });

    it('should request geolocation when vehicle has no location', async () => {
      vehicleServiceMock.addVehicles.calls.reset();
      geolocationServiceMock.getCurrentLocation.calls.reset();

      VehicleModalServiceMock.mode.set('create');
      VehicleModalServiceMock.selectedVehicle.set(null)

      const vehicleMock: VehicleInterface = {
        name: 'Porsche',
        model: '911 turbo',
        plate: '56789XD',
      };
      geolocationServiceMock.getCurrentLocation.and.returnValue(Promise.resolve([50, 60]));
      vehicleServiceMock.addVehicles.calls.reset();

      await component.saveVehicle(vehicleMock);

      expect(geolocationServiceMock.getCurrentLocation).toHaveBeenCalled();
      expect(vehicleServiceMock.addVehicles).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: 'Porsche',
          model: '911 turbo',
          plate: '56789XD',
          location: { lat: 50, lng: 60 }
        })
      );
    });

    it('should use fallback location when geolocation fails', async () => {
      vehicleServiceMock.addVehicles.calls.reset();
      
      const vehicleWithoutLocation: VehicleInterface = {
        name: 'Nissan',
        model: 'Skyline R34',
        plate: '99999XX'
      };

      geolocationServiceMock.getCurrentLocation.and.returnValue(Promise.reject('Location error'));
      await component.saveVehicle(vehicleWithoutLocation);

      expect(vehicleServiceMock.addVehicles).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: 'Nissan',
          model: 'Skyline R34',
          plate: '99999XX',
          location: { lat: 41.402, lng: 2.194 }
        })
      );
    });

    it('should add vehicle when modal mode is create', async () => {
      const vehicle: VehicleInterface = {
        name: 'Pagani',
        model: 'Huayra',
        plate: '11111A',
      };

      VehicleModalServiceMock.mode.set('create');

      await component.saveVehicle(vehicle);

      expect(vehicleServiceMock.addVehicles).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: 'Pagani',
          model: 'Huayra',
          plate: '11111A'
        })
      );
    });

    it('should update vehicle when modal mode is edit and vehicle is selected', async () => {
      const vehicle: VehicleInterface = {
        name: 'Bugatti',
        model: 'Le Voltuire Noir',
        plate: '2222BBB'
      };
      VehicleModalServiceMock.mode.set('edit');

      const selectedVehicle: VehicleInterface = {
        name: 'Old Car',
        model: 'Model A',
        plate: '1111AAA'
      };
      VehicleModalServiceMock.selectedVehicle.set(selectedVehicle);

      await component.saveVehicle(vehicle);

      expect(vehicleServiceMock.updateVehicle).toHaveBeenCalledWith(
        selectedVehicle,
        jasmine.objectContaining({
          name: 'Bugatti',
          model: 'Le Voltuire Noir',
          plate: '2222BBB'
        })
      );
    });

    it('should close the vehicle modal after saving', async () => {
      const vehicle: VehicleInterface = {
        name: 'Car',
        model: 'Model C',
        plate: '3333CCC'
      };
      VehicleModalServiceMock.mode.set('create');
      await component.saveVehicle(vehicle);

      expect(VehicleModalServiceMock.close).toHaveBeenCalled();
    });

  });

  describe('Delete confirmation', () => {

    it('should open confirm delete modal with selected vehicle', () => {
      const vehicle: VehicleInterface = {
        name: 'Maserati',
        model: 'MC20',
        plate: 'MC2026'
      };

      component.openConfirmDelete(vehicle);

      expect(component.vehicleToDelete()).toBe(vehicle);
      expect(component.isConfirmDeleteOpen()).toBe(true);
    });

    it('should delete vehicle when confirmed and vehicle exists', () => {
      const vehicle: VehicleInterface = {
        name: 'Lamborghini',
        model: 'Aventador',
        plate: 'LMB2026'
      };

      component.vehicleToDelete.set(vehicle);
      component.confirmDeleteVehicle();

      expect(vehicleServiceMock.deleteVehicle).toHaveBeenCalledWith(vehicle);
      expect(component.isConfirmDeleteOpen()).toBe(false);
      expect(component.vehicleToDelete()).toBeNull();
    });

    it('should not delete vehicle when confirmed without a vehicle', () => {
      component.vehicleToDelete.set(null);
      vehicleServiceMock.deleteVehicle.calls.reset();
      component.confirmDeleteVehicle();

      expect(vehicleServiceMock.deleteVehicle).not.toHaveBeenCalled();
      expect(component.isConfirmDeleteOpen()).toBe(false);
      expect(component.vehicleToDelete()).toBeNull();
    });

    it('should close confirm modal after delete confirmation', () => {
      const vehicle: VehicleInterface = {
        name: 'Nissan',
        model: 'Silvia S15',
        plate: 'DRFTS15'
      };

      component.vehicleToDelete.set(vehicle);
      component.confirmDeleteVehicle();

      expect(component.isConfirmDeleteOpen()).toBe(false);
      expect(component.vehicleToDelete()).toBeNull();
    });

  });

  describe('Template rendering', () => {

    it('should render vehicle table when vehicle list is not empty', () => {
      vehicleServiceMock.vehicles.set([
        { name: 'Nissan', model: 'Silvia S15', plate: 'DRFTS15' },
        { name: 'Mazda', model: 'RX-7 FD', plate: 'RX7FD' }
      ]);

      fixture.detectChanges();

      const tableElement = fixture.nativeElement.querySelector('app-vehicle-table');
      expect(tableElement).toBeTruthy();
    });

    it('should render empty state when vehicle list is empty', () => {
      vehicleServiceMock.vehicles.set([]);
      fixture.detectChanges();

      const emptyStateElement = fixture.nativeElement.querySelector('app-vehicle-empty-state');
      expect(emptyStateElement).toBeTruthy();
    });

    it('should open create modal when create button emits event', () => {
      const createButton: HTMLElement = fixture.nativeElement.querySelector('app-create-button');
      createButton.dispatchEvent(new Event('create'));

      expect(VehicleModalServiceMock.openCreate).toHaveBeenCalled();
    });

    it('should render vehicle form modal when vehicle modal is open', () => {
      VehicleModalServiceMock.isOpen.set(true);
      fixture.detectChanges();

      const formModalElement = fixture.nativeElement.querySelector('app-vehicle-form-modal');
      expect(formModalElement).toBeTruthy();
    });

    it('should render confirm modal when delete confirmation is open', () => {
      component.isConfirmDeleteOpen.set(true);
      fixture.detectChanges();

      const confirmModalElement = fixture.nativeElement.querySelector('app-confirm-modal');
      expect(confirmModalElement).toBeTruthy();
    });

  });

});
*/