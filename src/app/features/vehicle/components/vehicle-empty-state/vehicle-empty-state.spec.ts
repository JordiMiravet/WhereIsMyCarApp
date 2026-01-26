import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleEmptyStateComponent } from './vehicle-empty-state';

describe('VehicleEmptyStateComponent', () => {
  let component: VehicleEmptyStateComponent;
  let fixture: ComponentFixture<VehicleEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ VehicleEmptyStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have actionState input default to true', () => { 
    expect(component.actionState()).toBeTrue()
  });

  it('should render the container and message', () => { 
    const message = fixture.nativeElement.querySelector('.vehicle-empty__message');

    expect(message.textContent).toContain('There are no registered vehicles')
  });

  it('should display the create button when actionState is true', () => { 
    (component.actionState as any) = () => true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.vehicle-empty__button');
    expect(button).toBeTruthy();
  });

  it('should not display the create button when actionState is false', () => { 
    (component.actionState as any) = () => false;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.vehicle-empty__button');
    expect(button).toBeNull()
  });

  it('should emit createVehicle event when the button is clicked', () => { 
    spyOn(component.createVehicle, 'emit');
    (component.actionState as any) = () => true;

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.vehicle-empty__button');
    button.click();

    expect(component.createVehicle.emit).toHaveBeenCalled();
  });

  it('should call onClick when button is clicked', () => { 
    spyOn(component, 'onClick');
    (component.actionState as any) = () => true;
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.vehicle-empty__button');
    button.click();

    expect(component.onClick).toHaveBeenCalled();
  });

});
