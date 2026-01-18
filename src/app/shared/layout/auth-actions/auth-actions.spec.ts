import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthActionsComponent } from './auth-actions';
import { Auth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';

const mockAuth = {
  onAuthStateChanged: jasmine.createSpy('onAuthStateChanged')
} as unknown as Auth;

describe('AuthActionsComponent', () => {
  let component: AuthActionsComponent;
  let fixture: ComponentFixture<AuthActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuthActionsComponent,
        RouterTestingModule
      ],
      providers: [{
        provide: Auth,
        useValue: mockAuth
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
