/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/match-media-mock';
import createFromTemplate from '../helpers/create-from-template';
import wait from '../helpers/wait';
import IdsActionPanel from '../../src/components/ids-action-panel/ids-action-panel';
import '../../src/components/ids-button/ids-button';
import '../../src/components/ids-toolbar/ids-toolbar';
describe('IdsActionPanel Component', () => {
    let cap;
    beforeEach(async () => {
        cap = new IdsActionPanel();
        document.body.appendChild(cap);
    });
    afterEach(async () => {
        document.body.innerHTML = '';
        cap = null;
    });
    it('renders with no errors', () => {
        const errors = jest.spyOn(global.console, 'error');
        const elem = new IdsActionPanel();
        document.body.appendChild(elem);
        elem.remove();
        expect(document.querySelectorAll('ids-action-panel').length).toEqual(1);
        expect(errors).not.toHaveBeenCalled();
    });
    it.skip('responds to its normal buttons\' clicks', async () => {
        // Insert a header toolbar
        cap.insertAdjacentHTML('afterbegin', `<ids-toolbar slot="toolbar">
      <ids-toolbar-section type="title">
        <ids-text font-size="20" type="h2">Company Information</ids-text>
      </ids-toolbar-section>

      <ids-toolbar-section type="buttonset" align="end">
        <ids-button id="btn-save" icon="save" no-padding>
          <ids-text font-weight="bold">Save</ids-text>
        </ids-button>
        <ids-separator vertical="true"></ids-separator>
        <ids-button id="btn-close" icon="close" no-padding>
          <ids-text font-weight="bold">Close</ids-text>
        </ids-button>
      </ids-toolbar-section>
    </ids-toolbar>`);
        // Setup a button click handler
        cap.popup.animated = false;
        cap.onButtonClick = () => { cap.hide(); };
        const clickEvent = new MouseEvent('click', { bubbles: true });
        // Show the CAP
        await cap.show();
        await wait(310);
        // Click the first CAP button. The above handler should fire.
        cap.querySelector('#btn-save')?.dispatchEvent(clickEvent);
        await wait(310);
        expect(cap.visible).toBeFalsy();
    });
    it('renders with toolbar and buttons', () => {
        cap = createFromTemplate(cap, `<ids-action-panel>
      <ids-toolbar slot="toolbar">
        <ids-toolbar-section type="title">
          <ids-text font-size="20" type="h2">Company Information</ids-text>
        </ids-toolbar-section>
      </ids-toolbar>
    </ids-action-panel>`);
        cap.template();
        expect(cap.toolbar).toBeTruthy();
        expect(cap.buttons).toBeTruthy();
        expect(cap.template()).toContain('toolbar');
    });
    it('renders with no toolbar and buttons', () => {
        cap = createFromTemplate(cap, `<ids-action-panel id="cap-company-info"></ids-action-panel>`);
        cap.template();
        expect(cap.toolbar).toBeFalsy();
        expect(cap.buttons.length).toBe(0);
    });
    it('can prevent being opened with the `beforeshow` event', async () => {
        cap.addEventListener('beforeshow', (e) => {
            e.detail.response(false);
        });
        await cap.show();
        expect(cap.visible).toEqual(false);
    });
    it('can prevent being closed with the `beforehide` event', async () => {
        cap.addEventListener('beforehide', (e) => {
            e.detail.response(false);
        });
        await cap.show();
        await wait(110);
        await cap.hide();
        await wait(110);
        expect(cap.visible).toBeTruthy();
    });
    it('supports setting mode', () => {
        cap.mode = 'dark';
        expect(cap.container?.getAttribute('mode')).toEqual('dark');
    });
    it('should be able to set attributes before append', async () => {
        const elem = new IdsActionPanel();
        elem.id = 'test';
        document.body.appendChild(elem);
        expect(elem.getAttribute('id')).toEqual('test');
    });
    it('should be able to set attributes after append', async () => {
        const elem = new IdsActionPanel();
        document.body.appendChild(elem);
        elem.id = 'test';
        expect(elem.getAttribute('id')).toEqual('test');
    });
});
//# sourceMappingURL=ids-action-panel-func-test.js.map