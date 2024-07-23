// Supporting components
import '../ids-lookup';
import booksJSON from '../../../assets/data/books.json';
// Example for populating the DataGrid
const lookup = document.querySelector('#lookup-1');
const container = document.querySelector('ids-container');
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
    const setData = async () => {
        const res = await fetch(url);
        const data = await res.json();
        lookup.dataGridSettings = {
            rowSelection: 'multiple',
            pageSize: 5,
            pageNumber: 1,
            pageTotal: data.length,
            pagination: 'client-side'
        };
        lookup.data = data;
    };
    setData();
}());
//# sourceMappingURL=pagination-client.js.map