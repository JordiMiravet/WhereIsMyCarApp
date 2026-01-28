import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthActionsComponent } from './auth-actions';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../features/auth/services/auth';
import { Component, signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';

class MockAuthService {
  isLogged = signal(false);
  logout = jasmine.createSpy('logout').and.returnValue(Promise.resolve());
}

@Component({ 
  selector: 'app-login-test', 
  template: '<p>Login Page</p>' 
})
class LoginComponent {}

@Component({ 
  selector: 'app-register-test', 
  template: '<p>Register Page</p>' 
})
class RegisterComponent {}

describe('AuthActionsComponent', () => {
  let component: AuthActionsComponent;
  let fixture: ComponentFixture<AuthActionsComponent>;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuthActionsComponent,
        RouterTestingModule
      ],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService
        },
        provideRouter([
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegisterComponent }
        ])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthActionsComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    fixture.detectChanges();
  });

  describe('Component creation', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  });

  describe('Template rendering', () => {

    it('should render Logout button when user is logged', () => {
      component.isLogged = signal(true);
      fixture.detectChanges();
      
      const logoutButton  = fixture.nativeElement.querySelector('[data-test="logoutButton"]');

      expect(logoutButton).toBeTruthy()
    });

    it('should render Register and Login buttons when user is NOT logged', () => {
      component.isLogged = signal(false);
      fixture.detectChanges();

      const loginButton = fixture.nativeElement.querySelector('[data-test="loginButton"]');
      const registerButton = fixture.nativeElement.querySelector('[data-test="registerButton"]');

      expect(loginButton).toBeTruthy();
      expect(registerButton).toBeTruthy();
    });

    it('should render correct icons and labels for Logout', () => {
      component.isLogged = signal(true);
      fixture.detectChanges();
      
      const logout = fixture.nativeElement.querySelector('[data-test="logoutButton"]');
      expect(logout).toBeTruthy();

      const icon = logout.querySelector('i');
      expect(icon).toBeTruthy();

      const spanText = logout.querySelector('span');
      expect(spanText).toBeTruthy();
      expect(spanText.textContent).toBe('Logout');
    });

    it('should navigate to correct routes when buttons are clicked', async () => {
      const harness = await RouterTestingHarness.create();

      component.isLogged = signal(false);
      fixture.detectChanges();

      const loginButton = fixture.nativeElement.querySelector('[data-test="loginButton"]');
      loginButton.click();

      await harness.navigateByUrl('/login');
      expect(harness.routeNativeElement?.textContent).toContain('Login Page');

      const registerButton = fixture.nativeElement.querySelector('[data-test="registerButton"]');
      registerButton.click();

      await harness.navigateByUrl('/register');
      expect(harness.routeNativeElement?.textContent).toContain('Register Page');
    });

  });

  describe('Interactions', () => {

    it('should call logout and navigate when Logout button is clicked', async () => {
      component.isLogged = signal(true);
      fixture.detectChanges();

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      const logoutButton = fixture.nativeElement.querySelector('[data-test="logoutButton"]');

      logoutButton.click();

      expect(authService.logout).toHaveBeenCalled();
      await authService.logout.calls.mostRecent().returnValue;

      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });

  });

});
