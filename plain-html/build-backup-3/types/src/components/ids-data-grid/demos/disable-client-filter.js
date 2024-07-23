import '../ids-data-grid';
import '../../ids-container/ids-container';
import productsJSON from '../../../assets/data/products.json';
// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-disable-client-filter');
(async function init() {
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
        id: 'id',
        name: 'ID',
        field: 'id',
        width: 80,
        resizable: true,
        reorderable: true,
        sortable: true,
        formatter: dataGrid.formatters.text,
    });
    columns.push({
        id: 'color',
        name: 'Color',
        field: 'color',
        sortable: true,
        resizable: true,
        reorderable: true,
        formatter: dataGrid.formatters.text,
        filterType: dataGrid.filters.text
    });
    columns.push({
        id: 'productId',
        name: 'Product Id',
        field: 'productId',
        sortable: true,
        resizable: true,
        reorderable: true,
        formatOptions: { group: '' },
        filterType: dataGrid.filters.integer,
        formatter: dataGrid.formatters.integer
    });
    columns.push({
        id: 'inStock',
        name: 'In Stock',
        field: 'inStock',
        sortable: true,
        resizable: true,
        reorderable: true,
        align: 'center',
        formatter: dataGrid.formatters.text,
        filterType: dataGrid.filters.checkbox
    });
    // Do an ajax request
    const url = productsJSON;
    dataGrid.columns = columns;
    const setData = async () => {
        const res = await fetch(url);
        const data = await res.json();
        dataGrid.data = data;
        dataGrid.pageTotal = data.length;
    };
    setData();
    // Disable client filter
    dataGrid.addEventListener('filtered', (e) => {
        console.info('filtered:', e.detail);
    });
}());
//# sourceMappingURL=disable-client-filter.js.map