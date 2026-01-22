import { TestBed } from '@angular/core/testing';
import { VehicleModalStateService } from './vehicle-modal-state-service';

describe('VehicleModalStateService', () => {
  let service: VehicleModalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleModalStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
