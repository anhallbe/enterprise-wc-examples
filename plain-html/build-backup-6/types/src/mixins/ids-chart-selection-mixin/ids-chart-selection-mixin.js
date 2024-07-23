import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
// Default settings
const DEFAULT_SELECTABLE = false;
/**
 * A mixin that adds selection functionality to chart components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsChartSelectionMixin = (superclass) => class extends superclass {
    DEFAULT_SELECTABLE = DEFAULT_SELECTABLE;
    constructor(...args) {
        super(...args);
        if (!this.state)
            this.state = {};
        this.state.selectable = DEFAULT_SELECTABLE;
    }
    static get attributes() {
        return [
            ...superclass.attributes,
            attributes.SELECTABLE
        ];
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.#init();
    }
    /**
     * Setup handlers on selection elements
     * @returns {void}
     */
    attachSelectionEvents() {
        this.offEvent('click.chartselection', this.container);
        if (!this.selectable)
            return;
        this.onEvent('click.chartselection', this.container, async (e) => {
            const index = this.selectionElements?.findIndex((el) => el === e.target);
            if (!Number.isNaN(index) && index > -1)
                this.setSelection?.(index);
        });
    }
    /**
     * Detatch selection handlers on elements
     * @returns {void}
     */
    detachSelectionEvents() {
        this.offEvent('click.chartselection', this.container);
    }
    /**
     * Initialize selection settings
     * @private
     * @returns {void}
     */
    #init() {
        this.DEFAULT_SELECTABLE = this.DEFAULT_SELECTABLE ?? DEFAULT_SELECTABLE;
        if ((this.DEFAULT_SELECTABLE !== DEFAULT_SELECTABLE) && !this.hasAttribute(attributes.SELECTABLE)) {
            if (!this.state)
                this.state = {};
            this.state.selectable = this.DEFAULT_SELECTABLE;
        }
        this.container?.classList[this.selectable ? 'add' : 'remove'](attributes.SELECTABLE);
        this.attachSelectionEvents();
    }
    /**
     * Runs optional `onSelectableChange` callback, if possible
     * @private
     * @param {boolean} value The value
     */
    #doSelectableChange(value) {
        if (typeof this.onSelectableChange === 'function') {
            this.onSelectableChange(value);
        }
    }
    /**
     *  Set the selectable
     * @param {boolean|string} value If true will set `selectable` attribute
     */
    set selectable(value) {
        const val = stringToBool(value);
        if (val !== this.state.selectable) {
            this.state.selectable = val;
            if (val) {
                this.setAttribute(attributes.SELECTABLE, '');
                this.container?.classList.add(attributes.SELECTABLE);
            }
            else {
                this.removeAttribute(attributes.SELECTABLE);
                this.container?.classList.remove(attributes.SELECTABLE);
            }
            this.#doSelectableChange(val);
            this.attachSelectionEvents();
        }
    }
    get selectable() { return this.state.selectable; }
};
export default IdsChartSelectionMixin;
//# sourceMappingURL=ids-chart-selection-mixin.js.map