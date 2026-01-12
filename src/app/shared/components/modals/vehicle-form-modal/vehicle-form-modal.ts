import { Component, effect, input, output } from '@angular/core';
import { ReactiveFormsModule ,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehicle-form-modal',
  imports: [ ReactiveFormsModule ],
  templateUrl: './vehicle-form-modal.html',
  styleUrl: './vehicle-form-modal.css',
})
export class VehicleFormModalComponent {

  mode = input<'create' | 'edit'>('create');
  vehicle = input<any | null>(null);

  submit = output<any>();
  cancel = output<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      model: ['', Validators.required],
    });

    effect(() => {
      const vehicle = this.vehicle();
      const mode = this.mode();

      if (mode === 'edit' && vehicle) {
        this.form.patchValue(vehicle);
      } else {
        this.form.reset();
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submit.emit(this.form.value);
  }

  onCancel() {
    this.cancel.emit();
  }
}
