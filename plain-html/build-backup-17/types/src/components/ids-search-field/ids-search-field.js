var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stripHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
import Base from './ids-search-field-base';
import '../ids-trigger-field/ids-trigger-button';
import '../ids-input/ids-input';
import '../ids-icon/ids-icon';
import styles from './ids-search-field.scss';
const DEFAULT_LABEL = 'Search';
const DEFAULT_PLACEHOLDER = 'Type to search';
/**
 * IDS Search Field Component
 * @type {IdsSearchField}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsColorVariantMixin
 */
let IdsSearchField = class IdsSearchField extends Base {
    constructor() {
        super();
    }
    isFormComponent = true;
    /**
     * Inherited from `IdsColorVariantMixin`
     * @returns {Array<string>} List of available color variants for this component
     */
    colorVariants = ['alternate', 'app-menu'];
    /**
     * Inherited from `IdsColorVariantMixin`. If the Color Variant on Search Fields are changed,
     * switch trigger buttons to the "alternate" style instead of an `app-menu` style.
     * @param {string} variantName the new color variant being applied to the Search Field
     */
    onColorVariantRefresh(variantName) {
        let btnVariantName = variantName || '';
        if (variantName === 'app-menu') {
            btnVariantName = 'alternate';
        }
        const adjustBtnVariant = (btn) => {
            btn.setAttribute(attributes.COLOR_VARIANT, btnVariantName);
        };
        this.buttons.forEach(adjustBtnVariant);
        if (this.fieldContainer) {
            [...this.fieldContainer.querySelectorAll('ids-trigger-button')].forEach(adjustBtnVariant);
        }
    }
    static get attributes() {
        return [
            ...super.attributes,
        ];
    }
    connectedCallback() {
        super.connectedCallback();
        this.#attachEventHandlers();
        this.#attachKeyboardListener();
        if (!this.placeholder) {
            this.placeholder = DEFAULT_PLACEHOLDER;
        }
        if (!this.label) {
            this.label = DEFAULT_LABEL;
        }
    }
    template() {
        this.templateHostAttributes();
        const { ariaLabel, containerClass, inputClass, inputState, labelHtml, placeholder, type, value } = this.templateVariables();
        return `<div id="ids-search-field" class="ids-search-field ids-trigger-field ${containerClass}" part="container">
      ${labelHtml}
      <div class="field-container" part="field-container">
        <ids-icon class="ids-icon search-icon starting-icon" size="medium" icon="search"></ids-icon>
        <slot name="trigger-start"></slot>
        <input
          part="input"
          id="${this.id}-input"
          ${type}${inputClass}${placeholder}${inputState}
          ${ariaLabel}
          ${value}
          ></input>
        <slot name="trigger-end"></slot>
      </div>
      ${this.autocomplete ? `
        <ids-popup
          type="dropdown"
          align="bottom, left"
          align-target="#${this.id}-input"
          part="popup"
        >
          <ids-list-box slot="content"></ids-list-box>
        </ids-popup>` : ''}
    </div>`;
    }
    /**
     * Programmatically sets the search field's value and performs an optional search function
     * @param {any} val the incoming value to search for
     * @returns {Array<any>} containing search results, if applicable
     */
    async search(val) {
        let ret = [];
        const safeVal = stripHTML(val);
        if (this.#previousSearchValue !== safeVal) {
            if (this.input)
                this.input.value = safeVal;
            this.#previousSearchValue = safeVal;
            if (typeof this.onSearch === 'function') {
                ret = await this.onSearch(safeVal);
            }
        }
        return ret;
    }
    /**
     * @param {string} val the new value to set
     */
    set value(val) {
        super.value = val;
        const newValue = super.value;
        this.#previousSearchValue = newValue;
        if (typeof this.onSearch === 'function') {
            this.onSearch(newValue);
        }
    }
    get value() {
        return super.value;
    }
    /**
     * Define this method to carry out search functionality
     * (override this method when implementing an IdsSearchField).
     * @param {any} [val] the value to be searched for
     * @returns {Array<any>} containing matching search results
     */
    onSearch(val = undefined) {
        return [`${stripHTML(val)}`];
    }
    /**
     * @param {any} value
     */
    #previousSearchValue = null;
    /**
     * Adds Search Field specific event handlers
     */
    #attachEventHandlers() {
        const handleSearchEvent = (e) => {
            this.search(e.target.value);
        };
        this.onEvent('change', this.input, handleSearchEvent);
        this.onEvent('input', this.input, handleSearchEvent);
    }
    /**
     * Listen for enter key to perform search function
     */
    #attachKeyboardListener() {
        this.onEvent('keydown', this.input, (event) => {
            const shouldSearchOnReturn = !event?.path?.length || !event.path[0].classList || !event.path[0].classList.contains('ids-icon-button');
            if (['Enter'].indexOf(event.code) > -1 && shouldSearchOnReturn) {
                event.preventDefault();
            }
            switch (event.key) {
                case 'Enter':
                    if (shouldSearchOnReturn) {
                        this.onSearch(this.input?.value);
                    }
                    break;
                default:
                    break;
            }
        });
    }
};
IdsSearchField = __decorate([
    customElement('ids-search-field'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsSearchField);
export default IdsSearchField;
//# sourceMappingURL=ids-search-field.js.map