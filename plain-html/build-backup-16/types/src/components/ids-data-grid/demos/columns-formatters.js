import '../ids-data-grid';
import { escapeHTML } from '../../../utils/ids-xss-utils/ids-xss-utils';
import booksJSON from '../../../assets/data/books.json';
import css from '../../../assets/css/ids-data-grid/custom-link.css';
import { addIcon } from '../../ids-icon/ids-icon';
// Add custom icon
addIcon('custom-cargoship', '<path transform="translate(-0.12 -4.69)" d="m17.54 12.23-1.42 1H3.1l-2-2.6h16.42ZM3.32 8.85h2.74V7H3.32Zm4.78 0h2.74V7H8.1Zm8.56 1.62V5.19h-3.4v5.21"></path>');
const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);
// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-formatters');
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
            disabled: (row, value, col, item) => item.book === 101,
            align: 'center'
        });
        columns.push({
            id: 'selectionRadio',
            name: 'selection',
            sortable: false,
            resizable: false,
            formatter: dataGrid.formatters.selectionRadio,
            disabled: (row, value, col, item) => item.book === 101,
            align: 'center'
        });
        columns.push({
            id: 'rowNumber',
            name: '#',
            formatter: dataGrid.formatters.rowNumber,
            sortable: false,
            readonly: true,
            width: 56
        });
        columns.push({
            id: 'description',
            name: 'Text',
            field: 'description',
            sortable: true,
            formatter: dataGrid.formatters.text
        });
        columns.push({
            id: 'location',
            name: 'Hyperlink',
            field: 'location',
            formatter: dataGrid.formatters.hyperlink,
            disabled: (row, value, col, item) => item.book === 101,
            click: (info) => {
                console.info('Link clicked', info);
            },
            href: '#'
        });
        columns.push({
            id: 'ledger',
            name: 'Password',
            field: 'ledger',
            sortable: true,
            formatter: dataGrid.formatters.password
        });
        columns.push({
            id: 'publishDate',
            name: 'Date',
            field: 'publishDate',
            sortable: true,
            formatter: dataGrid.formatters.date,
            width: 200
        });
        columns.push({
            id: 'publishTime',
            name: 'Time',
            field: 'publishDate',
            sortable: true,
            formatter: dataGrid.formatters.time,
            width: 200
        });
        columns.push({
            id: 'price',
            name: 'Decimal',
            field: 'price',
            align: 'right',
            sortable: true,
            formatter: dataGrid.formatters.decimal,
            formatOptions: { locale: 'en-US' },
            width: 200
        });
        columns.push({
            id: 'price',
            name: 'Integer',
            field: 'price',
            align: 'right',
            sortable: true,
            formatter: dataGrid.formatters.integer,
            formatOptions: { locale: 'en-US' },
            width: 200
        });
        columns.push({
            id: 'inStock',
            name: 'Checkbox',
            field: 'inStock',
            align: 'center',
            sortable: true,
            formatter: dataGrid.formatters.checkbox,
            disabled: (row, value, col, item) => item.book === 101
        });
        columns.push({
            id: 'badge',
            name: 'Badge',
            field: 'price',
            color: 'info',
            sortable: true,
            formatter: dataGrid.formatters.badge,
            width: 75
        });
        columns.push({
            id: 'more',
            name: 'Actions',
            sortable: false,
            resizable: true,
            formatter: dataGrid.formatters.button,
            icon: 'more',
            type: 'icon',
            align: 'center',
            disabled: (row, value, col, item) => item.book === 101,
            click: (info) => {
                console.info('Actions clicked', info);
            },
            text: 'Actions',
            width: 56
        });
        columns.push({
            id: 'custom',
            name: 'Custom',
            field: 'price',
            sortable: false,
            formatter: (rowData, columnData) => {
                const value = `Custom: ${rowData[columnData.field] || '0'}`;
                return `<span class="text-ellipsis">${value}</span>`;
            },
            width: 180
        });
        columns.push({
            id: 'custom',
            name: 'Custom Formatter',
            field: 'location',
            sortable: false,
            // formatter: (): string => `<ids-hyperlink href="#" tabindex="-1">Click me!</ids-hyperlink>`,
            formatter: (rowData, columnData) => {
                const value = `${rowData[columnData.field] || ''}`;
                return `<a part="custom-link" href="#" class="text-ellipsis" tabindex="-1">${escapeHTML(value)}</a>`;
            },
            click: (info) => {
                console.info('Custom Link Clicked', info);
            },
            width: 180
        });
        columns.push({
            id: 'cargoship',
            name: '',
            sortable: false,
            resizable: false,
            formatter: dataGrid.formatters.button,
            icon: 'custom-cargoship',
            type: 'icon',
            align: 'center',
            disabled: (row, value, col, item) => item.book === 101,
            click: (info) => {
                console.info('Cargoship clicked', info);
            },
            text: 'Drill Down',
            width: 56
        });
        columns.push({
            id: 'spacer',
            name: '',
            field: '',
            sortable: false
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
//# sourceMappingURL=columns-formatters.js.map