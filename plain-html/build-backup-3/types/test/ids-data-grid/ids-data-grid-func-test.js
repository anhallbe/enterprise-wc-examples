/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/canvas-mock';
import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridFormatters from '../../src/components/ids-data-grid/ids-data-grid-formatters';
import IdsContainer from '../../src/components/ids-container/ids-container';
import dataset from '../../src/assets/data/books.json';
import productsDataset from '../../src/assets/data/products.json';
import datasetTree from '../../src/assets/data/tree-buildings.json';
import processAnimFrame from '../helpers/process-anim-frame';
import createFromTemplate from '../helpers/create-from-template';
import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';
import IdsPager from '../../src/components/ids-pager/ids-pager';
import '../../src/components/ids-checkbox/ids-checkbox';
describe('IdsDataGrid Component', () => {
    let dataGrid;
    let container;
    const formatters = new IdsDataGridFormatters();
    const columns = () => {
        const cols = [];
        // Set up columns
        cols.push({
            id: 'selectionCheckbox',
            sortable: false,
            resizable: false,
            formatter: formatters.selectionCheckbox,
            align: 'center',
            width: 20
        });
        cols.push({
            id: 'rowNumber',
            name: '#',
            formatter: formatters.rowNumber,
            sortable: false,
            readonly: true,
            width: 65,
            headerIcon: 'info',
            headerIconTooltip: 'This is header icon'
        });
        cols.push({
            id: 'description',
            name: 'Description',
            field: 'description',
            sortable: true,
            formatter: formatters.text,
            editor: {
                type: 'input',
                editorSettings: {
                    autoselect: true,
                    dirtyTracker: true,
                    validate: 'required'
                }
            },
            readonly(row) {
                return row % 2 === 0;
            },
        });
        cols.push({
            id: 'ledger',
            name: 'Ledger',
            field: 'ledger',
            formatter: formatters.text
        });
        cols.push({
            id: 'publishDate',
            name: 'Pub. Date',
            field: 'publishDate',
            formatter: formatters.date,
            editor: {
                type: 'input',
                editorSettings: {
                    autoselect: true,
                    dirtyTracker: false,
                    mask: 'date'
                }
            }
        });
        cols.push({
            id: 'publishTime',
            name: 'Pub. Time',
            field: 'publishDate',
            formatter: formatters.time
        });
        cols.push({
            id: 'price',
            name: 'Price',
            field: 'price',
            formatter: formatters.decimal,
            formatOptions: { locale: 'en-US' },
            editor: {
                type: 'input',
                editorSettings: {
                    autoselect: true,
                    dirtyTracker: true,
                    mask: 'number',
                    maskOptions: {
                        allowDecimal: true,
                        integerLimit: 3,
                        decimalLimit: 2
                    },
                    validate: 'required'
                }
            }
        });
        cols.push({
            id: 'bookCurrency',
            name: 'Currency',
            field: 'bookCurrency',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.dropdown,
            editor: {
                type: 'dropdown',
                editorSettings: {
                    dirtyTracker: true,
                    options: [
                        {
                            id: '',
                            label: '',
                            value: ''
                        },
                        {
                            id: 'usd',
                            label: 'USD',
                            value: 'usd'
                        },
                        {
                            id: 'eur',
                            label: 'EUR',
                            value: 'eur'
                        },
                        {
                            id: 'yen',
                            label: 'YEN',
                            value: 'yen'
                        }
                    ]
                }
            }
        });
        cols.push({
            id: 'transactionCurrency',
            name: 'Transaction Currency',
            field: 'transactionCurrency',
            formatter: formatters.text,
        });
        cols.push({
            id: 'integer',
            name: 'Price (Int)',
            field: 'price',
            formatter: formatters.integer,
            formatOptions: { locale: 'en-US' } // Data Values are in en-US
        });
        cols.push({
            id: 'location',
            name: 'Location',
            field: 'location',
            formatter: formatters.hyperlink,
            href: '#'
        });
        cols.push({
            id: 'postHistory',
            name: 'Post History',
            field: 'postHistory',
            formatter: dataGrid.formatters.checkbox,
            align: 'center',
            editor: {
                type: 'checkbox',
                editorSettings: {
                    dirtyTracker: false,
                }
            },
        });
        cols.push({
            id: 'inStock',
            name: 'In Stock',
            field: 'inStock',
            formatter: formatters.checkbox
        });
        cols.push({
            id: 'convention',
            name: 'Convention',
            field: 'convention',
            formatter: formatters.text
        });
        cols.push({
            id: 'methodSwitch',
            name: 'Method Switch',
            field: 'methodSwitch',
            formatter: formatters.text,
            filterType: 'select'
        });
        cols.push({
            id: 'trackDeprecationHistory',
            name: 'Track Deprecation History',
            field: 'trackDeprecationHistory',
            formatter: formatters.text
        });
        cols.push({
            id: 'useForEmployee',
            name: 'Use For Employee',
            field: 'useForEmployee',
            formatter: formatters.password
        });
        cols.push({
            id: 'custom',
            name: 'Custom',
            field: 'price',
            formatter: (rowData, columnData) => {
                const value = `Custom: ${rowData[columnData.field] || '0'}`;
                return `<span class="text-ellipsis">${value}</span>`;
            },
            editor: {
                type: 'input'
            },
        });
        return cols;
    };
    beforeEach(async () => {
        // Mock the CSSStyleSheet in adoptedStyleSheets
        window.CSSStyleSheet = function CSSStyleSheet() {
            return { cssRules: [], replaceSync: () => '', insertRule: () => '' };
        };
        window.StyleSheet.insertRule = () => '';
        container = new IdsContainer();
        dataGrid = new IdsDataGrid();
        container.appendChild(dataGrid);
        document.body.appendChild(container);
        dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
        dataGrid.columns = columns();
        dataGrid.data = deepClone(dataset);
        await processAnimFrame();
        await processAnimFrame();
    });
    afterEach(async () => {
        document.body.innerHTML = '';
    });
    describe('Setup / General Tests', () => {
        it('renders with no errors', () => {
            const errors = jest.spyOn(global.console, 'error');
            const dataGrid2 = new IdsDataGrid();
            document.body.appendChild(dataGrid2);
            dataGrid2.columns = columns();
            dataGrid2.data = dataset;
            dataGrid2.remove();
            expect(document.querySelectorAll('ids-data-grid').length).toEqual(1);
            expect(errors).not.toHaveBeenCalled();
        });
        it('can null dataset returns an array', () => {
            dataGrid.datasource.data = null;
            dataGrid.data = null;
            expect(dataGrid.data).toEqual([]);
        });
        it('can set the label setting', () => {
            dataGrid.label = 'Books';
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('aria-label')).toEqual('Books');
            expect(dataGrid.getAttribute('label')).toEqual('Books');
            dataGrid.label = null;
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('aria-label')).toEqual('Data Grid');
            expect(dataGrid.getAttribute('label')).toEqual(null);
        });
        it('renders column css with adoptedStyleSheets', () => {
            document.body.innerHTML = '';
            dataGrid = new IdsDataGrid();
            document.body.appendChild(dataGrid);
            dataGrid.shadowRoot.adoptedStyleSheets = () => [window.CSSStyleSheet];
            dataGrid.columns = columns();
            dataGrid.data = dataset;
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(dataGrid.columns.length);
        });
        it('renders column css with styleSheets', () => {
            document.body.innerHTML = '';
            dataGrid = new IdsDataGrid();
            document.body.appendChild(dataGrid);
            dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
            dataGrid.columns = columns();
            dataGrid.data = dataset;
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(dataGrid.columns.length);
        });
        it('can get the header element with a setter', () => {
            expect(dataGrid.header.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(dataGrid.columns.length);
            expect(dataGrid.header.rootNode).toBeTruthy();
            expect(dataGrid.header.headerCheckbox).toBeTruthy();
        });
        it('skips render column no styleSheets in headless browsers', () => {
            document.body.innerHTML = '';
            dataGrid = new IdsDataGrid();
            document.body.appendChild(dataGrid);
            dataGrid.shadowRoot.styleSheets = [];
            dataGrid.columns = columns();
            dataGrid.data = dataset;
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(dataGrid.columns.length);
        });
        it('renders one single column', () => {
            document.body.innerHTML = '';
            dataGrid = new IdsDataGrid();
            document.body.appendChild(dataGrid);
            dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
            dataGrid.columns = [{
                    id: 'test',
                    width: 20
                }];
            dataGrid.data = dataset;
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(dataGrid.columns.length);
        });
        it('should set user uniqueId', () => {
            const uniqueId = 'some-uniqueid';
            expect(dataGrid.getAttribute('unique-id')).toEqual(null);
            expect(dataGrid.uniqueId).toEqual(null);
            dataGrid.uniqueId = uniqueId;
            expect(dataGrid.getAttribute('unique-id')).toEqual(uniqueId);
            expect(dataGrid.uniqueId).toEqual(uniqueId);
            dataGrid.uniqueId = false;
            expect(dataGrid.getAttribute('unique-id')).toEqual(null);
            expect(dataGrid.uniqueId).toEqual(null);
        });
    });
    describe('Row Rendering Tests', () => {
        it('renders row data', () => {
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row').length).toEqual(10);
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-cell').length).toEqual(dataGrid.columns.length * 9);
        });
        it('skips hidden rows', async () => {
            dataGrid.data[1].rowHidden = true;
            dataGrid.columns = [{
                    id: 'description',
                    name: 'description',
                    field: 'description'
                }];
            await processAnimFrame();
            const row1 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1];
            const row2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2];
            expect(row1.getAttribute('hidden')).toBeFalsy();
            expect(row2.getAttribute('hidden')).toBe('');
        });
        it('skips re-rerender if no data', () => {
            dataGrid.columns = [];
            dataGrid.data = [];
            dataGrid.redrawBody();
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row').length).toEqual(10);
        });
        it('renders with no errors on empty data and columns', () => {
            const errors = jest.spyOn(global.console, 'error');
            document.body.innerHTML = '';
            dataGrid = new IdsDataGrid();
            document.body.appendChild(dataGrid);
            dataGrid.columns = [];
            dataGrid.data = [];
            dataGrid.template();
            expect(errors).not.toHaveBeenCalled();
        });
        it('renders with alternateRowShading option', () => {
            document.body.innerHTML = '';
            dataGrid = new IdsDataGrid();
            dataGrid.alternateRowShading = true;
            document.body.appendChild(dataGrid);
            expect(dataGrid.template()).toContain('alt-row-shading');
            dataGrid.columns = columns();
            dataGrid.data = dataset;
            expect(dataGrid.shadowRoot.querySelectorAll('.alt-row-shading').length).toEqual(1);
            expect(dataGrid.getAttribute('alternate-row-shading')).toEqual('true');
        });
        it('can reset the alternateRowShading option', () => {
            document.body.innerHTML = '';
            dataGrid = new IdsDataGrid();
            dataGrid.alternateRowShading = true;
            document.body.appendChild(dataGrid);
            dataGrid.columns = columns();
            dataGrid.data = dataset;
            dataGrid.alternateRowShading = false;
            dataGrid.alternateRowShading = true;
            dataGrid.alternateRowShading = null;
            dataGrid.alternateRowShading = true;
            dataGrid.alternateRowShading = 'false';
            expect(dataGrid.shadowRoot.querySelectorAll('.alt-row-shading').length).toEqual(0);
            expect(dataGrid.getAttribute('alternate-row-shading')).toEqual('false');
        });
    });
    describe('Virtual Scrolling Tests', () => {
        it('renders with virtualScroll option', () => {
            document.body.innerHTML = '';
            dataGrid = new IdsDataGrid();
            dataGrid.virtualScroll = true;
            document.body.appendChild(dataGrid);
            dataGrid.columns = columns();
            dataGrid.data = dataset;
            dataGrid.virtualScroll = false;
            expect(dataGrid.shadowRoot.querySelectorAll('ids-virtual-scroll').length).toEqual(0);
            expect(dataGrid.getAttribute('virtual-scroll')).toEqual(null);
        });
        it('renders can sort with the virtualScroll option', async () => {
            dataGrid.virtualScroll = true;
            dataGrid.redraw();
            await processAnimFrame();
            // Height is zero...
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row').length).toEqual(10);
            dataGrid.setSortColumn('description', true);
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row').length).toEqual(10);
        });
        it('can reset the virtualScroll option', async () => {
            document.body.innerHTML = '';
            dataGrid = new IdsDataGrid();
            dataGrid.virtualScroll = true;
            document.body.appendChild(dataGrid);
            dataGrid.columns = columns();
            dataGrid.data = dataset;
            await processAnimFrame();
            expect(dataGrid.shadowRoot.querySelectorAll('ids-virtual-scroll').length).toEqual(0);
        });
        it('has the right row height for each rowHeight value', () => {
            dataGrid.virtualScroll = true;
            expect(dataGrid.rowPixelHeight).toEqual(50);
            dataGrid.rowHeight = 'md';
            expect(dataGrid.rowPixelHeight).toEqual(40);
            dataGrid.rowHeight = 'sm';
            expect(dataGrid.rowPixelHeight).toEqual(35);
            dataGrid.rowHeight = 'xs';
            expect(dataGrid.rowPixelHeight).toEqual(30);
            dataGrid.redrawBody();
            expect(dataGrid.rowPixelHeight).toEqual(30);
        });
        it('contains virtualScrollSettings', () => {
            const BUFFER_ROWS = 50;
            const NUM_ROWS = 150;
            const DEFAULT_SETTINGS = {
                BUFFER_ROWS,
                NUM_ROWS,
                BODY_HEIGHT: 7500,
                BUFFER_HEIGHT: 2500,
                DEBOUNCE_RATE: 10,
                ENABLED: false,
                RAF_DELAY: 60,
                ROW_HEIGHT: 50,
            };
            expect(dataGrid.virtualScrollSettings).toEqual(DEFAULT_SETTINGS);
            dataGrid.virtualScroll = true;
            expect(dataGrid.virtualScrollSettings).toEqual({
                ...DEFAULT_SETTINGS,
                ENABLED: true,
            });
            dataGrid.rowHeight = 'md';
            expect(dataGrid.virtualScrollSettings).toEqual({
                ...DEFAULT_SETTINGS,
                ENABLED: true,
                ROW_HEIGHT: 40,
                BODY_HEIGHT: DEFAULT_SETTINGS.NUM_ROWS * 40,
                BUFFER_HEIGHT: DEFAULT_SETTINGS.BUFFER_ROWS * 40,
            });
            dataGrid.rowHeight = 'sm';
            expect(dataGrid.virtualScrollSettings).toEqual({
                ...DEFAULT_SETTINGS,
                ENABLED: true,
                ROW_HEIGHT: 35,
                BODY_HEIGHT: DEFAULT_SETTINGS.NUM_ROWS * 35,
                BUFFER_HEIGHT: DEFAULT_SETTINGS.BUFFER_ROWS * 35,
            });
            dataGrid.rowHeight = 'xs';
            expect(dataGrid.virtualScrollSettings).toEqual({
                ...DEFAULT_SETTINGS,
                ENABLED: true,
                ROW_HEIGHT: 30,
                BODY_HEIGHT: DEFAULT_SETTINGS.NUM_ROWS * 30,
                BUFFER_HEIGHT: DEFAULT_SETTINGS.BUFFER_ROWS * 30,
            });
            dataGrid.redrawBody();
            expect(dataGrid.virtualScrollSettings).toEqual({
                ...DEFAULT_SETTINGS,
                ENABLED: true,
                ROW_HEIGHT: 30,
                BODY_HEIGHT: DEFAULT_SETTINGS.NUM_ROWS * 30,
                BUFFER_HEIGHT: DEFAULT_SETTINGS.BUFFER_ROWS * 30,
            });
        });
        it('attaches scroll event handler', async () => {
            expect(dataGrid.virtualScroll).toBeFalsy();
            const listener = jest.spyOn(dataGrid.container, 'addEventListener');
            expect(listener).toBeCalledTimes(0);
            dataGrid.virtualScroll = true;
            expect(dataGrid.virtualScroll).toBeTruthy();
            expect(listener).toBeCalledWith('scroll', expect.any(Function), { capture: true, passive: true });
        });
        it.skip('can recycle cells down', async () => {
            expect(dataGrid.data).toEqual(dataset);
            dataGrid.virtualScroll = true;
            dataGrid.data = productsDataset;
            expect(dataGrid.data).toEqual(productsDataset);
            const { NUM_ROWS, BUFFER_ROWS, ROW_HEIGHT } = dataGrid.virtualScrollSettings;
            expect(dataGrid.rows.length).toBe(NUM_ROWS);
            expect(dataGrid.rows[0].rowIndex).toBe(0);
            expect(dataGrid.rows[dataGrid.rows.length - 1].rowIndex).toBe(NUM_ROWS - 1);
            expect(dataGrid.container.scrollTop).toBe(0);
            // dataGrid.container.scrollTop = BUFFER_ROWS * ROW_HEIGHT;
            dataGrid.scrollRowIntoView(BUFFER_ROWS * ROW_HEIGHT);
            await processAnimFrame();
            expect(dataGrid.container.scrollTop).toBeGreaterThan(100);
            expect(dataGrid.rows[0].rowIndex).toBe(0);
            expect(dataGrid.rows[dataGrid.rows.length - 1].rowIndex).toBe(NUM_ROWS - 1);
        });
        it.skip('can recycle cells up', async () => {
            expect(dataGrid.data).toEqual(dataset);
            dataGrid.virtualScroll = true;
            dataGrid.data = productsDataset;
            expect(dataGrid.data).toEqual(productsDataset);
            const { NUM_ROWS, BUFFER_ROWS, ROW_HEIGHT } = dataGrid.virtualScrollSettings;
            expect(dataGrid.rows.length).toBe(NUM_ROWS);
            expect(dataGrid.rows[0].rowIndex).toBe(0);
            expect(dataGrid.rows[dataGrid.rows.length - 1].rowIndex).toBe(NUM_ROWS - 1);
            expect(dataGrid.container.scrollTop).toBe(0);
            // dataGrid.container.scrollTop = BUFFER_ROWS * ROW_HEIGHT;
            dataGrid.scrollRowIntoView(BUFFER_ROWS * ROW_HEIGHT);
            await processAnimFrame();
            expect(dataGrid.container.scrollTop).toBeGreaterThan(100);
            expect(dataGrid.rows[0].rowIndex).toBe(0);
            expect(dataGrid.rows[dataGrid.rows.length - 1].rowIndex).toBe(NUM_ROWS - 1);
        });
        it.todo('does not recycle cells down when at the bottom');
        it.todo('does not recycle cells up when at the top');
        it.todo('can scroll row 10 into view');
        it.todo('can scroll row 2 into view');
        it.todo('can scroll row 100 into view');
        it.todo('scrolls first row into view when given row-index too small');
        it.todo('scrolls last row into view when given row-index too large');
        it.todo('caches rows');
        it.todo('caches cells');
        it.todo('can bust row-cache');
        it.todo('can bust cell-cache');
        it.todo('does not use requestAnimationFrame (RAF) if virtural scroll is disabled');
        it.todo('scrollRowIntoView()');
    });
    describe('Column Rendering Tests', () => {
        it('renders single column with empty data', () => {
            document.body.innerHTML = '';
            dataGrid = new IdsDataGrid();
            document.body.appendChild(dataGrid);
            dataGrid.data = null;
            dataGrid.columns = columns();
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-body').length).toEqual(1);
        });
        it('can hide / show column with setColumnVisible', () => {
            dataGrid.setColumnVisible('description', false);
            expect(dataGrid.shadowRoot.querySelectorAll('[column-id="description"]').length).toEqual(0);
            dataGrid.setColumnVisible('description', true);
            expect(dataGrid.shadowRoot.querySelectorAll('[column-id="description"]').length).toEqual(1);
        });
        it('renders column when set to empty', () => {
            document.body.innerHTML = '';
            dataGrid = new IdsDataGrid();
            document.body.appendChild(dataGrid);
            dataGrid.columns = columns();
            dataGrid.data = dataset;
            dataGrid.columns = null;
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(1);
        });
        it('renders column with no all set widths', () => {
            document.body.innerHTML = '';
            dataGrid = new IdsDataGrid();
            document.body.appendChild(dataGrid);
            dataGrid.shadowRoot.adoptedStyleSheets = () => [window.CSSStyleSheet];
            dataGrid.data = dataset;
            dataGrid.columns = columns().slice(0, 2);
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(2);
        });
        it('supports hidden columns', () => {
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    hidden: true
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency'
                },
                {
                    id: 'transactionCurrency',
                    name: 'Transaction Currency',
                    field: 'transactionCurrency'
                }];
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(2);
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-cell').length).toEqual(18);
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    hidden: true
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency'
                },
                {
                    id: 'transactionCurrency',
                    name: 'Transaction Currency',
                    field: 'transactionCurrency',
                    hidden: true
                }];
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell').length).toEqual(1);
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-cell').length).toEqual(9);
        });
        it('supports setting cssPart', () => {
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    cssPart: 'custom-cell'
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency'
                },
                {
                    id: 'transactionCurrency',
                    name: 'Transaction Currency',
                    field: 'transactionCurrency',
                    cssPart: (row) => ((row % 2 === 0) ? 'custom-cell' : '')
                }];
            expect(dataGrid.shadowRoot.querySelectorAll('[part="custom-cell"]').length).toEqual(14);
        });
        it('supports setting cellSelectedCssPart', () => {
            dataGrid.rowSelection = 'multiple';
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    cssPart: 'custom-cell',
                    cellSelectedCssPart: 'custom-cell-selected'
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency'
                },
                {
                    id: 'transactionCurrency',
                    name: 'Transaction Currency',
                    field: 'transactionCurrency',
                    cssPart: (row) => ((row % 2 === 0) ? 'custom-cell' : ''),
                    cellSelectedCssPart: (row) => ((row % 2 === 0) ? 'custom-cell-selected' : '')
                }];
            dataGrid.selectAllRows();
            expect(dataGrid.shadowRoot.querySelectorAll('[part="custom-cell-selected"]').length).toEqual(14);
        });
        it('supports setting frozen columns', () => {
            expect(dataGrid.hasFrozenColumns).toEqual(false);
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    frozen: 'left'
                },
                {
                    id: 'col1',
                    name: 'Currency',
                    field: 'bookCurrency',
                    frozen: 'left'
                },
                {
                    id: 'col2',
                    name: 'Currency',
                    field: 'bookCurrency',
                    frozen: 'left'
                },
                {
                    id: 'col3',
                    name: 'Currency',
                    field: 'bookCurrency'
                },
                {
                    id: 'col4',
                    name: 'Currency',
                    field: 'bookCurrency'
                },
                {
                    id: 'col5',
                    name: 'Currency',
                    field: 'bookCurrency'
                },
                {
                    id: 'transactionCurrency',
                    name: 'Transaction Currency',
                    field: 'transactionCurrency',
                    frozen: 'right'
                }];
            expect(dataGrid.shadowRoot.querySelectorAll('.frozen').length).toEqual(40);
            expect(dataGrid.shadowRoot.querySelectorAll('.frozen-right').length).toEqual(10);
            expect(dataGrid.shadowRoot.querySelectorAll('.frozen-left').length).toEqual(30);
            expect(dataGrid.shadowRoot.querySelectorAll('.frozen-last').length).toEqual(10);
            expect(dataGrid.rightFrozenColumns.length).toEqual(1);
            expect(dataGrid.leftFrozenColumns.length).toEqual(3);
            expect(dataGrid.hasFrozenColumns).toEqual(true);
        });
        it('supports setting cell alignment', () => {
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    align: 'center'
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency',
                    align: 'right'
                },
                {
                    id: 'transactionCurrency',
                    name: 'Transaction Currency',
                    field: 'transactionCurrency',
                    align: 'left'
                }];
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row > .ids-data-grid-cell:nth-child(1)').classList.contains('align-center')).toBeTruthy();
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row > .ids-data-grid-cell:nth-child(2)').classList.contains('align-right')).toBeTruthy();
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row > .ids-data-grid-cell:nth-child(3)').classList.contains('align-left')).toBeTruthy();
        });
        it('supports setting header alignment', () => {
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    align: 'center',
                    headerAlign: 'right'
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency',
                    align: 'right',
                    headerAlign: 'center'
                },
                {
                    id: 'transactionCurrency',
                    name: 'Transaction Currency',
                    field: 'transactionCurrency',
                    align: 'left',
                    headerAlign: 'center'
                }];
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row > .ids-data-grid-cell:nth-child(1)').classList.contains('align-center')).toBeTruthy();
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row > .ids-data-grid-cell:nth-child(2)').classList.contains('align-right')).toBeTruthy();
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row > .ids-data-grid-cell:nth-child(3)').classList.contains('align-left')).toBeTruthy();
            expect(dataGrid.container.querySelector('.ids-data-grid-header-cell:nth-child(1)').classList.contains('align-right')).toBeTruthy();
            expect(dataGrid.container.querySelector('.ids-data-grid-header-cell:nth-child(2)').classList.contains('align-center')).toBeTruthy();
            expect(dataGrid.container.querySelector('.ids-data-grid-header-cell:nth-child(3)').classList.contains('align-center')).toBeTruthy();
        });
        it('supports setting percent width', () => {
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    align: 'center',
                    width: '50%'
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency',
                    align: 'right',
                    width: '50%'
                }];
            expect(dataGrid.container.style.getPropertyValue('--ids-data-grid-column-widths')).toEqual('minmax(50%, 1fr) minmax(50%, 1fr) ');
        });
        it('supports nested data', () => {
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price.level1.name',
                    align: 'center',
                    width: '50%'
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'price.name',
                    align: 'right',
                    width: '50%'
                }];
            dataGrid.data = [
                { price: { name: 'test', level1: { name: 'test' } } },
                { price: { name: 'test2', level1: { name: 'test2' } } },
            ];
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row[aria-rowindex="1"] > .ids-data-grid-cell:nth-child(1) span').textContent).toBe('test');
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row[aria-rowindex="1"] > .ids-data-grid-cell:nth-child(2) span').textContent).toBe('test');
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row[aria-rowindex="2"] > .ids-data-grid-cell:nth-child(1) span').textContent).toBe('test2');
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row[aria-rowindex="2"] > .ids-data-grid-cell:nth-child(2) span').textContent).toBe('test2');
        });
        it('supports setting custom width', () => {
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    align: 'center',
                    width: 'minmax(130px, 2fr)'
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency',
                    align: 'right',
                    width: '50%'
                }];
            expect(dataGrid.container.style.getPropertyValue('--ids-data-grid-column-widths')).toEqual('minmax(130px, 2fr) minmax(50%, 1fr) ');
        });
        it('supports column groups', () => {
            dataGrid.columns[3].hidden = true;
            dataGrid.columnGroups = [
                {
                    colspan: 3,
                    id: 'group1',
                    name: 'Column Group One',
                    align: 'center'
                },
                {
                    colspan: 2,
                    id: 'group2',
                    name: ''
                },
                {
                    colspan: 2,
                    id: 'group3',
                    name: 'Column Group Three',
                    align: 'right'
                },
                {
                    colspan: 10,
                    name: 'Column Group Four',
                    align: 'left'
                }
            ];
            const nodes = dataGrid.container.querySelectorAll('.ids-data-grid-column-groups > *');
            expect(nodes.length).toEqual(4);
            expect(nodes[0].textContent).toContain('Column Group One');
            expect(nodes[1].textContent.replace(/^\s+|\s+$/gm, '')).toBe('');
            expect(nodes[3].textContent).toContain('Column Group Four');
            expect(nodes[3].getAttribute('column-group-id')).toBe('id');
            expect(nodes[0].classList.contains('align-center')).toBeTruthy();
            expect(nodes[2].classList.contains('align-right')).toBeTruthy();
        });
        it('supports column resize', async () => {
            window.getComputedStyle = () => ({ width: 200 });
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    align: 'center',
                    resizable: true,
                    minWidth: 100,
                    width: 200,
                    maxWidth: 300
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency',
                    align: 'right',
                    minWidth: 100,
                    resizable: true,
                    maxWidth: 300
                }];
            const nodes = dataGrid.container.querySelectorAll('.resizer');
            expect(nodes.length).toEqual(2);
            // Fake a resize
            const mousedown = new MouseEvent('mousedown', { clientX: 224, bubbles: true });
            // Wrong target
            nodes[0].parentNode.dispatchEvent(mousedown);
            nodes[0].dispatchEvent(mousedown);
            expect(dataGrid.isResizing).toBeTruthy();
            expect(dataGrid.columns[0].width).toBe(200);
            let mousemove = new MouseEvent('mousemove', { clientX: 200, bubbles: true });
            document.dispatchEvent(mousemove);
            expect(dataGrid.columns[0].width).toBe(176);
            mousemove = new MouseEvent('mouseup', { clientX: 190, bubbles: true });
            document.dispatchEvent(mousemove);
            expect(dataGrid.columns[0].width).toBe(176);
        });
        it('supports column resize on RTL', async () => {
            window.getComputedStyle = () => ({ width: 200 });
            await processAnimFrame();
            container.language = 'ar';
            await processAnimFrame();
            expect(dataGrid.locale.isRTL()).toBe(true);
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    align: 'center',
                    resizable: true,
                    minWidth: 100,
                    width: 200,
                    maxWidth: 300
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency',
                    align: 'right',
                    minWidth: 100,
                    resizable: true,
                    maxWidth: 300
                }];
            await processAnimFrame();
            const nodes = dataGrid.container.querySelectorAll('.resizer');
            expect(nodes.length).toEqual(2);
            // Fake a resize
            const mousedown = new MouseEvent('mousedown', { clientX: 224, bubbles: true });
            // Wrong target
            nodes[0].parentNode.dispatchEvent(mousedown);
            nodes[0].dispatchEvent(mousedown);
            expect(dataGrid.isResizing).toBeTruthy();
            expect(dataGrid.columns[0].width).toBe(200);
            let mousemove = new MouseEvent('mousemove', { clientX: 200, bubbles: true });
            document.dispatchEvent(mousemove);
            expect(dataGrid.columns[0].width).toBe(224);
            // Stop Moving
            mousemove = new MouseEvent('mouseup', { clientX: 190, bubbles: true });
            document.dispatchEvent(mousemove);
            expect(dataGrid.columns[0].width).toBe(224);
        });
        it('supports getting columnIdxById', () => {
            expect(dataGrid.columnIdxById('rowNumber')).toEqual(1);
            expect(dataGrid.columnIdxById('xxx')).toEqual(-1);
        });
        it('supports setting column width', () => {
            dataGrid.setColumnWidth('description', 101);
            expect(dataGrid.columns[2].width).toEqual(101);
        });
        it('supports setting column width defaults', () => {
            const newColumns = deepClone(columns());
            newColumns[0].id = 'selectionCheckbox';
            newColumns[0].formatter = formatters.selectionCheckbox;
            newColumns[0].width = null;
            dataGrid.columns = newColumns;
            expect(dataGrid.columns[0].width).toBe(45);
            expect(dataGrid.columns[0].id).toBe('selectionCheckbox');
            dataGrid.setColumnWidth('description', 101);
            expect(dataGrid.columns[0].width).toBe(45);
            dataGrid.setColumnWidth('selectionCheckbox', 101);
            expect(dataGrid.columns[0].width).toBe(101);
        });
        it('supports not setting min column width (12)', () => {
            dataGrid.setColumnWidth('description', 1);
            expect(dataGrid.columns[2].width).toEqual(undefined);
        });
    });
    describe('Sorting Tests', () => {
        it('fires sorted event on sort', () => {
            const mockCallback = jest.fn((x) => {
                expect(x.detail.elem).toBeTruthy();
                expect(x.detail.sortColumn.id).toEqual('description');
                expect(x.detail.sortColumn.ascending).toEqual(true);
            });
            dataGrid.addEventListener('sorted', mockCallback);
            dataGrid.setSortColumn('description', true);
            expect(mockCallback.mock.calls.length).toBe(1);
        });
        it('fires sorted event on sort', () => {
            const mockCallback = jest.fn((x) => {
                expect(x.detail.elem).toBeTruthy();
                expect(x.detail.sortColumn.id).toEqual('description');
                expect(x.detail.sortColumn.ascending).toEqual(false);
            });
            dataGrid.addEventListener('sorted', mockCallback);
            dataGrid.setSortColumn('description', false);
            expect(mockCallback.mock.calls.length).toBe(1);
        });
        it('fires defaults to ascending sort', () => {
            const mockCallback = jest.fn((x) => {
                expect(x.detail.elem).toBeTruthy();
                expect(x.detail.sortColumn.id).toEqual('description');
                expect(x.detail.sortColumn.ascending).toEqual(true);
            });
            dataGrid.addEventListener('sorted', mockCallback);
            dataGrid.setSortColumn('description');
            expect(mockCallback.mock.calls.length).toBe(1);
        });
        it('can sort by field vs id', () => {
            const mockCallback = jest.fn((x) => {
                expect(x.detail.elem).toBeTruthy();
                expect(x.detail.sortColumn.id).toEqual('publishTime');
                expect(x.detail.sortColumn.ascending).toEqual(true);
            });
            dataGrid.addEventListener('sorted', mockCallback);
            dataGrid.setSortColumn('publishTime');
            expect(mockCallback.mock.calls.length).toBe(1);
        });
        it('sets sort state via the API', () => {
            dataGrid.setSortState('description');
            expect(dataGrid.shadowRoot.querySelectorAll('[column-id]')[2].getAttribute('aria-sort')).toBe('ascending');
        });
        it('sets sort state via the API with direction', () => {
            dataGrid.setSortState('description', false);
            expect(dataGrid.shadowRoot.querySelectorAll('[column-id]')[2].getAttribute('aria-sort')).toBe('descending');
            dataGrid.setSortState('description', true);
            expect(dataGrid.shadowRoot.querySelectorAll('[column-id]')[2].getAttribute('aria-sort')).toBe('ascending');
        });
        it('doesnt error when not sortable', () => {
            const errors = jest.spyOn(global.console, 'error');
            dataGrid.columns = [{ id: 'description', field: 'description', name: 'description' }];
            dataGrid.setSortState('description');
            expect(errors).not.toHaveBeenCalled();
        });
        it('wont error in columnDataByHeaderElem', () => {
            const badQuery = dataGrid.container.querySelector('.ids-data-grid-header-cell:nth-child(1000)');
            expect(dataGrid.columnDataByHeaderElem(badQuery)).toBe(undefined);
        });
        it('handles wrong ID on sort', () => {
            const errors = jest.spyOn(global.console, 'error');
            dataGrid.setSortColumn('bookx', false);
            expect(errors).not.toHaveBeenCalled();
        });
        it('fires sorted event on click', () => {
            const mockCallback = jest.fn((x) => {
                expect(x.detail.elem).toBeTruthy();
                expect(x.detail.sortColumn.id).toEqual('description');
                expect(x.detail.sortColumn.ascending).toEqual(true);
            });
            dataGrid.addEventListener('sorted', mockCallback);
            const headers = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell');
            headers[2].querySelector('.ids-data-grid-header-cell-content').click();
            expect(mockCallback.mock.calls.length).toBe(1);
        });
        it('should not error clicking on a non sortable column', () => {
            const errors = jest.spyOn(global.console, 'error');
            const mockCallback = jest.fn();
            dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell')[5].click();
            dataGrid.addEventListener('sort', mockCallback);
            expect(mockCallback.mock.calls.length).toBe(0);
            expect(errors).not.toHaveBeenCalled();
        });
        it('skips sort on resize click ', () => {
            const mockCallback = jest.fn();
            dataGrid.isResizing = true;
            dataGrid.addEventListener('sort', mockCallback);
            const headers = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell');
            headers[2].querySelector('.ids-data-grid-header-cell-content').click();
            expect(mockCallback.mock.calls.length).toBe(0);
        });
        it('resets direction on sort', async () => {
            container.language = 'ar';
            await processAnimFrame();
            expect(dataGrid.getAttribute('dir')).toEqual('rtl');
            const headers = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell');
            headers[2].querySelector('.ids-data-grid-header-cell-content').click();
            expect(dataGrid.getAttribute('dir')).toEqual('rtl');
        });
    });
    describe('Reordering Tests', () => {
        it('supports column reorder', async () => {
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    reorderable: true,
                    width: 200,
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency',
                    minWidth: 100,
                    reorderable: true,
                },
                {
                    id: 'other',
                    name: 'ledger',
                    field: 'ledger',
                    minWidth: 100,
                    reorderable: false,
                }];
            const cols = (dataGrid).columns;
            const nodes = dataGrid.container.querySelectorAll('.reorderer');
            expect(nodes.length).toEqual(2);
            // Fake a Drag
            const dragstart = new MouseEvent('dragstart', { bubbles: true });
            nodes[0].dispatchEvent(dragstart);
            expect(nodes[0].parentNode.classList.contains('active-drag-column')).toBeTruthy();
            const dragover = new CustomEvent('dragover', { bubbles: true, dataTransfer: {} });
            dragover.pageY = '1';
            Object.assign(dragover, {
                dataTransfer: { setData: jest.fn(), effectAllowed: 'move' }
            });
            nodes[1].dispatchEvent(dragover);
            // simulate dragging
            const dragenter = new MouseEvent('dragenter', { bubbles: true });
            nodes[1].dispatchEvent(dragenter);
            nodes[0].dispatchEvent(dragenter);
            nodes[1].dispatchEvent(dragstart);
            const dragstart2 = new MouseEvent('dragstart', { bubbles: true });
            nodes[1].dispatchEvent(dragstart2);
            nodes[0].dispatchEvent(dragenter);
            nodes[1].dispatchEvent(dragenter);
            nodes[0].dispatchEvent(dragenter);
            dataGrid.locale.isRTL = () => true;
            nodes[1].dispatchEvent(dragenter);
            nodes[0].dispatchEvent(dragenter);
            expect(dataGrid.wrapper.querySelector('.ids-data-grid-sort-arrows').style.display).toBe('block');
            const dragend = new MouseEvent('dragend', { bubbles: true });
            nodes[1].dispatchEvent(dragend);
            expect(nodes[0].parentNode.classList.contains('active-drag-column')).toBeFalsy();
            expect(dataGrid.wrapper.querySelector('.ids-data-grid-sort-arrows').style.display).toBe('none');
            const drop = new MouseEvent('drop', { bubbles: true });
            nodes[1].dispatchEvent(drop);
            // Overall success
            expect(cols[0].id).toBe('price');
            expect(cols[1].id).toBe('bookCurrency');
            expect(cols[2].id).toBe('other');
        });
        it('supports dragging right', async () => {
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    reorderable: true,
                    width: 200,
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency',
                    minWidth: 100,
                    reorderable: true,
                },
                {
                    id: 'other',
                    name: 'ledger',
                    field: 'ledger',
                    minWidth: 100,
                    reorderable: true,
                }];
            const cols = (dataGrid).columns;
            const nodes = dataGrid.container.querySelectorAll('.reorderer');
            // Fake a Drag
            const dragstart = new MouseEvent('dragstart', { bubbles: true });
            nodes[2].dispatchEvent(dragstart);
            // simulate dragging
            const dragenter = new MouseEvent('dragenter', { bubbles: true });
            nodes[1].dispatchEvent(dragenter);
            nodes[0].dispatchEvent(dragenter);
            expect(dataGrid.wrapper.querySelector('.ids-data-grid-sort-arrows').style.display).toBe('block');
            const dragend = new MouseEvent('dragend', { bubbles: true });
            nodes[0].dispatchEvent(dragend);
            const drop = new MouseEvent('drop', { bubbles: true });
            nodes[0].dispatchEvent(drop);
            // Overall success
            expect(cols[0].id).toBe('other');
            expect(cols[1].id).toBe('price');
            expect(cols[2].id).toBe('bookCurrency');
        });
        it('supports dragging when right to left', async () => {
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    reorderable: true,
                    width: 200,
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency',
                    minWidth: 100,
                    reorderable: true,
                },
                {
                    id: 'other',
                    name: 'ledger',
                    field: 'ledger',
                    minWidth: 100,
                    reorderable: true,
                }];
            await processAnimFrame();
            container.language = 'ar';
            await processAnimFrame();
            expect(dataGrid.getAttribute('dir')).toEqual('rtl');
            const cols = (dataGrid).columns;
            const nodes = dataGrid.container.querySelectorAll('.reorderer');
            // Fake a Drag
            const dragstart = new MouseEvent('dragstart', { bubbles: true });
            nodes[2].dispatchEvent(dragstart);
            // simulate dragging
            const dragenter = new MouseEvent('dragenter', { bubbles: true });
            nodes[1].dispatchEvent(dragenter);
            nodes[0].dispatchEvent(dragenter);
            expect(dataGrid.wrapper.querySelector('.ids-data-grid-sort-arrows').style.display).toBe('block');
            const dragend = new MouseEvent('dragend', { bubbles: true });
            nodes[0].dispatchEvent(dragend);
            const drop = new MouseEvent('drop', { bubbles: true });
            nodes[0].dispatchEvent(drop);
            // Overall success
            expect(cols[0].id).toBe('other');
            expect(cols[1].id).toBe('price');
            expect(cols[2].id).toBe('bookCurrency');
        });
        it('supports stopping reorder on non-reorderable', async () => {
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    reorderable: false,
                    width: 200,
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency',
                    minWidth: 100,
                    reorderable: true,
                },
                {
                    id: 'other',
                    name: 'ledger',
                    field: 'ledger',
                    minWidth: 100,
                    reorderable: false,
                }];
            const headers = dataGrid.container.querySelectorAll('.ids-data-grid-header-cell');
            const dragstart = new MouseEvent('dragstart', { bubbles: true });
            headers[0].dispatchEvent(dragstart);
            expect(dataGrid.shadowRoot.querySelector('.active-drag-column')).toBeFalsy();
        });
        it('supports moveColumn', async () => {
            dataGrid.columns = [{
                    id: 'price',
                    name: 'Price',
                    field: 'price',
                    reorderable: true,
                    width: 200,
                },
                {
                    id: 'bookCurrency',
                    name: 'Currency',
                    field: 'bookCurrency',
                    minWidth: 100,
                    reorderable: true,
                },
                {
                    id: 'other',
                    name: 'ledger',
                    field: 'ledger',
                    minWidth: 100,
                    reorderable: false,
                }];
            const cols = (dataGrid).columns;
            dataGrid.data[1].dirtyCells = [];
            dataGrid.data[1].dirtyCells.push({
                row: 1, cell: 0, columnId: 'price', originalValue: '12.99'
            });
            dataGrid.data[2].dirtyCells = [];
            dataGrid.data[2].dirtyCells.push({
                row: 2, cell: 0, columnId: 'price', originalValue: '13.99'
            });
            expect(cols[0].id).toBe('price');
            expect(cols[1].id).toBe('bookCurrency');
            expect(cols[2].id).toBe('other');
            dataGrid.moveColumn(0, 1);
            expect(cols[0].id).toBe('bookCurrency');
            expect(cols[1].id).toBe('price');
            expect(cols[2].id).toBe('other');
            dataset[1].dirtyCells = undefined;
            dataset[2].dirtyCells = undefined;
            dataGrid.resetDirtyCells();
        });
    });
    describe('Container / Height Tests', () => {
        it('supports auto fit', () => {
            dataGrid.autoFit = true;
            dataGrid.redraw();
            expect(dataGrid.getAttribute('auto-fit')).toEqual('true');
            dataGrid.autoFit = false;
            dataGrid.redraw();
            expect(dataGrid.getAttribute('auto-fit')).toBeFalsy();
        });
        it('supports auto fit bottom', () => {
            dataGrid.autoFit = 'bottom';
            dataGrid.redraw();
            expect(dataGrid.getAttribute('auto-fit')).toEqual('bottom');
            dataGrid.autoFit = false;
            dataGrid.redraw();
            expect(dataGrid.getAttribute('auto-fit')).toBeFalsy();
        });
    });
    describe('Row Height Tests', () => {
        it('can set the rowHeight setting', () => {
            dataGrid.rowHeight = 'xs';
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('data-row-height')).toEqual('xs');
            expect(dataGrid.getAttribute('row-height')).toEqual('xs');
            dataGrid.rowHeight = 'sm';
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('data-row-height')).toEqual('sm');
            expect(dataGrid.getAttribute('row-height')).toEqual('sm');
            dataGrid.rowHeight = 'md';
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('data-row-height')).toEqual('md');
            expect(dataGrid.getAttribute('row-height')).toEqual('md');
            dataGrid.rowHeight = null;
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('data-row-height')).toEqual('lg');
            expect(dataGrid.getAttribute('row-height')).toEqual(null);
            dataGrid.rowHeight = 'lg';
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').getAttribute('data-row-height')).toEqual('lg');
            expect(dataGrid.getAttribute('row-height')).toEqual('lg');
        });
        it('can set the rowHeight setting in virtualScroll mode', async () => {
            await processAnimFrame();
            dataGrid.virtualScroll = true;
            dataGrid.rowHeight = 'xs';
            await processAnimFrame();
            expect(dataGrid.virtualScrollSettings.ROW_HEIGHT).toEqual(30);
            dataGrid.rowHeight = 'sm';
            expect(dataGrid.virtualScrollSettings.ROW_HEIGHT).toEqual(35);
            dataGrid.rowHeight = 'md';
            expect(dataGrid.virtualScrollSettings.ROW_HEIGHT).toEqual(40);
            dataGrid.rowHeight = null;
            expect(dataGrid.virtualScrollSettings.ROW_HEIGHT).toEqual(50);
            dataGrid.rowHeight = 'lg';
            expect(dataGrid.virtualScrollSettings.ROW_HEIGHT).toEqual(50);
            dataGrid.virtualScroll = false;
            dataGrid.rowHeight = 'sm';
            expect(dataGrid.virtualScrollSettings.ROW_HEIGHT).toEqual(35);
            expect(dataGrid.getAttribute('row-height')).toEqual('sm');
        });
    });
    describe('Formatter Tests', () => {
        it('can render with the text formatter', () => {
            // Renders undefined/null
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[3].querySelector('.text-ellipsis').innerHTML).toEqual('');
            // Renders text
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
                .querySelectorAll('.ids-data-grid-cell')[3].querySelector('.text-ellipsis').innerHTML).toEqual('CORE');
        });
        it('can render with the password formatter', () => {
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[16].querySelector('.text-ellipsis').innerHTML).toEqual('••');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
                .querySelectorAll('.ids-data-grid-cell')[16].querySelector('.text-ellipsis').innerHTML).toEqual('••');
        });
        it('can render with the rowNumber formatter', () => {
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[1].querySelector('.text-ellipsis').innerHTML).toEqual('1');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
                .querySelectorAll('.ids-data-grid-cell')[1].querySelector('.text-ellipsis').innerHTML).toEqual('4');
        });
        it('can render with the date formatter', () => {
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[4].querySelector('.text-ellipsis').innerHTML).toEqual('4/23/2021');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
                .querySelectorAll('.ids-data-grid-cell')[4].querySelector('.text-ellipsis').innerHTML).toEqual('');
        });
        it('can render with the time formatter', () => {
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[5].querySelector('.text-ellipsis').innerHTML.replace(' ', ' '))
                .toEqual(new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date('2021-04-23T18:25:43.511Z')).replace(' ', ' '));
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
                .querySelectorAll('.ids-data-grid-cell')[5].querySelector('.text-ellipsis').innerHTML)
                .toEqual('');
        });
        it('can render with the decimal formatter', () => {
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[6].querySelector('.text-ellipsis').innerHTML).toEqual('12.99');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
                .querySelectorAll('.ids-data-grid-cell')[6].querySelector('.text-ellipsis').innerHTML).toEqual('1.21');
        });
        it('can render with the decimal formatter (with defaults)', () => {
            delete dataGrid.columns[6].formatOptions;
            dataGrid.redraw();
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[6].querySelector('.text-ellipsis').innerHTML).toEqual('12.99');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
                .querySelectorAll('.ids-data-grid-cell')[6].querySelector('.text-ellipsis').innerHTML).toEqual('1.21');
        });
        it('can render with the integer formatter', () => {
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[9].querySelector('.text-ellipsis').innerHTML).toEqual('13');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
                .querySelectorAll('.ids-data-grid-cell')[9].querySelector('.text-ellipsis').innerHTML).toEqual('1');
        });
        it('can render with the integer formatter (with defaults)', () => {
            delete dataGrid.columns[9].formatOptions;
            dataGrid.redraw();
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[9].querySelector('.text-ellipsis').innerHTML).toEqual('13');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
                .querySelectorAll('.ids-data-grid-cell')[9].querySelector('.text-ellipsis').innerHTML).toEqual('1');
        });
        it('can render with the hyperlink formatter', () => {
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink').innerHTML).toEqual('United States');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
                .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink')).toBeFalsy();
        });
        it('can render with the hyperlink formatter (with default href)', () => {
            delete dataGrid.columns[10].href;
            dataGrid.redraw();
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink').innerHTML).toEqual('United States');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
                .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink')).toBeFalsy();
        });
        it('can focus with the hyperlink when clicked instead of the cell', () => {
            dataGrid.columns[10].href = '#';
            const link = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink');
            expect(link.innerHTML).toEqual('United States');
            const mouseClick = new MouseEvent('click', { bubbles: true });
            link.dispatchEvent(mouseClick);
            // No Easy way to check has focus
            expect(link.nodeName).toEqual('IDS-HYPERLINK');
        });
        it('can render with the hyperlink formatter (with href function)', () => {
            dataGrid.columns[10].href = (row) => {
                if (row.book === 101) {
                    return null;
                }
                return `${row.book}`;
            };
            dataGrid.redraw();
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
                .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink').getAttribute('href')).toEqual('102');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
                .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink')).toBeFalsy();
        });
        it('can render disabled hyperlink', () => {
            dataGrid.columns[10].disabled = (row, value, col, item) => item.book === 101;
            dataGrid.redraw();
            const link = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-hyperlink');
            expect(link.disabled).toBeTruthy();
            const link2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-hyperlink');
            expect(link2.disabled).toBeFalsy();
        });
        it('can render with the checkbox formatter', () => {
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
                .querySelectorAll('.ids-data-grid-cell')[12].querySelector('.ids-data-grid-checkbox-container span').getAttribute('aria-checked')).toEqual('true');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
                .querySelectorAll('.ids-data-grid-cell')[12].querySelector('.ids-data-grid-checkbox-container span').getAttribute('aria-checked')).toEqual('false');
        });
        it('can render with a custom formatter', () => {
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
                .querySelectorAll('.ids-data-grid-cell')[17].querySelector('span').textContent).toEqual('Custom: 13.99');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
                .querySelectorAll('.ids-data-grid-cell')[17].querySelector('span').textContent).toEqual('Custom: 1.21');
        });
        it('can render disabled checkbox', () => {
            dataGrid.columns[12].disabled = (row, value, col, item) => item.book === 101;
            dataGrid.redraw();
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[12].querySelector('.ids-data-grid-checkbox-container span').classList.contains('.disabled')).toBeFalsy();
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
                .querySelectorAll('.ids-data-grid-cell')[12].querySelector('.ids-data-grid-checkbox-container span').classList.contains('.disabled')).toBeFalsy();
        });
        it('can render with the button formatter (with click function)', () => {
            const clickListener = jest.fn();
            dataGrid.columns = [{
                    id: 'button',
                    name: 'button',
                    sortable: false,
                    resizable: false,
                    formatter: dataGrid.formatters.button,
                    icon: 'settings',
                    align: 'center',
                    type: 'icon',
                    click: clickListener,
                    text: 'button'
                }];
            const button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
            expect(button.textContent).toContain('button');
            expect(button.querySelector('ids-icon')).toBeTruthy();
            const mouseClick = new MouseEvent('click', { bubbles: true });
            expect(clickListener).toHaveBeenCalledTimes(0);
            button.dispatchEvent(mouseClick);
            expect(clickListener).toHaveBeenCalledTimes(1);
        });
        it('can render with the button formatter defaults', async () => {
            dataGrid.columns = [{
                    id: 'button',
                    name: 'button',
                    sortable: false,
                    resizable: false,
                    formatter: dataGrid.formatters.button,
                    align: 'center'
                }];
            await processAnimFrame();
            const button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
            expect(button.textContent).toContain('Button');
            expect(button.type).toBe('tertiary');
            expect(button.querySelector('ids-icon')).toBeFalsy();
        });
        it('can render disabled buttons', async () => {
            dataGrid.columns = [{
                    id: 'button',
                    name: 'button',
                    sortable: false,
                    resizable: false,
                    formatter: dataGrid.formatters.button,
                    icon: 'settings',
                    align: 'center',
                    disabled: (row, value, col, item) => item.book === 101,
                    text: 'button'
                }];
            await processAnimFrame();
            const button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
            expect(button.disabled).toBeTruthy();
            const button2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-button');
            expect(button2.disabled).toBeFalsy();
        });
        it('can disabled formatters edge cases', async () => {
            dataGrid.columns = [{
                    id: 'test',
                    name: 'test',
                    formatter: dataGrid.formatters.button,
                    disabled: undefined
                }];
            await processAnimFrame();
            let button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
            expect(button.disabled).toBeFalsy();
            dataGrid.columns = [{
                    id: 'test',
                    name: 'test',
                    formatter: dataGrid.formatters.button,
                    disabled: true
                }];
            await processAnimFrame();
            button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
            expect(button.disabled).toBeTruthy();
            dataGrid.columns = [{
                    id: 'test',
                    name: 'test',
                    formatter: dataGrid.formatters.button,
                    disabled: 'true'
                }];
            await processAnimFrame();
            button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
            expect(button.disabled).toBeTruthy();
        });
        it('can render with the badge formatter (with color function)', () => {
            const colorListener = jest.fn(() => 'info');
            dataGrid.columns = [{
                    id: 'badge',
                    name: 'badge',
                    sortable: false,
                    resizable: false,
                    formatter: dataGrid.formatters.badge,
                    icon: 'settings',
                    align: 'center',
                    color: colorListener,
                    field: 'ledger'
                }];
            // Empty row
            const badge = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-badge');
            expect(badge).toBeFalsy();
            const badge2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-badge');
            expect(badge2.textContent).toContain('CORE');
            expect(badge2.getAttribute('color')).toBe('info');
            expect(colorListener).toHaveBeenCalledTimes(6);
        });
        it('can render with the badge formatter with color class', () => {
            dataGrid.columns = [{
                    id: 'badge',
                    name: 'badge',
                    sortable: false,
                    resizable: false,
                    formatter: dataGrid.formatters.badge,
                    icon: 'settings',
                    align: 'center',
                    color: 'error',
                    field: 'ledger'
                }];
            // Empty row
            const badge = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-badge');
            expect(badge.textContent).toContain('CORE');
            expect(badge.getAttribute('color')).toBe('error');
        });
        it('can render with the badge formatter with no color class', () => {
            dataGrid.columns = [{
                    id: 'badge',
                    name: 'badge',
                    sortable: false,
                    resizable: false,
                    formatter: dataGrid.formatters.badge,
                    icon: 'settings',
                    align: 'center',
                    field: 'ledger'
                }];
            // Empty row
            const badge = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-badge');
            expect(badge.getAttribute('color')).toBe(null);
        });
        it('can render with the tree formatter', async () => {
            dataGrid.treeGrid = true;
            const oldChildren = dataGrid.data[0];
            dataGrid.data[0].children = [{ description: 'test' }];
            dataGrid.data[0].rowExpanded = true;
            dataGrid.data[1].children = [{ description: 'test' }];
            dataGrid.data[1].rowExpanded = false;
            dataGrid.columns = [{
                    id: 'description',
                    name: 'description',
                    sortable: false,
                    resizable: false,
                    formatter: dataGrid.formatters.tree
                }];
            await processAnimFrame();
            const button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
            expect(button).toBeTruthy();
            expect(button.tabIndex).toBe(-1);
            expect(button.querySelector('ids-icon').getAttribute('icon')).toBe('plusminus-folder-open');
            const button2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-button');
            expect(button2.querySelector('ids-icon').getAttribute('icon')).toBe('plusminus-folder-closed');
            dataGrid.data[0].children = oldChildren;
            dataGrid.data[0].rowExpanded = false;
        });
        it('can render with the expander formatter', async () => {
            // eslint-disable-next-line no-template-curly-in-string
            dataGrid.insertAdjacentHTML('afterbegin', '<template id="template-id"><span>${description}</span></template>');
            dataGrid.expandableRow = true;
            dataGrid.expandableRowTemplate = `template-id`;
            dataGrid.data[1].rowExpanded = true;
            dataGrid.columns = [{
                    id: 'description',
                    name: 'description',
                    formatter: dataGrid.formatters.expander
                }];
            await processAnimFrame();
            const button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
            expect(button).toBeTruthy();
            expect(button.tabIndex).toBe(-1);
            expect(button.querySelector('ids-icon').getAttribute('icon')).toBe('plusminus-folder-closed');
            const button2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-button');
            expect(button2.querySelector('ids-icon').getAttribute('icon')).toBe('plusminus-folder-open');
        });
    });
    describe('Keyboard Tests', () => {
        it('can handle ArrowRight key', () => {
            expect(dataGrid.activeCell.row).toEqual(0);
            expect(dataGrid.activeCell.cell).toEqual(0);
            dataGrid.activeCell = null;
            dataGrid.setActiveCell(0, 0, true);
            expect(dataGrid.activeCell.row).toEqual(0);
            expect(dataGrid.activeCell.cell).toEqual(0);
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(0);
            expect(dataGrid.activeCell.cell).toEqual(1);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(2);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(3);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(4);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(5);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(6);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(7);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(8);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(9);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(10);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(11);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(12);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(13);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(14);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(15);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(16);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(17);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(17);
        });
        it('can handle ArrowLeft key', () => {
            expect(dataGrid.activeCell.row).toEqual(0);
            expect(dataGrid.activeCell.cell).toEqual(0);
            let event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(0);
            expect(dataGrid.activeCell.cell).toEqual(1);
            event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(0);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.cell).toEqual(0);
        });
        it('can handle ArrowDown key', () => {
            expect(dataGrid.activeCell.row).toEqual(0);
            expect(dataGrid.activeCell.cell).toEqual(0);
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(1);
            expect(dataGrid.activeCell.cell).toEqual(0);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(2);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(3);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(4);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(5);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(6);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(7);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(8);
        });
        it('should set row navigation', () => {
            expect(dataGrid.getAttribute('row-navigation')).toEqual(null);
            expect(dataGrid.container.classList.contains('row-navigation')).toBeFalsy();
            expect(dataGrid.rowNavigation).toEqual(false);
            dataGrid.rowNavigation = true;
            expect(dataGrid.getAttribute('row-navigation')).toEqual('');
            expect(dataGrid.container.classList.contains('row-navigation')).toBeTruthy();
            expect(dataGrid.rowNavigation).toEqual(true);
            dataGrid.rowNavigation = false;
            expect(dataGrid.getAttribute('row-navigation')).toEqual(null);
            expect(dataGrid.container.classList.contains('row-navigation')).toBeFalsy();
            expect(dataGrid.rowNavigation).toEqual(false);
        });
        it('can handle keyboard row navigation', () => {
            // focus on first grid cell
            expect(dataGrid.activeCell.row).toEqual(0);
            expect(dataGrid.activeCell.cell).toEqual(0);
            dataGrid.activeCell.node.focus();
            // dipatch arrow down event
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            dataGrid.rowNavigation = true;
            dataGrid.dispatchEvent(event);
            // expect second row to be focused
            const rowElem = dataGrid.rowByIndex(dataGrid.activeCell.row);
            expect(rowElem.getAttribute('aria-rowindex')).toEqual('2');
        });
        it('can handle keyboard with mixed row selection', () => {
            dataGrid.rowSelection = 'mixed';
            expect(dataGrid.activeCell.row).toEqual(0);
            expect(dataGrid.activeCell.cell).toEqual(0);
            dataGrid.activeCell.node.focus();
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            dataGrid.rowNavigation = true;
            dataGrid.dispatchEvent(event);
            const rowElem = dataGrid.rowByIndex(dataGrid.activeCell.row);
            expect(rowElem.getAttribute('aria-rowindex')).toEqual('2');
        });
        it('can set the rowNavigation setting', () => {
            dataGrid.rowNavigation = true;
            expect(dataGrid.getAttribute('row-navigation')).toEqual('');
            expect(dataGrid.rowNavigation).toEqual(true);
            dataGrid.rowNavigation = false;
            expect(dataGrid.getAttribute('row-navigation')).toBeFalsy();
            expect(dataGrid.rowNavigation).toEqual(false);
        });
        it('can handle errant click', () => {
            const errors = jest.spyOn(global.console, 'error');
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect(errors).not.toHaveBeenCalled();
        });
        it('can handle ArrowUp key', () => {
            expect(dataGrid.activeCell.row).toEqual(0);
            let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(1);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(2);
            event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(1);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(0);
            dataGrid.dispatchEvent(event);
            expect(dataGrid.activeCell.row).toEqual(0);
        });
        it('should follow cell links with keyboard', () => {
            const hyperlinkClickListener = jest.fn();
            const buttonClickListener = jest.fn();
            const customLinkClickListener = jest.fn();
            dataGrid.resetCache();
            dataGrid.columns.splice(0, 0, {
                id: 'location-with-listener',
                name: 'Location',
                field: 'location',
                formatter: formatters.hyperlink,
                href: '#',
                click: hyperlinkClickListener,
            });
            dataGrid.resetCache();
            dataGrid.redraw();
            dataGrid.setActiveCell(0, 0, false);
            dataGrid.container.querySelector('ids-data-grid-cell').focus();
            dataGrid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            expect(hyperlinkClickListener).toHaveBeenCalled();
            dataGrid.resetCache();
            dataGrid.columns.splice(0, 0, {
                id: 'drilldown',
                name: '',
                formatter: dataGrid.formatters.button,
                icon: 'drilldown',
                type: 'icon',
                click: buttonClickListener,
            });
            dataGrid.resetCache();
            dataGrid.redraw();
            dataGrid.setActiveCell(0, 0, false);
            dataGrid.container.querySelector('ids-data-grid-cell').focus();
            dataGrid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            expect(buttonClickListener).toHaveBeenCalled();
            dataGrid.resetCache();
            dataGrid.columns.splice(0, 0, {
                id: 'custom',
                name: 'Custom Formatter',
                field: 'location',
                formatter: (rowData, columnData) => {
                    const value = `${rowData[columnData.field] || ''}`;
                    return `<a part="custom-link" href="#" class="text-ellipsis" tabindex="-1">${value}</a>`;
                },
                click: customLinkClickListener,
            });
            dataGrid.resetCache();
            dataGrid.redraw();
            dataGrid.setActiveCell(0, 0, false);
            dataGrid.container.querySelector('ids-data-grid-cell').focus();
            dataGrid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            expect(customLinkClickListener).toHaveBeenCalled();
        });
    });
    describe('Active Cell Tests', () => {
        it('fires activecellchange event', () => {
            const mockCallback = jest.fn((x) => {
                expect(x.detail.elem).toBeTruthy();
                expect(x.detail.activeCell.row).toEqual(1);
                expect(x.detail.activeCell.cell).toEqual(0);
                expect(x.detail.activeCell.node).toBeTruthy();
            });
            dataGrid.addEventListener('activecellchanged', mockCallback);
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            dataGrid.dispatchEvent(event);
            expect(mockCallback.mock.calls.length).toBe(1);
        });
        it('fires activecellchange event on click', () => {
            const mockCallback = jest.fn();
            dataGrid.addEventListener('activecellchanged', mockCallback);
            dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[3]
                .querySelectorAll('.ids-data-grid-cell')[3].click();
            expect(mockCallback.mock.calls.length).toBe(1);
            expect(dataGrid.activeCell.row).toEqual(2);
            expect(dataGrid.activeCell.cell).toEqual(3);
        });
    });
    describe('Theme/Style Tests', () => {
        it('supports setting mode', () => {
            dataGrid.mode = 'dark';
            expect(dataGrid.container.getAttribute('mode')).toEqual('dark');
        });
        it('renders with listStyle option', () => {
            dataGrid.listStyle = true;
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').classList.contains('is-list-style')).toBeTruthy();
            dataGrid.listStyle = false;
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').classList.contains('is-list-style')).toBeFalsy();
        });
        it('renders with listStyle  from template', () => {
            dataGrid = createFromTemplate(dataGrid, `<ids-data-grid list-style="true"></ids-data-grid>`);
            dataGrid.columns = columns();
            dataGrid.data = dataset;
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid').classList.contains('is-list-style')).toBeTruthy();
        });
    });
    describe('RTL/Language Tests', () => {
        it('supports readonly columns / RTL', () => {
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
                .querySelectorAll('.ids-data-grid-cell')[1].classList.contains('is-readonly')).toBeTruthy();
        });
        it('supports readonly RTL when set from the container', async () => {
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(5)').textContent.trim()).toEqual('2/23/2021');
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(6)').textContent.trim().replace(' ', ' ')).toEqual('1:25 PM');
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(7)').textContent.trim()).toEqual('13.99');
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(10)').textContent.trim()).toEqual('14');
            container.language = 'ar';
            await processAnimFrame();
            expect(dataGrid.getAttribute('dir')).toEqual('rtl');
            container.locale = 'de-DE';
            await processAnimFrame();
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(5)').textContent.trim()).toEqual('23.2.2021');
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(6)').textContent.trim()).toEqual('13:25');
            // Set to en-US for the example
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(7)').textContent.trim()).toEqual('13.99');
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(10)').textContent.trim()).toEqual('14');
            container.locale = 'en-US';
        });
    });
    describe('Selection Tests', () => {
        it('renders a radio for single select', () => {
            const newColumns = deepClone(columns());
            newColumns[0].id = 'selectionRadio';
            newColumns[0].formatter = formatters.selectionRadio;
            dataGrid.rowSelection = 'single';
            dataGrid.columns = newColumns;
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-radio').length).toEqual(9);
        });
        it('can disable the selectionRadio', () => {
            const newColumns = deepClone(columns());
            newColumns[0].id = 'selectionRadio';
            newColumns[0].formatter = formatters.selectionRadio;
            newColumns[0].disabled = (row, value, col, item) => item.book === 101;
            dataGrid.rowSelection = 'single';
            dataGrid.columns = newColumns;
            dataGrid.redraw();
            const radio = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelectorAll('.ids-data-grid-cell .ids-data-grid-radio')[0];
            expect(radio.classList.contains('disabled')).toBeTruthy();
            const radio2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelectorAll('.ids-data-grid-cell .ids-data-grid-radio')[0];
            expect(radio2.classList.contains('disabled')).toBeFalsy();
        });
        it('removes rowSelection on setting to false', () => {
            dataGrid.rowSelection = 'single';
            expect(dataGrid.getAttribute('row-selection')).toEqual('single');
            dataGrid.rowSelection = false;
            expect(dataGrid.getAttribute('row-selection')).toBeFalsy();
        });
        it('keeps selections on sort for single selection', async () => {
            dataGrid.deSelectAllRows();
            dataGrid.data = deepClone(dataset);
            const newColumns = deepClone(columns());
            newColumns[0].id = 'selectionRadio';
            newColumns[0].formatter = formatters.selectionRadio;
            dataGrid.rowSelection = 'single';
            dataGrid.columns = newColumns;
            await processAnimFrame();
            expect(dataGrid.selectedRows.length).toBe(0);
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(1)').click();
            expect(dataGrid.selectedRows.length).toBe(1);
            expect(dataGrid.selectedRows[0].index).toBe(1);
            let headers = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell');
            headers[2].querySelector('.ids-data-grid-header-cell-content').click();
            expect(dataGrid.selectedRows.length).toBe(1);
            expect(dataGrid.selectedRows[0].index).toBe(1);
            headers = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell');
            headers[2].querySelector('.ids-data-grid-header-cell-content').click();
            expect(dataGrid.selectedRows.length).toBe(1);
            expect(dataGrid.selectedRows[0].index).toBe(7);
        });
        it('keeps selections on sort for mixed selection', async () => {
            const newColumns = deepClone(columns());
            newColumns[0].id = 'selectionCheckbox';
            newColumns[0].formatter = formatters.selectionCheckbox;
            dataGrid.rowSelection = 'mixed';
            dataGrid.columns = newColumns;
            await processAnimFrame();
            expect(dataGrid.selectedRows.length).toBe(0);
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(1)').click();
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(3) .ids-data-grid-cell:nth-child(2)').click();
            expect(dataGrid.activatedRow.index).toBe(2);
            let headers = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell');
            headers[2].querySelector('.ids-data-grid-header-cell-content').click();
            expect(dataGrid.activatedRow.index).toBe(2);
            headers = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-header-cell');
            headers[2].querySelector('.ids-data-grid-header-cell-content').click();
            expect(dataGrid.activatedRow.index).toBe(6);
            expect(dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row.activated').getAttribute('aria-rowindex')).toBe('7');
        });
        it('can click the header checkbox to select all and deselect all', () => {
            const newColumns = deepClone(columns());
            newColumns[0].id = 'selectionCheckbox';
            newColumns[0].formatter = formatters.selectionCheckbox;
            dataGrid.rowSelection = 'multiple';
            dataGrid.columns = newColumns;
            dataGrid.redraw();
            dataGrid.header.headerCheckbox.click();
            expect(dataGrid.selectedRows.length).toBe(9);
            dataGrid.header.setHeaderCheckbox();
            dataGrid.header.headerCheckbox.click();
            expect(dataGrid.selectedRows.length).toBe(0);
        });
        it('can shift click to select in between', () => {
            const newColumns = deepClone(columns());
            newColumns[0].id = 'selectionCheckbox';
            newColumns[0].formatter = formatters.selectionCheckbox;
            dataGrid.rowSelection = 'multiple';
            dataGrid.columns = newColumns;
            dataGrid.redraw();
            expect(dataGrid.selectedRows.length).toBe(0);
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(1)').click();
            expect(dataGrid.selectedRows.length).toBe(1);
            let event = new MouseEvent('click', { bubbles: true, shiftKey: true });
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(7) .ids-data-grid-cell:nth-child(1)').dispatchEvent(event);
            expect(dataGrid.selectedRows.length).toBe(6);
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(6) .ids-data-grid-cell:nth-child(1)').click();
            expect(dataGrid.selectedRows.length).toBe(5);
            event = new MouseEvent('click', { bubbles: true, shiftKey: true });
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(4) .ids-data-grid-cell:nth-child(1)').dispatchEvent(event);
            expect(dataGrid.selectedRows.length).toBe(3);
        });
        it('can select the row ui via the row element', () => {
            const newColumns = deepClone(columns());
            newColumns[0].id = 'selectionCheckbox';
            newColumns[0].formatter = formatters.selectionCheckbox;
            dataGrid.rowSelection = 'multiple';
            dataGrid.columns = newColumns;
            dataGrid.redraw();
            const row = dataGrid.shadowRoot.querySelector('ids-data-grid-row:nth-child(2)');
            row.selected = true;
            expect(row.getAttribute('aria-selected')).toBe('true');
            row.selected = false;
            expect(row.getAttribute('aria-selected')).toBeFalsy();
        });
        it('can disable the selectionCheckbox', () => {
            const newColumns = deepClone(columns());
            newColumns[0].id = 'selectionCheckbox';
            newColumns[0].formatter = formatters.selectionCheckbox;
            newColumns[0].disabled = (row, value, col, item) => item.book === 101;
            dataGrid.rowSelection = 'multiple';
            dataGrid.columns = newColumns;
            dataGrid.redraw();
            const link = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelectorAll('.ids-data-grid-cell .ids-data-grid-checkbox')[0];
            expect(link.classList.contains('disabled')).toBeTruthy();
            const link2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelectorAll('.ids-data-grid-cell .ids-data-grid-checkbox')[0];
            expect(link2.classList.contains('disabled')).toBeFalsy();
        });
        it('can select a row with space key', () => {
            const newColumns = deepClone(columns());
            newColumns[0].id = 'selectionCheckbox';
            newColumns[0].formatter = formatters.selectionCheckbox;
            dataGrid.rowSelection = 'multiple';
            dataGrid.columns = newColumns;
            dataGrid.activeCell.node.focus();
            const event = new KeyboardEvent('keydown', { key: ' ' });
            dataGrid.dispatchEvent(event);
            expect(dataGrid.selectedRows.length).toBe(1);
        });
        it('handles suppress row deselection', () => {
            dataGrid.rowSelection = 'single';
            dataGrid.suppressRowDeselection = false;
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(1)').click();
            expect(dataGrid.selectedRows.length).toBe(1);
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(1)').click();
            expect(dataGrid.selectedRows.length).toBe(0);
            dataGrid.suppressRowDeselection = true;
            expect(dataGrid.suppressRowDeselection).toBeTruthy();
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(1)').click();
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(1)').click();
            expect(dataGrid.selectedRows.length).toBe(1);
            expect(dataGrid.selectedRows[0].index).toBe(1);
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(3) .ids-data-grid-cell:nth-child(1)').click();
            expect(dataGrid.selectedRows.length).toBe(1);
            expect(dataGrid.selectedRows[0].index).toBe(2);
        });
        it('handles suppressing caching', () => {
            expect(dataGrid.suppressCaching).toBe(false);
            dataGrid.suppressCaching = true;
            expect(dataGrid.suppressCaching).toBe(true);
            dataGrid.suppressCaching = false;
            expect(dataGrid.suppressCaching).toBe(false);
        });
        it('handles a deSelectRow method', () => {
            dataGrid.rowSelection = 'mixed';
            dataGrid.selectRow(1);
            dataGrid.deSelectRow(1);
            expect(dataGrid.selectedRows.length).toBe(0);
            expect(dataGrid.rowByIndex(1).classList.contains('mixed')).toBeFalsy();
        });
        it('handles a deSelectRow method', () => {
            dataGrid.rowNavigation = true;
            dataGrid.rowSelection = 'mixed';
            dataGrid.setActiveCell(0, 0);
            const event2 = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
            dataGrid.dispatchEvent(event2);
            dataGrid.deSelectRow(1);
            expect(dataGrid.activatedRow.index).toBe(0);
        });
        it('has no error on invalid selectRow / deSelectRow calls', () => {
            const errors = jest.spyOn(global.console, 'error');
            dataGrid.rowSelection = 'mixed';
            dataGrid.selectRow(100000);
            dataGrid.deSelectRow(100000);
            expect(errors).not.toHaveBeenCalled();
        });
    });
    describe('Activation Tests', () => {
        it('handles suppress row deactivation', () => {
            dataGrid.rowSelection = 'mixed';
            dataGrid.suppressRowDeactivation = false;
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(2)').click();
            expect(dataGrid.activatedRow.index).toBe(1);
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(2)').click();
            expect(dataGrid.activatedRow).toEqual({});
            dataGrid.suppressRowDeactivation = true;
            expect(dataGrid.suppressRowDeactivation).toBeTruthy();
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(2)').click();
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(2) .ids-data-grid-cell:nth-child(2)').click();
            expect(dataGrid.activatedRow.index).toBe(1);
            dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(3) .ids-data-grid-cell:nth-child(2)').click();
            expect(dataGrid.activatedRow.index).toBe(2);
        });
        it('should fire the rowactivated event', () => {
            const mockCallback = jest.fn((x) => {
                expect(x.detail.elem).toBeTruthy();
            });
            dataGrid.rowSelection = 'mixed';
            dataGrid.addEventListener('rowactivated', mockCallback);
            dataGrid.activateRow(1);
            expect(dataGrid.activatedRow.index).toBe(1);
            expect(mockCallback.mock.calls.length).toBe(1);
            dataGrid.rowSelection = false;
            dataGrid.activateRow(1);
            expect(dataGrid.activatedRow.index).toBe(1);
            expect(mockCallback.mock.calls.length).toBe(1);
        });
        it('handles a deactivateRow method', async () => {
            dataGrid.deactivateRow(1);
            expect(dataGrid.activatedRow).toEqual({});
            dataGrid.rowSelection = 'mixed';
            dataGrid.activateRow(1);
            await processAnimFrame();
            expect(dataGrid.activatedRow.data).toBeTruthy();
            dataGrid.deactivateRow(null);
            expect(dataGrid.activatedRow.data).toBeTruthy();
        });
    });
    describe('Paging Tests', () => {
        it('renders pager', () => {
            const selector = '.ids-data-grid-body .ids-data-grid-row';
            dataGrid.pagination = 'client-side';
            dataGrid.pageSize = 10;
            dataGrid.replaceWith(dataGrid);
            expect(dataGrid.shadowRoot.querySelector('ids-pager')).toBeDefined();
            expect(dataGrid.pagination).toBe('client-side');
            expect(dataGrid.pageSize).toBe(10);
            expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
        });
        it('hides pager when pagination attribute is "none"', () => {
            dataGrid.pagination = 'client-side';
            expect(dataGrid.pagination).toBe('client-side');
            expect(dataGrid.shadowRoot.querySelector('ids-pager')).toBeDefined();
            dataGrid.pagination = 'none';
            expect(dataGrid.pagination).toBe('none');
            expect(dataGrid.shadowRoot.querySelector('ids-pager')).toBe(null);
        });
        it('shows pager when pagination attribute is "standalone"', () => {
            expect(dataGrid.pagination).toBe('none');
            expect(dataGrid.shadowRoot.querySelector('ids-pager')).toBe(null);
            dataGrid.pagination = 'standalone';
            expect(dataGrid.pagination).toBe('standalone');
            expect(dataGrid.shadowRoot.querySelector('ids-pager')).toBeDefined();
        });
        it('shows pager when pagination attribute is "client-side"', () => {
            expect(dataGrid.pagination).toBe('none');
            expect(dataGrid.shadowRoot.querySelector('ids-pager')).toBe(null);
            dataGrid.pagination = 'client-side';
            dataGrid.paginate();
            expect(dataGrid.pagination).toBe('client-side');
            expect(dataGrid.shadowRoot.querySelector('ids-pager')).toBeDefined();
        });
        it('shows pager when pagination attribute is "server-side"', () => {
            expect(dataGrid.pagination).toBe('none');
            expect(dataGrid.shadowRoot.querySelector('ids-pager')).toBe(null);
            dataGrid.pagination = 'server-side';
            expect(dataGrid.pagination).toBe('server-side');
            expect(dataGrid.shadowRoot.querySelector('ids-pager')).toBeDefined();
        });
        it('has page-total attribute', () => {
            dataGrid.pagination = 'client-side';
            expect(dataGrid.pageTotal).toBeDefined();
            expect(dataGrid.pageTotal).toBe(9);
            dataGrid.pageTotal = 2;
            expect(dataGrid.pageTotal).toBe(2);
        });
        it('has page-size attribute', () => {
            dataGrid.pagination = 'client-side';
            expect(dataGrid.pageSize).toBeDefined();
            expect(dataGrid.pageSize).toBe(10);
            dataGrid.pageSize = 25;
            expect(dataGrid.pageSize).toBe(25);
            dataGrid.pageSize = 0;
            expect(dataGrid.pageSize).toBe(10);
        });
        it('has page-number attribute', () => {
            dataGrid.pagination = 'client-side';
            expect(dataGrid.pageNumber).toBeDefined();
            expect(dataGrid.pageNumber).toBe(1);
            dataGrid.pageNumber = 2;
            expect(dataGrid.pageNumber).toBe(2);
            dataGrid.pageNumber = 0;
            expect(dataGrid.pageNumber).toBe(1);
        });
        it.skip('always shows correct page-number in pager input-field', () => {
            dataGrid.pagination = 'client-side';
            dataGrid.replaceWith(dataGrid);
            expect(dataGrid.pageNumber).toBe(1);
            expect(dataGrid.pager.querySelector('ids-pager-input').input.value).toBe('1');
            dataGrid.pageNumber = 3;
            dataGrid.replaceWith(dataGrid);
            expect(dataGrid.pageNumber).toBe(3);
            expect(dataGrid.pager.querySelector('ids-pager-input').input.value).toBe('3');
        });
        it('can paginate to next page', () => {
            dataGrid.pagination = 'client-side';
            dataGrid.pageSize = 2;
            dataGrid.replaceWith(dataGrid);
            const { buttons } = dataGrid.pager.elements;
            expect(dataGrid.pageNumber).toBe(1);
            buttons.next.button.click();
            expect(dataGrid.pageNumber).toBe(2);
            buttons.next.button.click();
            expect(dataGrid.pageNumber).toBe(3);
        });
        it('can paginate to last page', () => {
            dataGrid.pagination = 'client-side';
            dataGrid.pageSize = 2;
            dataGrid.replaceWith(dataGrid);
            const { buttons } = dataGrid.pager.elements;
            expect(dataGrid.pageNumber).toBe(1);
            buttons.next.button.click();
            expect(dataGrid.pageNumber).toBe(2);
            buttons.last.button.click();
            expect(dataGrid.pageNumber).toBe(5);
            buttons.last.button.click();
            expect(dataGrid.pageNumber).toBe(5);
        });
        it('can paginate to previous page', () => {
            dataGrid.pagination = 'client-side';
            dataGrid.pageSize = 2;
            dataGrid.replaceWith(dataGrid);
            const { buttons } = dataGrid.pager.elements;
            const mouseClick = new MouseEvent('click', { bubbles: true });
            buttons.last.button.dispatchEvent(mouseClick);
            expect(dataGrid.pageNumber).toBe(5);
            buttons.previous.button.dispatchEvent(mouseClick);
            expect(dataGrid.pageNumber).toBe(4);
            buttons.previous.button.dispatchEvent(mouseClick);
            expect(dataGrid.pageNumber).toBe(3);
        });
        it('can paginate to first page', () => {
            dataGrid.pagination = 'client-side';
            dataGrid.pageSize = 2;
            dataGrid.replaceWith(dataGrid);
            const { buttons } = dataGrid.pager.elements;
            const mouseClick = new MouseEvent('click', { bubbles: true });
            buttons.last.button.dispatchEvent(mouseClick);
            expect(dataGrid.pageNumber).toBe(5);
            buttons.previous.button.dispatchEvent(mouseClick);
            expect(dataGrid.pageNumber).toBe(4);
            buttons.first.button.dispatchEvent(mouseClick);
            expect(dataGrid.pageNumber).toBe(1);
        });
        it('only fires pager events when pagination is "standalone"', () => {
            const pager = new IdsPager();
            document.body.appendChild(pager);
            dataGrid.pagination = 'standalone';
            dataGrid.pageSize = 2;
            dataGrid.pageNumber = 1;
            dataGrid.pager = pager;
            dataGrid.replaceWith(dataGrid);
            const { buttons } = dataGrid.pager.elements;
            const mouseClick = new MouseEvent('click', { bubbles: true });
            const pageNumberChangedListener = jest.fn();
            dataGrid.onEvent('pagenumberchange', dataGrid.pager, pageNumberChangedListener);
            expect(pageNumberChangedListener).toHaveBeenCalledTimes(0);
            // page numbers shouldn't change in standalone mode
            expect(dataGrid.pageNumber).toBe(1);
            buttons.next.button.dispatchEvent(mouseClick);
            expect(dataGrid.pageNumber).toBe(1);
            buttons.next.button.dispatchEvent(mouseClick);
            expect(dataGrid.pageNumber).toBe(1);
            expect(pageNumberChangedListener).toHaveBeenCalledTimes(2);
        });
        it('shows page-size popup-menu in the end-slot', () => {
            dataGrid.pagination = 'client-side';
            dataGrid.pageNumber = 1;
            dataGrid.pageSize = 3;
            dataGrid.replaceWith(dataGrid);
            const { slots } = dataGrid.pager.elements;
            expect(slots.start).toBeDefined();
            expect(slots.middle).toBeDefined();
            expect(slots.end).toBeDefined();
            const endSlotNodes = slots.end.assignedNodes();
            expect(endSlotNodes[0].querySelector('ids-menu-button')).toBeDefined();
            expect(endSlotNodes[0].querySelector('ids-popup-menu')).toBeDefined();
        });
        it('page-size popup-menu has options for: 10, 25, 50, 100', () => {
            dataGrid.pagination = 'client-side';
            dataGrid.pageNumber = 1;
            dataGrid.pageSize = 3;
            dataGrid.replaceWith(dataGrid);
            const pagerDropdown = dataGrid.pager.querySelector('ids-pager-dropdown');
            expect(pagerDropdown).toBeDefined();
            const popupMenu = pagerDropdown.popupMenu;
            const select10 = popupMenu.querySelector('ids-menu-item[value="10"]');
            const select25 = popupMenu.querySelector('ids-menu-item[value="25"]');
            const select50 = popupMenu.querySelector('ids-menu-item[value="50"]');
            const select100 = popupMenu.querySelector('ids-menu-item[value="100"]');
            expect(select10).toBeDefined();
            expect(select25).toBeDefined();
            expect(select50).toBeDefined();
            expect(select100).toBeDefined();
            const mouseClick = new MouseEvent('click', { bubbles: true });
            const menuButton = pagerDropdown.menuButton;
            select10.dispatchEvent(mouseClick);
            expect(menuButton.textContent).toContain('10 Records per page');
            select25.dispatchEvent(mouseClick);
            expect(menuButton.textContent).toContain('25 Records per page');
            select50.dispatchEvent(mouseClick);
            expect(menuButton.textContent).toContain('50 Records per page');
            select100.dispatchEvent(mouseClick);
            expect(menuButton.textContent).toContain('100 Records per page');
        });
    });
    describe('Expandable Row Tests', () => {
        // Some is covered by test can render with the expander formatter
        it('can render a template', async () => {
            // eslint-disable-next-line no-template-curly-in-string
            dataGrid.insertAdjacentHTML('afterbegin', '<template id="template-id"><span>${description}</span></template>');
            dataGrid.expandableRow = true;
            dataGrid.expandableRowTemplate = `template-id`;
            dataGrid.data[1].rowExpanded = true;
            dataGrid.columns = [{
                    id: 'description',
                    name: 'description',
                    formatter: dataGrid.formatters.expander
                }];
            await processAnimFrame();
            const area = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-expandable-row').innerHTML;
            expect(area).toBe('<span>101</span>');
        });
        it('can an empty template if invalid expandableRowTemplate', async () => {
            // eslint-disable-next-line no-template-curly-in-string
            dataGrid.expandableRow = true;
            dataGrid.expandableRowTemplate = `template-idxx`;
            dataGrid.data[1].rowExpanded = true;
            dataGrid.columns = [{
                    id: 'description',
                    name: 'description',
                    formatter: dataGrid.formatters.expander
                }];
            await processAnimFrame();
            const area = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-expandable-row').innerHTML;
            expect(area).toBe('');
        });
        it('can expand/collapse expandableRow', async () => {
            // eslint-disable-next-line no-template-curly-in-string
            dataGrid.insertAdjacentHTML('afterbegin', '<template id="template-id"><span>${description}</span></template>');
            dataGrid.expandableRow = true;
            dataGrid.expandableRowTemplate = `template-id`;
            dataGrid.resetCache();
            dataGrid.columns = [{
                    id: 'description',
                    name: 'description',
                    formatter: dataGrid.formatters.expander
                }];
            dataGrid.resetCache();
            dataGrid.redraw();
            await processAnimFrame();
            const firstRow = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1];
            expect(firstRow.getAttribute('aria-expanded')).toEqual('false');
            expect(firstRow.querySelector('.ids-data-grid-expandable-row').hasAttribute('hidden')).toBeTruthy();
            const expandButton = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelectorAll('.ids-data-grid-cell')[0].querySelector('ids-button');
            const mouseClick = new MouseEvent('click', { bubbles: true });
            expandButton.dispatchEvent(mouseClick);
            expect(firstRow.getAttribute('aria-expanded')).toEqual('true');
            expect(firstRow.querySelector('.ids-data-grid-expandable-row').hasAttribute('hidden')).toBeFalsy();
            expandButton.dispatchEvent(mouseClick);
            expect(firstRow.getAttribute('aria-expanded')).toEqual('false');
            expect(firstRow.querySelector('.ids-data-grid-expandable-row').hasAttribute('hidden')).toBeTruthy();
        });
        it('can set the expandableRow setting', () => {
            dataGrid.expandableRow = true;
            expect(dataGrid.getAttribute('expandable-row')).toEqual('true');
            dataGrid.expandableRow = false;
            expect(dataGrid.getAttribute('expandable-row')).toBeFalsy();
        });
        it('can set the expandableRowTemplate setting', () => {
            dataGrid.expandableRowTemplate = 'myid';
            expect(dataGrid.getAttribute('expandable-row-template')).toEqual('myid');
            expect(dataGrid.expandableRowTemplate).toEqual('myid');
            dataGrid.expandableRowTemplate = '';
            expect(dataGrid.getAttribute('expandable-row-template')).toBeFalsy();
            expect(dataGrid.expandableRowTemplate).toEqual('');
        });
    });
    describe('Tree Grid Tests', () => {
        const treeColumns = [];
        treeColumns.push({
            id: 'selectionCheckbox',
            name: 'selection',
            sortable: false,
            resizable: false,
            formatter: formatters.selectionCheckbox,
            align: 'center',
            frozen: 'left'
        });
        treeColumns.push({
            id: 'name',
            name: 'Name',
            field: 'name',
            sortable: true,
            resizable: true,
            formatter: formatters.tree
        });
        treeColumns.push({
            id: 'id',
            name: 'Id',
            field: 'id',
            sortable: true,
            resizable: true,
            formatter: formatters.text
        });
        it('can render a tree', async () => {
            dataGrid.treeGrid = true;
            dataGrid.columns = treeColumns;
            dataGrid.data = datasetTree;
            const rows = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row');
            expect(rows.length).toBe(23);
        });
        it('can expand/collapse tree', async () => {
            dataGrid.treeGrid = true;
            dataGrid.columns = treeColumns;
            dataGrid.data = datasetTree;
            dataGrid.rowSelection = 'multiple';
            const firstRow = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1];
            expect(firstRow.getAttribute('aria-expanded')).toEqual('false');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row[hidden]').length).toBe(3);
            const expandButton = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelectorAll('.ids-data-grid-cell')[1].querySelector('ids-button');
            const mouseClick = new MouseEvent('click', { bubbles: true });
            expandButton.dispatchEvent(mouseClick);
            expect(firstRow.getAttribute('aria-expanded')).toEqual('true');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row[hidden]').length).toBe(0);
            const seventhRow = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[7];
            expect(seventhRow.getAttribute('aria-expanded')).toEqual('true');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row[hidden]').length).toBe(0);
            const expandButton2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[7].querySelectorAll('.ids-data-grid-cell')[1].querySelector('ids-button');
            expandButton2.dispatchEvent(mouseClick);
            expect(seventhRow.getAttribute('aria-expanded')).toEqual('false');
            expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row[hidden]').length).toBe(7);
        });
        it('handles selection without children', async () => {
            dataGrid.treeGrid = true;
            dataGrid.columns = treeColumns;
            dataGrid.data = datasetTree;
            dataGrid.rowSelection = 'multiple';
            const selectCheck = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelectorAll('.ids-data-grid-cell')[1];
            expect(dataGrid.selectedRows.length).toBe(0);
            const mouseClick = new MouseEvent('click', { bubbles: true });
            selectCheck.dispatchEvent(mouseClick);
            expect(dataGrid.selectedRows.length).toBe(1);
            selectCheck.dispatchEvent(mouseClick);
            expect(dataGrid.selectedRows.length).toBe(0);
        });
        it('handles selection including children', async () => {
            dataGrid.treeGrid = true;
            dataGrid.columns = treeColumns;
            dataGrid.data = datasetTree;
            dataGrid.rowSelection = 'multiple';
            dataGrid.groupSelectsChildren = true;
            const selectCheck = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelectorAll('.ids-data-grid-cell')[1];
            expect(dataGrid.selectedRows.length).toBe(0);
            const mouseClick = new MouseEvent('click', { bubbles: true });
            selectCheck.dispatchEvent(mouseClick);
            expect(dataGrid.selectedRows.length).toBe(4);
            selectCheck.dispatchEvent(mouseClick);
            expect(dataGrid.selectedRows.length).toBe(0);
        });
        it('handles suppressRowClickSelection including children', async () => {
            dataGrid.treeGrid = true;
            dataGrid.columns = treeColumns;
            dataGrid.data = datasetTree;
            dataGrid.suppressRowClickSelection = true;
            dataGrid.rowSelection = 'multiple';
            const mouseClick = new MouseEvent('click', { bubbles: true });
            const otherCell = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelectorAll('.ids-data-grid-cell')[2];
            otherCell.dispatchEvent(mouseClick);
            expect(dataGrid.selectedRows.length).toBe(0);
            const selectCheck = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelectorAll('.ids-data-grid-cell')[0];
            selectCheck.dispatchEvent(mouseClick);
            expect(dataGrid.selectedRows.length).toBe(1);
        });
        it('can expand with the keyboard', async () => {
            dataGrid.treeGrid = true;
            dataGrid.columns = treeColumns;
            dataGrid.data = datasetTree;
            const firstRow = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1];
            expect(firstRow.getAttribute('aria-expanded')).toEqual('true');
            dataGrid.setActiveCell(0, 0, true);
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
            dataGrid.dispatchEvent(event);
            const event2 = new KeyboardEvent('keydown', { key: ' ' });
            dataGrid.dispatchEvent(event2);
            expect(firstRow.getAttribute('aria-expanded')).toEqual('false');
        });
        it('can set the suppressRowClickSelection setting', () => {
            dataGrid.suppressRowClickSelection = true;
            expect(dataGrid.getAttribute('suppress-row-click-selection')).toEqual('true');
            dataGrid.suppressRowClickSelection = false;
            expect(dataGrid.getAttribute('suppress-row-click-selection')).toBeFalsy();
        });
        it('can set the treeGrid setting', () => {
            dataGrid.treeGrid = true;
            expect(dataGrid.getAttribute('tree-grid')).toEqual('true');
            dataGrid.treeGrid = false;
            expect(dataGrid.getAttribute('tree-grid')).toBeFalsy();
        });
        it('can set the idColumn setting', () => {
            dataGrid.idColumn = 'myid';
            expect(dataGrid.getAttribute('id-column')).toEqual('myid');
            dataGrid.idColumn = '';
            expect(dataGrid.getAttribute('id-column')).toBeFalsy();
        });
    });
    describe('Events Tests', () => {
        it('should fire rowclick and rowdoubleclick events', () => {
            const clickCallback = jest.fn((e) => {
                expect(e.detail.row?.getAttribute('data-index')).toEqual('0');
            });
            const dblClickCallback = jest.fn((e) => {
                expect(e.detail.row?.getAttribute('data-index')).toEqual('0');
            });
            dataGrid.addEventListener('rowclick', clickCallback);
            dataGrid.addEventListener('rowdoubleclick', dblClickCallback);
            const firstCellInRow = dataGrid.container.querySelector('.ids-data-grid-body .ids-data-grid-cell');
            const clickEvent = new MouseEvent('click', { bubbles: true });
            const dblClickEvent = new MouseEvent('dblclick', { bubbles: true });
            firstCellInRow.dispatchEvent(clickEvent);
            firstCellInRow.dispatchEvent(dblClickEvent);
            // body click edge case
            const body = dataGrid.container.querySelector('.ids-data-grid-body');
            body.dispatchEvent(clickEvent);
            body.dispatchEvent(dblClickEvent);
            expect(clickCallback.mock.calls.length).toBe(1);
            expect(dblClickCallback.mock.calls.length).toBe(1);
        });
    });
    describe('Editing Tests', () => {
        const dropdownCellQuery = () => dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(8)');
        const activateDropdownCell = () => {
            dataGrid.editable = true;
            dataGrid.setActiveCell(7, 1);
            const enterKey = new KeyboardEvent('keydown', { key: 'Enter' });
            dataGrid.dispatchEvent(enterKey);
        };
        it('should be able to edit a cell and type a value', () => {
            dataGrid.editable = true;
            const clickEvent = new MouseEvent('click', { bubbles: true });
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            const nextCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(4)');
            editableCell.dispatchEvent(clickEvent);
            expect(editableCell.classList.contains('is-editing')).toBeTruthy();
            editableCell.querySelector('ids-input').value = 'test';
            nextCell.dispatchEvent(clickEvent);
            expect(editableCell.textContent).toBe('test');
        });
        it('should be able to edit a cell and validate a value', () => {
            dataGrid.editable = true;
            const clickEvent = new MouseEvent('click', { bubbles: true });
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            const nextCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(4)');
            editableCell.dispatchEvent(clickEvent);
            editableCell.dispatchEvent(clickEvent); // skipped
            editableCell.querySelector('ids-input').value = '';
            nextCell.dispatchEvent(clickEvent);
            expect(editableCell.textContent).toBe('');
            expect(editableCell.classList.contains('is-invalid')).toBeTruthy();
        });
        it('should handle error situations', () => {
            const errors = jest.spyOn(global.console, 'error');
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            editableCell.isEditing = true;
            editableCell.startCellEdit();
            expect(errors).not.toHaveBeenCalled();
        });
        it('can veto edit on with readonly/disabled', () => {
            const readonlyCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(1) > .ids-data-grid-cell:nth-child(3)');
            readonlyCell.startCellEdit();
            expect(readonlyCell.classList.contains('is-editing')).toBeFalsy();
            readonlyCell.classList.remove('is-readonly');
            readonlyCell.classList.add('is-disabled');
            readonlyCell.startCellEdit();
            expect(readonlyCell.classList.contains('is-editing')).toBeFalsy();
        });
        it('can veto edit on with beforeCellEdit', () => {
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            dataGrid.addEventListener('beforecelledit', (e) => {
                e.detail.response(false);
            });
            editableCell.startCellEdit();
            expect(editableCell.classList.contains('is-editing')).toBeFalsy();
        });
        it('clears invalid state on edit', () => {
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            editableCell.classList.add('is-invalid');
            editableCell.startCellEdit();
            expect(editableCell.classList.contains('is-invalid')).toBeFalsy();
        });
        it('add inline class', () => {
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            editableCell.column.editor.inline = true;
            editableCell.startCellEdit();
            expect(editableCell.classList.contains('is-inline')).toBeTruthy();
        });
        it('rendercell on rowNumber columns', () => {
            const rowNumberCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(1) > .ids-data-grid-cell:nth-child(2)');
            rowNumberCell.renderCell();
            expect(rowNumberCell.textContent).toBe('1');
        });
        it('endCellEdit on valid columns', () => {
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            editableCell.column.editor.editorSettings.validate = null;
            editableCell.endCellEdit();
            expect(editableCell.isInValid).toBe(false);
        });
        it('should be able to edit a cell and reset validation state', () => {
            dataGrid.editable = true;
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            editableCell.isInValid = true;
            editableCell.startCellEdit();
            editableCell.querySelector('ids-input').value = '102';
            editableCell.endCellEdit();
            expect(editableCell.classList.contains('is-invalid')).toBeFalsy();
        });
        it('should be able to cancell a cell and reset validation state', () => {
            dataGrid.editable = true;
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            expect(editableCell.textContent).toBe('102');
            editableCell.startCellEdit();
            editableCell.querySelector('ids-input').value = 'Test';
            editableCell.cancelCellEdit();
            expect(editableCell.textContent).toBe('102');
        });
        it('can edit date cells', () => {
            dataGrid.editable = true;
            dataGrid.setActiveCell(2, 1);
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(5)');
            const nextCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(4)');
            expect(editableCell.textContent).toBe('2/23/2021');
            const clickEvent = new MouseEvent('click', { bubbles: true });
            editableCell.dispatchEvent(clickEvent);
            editableCell.querySelector('ids-input').value = '10/10/2023';
            nextCell.dispatchEvent(clickEvent);
            expect(editableCell.textContent).toBe('10/10/2023');
        });
        it('show and revert dirty indicators on cells', () => {
            dataGrid.editable = true;
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            dataGrid.setActiveCell(2, 1);
            editableCell.startCellEdit();
            editableCell.querySelector('ids-input').value = 'test';
            editableCell.querySelector('ids-input').dirty = {};
            editableCell.querySelector('ids-input').dirty.original = '102';
            editableCell.endCellEdit();
            expect(editableCell.classList.contains('is-dirty')).toBeTruthy();
            editableCell.startCellEdit();
            editableCell.querySelector('ids-input').value = '102';
            editableCell.endCellEdit();
            expect(editableCell.classList.contains('is-dirty')).toBeFalsy();
        });
        it('show and revert validation indicators on cells', () => {
            dataGrid.editable = true;
            const clickEvent = new MouseEvent('click', { bubbles: true });
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            const nextCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(4)');
            expect(editableCell.textContent).toBe('102');
            editableCell.dispatchEvent(clickEvent);
            editableCell.querySelector('ids-input').value = '';
            nextCell.dispatchEvent(clickEvent);
            expect(editableCell.textContent).toBe('');
            expect(editableCell.classList.contains('is-invalid')).toBeTruthy();
            editableCell.dispatchEvent(clickEvent);
            editableCell.querySelector('ids-input').value = '102';
            nextCell.dispatchEvent(clickEvent);
            expect(editableCell.textContent).toBe('102');
            expect(editableCell.classList.contains('is-invalid')).toBeFalsy();
        });
        it('can edit as checkboxes', () => {
            dataGrid.editable = true;
            const clickEvent = new MouseEvent('click', { bubbles: true });
            const nextCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(4)');
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(12)');
            expect(editableCell.querySelector('[aria-checked]').getAttribute('aria-checked')).toBe('false');
            editableCell.dispatchEvent(clickEvent);
            nextCell.dispatchEvent(clickEvent);
            expect(editableCell.querySelector('[aria-checked]').getAttribute('aria-checked')).toBe('true');
        });
        it('covers the checkboxes editor', () => {
            dataGrid.editable = true;
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(12)');
            editableCell.startCellEdit();
            editableCell.editor.isClick = true;
            editableCell.editor.init(editableCell);
            expect(editableCell.editor.input.checked).toBe(true);
            editableCell.endCellEdit();
            editableCell.startCellEdit();
            editableCell.editor.isClick = false;
            editableCell.editor.init(editableCell);
            expect(editableCell.editor.input.checked).toBe(false);
            editableCell.endCellEdit();
        });
        it('can reset dirty cells', () => {
            dataGrid.editable = true;
            dataGrid.resetDirtyCells();
            expect(dataGrid.dirtyCells.length).toBe(0);
            dataGrid.data[1].dirtyCells = [];
            dataGrid.data[1].dirtyCells.push({ row: 1, cell: 0, originalValue: 'x' });
            expect(dataGrid.dirtyCells.length).toBe(1);
            dataGrid.resetDirtyCells();
            expect(dataGrid.dirtyCells.length).toBe(0);
        });
        it('can set the editable setting', () => {
            dataGrid.editable = true;
            expect(dataGrid.getAttribute('editable')).toEqual('true');
            expect(dataGrid.editable).toEqual(true);
            dataGrid.editable = false;
            expect(dataGrid.getAttribute('editable')).toBeFalsy();
            expect(dataGrid.editable).toEqual(false);
        });
        it('can set the editNextOnEnterPress setting', () => {
            dataGrid.editNextOnEnterPress = true;
            expect(dataGrid.getAttribute('edit-next-on-enter-press')).toEqual('true');
            expect(dataGrid.editNextOnEnterPress).toEqual(true);
            dataGrid.editNextOnEnterPress = false;
            expect(dataGrid.getAttribute('edit-next-on-enter-press')).toBeFalsy();
            expect(dataGrid.editNextOnEnterPress).toEqual(false);
        });
        it('can call commit commitCellEdit', () => {
            dataGrid.editable = true;
            const clickEvent = new MouseEvent('click', { bubbles: true });
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            expect(editableCell.textContent).toBe('102');
            editableCell.dispatchEvent(clickEvent);
            editableCell.querySelector('ids-input').value = 'test';
            dataGrid.commitCellEdit();
            expect(editableCell.textContent).toBe('test');
        });
        it('can call commit cancelCellEdit', () => {
            dataGrid.editable = true;
            const editableCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            expect(editableCell.textContent).toBe('102');
            editableCell.startCellEdit();
            dataGrid.cancelCellEdit();
            expect(editableCell.textContent).toBe('102');
            expect(editableCell.classList.contains('is-editing')).toBe(false);
        });
        it('can call addRow', () => {
            expect(dataGrid.container.querySelectorAll('.ids-data-grid-row').length).toEqual(10);
            dataGrid.addRow({ description: 'test' });
            expect(dataGrid.container.querySelectorAll('.ids-data-grid-row').length).toEqual(11);
        });
        it('can call removeRow', async () => {
            await processAnimFrame();
            expect(dataGrid.container.querySelectorAll('.ids-data-grid-row').length).toEqual(10);
            dataGrid.addRow({ description: 'test' });
            expect(dataGrid.container.querySelectorAll('.ids-data-grid-row').length).toEqual(11);
            dataGrid.removeRow(9);
            expect(dataGrid.container.querySelectorAll('.ids-data-grid-row').length).toEqual(10);
        });
        it('can call clearRow', async () => {
            const descCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(8) > .ids-data-grid-cell:nth-child(3)');
            expect(descCell.textContent).toEqual('108');
            dataGrid.clearRow(7);
            await processAnimFrame();
            expect(dataGrid.container.querySelector('.ids-data-grid-row:nth-child(8) > .ids-data-grid-cell:nth-child(3)').textContent).toEqual('');
        });
        it('can call editFirstCell', () => {
            const descCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            expect(descCell.classList.contains('is-editing')).toBeFalsy();
            dataGrid.setActiveCell(0, 1);
            dataGrid.editFirstCell();
            expect(descCell.classList.contains('is-editing')).toBeTruthy();
        });
        it('can enter edit mode with enter and exit with arrows', () => {
            dataGrid.editable = true;
            const descCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            dataGrid.setActiveCell(2, 1);
            expect(descCell.classList.contains('is-editable')).toBeTruthy();
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            dataGrid.dispatchEvent(event);
            const event2 = new KeyboardEvent('keydown', { key: ' ' }); // Ignored
            dataGrid.dispatchEvent(event2);
            dataGrid.dispatchEvent(event2);
            expect(descCell.classList.contains('is-editing')).toBeTruthy();
            const event3 = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
            dataGrid.dispatchEvent(event3);
            expect(descCell.classList.contains('is-editing')).toBeFalsy();
        });
        it('can enter edit mode with enter and exit with f2', () => {
            dataGrid.editable = true;
            const descCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            dataGrid.setActiveCell(2, 1);
            expect(descCell.classList.contains('is-editable')).toBeTruthy();
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            dataGrid.dispatchEvent(event);
            const event2 = new KeyboardEvent('keydown', { key: 'F2' });
            dataGrid.dispatchEvent(event2);
            expect(descCell.classList.contains('is-editing')).toBeFalsy();
        });
        it('can enter edit mode with enter and cancel with ESC', () => {
            dataGrid.editable = true;
            const descCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            dataGrid.setActiveCell(2, 1);
            expect(descCell.classList.contains('is-editable')).toBeTruthy();
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            dataGrid.dispatchEvent(event);
            const event2 = new KeyboardEvent('keydown', { key: 'Escape' });
            dataGrid.dispatchEvent(event2);
            expect(descCell.classList.contains('is-editing')).toBeFalsy();
        });
        it('can enter edit mode with enter by typing', () => {
            dataGrid.editable = true;
            const descCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            dataGrid.setActiveCell(2, 1);
            expect(descCell.classList.contains('is-editable')).toBeTruthy();
            const event = new KeyboardEvent('keydown', { key: 'a' });
            dataGrid.dispatchEvent(event);
            expect(descCell.classList.contains('is-editing')).toBeTruthy();
        });
        it('can enter edit mode and editNextOnEnterPress', () => {
            dataGrid.editable = true;
            dataGrid.editNextOnEnterPress = true;
            const descCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            dataGrid.setActiveCell(2, 1);
            expect(descCell.classList.contains('is-editable')).toBeTruthy();
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            dataGrid.dispatchEvent(event);
            expect(descCell.classList.contains('is-editing')).toBeTruthy();
            const event2 = new KeyboardEvent('keydown', { key: 'a' });
            dataGrid.dispatchEvent(event2);
            dataGrid.dispatchEvent(event);
            expect(descCell.classList.contains('is-editing')).toBeFalsy();
        });
        it('can continue to enter edit mode with tabbing', () => {
            dataGrid.editable = true;
            const tabKey = new KeyboardEvent('keydown', { key: 'Tab' });
            dataGrid.dispatchEvent(tabKey); // Does nothing
            const descCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(3)');
            dataGrid.setActiveCell(2, 1);
            expect(descCell.classList.contains('is-editable')).toBeTruthy();
            const event = new KeyboardEvent('keydown', { key: 'a' });
            dataGrid.dispatchEvent(event);
            expect(descCell.classList.contains('is-editing')).toBeTruthy();
            for (let index = 0; index < 300; index++) {
                dataGrid.dispatchEvent(tabKey);
                expect(dataGrid.container.querySelectorAll('.is-editing').length).toBe(1);
            }
            const shiftTabKey = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
            for (let index = 0; index < 300; index++) {
                dataGrid.dispatchEvent(shiftTabKey);
                expect(dataGrid.container.querySelectorAll('.is-editing').length).toBe(1);
            }
            for (let index = 0; index < 300; index++) {
                dataGrid.dispatchEvent(tabKey);
                expect(dataGrid.container.querySelectorAll('.is-editing').length).toBe(1);
            }
            for (let index = 0; index < 300; index++) {
                dataGrid.dispatchEvent(shiftTabKey);
                expect(dataGrid.container.querySelectorAll('.is-editing').length).toBe(1);
            }
        });
        it('space toggles editable checkboxes', () => {
            dataGrid.editable = true;
            const checkCell = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(12)');
            dataGrid.setActiveCell(11, 1);
            expect(checkCell.querySelector('[aria-checked]').getAttribute('aria-checked')).toBe('false');
            const event = new KeyboardEvent('keydown', { key: ' ' });
            dataGrid.dispatchEvent(event);
            const checkCell2 = dataGrid.container.querySelector('.ids-data-grid-row:nth-child(2) > .ids-data-grid-cell:nth-child(12)');
            expect(checkCell2.querySelector('ids-checkbox').getAttribute('checked')).toBe('true');
        });
        it('supports a dropdown editor', () => {
            const dropdownCell = dropdownCellQuery();
            activateDropdownCell();
            expect(dropdownCell.classList.contains('is-editing')).toBeTruthy();
            expect(dropdownCell.querySelector('ids-dropdown')).not.toBeNull();
        });
        it('can change cell value using dropdown editor', () => {
            const dropdownCell = dropdownCellQuery();
            const arrowDownKey = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            const enterKey = new KeyboardEvent('keydown', { key: 'Enter' });
            activateDropdownCell();
            const dropdown = dropdownCell.querySelector('ids-dropdown');
            dropdown.focus();
            dropdown.dispatchEvent(arrowDownKey); // navigates list box options
            dropdown.dispatchEvent(enterKey); // selects option
            expect(dropdown.value).toEqual('yen');
            dropdownCell.endCellEdit();
            expect(dropdownCell.classList.contains('is-editing')).toBeFalsy();
        });
    });
});
//# sourceMappingURL=ids-data-grid-func-test.js.map