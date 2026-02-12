import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleEmptyStateComponent } from './vehicle-empty-state';
import { By } from '@angular/platform-browser';

describe('VehicleEmptyStateComponent', () => {
  let component: VehicleEmptyStateComponent;
  let fixture: ComponentFixture<VehicleEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ VehicleEmptyStateComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('component creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('initial state', () => {
    it('should have createVehicle as an output', () => {
      expect(component.createVehicle).toBeDefined();
      expect(typeof component.createVehicle.emit).toBe('function');
    });
  });

  describe('template rendering', () => {
    it('should render the container', () => {
      const container = fixture.nativeElement.querySelector('.vehicle-empty__container');
      expect(container).toBeTruthy();
    });

    it('should render the message', () => {
      const message = fixture.nativeElement.querySelector('.vehicle-empty__text');
      expect(message.textContent).toContain('There are no registered vehicles');
    });

    it('should render the create button', () => {
      const button = fixture.debugElement.query(By.css('app-create-button'));
      expect(button).toBeTruthy();
    });
  });

  describe('methods', () => {
    it('should call onClick method', () => {
      spyOn(component, 'onClick');

      const button = fixture.debugElement.query(By.css('app-create-button'));
      button.triggerEventHandler('click', null);

      expect(component.onClick).toHaveBeenCalled();
    });

    it('should emit createVehicle event when onClick is called', () => {
      spyOn(component.createVehicle, 'emit');
      component.onClick();

      expect(component.createVehicle.emit).toHaveBeenCalled();
    });
  });

  describe('events', () => {
    it('should emit createVehicle when create button is clicked', () => {
      spyOn(component.createVehicle, 'emit');

      const button = fixture.debugElement.query(By.css('app-create-button'));
      button.triggerEventHandler('click', null);
      
      expect(component.createVehicle.emit).toHaveBeenCalled();
    });
  });

});
