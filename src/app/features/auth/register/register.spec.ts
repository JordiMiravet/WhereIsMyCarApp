import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register';
import { AuthService } from '../auth';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const authServiceMock = {
    register: jasmine.createSpy('register').and.returnValue(Promise.resolve()),
    isLogged: () => false,
    errorMessages: {
      invalidEmail: '',
      invalidPassword: '',
      invalidCredentials: '',
      emailAlreadyExists: '',
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    authServiceMock.register.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the register form', () => {
    expect(component.formReg).toBeTruthy();

    expect(component.formReg.get('email')?.value).toBe('');
    expect(component.formReg.get('password')?.value).toBe('');
  });

  it('should have email and password controls', () => {
    expect(component.formReg.get('email')).toBeTruthy();
    expect(component.formReg.get('password')).toBeTruthy();
  });

  it('should mark the form as invalid when empty', () => {
    expect(component.formReg.get('email')?.value).toBe('');
    expect(component.formReg.get('password')?.value).toBe('');

    expect(component.formReg.invalid).toBeTrue();
  });

  it('should call authService.register when form is valid', () => {
    component.formReg.get('email')?.setValue('gohan@gmail.com');
    component.formReg.get('password')?.setValue('123456');

    expect(component.formReg.valid).toBeTrue();

    component.onSubmit();
    expect(authServiceMock.register).toHaveBeenCalledWith({
      email: 'gohan@gmail.com',
      password: '123456'
    });
  });

  it('should not fail when form is invalid', () => {
    component.formReg.get('email')?.setValue('');
    component.formReg.get('password')?.setValue('');

    expect(component.formReg.invalid).toBeTrue();
    component.onSubmit();
  });
});
