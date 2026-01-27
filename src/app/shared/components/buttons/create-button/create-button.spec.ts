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

    it('should have the "create__button" css class', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.classList.contains('create__button')).toBeTrue();
    });

    it('should have aria-label for accessibility', () => {
      const button = fixture.nativeElement.querySelector('button');

      expect(button.getAttribute('aria-label')).toBeTruthy();
      expect(button.getAttribute('aria-label')).toBe('Create vehicle');
    });

    it('should render the plus icon', () => {
      const italic = fixture.nativeElement.querySelector('i');

      expect(italic).toBeTruthy();
      expect(italic.classList.contains('pi')).toBeTrue();
      expect(italic.classList.contains('pi-plus')).toBeTrue();
    });

    it('should call onClick when button is clicked', () => {
      spyOn(component, 'onClick');

      const button = fixture.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();

      expect(component.onClick).toHaveBeenCalled()
    });

  });

  describe('Output: create', () => {

    it('should have a create output', () => {
      expect(component.create).toBeTruthy();
    });

    it('should emit create event when onClick is called', () => {
      spyOn(component.create, 'emit')
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
      fixture.detectChanges()

      expect(component.onClick).toHaveBeenCalled()
    });

  });

  describe('onClick method', () => {

    it('should call create.emit()', () => {
      spyOn(component.create, 'emit');

      const button = fixture.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();

      expect(component.create.emit).toHaveBeenCalled()
    });

  });

});
