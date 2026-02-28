import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HomeComponent, HttpClientModule],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

 describe('Template rendering', () => {
    it('should render vehicle view component', () => {
      const vehicleViewComponent = fixture.nativeElement.querySelector('app-vehicle-view'); 
      expect(vehicleViewComponent).toBeTruthy()
    });
  });

});
