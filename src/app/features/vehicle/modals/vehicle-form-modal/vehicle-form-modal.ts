import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleInterface } from '../../interfaces/vehicle';

@Component({
  selector: 'app-vehicle-form-modal',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './vehicle-form-modal.html',
  styleUrls: ['./vehicle-form-modal.css'],
})
export class VehicleFormModalComponent {

  mode = input<'create' | 'edit'>('create');
  vehicle = input<VehicleInterface | null>(null);

  submit = output<VehicleInterface>();
  cancel = output<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(30)
      ]],
      model: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(30)
      ]],
      plate: ['', [
        Validators.required, 
        Validators.minLength(5), 
        Validators.maxLength(10)
      ]],
    });
  }

  ngOnChanges() {
    const vehicle = this.vehicle();
    const mode = this.mode();

    if (mode === 'edit' && vehicle) {
      this.form.patchValue({
        name: vehicle.name,
        model: vehicle.model,
        plate: vehicle.plate
      });
    } else {
      this.form.reset();
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.submit.emit({ ...this.form.value });
  }

  onCancel() {
    this.cancel.emit();
  }

  /* 
    ToDo: A ver cuando tenga tiempo tengo que pensar que mas adelante los mensajes de esta parte 
    irán en un service a parte que recoja todos los msg de error del programa, por ahora me lo dejo apuntao por aquí
  */

  getFieldError(field: string): string | null {
    const control = this.form.get(field);
    if (!control || !control.touched || control.valid) return null;

    if (control.errors?.['required']) return `${field} is required`;
    if (control.errors?.['minlength']) return `${field} must be at least ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors?.['maxlength']) return `${field} cannot exceed ${control.errors['maxlength'].requiredLength} characters`;

    return null;
  }

}
