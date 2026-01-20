import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLocationButton } from './user-location-button';

describe('UserLocationButton', () => {
  let component: UserLocationButton;
  let fixture: ComponentFixture<UserLocationButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLocationButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLocationButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
