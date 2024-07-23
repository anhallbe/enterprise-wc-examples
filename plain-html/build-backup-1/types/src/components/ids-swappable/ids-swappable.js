var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { customElement, scss, } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-swappable-base';
import styles from './ids-swappable.scss';
/**
 * IDS Swappable Component
 * @type {IdsSwappable}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
let IdsSwappable = class IdsSwappable extends Base {
    draggingElements = [];
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('dropzone', 'move');
        this.attachEventListeners();
    }
    static get attributes() {
        return [
            ...super.attributes,
            attributes.ACTIVE,
            attributes.SELECTION
        ];
    }
    template() {
        return `<slot></slot>`;
    }
    /**
     * Get the item that is dragged over
     * @returns {HTMLElement} ids-swappable-item[over]
     * @readonly
     * @memberof IdsSwappable
     */
    get overElement() {
        return this.querySelector('ids-swappable-item[over]');
    }
    /**
     * Get all the selected ids-swappable-items in the current list
     * @returns {any} NodeList of ids-swappable-item[selected]
     * @readonly
     * @memberof IdsSwappable
     */
    get selectedItems() {
        return this.querySelectorAll('ids-swappable-item[selected]');
    }
    /**
     * Handle functionality for the dragstart event
     */
    #dzDragStart() {
        if (this.selectedItems.length <= 1) {
            return;
        }
        this.selectedItems.forEach((el) => {
            el.originalText = el.innerText;
            el.innerHTML = `<ids-text>${this.selectedItems.length} Items Selected</ids-text>`;
        });
    }
    /**
     * Handle functionality for the drag event
     * @param {any} event drag event
     */
    #dzDrag(event) {
        this.selectedItems.forEach((el) => {
            this.#hideDraggingItems(event, el);
        });
    }
    /**
     * Calculate the position of the dragging element relative to the container
     * @returns {HTMLElement} closest element being dragged over
     * @param {any} container ids-swappable container
     * @param {number} y position of the dragging element
     * @memberof IdsSwappable
     */
    getDragAfterElement = (container, y) => {
        const draggableElms = [...container.querySelectorAll('ids-swappable-item:not([dragging])')];
        return draggableElms.reduce((closest, child) => {
            const rect = child.getBoundingClientRect();
            // (rect.top + rect.height/2) returns the y of the container's child element's middle point
            const offset = y - (rect.top + rect.height / 2);
            // if the dragging element is immediately above the child's middle point
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            }
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };
    /**
     * Handle functionality for the list container once an item has been dropped
     * @param {object} event drop
     */
    #dzDropHandler(event) {
        event.preventDefault();
        const afterElement = this.getDragAfterElement(this, event.clientY);
        if (this.draggingElements?.length > 0) {
            if (afterElement) {
                this.draggingElements.forEach((draggingEl) => {
                    this.#resetDraggingItems(draggingEl);
                    this.insertBefore(draggingEl, afterElement);
                });
            }
            else {
                this.draggingElements.forEach((draggingEl) => {
                    this.#resetDraggingItems(draggingEl);
                    this.appendChild(draggingEl);
                });
            }
        }
        this.removeAttribute(attributes.ACTIVE);
    }
    /**
     * Handle functionality for the dragleave event
     */
    #dzDragLeave() {
        this.removeAttribute(attributes.ACTIVE);
    }
    /**
     * Functionality for the list container once we are hovering over the list
     * @param {any} event drop
     */
    #dzDragover(event) {
        event.preventDefault();
        if (!this.overElement) {
            this.setAttribute(attributes.ACTIVE, '');
        }
        else {
            this.removeAttribute(attributes.ACTIVE);
        }
        // find ids-swappable or ids-swappable-item
        const found = event.composedPath().find((i) => {
            if (i.nodeType === 1 && (i.nodeName === 'IDS-SWAPPABLE-ITEM' || i.nodeName === 'IDS-SWAPPABLE')) {
                return i;
            }
        });
        if (found) {
            const theLowestShadowRoot = found.getRootNode();
            this.draggingElements = theLowestShadowRoot.querySelectorAll('ids-swappable-item[dragging]');
        }
    }
    /**
     * Hide the dragging items during drag event
     * @param {any} event object
     * @param {any} el all dragging elements
     */
    #hideDraggingItems(event, el) {
        el.setAttribute('aria-grabbed', true);
        el.setAttribute('aria-dropeffect', event.dataTransfer.dropEffect);
        el.setAttribute('dragging', '');
        if (this.selectedItems.length <= 1) {
            return;
        }
        if (el !== event.target) {
            el.classList.add('is-hidden');
        }
    }
    /**
     * Reset the selected items after drop event
     * @param {any} el all selected elements
     */
    #resetDraggingItems(el) {
        if (el.originalText) {
            el.innerHTML = `<ids-text>${el.originalText}</ids-text>`;
        }
        el.removeAttribute('dragging');
        el.removeAttribute('aria-grabbed');
        el.removeAttribute('aria-dropeffect');
        el.classList.remove('is-hidden');
    }
    /**
     * Attach all event listeners
     * @memberof IdsSwappable
     */
    attachEventListeners() {
        this.offEvent('dragstart', this, () => this.#dzDragStart());
        this.onEvent('dragstart', this, () => this.#dzDragStart());
        this.offEvent('drag', this, (e) => this.#dzDrag(e));
        this.onEvent('drag', this, (e) => this.#dzDrag(e));
        this.offEvent('drop', this, (e) => this.#dzDropHandler(e));
        this.onEvent('drop', this, (e) => this.#dzDropHandler(e));
        this.offEvent('dragover', this, (e) => this.#dzDragover(e));
        this.onEvent('dragover', this, (e) => this.#dzDragover(e));
        this.offEvent('dragleave', this, () => this.#dzDragLeave());
        this.onEvent('dragleave', this, () => this.#dzDragLeave());
    }
};
IdsSwappable = __decorate([
    customElement('ids-swappable'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsSwappable);
export default IdsSwappable;
//# sourceMappingURL=ids-swappable.js.map