import '../ids-data-grid';
import '../../ids-container/ids-container';
import booksJSON from '../../../assets/data/books.json';
// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-multi');
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
        readonly: true,
        width: 65
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
        formatter: dataGrid.formatters.text
    });
    columns.push({
        id: 'publishDate',
        name: 'Pub. Date',
        field: 'publishDate',
        formatter: dataGrid.formatters.date
    });
    columns.push({
        id: 'publishTime',
        name: 'Pub. Time',
        field: 'publishDate',
        formatter: dataGrid.formatters.time
    });
    columns.push({
        id: 'price',
        name: 'Price',
        field: 'price',
        formatter: dataGrid.formatters.decimal,
        formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    columns.push({
        id: 'bookCurrency',
        name: 'Currency',
        field: 'bookCurrency',
        formatter: dataGrid.formatters.text
    });
    dataGrid.columns = columns;
    const setData = async () => {
        const res = await fetch(url);
        const data = await res.json();
        dataGrid.data = data;
    };
    setData();
    // Event Handlers
    dataGrid.addEventListener('rowselected', (e) => {
        console.info(`Row Selected`, e.detail);
    });
    dataGrid.addEventListener('rowdeselected', (e) => {
        console.info(`Row Deselected`, e.detail);
    });
    dataGrid.addEventListener('selectionchanged', (e) => {
        console.info(`Selection Changed`, e.detail);
    });
    dataGrid.addEventListener('rowclick', (e) => {
        console.info(`Row Clicked`, e.detail);
    });
    dataGrid.addEventListener('rowdoubleclick', (e) => {
        console.info(`Row Double Clicked`, e.detail);
    });
}());
//# sourceMappingURL=suppress-row-click-selection.js.map