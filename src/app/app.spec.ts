import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Auth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';

const mockAuth = {
  onAuthStateChanged: (callback: any) => callback(null)
} as unknown as Auth;

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        RouterTestingModule
      ],
      providers: [{
        provide: Auth,
        useValue: mockAuth
      }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
