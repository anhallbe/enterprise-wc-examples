/**
 * @jest-environment jsdom
 */
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsTreeMap from '../../src/components/ids-treemap/ids-treemap';
import '../helpers/resize-observer-mock';
describe('IdsTreemap Component initialization', () => {
    let container;
    const setupComponent = (component) => {
        component.title = 'Storage Utilization (78 GB)';
    };
    const checkProperties = (component) => {
        expect(component.title).toEqual('Storage Utilization (78 GB)');
    };
    beforeEach(() => {
        container = new IdsContainer();
        document.body.appendChild(container);
    });
    afterEach(() => {
        document.body.innerHTML = '';
    });
    it('can render via document.createElement (append early)', () => {
        const component = document.createElement('ids-treemap');
        container.appendChild(component);
        setupComponent(component);
        checkProperties(component);
    });
    it('can render via document.createElement (append late)', () => {
        const component = document.createElement('ids-treemap');
        setupComponent(component);
        container.appendChild(component);
        checkProperties(component);
    });
    it('can render html template', () => {
        container.insertAdjacentHTML('beforeend', `<ids-treemap title="Storage Utilization (78 GB)"></ids-treemap>`);
        const component = document.querySelector('ids-treemap');
        checkProperties(component);
    });
});
describe('IdsTreeMap Component', () => {
    let treemap;
    let origInnerWidth;
    beforeEach(() => {
        treemap = new IdsTreeMap();
        document.body.appendChild(treemap);
        treemap.data = treemap.treeMap({
            data: [
                {
                    value: 28,
                    color: '#003876',
                    text: 'JSON',
                    label: '28%'
                },
                {
                    value: 18,
                    color: '#004A99',
                    text: 'PDF',
                    label: '18%'
                },
            ],
            height: 300
        });
        origInnerWidth = treemap.container?.offsetWidth;
    });
    afterEach(() => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: origInnerWidth,
            writable: true
        });
        document.body.innerHTML = '';
    });
    it('renders with no errors', () => {
        const errors = jest.spyOn(global.console, 'error');
        const elem = new IdsTreeMap();
        document.body.appendChild(elem);
        elem.remove();
        expect(document.querySelectorAll('ids-treemap').length).toEqual(1);
        expect(errors).not.toHaveBeenCalled();
    });
    it('renders correctly', () => {
        treemap.title = 'Storage Utilization (78 GB)';
        expect(treemap.outerHTML).toMatchSnapshot();
        expect(treemap.data).toBeDefined();
    });
    it('can set the treemap title', () => {
        expect(treemap.title).toBe('');
        expect(treemap.getAttribute('title')).toBe(null);
        treemap.title = 'Storage Utilization (78 GB)';
        expect(treemap.title).toBe('Storage Utilization (78 GB)');
        expect(treemap.getAttribute('title')).toBe('Storage Utilization (78 GB)');
        treemap.removeAttribute('title');
        expect(treemap.title).toBe('');
        expect(treemap.getAttribute('title')).toBe(null);
    });
    it('can set the treemap height', () => {
        treemap.height = 300;
        expect(treemap.height).toBe(300);
    });
    it('can set the treemap width', async () => {
        treemap.title = 'Storage Utilization (78 GB)';
        treemap.width = treemap.container?.offsetWidth;
        expect(treemap.width).toBe(treemap.container?.offsetWidth);
    });
});
//# sourceMappingURL=ids-treemap-func.test.js.map