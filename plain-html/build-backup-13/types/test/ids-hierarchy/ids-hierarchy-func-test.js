/**
 * @jest-environment jsdom
 */
import processAnimFrame from '../helpers/process-anim-frame';
import IdsHierarchy from '../../src/components/ids-hierarchy/ids-hierarchy';
import IdsHierarchyItem from '../../src/components/ids-hierarchy/ids-hierarchy-item';
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsHierarchyLegend from '../../src/components/ids-hierarchy/ids-hierarchy-legend';
import IdsHierarchyLegendItem from '../../src/components/ids-hierarchy/ids-hierarchy-legend-item';
const DEFAULT_HIERARCHY_LEGEND_HTML = (`<ids-hierarchy-legend>
    <ids-hierarchy-legend-item
      text="Full Time"
      color-variant="full-time"
    ></ids-hierarchy-legend-item>
    <ids-hierarchy-legend-item
      text="Part Time"
      color-variant="part-time"
    ></ids-hierarchy-legend-item>
    <ids-hierarchy-legend-item
      text="Contractor"
      color-variant="contractor"
    ></ids-hierarchy-legend-item>
    <ids-hierarchy-legend-item
      text="Open Position"
      color-variant="open-position"
    ></ids-hierarchy-legend-item>
  </ids-hierarchy-legend>`);
const DEFAULT_HIERARCHY_HTML = (`<ids-hierarchy root-item>
      <ids-hierarchy-item id="item-1" color-variant="full-time">
      <img src="..../assets/images/images/placeholder-200x200.png" alt="item-1" slot="avatar">
      <ids-text slot="heading">Tony Cleveland</ids-text>
      <ids-text slot="subheading">Director</ids-text>
      <ids-text slot="micro">FT</ids-text>
    </ids-hierarchy-item>
    <ids-hierarchy-item id="item-2" color-variant="part-time">
      <ids-text slot="heading">Julie Dawes</ids-text>
      <ids-text slot="subheading">Records Clerk</ids-text>
      <ids-text slot="micro">PT</ids-text>
    </ids-hierarchy-item>
    <ids-hierarchy-item id="item-3" color-variant="contractor">
      <ids-text slot="heading">Kaylee Edwards</ids-text>
      <ids-text slot="subheading">Records Manager</ids-text>
      <ids-text slot="micro">C</ids-text>

      <ids-hierarchy-item id="item-4" color-variant="open-position">
        <ids-text slot="heading">Julie Dawes</ids-text>
        <ids-text slot="subheading">Records Clerk</ids-text>
        <ids-text slot="micro">OP</ids-text>

        <ids-hierarchy-item id="item-5" color-variant="contractor">
          <ids-text slot="heading">Tony Cleveland</ids-text>
          <ids-text slot="subheading">Director</ids-text>
          <ids-text slot="micro">C</ids-text>
        </ids-hierarchy-item>
      </ids-hierarchy-item>
    </ids-hierarchy-item>
  </ids-hierarchy>`);
describe('IdsHierarchy Component', () => {
    let el;
    let item;
    let container;
    let legend;
    let legendItem;
    beforeEach(async () => {
        const elem = new IdsHierarchy();
        const elemItem = new IdsHierarchyItem();
        const elemLegend = new IdsHierarchyLegend();
        const elemLegendItem = new IdsHierarchyLegendItem();
        document.body.appendChild(elem);
        document.body.appendChild(elemLegend);
        elem.appendChild(elemItem);
        elemLegend.appendChild(elemLegendItem);
        el = document.querySelector('ids-hierarchy');
        item = document.querySelector('ids-hierarchy-item');
        legend = document.querySelector('ids-hierarchy-legend');
        legendItem = document.querySelector('ids-hierarchy-legend-item');
    });
    afterEach(async () => {
        document.body.innerHTML = '';
        el = null;
        legend = null;
        legendItem = null;
    });
    const createElemViaTemplate = async (innerHTML) => {
        el?.remove?.();
        container = new IdsContainer();
        const template = document.createElement('template');
        template.innerHTML = innerHTML;
        el = template.content.childNodes[0];
        container.appendChild(el);
        document.body.appendChild(container);
        await processAnimFrame();
        return el;
    };
    const createLegendViaTemplate = async (innerHTML) => {
        legend?.remove?.();
        container = new IdsContainer();
        const template = document.createElement('template');
        template.innerHTML = innerHTML;
        legend = template.content.childNodes[0];
        container.appendChild(legend);
        document.body.appendChild(container);
        await processAnimFrame();
        return legend;
    };
    it('renders from HTML Template with no errors', async () => {
        el = await createElemViaTemplate(DEFAULT_HIERARCHY_HTML);
        const errors = jest.spyOn(global.console, 'error');
        expect(document.querySelectorAll('ids-hierarchy').length).toEqual(1);
        expect(errors).not.toHaveBeenCalled();
    });
    it('renders the legend from HTML Template with no errors', async () => {
        legend = await createLegendViaTemplate(DEFAULT_HIERARCHY_LEGEND_HTML);
        const errors = jest.spyOn(global.console, 'error');
        expect(document.querySelectorAll('ids-hierarchy-legend').length).toEqual(1);
        expect(errors).not.toHaveBeenCalled();
    });
    it('renders correctly', () => {
        expect(el.outerHTML).toMatchSnapshot();
        expect(item.outerHTML).toMatchSnapshot();
    });
    it('can set the expanded attribute', () => {
        expect(item.getAttribute('expanded')).toBe(null);
        item.setAttribute('expanded', true);
        expect(item.getAttribute('expanded')).toBe('true');
        item.expanded = null;
        expect(item.getAttribute('expanded')).toBe(null);
    });
    it('can set the expanded attribute', () => {
        expect(item.getAttribute('expanded')).toBe(null);
        item.setAttribute('expanded', true);
        expect(item.getAttribute('expanded')).toBe('true');
        item.expanded = null;
        expect(item.getAttribute('expanded')).toBe(null);
    });
    it('can set the root-item attribute', () => {
        expect(item.getAttribute('root-item')).toBe(null);
        item.setAttribute('root-item', true);
        expect(item.getAttribute('root-item')).toBe('true');
        item.rootItem = null;
        item.removeAttribute('root-item');
        expect(item.rootItem).toBe(null);
        expect(item.getAttribute('root-item')).toBe(null);
    });
    it('can set the selected attribute', () => {
        expect(item.getAttribute('selected')).toBe(null);
        item.setAttribute('selected', true);
        item.selected = true;
        expect(item.selected).toBe(true);
        expect(item.getAttribute('selected')).toBe('true');
        item.selected = null;
        expect(item.selected).toBe(false);
        expect(item.getAttribute('selected')).toBe(null);
    });
    it('can expand and collapse items when clicked', () => {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        // Expand
        item.expander.dispatchEvent(event);
        expect(item.expanded).toBe('true');
        // Collapse
        item.expander.dispatchEvent(event);
        expect(item.expanded).toBe(null);
    });
    it('can expand and collapse items when touchend', () => {
        const event = new TouchEvent('touchend', {
            touches: [{
                    identifier: 123,
                    pageX: 0,
                    pageY: 0,
                    target: item.expander,
                    clientX: 0,
                    clientY: 0,
                    force: 0,
                    radiusX: 0,
                    radiusY: 0,
                    rotationAngle: 0,
                    screenX: 0,
                    screenY: 0
                }],
            bubbles: true,
            cancelable: true,
            view: window
        });
        // Expand
        item.expander.dispatchEvent(event);
        expect(item.expanded).toBe('true');
        // Collapse
        item.expander.dispatchEvent(event);
        expect(item.expanded).toBe(null);
    });
    it('can select an item when touchstart', () => {
        const event = new TouchEvent('touchstart', {
            touches: [{
                    identifier: 123,
                    pageX: 0,
                    pageY: 0,
                    target: item.leaf,
                    clientX: 0,
                    clientY: 0,
                    force: 0,
                    radiusX: 0,
                    radiusY: 0,
                    rotationAngle: 0,
                    screenX: 0,
                    screenY: 0
                }],
            bubbles: true,
            cancelable: true,
            view: window
        });
        // Select
        item.leaf.dispatchEvent(event);
        item.selected = true;
        expect(item.selected).toBe(true);
    });
    it('checks for nested items', async () => {
        el = await createElemViaTemplate(DEFAULT_HIERARCHY_HTML);
        expect(el.container.classList.contains('has-nested-items')).toBe(false);
    });
    it('can set the legend item text attribute', () => {
        expect(legendItem.getAttribute('text')).toBe(null);
        legendItem.setAttribute('text', 'Test');
        expect(legendItem.getAttribute('text')).toBe('Test');
        legendItem.text = null;
        expect(legendItem.getAttribute('text')).toBe(null);
    });
});
//# sourceMappingURL=ids-hierarchy-func-test.js.map