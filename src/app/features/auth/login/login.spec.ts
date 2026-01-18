import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../services/auth';
import { Auth } from '@angular/fire/auth';

const mockAuth = {
  signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword').and.returnValue(Promise.resolve('usuario logueado')),
  onAuthStateChanged: () => {}
};

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let loginSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        AuthService,
        { provide: Auth, useValue: mockAuth }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    loginSpy = spyOn(authService, 'login').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.formLogin).toBeTruthy();

    expect(component.formLogin.get('email')).toBeTruthy();
    expect(component.formLogin.get('password')).toBeTruthy();
  });

  it('should mark the form as invalid when empty', () => {
    component.formLogin.get('email')?.setValue('');
    component.formLogin.get('password')?.setValue('');

    expect(component.formLogin.valid).toBeFalse();
  });

  it('should call authService.login when form is valid', () => {
    component.formLogin.get('email')?.setValue('gohan@gmail.com');
    component.formLogin.get('password')?.setValue('123456');

    expect(component.formLogin.valid).toBeTrue();

    component.onSubmit();
    expect(loginSpy).toHaveBeenCalledWith({
      email: 'gohan@gmail.com',
      password: '123456'
    });
  });

  it('should not fail when form is invalid', () => {
    component.formLogin.get('email')?.setValue('');
    component.formLogin.get('password')?.setValue('');

    expect(component.formLogin.invalid).toBeTrue();
    component.onSubmit();
  });
});
