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
import Base from './ids-switch-base';
import '../ids-text/ids-text';
import styles from './ids-switch.scss';
/**
 * IDS Switch Component
 * @type {IdsSwitch}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 * @part checkbox - the checkbox input element
 * @part slider - the sliding part of the switch
 * @part label - the label text
 */
let IdsSwitch = class IdsSwitch extends Base {
    input;
    labelEl;
    /**
     * Call the constructor and then initialize
     */
    constructor() {
        super();
    }
    isFormComponent = true;
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            attributes.CHECKED,
            attributes.DISABLED,
            attributes.LABEL,
            attributes.VALUE
        ];
    }
    /**
     * Custom Element `connectedCallback` implementation
     * @returns {void}
     */
    connectedCallback() {
        super.connectedCallback();
        this.input = this.shadowRoot?.querySelector('input[type="checkbox"]');
        this.labelEl = this.shadowRoot?.querySelector('label');
        this.#attachEventHandlers();
    }
    /**
     * Custom Element `disconnectedCallback` implementation
     * @returns {void}
     */
    disconnectedCallback() {
        Base.prototype.disconnectedCallback.apply(this);
        this.#attachSwitchChangeEvent('remove');
        this.attachNativeEvents('remove');
    }
    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        const disabled = stringToBool(this.disabled) ? ' disabled' : '';
        const checked = stringToBool(this.checked) ? ' checked' : '';
        const rootClass = ` class="ids-switch${disabled}"`;
        const checkboxClass = ` class="checkbox"`;
        return `
      <div${rootClass}>
        <label>
          <input type="checkbox"${checkboxClass}${disabled}${checked} part="checkbox">
          <span class="slider${checked}" part="slider"></span>
          <ids-text class="label-text" part="label">${this.label}</ids-text>
        </label>
      </div>
    `;
    }
    /**
     * Handle switch change event
     * @private
     * @param {string} option If 'remove', will remove attached events
     * @returns {void}
     */
    #attachSwitchChangeEvent(option = '') {
        if (this.input) {
            const eventName = 'change';
            if (option === 'remove') {
                const handler = this.handledEvents?.get(eventName);
                if (handler && handler.target === this.input) {
                    this.offEvent(eventName, this.input);
                }
            }
            else {
                this.onEvent(eventName, this.input, () => {
                    this.checked = !!this.input?.checked;
                });
            }
        }
    }
    /**
     * Establish Internal Event Handlers
     * @private
     * @param {string} option If 'remove', will remove attached events
     * @returns {object} The object for chaining.
     */
    attachNativeEvents(option = '') {
        if (this.input) {
            const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
            events.forEach((evt) => {
                if (option === 'remove') {
                    const handler = this.handledEvents?.get(evt);
                    if (handler && handler.target === this.input) {
                        this.offEvent(evt, this.input);
                    }
                }
                else {
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
                                checked: this.input?.checked
                            }
                        });
                    });
                }
            });
        }
        return this;
    }
    /**
     * Handle events
     * @private
     * @returns {void}
     */
    #attachEventHandlers() {
        this.#attachSwitchChangeEvent();
        this.attachNativeEvents();
    }
    /**
     * Sets the checked state to true or false
     * @param {boolean|string} value If true will set `checked` attribute
     */
    set checked(value) {
        const slider = this.shadowRoot?.querySelector('.slider');
        this.input = this.shadowRoot?.querySelector('input[type="checkbox"]');
        const val = stringToBool(value);
        if (val) {
            this.setAttribute(attributes.CHECKED, val.toString());
            this.input?.setAttribute(attributes.CHECKED, val.toString());
            slider?.classList.add(attributes.CHECKED);
        }
        else {
            this.removeAttribute(attributes.CHECKED);
            this.input?.removeAttribute(attributes.CHECKED);
            slider?.classList.remove(attributes.CHECKED);
        }
    }
    get checked() { return stringToBool(this.getAttribute(attributes.CHECKED)); }
    /**
     * Sets checkbox to disabled
     * @param {boolean|string} value If true will set `disabled` attribute
     */
    set disabled(value) {
        this.input = this.shadowRoot?.querySelector('input[type="checkbox"]');
        const val = stringToBool(value);
        const labelText = this.shadowRoot?.querySelector('.label-text');
        if (val) {
            this.setAttribute(attributes.DISABLED, val.toString());
            this.input?.setAttribute(attributes.DISABLED, '');
            this.container?.classList.add(attributes.DISABLED);
            labelText?.setAttribute(attributes.DISABLED, 'true');
        }
        else {
            this.removeAttribute(attributes.DISABLED);
            this.input?.removeAttribute(attributes.DISABLED);
            this.container?.classList.remove(attributes.DISABLED);
            labelText?.removeAttribute(attributes.DISABLED);
        }
    }
    get disabled() { return this.hasAttribute(attributes.DISABLED); }
    /**
     * Set the `label` text
     * @param {string | null} value of the `label` text property
     */
    set label(value) {
        const labelText = this.shadowRoot?.querySelector('.label-text') || document.createElement('span');
        if (value) {
            this.setAttribute(attributes.LABEL, value);
            labelText.innerHTML = value;
            return;
        }
        this.removeAttribute(attributes.LABEL);
        labelText.innerHTML = '';
    }
    get label() { return this.getAttribute(attributes.LABEL) || ''; }
    /**
     * Sets the checkbox `value` attribute
     * @param {string | null} val the value property
     */
    set value(val) {
        this.input = this.shadowRoot?.querySelector('input[type="checkbox"]');
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
     */
    focus() {
        this.input?.focus();
    }
};
IdsSwitch = __decorate([
    customElement('ids-switch'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsSwitch);
export default IdsSwitch;
//# sourceMappingURL=ids-switch.js.map