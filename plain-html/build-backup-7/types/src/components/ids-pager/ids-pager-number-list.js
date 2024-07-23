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
import { attributes } from '../../core/ids-attributes';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-pager-number-list-base';
import '../ids-text/ids-text';
import '../ids-button/ids-button';
import styles from './ids-pager-number-list.scss';
/**
 * IDS PagerNumberList Component
 *
 * @type {IdsPagerNumberList}
 * @inherits IdsElement
 * @part number selectable number among the list
 */
let IdsPagerNumberList = class IdsPagerNumberList extends Base {
    DEFAULT_STEP = 3;
    DEFAULT_PAGE_SIZE = 10;
    rootNode;
    constructor() {
        super();
    }
    template() {
        return (`<div class="ids-pager-number-list">
      </div>`);
    }
    static get attributes() {
        return [
            attributes.DISABLED,
            attributes.LABEL,
            attributes.PAGE_NUMBER,
            attributes.PAGE_SIZE,
            attributes.PARENT_DISABLED,
            attributes.STEP,
            attributes.TOTAL,
            attributes.VALUE
        ];
    }
    /**
     * React to attributes changing on the web-component
     * @param {string} name The property name
     * @param {string} oldValue The property old value
     * @param {string} newValue The property new value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (oldValue === newValue)
            return;
        const shouldRerender = [
            attributes.PAGE_NUMBER,
            attributes.PAGE_SIZE,
            attributes.STEP,
            attributes.TOTAL,
        ].includes(name);
        if (shouldRerender) {
            this.connectedCallback();
        }
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.pager) {
            this.disabled = this.pager.disabled;
            this.pageNumber = this.pager.pageNumber;
            this.pageSize = this.pager.pageSize;
            this.step = this.pager.step;
            this.total = this.pager.total;
        }
        this.#populatePageNumberButtons();
        this.#attachEventHandlers();
    }
    /**
     * Reference to the pager parent
     * @returns {IdsPager} the parent element
     */
    get pager() {
        if (!this.rootNode)
            this.rootNode = this.getRootNode?.()?.host;
        if (this.rootNode?.nodeName !== 'IDS-PAGER')
            this.rootNode = this.closest('ids-pager');
        return this.rootNode;
    }
    /**
     * @param {number} value The number of items shown per page
     */
    set pageSize(value) {
        const val = this.#validPageSize(value);
        this.setAttribute(attributes.PAGE_SIZE, String(val));
        this.#populatePageNumberButtons();
    }
    /** @returns {number} The number of items shown per page */
    get pageSize() {
        return this.pager?.pageSize
            ?? this.#validPageSize(this.getAttribute(attributes.PAGE_SIZE));
    }
    /**
     * Check given page size value, if not a number return default
     * @private
     * @param {number | string | null} value The value
     * @returns {number} Given value or default
     */
    #validPageSize(value) {
        const val = stringToNumber(value);
        return !Number.isNaN(val) && val > 0 ? val : this.DEFAULT_PAGE_SIZE;
    }
    /** @param {number} value A value 1-based page number shown */
    set pageNumber(value) {
        let val = stringToNumber(value);
        if (Number.isNaN(val) || val < 1)
            val = 1;
        else if (this.pageCount)
            val = Math.min(val, this.pageCount);
        this.setAttribute(attributes.PAGE_NUMBER, String(val));
        this.#populatePageNumberButtons();
    }
    /** @returns {number} A value 1-based page number displayed */
    get pageNumber() {
        const val = stringToNumber(this.getAttribute(attributes.PAGE_NUMBER) ?? 1);
        return this.pager?.pageNumber ?? val;
    }
    /** @param {number} value The number of items to track */
    set total(value) {
        let val = stringToNumber(value);
        if (Number.isNaN(val) || val < 1)
            val = 1;
        this.setAttribute(attributes.TOTAL, String(val));
    }
    /** @returns {string|number} The number of items for pager is tracking */
    get total() {
        const val = stringToNumber(this.getAttribute(attributes.TOTAL));
        return this.pager?.total ?? val;
    }
    /** @returns {number|null} The calculated pageCount using total and pageSize */
    get pageCount() {
        const val = this.hasAttribute(attributes.TOTAL)
            ? Math.ceil(this.total / this.pageSize)
            : null;
        return this.pager?.pageCount ?? val;
    }
    /** @param {boolean|string} value Whether to disable input at app-specified-level */
    set disabled(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.DISABLED, '');
        }
        else {
            this.removeAttribute(attributes.DISABLED);
        }
        this.#updateDisabledState();
    }
    /** @returns {boolean | string} A flag indicating whether button is disabled for nav reasons */
    get disabled() {
        return this.hasAttribute(attributes.DISABLED);
    }
    /**
     * @param {boolean | string} value A flag indicating if button is disabled through parent pager's
     * disabled attribute
     */
    set parentDisabled(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.PARENT_DISABLED, '');
        }
        else {
            this.removeAttribute(attributes.PARENT_DISABLED);
        }
        this.#updateDisabledState();
    }
    /**
     * @returns {string|boolean} A flag indicating whether button is
     * disabled via parent pager's disabled attribute
     */
    get parentDisabled() {
        return this.hasAttribute(attributes.PARENT_DISABLED);
    }
    /**
     * @returns {string|boolean} Whether the functionality overall is disabled based on
     * a combination of other available disabled fields
     */
    get disabledOverall() {
        return (this.hasAttribute(attributes.DISABLED)
            || this.hasAttribute(attributes.PARENT_DISABLED));
    }
    /**
     * Set the aria label text
     * @param {string} value The label text
     */
    set label(value) {
        if (value) {
            this.setAttribute(attributes.LABEL, value);
        }
        else {
            this.removeAttribute(attributes.LABEL);
        }
    }
    get label() {
        return this.getAttribute(attributes.LABEL) || 'Go to page {num} of {total}';
    }
    /**
     * Set the number of step for page number list
     * @param {number|string} value The number of steps
     */
    set step(value) {
        const val = stringToNumber(value);
        if (!Number.isNaN(val)) {
            this.setAttribute(attributes.STEP, String(val));
            return;
        }
        this.removeAttribute(attributes.STEP);
    }
    /** @returns {number} The number of steps */
    get step() {
        let val = stringToNumber(this.getAttribute(attributes.STEP));
        if (Number.isNaN(val))
            val = this.DEFAULT_STEP;
        return (this.pager?.step ?? val);
    }
    /**
     * update visible button disabled state
     * based on parentDisabled and disabled attribs
     */
    #updateDisabledState() {
        const children = this.container?.children ?? [];
        for (const el of children) {
            if (this.disabledOverall) {
                el.setAttribute(attributes.DISABLED, '');
            }
            else {
                el.removeAttribute(attributes.DISABLED);
            }
        }
    }
    /**
     * Establish Internal Event Handlers
     * @private
     * @returns {object} The object for chaining.
     */
    #attachEventHandlers() {
        // Fire page number change event.
        this.offEvent('click.pager-numberlist', this.container);
        this.onEvent('click.pager-numberlist', this.container, (e) => {
            const value = e.target?.getAttribute?.('data-id');
            if (value) {
                this.triggerEvent('pagenumberchange', this, {
                    bubbles: true,
                    composed: true,
                    detail: { elem: this, value }
                });
            }
        });
        return this;
    }
    #attachAria() {
        const pageCount = this.pageCount;
        const label = (id) => this.label.replace('{num}', `${id}`).replace('{total}', `${pageCount}`);
        this.container?.querySelectorAll('ids-button[data-id]').forEach((btn) => {
            const id = btn?.getAttribute('data-id');
            if (id)
                btn?.button?.setAttribute('aria-label', label(id));
        });
    }
    #populatePageNumberButtons() {
        const pageCount = this.pageCount;
        if (!pageCount)
            return;
        const pageNumber = Number(this.pageNumber);
        const disabled = this.disabledOverall ? ' disabled' : '';
        const buttons = [...new Array(pageCount)].map((value, key) => {
            const buttonNumber = key + 1;
            const selected = (buttonNumber === pageNumber) ? ' selected' : '';
            return `
        <ids-button data-id="${buttonNumber}"${selected}${disabled}>${buttonNumber}</ids-button>
      `;
        });
        const firstButton = buttons[0];
        const lastButton = buttons[buttons.length - 1];
        const divider = '<p class="divider">&#8230;</p>'; // horizontal ellipsis
        const step = Number(this.step);
        const leftBufferSize = step;
        const rightBufferSize = leftBufferSize;
        const totalBufferSize = leftBufferSize + rightBufferSize;
        const showStart = (pageNumber - totalBufferSize) < 1;
        const showEnd = (pageNumber + totalBufferSize) > pageCount;
        let visibleButtons = [];
        if (step < 1 || step >= pageCount) {
            visibleButtons = [...buttons];
        }
        else if (showStart) {
            const startButtons = buttons.slice(0, totalBufferSize + rightBufferSize);
            visibleButtons = startButtons.concat([divider, lastButton]);
        }
        else if (showEnd) {
            const endButtons = buttons.slice(-1 * (totalBufferSize + leftBufferSize));
            visibleButtons = [firstButton, divider].concat(endButtons);
        }
        else {
            const middleButtons = buttons.slice(pageNumber - leftBufferSize - 1, pageNumber + rightBufferSize);
            visibleButtons = [firstButton, divider].concat([...middleButtons, divider, lastButton]);
        }
        if (this.container) {
            this.container.innerHTML = visibleButtons.join('');
            this.#attachAria();
        }
    }
};
IdsPagerNumberList = __decorate([
    customElement('ids-pager-number-list'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsPagerNumberList);
export default IdsPagerNumberList;
//# sourceMappingURL=ids-pager-number-list.js.map