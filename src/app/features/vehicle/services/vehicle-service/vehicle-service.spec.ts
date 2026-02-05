import { TestBed } from '@angular/core/testing';

import { VehicleService } from './vehicle-service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { VehicleInterface } from '../../interfaces/vehicle';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ 
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(VehicleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  describe('Service creation', () => {

    it('should be created', () => {
      expect(service).toBeTruthy()
    });

  });

  describe('Initial state', () => {

    it('should initialize vehicles signal as empty array', () => {
      expect(service.vehicles()).toEqual([]);
    });

  });

  describe('loadVehicles', () => {

    it('should call GET /vehicles endpoint', () => {
      service.loadVehicles();

      const req = httpMock.expectOne('http://localhost:3000/vehicles');

      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should update vehicles signal with response data', () => {
      const vehiclesMock = [
        { 
          _id: '1',
          name: 'Ferrari', 
          model: 'F8 Tributo', 
          plate: 'F123', 
          location: { 
            lat: 41.0, 
            lng: 2.0 
          } 
        },
        { 
          _id: '2',
          name: 'Pagani', 
          model: 'Huayra', 
          plate: 'P456', 
          location: { 
            lat: 42.0, 
            lng: 3.0 
          } 
        }
      ] as VehicleInterface[];

      service.loadVehicles();

      const req = httpMock.expectOne('http://localhost:3000/vehicles');
      expect(req.request.method).toBe('GET');

      req.flush(vehiclesMock);

      expect(service.vehicles()).toEqual(vehiclesMock)

    });

    it('should not modify vehicles when request fails', () => {
      const vehiclesMock = [
        { 
          _id: '1',
          name: 'Ferrari', 
          model: 'F8 Tributo', 
          plate: 'F123', 
          location: { 
            lat: 41.0, 
            lng: 2.0 
          } 
        },
        { 
          _id: '2',
          name: 'Pagani', 
          model: 'Huayra', 
          plate: 'P456', 
          location: { 
            lat: 42.0, 
            lng: 3.0 
          } 
        }
      ] as VehicleInterface[];

      service.vehicles.set(vehiclesMock);
      service.loadVehicles();

      const req = httpMock.expectOne('http://localhost:3000/vehicles');

      req.flush(
        { message: 'Server error' },
        { status: 500, statusText: 'Internal Server Error' }
      );

      expect(service.vehicles()).toEqual(vehiclesMock);
    });

  });

  describe('addVehicles', () => {

    it('should call POST /vehicles endpoint with vehicle payload', () => {
      const vehicle : VehicleInterface = { 
        _id: '1',
        name: 'Lamborghini', 
        model: 'Huracan', 
        plate: 'L456', 
        location: { 
          lat: 42, 
          lng: 3 
        } 
      }

      service.addVehicles(vehicle);

      const req = httpMock.expectOne('http://localhost:3000/vehicles');

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(vehicle);

      req.flush({ ...vehicle, _id: '1' });
    });

    it('should append created vehicle returned by backend to vehicles signal', () => {
      const vehicleList: VehicleInterface[] = [
        { 
          _id: '1',
          name: 'Lamborghini', 
          model: 'Huracan', 
          plate: 'L456', 
          location: { 
            lat: 42, 
            lng: 3 
          } 
        }
      ]
      service.vehicles.set(vehicleList);
      
      const newVehicle : VehicleInterface = { 
        name: 'Pagani', 
        model: 'Huayra', 
        plate: 'P456', 
        location: { 
          lat: 42.0, 
          lng: 3.0 
        } 
      }

      service.addVehicles(newVehicle);

      const req = httpMock.expectOne('http://localhost:3000/vehicles');

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newVehicle);

      const vehicleResponse : VehicleInterface = {
        ...newVehicle,
        _id: '2'
      }

      req.flush(vehicleResponse);

      expect(service.vehicles()).toEqual([
        ...vehicleList,
        vehicleResponse
      ])
      expect(service.vehicles().length).toBe(2);
    });

  });

  describe('updateVehicle', () => {

    it('should call PUT /vehicles/:id with updated vehicle data', () => {
      const vehicleList: VehicleInterface[] = [
        { 
          _id: '1',
          name: 'Lamborghini', 
          model: 'Huracan', 
          plate: 'L456', 
          location: { 
            lat: 42, 
            lng: 3 
          } 
        }
      ]
      service.vehicles.set(vehicleList);
      const oldVehicle = vehicleList[0];

      const updatedVehicle: VehicleInterface = {
        ...oldVehicle,
        model: 'Huracan EVO',
      }
      
      service.updateVehicle(oldVehicle, updatedVehicle);

      const req = httpMock.expectOne('http://localhost:3000/vehicles/1');

      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedVehicle);

      req.flush(updatedVehicle);
    });

    it('should replace updated vehicle in vehicles signal', () => {
      const vehiclesMock : VehicleInterface[] = [
        { 
          _id: '1',
          name: 'Ferrari', 
          model: 'F8 Tributo', 
          plate: 'F123', 
          location: { 
            lat: 41.0, 
            lng: 2.0 
          } 
        },
        { 
          _id: '2',
          name: 'Pagani', 
          model: 'Huayra', 
          plate: 'P456', 
          location: { 
            lat: 42.0, 
            lng: 3.0 
          } 
        }
      ];
      service.vehicles.set(vehiclesMock);

      const OldVehicle : VehicleInterface = vehiclesMock[0];

      const newVehicle : VehicleInterface = {
        ...OldVehicle,
        plate: '111X'
      }

      service.updateVehicle(OldVehicle, newVehicle);

      const req = httpMock.expectOne('http://localhost:3000/vehicles/1');

      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(newVehicle);

      req.flush(newVehicle);

      expect(service.vehicles()).toEqual([
        newVehicle,
        vehiclesMock[1],
      ]);
    });

  });

  describe('updateVehicleLocation', () => {

    it('should call PUT /vehicles/:id with location payload', () => {
      const vehicle : VehicleInterface = { 
        _id: '1',
        name: 'Ferrari', 
        model: 'F8 Tributo', 
        plate: 'F123', 
        location: { 
          lat: 41.0, 
          lng: 2.0 
        } 
      };
      service.vehicles.set([vehicle]);
      service.updateVehicleLocation(vehicle, { lat: 42.0, lng: 3.0} );

      const req = httpMock.expectOne('http://localhost:3000/vehicles/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ location: { lat: 42.0, lng: 3.0 } });

      req.flush({ ...vehicle, location: { lat: 42.0, lng: 3.0 }});

      expect(service.vehicles()[0].location).toEqual({ lat: 42.0, lng: 3.0 })
    });

    it('should update only the location of the vehicle in vehicles signal', () => {
      const vehicle : VehicleInterface = { 
        _id: '1',
        name: 'Ferrari', 
        model: 'F8 Tributo', 
        plate: 'F123', 
        location: { 
          lat: 41.0, 
          lng: 2.0 
        } 
      };
      service.vehicles.set([vehicle]);
      service.updateVehicleLocation(vehicle, { lat: 42.0, lng: 3.0 });

      const req = httpMock.expectOne('http://localhost:3000/vehicles/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ location: { lat: 42.0, lng: 3.0 } });

      req.flush({ ...vehicle, location: { lat: 42.0, lng: 3.0 } });

      expect(service.vehicles().length).toBe(1);
      expect(service.vehicles()[0]._id).toBe('1');
      expect(service.vehicles()[0].name).toBe('Ferrari');
    });

  });

  describe('deleteVehicle', () => {

    it('should call DELETE /vehicles/:id endpoint', () => {
      const vehicle : VehicleInterface = { 
        _id: '1',
        name: 'Ferrari', 
        model: 'F8 Tributo', 
        plate: 'F123', 
        location: { 
          lat: 41.0, 
          lng: 2.0 
        } 
      };
      service.vehicles.set([vehicle]);
      service.deleteVehicle(vehicle);

      const req = httpMock.expectOne('http://localhost:3000/vehicles/1');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toBeNull();

      req.flush(null);

      expect(service.vehicles()).toEqual([]); 
    });

    it('should remove deleted vehicle from vehicles signal', () => {
      const vehiclesMock : VehicleInterface[] = [
        { 
          _id: '1',
          name: 'Ferrari', 
          model: 'F8 Tributo', 
          plate: 'F123', 
          location: { 
            lat: 41.0, 
            lng: 2.0 
          } 
        },
        { 
          _id: '2',
          name: 'Pagani', 
          model: 'Huayra', 
          plate: 'P456', 
          location: { 
            lat: 42.0, 
            lng: 3.0 
          } 
        }
      ];

      service.vehicles.set(vehiclesMock)
      service.deleteVehicle(vehiclesMock[0]);

      const req = httpMock.expectOne('http://localhost:3000/vehicles/1');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toBeNull();

      req.flush(null);

      expect(service.vehicles().length).toBe(1);
      expect(service.vehicles()[0]._id).toBe('2');
      expect(service.vehicles()[0].name).toBe('Pagani');
    });

  });

});
