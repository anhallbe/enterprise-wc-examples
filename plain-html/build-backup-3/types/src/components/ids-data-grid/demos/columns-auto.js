import '../ids-data-grid';
import booksJSON from '../../../assets/data/books.json';
// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-columns-auto');
if (dataGrid) {
    (async function init() {
        // Do an ajax request
        const url = booksJSON;
        const columns = [];
        // Set up columns
        columns.push({
            id: 'drilldown',
            name: '',
            sortable: false,
            resizable: false,
            formatter: dataGrid.formatters.button,
            icon: 'drilldown',
            type: 'icon',
            align: 'center',
            disabled: (row, value, col, item) => item.book === 101,
            click: (info) => {
                console.info('Drilldown clicked', info);
            },
            text: 'Drill Down',
            width: 56
        });
        columns.push({
            id: 'description',
            name: 'Description',
            field: 'description',
            sortable: true,
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'ledger',
            name: 'Ledger',
            field: 'ledger',
            sortable: true,
            formatter: dataGrid.formatters.text,
            hidden: true
        });
        columns.push({
            id: 'publishDate',
            name: 'Pub. Date',
            field: 'publishDate',
            sortable: true,
            formatter: dataGrid.formatters.date
        });
        columns.push({
            id: 'publishTime',
            name: 'Pub. Time',
            field: 'publishDate',
            sortable: true,
            formatter: dataGrid.formatters.time
        });
        columns.push({
            id: 'price',
            name: 'Price',
            field: 'price',
            align: 'right',
            sortable: true,
            formatter: dataGrid.formatters.decimal,
            formatOptions: { locale: 'en-US' } // Data Values are in en-US
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
//# sourceMappingURL=columns-auto.js.map