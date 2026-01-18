import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditButtonComponent } from './edit-button';

describe('EditButtonComponent', () => {
  let component: EditButtonComponent;
  let fixture: ComponentFixture<EditButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an edit output', () => {
    expect(component.edit).toBeTruthy()
  });

  it('should emit edit event when onClick is called', () => {
    const spyEdit = spyOn(component.edit, 'emit');
    component.onClick();
    expect(spyEdit).toHaveBeenCalled();
  });

  it('should call onClick when button is clicked', () => {
    const spyButton = spyOn(component, 'onClick');
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();
    expect(spyButton).toHaveBeenCalled();
  });

  it('should have aria-label for accessibility', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBeTruthy();
  });
});
