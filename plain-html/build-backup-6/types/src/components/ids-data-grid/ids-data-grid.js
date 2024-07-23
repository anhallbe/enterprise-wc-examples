var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Utils
import { customElement, scss } from '../../core/ids-decorators';
import { attributes, IdsDirection } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { next, previous } from '../../utils/ids-dom-utils/ids-dom-utils';
// Dependencies
import IdsDataSource from '../../core/ids-data-source';
import IdsDataGridFormatters from './ids-data-grid-formatters';
import { editors } from './ids-data-grid-editors';
import IdsDataGridFilters from './ids-data-grid-filters';
import { setContextmenu } from './ids-data-grid-contextmenu';
import { setEmptyMessage, resetEmptyMessageElements, hideEmptyMessage, IdsDataGridToggleEmptyMessage, emptyMessageTemplate, } from './ids-data-grid-empty-message';
// Styles
import styles from './ids-data-grid.scss';
// Sub Components
import IdsDataGridHeader from './ids-data-grid-header';
import IdsDataGridRow from './ids-data-grid-row';
import '../ids-virtual-scroll/ids-virtual-scroll';
// Mixins
import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPagerMixin from '../../mixins/ids-pager-mixin/ids-pager-mixin';
import IdsDataGridSaveSettingsMixin from './ids-data-grid-save-settings-mixin';
import IdsDataGridTooltipMixin from './ids-data-grid-tooltip-mixin';
import IdsDataGridCell from './ids-data-grid-cell';
const Base = IdsThemeMixin(IdsPagerMixin(IdsDataGridSaveSettingsMixin(IdsDataGridTooltipMixin(IdsKeyboardMixin(IdsLocaleMixin(IdsEventsMixin(IdsElement)))))));
/**
 * IDS Data Grid Component
 * @type {IdsDataGrid}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsPagerMixin
 * @mixes IdsDataGridTooltipMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsEventsMixin
 * @part table - the table main element
 * @part body - the table body element
 * @part header - the header element
 * @part header-cell - the header cells
 * @part row - the row elements
 * @part cell - the cell elements
 */
let IdsDataGrid = class IdsDataGrid extends Base {
    isResizing = false;
    activeCell = {};
    autoFitSet = false;
    currentColumns;
    sortColumn;
    emptyMessageElements;
    cacheHash = Math.random().toString(32).substring(2, 10);
    constructor() {
        super();
        this.initialized = false;
        this.state = {
            menuData: null
        };
    }
    /* Returns the header element */
    get header() {
        return this.container?.querySelector('ids-data-grid-header:not(.column-groups)');
    }
    /* Returns the body element */
    get body() {
        return this.container?.querySelector('.ids-data-grid-body');
    }
    /* Returns all the row elements in an array */
    get rows() {
        // NOTE: Array.from() seems slower than dotdotdot array-destructuring.
        if (!this.container)
            return [];
        return [...this.container.querySelectorAll('.ids-data-grid-body ids-data-grid-row')];
    }
    /* Returns the outside wrapper element */
    get wrapper() {
        return this.container?.parentNode;
    }
    connectedCallback() {
        if (this.initialized)
            this.restoreAllSettings?.();
        super.connectedCallback();
        this.redrawBody();
        this.#attachVirtualScrollEvent();
    }
    /** Reference to datasource API */
    datasource = new IdsDataSource();
    /** Filters instance attached to component  */
    filters = new IdsDataGridFilters(this);
    /** API for list of formatters */
    formatters = new IdsDataGridFormatters();
    /** API for list of editors */
    editors = editors;
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            ...super.attributes,
            attributes.ALTERNATE_ROW_SHADING,
            attributes.AUTO_FIT,
            attributes.DISABLE_CLIENT_FILTER,
            attributes.EMPTY_MESSAGE_DESCRIPTION,
            attributes.EMPTY_MESSAGE_ICON,
            attributes.EMPTY_MESSAGE_LABEL,
            attributes.EDITABLE,
            attributes.EDIT_NEXT_ON_ENTER_PRESS,
            attributes.EXPANDABLE_ROW,
            attributes.EXPANDABLE_ROW_TEMPLATE,
            attributes.FILTER_ROW_DISABLED,
            attributes.FILTER_WHEN_TYPING,
            attributes.FILTERABLE,
            attributes.GROUP_SELECTS_CHILDREN,
            attributes.ID_COLUMN,
            attributes.HEADER_MENU_ID,
            attributes.LABEL,
            attributes.LIST_STYLE,
            attributes.MENU_ID,
            attributes.MODE,
            attributes.ROW_HEIGHT,
            attributes.ROW_NAVIGATION,
            attributes.ROW_SELECTION,
            attributes.SUPPRESS_CACHING,
            attributes.SUPPRESS_EMPTY_MESSAGE,
            attributes.SUPPRESS_ROW_CLICK_SELECTION,
            attributes.SUPPRESS_ROW_DEACTIVATION,
            attributes.SUPPRESS_ROW_DESELECTION,
            attributes.TREE_GRID,
            attributes.VIRTUAL_SCROLL,
            attributes.UNIQUE_ID,
        ];
    }
    /**
     * @returns {Array<string>} Drawer vetoable events
     */
    vetoableEventTypes = [
        'beforemenushow',
        'beforetooltipshow',
    ];
    /**
     * Inner template contents
     * @returns {string} The template
     * @private
     */
    template() {
        if (this?.data.length === 0 && this?.columns.length === 0) {
            return ``;
        }
        let cssClasses = `${this.alternateRowShading ? ' alt-row-shading' : ''}`;
        cssClasses += `${this.listStyle ? ' is-list-style' : ''}`;
        const html = `<div class="ids-data-grid-wrapper">
        <span class="ids-data-grid-sort-arrows"></span>
        <div class="ids-data-grid${cssClasses}" role="table" part="table" aria-label="${this.label}" data-row-height="${this.rowHeight}" mode="${this.mode}">
          ${IdsDataGridHeader.template(this)}
          ${this.bodyTemplate()}
        </div>
        <slot name="menu-container"></slot>
        <slot name="contextmenu"></slot>
        <slot name="header-contextmenu"></slot>
        <slot name="tooltip">
          <ids-tooltip id="tooltip" exportparts="tooltip-popup, tooltip-arrow"></ids-tooltip>
        </slot>
      </div>`;
        return html;
    }
    /**
     * Toggle the empty message.
     * @param {boolean | number} hide If true, will hide empty message.
     * @returns {void}
     */
    toggleEmptyMessage(hide) {
        IdsDataGridToggleEmptyMessage.apply(this, [hide]);
    }
    /**
     * Apply the Filter with the currently selected conditions, or the ones passed in.
     * @param {Array} conditions An array of objects with the filter conditions.
     * @returns {void}
     */
    applyFilter(conditions) {
        this.filters?.applyFilter(conditions);
    }
    /**
     * Sync pager to refresh updated dataset
     * @private
     * @returns {void}
     */
    #syncPager() {
        const props = ['total', 'pageNumber', 'pageSize'];
        const isValid = (v) => typeof v !== 'undefined' && v !== null;
        props.forEach((prop) => {
            const pager = this.pager;
            const ds = this.datasource;
            const isValidProps = isValid(pager?.[prop]) && isValid(ds?.[prop]);
            if (this.initialized && isValidProps && pager[prop] !== ds[prop]) {
                pager[prop] = ds[prop];
            }
        });
    }
    /**
     * Sync and then redraw the body section
     * @returns {void}
     */
    redrawBody() {
        this.#redrawBodyTemplate();
        this.#syncPager();
    }
    /**
     * Redraw the body area
     * @private
     * @returns {void}
     */
    #redrawBodyTemplate() {
        if ((this.columns.length === 0 && this.data.length === 0) || !this.initialized) {
            return;
        }
        if (this.body)
            this.body.innerHTML = this.bodyInnerTemplate();
        this.#resetLastSelectedRow();
        this.header?.setHeaderCheckbox();
    }
    /**
     * Redraw the list by reapplying the template
     * @private
     */
    redraw() {
        if (this.columns.length === 0 || !this.initialized) {
            return;
        }
        const header = IdsDataGridHeader.template(this);
        const body = this.bodyTemplate();
        if (this.container)
            this.container.innerHTML = header + body;
        this.#setColumnWidths();
        this.#applyAutoFit();
        this.header.setHeaderCheckbox();
        this.#attachEventHandlers();
        this.#attachKeyboardListeners();
        this.#attachVirtualScrollEvent();
        this.setupTooltip();
        // Attach post filters setting
        this.filters.attachFilterSettings();
        // Set Counts/Totals
        this.container?.setAttribute('aria-rowcount', this.rowCount.toString());
        // Set contextmenu
        setContextmenu.apply(this);
        // Show/hide empty message
        this.toggleEmptyMessage();
        // Do some things after redraw
        this.afterRedraw();
    }
    /** Do some things after redraw */
    afterRedraw() {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Set Focus
                this.setActiveCell(0, 0, true);
            });
        });
    }
    /**
     * Contextmenu stuff use for info and events
     * @private
     */
    contextMenuInfo = {};
    /**
     * Body template markup
     * @private
     * @returns {string} The template
     */
    bodyTemplate() {
        const emptyMesageTemplate = emptyMessageTemplate.apply(this);
        return `${emptyMesageTemplate}<div class="ids-data-grid-body" part="contents" role="rowgroup">${this.bodyInnerTemplate()}</div>`;
    }
    /**
     * Simple way to clear cache until a better cache-busting strategy is in implemented
     * @param {number|undefined} rowIndex - (optional) row-index to target specific rowCache to clear
     * @returns {void}
     */
    resetCache(rowIndex) {
        if (rowIndex === 0 || (rowIndex && rowIndex >= 1)) {
            delete IdsDataGridRow.rowCache[rowIndex];
            // return; // TODO: returning currently breaks cell-editor tests... must fix
        }
        IdsDataGridRow.rowCache = {};
        IdsDataGridCell.cellCache = {};
    }
    /**
     * Body inner template markup
     * @private
     * @returns {string} The template
     */
    bodyInnerTemplate() {
        this.resetCache();
        let innerHTML = '';
        const data = this.virtualScroll ? this.data.slice(0, this.virtualScrollSettings.NUM_ROWS) : this.data;
        for (let index = 0; index < data.length; index++) {
            innerHTML += IdsDataGridRow.template(data[index], index, index + 1, this);
        }
        return innerHTML;
    }
    /**
     * Check if row is selected.
     * @param {number} index The row index
     * @returns {boolean} True, if row is selected
     */
    rowIsSelected(index) {
        return !!this.data[index].rowSelected;
    }
    /**
     * Keep flag for last selected row
     * @private
     */
    #lastSelectedRow = null;
    /**
     * Reset flag for last selected row
     * @private
     * @returns {void}
     */
    #resetLastSelectedRow() {
        this.#lastSelectedRow = null;
    }
    /**
     * Toggle rows selection between given index and last selected
     * @private
     * @param {number} index The row index
     * @returns {void}
     */
    #toggleSelectionInBetween(index) {
        if (this.#lastSelectedRow === null)
            return;
        const start = Math.min(index, this.#lastSelectedRow);
        const end = Math.max(index, this.#lastSelectedRow);
        const isSelected = this.rowIsSelected(index);
        for (let i = start; i <= end; i++) {
            if (isSelected)
                this.deSelectRow(i);
            else
                this.selectRow(i);
        }
        this.#getSelection()?.removeAllRanges?.();
        this.header.setHeaderCheckbox();
        this.triggerEvent('selectionchanged', this, {
            detail: { elem: this, selectedRows: this.selectedRows }
        });
    }
    /**
     * Get current selection
     * @private
     * @returns {Selection|null} The selection
     */
    #getSelection() {
        if (!this.shadowRoot?.getSelection) {
            return document.getSelection();
        }
        return this.shadowRoot?.getSelection();
    }
    /**
     * Handle all triggering and handling of events
     * @private
     */
    #attachEventHandlers() {
        // Add a cell click handler
        const body = this.body;
        this.offEvent('click.body', body);
        this.onEvent('click.body', body, (e) => {
            const cell = e.target.closest('ids-data-grid-cell');
            if (!cell)
                return;
            if (cell.isEditing)
                return;
            const cellNum = Number(cell.getAttribute('aria-colindex')) - 1;
            const row = cell.parentNode;
            const rowNum = row.rowIndex;
            const isHyperlink = e.target?.nodeName === 'IDS-HYPERLINK' || e.target?.nodeName === 'A';
            const isButton = e.target?.nodeName === 'IDS-BUTTON';
            const isExpandButton = isButton && e.target?.classList.contains('expand-button');
            const isClickable = isButton || isHyperlink;
            const column = this.visibleColumns[cellNum];
            // Focus Cell
            this.setActiveCell(cellNum, rowNum, isHyperlink);
            // Handle click callbacks
            if (isClickable && column.click !== undefined && !e.target?.getAttribute('disabled')) {
                column.click({
                    rowData: this.data[rowNum],
                    columnData: this.visibleColumns[cellNum],
                    event: e
                });
            }
            // Fires for each row that is clicked
            this.triggerEvent('rowclick', this, {
                detail: {
                    elem: this, row, data: this.data[rowNum]
                }
            });
            // Handle multiple or mixed selection
            const handleMultipleOrMixedSelection = () => {
                if ((this.rowSelection === 'multiple') || (this.rowSelection === 'mixed')) {
                    if (e.shiftKey && this.#lastSelectedRow !== null)
                        this.#toggleSelectionInBetween(rowNum);
                    else
                        row.toggleSelection();
                    this.#lastSelectedRow = rowNum;
                }
                else
                    row.toggleSelection();
            };
            // Handle Expand/Collapse Clicking
            if (isClickable && isExpandButton) {
                row.toggleExpandCollapse();
                return;
            }
            // Handle mixed selection
            if (this.rowSelection === 'mixed') {
                if (cell.children[0]?.classList.contains('ids-data-grid-checkbox-container')) {
                    handleMultipleOrMixedSelection();
                }
                else {
                    row.toggleRowActivation();
                }
                return;
            }
            // Handle selection if not disabled
            if (this.rowSelection !== false && this.rowSelection !== 'mixed') {
                if ((!this.suppressRowClickSelection) || (this.suppressRowClickSelection
                    && cell.children[0]?.classList.contains('is-selection-checkbox')))
                    handleMultipleOrMixedSelection();
            }
            // Handle Editing
            if (this.editable && column.editor)
                cell.startCellEdit(true);
        });
        // Add double click to the table body
        this.offEvent('dblclick.body', body);
        this.onEvent('dblclick.body', body, (e) => {
            const row = e.target?.closest('.ids-data-grid-row');
            const rowIndex = row?.getAttribute('data-index');
            if (!rowIndex)
                return;
            // Fires for each row that is double clicked
            this.triggerEvent('rowdoubleclick', this, {
                detail: {
                    elem: this, row, data: this.data[Number(rowIndex)]
                }
            });
        });
        // Handle the Locale Change
        this.offEvent('languagechange.data-grid-container');
        this.onEvent('languagechange.data-grid-container', this.closest('ids-container'), () => {
            this.redraw();
        });
        this.offEvent('localechange.data-grid-container');
        this.onEvent('localechange.data-grid-container', this.closest('ids-container'), () => {
            this.redraw();
        });
        this.filters?.attachFilterEventHandlers();
        this.attachSaveSettingsEventHandlers?.();
    }
    /**
     * Move a column to a new position. Use `columnIndex` to get the column by id.
     * @param {number} fromIndex The column index to movex
     * @param {number} toIndex The new column index
     */
    moveColumn(fromIndex, toIndex) {
        const correctFromIndex = this.columnIdxById(this.visibleColumns[fromIndex].id);
        const correctToIndex = this.columnIdxById(this.visibleColumns[toIndex].id);
        const element = this.columns[correctFromIndex];
        this.columns.splice(correctFromIndex, 1);
        this.columns.splice(correctToIndex, 0, element);
        // Move the dirty data
        this.dirtyCells.forEach((dirtyRow) => {
            if (dirtyRow.cell === fromIndex) {
                const row = this.data[dirtyRow?.row];
                const cellIndex = row.dirtyCells.findIndex((item) => item.cell === fromIndex);
                row.dirtyCells[cellIndex].cell = toIndex;
            }
            if (dirtyRow.cell === toIndex) {
                const row = this.data[dirtyRow?.row];
                const cellIndex = row.dirtyCells.findIndex((item) => item.cell === toIndex);
                row.dirtyCells[cellIndex].cell = fromIndex;
            }
        });
        // Move the validation data
        this.invalidCells.forEach((invalidRow) => {
            if (invalidRow.cell === fromIndex) {
                const row = this.data[invalidRow?.row];
                const cellIndex = row.invalidCells.findIndex((item) => item.cell === fromIndex);
                row.invalidCells[cellIndex].cell = toIndex;
            }
        });
        resetEmptyMessageElements.apply(this);
        this.redraw();
        this.triggerEvent('columnmoved', this, { detail: { elem: this, fromIndex: correctFromIndex, toIndex: correctToIndex } });
        this.saveSettings?.();
    }
    /**
     * Establish Internal Keyboard shortcuts
     * @private
     * @returns {object} This API object for chaining
     */
    #attachKeyboardListeners() {
        // Handle arrow navigation
        this.listen(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'], this, (e) => {
            if (!this.activeCell?.node)
                return;
            const key = e.key;
            const cellNode = this.activeCell.node;
            const cellNumber = Number(this.activeCell?.cell);
            const rowDiff = key === 'ArrowDown' ? 1 : (key === 'ArrowUp' ? -1 : 0); //eslint-disable-line
            const cellDiff = key === 'ArrowRight' ? 1 : (key === 'ArrowLeft' ? -1 : 0); //eslint-disable-line
            const nextRow = Number(next(cellNode.parentElement, `:not([hidden])`)?.getAttribute('row-index'));
            const prevRow = Number(previous(cellNode.parentElement, `:not([hidden])`)?.getAttribute('row-index'));
            const rowIndex = key === 'ArrowDown' ? nextRow : prevRow;
            const movingHorizontal = key === 'ArrowLeft' || key === 'ArrowRight';
            const reachedHorizontalBounds = cellNumber < 0 || cellNumber >= this.visibleColumns.length;
            if (movingHorizontal && reachedHorizontalBounds)
                return;
            const movingVertical = key === 'ArrowDown' || key === 'ArrowUp';
            const reachedVerticalBounds = nextRow >= this.data.length || prevRow < 0;
            if (movingVertical && reachedVerticalBounds)
                return;
            if (this.activeCellEditor)
                cellNode.endCellEdit();
            const activateCellNumber = cellNumber + cellDiff;
            const activateRowIndex = rowDiff === 0 ? Number(this.activeCell?.row) : rowIndex;
            this.setActiveCell(activateCellNumber, activateRowIndex);
            if (this.rowSelection === 'mixed' && this.rowNavigation) {
                cellNode.parentElement.toggleRowActivation();
            }
            e.preventDefault();
            e.stopPropagation();
        });
        // Handle Selection and Expand
        this.listen([' '], this, (e) => {
            if (this.activeCellEditor)
                return;
            if (!this.activeCell?.node)
                return;
            const button = this.activeCell.node.querySelector('ids-button');
            if (button) {
                button.click();
                e.preventDefault();
                return;
            }
            const child = this.activeCell.node.children[0];
            const isCheckbox = child?.classList.contains('ids-data-grid-checkbox-container')
                && !child?.classList.contains('is-selection-checkbox');
            if (isCheckbox) {
                this.activeCell.node.click();
                e.preventDefault();
                return;
            }
            const row = this.rowByIndex(this.activeCell.row);
            row.toggleSelection();
            e.preventDefault();
        });
        // Follow links with keyboard and start editing
        this.listen(['Enter'], this, (e) => {
            if (!this.activeCell?.node)
                return;
            const cellNode = this.activeCell.node;
            const hyperlink = cellNode.querySelector('ids-hyperlink');
            const button = cellNode.querySelector('ids-button');
            const customLink = cellNode.querySelector('a');
            if (hyperlink && !hyperlink.container.matches(':focus') && !hyperlink.hasAttribute('disabled')) {
                hyperlink.container.click();
                hyperlink.container.focus();
            }
            if (button && !button.hasAttribute('disabled')) {
                button.click();
            }
            customLink?.click();
            if (customLink) {
                cellNode.focus();
            }
            this.#handleEditMode(e, cellNode);
        });
        // Commit Edit
        this.listen(['F2'], this, () => {
            const cellNode = this.activeCell.node;
            if (this.activeCellEditor) {
                cellNode.endCellEdit();
                cellNode.focus();
            }
        });
        // Cancel Edit
        this.listen(['Escape'], this, () => {
            const cellNode = this.activeCell.node;
            if (this.activeCellEditor) {
                cellNode.cancelCellEdit();
                cellNode.focus();
            }
        });
        // Edit Next
        this.listen(['Tab'], this, (e) => {
            if (this.activeCellEditor) {
                if (e.shiftKey)
                    this.#editAdjacentCell(IdsDirection.Previous);
                else
                    this.#editAdjacentCell(IdsDirection.Next);
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
            return true;
        });
        // Enter Edit by typing
        this.offEvent('keydown.body', this);
        this.onEvent('keydown.body', this, (e) => {
            const isPrintableKey = e.key.length === 1;
            if (!this.activeCellEditor && isPrintableKey && e.key !== ' ') {
                this.activeCell?.node?.startCellEdit?.();
            }
        });
        return this;
    }
    /**
     * Find the next editable cell and start editing it
     * @private
     * @param {IdsDirection} direction The cell element
     */
    #editAdjacentCell(direction) {
        this.commitCellEdit();
        let nextCell = direction === IdsDirection.Next
            ? next(this.activeCell.node, '.is-editable')
            : previous(this.activeCell.node, '.is-editable');
        const rows = this.body?.querySelectorAll('.ids-data-grid-row');
        if (!nextCell && rows && direction === IdsDirection.Next) {
            for (let index = this.activeCell.row + 1; index < rows.length; index++) {
                const row = rows[index];
                nextCell = next(row.firstChild, '.is-editable');
                if (nextCell)
                    break;
            }
        }
        if (!nextCell && rows && direction === IdsDirection.Previous) {
            for (let index = this.activeCell.row - 1; index >= 0; index--) {
                const row = rows[index];
                if (row.lastChild.classList?.contains('is-editable')) {
                    nextCell = row.lastChild;
                    break;
                }
                nextCell = previous(row.lastChild, '.is-editable');
                if (nextCell)
                    break;
            }
        }
        if (!nextCell) {
            this.activeCell.node.focus();
            this.activeCell.node.startCellEdit();
            return;
        }
        const row = Number(nextCell.parentElement?.getAttribute('aria-rowindex')) - 1;
        const cell = Number(nextCell.getAttribute('aria-colindex')) - 1;
        this.setActiveCell(cell, row, true);
        nextCell.startCellEdit();
    }
    /**
     * Save or start editing
     * @param {KeyboardEvent} e The cell event
     * @param {IdsDataGridCell} cellNode The cell element
     * @private
     */
    #handleEditMode(e, cellNode) {
        // Editing Keyboard
        if (this.editable && cellNode.classList.contains('is-editable') && cellNode.classList.contains('is-editing')) {
            cellNode.endCellEdit();
            cellNode.focus();
            if (this.editNextOnEnterPress) {
                this.setActiveCell(Number(this.activeCell?.cell), Number(this.activeCell?.row) + (e.shiftKey ? -1 : 1));
                this.activeCell.node.startCellEdit();
            }
        }
        else
            cellNode.startCellEdit();
    }
    /**
     * Set the column widths by generating the lengths in the css grid
     * and setting the css variable.
     * @private
     */
    #setColumnWidths() {
        let colWidths = '';
        const total = this.visibleColumns.length;
        this.visibleColumns.forEach((column, index) => {
            // Special Columns
            if ((column.id === 'selectionCheckbox' || column.id === 'selectionRadio') && !column.width) {
                column.width = 45;
            }
            // Percent Columns
            if (column.width && typeof column.width === 'string' && column.width.indexOf('%') > -1) {
                colWidths += `minmax(${column.width}, 1fr) `;
            }
            // Other (fr, ch)
            if (column.width && typeof column.width === 'string' && column.width.indexOf('%') === -1) {
                colWidths += `${column.width} `;
            }
            // Fixed pixel
            if (column.width && typeof column.width === 'number') {
                colWidths += `${column.width}px `;
            }
            // Default 110px or stretch to fit
            if (!column.width) {
                colWidths += `minmax(110px, 1fr) `;
            }
            if (column?.frozen && index > 0 && index < total - 1) {
                this.container?.style.setProperty(`--ids-data-grid-frozen-column-left-width-${index + 1}`, `${this.visibleColumns[index - 1].width}px`);
            }
        });
        this.container?.style.setProperty('--ids-data-grid-column-widths', colWidths);
        this.#setColumnGroupsWidth();
    }
    /**
     * Set one column's width (used for resizing)
     * @param {string} columnId The column id
     * @param {number} width The column id (or field) to sort
     */
    setColumnWidth(columnId, width) {
        const idx = this.columnIdxById(columnId);
        const column = this.columnDataById(columnId);
        // Constrain to a min and max width
        const minWidth = column.minWidth || 12;
        const maxWidth = column.maxWidth || Number.MAX_SAFE_INTEGER;
        if (this.columns[idx] && width >= minWidth && width <= maxWidth) {
            this.columns[idx].width = width;
            this.#setColumnWidths();
            this.#setColumnGroupsWidth();
        }
        this.triggerEvent('columnresized', this, { detail: { index: idx, column, columns: this.columns } });
        this.saveSettings?.();
    }
    /**
     * Set a column to visible or hidden
     * @param {string} columnId The column id
     * @param {boolean} visible True to hide or false to show
     */
    setColumnVisible(columnId, visible) {
        this.columnDataById(columnId).hidden = !visible;
        this.redraw();
    }
    /**
     * Set the column groups widths based on the provided colspans.
     * With some error handling.
     * @private
     */
    #setColumnGroupsWidth() {
        if (this.columnGroups) {
            let counter = 1;
            const groupElems = this.container?.querySelector('.ids-data-grid-column-groups')?.childNodes;
            this.columnGroups.forEach((group, index) => {
                let colspan = group.colspan;
                // decrease if hidden
                for (let i = 1; i <= colspan; i++) {
                    if (this.columns[counter]?.hidden) {
                        colspan -= 1;
                    }
                    counter++;
                }
                groupElems?.item(index)?.style.setProperty('grid-column-start', `span ${colspan}`);
            });
        }
    }
    /**
     * Set the sort column and sort direction
     * @param {string} id The column id (or field) to sort
     * @param {boolean} ascending Sort ascending (lowest first) or descending (lowest last)
     */
    setSortColumn(id, ascending = true) {
        const column = this.columnDataById(id);
        const sortField = column?.field !== column?.id ? column?.field : column?.id;
        this.sortColumn = { id, ascending };
        this.datasource.sort(sortField || '', ascending);
        this.redrawBody();
        this.header.setSortState(id, ascending);
        this.triggerEvent('sorted', this, { detail: { elem: this, sortColumn: this.sortColumn } });
        this.saveSettings?.();
    }
    /**
     * Set the sort column and sort direction on the UI only
     * @param {string} id The column id (or field) to set
     * @param {boolean} ascending Sort ascending (lowest first) or descending (lowest last)
     */
    setSortState(id, ascending = true) {
        this.header.setSortState(id, ascending);
    }
    /**
     * Get column group data by given column group id
     * @param {string} columnGroupId The column group id
     * @returns {object} The column group data
     */
    columnGroupDataById(columnGroupId) {
        return this.columnGroups?.filter((columnGroup) => columnGroup.id === columnGroupId)[0];
    }
    /**
     * Get column group index by given column group id
     * @param {string} columnGroupId The column group id
     * @returns {number} The column group index
     */
    columnGroupIdxById(columnGroupId) {
        return this.columnGroups?.findIndex((columnGroup) => columnGroup.id === columnGroupId);
    }
    /**
     * Get column data by given column id
     * @param {string} columnId The column id
     * @returns {object} The column data
     */
    columnDataById(columnId) {
        return this.columns?.filter((column) => column.id === columnId)[0];
    }
    /**
     * Get column index by given column id
     * @param {string} columnId The column id
     * @returns {number} The column index
     */
    columnIdxById(columnId) {
        return this.columns?.findIndex((column) => column.id === columnId);
    }
    /**
     * Get the visible column data (via hidden attributes)
     * @returns {Array<IdsDataGridColumn>} The visible column data
     */
    get visibleColumns() {
        return this.columns?.filter((column) => !column.hidden);
    }
    /**
     * Get the columns frozen on the right
     * @returns {Array<IdsDataGridColumn>} The frozen column data
     */
    get rightFrozenColumns() {
        return this.columns?.filter((column) => !column.hidden && column.frozen === 'right');
    }
    /**
     * Get the columns frozen on the left
     * @returns {Array<IdsDataGridColumn>} The frozen column data
     */
    get leftFrozenColumns() {
        return this.columns?.filter((column) => !column.hidden && column.frozen === 'left');
    }
    /**
     * Return true if any columns are frozen
     * @returns {Array<IdsDataGridColumn>} The frozen column data
     */
    get hasFrozenColumns() {
        return this.leftFrozenColumns.length > 0 || this.rightFrozenColumns.length > 0;
    }
    /**
     * Get column data by given column header element
     * @param {HTMLElement} elem The column header element
     * @returns {IdsDataGridColumn} The column data
     */
    columnDataByHeaderElem(elem) {
        const columnId = elem?.getAttribute('column-id');
        return this.columnDataById(columnId || '');
    }
    /**
     * Set a style on every alternate row for better readability.
     * @param {boolean|string} value true to use alternate row shading
     */
    set alternateRowShading(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.ALTERNATE_ROW_SHADING, 'true');
            this.shadowRoot?.querySelector('.ids-data-grid')?.classList.add('alt-row-shading');
            return;
        }
        this.shadowRoot?.querySelector('.ids-data-grid')?.classList.remove('alt-row-shading');
        this.setAttribute(attributes.ALTERNATE_ROW_SHADING, 'false');
    }
    get alternateRowShading() {
        return stringToBool(this.getAttribute(attributes.ALTERNATE_ROW_SHADING)) || false;
    }
    /**
     * Set the columns of the data grid
     * @param {Array} value The array to use
     */
    set columns(value) {
        this.resetCache();
        this.currentColumns = value || [{ id: '', name: '' }];
        this.redraw();
    }
    get columns() {
        return this.currentColumns || ([{ id: '', name: '', field: '' }]);
    }
    /**
     * Set the columns groups of the data grid
     * @param {Array} value The array to use
     */
    set columnGroups(value) {
        this.state.columnsGroups = value;
        this.redraw();
    }
    get columnGroups() { return this.state?.columnsGroups || null; }
    /**
     * Set the data of the data grid
     * @param {Array} value The array to use
     */
    set data(value) {
        if (value) {
            hideEmptyMessage.apply(this);
            this.datasource.flatten = this.treeGrid;
            this.datasource.data = value;
            this.initialized = true;
            this.redraw();
            return;
        }
        this.datasource.data = [];
    }
    get data() { return this?.datasource?.data; }
    /**
     * Set empty message description
     * @param {string} value The value
     */
    set emptyMessageDescription(value) {
        if (typeof value === 'string' && value !== '') {
            this.setAttribute(attributes.EMPTY_MESSAGE_DESCRIPTION, value);
        }
        else {
            this.removeAttribute(attributes.EMPTY_MESSAGE_DESCRIPTION);
        }
        setEmptyMessage.apply(this);
    }
    get emptyMessageDescription() {
        return this.getAttribute(attributes.EMPTY_MESSAGE_DESCRIPTION);
    }
    /**
     * Set empty message icon
     * @param {string} value The value
     */
    set emptyMessageIcon(value) {
        if (typeof value === 'string' && value !== '') {
            this.setAttribute(attributes.EMPTY_MESSAGE_ICON, value);
        }
        else {
            this.removeAttribute(attributes.EMPTY_MESSAGE_ICON);
        }
        setEmptyMessage.apply(this);
    }
    get emptyMessageIcon() {
        return this.getAttribute(attributes.EMPTY_MESSAGE_ICON);
    }
    /**
     * Set empty message label
     * @param {string} value The value
     */
    set emptyMessageLabel(value) {
        if (typeof value === 'string' && value !== '') {
            this.setAttribute(attributes.EMPTY_MESSAGE_LABEL, value);
        }
        else {
            this.removeAttribute(attributes.EMPTY_MESSAGE_LABEL);
        }
        setEmptyMessage.apply(this);
    }
    get emptyMessageLabel() {
        return this.getAttribute(attributes.EMPTY_MESSAGE_LABEL);
    }
    /**
     * Set header menu id
     * @param {string} value The header menu id
     */
    set headerMenuId(value) {
        if (value) {
            this.setAttribute(attributes.HEADER_MENU_ID, value);
            return;
        }
        this.removeAttribute(attributes.HEADER_MENU_ID);
    }
    get headerMenuId() { return this.getAttribute(attributes.HEADER_MENU_ID); }
    /**
     * Set the header menu data
     * @param {Array} value The array to use
     */
    set headerMenuData(value) {
        this.header.state.headerMenuData = value;
        setContextmenu.apply(this);
    }
    get headerMenuData() { return this.header.state.headerMenuData; }
    /**
     * Set menu id
     * @param {string} value The menu id
     */
    set menuId(value) {
        if (value) {
            this.setAttribute(attributes.MENU_ID, value);
            return;
        }
        this.removeAttribute(attributes.MENU_ID);
    }
    get menuId() { return this.getAttribute(attributes.MENU_ID); }
    /**
     * Set the menu data
     * @param {Array} value The array to use
     */
    set menuData(value) {
        this.state.menuData = value;
        setContextmenu.apply(this);
    }
    get menuData() { return this?.state?.menuData; }
    /**
     * Set the list view to use virtual scrolling for a large amount of rows
     * @param {boolean|string} value true to use virtual scrolling
     */
    set virtualScroll(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.VIRTUAL_SCROLL, 'true');
        }
        else {
            this.removeAttribute(attributes.VIRTUAL_SCROLL);
        }
        this.redraw();
    }
    get virtualScroll() { return stringToBool(this.getAttribute(attributes.VIRTUAL_SCROLL)); }
    /**
     * Some future configurable virtual scroll settings
     * @returns {object} the current settings
     */
    get virtualScrollSettings() {
        const ENABLED = !!this.virtualScroll;
        const ROW_HEIGHT = this.rowPixelHeight || 50;
        const NUM_ROWS = 150;
        const BODY_HEIGHT = NUM_ROWS * ROW_HEIGHT;
        const BUFFER_ROWS = 50;
        const BUFFER_HEIGHT = BUFFER_ROWS * ROW_HEIGHT;
        const RAF_DELAY = 60;
        const DEBOUNCE_RATE = 10;
        return {
            ENABLED,
            ROW_HEIGHT,
            NUM_ROWS,
            BODY_HEIGHT,
            BUFFER_ROWS,
            BUFFER_HEIGHT,
            RAF_DELAY,
            DEBOUNCE_RATE,
        };
    }
    /* Attach Events for virtual scrolling */
    #attachVirtualScrollEvent() {
        if (!this.virtualScroll)
            return;
        const virtualScrollSettings = this.virtualScrollSettings;
        const data = this.data;
        const maxPaddingBottom = (data.length * virtualScrollSettings.ROW_HEIGHT) - virtualScrollSettings.BODY_HEIGHT;
        this.container?.style.setProperty('max-height', '95vh');
        if (maxPaddingBottom >= 0) {
            this.body?.style.setProperty('padding-bottom', `${maxPaddingBottom}px`);
        }
        let debounceRowIndex = 0;
        this.offEvent('scroll.data-grid.virtual-scroll', this.container);
        this.onEvent('scroll.data-grid.virtual-scroll', this.container, (evt) => {
            evt.stopImmediatePropagation();
            const rowIndex = Math.floor(this.container.scrollTop / virtualScrollSettings.ROW_HEIGHT);
            if (rowIndex === debounceRowIndex)
                return;
            debounceRowIndex = rowIndex;
            this.scrollRowIntoView(rowIndex, false);
        }, { capture: true, passive: true }); // @see https://javascript.info/bubbling-and-capturing#capturing
    }
    /**
     * Stores the last request animation from used during virtual scroll.
     * RAFs are recommended in the row-recycling articles we referenced.
     * If we were to take them out, what would happen is the repainting of the browser
     * window would happen during scrolling and we'd errors like "redraw happened during scrolling.
     *
     * One thing to note is RAFs should have as little logic as possible within them
     * and should only contain the CSS+DOM manipulations.
     * It's best to do (as much as possible) logic+calculations outside the RAF,
     * and then when ready to move things around, do those inside the RAF.
     * this keeps the RAF short and sweet, and keeps our FPS-lag low.
     */
    #rafReference = NaN;
    requestAnimationFrame(fnCallback) {
        if (this.virtualScroll) {
            this.#rafReference = requestAnimationFrame(fnCallback);
        }
        else {
            fnCallback();
        }
    }
    /**
     * We always want to set doScroll=true when scrollRowIntoView() is called manually in code...
     * ...so when the "public" uses it they would simply do scrollRowIntoView(x).
     *
     * However, this method is also used in the "onscroll" event-handler...
     * ...within that "onscroll" event-handler, we want doScroll=false,
     * ...and let the browser handle moving/panning the window without interference.
     *
     * @param {number} rowIndex - which row to scroll into view.
     * @param {boolean} doScroll - set to "true" to have the browser perform the scroll action
     * @see IdsDataGrid.#attachVirtualScrollEvent()
     * @see https://medium.com/@moshe_31114/building-our-recycle-list-solution-in-react-17a21a9605a0
     * @see https://dev.to/adamklein/build-your-own-virtual-scroll-part-i-11ib
     * @see https://dev.to/adamklein/build-your-own-virtual-scroll-part-ii-3j86
     * @see https://fluffy.es/solve-duplicated-cells
     * @see https://vaadin.com/docs/latest/components/grid#columns
     * @see https://www.htmlelements.com/demos/grid/datagrid-bind-to-json
     * @see https://dev.to/gopal1996/understanding-reflow-and-repaint-in-the-browser-1jbg
     * @see https://medium.com/teads-engineering/the-most-accurate-way-to-schedule-a-function-in-a-web-browser-eadcd164da12
     * @see https://javascript.info/bubbling-and-capturing#capturing
     * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
     */
    scrollRowIntoView(rowIndex, doScroll = true) {
        if (this.#rafReference)
            cancelAnimationFrame(this.#rafReference);
        const data = this.data;
        const rows = this.rows;
        const maxRowIndex = data.length - 1;
        rowIndex = Math.max(rowIndex, 0);
        rowIndex = Math.min(rowIndex, maxRowIndex);
        if (!rows.length)
            return;
        const container = this.container;
        const body = this.body;
        const virtualScrollSettings = this.virtualScrollSettings;
        const firstRow = rows[0];
        const lastRow = rows[rows.length - 1];
        const firstRowIndex = firstRow.rowIndex;
        const lastRowIndex = lastRow.rowIndex;
        const isAboveFirstRow = rowIndex < firstRowIndex;
        const isBelowLastRow = rowIndex > lastRowIndex;
        const isInRange = !isAboveFirstRow && !isBelowLastRow;
        const reachedTheBottom = lastRowIndex >= maxRowIndex;
        let bufferRowIndex = rowIndex - virtualScrollSettings.BUFFER_ROWS;
        bufferRowIndex = Math.max(bufferRowIndex, 0);
        bufferRowIndex = Math.min(bufferRowIndex, maxRowIndex);
        if (isInRange) {
            const moveRowsDown = bufferRowIndex - firstRowIndex;
            const moveRowsUp = Math.abs(moveRowsDown);
            if (moveRowsDown > 0) {
                if (!reachedTheBottom) {
                    this.#recycleTopRowsDown(moveRowsDown);
                }
            }
            else if (moveRowsUp < virtualScrollSettings.NUM_ROWS) {
                this.#recycleBottomRowsUp(moveRowsUp);
            }
            else {
                return; // exit early because nothing to do.
            }
        }
        else if (isAboveFirstRow) {
            const moveRowsUp = Math.abs(bufferRowIndex - firstRowIndex);
            if (moveRowsUp < virtualScrollSettings.NUM_ROWS) {
                this.#recycleBottomRowsUp(moveRowsUp);
            }
            else {
                this.#recycleAllRows(bufferRowIndex);
            }
        }
        else if (isBelowLastRow) {
            this.#recycleAllRows(bufferRowIndex);
        }
        this.requestAnimationFrame(() => {
            // NOTE: repaint of padding is more performant than margin
            const maxPaddingBottom = (data.length * virtualScrollSettings.ROW_HEIGHT) - virtualScrollSettings.BODY_HEIGHT;
            const bodyTranslateY = bufferRowIndex * virtualScrollSettings.ROW_HEIGHT;
            const bodyPaddingBottom = maxPaddingBottom - bodyTranslateY;
            if (!reachedTheBottom) {
                body?.style.setProperty('transform', `translateY(${bodyTranslateY}px)`);
            }
            body?.style.setProperty('padding-bottom', `${Math.max(bodyPaddingBottom, 0)}px`);
            if (doScroll) {
                container.scrollTop = rowIndex * virtualScrollSettings.ROW_HEIGHT;
            }
        });
    }
    /* Recycle the rows duing scrolling */
    #recycleAllRows(topRowIndex) {
        const rows = this.rows;
        if (!rows.length)
            return;
        const veryLastIndex = this.data.length - 1;
        topRowIndex = Math.min(topRowIndex, veryLastIndex);
        topRowIndex = Math.max(topRowIndex, 0);
        // Using Array.every as an alternaive to using a for-loop with a break
        this.rows.every((row, idx) => {
            const nextRowIndex = topRowIndex + idx;
            if (nextRowIndex > veryLastIndex) {
                const moveTheRestToTop = this.virtualScrollSettings.NUM_ROWS - idx;
                this.#recycleBottomRowsUp(moveTheRestToTop);
                return false;
            }
            row.rowIndex = nextRowIndex;
            return true;
        });
    }
    /* Recycle the rows duing scrolling from the top */
    #recycleTopRowsDown(rowCount) {
        const rows = this.rows;
        if (!rowCount || !rows.length)
            return;
        const data = this.data;
        const bottomRow = rows[rows.length - 1];
        const bottomRowIndex = bottomRow.rowIndex;
        const staleRows = rows.slice(0, rowCount);
        const rowsToMove = [];
        // NOTE: Using Array.every as an alternaive to using a for-loop with a break
        staleRows.every((row, idx) => {
            const nextIndex = bottomRowIndex + (idx + 1);
            if (nextIndex >= data.length)
                return false;
            row.rowIndex = nextIndex;
            return rowsToMove.push(row);
        });
        if (!rowsToMove.length)
            return;
        // NOTE: no need to shift rows in the DOM if all the rows need to be recycled
        if (rowsToMove.length >= this.virtualScrollSettings.NUM_ROWS)
            return;
        this.requestAnimationFrame(() => {
            // NOTE: body.append is faster than body.innerHTML
            // NOTE: body.append is faster than multiple calls to appendChild()
            this.body?.append(...rowsToMove);
        });
    }
    /* Recycle the rows duing scrolling from the bottom */
    #recycleBottomRowsUp(rowCount) {
        const rows = this.rows;
        if (!rowCount || !rows.length)
            return;
        const topRow = rows[0];
        const topRowIndex = topRow.rowIndex;
        const staleRows = rows.slice((-1 * rowCount));
        const rowsToMove = [];
        // NOTE: Using Array.every as an alternaive to using a for-loop with a break
        staleRows.every((row, idx) => {
            const prevIndex = topRowIndex - (idx + 1);
            if (prevIndex < 0)
                return false;
            row.rowIndex = prevIndex;
            return rowsToMove.push(row);
        });
        if (!rowsToMove.length)
            return;
        this.requestAnimationFrame(() => {
            // NOTE: body.prepend() seems to be faster than body.innerHTML
            this.body?.prepend(...rowsToMove.reverse());
        });
    }
    /**
     * Set the aria-label element in the DOM. This should be translated.
     * @param {string} value The aria label
     */
    set label(value) {
        if (value) {
            this.setAttribute(attributes.LABEL, value);
            this.shadowRoot?.querySelector('.ids-data-grid')?.setAttribute('aria-label', value);
            return;
        }
        this.removeAttribute(attributes.LABEL);
        this.shadowRoot?.querySelector('.ids-data-grid')?.setAttribute('aria-label', 'Data Grid');
    }
    get label() { return this.getAttribute(attributes.LABEL) || 'Data Grid'; }
    /**
     * Set the row height between extra-small, small, medium and large (default)
     * @param {string} value The row height
     */
    set rowHeight(value) {
        if (value) {
            this.setAttribute(attributes.ROW_HEIGHT, value);
            this.shadowRoot?.querySelector('.ids-data-grid')?.setAttribute('data-row-height', value);
        }
        else {
            this.removeAttribute(attributes.ROW_HEIGHT);
            this.shadowRoot?.querySelector('.ids-data-grid')?.setAttribute('data-row-height', 'lg');
        }
        this.saveSettings?.();
    }
    get rowHeight() { return this.getAttribute(attributes.ROW_HEIGHT) || 'lg'; }
    /**
     * Sets keyboard navigation to rows
     * @param {boolean} value toggle row navigation
     */
    set rowNavigation(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.ROW_NAVIGATION, '');
            this.container?.classList.add('row-navigation');
        }
        else {
            this.removeAttribute(attributes.ROW_NAVIGATION);
            this.container?.classList.remove('row-navigation');
        }
    }
    get rowNavigation() {
        return this.hasAttribute(attributes.ROW_NAVIGATION);
    }
    /**
     * Set the style of the grid to list style for simple readonly lists
     * @param {boolean} value list styling to use
     */
    set listStyle(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.LIST_STYLE, String(value));
            this.shadowRoot?.querySelector('.ids-data-grid')?.classList.add('is-list-style');
        }
        else {
            this.removeAttribute(attributes.LIST_STYLE);
            this.shadowRoot?.querySelector('.ids-data-grid')?.classList.remove('is-list-style');
        }
    }
    get listStyle() { return stringToBool(this.getAttribute(attributes.LIST_STYLE)) || false; }
    /**
     * Set the row selection mode between false, 'single', 'multiple' and 'mixed'
     * @param {string|boolean} value selection mode to use
     */
    set rowSelection(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.ROW_SELECTION, String(value));
        }
        else {
            this.removeAttribute(attributes.ROW_SELECTION);
        }
    }
    get rowSelection() { return this.getAttribute(attributes.ROW_SELECTION) || false; }
    /**
     * Set suppress empty message
     * @param {string|boolean} value The value
     */
    set suppressEmptyMessage(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.SUPPRESS_EMPTY_MESSAGE, '');
        }
        else {
            this.removeAttribute(attributes.SUPPRESS_EMPTY_MESSAGE);
        }
        setEmptyMessage.apply(this);
    }
    get suppressEmptyMessage() {
        return this.hasAttribute(attributes.SUPPRESS_EMPTY_MESSAGE);
    }
    /*
    * Set to true to prevent rows from being selectedd when clicking the row,only the checkbox will select.
    * @param {string|boolean} value true or false
    */
    set suppressRowClickSelection(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.SUPPRESS_ROW_CLICK_SELECTION, value.toString());
        }
        else {
            this.removeAttribute(attributes.SUPPRESS_ROW_CLICK_SELECTION);
        }
    }
    get suppressRowClickSelection() { return this.getAttribute(attributes.SUPPRESS_ROW_CLICK_SELECTION) || false; }
    /**
     * Set to true to prevent rows from being deselected if click or space bar the row.
     * i.e. once a row is selected, it remains selected until another row is selected in its place.
     * @param {string|boolean} value true or false
     */
    set suppressRowDeselection(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.SUPPRESS_ROW_DESELECTION, String(value));
        }
        else {
            this.removeAttribute(attributes.SUPPRESS_ROW_DESELECTION);
        }
    }
    get suppressRowDeselection() { return this.getAttribute(attributes.SUPPRESS_ROW_DESELECTION) || false; }
    /**
     * Set to true to prevent rows from being deactivated if clicked.
     * i.e. once a row is activated, it remains activated until another row is activated in its place.
     * @param {string|boolean} value true or false
     */
    set suppressRowDeactivation(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.SUPPRESS_ROW_DEACTIVATION, String(value));
        }
        else {
            this.removeAttribute(attributes.SUPPRESS_ROW_DEACTIVATION);
        }
    }
    get suppressRowDeactivation() { return this.getAttribute(attributes.SUPPRESS_ROW_DEACTIVATION) || false; }
    /**
     * Get the selected rows
     * @returns {Array<object>} An array of all currently selected rows
     */
    get selectedRows() {
        return this.data.flatMap((row, index) => {
            if (row.rowSelected)
                return { index: Number(index), data: row };
            return [];
        });
    }
    /**
     * Get the activated row
     * @returns {any} The index of the selected row
     */
    get activatedRow() {
        return this.data.flatMap((row, index) => {
            if (row.rowActivated)
                return { index: Number(index), data: row };
            return [];
        })[0] || {};
    }
    /**
     * Update the dataset
     * @param {number} row the parent row that was clicked
     * @param {Record<string, unknown>} data the data to apply to the row
     * @param {boolean} isClear do not keep current data
     */
    updateDataset(row, data, isClear) {
        // Update the current data
        if (isClear)
            this.data[row] = data;
        else
            this.data[row] = { ...this.data[row], ...data };
        // Update the tree element in the original data
        if (this.treeGrid) {
            if (this.data[row].ariaLevel === 1) {
                this.datasource.originalData[this.data[row].originalElement] = {
                    ...this.datasource.originalData[this.data[row].originalElement],
                    ...data
                };
                return;
            }
            // Update the child element
            const parentRow = this.#findParentRow(this.datasource.originalData, this.data[row].parentElement);
            parentRow.children[this.data[row].ariaPosinset - 1] = {
                ...parentRow.children[this.data[row].ariaPosinset - 1],
                ...data
            };
            return;
        }
        // Non tree - update original data
        if (isClear)
            this.datasource.originalData[row] = data;
        else
            this.datasource.originalData[row] = { ...this.datasource.originalData[row], ...data };
    }
    /**
     * Find the parent id based on the cached props
     * @param {Array<Record<string, any>>} data the parent row that was clicked
     * @param {string} parentIds the string "1 2" of indexes
     * @returns {Record<string, unknown>} The child record
     */
    #findParentRow(data, parentIds) {
        let childRow;
        parentIds.split(' ').forEach((r, index) => {
            // eslint-disable-next-line eqeqeq
            if (index === 0)
                childRow = data.find((row) => row[this.idColumn] == r);
            // eslint-disable-next-line eqeqeq
            else
                childRow = childRow.children.find((cRow) => cRow.id == r);
        });
        return childRow;
    }
    /**
     * Get the row HTMLElement
     * @param {number} index the zero based index
     * @returns {HTMLElement} Row HTMLElement
     */
    rowByIndex(index) {
        return this.shadowRoot?.querySelector(`.ids-data-grid-body ids-data-grid-row[row-index="${index}"]`);
    }
    activeCellEditor;
    /**
     * Commit editing on any active editor
     */
    commitCellEdit() {
        this.activeCellEditor?.endCellEdit();
    }
    /**
     * Cancel editing on any active editor
     */
    cancelCellEdit() {
        this.activeCellEditor?.cancelCellEdit();
    }
    /**
     * Add a row to the data grid
     * @param {Record<string, unknown>} data the data to add to the row
     */
    addRow(data) {
        this.datasource.originalData.push(data);
        this.data = this.datasource.originalData;
        this.redrawBody();
    }
    /**
     * Remove a row by index for the data
     * @param {number} index the row index to remove
     */
    removeRow(index) {
        this.datasource.originalData.splice(index, 1);
        this.data = this.datasource.originalData;
        this.redrawBody();
    }
    /**
     * Clear all values in a row a row by index
     * @param {number} index the row index to clear
     */
    clearRow(index) {
        this.updateDataset(index, {}, true);
        this.redrawBody();
    }
    /**
     * Edit the first editable cell
     */
    editFirstCell() {
        this.#editAdjacentCell(IdsDirection.Next);
    }
    /**
     * Set a row to selected
     * @param {number} index the zero based index
     * @param {boolean} triggerEvent fire an event with the selected row
     */
    selectRow(index, triggerEvent = true) {
        const row = this.rowByIndex(index);
        if (!row)
            return;
        if (this.rowSelection === 'multiple' || this.rowSelection === 'mixed') {
            const checkbox = row?.querySelector('.is-selection-checkbox .ids-data-grid-checkbox');
            checkbox?.classList.add('checked');
            checkbox?.setAttribute('aria-checked', 'true');
        }
        if (this.rowSelection === 'single') {
            this.deSelectAllRows();
            const radio = row?.querySelector('.ids-data-grid-radio');
            radio?.classList.add('checked');
            radio?.setAttribute('aria-checked', 'true');
        }
        if (!row)
            return;
        row.selected = true;
        this.updateDataset(Number(row?.getAttribute('data-index')), { rowSelected: true });
        if ((this.rowSelection === 'single' || this.rowSelection === 'multiple') && row)
            row.updateCells(index);
        if (triggerEvent) {
            this.triggerEvent('rowselected', this, {
                detail: {
                    elem: this, row, data: this.data[index]
                }
            });
        }
        if (this.groupSelectsChildren)
            row?.toggleChildRowSelection(true);
        this.header.setHeaderCheckbox();
    }
    /**
     * Set a row to be deselected
     * @param {number} index the zero based index
     * @param {boolean} triggerEvent fire an event with the deselected row
     */
    deSelectRow(index, triggerEvent = true) {
        const row = this.rowByIndex(index);
        if (!row)
            return;
        if (this.rowSelection === 'mixed') {
            row.classList.remove('mixed');
        }
        row.classList.remove('selected');
        row.removeAttribute('aria-selected');
        if (this.rowSelection === 'multiple' || this.rowSelection === 'mixed') {
            const checkbox = row.querySelector('.is-selection-checkbox .ids-data-grid-checkbox');
            checkbox?.classList.remove('checked');
            checkbox?.setAttribute('aria-checked', 'false');
        }
        if (this.rowSelection === 'single') {
            const radio = row.querySelector('.ids-data-grid-radio');
            radio?.classList.remove('checked');
            radio?.setAttribute('aria-checked', 'false');
        }
        this.updateDataset(row.rowIndex, { rowSelected: undefined });
        if (triggerEvent) {
            this.triggerEvent('rowdeselected', this, {
                detail: {
                    elem: this, row, data: this.data[index]
                }
            });
        }
        row.updateCells(index);
        if (this.groupSelectsChildren)
            row.toggleChildRowSelection(false);
        this.header.setHeaderCheckbox();
    }
    /**
     * Set a row to activated
     * @param {number} index the zero based index
     */
    activateRow(index) {
        let row = index;
        if (typeof index === 'number') {
            row = this.rowByIndex(index);
        }
        if (!row || this.rowSelection !== 'mixed') {
            return;
        }
        row.classList.add('activated');
        this.updateDataset(Number(row?.getAttribute('data-index')), { rowActivated: true });
        row?.updateCells(index);
        this.triggerEvent('rowactivated', this, {
            detail: {
                elem: this, row, data: this.data[index], index
            }
        });
    }
    /**
     * Set a row to be deactivated
     * @param {number} index the zero based index
     */
    deactivateRow(index) {
        if (typeof index === 'undefined' || index === null) {
            return;
        }
        let row = index;
        if (typeof index === 'number') {
            row = this.rowByIndex(index);
        }
        if (!row || this.rowSelection !== 'mixed') {
            return;
        }
        row.classList.remove('activated');
        this.updateDataset(Number(row?.getAttribute('data-index')), { rowActivated: undefined });
        row.updateCells(index);
        this.triggerEvent('rowdeactivated', this, {
            detail: {
                elem: this, row, data: this.data[index], index
            }
        });
    }
    /**
     * Set a all rows to be selected
     */
    selectAllRows() {
        this.data?.forEach((row, index) => {
            this.selectRow(index);
            row.rowSelected = true;
        });
        this.triggerEvent('selectionchanged', this, {
            detail: {
                elem: this,
                selectedRows: this.selectedRows
            }
        });
        this.header.setHeaderCheckbox();
    }
    /**
     * Set a all rows to be deselected
     */
    deSelectAllRows() {
        this.data?.forEach((row, index) => {
            if (row.rowSelected) {
                this.deSelectRow(index);
                row.rowSelected = false;
            }
        });
        if (this.rowSelection !== 'single') {
            this.triggerEvent('selectionchanged', this, {
                detail: {
                    elem: this,
                    selectedRows: this.selectedRows
                }
            });
        }
        this.header.setHeaderCheckbox();
    }
    /**
     * Set/Get the total number of records
     * @returns {number} The no of rows (flattened trees)
     */
    get rowCount() {
        return this.data.length;
    }
    /**
     * Get the row height in pixels
     * @private
     * @returns {number} The pixel height
     */
    get rowPixelHeight() {
        const rowHeights = {
            xs: 30,
            sm: 35,
            md: 40,
            lg: 50
        };
        return rowHeights[this.rowHeight];
    }
    /**
     * Set the card to auto fit to its parent size
     * @param {boolean|string|null} value The auto fit
     */
    set autoFit(value) {
        if (stringToBool(value) || value === 'bottom') {
            this.setAttribute(attributes.AUTO_FIT, String(value));
            return;
        }
        this.removeAttribute(attributes.AUTO_FIT);
    }
    get autoFit() {
        const attr = this.getAttribute(attributes.AUTO_FIT);
        if (attr === 'bottom') {
            return attr;
        }
        return stringToBool(attr);
    }
    /**
     * Set the container height
     * @private
     */
    #applyAutoFit() {
        if (this.autoFitSet) {
            return;
        }
        if (this.autoFit === 'bottom') {
            const spaceFromTop = this.getBoundingClientRect().y;
            this.container?.style.setProperty('height', `calc(100vh - ${spaceFromTop + 24}px)`);
            this.autoFitSet = true;
        }
        if (this.autoFit === true) {
            this.container?.style.setProperty('height', '100%');
            this.wrapper?.style.setProperty('height', '100%');
            this.autoFitSet = true;
        }
    }
    /**
     * Suppress row row and cell caching
     * @param {boolean|string|null} value false to not cache
     */
    set suppressCaching(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.SUPPRESS_CACHING, String(value));
            return;
        }
        this.removeAttribute(attributes.SUPPRESS_CACHING);
    }
    get suppressCaching() {
        return stringToBool(this.getAttribute(attributes.SUPPRESS_CACHING)) || false;
    }
    /**
     * Set the active cell for focus
     * @param {number} cellNumber The cell to focus (zero based)
     * @param {number} rowIndex The row to focus (zero based)
     * @param {boolean} noFocus If true, do not focus the cell
     * @returns {object} the current active cell
     */
    setActiveCell(cellNumber, rowIndex, noFocus) {
        if (rowIndex < 0 || cellNumber < 0 || rowIndex > this.data.length - 1
            || cellNumber > this.visibleColumns.length - 1 || Number.isNaN(rowIndex) || Number.isNaN(rowIndex)) {
            return this.activeCell;
        }
        if (!this.activeCell)
            this.activeCell = {};
        this.activeCell.cell = Number(cellNumber);
        this.activeCell.row = Number(rowIndex);
        let rowNode = this.rowByIndex(rowIndex);
        if (!rowNode && this.virtualScroll) {
            this.scrollRowIntoView(rowIndex);
            rowNode = this.rowByIndex(rowIndex);
        }
        const queriedCells = rowNode?.querySelectorAll('ids-data-grid-cell');
        if (queriedCells && queriedCells.length > 0) {
            const cellNode = queriedCells[cellNumber];
            cellNode.activate(Boolean(noFocus));
        }
        return this.activeCell;
    }
    /**
     * Sets disable client filter
     * @param {boolean|string} value IThe value
     */
    set disableClientFilter(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.DISABLE_CLIENT_FILTER, '');
        }
        else {
            this.removeAttribute(attributes.DISABLE_CLIENT_FILTER);
        }
    }
    get disableClientFilter() {
        const value = this.getAttribute(attributes.DISABLE_CLIENT_FILTER);
        return value !== null ? stringToBool(value) : this.filters.DEFAULTS.disableClientFilter;
    }
    /**
     * Sets the data grid to be filterable
     * @param {boolean|string} value If true will set filterable
     */
    set filterable(value) {
        const isApply = this.filterable !== stringToBool(value);
        if (typeof value !== 'undefined' && value !== null) {
            this.setAttribute(attributes.FILTERABLE, String(value));
        }
        else {
            this.removeAttribute(attributes.FILTERABLE);
        }
        if (isApply)
            this.header.setFilterRow();
    }
    get filterable() {
        const value = this.getAttribute(attributes.FILTERABLE);
        return value !== null ? stringToBool(value) : this.filters.DEFAULTS.filterable;
    }
    /**
     * Sets disabled to be filter row
     * @param {boolean|string} value The value
     */
    set filterRowDisabled(value) {
        const isApply = this.filterRowDisabled !== stringToBool(value);
        if (typeof value !== 'undefined' && value !== null) {
            this.setAttribute(attributes.FILTER_ROW_DISABLED, String(value));
        }
        else {
            this.removeAttribute(attributes.FILTER_ROW_DISABLED);
        }
        if (isApply)
            this.filters?.setFilterRowDisabled();
    }
    get filterRowDisabled() {
        const value = this.getAttribute(attributes.FILTER_ROW_DISABLED);
        return value !== null ? stringToBool(value) : this.filters.DEFAULTS.filterRowDisabled;
    }
    /**
     * Sets the data grid to filter when typing
     * @param {boolean|string} value The value
     */
    set filterWhenTyping(value) {
        const isApply = this.filterWhenTyping !== stringToBool(value);
        if (typeof value !== 'undefined' && value !== null) {
            this.setAttribute(attributes.FILTER_WHEN_TYPING, String(value));
        }
        else {
            this.removeAttribute(attributes.FILTER_WHEN_TYPING);
        }
        if (isApply)
            this.filters?.setFilterWhenTyping();
    }
    get filterWhenTyping() {
        const value = this.getAttribute(attributes.FILTER_WHEN_TYPING);
        return value !== null ? stringToBool(value) : this.filters.DEFAULTS.filterWhenTyping;
    }
    /**
     * Sets the grid to render as a tree grid (does require a tree formatter column)
     * @param {boolean|string} value The value
     */
    set treeGrid(value) {
        value = stringToBool(value);
        if (value) {
            this.setAttribute(attributes.TREE_GRID, value.toString());
        }
        else {
            this.removeAttribute(attributes.TREE_GRID);
        }
    }
    get treeGrid() {
        return stringToBool(this.getAttribute(attributes.TREE_GRID)) || false;
    }
    /**
     * If true then the children will be selected when a group is selected
     * @param {boolean|string} value The value
     */
    set groupSelectsChildren(value) {
        value = stringToBool(value);
        if (value) {
            this.setAttribute(attributes.GROUP_SELECTS_CHILDREN, value.toString());
        }
        else {
            this.removeAttribute(attributes.GROUP_SELECTS_CHILDREN);
        }
    }
    get groupSelectsChildren() {
        return stringToBool(this.getAttribute(attributes.GROUP_SELECTS_CHILDREN)) || false;
    }
    /**
     * Used to set which column is the unique id column in the data set.
     * This is needed for some operations.
     * @param {string} value The value
     */
    set idColumn(value) {
        if (value) {
            this.setAttribute(attributes.ID_COLUMN, value.toString());
        }
        else {
            this.removeAttribute(attributes.ID_COLUMN);
        }
    }
    get idColumn() {
        return this.getAttribute(attributes.ID_COLUMN) || 'id';
    }
    /**
     * If true an expandable row is present in the grid. Also requires a expandable-row-template and
     * an expander formatter.
     * @param {string} value The value
     */
    set expandableRow(value) {
        if (value) {
            this.setAttribute(attributes.EXPANDABLE_ROW, value.toString());
        }
        else {
            this.removeAttribute(attributes.EXPANDABLE_ROW);
        }
    }
    get expandableRow() {
        return this.getAttribute(attributes.EXPANDABLE_ROW) || false;
    }
    /**
     * An id that points to the template to use for expandable rows. Also requires the expandable-row setting
     * and an expander formatter.
     * @param {string} value The value
     */
    set expandableRowTemplate(value) {
        if (value) {
            this.setAttribute(attributes.EXPANDABLE_ROW_TEMPLATE, value.toString());
        }
        else {
            this.removeAttribute(attributes.EXPANDABLE_ROW_TEMPLATE);
        }
    }
    get expandableRowTemplate() {
        return this.getAttribute(attributes.EXPANDABLE_ROW_TEMPLATE) || '';
    }
    /**
     * Set uniqueId to save to local storage.
     * @param {number|string|null} value A uniqueId use to save to local storage.
     */
    set uniqueId(value) {
        const val = /number|string/g.test(typeof value) ? `${value}` : null;
        if (typeof val === 'string' && val !== '') {
            this.setAttribute(attributes.UNIQUE_ID, val);
        }
        else {
            this.removeAttribute(attributes.UNIQUE_ID);
        }
    }
    get uniqueId() { return this.getAttribute(attributes.UNIQUE_ID); }
    /**
     * Set to true if one or more editors is present to activate editing
     * @param {boolean} value true indicates some cells may be editable
     */
    set editable(value) {
        value = stringToBool(value);
        if (value) {
            this.setAttribute(attributes.EDITABLE, value.toString());
        }
        else {
            this.removeAttribute(attributes.EDITABLE);
        }
    }
    get editable() {
        return stringToBool(this.getAttribute(attributes.EDITABLE));
    }
    /**
     * Set to false to avoid moving up and down rows when editing and hitting enter
     * @param {boolean} value false indicates the grid will not switch rows on edit
     */
    set editNextOnEnterPress(value) {
        value = stringToBool(value);
        if (value) {
            this.setAttribute(attributes.EDIT_NEXT_ON_ENTER_PRESS, value.toString());
        }
        else {
            this.removeAttribute(attributes.EDIT_NEXT_ON_ENTER_PRESS);
        }
    }
    get editNextOnEnterPress() {
        return stringToBool(this.getAttribute(attributes.EDIT_NEXT_ON_ENTER_PRESS));
    }
    /**
     * Get all the currently invalid cells
     * @returns {Array<{ row: number, cell: number, columnId: string | null, validationMessages: any }>} cell invalid info
     */
    get invalidCells() {
        const invalidCells = [];
        for (let index = 0; index < this.data.length; index++) {
            if (this.data[index]?.invalidCells) {
                this.data[index].invalidCells?.forEach((invalidCellInRow) => {
                    invalidCellInRow.row = index;
                });
                invalidCells.push(...this.data[index].invalidCells);
            }
        }
        return invalidCells;
    }
    /**
     * Get all the currently dirty cells
     * @returns {Array<{ row: number, cell: number, columnId: string | null, originalValue: any }>} info about the dirty cells
     */
    get dirtyCells() {
        const dirtyCells = [];
        for (let index = 0; index < this.data.length; index++) {
            if (this.data[index]?.dirtyCells) {
                this.data[index].dirtyCells?.forEach((dirtyCellInRow) => {
                    dirtyCellInRow.row = index;
                });
                dirtyCells.push(...this.data[index].dirtyCells);
            }
        }
        return dirtyCells;
    }
    /**
     * Reset any currently dirty cells
     */
    resetDirtyCells() {
        this.data.forEach((row) => {
            if (row?.dirtyCells) {
                delete row.dirtyCells;
            }
        });
        this.container?.querySelectorAll('ids-data-grid-cell.is-dirty').forEach((elem) => {
            elem.classList.remove('is-dirty');
        });
    }
};
IdsDataGrid = __decorate([
    customElement('ids-data-grid'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsDataGrid);
export default IdsDataGrid;
//# sourceMappingURL=ids-data-grid.js.map