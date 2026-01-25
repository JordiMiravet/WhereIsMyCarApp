import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateButtonComponent } from './create-button';

describe('CreateButtonComponent', () => {
  let component: CreateButtonComponent;
  let fixture: ComponentFixture<CreateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a create output', () => {
    expect(component.create).toBeTruthy();
  });

  it('should emit create event when onClick is called', () => {
    spyOn(component.create, 'emit')
    component.onClick();

    expect(component.create.emit).toHaveBeenCalled();
  });

  it('should call onClick when button is clicked', () => {
    spyOn(component, 'onClick');

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(component.onClick).toHaveBeenCalled()
  });

  it('should emit create event when button is clicked', () => {
    spyOn(component.create, 'emit');

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(component.create.emit).toHaveBeenCalled();
  });

  it('should have aria-label for accessibility', () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('aria-label')).toBeTruthy();
    expect(button.getAttribute('aria-label')).toBe('Create vehicle');
  });

});
