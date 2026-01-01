import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ ReactiveFormsModule ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent implements OnInit {

  formReg: FormGroup;

  constructor( 
    private authService: AuthService, 
    private router: Router
  ) {
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {}

  onSubmit() {
    this.authService.register(this.formReg.value)
    .then( response => {
      console.log(response)
      this.router.navigate(['map'])
    })
    .catch(error => console.log(error));
  }
}
