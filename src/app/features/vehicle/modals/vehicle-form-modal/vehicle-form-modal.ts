import { CommonModule } from '@angular/common';
import { Component, input, output, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehicle-form-modal',
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './vehicle-form-modal.html',
  styleUrl: './vehicle-form-modal.css',
})

export class VehicleFormModalComponent implements OnChanges {

  mode = input<'create' | 'edit'>('create');
  vehicle = input<any | null>(null);

  submit = output<any>();
  cancel = output<void>();

  public form: FormGroup;

  getFieldError( field: string ): string | null {
    const control = this.form.get(field);
    if (!control || !control.touched || control.valid) return null;

    if (control.errors?.['required']) return `${field} is required`;
    if (control.errors?.['minlength']) return `${field} must be at least ${control.errors['minlength'].requiredLength} characters long`;
    if (control.errors?.['maxlength']) return `${field} cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
    
    return null;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.maxLength(30), 
        Validators.minLength(3)
      ]],
      model: ['', [
        Validators.required, 
        Validators.maxLength(30), 
        Validators.minLength(3)
      ]],
      plate: ['', [
        Validators.required, 
        Validators.maxLength(10), 
        Validators.minLength(5)
      ]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicle'] || changes['mode']) {
      const vehicle = this.vehicle();
      const mode = this.mode();

      if (mode === 'edit' && vehicle) {
        this.form.patchValue(vehicle);
      } else {
        this.form.reset();
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.submit.emit({ ...this.form.value });
  }

  onCancel() {
    this.cancel.emit();
  }
}