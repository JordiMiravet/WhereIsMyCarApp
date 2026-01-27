import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditButtonComponent } from './edit-button';

describe('EditButtonComponent', () => {
  let component: EditButtonComponent;
  let fixture: ComponentFixture<EditButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditButtonComponent);
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

    it('should have the "edit-button" css class', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('class')).toContain('edit-button');
    });

    it('should have aria-label for accessibility', () => {
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Edit vehicle'); 
    });

    it('should render the edit icon', () => {
      const italic = fixture.nativeElement.querySelector('i');

      expect(italic.getAttribute('class')).toContain('pi');
      expect(italic.getAttribute('class')).toContain('pi-pen-to-square')
    });

    it('should call onClick when button is clicked', () => {
      const spyButton = spyOn(component, 'onClick');
      const button = fixture.nativeElement.querySelector('button');
      button.click();

      fixture.detectChanges();

      expect(spyButton).toHaveBeenCalled();
    });

  });

  describe('Output: edit', () => {

    it('should have an edit output', () => {
      expect(component.edit).toBeTruthy()
    });

    it('should emit edit event when onClick is called', () => {
      const spyEdit = spyOn(component.edit, 'emit');
      component.onClick();

      expect(spyEdit).toHaveBeenCalled();
    });

    it('should emit edit event when button is clicked', () => {
      spyOn(component.edit, 'emit'); 

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      fixture.detectChanges();

      expect(component.edit.emit).toHaveBeenCalled();
    });

    it('should expose an edit output', () => {
      expect(component.edit).toBeTruthy();
    });

  });

  describe('onClick method', () => {

    it('should call edit.emit()', () => {
      spyOn(component.edit, 'emit');

      component.onClick()
      fixture.detectChanges();

      expect(component.edit.emit).toHaveBeenCalled()
    });

  });

});
