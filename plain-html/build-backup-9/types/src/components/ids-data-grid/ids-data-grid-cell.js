var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var IdsDataGridCell_1;
import { customElement } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
let IdsDataGridCell = IdsDataGridCell_1 = class IdsDataGridCell extends IdsElement {
    rootNode;
    isInValid = false;
    constructor() {
        super({ noShadowRoot: true });
    }
    connectedCallback() {
        super.connectedCallback();
    }
    /**
     * Reference to the data grid parent
     * @returns {IdsDataGrid} the data grid parent
     */
    get dataGrid() {
        if (!this.rootNode)
            this.rootNode = this.getRootNode();
        return (this.rootNode.host);
    }
    /**
     * Get the column definition
     * @returns {IdsDataGridColumn} the current cells column
     */
    get column() {
        return this.dataGrid?.columns[Number(this.getAttribute('aria-colindex')) - 1];
    }
    /**
     * Rerender a cell - may be used later
     */
    renderCell() {
        const column = this.column;
        const rowIndex = Number(this.parentElement?.getAttribute('row-index'));
        const row = this.dataGrid?.data[rowIndex];
        let template = IdsDataGridCell_1.template(row, column, rowIndex, this.dataGrid);
        if (row.invalidCells) {
            const message = row.invalidCells.find((info) => info.cell === Number(this.getAttribute('aria-colindex')) - 1);
            if (message)
                template += `<ids-alert icon="error" tooltip="${message.validationMessages[0]?.message}"></ids-alert>`;
        }
        this.innerHTML = template;
    }
    /**
     * Set the active cell for focus
     * @param {boolean} nofocus If true, do not focus the cell
     * @returns {object} the current active cell
     */
    activate(nofocus) {
        this.dataGrid.activeCell?.node?.removeAttribute('tabindex');
        this.dataGrid.activeCell.node = this;
        this.setAttribute('tabindex', '0');
        if (!nofocus) {
            this.focus();
        }
        this.dataGrid.triggerEvent('activecellchanged', this.dataGrid, { detail: { elem: this, activeCell: this.dataGrid.activeCell } });
        return this.dataGrid.activeCell;
    }
    /** Previous Value before Editing */
    originalValue;
    /** Previous Invalid state before reseting */
    previousInvalidState = '';
    /** The editor element */
    editor;
    /** If currently in edit mode */
    isEditing;
    /**
     * Start Edit Mode
     * @param {boolean} isClick If true of clicking activated the editor (vs keyboard)
     */
    startCellEdit(isClick) {
        const column = this.column;
        if (!column.editor)
            return;
        const columnEditor = this.dataGrid.editors.find((obj) => obj.type === column?.editor?.type);
        if (!columnEditor || !columnEditor.editor || this.isEditing)
            return;
        // Init Editor
        let canEdit = !(this.classList.contains('is-readonly') || this.classList.contains('is-disabled'));
        if (!canEdit) {
            return;
        }
        const response = (veto) => {
            canEdit = !!veto;
        };
        this.dataGrid.triggerEvent('beforecelledit', this.dataGrid, {
            detail: {
                elem: this, editor: this.editor, column, data: this.dataGrid.data[this.dataGrid.activeCell.row], response
            }
        });
        if (!canEdit) {
            return;
        }
        this.originalValue = this.innerText;
        this.editor = columnEditor.editor;
        this.editor.isClick = isClick;
        // Override original value if dropdown
        if (this.editor.type === 'dropdown') {
            this.originalValue = this.querySelector('[data-value]')?.getAttribute('data-value');
        }
        this.editor.init(this);
        // Set states
        this.classList.add('is-editing');
        if (this.classList.contains('is-invalid')) {
            this.classList.remove('is-invalid');
            this.isInValid = true;
        }
        if (column.editor.inline)
            this.classList.add('is-inline');
        this.isEditing = true;
        // Save on Click Out Event
        this.editor.input?.onEvent('focusout', this.editor.input, () => {
            this.endCellEdit();
        });
        this.dataGrid?.triggerEvent('celledit', this.dataGrid, {
            detail: {
                elem: this, editor: this.editor, column, data: this.dataGrid.data[this.dataGrid?.activeCell.row]
            }
        });
        this.dataGrid.activeCellEditor = this;
    }
    /** End Cell Edit */
    endCellEdit() {
        const column = this.column;
        const input = this.editor?.input;
        input?.offEvent('focusout', input);
        if (this.editor?.type === 'input') {
            input?.setDirtyTracker(input?.value);
            input?.checkValidation();
        }
        if (this.editor?.type === 'dropdown') {
            input?.input?.checkValidation();
        }
        const isDirty = column.editor?.editorSettings?.dirtyTracker && input?.isDirty;
        const isValid = column.editor?.editorSettings?.validate ? input?.isValid : true;
        const newValue = this.editor?.save(this);
        this.#saveCellValue(newValue?.value);
        // Save dirty and valid state on the row
        if (isDirty)
            this.#saveDirtyState(newValue?.dirtyCheckValue ?? newValue?.value);
        if (!isValid)
            this.#saveValidState(input?.validationMessages);
        if (this.isInValid && isValid)
            this.#resetValidState();
        this.editor?.destroy(this);
        this.renderCell();
        this.isEditing = false;
        this.classList.remove('is-editing');
        this.dataGrid?.triggerEvent('endcelledit', this.dataGrid, {
            detail: {
                elem: this, editor: this.editor, column, data: this.dataGrid.data[this.dataGrid?.activeCell.row]
            }
        });
        this.dataGrid.activeCellEditor = undefined;
    }
    /** Cancel Cell Edit */
    cancelCellEdit() {
        const column = this.column;
        const input = this.editor?.input;
        input?.offEvent('focusout', input);
        input?.setDirtyTracker(input?.value);
        this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, { [String(column?.field)]: this.originalValue });
        this.editor?.destroy(this);
        this.renderCell();
        this.isEditing = false;
        this.classList.remove('is-editing');
        this.dataGrid?.triggerEvent('cancelcelledit', this.dataGrid, {
            detail: {
                elem: this,
                editor: this.editor,
                column,
                data: this.dataGrid.data[this.dataGrid?.activeCell.row],
                oldValue: this.originalValue
            }
        });
        this.dataGrid.activeCellEditor = undefined;
    }
    /**
     * Save cell Edit Back into data set
     * @param {any} newValue the value to coerce and save
     */
    #saveCellValue(newValue) {
        const column = this.column;
        this.dataGrid.resetCache(this.dataGrid?.activeCell.row);
        if (column.editor?.editorSettings?.mask === 'date') {
            newValue = this.dataGrid.locale.parseDate(newValue, column.formatOptions);
        }
        this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, {
            [String(column?.field)]: newValue,
        });
    }
    /**
     * Save the dirty state info on the row
     * @param {boolean} newValue the current value
     */
    #saveDirtyState(newValue) {
        let rowDirtyCells = this.dataGrid.data[this.dataGrid?.activeCell.row].dirtyCells;
        if (rowDirtyCells === undefined)
            rowDirtyCells = [];
        const cell = Number(this.getAttribute('aria-colindex')) - 1;
        const previousCellInfo = rowDirtyCells.filter((item) => item.cell === cell);
        if (previousCellInfo[0] && newValue === previousCellInfo[0].originalValue) {
            const oldIndex = rowDirtyCells.findIndex((item) => item.cell === cell);
            rowDirtyCells.splice(oldIndex, 1);
            // Value was reset
            this?.classList.remove('is-dirty');
            this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, {
                dirtyCells: rowDirtyCells
            });
            return;
        }
        this?.classList.add('is-dirty');
        if (previousCellInfo.length === 0) {
            rowDirtyCells.push({
                cell: Number(this?.getAttribute('aria-colindex')) - 1,
                columnId: this.column.id,
                originalValue: this?.editor?.input?.dirty.original
            });
            this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, {
                dirtyCells: rowDirtyCells
            });
        }
    }
    /**
     * Save the validation state info on the row
     * @param {any} validationMessages the current value
     */
    #saveValidState(validationMessages) {
        let rowInvalidCells = this.dataGrid.data[this.dataGrid?.activeCell.row].invalidCells;
        if (!rowInvalidCells)
            rowInvalidCells = [];
        const cell = Number(this.getAttribute('aria-colindex')) - 1;
        const previousCellInfo = rowInvalidCells.filter((item) => item.cell === cell);
        this?.classList.add('is-invalid');
        if (previousCellInfo.length === 0) {
            this.previousInvalidState = validationMessages.id;
            rowInvalidCells.push({
                cell: Number(this?.getAttribute('aria-colindex')) - 1,
                columnId: this.column.id,
                validationMessages
            });
            this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, {
                invalidCells: rowInvalidCells
            });
        }
    }
    /**
     * Set back the valid state
     */
    #resetValidState() {
        this?.classList.remove('is-invalid');
        this.dataGrid?.updateDataset(this.dataGrid?.activeCell.row, {
            invalidCells: undefined
        });
        this.isInValid = false;
    }
    // NOTE: check memory footprint of this caching strategy
    static cellCache = {};
    /**
     * Return the Template for the cell contents
     * @param {object} row The data item for the row
     * @param {object} column The column data for the row
     * @param {object} rowIndex The running row-index
     * @param {IdsDataGrid} dataGrid The dataGrid instance
     * @returns {string} The template to display
     */
    static template(row, column, rowIndex, dataGrid) {
        const cacheHash = dataGrid.cacheHash;
        const selected = row.rowSelected ? 'select' : 'deselect';
        const cacheKey = `${cacheHash}:${column.id}:${rowIndex}:${selected}`;
        // NOTE: This is how we could disable cache until a proper cache-busting strategy is in place
        // delete IdsDataGridCell.cellCache[cacheKey];
        // NOTE: this type of param-based caching is good for upscroll when revising rows that have been seen already.
        // NOTE: we also need a content-cache that caches based on the actual data that's being rendered
        // NOTE: content-cache should probably be done in the IdsDataGridFormatters class
        if (!IdsDataGridCell_1.cellCache[cacheKey]) {
            const dataGridFormatters = dataGrid.formatters;
            let template = '';
            if (!dataGridFormatters[column?.formatter?.name || 'text'] && column?.formatter)
                template = column?.formatter(row, column, rowIndex, dataGrid);
            else
                template = dataGridFormatters[column?.formatter?.name || 'text'](row, column, rowIndex, dataGrid);
            if (row.invalidCells) {
                const message = row.invalidCells.find((info) => info.cell === dataGrid.columnIdxById(column.id));
                if (message)
                    template += `<ids-alert icon="error" tooltip="${message?.validationMessages[0]?.message}"></ids-alert>`;
            }
            IdsDataGridCell_1.cellCache[cacheKey] = template;
        }
        return IdsDataGridCell_1.cellCache[cacheKey];
    }
};
IdsDataGridCell = IdsDataGridCell_1 = __decorate([
    customElement('ids-data-grid-cell'),
    __metadata("design:paramtypes", [])
], IdsDataGridCell);
export default IdsDataGridCell;
//# sourceMappingURL=ids-data-grid-cell.js.map