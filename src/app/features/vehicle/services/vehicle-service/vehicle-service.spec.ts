import { TestBed } from '@angular/core/testing';

import { VehicleService } from './vehicle-service';
import { provideHttpClient } from '@angular/common/http';

describe('VehicleService', () => {
  let service: VehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ provideHttpClient() ]
    });
    service = TestBed.inject(VehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
