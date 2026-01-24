import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLocationButtonComponent } from './user-location-button';

describe('UserLocationButtonComponent', () => {
  let component: UserLocationButtonComponent;
  let fixture: ComponentFixture<UserLocationButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLocationButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLocationButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
