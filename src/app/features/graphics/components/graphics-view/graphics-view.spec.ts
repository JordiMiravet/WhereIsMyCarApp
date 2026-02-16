import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsView } from './graphics-view';

describe('GraphicsView', () => {
  let component: GraphicsView;
  let fixture: ComponentFixture<GraphicsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
