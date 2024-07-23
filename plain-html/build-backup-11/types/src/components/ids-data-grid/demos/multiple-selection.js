import '../../ids-container/ids-container';
import booksJSON from '../../../assets/data/books.json';
import '../ids-data-grid';
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
    columns.push({
        id: 'transactionCurrency',
        name: 'Transaction Currency',
        field: 'transactionCurrency',
        formatter: dataGrid.formatters.text,
    });
    columns.push({
        id: 'integer',
        name: 'Price (Int)',
        field: 'price',
        formatter: dataGrid.formatters.integer,
        formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    columns.push({
        id: 'location',
        name: 'Location',
        field: 'location',
        formatter: dataGrid.formatters.hyperlink,
        href: '#'
    });
    columns.push({
        id: 'postHistory',
        name: 'Post History',
        field: 'postHistory',
        formatter: dataGrid.formatters.text
    });
    columns.push({
        id: 'active',
        name: 'Active',
        field: 'active',
        formatter: dataGrid.formatters.text
    });
    columns.push({
        id: 'convention',
        name: 'Convention',
        field: 'convention',
        formatter: dataGrid.formatters.text
    });
    columns.push({
        id: 'methodSwitch',
        name: 'Method Switch',
        field: 'methodSwitch',
        formatter: dataGrid.formatters.text
    });
    columns.push({
        id: 'trackDeprecationHistory',
        name: 'Track Deprecation History',
        field: 'trackDeprecationHistory',
        formatter: dataGrid.formatters.text
    });
    columns.push({
        id: 'useForEmployee',
        name: 'Use For Employee',
        field: 'useForEmployee',
        formatter: dataGrid.formatters.password
    });
    columns.push({
        id: 'deprecationHistory',
        name: 'Deprecation History',
        field: 'deprecationHistory',
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
}());
//# sourceMappingURL=multiple-selection.js.map