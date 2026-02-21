import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class RegisterComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  public authMessage = this.authService.errorMessages;
  public errorSubmit: string = '';

  formReg: FormGroup;
  
  constructor() {
    this.formReg = new FormGroup({
      email: new FormControl('', [
        Validators.email, 
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._-]+([a-zA-Z0-9_-]+)*@[a-zA-Z]{3,}\.[a-zA-Z]{2,}$/)
      ]),
      password: new FormControl('',[
        Validators.minLength(6),
        Validators.required
      ])
    })
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.formReg.invalid) {
      this.formReg.markAllAsTouched();
      return
    }

    this.authService.register(this.formReg.value)
    .then( response => {
      this.router.navigate([''])
    })
    .catch(error => {
      this.errorSubmit = this.authMessage.emailAlreadyExists
      console.error('Error:', error)
    });
  }
}
