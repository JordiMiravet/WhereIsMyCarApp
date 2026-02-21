import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsComponent } from './graphics';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GraphicsComponent', () => {
  let component: GraphicsComponent;
  let fixture: ComponentFixture<GraphicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GraphicsComponent,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
