import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleFormModalComponent } from './vehicle-form-modal';
import { VehicleInterface } from '../../interfaces/vehicle';
import { signal } from '@angular/core';

fdescribe('VehicleFormModalComponent', () => {
  let component: VehicleFormModalComponent;
  let fixture: ComponentFixture<VehicleFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleFormModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should create the form with correct controls', () => {
      const formControl = component.form.controls;

      expect(formControl['name']).toBeTruthy();
      expect(formControl['model']).toBeTruthy();
      expect(formControl['plate']).toBeTruthy();
    });

    it('should patch form values when mode is edit', () => {
      const inputVehicle: VehicleInterface = {
        name: 'R34',
        model: 'Nissan Skyline GT-R R34',
        plate: '123456',
      };

      (component as any).vehicle = signal(inputVehicle);
      (component as any).mode = signal('edit');

      component.ngOnChanges();

      expect(component.form.get('name')?.value).toBe(inputVehicle.name);
      expect(component.form.get('model')?.value).toBe(inputVehicle.model);
      expect(component.form.get('plate')?.value).toBe(inputVehicle.plate);
    });

    it('should reset form when mode is create', () => {
      (component as any).mode = signal('create');
      component.ngOnChanges();

      expect(component.form.get('name')?.value).toBeNull();
      expect(component.form.get('model')?.value).toBeNull();
      expect(component.form.get('plate')?.value).toBeNull();
    });
  });

  describe('form validation', () => {
    it('should return null error when field is valid', () => {
      component.form.get('name')?.setValue('Valid Name');
      component.form.get('name')?.markAsTouched();

      expect(component.getFieldError('name')).toBeNull();
    });

    it('should return required error when field is empty', () => {
      component.form.get('name')?.setValue('');
      component.form.get('name')?.markAsTouched();

      expect(component.getFieldError('name')).toBe('name is required');
    });

    it('should return minlength error when value is too short', () => {
      component.form.get('name')?.setValue('AB');
      component.form.get('name')?.markAsTouched();

      expect(component.getFieldError('name')).toBe('name must be at least 3 characters');
    });

    it('should return maxlength error when value is too long', () => {
      const longName = 'A'.repeat(31);

      component.form.get('name')?.setValue(longName);
      component.form.get('name')?.markAsTouched();

      expect(component.getFieldError('name')).toBe('name cannot exceed 30 characters');
    });
  });

  describe('submit behavior', () => {
    it('should emit submit event when form is valid', () => {
      spyOn(component.submit, 'emit');

      component.form.setValue({ name: 'R34', model: 'GT-R', plate: '12345' });
      component.onSubmit();

      expect(component.submit.emit).toHaveBeenCalledWith({ name: 'R34', model: 'GT-R', plate: '12345' });
    });

    it('should not emit submit when form is invalid', () => {
      spyOn(component.submit, 'emit');

      component.form.setValue({ name: '', model: '', plate: '' });
      component.onSubmit();

      expect(component.submit.emit).not.toHaveBeenCalled();
    });
  });

  describe('cancel behavior', () => {
    it('should emit cancel event on onCancel()', () => {
      spyOn(component.cancel, 'emit');

      component.onCancel();
      fixture.detectChanges();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('template interaction', () => {
    it('should call onSubmit on Enter key press', () => {
      spyOn(component, 'onSubmit');

      const formEl = fixture.nativeElement.querySelector('form');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      formEl.dispatchEvent(event);
      fixture.detectChanges();

      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should prevent modal click from closing form', () => {
      spyOn(component, 'onCancel');

      const formEl = fixture.nativeElement.querySelector('form');
      const clickEvent = new MouseEvent('click', { bubbles: true });

      formEl.dispatchEvent(clickEvent);
      fixture.detectChanges();

      expect(component.onCancel).not.toHaveBeenCalled();
    });

    it('should call onCancel when clicking outside form', () => {
      spyOn(component, 'onCancel');

      const modalEl = fixture.nativeElement.querySelector('.modal');
      const clickEvent = new MouseEvent('click', { bubbles: true });

      modalEl.dispatchEvent(clickEvent);
      fixture.detectChanges();
      
      expect(component.onCancel).toHaveBeenCalled();
    });
  });
});
