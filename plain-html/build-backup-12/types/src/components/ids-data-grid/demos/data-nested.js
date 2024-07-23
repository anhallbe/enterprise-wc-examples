import '../ids-data-grid';
import assetsJSON from '../../../assets/data/assets.json';
// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-1');
if (dataGrid) {
    (async function init() {
        // Do an ajax request
        const url = assetsJSON;
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
            id: 'description',
            name: 'Description',
            field: 'description',
            sortable: true,
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'type',
            name: 'Type',
            field: 'type',
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'status',
            name: 'Status',
            field: 'status',
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'action',
            name: 'Action',
            field: 'detail.action',
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'ticket',
            name: 'Ticket',
            field: 'detail.ticket',
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'date',
            name: 'Date',
            field: 'detail.date',
            formatter: dataGrid.formatters.date
        });
        columns.push({
            id: 'assignee',
            name: 'Assignee',
            field: 'detail.assignee.name',
            formatter: dataGrid.formatters.text
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
//# sourceMappingURL=data-nested.js.map