/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import IdsToolbar from '../../src/components/ids-toolbar/ids-toolbar';
import '../../src/components/ids-toolbar/ids-toolbar-section';
const exampleHTML = `
  <ids-toolbar-section id="appmenu-section">
    <ids-button icon="menu" role="button" id="button-appmenu">
      <span class="audible">Application Menu Trigger</span>
    </ids-button>
  </ids-toolbar-section>
  <ids-toolbar-section id="title-section" type="title">
    <ids-text type="h3">My Toolbar</ids-text>
  </ids-toolbar-section>
  <ids-toolbar-section id="buttonset-section" type="buttonset" align="end">
    <ids-button id="button-1" role="button">
      <span>Text</span>
    </ids-button>

    <ids-menu-button role="button" id="button-2" menu="button-2-menu" dropdown-icon>
      <span>Menu</span>
    </ids-menu-button>
    <ids-popup-menu id="button-2-menu" target="#button-2">
      <ids-menu-group>
        <ids-menu-item value="1">Item One</ids-menu-item>
        <ids-menu-item value="2">Item Two</ids-menu-item>
        <ids-menu-item value="3">Item Three</ids-menu-item>
        <ids-menu-item>More Items
          <ids-popup-menu>
            <ids-menu-group>
              <ids-menu-item value="4">Item Four</ids-menu-item>
              <ids-menu-item value="4">Item Five</ids-menu-item>
              <ids-menu-item value="4">Item Six</ids-menu-item>
            </ids-menu-group>
          </ids-popup-menu>
        </ids-menu-item>
      </ids-menu-group>
    </ids-popup-menu>

    <ids-button id="button-3" disabled>
      <span class="audible">Settings</span>
      <ids-icon icon="settings"></ids-icon>
    </ids-button>

    <ids-button id="button-4">
      <span class="audible">Trash</span>
      <ids-icon icon="delete"></ids-icon>
    </ids-button>
  </ids-toolbar-section>

  <ids-toolbar-more-actions id="section-more">
    <ids-menu-group>
      <ids-menu-item value="1">Option One</ids-menu-item>
      <ids-menu-item value="2">Option Two</ids-menu-item>
      <ids-menu-item value="3">Option Three</ids-menu-item>
      <ids-menu-item>More Options
        <ids-popup-menu>
          <ids-menu-group>
            <ids-menu-item value="4">Option Four</ids-menu-item>
            <ids-menu-item value="5">Option Five</ids-menu-item>
            <ids-menu-item value="6">Option Six</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      </ids-menu-item>
    </ids-menu-group>
  </ids-toolbar-more-actions>
`;
describe('IdsToolbarSection Component', () => {
    let toolbar;
    let sectionAppMenu;
    let sectionTitle;
    let sectionButtonset;
    beforeEach(async () => {
        const elem = new IdsToolbar();
        document.body.appendChild(elem);
        toolbar = document.querySelector('ids-toolbar');
        toolbar.insertAdjacentHTML('afterbegin', exampleHTML);
        // Reference sections/items
        sectionAppMenu = document.querySelector('#appmenu-section');
        sectionTitle = document.querySelector('#title-section');
        sectionButtonset = document.querySelector('#buttonset-section');
    });
    afterEach(async () => {
        document.body.innerHTML = '';
    });
    it('has items', () => {
        const items = sectionButtonset.items;
        expect(items.length).toBe(4);
    });
    it('has a parent toolbar reference', () => {
        expect(sectionButtonset.toolbar instanceof IdsToolbar).toBeTruthy();
    });
    it('can have a specified type', () => {
        expect(sectionAppMenu.type).toBe('static');
        expect(sectionTitle.type).toBe('title');
        expect(sectionButtonset.type).toBe('buttonset');
        sectionAppMenu.type = 'fluid';
        expect(sectionAppMenu.type).toBe('fluid');
        sectionAppMenu.type = 'search';
        expect(sectionAppMenu.type).toBe('search');
        // Setting a junk value defaults `type` to `static`
        sectionAppMenu.type = 'junk';
        expect(sectionAppMenu.type).toBe('static');
    });
    it('can be aligned', () => {
        expect(sectionTitle.align).toBe('start');
        expect(sectionButtonset.align).toBe('end');
        sectionTitle.align = 'center';
        expect(sectionTitle.align).toBe('center');
        // Setting a junk value defaults to `align-start`, but removes the attribute
        sectionTitle.align = 'junk';
        expect(sectionTitle.align).toBe('start');
        expect(sectionTitle.getAttribute('align')).toBe(null);
    });
    it('can be favored', () => {
        sectionTitle.favor = true;
        expect(sectionTitle.container.classList.contains('favor')).toBeTruthy();
        sectionTitle.favor = false;
        sectionButtonset.favor = true;
        expect(sectionTitle.container.classList.contains('favor')).toBeFalsy();
        expect(sectionButtonset.container.classList.contains('favor')).toBeTruthy();
    });
});
//# sourceMappingURL=ids-toolbar-section-func-test.js.map