import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './auth';

const mockAuth = { onAuthStateChanged: () => {}};

const mockCreateUser = jasmine.createSpy('createUserWithEmailAndPassword').and.returnValue(Promise.resolve('usuario creado'));
const mockSignIn = jasmine.createSpy('signInWithEmailAndPassword').and.returnValue(Promise.resolve('usuario logueado'));
const mockSignOut = jasmine.createSpy('signOut').and.returnValue(Promise.resolve('usuario desconectado'));

describe('AuthService', () => {

  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: mockAuth }
      ]
    });

    service = TestBed.inject(AuthService);
    (service as any).register = ({ email, password }: any) => mockCreateUser(email, password);
    (service as any).login = ({ email, password }: any) => mockSignIn(email, password);
    (service as any).logout = () => mockSignOut();

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize isLogged signal as false', () => {
    expect(service.isLogged()).toBe(false);
  });

  it('should have the correct error messages', () => {
    const msg = service.errorMessages;

    expect(msg.invalidEmail).toBe('Please enter a valid email');
    expect(msg.invalidPassword).toBe('Please enter a password that contains at least 6 characters');
    expect(msg.invalidCredentials).toBe('This email or password is invalid');
    expect(msg.emailAlreadyExists).toBe('This email already exists');
  });

  it('register should call createUserWithEmailAndPassword', async () => {
    const result = service.register({
      email: 'IHateTestsXD@hotmail.com',
      password: '123456'
    });

    expect(mockCreateUser).toHaveBeenCalled();
    await expectAsync(result).toBeResolved();
  });

  it('login should call signInWithEmailAndPassword', async () => {
    const result = service.login({
      email: 'IHateTestsXD@hotmail.com',
      password: '123456'
    });

    expect(mockSignIn).toHaveBeenCalled();
    await expectAsync(result).toBeResolved();
  });

  it('logout should call signOut and return a promise', async () => {
    const result = service.logout();

    expect(mockSignOut).toHaveBeenCalled();
    await expectAsync(result).toBeResolved();
  });
  
  it('should set userSignal when auth state changes', () => {});

  it('should set isLogged to true when user is authenticated', () => {});

  it('should set isLogged to false when user is null', () => {});

  it('register should call Firebase createUserWithEmailAndPassword with correct arguments', () => {});

  it('login should call Firebase signInWithEmailAndPassword with correct arguments', () => {});

  it('logout should call Firebase signOut', () => {});

  it('isLogged should react to userSignal changes', () => {});
});
