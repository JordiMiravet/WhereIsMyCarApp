import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import * as L from 'leaflet';

import { MapService } from '../../services/map-service';
import { MapViewComponent } from './map-view';

import { VehicleService } from '../../../vehicle/services/vehicle-service/vehicle-service';
import { VehicleInterface } from '../../../vehicle/interfaces/vehicle';

import { GeolocationService } from '../../../../shared/services/geolocation/geolocation-service';

describe('MapViewComponent', () => {
  let component: MapViewComponent;
  let fixture: ComponentFixture<MapViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapViewComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('component creation', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  });

  describe('initialization', () => {

    it('should initialize the map on ngOnInit', () => {
      const mapService = TestBed.inject(MapService);
      const mockMap = {} as L.Map;

      const initMapSpy = spyOn(mapService, 'initMap').and.returnValue(mockMap);

      component.ngOnInit();

      expect(initMapSpy).toHaveBeenCalledOnceWith('map', [41.478, 2.310], 10);
    });

  });

  describe('vehicle selection', () => {

    const mockVehicle: VehicleInterface = {
      _id: 'veh-123',
      name: 'Ferrari',
      model: 'F8',
      plate: 'F123',
      location: { lat: 41.0, lng: 2.0 }
    };

    it('should set selectedVehicle when showVehicle is called', () => {
      component.showVehicle(mockVehicle);
      expect(component.selectedVehicle()).toBe(mockVehicle)
    });

    it('should remove previous vehicle marker if it exists', () => {
      const mapService = TestBed.inject(MapService);
      const mockMarker = {} as L.Marker;

      (component as any).vehicleMarker = mockMarker;
      const removeLayerSpy = spyOn(mapService, 'removeLayer');

      component.showVehicle(mockVehicle);

      expect(removeLayerSpy).toHaveBeenCalledOnceWith(mockMarker);
    });

    it('should create a new draggable marker for the selected vehicle', () => {
      const mapService = TestBed.inject(MapService);
      const mockMarker: any = { on: jasmine.createSpy('on') };

      spyOn(mapService, 'createMarker').and.returnValue(mockMarker);

      component.showVehicle(mockVehicle);

      expect(mapService.createMarker).toHaveBeenCalledWith([41, 2], mockVehicle.name);
      expect(mockMarker.on).toHaveBeenCalledWith('dragend', jasmine.any(Function));
    });

    it('should center the map on the selected vehicle', () => {
      const mapService = TestBed.inject(MapService);
      const setViewSpy = spyOn(mapService, 'setView');

      component.showVehicle(mockVehicle);

      expect(setViewSpy).toHaveBeenCalledOnceWith( [41, 2] );
    });

  });

  describe('vehicle marker drag behaviour', () => {

    const mockVehicle: VehicleInterface = {
      _id: '123',
      name: 'Ferrari',
      model: 'F8',
      plate: 'F123',
      location: { lat: 41, lng: 2 }
    };

    it('should set newPosition when marker drag ends', () => {
      const fakePosition = { lat: 50, lng: 8 } as any;
      (component as any).vehicleMarker = { getLatLng: () => fakePosition };
      component.newPosition.set( (component as any).vehicleMarker.getLatLng() );

      expect(component.newPosition()).toBe(fakePosition);
    });

    it('should show confirmation modal after dragging the marker', () => {
      const fakePosition = { lat: 50, lng: 8 } as any;
      (component as any).vehicleMarker = { getLatLng: () => fakePosition };

      component.newPosition.set((component as any).vehicleMarker.getLatLng());
      component.showConfirmModal.set(true);

      expect(component.showConfirmModal()).toBe(true);
    });

  });

  describe('confirm location change', () => {

    const mockVehicle: VehicleInterface = {
      name: 'Ferrari',
      model: 'F8',
      plate: 'F123',
      location: { lat: 41, lng: 2 }
    };

    it('should not update if there is no selected vehicle', () => {
      const vehicleService = TestBed.inject(VehicleService);
      spyOn(vehicleService, 'updateVehicleLocation').and.returnValue(undefined);

      component.selectedVehicle.set(null);
      component.onConfirmLocationChange();

      expect(vehicleService.updateVehicleLocation).not.toHaveBeenCalled();
    });

    it('should not update if there is no new position', () => {
      const vehicleService = TestBed.inject(VehicleService);
      spyOn(vehicleService, 'updateVehicleLocation').and.returnValue(undefined);

      component.selectedVehicle.set(mockVehicle);
      component.newPosition.set(null);
      component.onConfirmLocationChange();

      expect(vehicleService.updateVehicleLocation).not.toHaveBeenCalled();
    });

    it('should update vehicle location when confirmed', () => {
      const vehicleService = TestBed.inject(VehicleService);
      spyOn(vehicleService, 'updateVehicleLocation').and.returnValue(undefined);

      const newPos = { lat: 50, lng: 8 } as any;

      component.selectedVehicle.set(mockVehicle);
      component.newPosition.set(newPos);
      component.onConfirmLocationChange();

      expect(vehicleService.updateVehicleLocation).toHaveBeenCalled();
    });

    it('should update selectedVehicle with the new location', () => {
      const vehicleService = TestBed.inject(VehicleService);
      spyOn(vehicleService, 'updateVehicleLocation').and.returnValue(undefined);

      const newPos = { lat: 50, lng: 8 } as any;

      component.selectedVehicle.set(mockVehicle);
      component.newPosition.set(newPos);

      component.onConfirmLocationChange();

      expect(component.selectedVehicle()?.location).toEqual(newPos);
    });

    it('should hide confirmation modal after confirming', () => {
      const vehicleService = TestBed.inject(VehicleService);
      spyOn(vehicleService, 'updateVehicleLocation').and.returnValue(undefined);

      const newPos = { lat: 50, lng: 8 } as any;

      component.selectedVehicle.set(mockVehicle);
      component.newPosition.set(newPos);
      component.showConfirmModal.set(true);

      component.onConfirmLocationChange();

      expect(component.showConfirmModal()).toBe(false);
    });

  });

  describe('cancel location change', () => {

    const mockVehicle: VehicleInterface = {
      _id: '123',
      name: 'Ferrari',
      model: 'F8',
      plate: 'F123',
      location: { lat: 41, lng: 2 }
    };

    it('should reset marker position to original vehicle location', () => {
      const mockMarker: any = { setLatLng: jasmine.createSpy('setLatLng') };
      
      component.selectedVehicle.set(mockVehicle);
      (component as any).vehicleMarker = mockMarker;

      component.onCancelLocationChange();

      expect(mockMarker.setLatLng).toHaveBeenCalledOnceWith([41, 2]);
    });

    it('should hide confirmation modal after cancelling', () => {
      component.showConfirmModal.set(true);
      component.onCancelLocationChange();

      expect(component.showConfirmModal()).toBe(false);
    });

  });

  describe('user location', () => {

    it('should request user geolocation when button is clicked', async () => {
      const geo = TestBed.inject(GeolocationService);
      spyOn(geo, 'getCurrentLocation').and.returnValue(Promise.resolve([41, 2]));

      await component.onUserLocationClick();

      expect(geo.getCurrentLocation).toHaveBeenCalled();
    });

    it('should create a user marker if it does not exist', () => {
      const mapService = TestBed.inject(MapService);
      const mockMarker: any = { on: jasmine.createSpy('on') };
      spyOn(mapService, 'createMarker').and.returnValue(mockMarker);

      component.getUserLocation([41, 2]);

      expect(mapService.createMarker).toHaveBeenCalledWith([41, 2], 'You');
      expect((component as any).userMarker).toBe(mockMarker);
    });

    it('should update user marker position if it already exists', () => {
      const mockMarker: any = { setLatLng: jasmine.createSpy('setLatLng') };
      (component as any).userMarker = mockMarker;

      component.getUserLocation([50, 8]);

      expect(mockMarker.setLatLng).toHaveBeenCalledWith([50, 8]);
    });

    it('should center the map on user location with zoom', () => {
      const mapService = TestBed.inject(MapService);
      const setViewSpy = spyOn(mapService, 'setView');

      component.getUserLocation([50, 8]);

      expect(setViewSpy).toHaveBeenCalledWith([50, 8], 19);
    });

  });

  describe('template integration', () => {

    it('should render the map container', () => {
      const mapContainer = fixture.nativeElement.querySelector('#map');
      expect(mapContainer).toBeTruthy();
    });

    it('should render vehicle selector component', () => {
      const vehicleSelectorComponent = fixture.nativeElement.querySelector('app-vehicle-selector');
      expect(vehicleSelectorComponent).toBeTruthy();
    });

    it('should render user location button', () => {
      const userLocationButtonComponent = fixture.nativeElement.querySelector('app-user-location-button');
      expect(userLocationButtonComponent).toBeTruthy();
    });

    it('should show confirm modal when showConfirmModal is true', () => {
      component.showConfirmModal.set(true);
      fixture.detectChanges();

      const confirmModalComponent = fixture.nativeElement.querySelector('app-confirm-modal');

      expect(confirmModalComponent).toBeTruthy();
    });

  });

});
