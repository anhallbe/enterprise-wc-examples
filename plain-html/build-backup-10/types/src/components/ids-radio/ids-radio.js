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
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-radio-base';
import '../ids-text/ids-text';
import './ids-radio-group';
import styles from './ids-radio.scss';
/**
 * IDS Radio Component
 * @type {IdsRadio}
 * @inherits IdsElement
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @part radio - the actual radio input element
 * @part circle - the visible circle element
 * @part label - the label text element
 */
let IdsRadio = class IdsRadio extends Base {
    input;
    labelEl;
    rootEl;
    /**
     * Call the constructor and then initialize
     */
    constructor() {
        super();
    }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            attributes.CHECKED,
            attributes.COLOR,
            attributes.DISABLED,
            attributes.GROUP_DISABLED,
            attributes.HORIZONTAL,
            attributes.LABEL,
            attributes.LANGUAGE,
            attributes.VALIDATION_HAS_ERROR,
            attributes.VALUE
        ];
    }
    /**
     * Custom Element `connectedCallback` implementation
     * @returns {void}
     */
    connectedCallback() {
        super.connectedCallback();
        this.input = this.shadowRoot?.querySelector('input[type="radio"]');
        this.labelEl = this.shadowRoot?.querySelector('label');
        this.rootEl = this.shadowRoot?.querySelector('.ids-radio');
        if (this.checked && !this.input?.getAttribute(attributes.CHECKED)) {
            this.checked = true;
        }
        this.#attachEventHandlers();
    }
    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        // Checkbox
        const isDisabled = stringToBool(this.groupDisabled) || stringToBool(this.disabled);
        const disabled = isDisabled ? ' disabled' : '';
        const disabledAria = isDisabled ? ' aria-disabled="true"' : '';
        const color = this.color ? ` color="${this.color}"` : '';
        const horizontal = stringToBool(this.horizontal) ? ' horizontal' : '';
        const checked = stringToBool(this.checked) ? ' checked' : '';
        const rootClass = ` class="ids-radio${disabled}${horizontal}"`;
        const radioClass = ' class="radio-button"';
        return `
      <div${rootClass}${color}>
        <label>
          <input type="radio" part="radio" tabindex="-1"${radioClass}${disabled}${checked}>
          <span class="circle${checked}" part="circle"></span>
          <ids-text class="label-text"${disabledAria} part="label">${this.label}</ids-text>
        </label>
      </div>
    `;
    }
    /**
     * Attach radio change event
     * @private
     * @returns {void}
     */
    #attachRadioChangeEvent() {
        this.onEvent('change', this.input, () => {
            this.checked = !!this.input?.checked;
        });
    }
    /**
     * Attach radio click event
     * @private
     * @returns {void}
     */
    #attachRadioClickEvent() {
        this.onEvent('click', this.labelEl, () => {
            this.input?.focus(); // Safari need focus first click
        });
    }
    /**
     * Establish Internal Event Handlers
     * @private
     * @returns {void}
     */
    #attachNativeEvents() {
        const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
        events.forEach((evt) => {
            this.onEvent(evt, this.input, (e) => {
                /**
                 * Trigger event on parent and compose the args
                 * will fire nativeEvents.
                 * @private
                 * @param {object} elem Actual event
                 * @param {string} value The updated input element value
                 */
                this.triggerEvent(e.type, this, {
                    detail: {
                        elem: this,
                        nativeEvent: e,
                        value: this.value,
                        checked: !!this.input?.checked
                    }
                });
            });
        });
    }
    /**
     * Attach events
     * @private
     * @returns {void}
     */
    #attachEventHandlers() {
        this.#attachRadioClickEvent();
        this.#attachRadioChangeEvent();
        this.#attachNativeEvents();
    }
    /**
     * Set `checked` attribute
     * @param {boolean|string} value If true will set `checked` attribute
     */
    set checked(value) {
        const circle = this.shadowRoot?.querySelector('.circle');
        const val = stringToBool(value);
        if (val) {
            this.setAttribute(attributes.CHECKED, val.toString());
        }
        else {
            this.removeAttribute(attributes.CHECKED);
        }
        if (this.input && this.rootEl && circle) {
            if (val) {
                if (!(stringToBool(this.disabled)
                    || stringToBool(this.groupDisabled))) {
                    this.rootEl.setAttribute('tabindex', '0');
                }
                circle.classList.add(attributes.CHECKED);
                this.input.checked = true;
            }
            else {
                this.rootEl.setAttribute('tabindex', '-1');
                this.input.checked = false;
                circle.classList.remove(attributes.CHECKED);
            }
        }
    }
    get checked() { return stringToBool(this.getAttribute(attributes.CHECKED)); }
    /**
     * Set `color` attribute
     * @param {string | null} value If true will set `color` attribute
     */
    set color(value) {
        if (value) {
            this.setAttribute(attributes.COLOR, value.toString());
            this.rootEl?.setAttribute(attributes.COLOR, value.toString());
        }
        else {
            this.removeAttribute(attributes.COLOR);
            this.rootEl?.removeAttribute(attributes.COLOR);
        }
    }
    get color() { return this.getAttribute(attributes.COLOR); }
    /**
     * Set `disabled` attribute
     * @param {boolean|string} value If true will set `disabled` attribute
     */
    set disabled(value) {
        const labelText = this.shadowRoot?.querySelector('.label-text');
        const val = stringToBool(value);
        if (val) {
            this.setAttribute(attributes.DISABLED, val.toString());
            this.input?.setAttribute(attributes.DISABLED, val.toString());
            this.rootEl?.classList.add(attributes.DISABLED);
            this.rootEl?.setAttribute('tabindex', '-1');
            labelText?.setAttribute('aria-disabled', 'true');
            labelText?.setAttribute(attributes.DISABLED, 'true');
        }
        else {
            this.removeAttribute(attributes.DISABLED);
            this.input?.removeAttribute(attributes.DISABLED);
            labelText?.removeAttribute('aria-disabled');
            labelText?.removeAttribute(attributes.DISABLED);
            this.rootEl?.classList.remove(attributes.DISABLED);
        }
    }
    get disabled() { return stringToBool(this.getAttribute(attributes.DISABLED)); }
    /**
     * Set `group-disabled` attribute
     * @param {boolean|string} value If true will set `group-disabled` attribute
     */
    set groupDisabled(value) {
        const labelText = this.shadowRoot?.querySelector('.label-text');
        const val = stringToBool(value);
        if (val) {
            this.setAttribute(attributes.GROUP_DISABLED, val.toString());
            this.input?.setAttribute(attributes.DISABLED, val.toString());
            this.rootEl?.classList.add(attributes.DISABLED);
            this.rootEl?.setAttribute('tabindex', '-1');
            labelText?.setAttribute(attributes.DISABLED, 'true');
        }
        else {
            this.removeAttribute(attributes.GROUP_DISABLED);
            this.input?.removeAttribute(attributes.DISABLED);
            this.rootEl?.classList.remove(attributes.DISABLED);
            labelText?.removeAttribute(attributes.DISABLED);
        }
    }
    get groupDisabled() { return stringToBool(this.getAttribute(attributes.GROUP_DISABLED)); }
    /**
     * Set `horizontal` attribute `inline|block`, default as `block`
     * @param {boolean|string} value If true will set `horizontal` attribute
     */
    set horizontal(value) {
        const val = stringToBool(value);
        if (val) {
            this.setAttribute(attributes.HORIZONTAL, val.toString());
            this.rootEl?.classList.add(attributes.HORIZONTAL);
        }
        else {
            this.removeAttribute(attributes.HORIZONTAL);
            this.rootEl?.classList.remove(attributes.HORIZONTAL);
        }
    }
    get horizontal() { return stringToBool(this.getAttribute(attributes.HORIZONTAL)); }
    /**
     * Set the `label` text
     * @param {string} value of the `label` text property
     */
    set label(value) {
        const labelText = this.labelEl?.querySelector('.label-text');
        if (value) {
            this.setAttribute(attributes.LABEL, value);
        }
        else {
            this.removeAttribute(attributes.LABEL);
        }
        if (labelText) {
            labelText.innerHTML = value || '';
        }
    }
    get label() { return this.getAttribute(attributes.LABEL) || ''; }
    /**
     * Set `validation-has-error` attribute
     * @param {boolean|string} value If true will set `validation-has-error` attribute
     */
    set validationHasError(value) {
        const val = stringToBool(value);
        if (val) {
            this.setAttribute(attributes.VALIDATION_HAS_ERROR, val.toString());
            this.input?.classList.add('error');
        }
        else {
            this.removeAttribute(attributes.VALIDATION_HAS_ERROR);
            this.input?.classList.remove('error');
        }
    }
    get validationHasError() { return stringToBool(this.getAttribute(attributes.VALIDATION_HAS_ERROR)); }
    /**
     * Set the `value` attribute
     * @param {string | null} val the value property
     */
    set value(val) {
        if (val) {
            this.setAttribute(attributes.VALUE, val);
        }
        else {
            this.removeAttribute(attributes.VALUE);
        }
        this.input?.setAttribute(attributes.VALUE, (val || ''));
    }
    get value() { return this.getAttribute(attributes.VALUE); }
    /**
     * Overrides the standard "focus" behavior to instead pass focus to the inner HTMLInput element.
     * @returns {void}
     */
    focus() {
        this.input?.focus();
    }
};
IdsRadio = __decorate([
    customElement('ids-radio'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsRadio);
export default IdsRadio;
//# sourceMappingURL=ids-radio.js.map