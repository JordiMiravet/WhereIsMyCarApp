import { TestBed } from '@angular/core/testing';
import { VehicleModalService } from './vehicle-modal-service';
import { VehicleInterface } from '../../interfaces/vehicle';
import { VehicleModalState } from '../../enum/vehicle-modal-state.enum';

fdescribe('VehicleModalService', () => {
  let service: VehicleModalService;

  const mockVehicle: VehicleInterface = {
    name: 'Ferrari',
    model: 'F8 Tributo',
    plate: '4558XKJ',
    location: {
      lat: 41.48644688584013,
      lng: 2.3107555554463137
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleModalService);
  });

  describe('service creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('initial state', () => {
    it('should initialize activeModal as Closed', () => {
      expect(service.activeModal()).toBe(VehicleModalState.Closed);
    });

    it('should initialize formMode as "create"', () => {
      expect(service.formMode()).toBe('create');
    });

    it('should initialize selectedVehicle as null', () => {
      expect(service.selectedVehicle()).toBe(null);
    });
  });

  describe('openCreate behavior', () => {
    it('should open modal in create mode', () => {
      service.openCreate();

      expect(service.formMode()).toBe('create');
      expect(service.selectedVehicle()).toBe(null);
      expect(service.activeModal()).toBe(VehicleModalState.VehicleForm);
    });

    it('should override edit state when openCreate is called after openEdit', () => {
      service.openEdit(mockVehicle);
      expect(service.formMode()).toBe('edit');

      service.openCreate();

      expect(service.formMode()).toBe('create');
      expect(service.selectedVehicle()).toBe(null);
      expect(service.activeModal()).toBe(VehicleModalState.VehicleForm);
    });
  });

  describe('openEdit behavior', () => {
    it('should open modal in edit mode with selected vehicle', () => {
      service.openEdit(mockVehicle);

      expect(service.formMode()).toBe('edit');
      expect(service.selectedVehicle()).toBe(mockVehicle);
      expect(service.activeModal()).toBe(VehicleModalState.VehicleForm);
    });

    it('should replace selected vehicle when openEdit is called again', () => {
      const mockVehicle2: VehicleInterface = {
        name: 'Pagani',
        model: 'Huayra',
        plate: '5669JKX',
        location: {
          lat: 42.48644688584013,
          lng: 3.3107555554463137
        }
      };

      service.openEdit(mockVehicle);
      expect(service.selectedVehicle()).toBe(mockVehicle);
      expect(service.formMode()).toBe('edit');

      service.openEdit(mockVehicle2);

      expect(service.selectedVehicle()).toBe(mockVehicle2);
      expect(service.formMode()).toBe('edit');
      expect(service.activeModal()).toBe(VehicleModalState.VehicleForm);
    });
  });

  describe('openConfirmDelete behavior', () => {
    it('should open confirm delete modal with selected vehicle', () => {
      service.openConfirmDelete(mockVehicle);

      expect(service.selectedVehicle()).toBe(mockVehicle);
      expect(service.activeModal()).toBe(VehicleModalState.ConfirmDelete);
    });

    it('should not modify formMode when opening confirm delete', () => {
      service.openEdit(mockVehicle);
      service.openConfirmDelete(mockVehicle);

      expect(service.formMode()).toBe('edit');
    });
  });

  describe('close behavior', () => {
    it('should close the modal', () => {
      service.openCreate();
      service.close();

      expect(service.activeModal()).toBe(VehicleModalState.Closed);
    });

    it('should clear selected vehicle when closing modal', () => {
      service.openEdit(mockVehicle);
      service.close();

      expect(service.selectedVehicle()).toBe(null);
    });

    it('should not modify formMode when closing modal', () => {
      service.openEdit(mockVehicle);
      service.close();

      expect(service.formMode()).toBe('edit');
    });
  });

  describe('state transitions', () => {
    it('should allow reopening modal after closing', () => {
      service.openCreate();
      service.close();
      expect(service.activeModal()).toBe(VehicleModalState.Closed);

      service.openCreate();
      expect(service.activeModal()).toBe(VehicleModalState.VehicleForm);
    });

    it('should correctly switch from create to edit mode', () => {
      service.openCreate();
      expect(service.formMode()).toBe('create');
      expect(service.selectedVehicle()).toBe(null);
      expect(service.activeModal()).toBe(VehicleModalState.VehicleForm);

      service.openEdit(mockVehicle);
      expect(service.formMode()).toBe('edit');
      expect(service.selectedVehicle()).toBe(mockVehicle);
      expect(service.activeModal()).toBe(VehicleModalState.VehicleForm);
    });
  });
});
