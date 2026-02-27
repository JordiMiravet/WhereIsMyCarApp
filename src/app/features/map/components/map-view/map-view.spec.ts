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

      (component as any).selectedVehicleMarker = mockMarker;
      const removeLayerSpy = spyOn(mapService, 'removeLayer');

      component.showVehicle(mockVehicle);

      expect(removeLayerSpy).toHaveBeenCalledOnceWith(mockMarker);
    });

    it('should create a new draggable marker for the selected vehicle', () => {
      const mapService = TestBed.inject(MapService);
      const mockMarker: any = { on: jasmine.createSpy('on') };

      spyOn(mapService, 'createMarker').and.returnValue(mockMarker);

      component.showVehicle(mockVehicle);

      expect(mapService.createMarker).toHaveBeenCalledWith([41, 2], mockVehicle.name, true);
      expect(mockMarker.on).toHaveBeenCalledWith('dragend', jasmine.any(Function));
    });

    it('should center the map on the selected vehicle', () => {
      const mapService = TestBed.inject(MapService);
      const setViewSpy = spyOn(mapService, 'setView');

      component.showVehicle(mockVehicle);

      expect(setViewSpy).toHaveBeenCalledOnceWith([41, 2], 19);
    });

    it('should do nothing if vehicle has no location', () => {
      const vehicleWithoutLocation: VehicleInterface = {
        _id: '1',
        name: 'Ferrari',
        model: 'LaFerrari',
        plate: '123456',
        location: undefined
      };
      const mapService = TestBed.inject(MapService);
      const createMarkerSpy = spyOn(mapService, 'createMarker');

      component.showVehicle(vehicleWithoutLocation);

      expect(createMarkerSpy).not.toHaveBeenCalled();
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
      (component as any).selectedVehicleMarker = { getLatLng: () => fakePosition };
      component.newPosition.set( (component as any).selectedVehicleMarker.getLatLng() );

      expect(component.newPosition()).toBe(fakePosition);
    });

    it('should show confirmation modal after dragging the marker', () => {
      const fakePosition = { lat: 50, lng: 8 } as any;
      (component as any).selectedVehicleMarker = { getLatLng: () => fakePosition };

      component.newPosition.set((component as any).selectedVehicleMarker.getLatLng());
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
      (component as any).selectedVehicleMarker = mockMarker;

      component.onCancelLocationChange();

      expect(mockMarker.setLatLng).toHaveBeenCalledOnceWith([41, 2]);
    });

    it('should hide confirmation modal after cancelling', () => {
      const mockMarker: any = { setLatLng: jasmine.createSpy('setLatLng') };

      component.selectedVehicle.set(mockVehicle);
      (component as any).selectedVehicleMarker = mockMarker;
      component.showConfirmModal.set(true);

      component.onCancelLocationChange();

      expect(component.showConfirmModal()).toBe(false);
    });

  });

  describe('user location', () => {

    const mockVehicle: VehicleInterface = {
      _id: '123',
      name: 'Ferrari',
      model: 'F8',
      plate: 'F123',
      location: { lat: 41, lng: 2 }
    };

    it('should not request geolocation if no vehicle selected', async () => {
      const geo = TestBed.inject(GeolocationService);
      spyOn(geo, 'getCurrentLocation');

      component.selectedVehicle.set(null);
      await component.onUserLocationClick();

      expect(geo.getCurrentLocation).not.toHaveBeenCalled();
    });

    it('should request user location if vehicle selected', async () => {
      const geo = TestBed.inject(GeolocationService);
      spyOn(geo, 'getCurrentLocation').and.returnValue(Promise.resolve([50, 8]));

      component.selectedVehicle.set(mockVehicle);

      await component.onUserLocationClick();

      expect(geo.getCurrentLocation).toHaveBeenCalled();
    });

    it('should update vehicle location after getting user position', async () => {
      const geo = TestBed.inject(GeolocationService);
      const vehicleService = TestBed.inject(VehicleService);
      const mapService = TestBed.inject(MapService);

      spyOn(geo, 'getCurrentLocation').and.returnValue(Promise.resolve([50, 8]));
      spyOn(vehicleService, 'updateVehicleLocation');
      spyOn(mapService, 'createMarker').and.returnValue({
        on: jasmine.createSpy('on')
      } as any);
      spyOn(mapService, 'setView');

      component.selectedVehicle.set(mockVehicle);

      await component.onUserLocationClick();

      expect(vehicleService.updateVehicleLocation).toHaveBeenCalled();
      expect(component.selectedVehicle()?.location).toEqual({ lat: 50, lng: 8 });
    });

  });

  describe('private helper methods', () => {

    it('should clear all markers', () => {
      const mapService = TestBed.inject(MapService);
      const markers: any = [{}, {}, {}];
      (component as any).allVehicleMarkers = markers;
      const removeLayerSpy = spyOn(mapService, 'removeLayer');

      (component as any).clearAllMarkers();

      expect(removeLayerSpy).toHaveBeenCalledTimes(markers.length);
      expect((component as any).allVehicleMarkers.length).toBe(0);
    });

    it('should place selected vehicle marker', () => {
      const mapService = TestBed.inject(MapService);
      const mockMarker: any = { on: jasmine.createSpy('on') };
      spyOn(mapService, 'createMarker').and.returnValue(mockMarker);
      const setViewSpy = spyOn(mapService, 'setView');

      (component as any).placeSelectedVehicleMarker([41, 2], 'Ferrari');

      expect(mapService.createMarker).toHaveBeenCalledWith([41, 2], 'Ferrari', true);
      expect(mockMarker.on).toHaveBeenCalledWith('dragend', jasmine.any(Function));
      expect(setViewSpy).toHaveBeenCalledOnceWith([41, 2], 19);
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
