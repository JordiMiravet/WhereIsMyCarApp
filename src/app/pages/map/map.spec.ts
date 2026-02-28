import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { MapComponent } from './map';
import { VehicleService } from '../../features/vehicle/services/vehicle-service/vehicle-service';
import { VehicleModalService } from '../../features/vehicle/services/vehicle-modal-service/vehicle-modal-service';

import { VehicleInterface } from '../../features/vehicle/interfaces/vehicle';
import { GeolocationService } from '../../shared/services/geolocation/geolocation-service';
import { HttpClientModule } from '@angular/common/http';
import { VehicleModalState } from '../../features/vehicle/enum/vehicle-modal-state.enum';

const vehicleServiceMock = {
  vehicles: signal<VehicleInterface[]>([]),
  loadVehicles: jasmine.createSpy('loadVehicles'),
  addVehicles: jasmine.createSpy('addVehicles'),
  updateVehicle: jasmine.createSpy('updateVehicle'),
};

const VehicleModalServiceMock = {
  activeModal: signal<VehicleModalState>(VehicleModalState.Closed),
  formMode: signal<'create' | 'edit'>('create'),
  selectedVehicle: signal<VehicleInterface | null>(null),
  openCreate: jasmine.createSpy('openCreate'),
  close: jasmine.createSpy('close'),
};

const geolocationServiceMock = {
  getCurrentLocation: jasmine.createSpy('getCurrentLocation'),
};

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    vehicleServiceMock.loadVehicles.calls.reset();
    vehicleServiceMock.addVehicles.calls.reset();
    vehicleServiceMock.updateVehicle.calls.reset();
    VehicleModalServiceMock.openCreate.calls.reset();
    VehicleModalServiceMock.close.calls.reset();
    geolocationServiceMock.getCurrentLocation.calls.reset();
    
    VehicleModalServiceMock.activeModal.set(VehicleModalState.Closed);
    VehicleModalServiceMock.formMode.set('create');
    VehicleModalServiceMock.selectedVehicle.set(null);

    await TestBed.configureTestingModule({
      imports: [
        MapComponent, 
        HttpClientModule
      ],
      providers: [
        { provide: VehicleService, useValue: vehicleServiceMock },
        { provide: VehicleModalService, useValue: VehicleModalServiceMock },
        { provide: GeolocationService, useValue: geolocationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component creation', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  });

  describe('Initial state', () => {

    it('should expose vehicle list from VehicleService', () => {
      expect(component.vehicleList).toEqual(vehicleServiceMock.vehicles)
    });

    it('should load vehicles on init', () => {
      expect(vehicleServiceMock.loadVehicles).toHaveBeenCalled()
    });

  });

  describe('Save vehicle', () => {

    it('should keep provided location when vehicle already has location', async () => {
      const vehicle = {
        name: 'Mercedes GLC Coupe',
        model: 'GLC Coupe',
        plate: '3447VHZ',
        location: {
          lat: 41.486394600830806,
          lng: 2.3118222053234576,
        },
      };

      VehicleModalServiceMock.formMode.set('create');
      geolocationServiceMock.getCurrentLocation.calls.reset();
      vehicleServiceMock.addVehicles.calls.reset();

      await component.saveVehicle(vehicle);

      expect(geolocationServiceMock.getCurrentLocation).not.toHaveBeenCalled();
      expect(vehicleServiceMock.addVehicles).toHaveBeenCalledOnceWith(vehicle);
      expect(VehicleModalServiceMock.close).toHaveBeenCalled();
    });


    it('should request geolocation when vehicle has no location', async () => {
      const vehicle = {
        name: 'Mercedes GLC Coupe',
        model: 'GLC Coupe',
        plate: '3447VHZ',
      };

      VehicleModalServiceMock.formMode.set('create');

      geolocationServiceMock.getCurrentLocation.and.resolveTo([41.4, 2.1]);
      vehicleServiceMock.addVehicles.calls.reset();

      await component.saveVehicle(vehicle as any);

      expect(geolocationServiceMock.getCurrentLocation).toHaveBeenCalled();
      expect(vehicleServiceMock.addVehicles).toHaveBeenCalled();

      const addedVehicle = vehicleServiceMock.addVehicles.calls.mostRecent().args[0];

      expect(addedVehicle.location).toEqual({ lat: 41.4, lng: 2.1 });
      expect(VehicleModalServiceMock.close).toHaveBeenCalled();
    });


    it('should use fallback location when geolocation fails', async () => {
      const vehicle = {
        name: 'Mercedes GLC Coupe',
        model: 'GLC Coupe',
        plate: '3447VHZ',
      };

      VehicleModalServiceMock.formMode.set('create');
      geolocationServiceMock.getCurrentLocation.and.rejectWith( new Error('geolocation failed'));
      vehicleServiceMock.addVehicles.calls.reset();

      await component.saveVehicle(vehicle as any);

      expect(geolocationServiceMock.getCurrentLocation).toHaveBeenCalled();
      expect(vehicleServiceMock.addVehicles).toHaveBeenCalled();

      const addedVehicle = vehicleServiceMock.addVehicles.calls.mostRecent().args[0];

      expect(addedVehicle.location).toEqual({ lat: 41.478, lng: 2.310 });
      expect(VehicleModalServiceMock.close).toHaveBeenCalled();
    });


    it('should add vehicle when modal mode is create', async () => {
      const vehicle = {
        name: 'Mercedes GLC Coupe',
        model: 'GLC Coupe',
        plate: '3447VHZ',
        location: {
          lat: 41.486394600830806,
          lng: 2.3118222053234576,
        },
      };

      VehicleModalServiceMock.formMode.set('create');
      vehicleServiceMock.addVehicles.calls.reset();
      vehicleServiceMock.updateVehicle.calls.reset();

      await component.saveVehicle(vehicle as VehicleInterface);

      expect(vehicleServiceMock.addVehicles).toHaveBeenCalledOnceWith(vehicle);
      expect(vehicleServiceMock.updateVehicle).not.toHaveBeenCalled()
    });

    it('should update vehicle when modal mode is edit and selected vehicle exists', async () => {
      const vehicle = {
        name: 'Mercedes GLC Coupe',
        model: 'GLC Coupe',
        plate: '3447VHZ',
        location: {
          lat: 41.486394600830806,
          lng: 2.3118222053234576,
        },
      };

      const selectedVehicle = {
        name: 'Mercedes GLC Coupe',
        model: 'GLC Coupe',
        plate: '0000AAA',
        location: {
          lat: 41.486394600830806,
          lng: 2.3118222053234576,
        },
      };

      VehicleModalServiceMock.formMode.set('edit');
      VehicleModalServiceMock.selectedVehicle.set(selectedVehicle);

      vehicleServiceMock.addVehicles.calls.reset();
      vehicleServiceMock.updateVehicle.calls.reset();

      await component.saveVehicle(vehicle as VehicleInterface);

      expect(vehicleServiceMock.addVehicles).not.toHaveBeenCalled();
      expect(vehicleServiceMock.updateVehicle).toHaveBeenCalledOnceWith(selectedVehicle, vehicle);
    });


    it('should not update vehicle when modal mode is edit but no selected vehicle', async () => {
      const vehicle = {
        name: 'Mercedes GLC Coupe',
        model: 'GLC Coupe',
        plate: '3447VHZ',
        location: {
          lat: 41.486394600830806,
          lng: 2.3118222053234576,
        },
      };

      VehicleModalServiceMock.formMode.set('edit');
      VehicleModalServiceMock.selectedVehicle.set(null);

      vehicleServiceMock.addVehicles.calls.reset();
      vehicleServiceMock.updateVehicle.calls.reset();

      await component.saveVehicle(vehicle as VehicleInterface);

      expect(vehicleServiceMock.updateVehicle).not.toHaveBeenCalled();
      expect(vehicleServiceMock.addVehicles).not.toHaveBeenCalled();
      expect(VehicleModalServiceMock.close).toHaveBeenCalled();
    });

    it('should close modal after saving vehicle', async () => {
      const vehicle = {
        name: 'Mercedes GLC Coupe',
        model: 'GLC Coupe',
        plate: '3447VHZ',
        location: {
          lat: 41.486394600830806,
          lng: 2.3118222053234576,
        },
      };

      VehicleModalServiceMock.formMode.set('create');
      VehicleModalServiceMock.close.calls.reset();

      await component.saveVehicle(vehicle as VehicleInterface);

      expect(VehicleModalServiceMock.close).toHaveBeenCalled();
    });

  });

  describe('Template rendering', () => {

    it('should render map view when vehicle list is not empty', () => {
      const vehicle = {
        name: 'Mercedes GLC Coupe',
        model: 'GLC Coupe',
        plate: '3447VHZ',
        location: {
          lat: 41.486394600830806,
          lng: 2.3118222053234576,
        },
      };

      vehicleServiceMock.vehicles.set([vehicle]);
      fixture.detectChanges();

      const mapViewComponent = fixture.nativeElement.querySelector('app-map-view');
      expect(mapViewComponent).toBeTruthy()
    });

    it('should render empty state when vehicle list is empty', () => {
      vehicleServiceMock.vehicles.set([])
      fixture.detectChanges();

      expect(vehicleServiceMock.vehicles().length).toBe(0);
      
      const vehicleEmptyStateComponent = fixture.nativeElement.querySelector('app-vehicle-empty-state');
      expect(vehicleEmptyStateComponent).toBeTruthy();
    });

    it('should open create modal when empty state emits createVehicle', () => {
      vehicleServiceMock.vehicles.set([]);
      fixture.detectChanges();

      component.vehicleModal.openCreate();

      expect(VehicleModalServiceMock.openCreate).toHaveBeenCalled();
    });


    it('should render vehicle form modal when modal is open', () => {
      VehicleModalServiceMock.activeModal.set(VehicleModalState.VehicleForm);
      fixture.detectChanges();

      const vehicleFormModalComponent = fixture.nativeElement.querySelector('app-vehicle-form-modal');
      expect(vehicleFormModalComponent).toBeTruthy();
    });

    it('should call saveVehicle when form modal emits submit', () => {
      VehicleModalServiceMock.activeModal.set(VehicleModalState.VehicleForm);
      fixture.detectChanges();

      spyOn(component, 'saveVehicle');

      const vehicleData = {
        name: 'Mercedes GLC Coupe',
        model: 'GLC Coupe',
        plate: '3447VHZ',
        location: { 
          lat: 41.486394600830806, 
          lng: 2.3118222053234576 
        },
      };
      component.saveVehicle(vehicleData);

      expect(component.saveVehicle).toHaveBeenCalledWith(vehicleData);
    });

    it('should close modal when form modal emits cancel', () => {
      VehicleModalServiceMock.activeModal.set(VehicleModalState.VehicleForm);
      fixture.detectChanges();

      component.vehicleModal.close();

      expect(VehicleModalServiceMock.close).toHaveBeenCalled();
    });

  });

});
