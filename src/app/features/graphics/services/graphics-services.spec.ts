import { TestBed } from '@angular/core/testing';

import { GraphicsServices } from './graphics-services';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GraphicsServices', () => {
  let service: GraphicsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GraphicsServices);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
