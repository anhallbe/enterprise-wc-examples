/**
 * @jest-environment jsdom
 */
import IdsAlert from '../../src/components/ids-alert/ids-alert';
describe('IdsAlert Component', () => {
    let el;
    let rootEl;
    beforeEach(() => {
        el = new IdsAlert();
        el.icon = 'success';
        document.body.appendChild(el);
    });
    afterEach(() => {
        document.body.innerHTML = '';
    });
    it('renders with no errors', () => {
        const errors = jest.spyOn(global.console, 'error');
        el.remove();
        el = new IdsAlert();
        document.body.appendChild(el);
        expect(document.querySelectorAll('ids-alert').length).toEqual(1);
        expect(errors).not.toHaveBeenCalled();
    });
    it('renders correctly', () => {
        expect(el.outerHTML).toMatchSnapshot();
        el.icon = 'info';
        expect(el.outerHTML).toMatchSnapshot();
        el.icon = 'new';
        expect(el.outerHTML).toMatchSnapshot();
    });
    it('renders icon setting', () => {
        el.icon = 'success';
        expect(el.icon).toEqual('success');
        expect(el.getAttribute('icon')).toEqual('success');
        el.icon = 'info';
        expect(el.icon).toEqual('info');
        expect(el.getAttribute('icon')).toEqual('info');
    });
    it('renders icon info then removes it', () => {
        el = new IdsAlert();
        document.body.appendChild(el);
        el.icon = 'info';
        expect(el.icon).toEqual('info');
        rootEl = el.shadowRoot?.querySelector('ids-icon');
        expect(rootEl.icon).toBe('info');
        el.icon = null;
        expect(el.icon).toEqual(null);
    });
    it('renders icon success then removes it', () => {
        el = new IdsAlert();
        document.body.appendChild(el);
        el.icon = 'success';
        expect(el.icon).toEqual('success');
        rootEl = el.shadowRoot?.querySelector('ids-icon');
        expect(rootEl.icon).toBe('success');
        el.icon = null;
        expect(el.icon).toEqual(null);
    });
    it('renders a new icon type and then removes it', () => {
        el = new IdsAlert();
        document.body.appendChild(el);
        el.icon = 'add';
        expect(el.icon).toEqual('add');
        rootEl = el.shadowRoot?.querySelector('ids-icon');
        expect(rootEl.icon).toBe('add');
        el.icon = null;
        expect(el.icon).toEqual(null);
    });
    it('should disable and enable', () => {
        let icon = el.shadowRoot?.querySelector('ids-icon');
        expect(el.getAttribute('disabled')).toEqual(null);
        expect(icon?.classList).not.toContain('disabled');
        el.disabled = 'true';
        icon = el.shadowRoot?.querySelector('ids-icon');
        expect(el.getAttribute('disabled')).toEqual('true');
        expect(icon?.classList).toContain('disabled');
        el.disabled = 'false';
        icon = el.shadowRoot?.querySelector('ids-icon');
        expect(el.getAttribute('disabled')).toEqual(null);
        expect(icon?.classList).not.toContain('disabled');
    });
    it('supports setting mode', () => {
        el.mode = 'dark';
        expect(el.container?.getAttribute('mode')).toEqual('dark');
    });
    it('supports setting size', () => {
        expect(el.size).toEqual('normal');
        el.size = 'small';
        expect(el.size).toEqual('small');
        el.size = '';
        expect(el.size).toEqual('normal');
    });
});
//# sourceMappingURL=ids-alert-func-test.js.map