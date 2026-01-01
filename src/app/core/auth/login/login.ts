import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  
  formlogin: FormGroup;

  constructor( 
    private authService: AuthService, 
    private router: Router
  ) {
    this.formlogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {}

  onSubmit() {
    this.authService.login(this.formlogin.value)
    .then( response => {
      console.log(response)
      this.router.navigate(['map'])
    })
    .catch(error => console.log(error));
  }
}
