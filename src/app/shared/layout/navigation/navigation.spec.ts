import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { NavigationComponent } from './navigation';
import { isSignal, signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

const mockAuth = {
  onAuthStateChanged: jasmine.createSpy('onAuthStateChanged')
} as unknown as Auth;

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavigationComponent,
        RouterTestingModule 
      ],
      providers: [{
        provide: Auth,
        useValue: mockAuth
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Template rendering', () => {

    it('should render the nav element with correct role and aria-label', () => {
      const navElement = fixture.nativeElement.querySelector('nav');
      expect(navElement.getAttribute('role')).toBe('navigation');
      expect(navElement.getAttribute('aria-label')).toBe('Main navigation')
    });

    it('should render the links list when user is logged', () => {
      component.isLogged = signal(true);
      fixture.detectChanges();

      const unorderListElement = fixture.nativeElement.querySelector('.navbar__links');
      expect(unorderListElement).toBeTruthy();
    });

    it('should NOT render links list when user is not logged', () => {
      component.isLogged = signal(false);
      fixture.detectChanges();

      const unorderListElement = fixture.nativeElement.querySelector('.navbar__links');
      expect(unorderListElement).toBeFalsy();
    });

    it('should render all navigation links when user is logged', () => {
      component.isLogged = signal(true);
      fixture.detectChanges();

      const links = fixture.nativeElement.querySelectorAll('.navbar__links li a');
      expect(links.length).toBe(4);
    });

    it('should have correct routerLink for each navigation link', () => {
      component.isLogged = signal(true);
      fixture.detectChanges();

      const links = fixture.nativeElement.querySelectorAll('.navbar__links li a');
      const expectedLinks = ['/', '/map', '/calendar', '/graphics'];

      links.forEach((link: HTMLElement, index: number) => {
        expect(link.getAttribute('ng-reflect-router-link') || link.getAttribute('href')).toBe(expectedLinks[index]);
      });
    });

    it('should render correct icons and labels for each link', () => {
      component.isLogged = signal(true);
      fixture.detectChanges();

      const links = fixture.nativeElement.querySelectorAll('.navbar__links li a');
      const expectedIcons = ['pi-home', 'pi-map-marker', 'pi-calendar', 'pi-chart-bar'];
      const expectedLabels = ['Home', 'Map', 'Calendar', 'Graphics'];

      links.forEach((link: HTMLElement, index: number) => {
        const icon = link.querySelector('i');
        expect(icon).toBeTruthy();
        expect(icon?.className).toContain('pi');
        expect(icon?.className).toContain(expectedIcons[index]);

        const span = link.querySelector('.nav-label');
        expect(span?.textContent?.trim()).toBe(expectedLabels[index]);
      });
    });

  });

  describe('Auth signal', () => {

    it('should expose isLogged signal', () => {
      expect(isSignal(component.isLogged)).toBeTrue();
      expect(component.isLogged()).toBeFalse();
    });

    it('should react to isLogged changes', () => {
      component.isLogged = signal(true);
      fixture.detectChanges();

      let linksList = fixture.nativeElement.querySelector('.navbar__links');
      expect(linksList).toBeTruthy();

      component.isLogged = signal(false);
      fixture.detectChanges();

      linksList = fixture.nativeElement.querySelector('.navbar__links');
      expect(linksList).toBeFalsy();
    });

  });

  describe('Navigation interactions', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  });

});
