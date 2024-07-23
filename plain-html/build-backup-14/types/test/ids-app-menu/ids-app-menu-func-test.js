/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../../src/components/ids-app-menu/ids-app-menu';
import '../../src/components/ids-accordion/ids-accordion';
import '../../src/components/ids-button/ids-button';
import '../../src/components/ids-search-field/ids-search-field';
import '../../src/components/ids-toolbar/ids-toolbar';
import '../../src/components/ids-text/ids-text';
import createFromTemplate from '../helpers/create-from-template';
import waitForTimeout from '../helpers/wait-for-timeout';
const createAppMenu = async (appMenu) => {
    appMenu = await createFromTemplate(appMenu, `<ids-app-menu id="app-menu">
   <img slot="avatar" src="/assets/avatar-placeholder.jpg" alt="Picture of Richard Fairbanks" />
   <ids-text slot="username" font-size="24" font-weight="bold">Richard Fairbanks</ids-text>
   <ids-search-field id="search" slot="search" label=""></ids-search-field>
   <ids-accordion>
     <ids-accordion-panel id="p1">
       <ids-accordion-header id="h1" slot="header">
         <ids-text>First Pane</ids-text>
       </ids-accordion-header>
     </ids-accordion-panel>
     <ids-accordion-panel id="p2">
       <ids-accordion-header id="h2" slot="header">
         <ids-text>Second Pane</ids-text>
       </ids-accordion-header>
     </ids-accordion-panel>
     <ids-accordion-panel id="p3">
       <ids-accordion-header id="h3" slot="header">
         <ids-text>Third Pane</ids-text>
       </ids-accordion-header>
       <ids-accordion-panel slot="content" id="sp1">
         <ids-accordion-header id="sh1" slot="header">
           <ids-text font-size="14">Sub-Pane 1</ids-text>
         </ids-accordion-header>
       </ids-accordion-panel>
       <ids-accordion-panel slot="content" id="sp2">
         <ids-accordion-header id="sh2" slot="header">
           <ids-text font-size="14">Sub-Pane 2</ids-text>
         </ids-accordion-header>
       </ids-accordion-panel>
       <ids-accordion-panel slot="content" id="sp3">
         <ids-accordion-header id="sh3" slot="header">
           <ids-text font-size="14">Sub-Pane 3</ids-text>
         </ids-accordion-header>
       </ids-accordion-panel>
     </ids-accordion-panel>
   </ids-accordion>
 </ids-app-menu>`);
    return appMenu;
};
describe('IdsAppMenu Component (rendering)', () => {
    let appMenuElem;
    it('renders with no errors', async () => {
        const errors = jest.spyOn(global.console, 'error');
        // Build and destroy an App Menu
        appMenuElem = await createAppMenu(appMenuElem);
        expect(errors).not.toHaveBeenCalled();
    });
});
describe('IdsAppMenu Component', () => {
    let appMenuElem;
    beforeEach(async () => {
        appMenuElem = await createAppMenu(appMenuElem);
    });
    afterEach(async () => {
        document.body.innerHTML = '';
    });
    it('has default settings', async () => {
        expect(appMenuElem.type).toBe('app-menu');
        expect(appMenuElem.edge).toBe('start');
    });
    it('should convert inner accordions to use the "app-menu" color variant', async () => {
        const acc = appMenuElem.querySelector('ids-accordion');
        waitForTimeout(() => expect(acc.colorVariant).toBe('app-menu'));
    });
    it('can close by pressing the escape key', () => {
        const closeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
        // Open the Menu
        appMenuElem.show();
        waitForTimeout(() => expect(appMenuElem.visible).toBeTruthy());
        // Focus the first header and "Press Escape"
        const header1 = document.querySelector('#h1');
        header1.focus();
        header1.dispatchEvent(closeEvent);
        waitForTimeout(() => expect(appMenuElem.visible).toBeFalsy());
        // Dispatch again while closed (coverage)
        header1.dispatchEvent(closeEvent);
        waitForTimeout(() => expect(appMenuElem.visible).toBeFalsy());
    });
    it('wont close by pressing any key but escape', () => {
        const closeEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
        // Open the Menu
        appMenuElem.show();
        waitForTimeout(() => expect(appMenuElem.visible).toBeTruthy());
        // Focus the first header and "Press Escape"
        const header1 = document.querySelector('#h1');
        header1.focus();
        header1.dispatchEvent(closeEvent);
        waitForTimeout(() => expect(appMenuElem.visible).toBeTruthy());
        // Dispatch again while closed (coverage)
        header1.dispatchEvent(closeEvent);
        waitForTimeout(() => expect(appMenuElem.visible).toBeTruthy());
    });
    it('provides an API for its accordion element', async () => {
        expect(appMenuElem.accordion?.name).toBe('ids-accordion');
    });
    it('filters its navigation accordion when the search field is used', async () => {
        const searchField = appMenuElem.querySelector('#search');
        expect(searchField).toBeDefined();
        // Filter for a top-level match...
        searchField.value = 'Second';
        // ...all but "Second Pane" are hidden
        let hiddenEls = appMenuElem.querySelectorAll('[hidden-by-filter]');
        expect(hiddenEls.length).toBe(5);
        // Clear filter by clearing the search field value...
        searchField.value = '';
        // ...no headers should be filtered out
        hiddenEls = appMenuElem.querySelectorAll('[hidden-by-filter]');
        expect(hiddenEls.length).toBe(0);
        // Filter for a child match...
        searchField.value = 'Sub-Pane';
        // ...one header should be tagged as having a child match
        hiddenEls = appMenuElem.querySelectorAll('[hidden-by-filter]');
        expect(hiddenEls.length).toBe(3);
        expect(document.querySelector('#h3')?.hasAttribute('child-filter-match')).toBeTruthy();
    });
    it('filters its navigation using its API', async () => {
        const searchField = appMenuElem.querySelector('#search');
        expect(searchField).toBeDefined();
        // Filter for a top-level match...
        appMenuElem.filterAccordion('Second');
        // ...all but "Second Pane" are hidden
        let hiddenEls = appMenuElem.querySelectorAll('[hidden-by-filter]');
        expect(hiddenEls.length).toBe(5);
        // Clear filter by clearing the search field value...
        appMenuElem.clearFilterAccordion();
        // ...no headers should be filtered out
        hiddenEls = appMenuElem.querySelectorAll('[hidden-by-filter]');
        expect(hiddenEls.length).toBe(0);
        // Filter for a child match...
        appMenuElem.filterAccordion('Sub-Pane');
        // ...one header should be tagged as having a child match
        hiddenEls = appMenuElem.querySelectorAll('[hidden-by-filter]');
        expect(hiddenEls.length).toBe(3);
        expect(document.querySelector('#h3').hasAttribute('child-filter-match')).toBeTruthy();
        // Edge cases
        appMenuElem.querySelectorAll('ids-accordion-panel').forEach((panel) => {
            panel.remove();
        });
        appMenuElem.filterAccordion('');
        appMenuElem.accordion?.remove();
        appMenuElem.filterAccordion('');
    });
});
//# sourceMappingURL=ids-app-menu-func-test.js.map