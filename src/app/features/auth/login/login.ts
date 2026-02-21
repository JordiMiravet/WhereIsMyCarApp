import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  
  private authService = inject(AuthService);
  private router = inject(Router);

  public authMessage = this.authService.errorMessages;
  public errorSubmit: string = '';

  formLogin: FormGroup;
  
  constructor() {
    this.formLogin = new FormGroup({
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
    if(this.formLogin.invalid) {
      this.formLogin.markAllAsTouched(); 
      return;
    }
    
    this.authService.login(this.formLogin.value)
    .then( response => {
      this.router.navigate([''])
    })
    .catch(error => {
      this.errorSubmit = this.authMessage.invalidCredentials
      console.error('Error:', error)
    });
  }
}
