// Supporting components
import '../ids-lookup';
import booksJSON from '../../../assets/data/books.json';
// Example for populating the DataGrid
const lookup = document.querySelector('#lookup-1');
const container = document.querySelector('ids-container');
const autocompleteLookup = document.querySelector('#lookup-6');
const autocomplete = autocompleteLookup?.shadowRoot?.querySelector('ids-trigger-field');
(async function init() {
    // Set a Locale and wait for it to load
    await container.setLocale('en-US');
    // Do an ajax request
    const url = booksJSON;
    const columns = [];
    // Set up columns
    columns.push({
        id: 'selectionCheckbox',
        name: 'selection',
        sortable: false,
        resizable: false,
        formatter: lookup.dataGrid.formatters.selectionCheckbox,
        align: 'center'
    });
    columns.push({
        id: 'rowNumber',
        name: '#',
        formatter: lookup.dataGrid.formatters.rowNumber,
        sortable: false,
        readonly: true,
        width: 65
    });
    columns.push({
        id: 'description',
        name: 'Description',
        field: 'description',
        sortable: true,
        formatter: lookup.dataGrid.formatters.text
    });
    columns.push({
        id: 'ledger',
        name: 'Ledger',
        field: 'ledger',
        formatter: lookup.dataGrid.formatters.text
    });
    columns.push({
        id: 'price',
        name: 'Price',
        field: 'price',
        formatter: lookup.dataGrid.formatters.decimal,
        formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    columns.push({
        id: 'bookCurrency',
        name: 'Currency',
        field: 'bookCurrency',
        formatter: lookup.dataGrid.formatters.text
    });
    lookup.columns = columns;
    autocompleteLookup.columns = columns;
    const addEventListeners = () => {
        lookup.addEventListener('change', () => {
            console.info(`Value Changed`, lookup.dataGrid.selectedRows, lookup.value);
        });
        lookup.addEventListener('rowselected', (e) => {
            console.info(`Row Selected`, e.detail);
        });
        lookup.addEventListener('rowdeselected', (e) => {
            console.info(`Row DeSelected`, e.detail);
        });
        lookup.addEventListener('selectionchanged', (e) => {
            console.info(`Selection Changed`, e.detail);
        });
    };
    lookup.dataGridSettings = {
        rowSelection: 'multiple'
    };
    autocompleteLookup.dataGridSettings = {
        rowSelection: 'multiple'
    };
    const setData = async () => {
        const res = await fetch(url);
        const data = await res.json();
        lookup.data = data;
        autocomplete.data = data;
        autocompleteLookup.data = data;
    };
    setData();
    addEventListeners();
}());
//# sourceMappingURL=example.js.map