import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from '../header/header';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../features/auth/services/auth';
import { signal } from '@angular/core';

class MockAuthService {
  isLogged = signal(false);
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule
      ],
      providers: [{
        provide: AuthService,
        useClass: MockAuthService
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component creation', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  });

  describe('Template rendering', () => {

    it('should render the header element with correct role', () => {
      const header = fixture.nativeElement.querySelector('header');
      
      expect(header).toBeTruthy();
      expect(header.getAttribute('role')).toBe('banner');
    });

    it('should render NavigationComponent', () => {
      const navigation = fixture.nativeElement.querySelector('app-navigation');
      expect(navigation).toBeTruthy();
    });

    it('should render AuthActionsComponent', () => {
      const authActions = fixture.nativeElement.querySelector('app-auth-actions');
      expect(authActions).toBeTruthy();
    });

  });

  describe('Layout structure', () => {

    it('should contain app-navigation before app-auth-actions', () => {
      const header = fixture.nativeElement.querySelector('header');
      const navigation = header.querySelector('app-navigation');
      const authActions = header.querySelector('app-auth-actions');

      expect(navigation).toBeTruthy();
      expect(authActions).toBeTruthy();

      const navigationIndex = Array.from(header.children).indexOf(navigation);
      const authActionsIndex = Array.from(header.children).indexOf(authActions);

      expect(navigationIndex).toBeLessThan(authActionsIndex);
    });

  });

});
