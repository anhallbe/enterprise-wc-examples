var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { customElement, scss } from '../../core/ids-decorators';
import IdsInput from '../ids-input/ids-input';
import '../ids-toolbar/ids-toolbar';
import Base from './ids-list-builder-base';
import styles from './ids-list-builder.scss';
import IdsSwappableItem from '../ids-swappable/ids-swappable-item';
/**
 * IDS ListBuilder Component
 * @type {IdsListBuilder}
 * @inherits IdsListView
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the container element
 */
let IdsListBuilder = class IdsListBuilder extends Base {
    /**
     * Call the constructor and then initialize
     */
    constructor() {
        super();
    }
    /** Active editor of the selected list item */
    #selectedLiEditor = null;
    /**
     * A clone of the list item being dragged,
     * it appears during drag to help visualize where the dragged item's position
     */
    placeholder;
    connectedCallback() {
        this.sortable = true;
        super.connectedCallback();
        this.#attachEventListeners();
    }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array<string>} The attributes in an array
     */
    static get attributes() {
        return [
            ...super.attributes,
        ];
    }
    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        return `
      <div class="ids-list-builder">
          <div class="header">
            <ids-toolbar tabbable="true">
              <ids-toolbar-section type="buttonset">
                <ids-button id="button-add" color-variant="alternate">
                  <span class="audible">Add List Item</span>
                  <ids-icon icon="add"></ids-icon>
                </ids-button>
                <div class="separator"></div>
                <ids-button id="button-up" color-variant="alternate">
                  <span class="audible">Move Up List Item</span>
                  <ids-icon icon="arrow-up"></ids-icon>
                </ids-button>
                <ids-button id="button-down" color-variant="alternate">
                  <span class="audible">Move Down List Item</span>
                  <ids-icon icon="arrow-down"></ids-icon>
                </ids-button>
                <div class="separator"></div>
                <ids-button id="button-edit" color-variant="alternate">
                  <span class="audible">Edit List Item</span>
                  <ids-icon icon="edit"></ids-icon>
                </ids-button>
                <ids-button id="button-delete" color-variant="alternate">
                  <span class="audible">Delete Down List Item</span>
                  <ids-icon icon="delete"></ids-icon>
                </ids-button>
              </ids-toolbar-section>
            </ids-toolbar>
          </div>
          ${super.template()}
      </div>
    `;
    }
    /**
     * Set the selection mode of the listview
     * @param {string} value true to use virtual scrolling
     */
    set selectable(value) {
        super.selectable = value;
    }
    get selectable() {
        return super.selectable;
    }
    get dataKeys() {
        return super.dataKeys;
    }
    set dataKeys(val) {
        super.dataKeys = val;
    }
    get data() {
        return super.data;
    }
    /**
     * Set the data set of the list
     * @param {Array<any>} val The list of items
     */
    set data(val) {
        super.data = val;
        // need to reattach event listeners when new data set dynamically adds list items
        this.#attachEventListeners();
    }
    /**
     * Attaches all the listeners which allow for clicking,
     * dragging, and keyboard interaction with the list items
     * @private
     * @returns {void}
     */
    #attachEventListeners() {
        this.#attachClickListeners(); // for toolbar buttons
        this.#attachKeyboardListeners();
    }
    /**
     * Removes and unfocuses any active list item editor after updating the list item's value
     * @private
     * @returns {void}
     */
    #unfocusAnySelectedLiEditor() {
        if (this.#selectedLiEditor) {
            this.#removeSelectedLiEditor();
            this.updateDataFromDOM();
        }
    }
    /**
     * Helper function to update the list item inner text with the editor's input value
     * @private
     * @returns {void}
     */
    #updateSelectedLiWithEditorValue() {
        const listItem = this.selectedLi?.querySelector('div[part="list-item"]');
        const textElem = listItem?.querySelector('ids-text');
        if (textElem)
            textElem.innerHTML = this.#selectedLiEditor?.value ?? '';
    }
    /**
     * Helper function to remove the editor element from the DOM
     * @private
     * @returns {void}
     */
    #removeSelectedLiEditor() {
        this.offEvent('keyup', this.#selectedLiEditor);
        if (this.#selectedLiEditor) {
            this.#selectedLiEditor?.parentNode?.classList.remove('is-editing');
            this.#selectedLiEditor.remove();
        }
        this.#selectedLiEditor = null;
    }
    /**
     * Helper function to insert an editor into the DOM and hide the inner text of the list item
     * @param {boolean | null} newEntry whether or not this is an editor for a new or pre-existing list item
     * @private
     * @returns {void}
     */
    #insertSelectedLiWithEditor(newEntry = false) {
        if (this.selectedLi) {
            this.triggerEvent('itemChange', this, {
                detail: this.getListItemData(this.selectedLi)
            });
            if (!this.#selectedLiEditor) {
                const i = new IdsInput();
                const selectorStr = this.selectable === 'single' ? 'div[part="list-item"]' : '.list-item-content';
                const listItem = this.selectedLi.querySelector(selectorStr);
                // insert into DOM
                listItem?.insertBefore(i, listItem.querySelector('ids-text'));
                // hide inner text
                listItem?.classList.add('is-editing');
                // set the value of input
                this.#selectedLiEditor = i;
                i.value = newEntry ? 'New Value' : listItem?.querySelector('ids-text')?.innerHTML;
                i.autoselect = 'true';
                i.noMargins = 'true';
                i.colorVariant = 'alternate';
                i.focus();
                // update inner text on keyup
                this.onEvent('keyup', i, () => this.#updateSelectedLiWithEditorValue());
            }
            else {
                this.#selectedLiEditor.focus();
            }
        }
    }
    get selectedLi() {
        return this.shadowRoot?.querySelector('ids-swappable-item[selected]');
    }
    get allSelectedLi() {
        return this.shadowRoot?.querySelectorAll('ids-swappable-item[selected]');
    }
    /**
     * Remove selected list item
     * @private
     * @returns {void}
     */
    #removeAllSelectedLi() {
        const items = this.allSelectedLi || [];
        const indexOfItems = [];
        for (const item of items) {
            indexOfItems.push(item.getAttribute('index'));
            this.triggerEvent('itemDelete', this, {
                detail: this.getListItemData(item)
            });
            item.remove();
            if (this.#selectedLiEditor)
                this.#selectedLiEditor = null;
        }
        this.resetIndices();
        this.updateDataFromDOM();
        for (const index of indexOfItems) {
            const liItem = this.shadowRoot?.querySelector(`ids-swappable-item[index="${index}"]`);
            if (liItem) {
                this.toggleSelectedLi(liItem);
            }
        }
    }
    /**
     * Helper function for swapping nodes in the list item -- used when dragging list items or clicking the up/down arrows
     * @param {Node} nodeA the first node
     * @param {Node} nodeB the second node
     */
    swap(nodeA, nodeB) {
        nodeB.parentNode?.insertBefore(nodeA, nodeB);
    }
    /**
     * Attaches functionality for toolbar button interaction
     * @private
     * @returns {void}
     */
    #attachClickListeners() {
        // Add button
        this.onEvent('click', this.shadowRoot?.querySelector('#button-add'), () => {
            this.#unfocusAnySelectedLiEditor();
            let newSwappableItem;
            if (!this.data.length) {
                // if list is empty, add new item data to the source data
                const newItemData = {};
                this.dataKeys.forEach((key) => {
                    newItemData[key] = 'New Value';
                });
                this.shadowRoot?.querySelector('.ids-list-builder')?.remove();
                this.data = [newItemData];
                newSwappableItem = this.shadowRoot?.querySelector('ids-swappable-item');
            }
            else {
                const selectionNull = !this.selectedLi;
                // if an item is selected, create a node under it, otherwise create a node above the first item
                let targetDraggableItem = selectionNull ? this.shadowRoot?.querySelector('ids-swappable-item') : this.selectedLi;
                if (!targetDraggableItem) {
                    targetDraggableItem = new IdsSwappableItem();
                }
                newSwappableItem = targetDraggableItem.cloneNode(true);
                const insertionLocation = selectionNull ? targetDraggableItem : targetDraggableItem.nextSibling;
                if (targetDraggableItem.parentNode) {
                    targetDraggableItem.parentNode.insertBefore(newSwappableItem, insertionLocation);
                    targetDraggableItem.removeAttribute('selected');
                }
            }
            newSwappableItem?.setAttribute('selected', '');
            const listItem = newSwappableItem?.querySelector('div[part="list-item"]');
            const listItemText = listItem?.querySelector('ids-text');
            if (listItemText)
                listItemText.innerHTML = 'New Value';
            // remove any selected attribute on li that may have propogated from the clone
            if (listItem?.getAttribute('selected'))
                listItem.removeAttribute('selected');
            this.resetIndices();
            const newEntry = true;
            this.#insertSelectedLiWithEditor(newEntry);
            this.focusLi(newSwappableItem);
            this.#attachClickListenersForLi(newSwappableItem);
            this.#attachKeyboardListenersForLi(newSwappableItem);
            this.triggerEvent('itemAdd', this, {
                detail: this.getListItemData(newSwappableItem)
            });
        });
        // Up button
        this.onEvent('click', this.shadowRoot?.querySelector('#button-up'), () => {
            if (this.selectedLi) {
                this.#unfocusAnySelectedLiEditor();
                const prev = this.selectedLi?.previousElementSibling;
                if (prev) {
                    this.swap(this.selectedLi, prev);
                }
                this.updateDataFromDOM();
                this.triggerEvent('itemMoveUp', this, {
                    detail: {
                        dataSet: this.data
                    }
                });
            }
        });
        // Down button
        this.onEvent('click', this.shadowRoot?.querySelector('#button-down'), () => {
            if (this.selectedLi) {
                this.#unfocusAnySelectedLiEditor();
                const next = this.selectedLi?.nextElementSibling;
                if (next) {
                    this.swap(next, this.selectedLi);
                }
                this.updateDataFromDOM();
                this.triggerEvent('itemMoveDown', this, {
                    detail: {
                        dataSet: this.data
                    }
                });
            }
        });
        // Edit button
        this.onEvent('click', this.shadowRoot?.querySelector('#button-edit'), () => {
            this.#insertSelectedLiWithEditor();
        });
        // Delete button
        this.onEvent('click', this.shadowRoot?.querySelector('#button-delete'), () => {
            this.#removeAllSelectedLi();
        });
        this.getAllSwappableItems()?.forEach((li) => {
            this.#attachClickListenersForLi(li);
        });
    }
    /**
     * Add/remove the editor in one function,
     * used when `Enter` key is hit on a selected list item
     * @private
     * @returns {void}
     */
    #toggleEditor() {
        if (this.selectedLi) {
            if (!this.#selectedLiEditor) {
                this.#insertSelectedLiWithEditor();
            }
            else {
                this.#unfocusAnySelectedLiEditor();
            }
            this.focusLi(this.selectedLi);
        }
    }
    #attachKeyboardListeners() {
        this.getAllSwappableItems()?.forEach((li) => {
            this.#attachKeyboardListenersForLi(li);
        });
    }
    /**
     * Helper function to attach mouse events to each individual item
     * @private
     * @param {any} li the list item
     * @returns {void}
     */
    #attachClickListenersForLi(li) {
        li.offEvent('click');
        this.offEvent('click', li);
        this.onEvent('click', li, () => {
            this.focusLi(li);
            li.offEvent('click');
            if (!(this.getAllSelectedLiIndex().includes(+this.getFocusedLiIndex()))) {
                this.#unfocusAnySelectedLiEditor();
                this.toggleSelectedLi(li);
            }
            else if (!this.#selectedLiEditor) {
                this.toggleSelectedLi(li);
            }
        });
    }
    /**
     * Helper function to attach keyboard events to each individual item
     * @private
     * @param {any} li the list item
     * @returns {void}
     */
    #attachKeyboardListenersForLi(li) {
        li.unlisten('Enter');
        li.unlisten('ArrowUp');
        li.unlisten('ArrowDown');
        this.offEvent('keydown', li);
        this.onEvent('keydown', li, (event) => {
            switch (event.key) {
                case 'Enter': // edits the list item
                    event.preventDefault();
                    if (!(this.getAllSelectedLiIndex().includes(+this.getFocusedLiIndex()))) {
                        this.toggleSelectedLi(li);
                    }
                    this.#toggleEditor();
                    break;
                case ' ': // selects the list item
                    if (!this.#selectedLiEditor) {
                        event.preventDefault(); // prevent container from scrolling
                        this.toggleSelectedLi(li);
                    }
                    break;
                case 'Tab':
                    this.#unfocusAnySelectedLiEditor();
                    break;
                case 'ArrowUp':
                    this.focusLi(this.getFocusedLi().previousElementSibling);
                    this.#unfocusAnySelectedLiEditor();
                    break;
                case 'ArrowDown':
                    this.focusLi(this.getFocusedLi().nextElementSibling);
                    this.#unfocusAnySelectedLiEditor();
                    break;
                case 'Delete':
                    this.#removeAllSelectedLi();
                    break;
                default:
                    break;
            }
        });
    }
    /**
     * Get focused Li
     * @returns {any} focused Li
     */
    getFocusedLi() {
        const savedFocusedLi = this.container?.querySelector(`ids-swappable-item[role="listitem"][index="${this.getFocusedLiIndex()}"]`);
        const val = savedFocusedLi ?? this.container?.querySelector('ids-swappable-item[role="listitem"][tabindex="0"]');
        return val;
    }
    /**
     * Reset indices
     * @returns {void}
     */
    resetIndices() {
        const listItems = this.container?.querySelectorAll('ids-swappable-item');
        listItems?.forEach((x, i) => {
            x.setAttribute('index', i.toString());
            x.setAttribute('id', `id_item_${i + 1}`);
            x.setAttribute('aria-posinset', `${i + 1}`);
            x.setAttribute('aria-setsize', listItems.length.toString());
        });
    }
    set virtualScroll(value) {
        // Do nothing
    }
    /**
     * List builder does not support VS
     * @returns {boolean} false
     */
    get virtualScroll() {
        return false;
    }
};
IdsListBuilder = __decorate([
    customElement('ids-list-builder'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsListBuilder);
export default IdsListBuilder;
//# sourceMappingURL=ids-list-builder.js.map