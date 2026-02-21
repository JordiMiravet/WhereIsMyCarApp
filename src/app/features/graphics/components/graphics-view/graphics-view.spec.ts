import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsViewComponent } from './graphics-view';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GraphicsView', () => {
  let component: GraphicsViewComponent;
  let fixture: ComponentFixture<GraphicsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GraphicsViewComponent,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
