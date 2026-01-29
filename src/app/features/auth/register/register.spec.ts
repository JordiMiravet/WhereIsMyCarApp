import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register';
import { AuthService } from '../services/auth';
import { Auth, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';

const mockAuth = {
  signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword').and.returnValue(Promise.resolve('usuario logueado')),
  onAuthStateChanged: () => {}
};

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let registerSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        AuthService,
        { provide: Auth, useValue: mockAuth }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    registerSpy = spyOn(authService, 'register').and.callThrough();

    fixture.detectChanges();
  });

  describe('Component creation', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  });

  describe('Form initialization', () => {

    it('should initialize the login form', () => {
      expect(component.formReg).toBeTruthy();

      expect(component.formReg.get('email')).toBeTruthy();
      expect(component.formReg.get('password')).toBeTruthy();
    });

  });

  describe('Form validation', () => {

    it('should mark email as invalid when format is incorrect', () => {
      const emailControl = component.formReg.get('email');

      emailControl?.setValue('Hello');

      expect(emailControl?.invalid).toBeTruthy();
      expect(emailControl?.errors?.['email']).toBeTrue();
    });

    it('should mark email as invalid when pattern does not match', () => {
      const emailControl = component.formReg.get('email');

      emailControl?.setValue('jordi@gm.co');

      expect(emailControl?.invalid).toBeTrue();
      expect(emailControl?.errors?.['pattern']).toBeTruthy();
      expect(emailControl?.errors?.['email']).toBeUndefined();
    });

    it('should mark password as invalid when shorter than 6 characters', () => {
      const passwordControl = component.formReg.get('password');

      passwordControl?.setValue('12345');

      expect(passwordControl?.invalid).toBeTrue();
      expect(passwordControl?.errors).toBeTruthy();
      expect(passwordControl?.errors?.['minlength']).toBeTruthy();
    });

    it('should mark the form as invalid when empty', () => {
      component.formReg.get('email')?.setValue('');
      component.formReg.get('password')?.setValue('');

      expect(component.formReg.valid).toBeFalse();
    });

  });

  describe('Template rendering', () => {

    it('should disable submit button when form is invalid', () => {
      const button = fixture.nativeElement.querySelector('button');

      component.formReg.get('email')?.setValue('');
      component.formReg.get('password')?.setValue('');
      fixture.detectChanges();
      
      expect(button.disabled).toBeTrue();
    });

    it('should enable submit button when form is valid', () => {
      const button = fixture.nativeElement.querySelector('button');

      component.formReg.get('email')?.setValue('itacademy@gmail.com');
      component.formReg.get('password')?.setValue('123456');
      fixture.detectChanges();

      expect(button.disabled).toBeFalse();
    });

    it('should show email error message when email is invalid and touched', () => {
      const emailControl = component.formReg.get('email');
      const errorMessageElement : HTMLElement = fixture.nativeElement.querySelector('#register-email-error');

      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      fixture.detectChanges();

      expect(emailControl?.invalid).toBeTrue();
      expect(emailControl?.touched).toBeTrue();
      expect(errorMessageElement.hidden).toBeFalse();
      expect(errorMessageElement.textContent).toContain(component.authMessage.invalidEmail);
    });

    it('should show password error message when password is invalid and touched', () => {
      const passwordControl = component.formReg.get('password');
      const errorMessageElement : HTMLElement = fixture.nativeElement.querySelector('#register-password-error');

      passwordControl?.setValue('12345');
      passwordControl?.markAsTouched();
      fixture.detectChanges();

      expect(passwordControl?.invalid).toBeTrue();
      expect(passwordControl?.touched).toBeTrue();
      expect(errorMessageElement.hidden).toBeFalse();
      expect(errorMessageElement.textContent).toContain(component.authMessage.invalidPassword);
    });

    it('should not show error messages when inputs are valid', () => {
      const emailControl = component.formReg.get('email');
      const passwordControl = component.formReg.get('password');
      
      emailControl?.setValue('itacademy@gmail.com');
      passwordControl?.setValue('123456');

      emailControl?.markAsTouched();
      passwordControl?.markAsTouched();

      fixture.detectChanges();

      const emailErrorElement: HTMLElement = fixture.nativeElement.querySelector('#register-email-error');
      const passwordErrorElement: HTMLElement = fixture.nativeElement.querySelector('#register-password-error');

      expect(emailErrorElement.hidden).toBeTrue();
      expect(passwordErrorElement.hidden).toBeTrue();
    });

    it('should display submit error message when login fails', () => {
      component.errorSubmit = 'This email or password is invalid';
      fixture.detectChanges();

      const errorElement: HTMLElement = fixture.nativeElement.querySelector('.form__error-submit');

      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('This email or password is invalid')

    });

  });

  describe('Interactions', () => {

    it('should call authService.login when form is valid', () => {
      component.formReg.get('email')?.setValue('gohan@gmail.com');
      component.formReg.get('password')?.setValue('123456');

      expect(component.formReg.valid).toBeTrue();

      component.onSubmit();
      expect(registerSpy).toHaveBeenCalledWith({
        email: 'gohan@gmail.com',
        password: '123456'
      });
    });

    it('should navigate to home on successful login', async () => {
      const router = TestBed.inject(Router);
      const navigateSpy = spyOn(router, 'navigate');

      component.formReg.get('email')?.setValue('itacademy@gmail.com');
      component.formReg.get('password')?.setValue('123456');

      const mockUserCredential = {} as UserCredential;
      registerSpy.and.returnValue(Promise.resolve(mockUserCredential));

      await component.onSubmit();

      expect(navigateSpy).toHaveBeenCalledWith(['']);
    });

    it('should not fail when form is invalid', () => {
      component.formReg.get('email')?.setValue('');
      component.formReg.get('password')?.setValue('');

      expect(component.formReg.invalid).toBeTrue();
      component.onSubmit();
    });

  });

});
