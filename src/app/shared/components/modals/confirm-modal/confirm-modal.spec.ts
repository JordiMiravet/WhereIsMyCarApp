import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Template rendering', () => {

    it('should render the title input in the modal', () => {
      const title: HTMLElement = fixture.nativeElement.querySelector('#confirm-modal__modal-title');
      expect(title.textContent?.trim()).toBe(component.title());
    });

    it('should render the message input in the modal', () => {
      const message: HTMLElement = fixture.nativeElement.querySelector('#confirm-modal__modal-message');
      expect(message.textContent?.trim()).toBe(component.message());
    });

    it('should call onConfirm when Confirm button is clicked', () => {
      const spyConfirm = spyOn(component, 'onConfirm');

      const confirmButton = fixture.nativeElement.querySelector('#confirm-modal__button-confirm');
      confirmButton.click();

      expect(spyConfirm).toHaveBeenCalled();
    });

    it('should call onCancel when Cancel button is clicked', () => {
      const spyCancel = spyOn(component, 'onCancel');

      const cancelButton = fixture.nativeElement.querySelector('#confirm-modal__button-cancel');
      cancelButton.click();

      expect(spyCancel).toHaveBeenCalled();
    });

    it('should call onCancel when clicking on modal background', () => {
      const spyCancel = spyOn(component, 'onCancel');

      const modalDiv = fixture.nativeElement.querySelector('.modal__overlay');
      modalDiv.click();

      expect(spyCancel).toHaveBeenCalled();
    });

    it('should NOT call onCancel when clicking inside modal form', () => {
      const spyCancel = spyOn(component, 'onCancel');

      const modalForm = fixture.nativeElement.querySelector('.modal__form');
      modalForm.click();

      expect(spyCancel).not.toHaveBeenCalled();
    });

  });

  describe('Output: confirm', () => {

    it('should emit confirm event when onConfirm is called', () => {
      const spyConfirm = spyOn(component.confirm, 'emit');
      component.onConfirm();

      expect(spyConfirm).toHaveBeenCalled();
    });

    it('should emit confirm event when Confirm button is clicked', () => {
      const spyConfirm = spyOn(component.confirm, 'emit');

      const confirmButton = fixture.nativeElement.querySelector('#confirm-modal__button-confirm');
      confirmButton.click();

      expect(spyConfirm).toHaveBeenCalled();
    });

  });

  describe('Output: cancel', () => {

    it('should emit cancel event when onCancel is called', () => {
      const spyCancel = spyOn(component.cancel, 'emit');
      component.onCancel();

      expect(spyCancel).toHaveBeenCalled();
    });

    it('should emit cancel event when clicking on modal background', () => {
      const spyCancel = spyOn(component.cancel, 'emit');

      const modalDiv = fixture.nativeElement.querySelector('.modal__overlay');
      modalDiv.click();

      expect(spyCancel).toHaveBeenCalled();
    });

  });

  describe('Accessibility attributes', () => {

    it('should have role dialog and aria attributes', () => {
      const modal: HTMLElement = fixture.nativeElement.querySelector('.modal__overlay');

      expect(modal.getAttribute('role')).toBe('dialog');
      expect(modal.getAttribute('aria-modal')).toBe('true');
      expect(modal.getAttribute('aria-labelledby')).toBe('confirm-modal__modal-title');
      expect(modal.getAttribute('aria-describedby')).toBe('confirm-modal__modal-message');
    });

  });

});
