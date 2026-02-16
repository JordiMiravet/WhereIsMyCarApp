import { TestBed } from '@angular/core/testing';

import { GraphicsServices } from './graphics-services';

describe('GraphicsServices', () => {
  let service: GraphicsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphicsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
