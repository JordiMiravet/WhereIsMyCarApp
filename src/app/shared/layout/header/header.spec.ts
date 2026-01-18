import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header';
import { Auth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';

const mockAuth = {
  onAuthStateChanged: jasmine.createSpy('onAuthStateChanged')
} as unknown as Auth;

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
        provide: Auth,
        useValue: mockAuth
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
