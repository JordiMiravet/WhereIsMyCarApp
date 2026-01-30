import { TestBed } from '@angular/core/testing';
import { VehicleModalStateService } from './vehicle-modal-state-service';
import { VehicleInterface } from '../../interfaces/vehicle';

describe('VehicleModalStateService', () => {
  let service: VehicleModalStateService;

  const mockVehicle : VehicleInterface = {
    name: 'Ferrari',
    model: 'F8 Tributo',
    plate: '4558XKJ',
    location: {
      lat: 41.48644688584013, 
      lng: 2.3107555554463137
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleModalStateService);
  });

  describe('service creation', () => {

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

  });

  describe('initial state', () => {
    it('should initialize isOpen as false', () => {
      expect(service.isOpen()).toBe(false);
    });

    it('should initialize mode as "create"', () => {
      expect(service.mode()).toBe('create');
    });

    it('should initialize selectedVehicle as null', () => {
      expect(service.selectedVehicle()).toBe(null);
    });
  });

  describe('openCreate behavior', () => {
    it('should open modal in create mode', () => {
      service.openCreate();

      expect(service.mode()).toBe('create');
      expect(service.selectedVehicle()).toBe(null);
      expect(service.isOpen()).toBe(true);
    });

    it('should override edit state when openCreate is called after openEdit', () => {
      service.openEdit(mockVehicle);
      expect(service.mode()).toBe('edit');

      service.openCreate();
      expect(service.mode()).toBe('create');

      expect(service.selectedVehicle()).toBe(null);
      expect(service.isOpen()).toBe(true)
    });
  });

  describe('openEdit behavior', () => {
    it('should open modal in edit mode with selected vehicle', () => {
      service.openEdit(mockVehicle);

      expect(service.mode()).toBe('edit');
      expect(service.selectedVehicle()).toBe(mockVehicle);
      expect(service.isOpen()).toBe(true);
    });

    it('should replace selected vehicle when openEdit is called again', () => {
      const mockVehicle2 : VehicleInterface = {
        name: 'Pagani',
        model: 'Huayra',
        plate: '5669JKX',
        location: {
          lat: 42.48644688584013, 
          lng: 3.3107555554463137
        }
      }
      
      service.openEdit(mockVehicle);
      expect(service.selectedVehicle()).toBe(mockVehicle);
      expect(service.mode()).toBe('edit');

      service.openEdit(mockVehicle2);
      expect(service.selectedVehicle()).toBe(mockVehicle2);
      expect(service.mode()).toBe('edit');
      expect(service.isOpen()).toBe(true);
    });
  });

  describe('close behavior', () => {
    it('should close the modal', () => {
      service.openCreate();
      service.close();

      expect(service.isOpen()).toBe(false);
    });

    it('should clear selected vehicle when closing modal', () => {
      service.openEdit(mockVehicle);
      service.close();

      expect(service.selectedVehicle()).toBe(null);

    });

    it('should not modify mode when closing modal', () => {
      service.openEdit(mockVehicle);
      service.close();

      expect(service.mode()).toBe('edit')
    });
  });

  describe('state transitions', () => {
    it('should allow reopening modal after closing', () => {
      service.openCreate();
      service.close();
      expect(service.isOpen()).toBe(false);

      service.openCreate();
      expect(service.isOpen()).toBe(true);
    });

    it('should correctly switch from create to edit mode', () => {
      service.openCreate();
      expect(service.mode()).toBe('create');
      expect(service.selectedVehicle()).toBe(null);
      expect(service.isOpen()).toBe(true);

      service.openEdit(mockVehicle);
      expect(service.mode()).toBe('edit');
      expect(service.selectedVehicle()).toBe(mockVehicle);
      expect(service.isOpen()).toBe(true);
    });
  });
});
