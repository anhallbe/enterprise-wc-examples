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
import '../ids-text/ids-text';
import Base from './ids-radio-group-base';
import styles from './ids-radio-group.scss';
/**
 * IDS Radio Group Component
 * @type {IdsRadioGroup}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsValidationMixin
 */
let IdsRadioGroup = class IdsRadioGroup extends Base {
    /**
     * Call the constructor and then initialize
     */
    constructor() {
        super();
    }
    isFormComponent = true;
    input;
    labelEl;
    checked = null;
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            ...super.attributes,
            attributes.DISABLED,
            attributes.HORIZONTAL,
            attributes.LABEL,
            attributes.LABEL_REQUIRED,
            attributes.LANGUAGE,
            attributes.VALIDATE,
            attributes.VALIDATION_EVENTS,
            attributes.VALUE
        ];
    }
    /**
     * Custom Element `connectedCallback` implementation
     * @returns {void}
     */
    connectedCallback() {
        super.connectedCallback();
        const slot = this.shadowRoot?.querySelector('slot');
        this.onEvent('slotchange', slot, () => {
            this.afterChildrenReady();
        });
    }
    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        // Radio
        const disabled = stringToBool(this.disabled) ? ' disabled' : '';
        const disabledAria = stringToBool(this.disabled) ? ' aria-disabled="true"' : '';
        const horizontal = stringToBool(this.horizontal) ? ' horizontal' : '';
        const rootClass = ` class="ids-radio-group${disabled}${horizontal}"`;
        const rInd = !(stringToBool(this.labelRequired) || this.labelRequired === null);
        const labelClass = ` class="group-label-text${rInd ? ' no-required-indicator' : ''}"`;
        // Label
        const label = this.label ? `<ids-text type="legend"${labelClass}${disabledAria}>${this.label}</ids-text>` : '';
        return `<div role="radiogroup"${rootClass}>${label}<slot></slot></div>`;
    }
    /**
     * Set after children ready
     * @private
     * @returns {void}
     */
    afterChildrenReady() {
        this.input = this.shadowRoot?.querySelector('.ids-radio-group');
        this.labelEl = this.shadowRoot?.querySelector('.group-label-text');
        this.setValue();
        this.handleHorizontal();
        this.handleDisabled();
        this.attachInternalEventHandlers();
        this.handleDirtyTracker();
        this.handleValidation();
    }
    /**
     * Set value for group
     * @private
     * @returns {void}
     */
    setValue() {
        const radioArr = [].slice.call(this.querySelectorAll('ids-radio[checked="true"]'));
        const len = radioArr.length;
        const value = radioArr[len - 1]?.getAttribute(attributes.VALUE);
        if (value) {
            this.setAttribute(attributes.VALUE, value);
        }
        else if (!len) {
            const radio = this.querySelector('ids-radio');
            const rootEl = radio?.shadowRoot?.querySelector('.ids-radio');
            rootEl?.setAttribute('tabindex', '0');
        }
        else if (len > 1) {
            radioArr.pop();
            radioArr.forEach((r) => r.removeAttribute(attributes.CHECKED));
        }
    }
    /**
     * Clear the group as checked, validation etc.
     * @returns {void}
     */
    clear() {
        this.value = null;
        this.checked = null;
        this.removeAllValidationMessages();
        const radio = this.querySelector('ids-radio');
        const rootEl = radio?.shadowRoot?.querySelector('.ids-radio');
        rootEl?.setAttribute('tabindex', '0');
    }
    /**
     * Set disabled for each radio in group.
     * @returns {void}
     */
    handleDisabled() {
        const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
        const rootEl = this.shadowRoot?.querySelector('.ids-radio-group');
        if (stringToBool(this.disabled)) {
            this.labelEl?.setAttribute('aria-disabled', 'true');
            rootEl?.classList.add(attributes.DISABLED);
            radioArr.forEach((r) => r.setAttribute(attributes.GROUP_DISABLED, true));
        }
        else {
            this.labelEl?.removeAttribute('aria-disabled');
            rootEl?.classList.remove(attributes.DISABLED);
            radioArr.forEach((r) => r.removeAttribute(attributes.GROUP_DISABLED));
        }
    }
    /**
     * Set horizontal for each radio in group.
     * @returns {void}
     */
    handleHorizontal() {
        const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
        const rootEl = this.shadowRoot?.querySelector('.ids-radio-group');
        if (stringToBool(this.horizontal)) {
            rootEl?.classList.add(attributes.HORIZONTAL);
            radioArr.forEach((r) => r.setAttribute(attributes.HORIZONTAL, true));
        }
        else {
            rootEl?.classList.remove(attributes.HORIZONTAL);
            radioArr.forEach((r) => r.removeAttribute(attributes.HORIZONTAL));
        }
    }
    /**
     * Make given radio as checked.
     * @private
     * @param {object} radio to make checked
     * @param {boolean} isFocus if true will set focus
     * @returns {void}
     */
    makeChecked(radio, isFocus) {
        const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
        const targetEl = radioArr.filter((r) => r !== radio);
        targetEl.forEach((r) => r.removeAttribute(attributes.CHECKED));
        this.checked = radio;
        const val = radio.value;
        if (val) {
            this.value = val;
        }
        if (isFocus) {
            radio.shadowRoot?.querySelector('input[type="radio"]')?.focus();
        }
        // Mark if first radio checked in group, use for css style
        const className = 'first-item-checked';
        if (radio === radioArr[0]) {
            this.input?.classList.add(className);
        }
        else {
            this.input?.classList.remove(className);
        }
        const args = { detail: { value: val, checked: radio } };
        this.triggerEvent('change', this.input, args);
        this.triggerEvent('change', this, args);
    }
    /**
     * Handle radio group change event
     * @private
     * @returns {void}
     */
    attachRadioGroupChangeEvent() {
        const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
        radioArr.forEach((r) => {
            this.onEvent('change', r, () => {
                this.makeChecked(r, false);
            });
        });
    }
    /**
     * Handle keydown event
     * @private
     * @returns {void}
     */
    attachRadioGroupKeydown() {
        const radioArr = [].slice.call(this.querySelectorAll('ids-radio:not([disabled="true"])'));
        const len = radioArr.length;
        radioArr.forEach((r, i) => {
            this.onEvent('keydown', r, (e) => {
                const allow = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Space'];
                const key = e.code;
                if (allow.indexOf(key) > -1) {
                    let idx = i;
                    if (key === 'ArrowDown' || key === 'ArrowRight') {
                        idx = (i >= (len - 1)) ? 0 : (idx + 1);
                    }
                    else if (key === 'ArrowUp' || key === 'ArrowLeft') {
                        idx = (i <= 0) ? (len - 1) : (idx - 1);
                    }
                    this.makeChecked(radioArr[idx], true);
                    e.preventDefault();
                }
            });
        });
    }
    /**
     * Handle events
     * @private
     * @returns {void}
     */
    attachInternalEventHandlers() {
        this.attachRadioGroupChangeEvent();
        this.attachRadioGroupKeydown();
    }
    /**
     * Sets checkbox to disabled
     * @param {boolean|string} value If true will set `disabled` attribute
     */
    set disabled(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.DISABLED, value.toString());
        }
        else {
            this.removeAttribute(attributes.DISABLED);
        }
        this.handleDisabled();
    }
    get disabled() { return stringToBool(this.getAttribute(attributes.DISABLED)); }
    /**
     * Flips the checkbox orientation to horizontal
     * @param {boolean|string} value If true will set `horizontal` attribute
     */
    set horizontal(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.HORIZONTAL, value.toString());
        }
        else {
            this.removeAttribute(attributes.HORIZONTAL);
        }
        this.handleHorizontal();
    }
    get horizontal() { return stringToBool(this.getAttribute(attributes.HORIZONTAL)); }
    /**
     * Set the `label` text
     * @param {string} value of the `label` text property
     */
    set label(value) {
        const rootEl = this.shadowRoot?.querySelector('.ids-radio-group');
        let labelText = this.shadowRoot?.querySelector('.group-label-text');
        if (value) {
            this.setAttribute(attributes.LABEL, value);
            if (!labelText) {
                labelText = document.createElement('ids-text');
                labelText.className = 'group-label-text';
                const refEl = this.shadowRoot?.querySelector('slot') || null;
                rootEl?.insertBefore(labelText, refEl);
                labelText = this.shadowRoot?.querySelector('.group-label-text');
            }
            if (labelText) {
                labelText.innerHTML = value;
            }
            return;
        }
        this.removeAttribute(attributes.LABEL);
        labelText = this.shadowRoot?.querySelector('.group-label-text');
        labelText?.remove();
    }
    get label() { return this.getAttribute(attributes.LABEL); }
    /**
     * Sets the checkbox to required
     * @param {string | null} value The `label-required` attribute
     */
    set labelRequired(value) {
        const val = stringToBool(value);
        if (value) {
            this.setAttribute(attributes.LABEL_REQUIRED, value.toString());
        }
        else {
            this.removeAttribute(attributes.LABEL_REQUIRED);
        }
        this.labelEl?.classList[!val ? 'add' : 'remove']('no-required-indicator');
    }
    get labelRequired() { return this.getAttribute(attributes.LABEL_REQUIRED); }
    /**
     * Sets the validation check to use
     * @param {string | null} value The `validate` attribute
     */
    set validate(value) {
        if (value) {
            this.setAttribute(attributes.VALIDATE, value);
        }
        else {
            this.removeAttribute(attributes.VALIDATE);
        }
        this.handleValidation();
    }
    get validate() { return this.getAttribute(attributes.VALIDATE); }
    /**
     * Sets which events to fire validation on
     * @param {string | null} value The `validation-events` attribute
     */
    set validationEvents(value) {
        if (value) {
            this.setAttribute(attributes.VALIDATION_EVENTS, value);
        }
        else {
            this.removeAttribute(attributes.VALIDATION_EVENTS);
        }
        this.handleValidation();
    }
    get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS); }
    /**
     * Sets the checkbox `value` attribute
     * @param {string | null} val the value property
     */
    set value(val) {
        const radioArr = [].slice.call(this.querySelectorAll('ids-radio'));
        if (val) {
            const state = { on: [], off: [] };
            radioArr.forEach((r) => {
                const rVal = r.getAttribute(attributes.VALUE);
                state[rVal === val ? 'on' : 'off'].push(r);
            });
            state.off.forEach((r) => r.removeAttribute(attributes.CHECKED));
            const r = state.on[state.on.length - 1];
            if (r) {
                r.setAttribute(attributes.CHECKED, 'true');
                this.setAttribute(attributes.VALUE, val);
                this.checked = r;
            }
            else {
                this.removeAttribute(attributes.VALUE);
            }
        }
        else {
            this.removeAttribute(attributes.VALUE);
            radioArr.forEach((r) => r.removeAttribute(attributes.CHECKED));
        }
    }
    get value() { return this.getAttribute(attributes.VALUE); }
};
IdsRadioGroup = __decorate([
    customElement('ids-radio-group'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsRadioGroup);
export default IdsRadioGroup;
//# sourceMappingURL=ids-radio-group.js.map