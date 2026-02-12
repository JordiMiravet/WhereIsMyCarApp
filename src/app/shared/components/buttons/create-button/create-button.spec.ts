import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateButtonComponent } from './create-button';

describe('CreateButtonComponent', () => {
  let component: CreateButtonComponent;
  let fixture: ComponentFixture<CreateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Template rendering', () => {

    it('should render a button element', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
    });

    it('should have type="button"', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('type')).toBe('button');
    });

    it('should have the "create-button" css class', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.classList.contains('create-button')).toBeTrue();
    });

    it('should have aria-label for accessibility when input is provided', () => {
      (component.createText as any) = () => 'vehicle';
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');

      expect(button.getAttribute('aria-label')).toBe('Add vehicle');
    });

    it('should render the text with provided input', () => {
      (component.createText as any) = () => 'vehicle';
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('.create-button__text');
      expect(span.textContent.trim()).toBe('Add vehicle');
    });

    it('should render empty text if no input provided', () => {
      const span = fixture.nativeElement.querySelector('.create-button__text');
      expect(span.textContent.trim()).toBe('Add');
    });


    it('should call onClick when button is clicked', () => {
      spyOn(component, 'onClick');

      const button = fixture.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();

      expect(component.onClick).toHaveBeenCalled();
    });

  });

  describe('Output: create', () => {

    it('should have a create output', () => {
      expect(component.create).toBeTruthy();
    });

    it('should emit create event when onClick is called', () => {
      spyOn(component.create, 'emit');
      component.onClick();

      expect(component.create.emit).toHaveBeenCalled();
    });

    it('should emit create event when button is clicked', () => {
      spyOn(component.create, 'emit');

      const button = fixture.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();

      expect(component.create.emit).toHaveBeenCalled();
    });

    it('should expose a create output', () => {
      const create = component.create;
      expect(create).toBeTruthy();
    });

    it('should emit when the button is clicked', () => {
      spyOn(component, 'onClick');

      const button = fixture.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();

      expect(component.onClick).toHaveBeenCalled();
    });

  });

  describe('onClick method', () => {

    it('should call create.emit()', () => {
      spyOn(component.create, 'emit');
      component.onClick();

      expect(component.create.emit).toHaveBeenCalled();
    });

  });

});
