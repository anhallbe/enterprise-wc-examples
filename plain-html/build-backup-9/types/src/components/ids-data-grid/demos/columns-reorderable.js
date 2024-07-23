import '../ids-data-grid';
import booksJSON from '../../../assets/data/books.json';
// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-columns-resize');
if (dataGrid) {
    (async function init() {
        // Do an ajax request
        const url = booksJSON;
        const columns = [];
        // Set up columns
        columns.push({
            id: 'selectionCheckbox',
            name: 'selection',
            sortable: false,
            resizable: false,
            formatter: dataGrid.formatters.selectionCheckbox,
            align: 'center'
        });
        columns.push({
            id: 'rowNumber',
            name: '#',
            formatter: dataGrid.formatters.rowNumber,
            sortable: false,
            resizable: true,
            reorderable: true,
            readonly: true,
            width: 65
        });
        columns.push({
            id: 'description',
            name: 'Description',
            field: 'description',
            sortable: true,
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'ledger',
            name: 'Ledger',
            field: 'ledger',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.text,
            hidden: true
        });
        columns.push({
            id: 'publishDate',
            name: 'Pub. Date',
            field: 'publishDate',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.date,
            minWidth: 50,
            maxWidth: 300
        });
        columns.push({
            id: 'publishTime',
            name: 'Pub. Time',
            field: 'publishDate',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.time,
            minWidth: 50,
            maxWidth: 300
        });
        columns.push({
            id: 'price',
            name: 'Price',
            field: 'price',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.decimal,
            formatOptions: { locale: 'en-US' } // Data Values are in en-US
        });
        columns.push({
            id: 'bookCurrency',
            name: 'Currency',
            field: 'bookCurrency',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'transactionCurrency',
            name: 'Transaction Currency',
            field: 'transactionCurrency',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.text,
        });
        columns.push({
            id: 'integer',
            name: 'Price (Int)',
            field: 'price',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.integer,
            formatOptions: { locale: 'en-US' } // Data Values are in en-US
        });
        columns.push({
            id: 'location',
            name: 'Location',
            field: 'location',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.hyperlink,
            href: '#'
        });
        columns.push({
            id: 'postHistory',
            name: 'Post History',
            field: 'postHistory',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'active',
            name: 'Active',
            field: 'active',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'convention',
            name: 'Convention',
            field: 'convention',
            resizable: true,
            reorderable: true,
            align: 'center',
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'methodSwitch',
            name: 'Method Switch',
            field: 'methodSwitch',
            align: 'right',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'trackDeprecationHistory',
            name: 'Track Deprecation History',
            field: 'trackDeprecationHistory',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'useForEmployee',
            name: 'Use For Employee',
            field: 'useForEmployee',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.password,
            hidden: true
        });
        columns.push({
            id: 'deprecationHistory',
            name: 'Deprecation History',
            field: 'deprecationHistory',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.text,
            hidden: true
        });
        dataGrid.columns = columns;
        const setData = async () => {
            const res = await fetch(url);
            const data = await res.json();
            dataGrid.data = data;
        };
        setData();
    }());
}
//# sourceMappingURL=columns-reorderable.js.map