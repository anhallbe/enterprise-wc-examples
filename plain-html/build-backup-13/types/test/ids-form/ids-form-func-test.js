/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import IdsForm from '../../src/components/ids-form/ids-form';
import IdsInput from '../../src/components/ids-input/ids-input';
import IdsCheckbox from '../../src/components/ids-checkbox/ids-checkbox';
import IdsButton from '../../src/components/ids-button/ids-button';
describe('IdsForm Component', () => {
    let form;
    let field1;
    let field2;
    let check1;
    let submitButton;
    beforeEach(async () => {
        const elem = new IdsForm();
        elem.name = 'my-form';
        document.body.appendChild(elem);
        form = document.querySelector('ids-form');
        field1 = new IdsInput();
        field2 = new IdsInput();
        check1 = new IdsCheckbox();
        submitButton = new IdsButton();
        submitButton.id = 'btn-submit';
        form.appendChild(field1);
        field1.dirtyTracker = true;
        field1.validate = 'required';
        form.appendChild(field2);
        field2.dirtyTracker = true;
        field2.validate = 'required';
        form.appendChild(submitButton);
        form.appendChild(check1);
        check1.dirtyTracker = true;
        check1.validate = 'required';
        elem.submitButton = 'btn-submit';
    });
    afterEach(async () => {
        document.body.innerHTML = '';
    });
    it('renders with no errors', () => {
        const errors = jest.spyOn(global.console, 'error');
        const elem = new IdsForm();
        document.body.appendChild(elem);
        elem.remove();
        expect(document.querySelectorAll('ids-form').length).toEqual(1);
        expect(errors).not.toHaveBeenCalled();
    });
    it('renders with compact', () => {
        expect(form.compact).toEqual(false);
        form.compact = true;
        expect(form.hasAttribute('compact')).toBeTruthy();
        expect(form.compact).toEqual(true);
        expect(field1.getAttribute('compact')).toEqual('true');
        expect(field2.getAttribute('compact')).toEqual('true');
        form.compact = false;
        expect(form.getAttribute('compact')).toBeFalsy();
        expect(field1.getAttribute('compact')).toBeFalsy();
        expect(field2.getAttribute('compact')).toBeFalsy();
    });
    it('renders with fieldHeight', () => {
        form.fieldHeight = 'lg';
        expect(form.getAttribute('field-height')).toEqual('lg');
        expect(form.fieldHeight).toEqual('lg');
        expect(field1.getAttribute('field-height')).toEqual('lg');
        expect(field2.getAttribute('field-height')).toEqual('lg');
        form.fieldHeight = 'sm';
        expect(form.getAttribute('field-height')).toEqual('sm');
        expect(field1.getAttribute('field-height')).toEqual('sm');
        expect(field2.getAttribute('field-height')).toEqual('sm');
    });
    it('renders with id', () => {
        const idString = 'ids-form-id';
        form.id = idString;
        expect(form.getAttribute('id')).toEqual(idString);
    });
    it('renders with a name', () => {
        form.name = 'ids-form-name';
        expect(form.template()).toContain('name');
        form.name = '';
        expect(form.template()).not.toContain('name');
    });
    it('renders with submit-button', () => {
        form.submitButton = 'btn-submit1';
        expect(form.getAttribute('submit-button')).toEqual('btn-submit1');
        expect(form.submitButton).toEqual('btn-submit1');
        form.submitButton = 'btn-submit';
        form.submitButton = '';
        expect(form.getAttribute('submit-button')).toBeFalsy();
        expect(form.submitButton).toEqual('');
    });
    it('fires submit on clicking submit-button', () => {
        const mockCallback = jest.fn((x) => {
            expect(x.detail.components).toBeTruthy();
        });
        form.addEventListener('submit', mockCallback);
        submitButton.click();
        expect(mockCallback.mock.calls.length).toBe(1);
    });
    it('reset dirty tracker', () => {
        field1.value = 'x';
        field2.value = 'y';
        expect(field1.isDirty).toBeTruthy();
        expect(field2.isDirty).toBeTruthy();
        expect(form.isDirty).toBeTruthy();
        form.resetDirtyTracker();
        expect(field1.isDirty).toBeFalsy();
        expect(field2.isDirty).toBeFalsy();
        expect(form.isDirty).toBeFalsy();
    });
    it('can check for isValid', () => {
        expect(form.isValid).toBe(true);
        field1.value = 'x';
        field1.value = '';
        expect(field1.isValid).toBeFalsy();
        expect(form.isValid).toBe(false);
    });
    it('can get form errors', () => {
        expect(form.errorFormComponents.length).toBe(0);
        field1.value = 'x';
        field1.value = '';
        expect(form.errorFormComponents.length).toBe(1);
    });
    it('can call checkValidation', () => {
        field1.input.checkValidation = jest.fn();
        expect(field1.isValid).toBeTruthy();
        expect(field2.isValid).toBeTruthy();
        form.checkValidation();
        expect(field1.isValid).toBeFalsy();
        expect(field2.isValid).toBeFalsy();
    });
});
//# sourceMappingURL=ids-form-func-test.js.map