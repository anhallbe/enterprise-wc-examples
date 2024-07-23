import '../ids-data-grid';
import booksJSON from '../../../assets/data/books.json';
// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-empty-message');
const showEmptyData = true;
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
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'publishDate',
            name: 'Pub. Date',
            field: 'publishDate',
            resizable: true,
            reorderable: true,
            formatter: dataGrid.formatters.date
        });
        dataGrid.columns = columns;
        const setData = async () => {
            const res = await fetch(url);
            const data = await res.json();
            dataGrid.data = showEmptyData ? [] : data;
        };
        setData();
    }());
}
//# sourceMappingURL=empty-message.js.map