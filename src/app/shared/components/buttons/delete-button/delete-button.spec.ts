import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteButtonComponent } from './delete-button';

describe('DeleteButtonComponent', () => {
  let component: DeleteButtonComponent;
  let fixture: ComponentFixture<DeleteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a delete output', () => {
    expect(component.delete).toBeTruthy();
  });

  it('should emit delete event when onClick is called', () => {
    spyOn(component.delete, 'emit');
    component.onClick();

    expect(component.delete.emit).toHaveBeenCalled();
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
