import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteButtonComponent } from './delete-button';

describe('DeleteButtonComponent', () => {
  let component: DeleteButtonComponent;
  let fixture: ComponentFixture<DeleteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteButtonComponent);
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

    it('should have the "delete-button" css class', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('class')).toContain('delete-button')
    });

    it('should have the correct aria-label', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Delete vehicle');
    });

    it('should render the trash icon', () => {
      const italic = fixture.nativeElement.querySelector('i');
      expect(italic.getAttribute('class')).toContain('pi');
      expect(italic.getAttribute('class')).toContain('pi-trash')
    });

    it('should call onClick when button is clicked', () => {
      const spyButton = spyOn(component, 'onClick');
      const button = fixture.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();
      expect(spyButton).toHaveBeenCalled();
    });

  });

  describe('Output: delete', () => {

    it('should have a delete output', () => {
      expect(component.delete).toBeTruthy();
    });

    it('should emit delete event when onClick is called', () => {
      spyOn(component.delete, 'emit');
      component.onClick();
      expect(component.delete.emit).toHaveBeenCalled();
    });

    it('should emit delete event when button is clicked', () => {
      spyOn(component.delete, 'emit'); 
      const button = fixture.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();
      expect(component.delete.emit).toHaveBeenCalled();
    });

    it('should expose a delete output', () => {
      expect(component.delete).toBeTruthy();
    });

    it('should emit when the button is clicked', () => {
      spyOn(component.delete, 'emit');

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      fixture.detectChanges();

      expect(component.delete.emit).toHaveBeenCalled()
    });

  });

  describe('onClick method', () => {

    it('should call delete.emit()', () => {
      spyOn(component.delete, 'emit');
      component.onClick();

      expect(component.delete.emit).toHaveBeenCalled()
    });

  });
  
});
