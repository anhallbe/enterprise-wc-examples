/**
 * @jest-environment jsdom
 */
import processAnimFrame from '../helpers/process-anim-frame';
import IdsHidden from '../../src/components/ids-hidden/ids-hidden';
import IdsContainer from '../../src/components/ids-container/ids-container';
const DEFAULT_HIDDEN_HTML = (`<ids-hidden hide-up="sm" visible="true"></ids-hidden>`);
const DEFAULT_HIDDEN_2_HTML = (`<ids-hidden hide-down="sm" hidden></ids-hidden>`);
describe('IdsHidden Component', () => {
    let el;
    let container;
    let hidden1;
    let hidden2;
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }))
        });
    });
    const createElemViaTemplate1 = async (innerHTML) => {
        hidden1?.remove?.();
        container = new IdsContainer();
        const template = document.createElement('template');
        template.innerHTML = innerHTML;
        hidden1 = template.content.childNodes[0];
        container.appendChild(hidden1);
        document.body.appendChild(container);
        await processAnimFrame();
        return hidden1;
    };
    const createElemViaTemplate2 = async (innerHTML) => {
        hidden2?.remove?.();
        container = new IdsContainer();
        const template = document.createElement('template');
        template.innerHTML = innerHTML;
        hidden2 = template.content.childNodes[0];
        container.appendChild(hidden2);
        document.body.appendChild(container);
        await processAnimFrame();
        return hidden2;
    };
    it('renders from HTML Template with no errors', async () => {
        hidden1 = await createElemViaTemplate1(DEFAULT_HIDDEN_HTML);
        const errors = jest.spyOn(global.console, 'error');
        expect(document.querySelectorAll('ids-hidden').length).toEqual(2);
        expect(errors).not.toHaveBeenCalled();
    });
    it('renders from HTML Template 2 with no errors', async () => {
        hidden2 = await createElemViaTemplate2(DEFAULT_HIDDEN_2_HTML);
        const errors = jest.spyOn(global.console, 'error');
        expect(document.querySelectorAll('ids-hidden').length).toEqual(2);
        expect(errors).not.toHaveBeenCalled();
    });
    beforeEach(async () => {
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
        const elem = new IdsHidden();
        document.body.appendChild(elem);
        el = document.querySelector('ids-hidden');
    });
    afterEach(async () => {
        document.body.innerHTML = '';
        el = null;
        window.requestAnimationFrame.mockRestore();
    });
    it('renders correctly', () => {
        expect(el.outerHTML).toMatchSnapshot();
        el.hideDown = 'sm';
        el.hideUp = 'md';
        expect(el.outerHTML).toMatchSnapshot();
    });
    it('renders with no errors', () => {
        const errors = jest.spyOn(global.console, 'error');
        el.remove();
        el = new IdsHidden();
        document.body.appendChild(el);
        expect(document.querySelectorAll('ids-hidden').length).toEqual(1);
        expect(errors).not.toHaveBeenCalled();
    });
    it('can set the hideDown attribute', () => {
        el.hideDown = 'sm';
        el.setAttribute('hide-down', 'sm');
        expect(el.getAttribute('hide-down')).toEqual('sm');
        expect(el.hideDown).toEqual('sm');
    });
    it('can remove the hideDown attribute', () => {
        el.hideDown = 'sm';
        el.hideDown = false;
        expect(el.getAttribute('hide-down')).toBeFalsy();
    });
    it('can set the hideUp attribute', () => {
        el.hideUp = 'sm';
        el.setAttribute('hide-up', 'sm');
        expect(el.getAttribute('hide-up')).toEqual('sm');
        expect(el.hideUp).toEqual('sm');
    });
    it('can remove the hideUp attribute', () => {
        el.hideUp = 'sm';
        el.hideUp = false;
        expect(el.getAttribute('hide-up')).toBeFalsy();
    });
    it('can set the visible attribute', () => {
        expect(el.getAttribute('visible')).toBe(null);
        el.setAttribute('visible', true);
        expect(el.getAttribute('visible')).toBe('true');
        expect(el.visible).toBe('true');
        el.visible = null;
        el.removeAttribute('visible');
        expect(el.getAttribute('visible')).toBe(null);
        expect(el.visible).toBe(null);
        el.visible = true;
        expect(el.getAttribute('visible')).toBe('true');
        el.visible = false;
        expect(el.getAttribute('visible')).toBe(null);
    });
    it('should hide when media query matches', () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(() => ({ matches: true }))
        });
        const mq = window.matchMedia('(min-width: 0px)');
        el.checkScreen(mq);
        expect(el.hidden).toBeTruthy();
        expect(el.visible).toBeFalsy();
    });
    it('should hide when condition matches', () => {
        el.value = 'test';
        el.condition = 'true';
        expect(el.hidden).toBeTruthy();
        el.value = 'test';
        el.condition = 'false';
        expect(el.hidden).toBeFalsy();
        el.value = 'false';
        el.condition = 'false';
        expect(el.hidden).toBeTruthy();
        el.value = 'test-1';
        el.condition = 'test-1';
        expect(el.hidden).toBeTruthy();
        el.value = 'test-1';
        el.condition = 'test-2';
        expect(el.hidden).toBeFalsy();
        el.value = 'true';
        el.condition = 'true';
        expect(el.hidden).toBeTruthy();
        el.value = 'true';
        el.condition = 'false';
        expect(el.hidden).toBeFalsy();
        el.value = '';
        el.condition = '';
        expect(el.hidden).toBeTruthy();
    });
});
//# sourceMappingURL=ids-hidden-func-test.js.map