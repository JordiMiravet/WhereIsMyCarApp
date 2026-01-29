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

  });

  describe('Accessibility and template', () => {

    it('should have correct aria-label', () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Center map on current location');
    });

    it('should render the svg icon', () => {
      const svg: SVGElement = fixture.nativeElement.querySelector('svg');
      expect(svg).toBeTruthy();
    });

  });

});
