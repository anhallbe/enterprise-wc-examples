import '../ids-data-grid';
import '../../ids-container/ids-container';
import productsJSON from '../../../assets/data/products.json';
// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-paging-standalone');
const pager = document.querySelector('ids-pager');
(async function init() {
    const columns = [];
    // Set up columns
    columns.push({
        id: 'id',
        name: 'ID',
        field: 'id',
        formatter: dataGrid.formatters.text,
        width: 80,
        sortable: true
    });
    columns.push({
        id: 'color',
        name: 'Color',
        field: 'color',
        formatter: dataGrid.formatters.text,
        sortable: true
    });
    columns.push({
        id: 'inStock',
        name: 'In Stock',
        field: 'inStock',
        formatter: dataGrid.formatters.text,
        sortable: true
    });
    columns.push({
        id: 'productId',
        name: 'Product Id',
        field: 'productId',
        formatter: dataGrid.formatters.text,
        sortable: true
    });
    columns.push({
        id: 'productName',
        name: 'Product Name',
        field: 'productName',
        formatter: dataGrid.formatters.text,
        sortable: true
    });
    columns.push({
        id: 'unitPrice',
        name: 'Unit Price',
        field: 'unitPrice',
        formatter: dataGrid.formatters.text,
        sortable: true
    });
    columns.push({
        id: 'units',
        name: 'Units',
        field: 'units',
        formatter: dataGrid.formatters.text,
        sortable: true
    });
    // Do an ajax request
    const url = productsJSON;
    const response = await fetch(url);
    const data = await response.json();
    dataGrid.columns = columns;
    dataGrid.pagination = 'standalone';
    dataGrid.pager = pager;
    dataGrid.data = data;
    dataGrid.pageTotal = data.length;
    dataGrid.pager.addEventListener('pagenumberchange', async (e) => {
        console.info(`standalone page # ${e.detail.value}`);
    });
    console.info('Loading Time:', window.performance.now());
    console.info('Page Memory:', window.performance.memory);
}());
//# sourceMappingURL=pagination-standalone.js.map