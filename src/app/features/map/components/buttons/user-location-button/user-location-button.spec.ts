import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserLocationButtonComponent } from './user-location-button';

describe('UserLocationButtonComponent', () => {
  let component: UserLocationButtonComponent;
  let fixture: ComponentFixture<UserLocationButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLocationButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLocationButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component creation', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  });

  describe('Button functionality', () => {

    it('should emit click event when button is clicked', () => {
      spyOn(component.click, 'emit');
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      button.click();
      expect(component.click.emit).toHaveBeenCalled();
    });

    it('should emit click event only once per click', () => {
      spyOn(component.click, 'emit');
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      button.click();
      expect(component.click.emit).toHaveBeenCalledTimes(1);
    });

    it('should not be disabled by default', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBeFalse();
    });

  });

  describe('Accessibility and template', () => {

    it('should render a button element', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button).not.toBeNull();
    });

    it('should have correct aria-label', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Center map on current location');
    });

    it('should render the icon element', () => {
      const icon: HTMLElement = fixture.nativeElement.querySelector('i');
      expect(icon).toBeTruthy();
    });

    it('should have correct css classes', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      const icon: HTMLElement = fixture.nativeElement.querySelector('i');

      expect(button.classList.contains('map__button')).toBeTrue();
      expect(icon.classList.contains('fa-solid')).toBeTrue();
      expect(icon.classList.contains('fa-street-view')).toBeTrue();
    });

    it('should have aria-hidden true on icon', () => {
      const icon: HTMLElement = fixture.nativeElement.querySelector('i');
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });

  });

});
