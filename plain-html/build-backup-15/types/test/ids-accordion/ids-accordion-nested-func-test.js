/**
 * @jest-environment jsdom
 */
import '../../src/components/ids-accordion/ids-accordion';
import '../../src/components/ids-icon/ids-icon';
import '../../src/components/ids-text/ids-text';
import createFromTemplate from '../helpers/create-from-template';
import processAnimFrame from '../helpers/process-anim-frame';
const createAccordion = async (accordion, variant) => {
    const variantProp = variant ? ` colorVariant="${variant}"` : '';
    accordion = await createFromTemplate(accordion, `<ids-accordion${variantProp}>
    <ids-accordion-panel id="employee">
      <ids-accordion-header slot="header">
        <ids-icon icon="user" size="medium"></ids-icon>
        <ids-text font-size="16">Employee</ids-text>
      </ids-accordion-header>
      <ids-accordion-panel slot="content" id="my-profile">
        <ids-accordion-header slot="header">
          <ids-text font-size="14">My Profile</ids-text>
        </ids-accordion-header>
      </ids-accordion-panel>
      <ids-accordion-panel slot="content" id="talent-profile">
        <ids-accordion-header slot="header">
          <ids-text font-size="14">Talent Profile</ids-text>
        </ids-accordion-header>
      </ids-accordion-panel>
      <ids-accordion-panel slot="content" id="view-compensation">
        <ids-accordion-header slot="header">
          <ids-text font-size="14">View Compensation</ids-text>
        </ids-accordion-header>
      </ids-accordion-panel>
      <ids-accordion-panel slot="content" id="rave">
        <ids-accordion-header slot="header">
          <ids-text font-size="14">RAVE</ids-text>
        </ids-accordion-header>
      </ids-accordion-panel>
      <ids-accordion-panel slot="content" id="request-time-off">
        <ids-accordion-header slot="header">
          <ids-text font-size="14">Request Time Off</ids-text>
        </ids-accordion-header>
      </ids-accordion-panel>
      <ids-accordion-panel slot="content" id="benefits" expander-type="plus-minus">
        <ids-accordion-header slot="header">
          <ids-text font-size="14">Benefits</ids-text>
        </ids-accordion-header>
        <ids-accordion-panel slot="content" id="my-benefits">
          <ids-accordion-header slot="header">
            <ids-text font-size="14">My Benefits</ids-text>
          </ids-accordion-header>
        </ids-accordion-panel>
        <ids-accordion-panel slot="content" id="dependents-beneficiaries">
          <ids-accordion-header slot="header">
            <ids-text font-size="14">Dependents and Beneficiaries</ids-text>
          </ids-accordion-header>
        </ids-accordion-panel>
        <ids-accordion-panel slot="content" id="life-events">
          <ids-accordion-header slot="header">
            <ids-text font-size="14">Life Events</ids-text>
          </ids-accordion-header>
        </ids-accordion-panel>
        <ids-accordion-panel slot="content" id="benefits-information">
          <ids-accordion-header slot="header">
            <ids-text font-size="14">Benefits Information</ids-text>
          </ids-accordion-header>
        </ids-accordion-panel>
      </ids-accordion-panel>
      <ids-accordion-panel slot="content" id="my-rewards">
        <ids-accordion-header slot="header">
          <ids-text font-size="14">My Rewards</ids-text>
        </ids-accordion-header>
      </ids-accordion-panel>
      <ids-accordion-panel slot="content" id="find-coworker">
        <ids-accordion-header slot="header">
          <ids-text font-size="14">Find a Coworker</ids-text>
        </ids-accordion-header>
      </ids-accordion-panel>
      <ids-accordion-panel slot="content" id="my-growth">
        <ids-accordion-header slot="header">
          <ids-text font-size="14">My Growth</ids-text>
        </ids-accordion-header>
      </ids-accordion-panel>
    </ids-accordion-panel>
  </ids-accordion>`);
    return accordion;
};
describe('IdsAccordion Component (nested)', () => {
    let accordion;
    beforeEach(async () => {
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
        accordion = await createAccordion(accordion);
        await processAnimFrame();
    });
    afterEach(async () => {
        accordion.remove();
        accordion = null;
        await processAnimFrame();
    });
    it('renders with no errors', async () => {
        const errors = jest.spyOn(global.console, 'error');
        accordion.remove();
        accordion = await createAccordion(accordion);
        expect(document.querySelectorAll('ids-accordion').length).toEqual(1);
        expect(errors).not.toHaveBeenCalled();
    });
    it('can navigate nested accordion panels', () => {
        const employeePanel = accordion.querySelector('#employee');
        employeePanel.focus();
        // If header is not expanded, navigation simply loops back to the currently-focused pane
        let next = accordion.navigate(1);
        expect(next.isEqualNode(employeePanel)).toBeTruthy();
        // Expand and navigate to "My Profile" (2nd level accordion pane)
        employeePanel.expanded = true;
        const myProfilePanel = accordion.querySelector('#my-profile');
        next = accordion.navigate(1);
        expect(next.isEqualNode(myProfilePanel)).toBeTruthy();
        // Loop comnpletely around back to "My Profile"
        next = accordion.navigate(10);
        expect(next.isEqualNode(myProfilePanel)).toBeTruthy();
        // Expand the "benefits" panel and try looping again
        const benefitsPanel = accordion.querySelector('#benefits');
        benefitsPanel.expanded = true;
        next = accordion.navigate(14);
        expect(next.isEqualNode(myProfilePanel)).toBeTruthy();
        // Go Backwards and focus the "Employee" panel
        const prev = accordion.navigate(-15);
        expect(prev.isEqualNode(employeePanel)).toBeTruthy();
    });
    it('has panels that are aware of their parent panels', () => {
        const benefitsPanel = accordion.querySelector('#benefits');
        expect(benefitsPanel.hasParentPanel).toBeTruthy();
    });
    it('can identify nested panels', () => {
        const benefitsInfoPanel = accordion.querySelector('#benefits-information');
        expect(benefitsInfoPanel.nested).toBeTruthy();
        const employeePanel = accordion.querySelector('#employee');
        expect(employeePanel.nested).toBeFalsy();
    });
    it('can describe if its parent panel is expanded', () => {
        const benefitsPanel = accordion.querySelector('#benefits');
        expect(benefitsPanel.parentExpanded).toBeFalsy();
        const employeePanel = accordion.querySelector('#employee');
        employeePanel.expanded = true;
        expect(benefitsPanel.parentExpanded).toBeTruthy();
    });
    it('can change its headers\' expander type', () => {
        const benefitsPanel = accordion.querySelector('#benefits');
        const benefitsHeader = benefitsPanel.header;
        // Change to the "plus-minus" type
        benefitsHeader.toggleExpanderIcon(true);
        benefitsHeader.expanderType = 'plus-minus';
        // Expand the panel, and the icon should change
        benefitsPanel.expanded = true;
        // Try setting a type that isn't possible (defaults to `caret`)
        benefitsPanel.expanderType = 'junk';
        expect(benefitsHeader.expanderType).toBe('plus-minus');
    });
    it('can change alignment types', () => {
        const benefitsPanel = accordion.querySelector('#benefits');
        benefitsPanel.contentAlignment = 'has-icon';
        expect(benefitsPanel.container.classList.contains('has-icon')).toBeTruthy();
        // Tests empty/null
        benefitsPanel.contentAlignment = '';
        expect(benefitsPanel.container.classList.contains('has-icon')).toBeFalsy();
        // Test unchanging condition
        benefitsPanel.contentAlignment = '';
        expect(benefitsPanel.container.classList.contains('has-icon')).toBeFalsy();
    });
});
//# sourceMappingURL=ids-accordion-nested-func-test.js.map