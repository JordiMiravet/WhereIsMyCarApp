import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { VehicleInterface } from '../../interfaces/vehicle';
import { VehicleViewComponent } from './vehicle-view';
import { VehicleService } from '../../services/vehicle-service/vehicle-service';
import { VehicleModalService } from '../../services/vehicle-modal-service/vehicle-modal-service';
import { GeolocationService } from '../../../../shared/services/geolocation/geolocation-service';
import { VehicleModalState } from '../../enum/vehicle-modal-state.enum';


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
  activeModal: signal<VehicleModalState>(VehicleModalState.Closed),
  formMode: signal<'create' | 'edit'>('create'),
  openCreate: jasmine.createSpy('openCreate'),
  close: jasmine.createSpy('close'),
  openConfirmDelete: jasmine.createSpy('openConfirmDelete')
};

const geolocationServiceMock = {
  getCurrentLocation: jasmine.createSpy('getCurrentLocation')
};

describe('VehicleViewComponent', () => {
  let component: VehicleViewComponent;
  let fixture: ComponentFixture<VehicleViewComponent>;

  beforeEach(async () => {
    vehicleServiceMock.loadVehicles.calls.reset();
    vehicleServiceMock.addVehicles.calls.reset();
    vehicleServiceMock.updateVehicle.calls.reset();
    vehicleServiceMock.deleteVehicle.calls.reset();
    VehicleModalServiceMock.openCreate.calls.reset();
    VehicleModalServiceMock.close.calls.reset();
    VehicleModalServiceMock.openConfirmDelete.calls.reset();
    geolocationServiceMock.getCurrentLocation.calls.reset();
    
    VehicleModalServiceMock.selectedVehicle.set(null);
    VehicleModalServiceMock.formMode.set('create');
    VehicleModalServiceMock.activeModal.set(VehicleModalState.Closed);

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

    it('should call loadVehicles on init', () => {
      expect(vehicleServiceMock.loadVehicles).toHaveBeenCalled();
    });

    it('should expose VehicleModalState enum', () => {
      expect(component.VehicleModalState).toBe(VehicleModalState);
    });

    it('should have delete confirmation messages', () => {
      expect(component.messages.deleteConfirmation.title).toBe('Delete vehicle?');
      expect(component.messages.deleteConfirmation.message).toBe('Are you sure you want to delete this vehicle? This action cannot be undone.');
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

      VehicleModalServiceMock.formMode.set('create');
      geolocationServiceMock.getCurrentLocation.calls.reset();
      await component.saveVehicle(vehicleMock);

      expect(geolocationServiceMock.getCurrentLocation).not.toHaveBeenCalled();
    });

    it('should get geolocation when creating vehicle without location', async () => {
      const vehicleMock: VehicleInterface = {
        name: 'Ferrari',
        model: 'F8',
        plate: '12345XC'
      };

      VehicleModalServiceMock.formMode.set('create');
      geolocationServiceMock.getCurrentLocation.and.returnValue(Promise.resolve([41.5, 2.3]));

      await component.saveVehicle(vehicleMock);

      expect(geolocationServiceMock.getCurrentLocation).toHaveBeenCalled();
      expect(vehicleServiceMock.addVehicles).toHaveBeenCalledWith({
        name: 'Ferrari',
        model: 'F8',
        plate: '12345XC',
        location: { lat: 41.5, lng: 2.3 }
      });
    });

    it('should use fallback location when geolocation fails on create', async () => {
      const vehicleMock: VehicleInterface = {
        name: 'Ferrari',
        model: 'F8',
        plate: '12345XC'
      };

      VehicleModalServiceMock.formMode.set('create');
      geolocationServiceMock.getCurrentLocation.and.returnValue(Promise.reject('error'));

      await component.saveVehicle(vehicleMock);

      expect(vehicleServiceMock.addVehicles).toHaveBeenCalledWith({
        name: 'Ferrari',
        model: 'F8',
        plate: '12345XC',
        location: { lat: 41.402, lng: 2.194 }
      });
    });

    it('should call addVehicles when mode is create', async () => {
      const vehicleMock: VehicleInterface = {
        name: 'Ferrari',
        model: 'F8',
        plate: '12345XC',
        location: { lat: 10, lng: 20 }
      };

      VehicleModalServiceMock.formMode.set('create');
      await component.saveVehicle(vehicleMock);

      expect(vehicleServiceMock.addVehicles).toHaveBeenCalledWith(vehicleMock);
    });

    it('should call updateVehicle when mode is edit', async () => {
      const originalVehicle: VehicleInterface = {
        _id: '123',
        name: 'Ferrari',
        model: 'F8',
        plate: '12345XC',
        location: { lat: 10, lng: 20 }
      };

      const updatedData: VehicleInterface = {
        name: 'Lamborghini',
        model: 'Aventador',
        plate: '54321AB'
      };

      VehicleModalServiceMock.formMode.set('edit');
      VehicleModalServiceMock.selectedVehicle.set(originalVehicle);

      await component.saveVehicle(updatedData);

      expect(vehicleServiceMock.updateVehicle).toHaveBeenCalledWith(originalVehicle, {
        name: 'Lamborghini',
        model: 'Aventador',
        plate: '54321AB',
        location: { lat: 10, lng: 20 }
      });
    });

    it('should preserve original location when editing', async () => {
      const originalVehicle: VehicleInterface = {
        _id: '123',
        name: 'Ferrari',
        model: 'F8',
        plate: '12345XC',
        location: { lat: 10, lng: 20 }
      };

      const updatedData: VehicleInterface = {
        name: 'Ferrari',
        model: 'F8 Tributo',
        plate: '12345XC'
      };

      VehicleModalServiceMock.formMode.set('edit');
      VehicleModalServiceMock.selectedVehicle.set(originalVehicle);

      await component.saveVehicle(updatedData);

      const callArgs = vehicleServiceMock.updateVehicle.calls.mostRecent().args;
      expect(callArgs[1].location).toEqual({ lat: 10, lng: 20 });
    });

    it('should not update vehicle if no original vehicle is selected', async () => {
      const updatedData: VehicleInterface = {
        name: 'Ferrari',
        model: 'F8',
        plate: '12345XC'
      };

      VehicleModalServiceMock.formMode.set('edit');
      VehicleModalServiceMock.selectedVehicle.set(null);

      await component.saveVehicle(updatedData);

      expect(vehicleServiceMock.updateVehicle).not.toHaveBeenCalled();
    });

    it('should close the vehicle modal after saving', async () => {
      const vehicle: VehicleInterface = {
        name: 'Ferrari',
        model: '488',
        plate: '3333CCC'
      };
      VehicleModalServiceMock.formMode.set('create');
      await component.saveVehicle(vehicle);

      expect(VehicleModalServiceMock.close).toHaveBeenCalled();
    });
  });

  describe('Delete vehicle', () => {
    it('should delete vehicle when confirmed', () => {
      const vehicleMock: VehicleInterface = {
        _id: '123',
        name: 'Ferrari',
        model: 'F8',
        plate: '12345XC',
        location: { lat: 10, lng: 20 }
      };

      VehicleModalServiceMock.selectedVehicle.set(vehicleMock);

      component.confirmDeleteVehicle();

      expect(vehicleServiceMock.deleteVehicle).toHaveBeenCalledWith(vehicleMock);
    });

    it('should not delete if no vehicle is selected', () => {
      VehicleModalServiceMock.selectedVehicle.set(null);

      component.confirmDeleteVehicle();

      expect(vehicleServiceMock.deleteVehicle).not.toHaveBeenCalled();
    });

    it('should close modal after deleting', () => {
      const vehicleMock: VehicleInterface = {
        _id: '123',
        name: 'Ferrari',
        model: 'F8',
        plate: '12345XC'
      };

      VehicleModalServiceMock.selectedVehicle.set(vehicleMock);

      component.confirmDeleteVehicle();

      expect(VehicleModalServiceMock.close).toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {

    it('should render vehicle table when vehicle list is not empty', () => {
      vehicleServiceMock.vehicles.set([ 
        { name: 'Lamborghini', model: 'Aventador', plate: 'LMB2026' },
        { name: 'Ferrari', model: 'F8 Tributo', plate: 'F8X2019' }
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
      VehicleModalServiceMock.activeModal.set(VehicleModalState.VehicleForm);

      fixture.detectChanges();

      const formModalElement = fixture.nativeElement.querySelector('app-vehicle-form-modal');
      expect(formModalElement).toBeTruthy();
    });

    it('should render confirm delete modal when delete modal is open', () => {
      VehicleModalServiceMock.activeModal.set(VehicleModalState.ConfirmDelete);

      fixture.detectChanges();

      const confirmModalElement = fixture.nativeElement.querySelector('app-confirm-modal');
      expect(confirmModalElement).toBeTruthy();
    });
  });
});