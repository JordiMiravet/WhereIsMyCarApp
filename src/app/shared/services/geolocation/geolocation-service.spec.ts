import { TestBed } from '@angular/core/testing';
import { GeolocationService } from './geolocation-service';

describe('GeolocationService', () => {
  let service: GeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve with latitude and longitude when geolocation is available', async () => {
    const mockPosition = {
      coords: {
        latitude: 40.4168,
        longitude: -3.7038,
      },
    };

    spyOn(navigator.geolocation, 'getCurrentPosition')
      .and.callFake((success: any) => {
        success(mockPosition);
      });

    const result = await service.getCurrentLocation();

    expect(result).toEqual([40.4168, -3.7038]);
  });

  it('should reject when geolocation is not supported', async () => {
    const originalGeolocation = navigator.geolocation;

    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    });

    try {
      await service.getCurrentLocation();
      fail('Promise should have been rejected');
    } catch (error) {
      expect(error).toBe('Geolocation not supported');
    }

    Object.defineProperty(navigator, 'geolocation', {
      value: originalGeolocation,
      configurable: true,
    });
  });

  it('should reject when geolocation returns an error', async () => {
    spyOn(navigator.geolocation, 'getCurrentPosition')
      .and.callFake((_: any, error: any) => {
        error();
      });

    try {
      await service.getCurrentLocation();
      fail('Promise should have been rejected');
    } catch (error) {
      expect(error).toBe('Location error');
    }
  });
});
