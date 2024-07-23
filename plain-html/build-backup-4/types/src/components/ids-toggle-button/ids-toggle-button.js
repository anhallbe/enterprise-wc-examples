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
import Base from './ids-toggle-button-base';
import { BUTTON_ATTRIBUTES, BUTTON_TYPES } from '../ids-button/ids-button-common';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import '../ids-icon/ids-icon';
import styles from '../ids-button/ids-button.scss';
// Default Toggle Button Icons
const DEFAULT_ICON_OFF = 'star-outlined';
const DEFAULT_ICON_ON = 'star-filled';
/**
 * IDS Toggle Button Component
 * @type {IdsToggleButton}
 * @inherits IdsButton
 */
let IdsToggleButton = class IdsToggleButton extends Base {
    constructor() {
        super();
    }
    /**
     * @returns {Array<string>} containing configurable properties on this component
     */
    static get attributes() {
        return BUTTON_ATTRIBUTES.concat([
            attributes.ICON_OFF,
            attributes.ICON_ON,
            attributes.TEXT_OFF,
            attributes.TEXT_ON,
            attributes.PRESSED,
        ]);
    }
    /**
     * Toggle-Button-level `connectedCallback` implementation (adds an icon refresh)
     * @returns {void}
     */
    connectedCallback() {
        super.connectedCallback();
        this.refreshIcon();
        this.refreshText();
    }
    /**
     * Set the pressed (on/off) state
     * @param {boolean | string} val if true, the "toggle" is activated
     */
    set pressed(val) {
        const trueVal = stringToBool(val);
        this.state.pressed = trueVal;
        this.shouldUpdate = false;
        if (trueVal) {
            this.setAttribute(attributes.PRESSED, trueVal.toString());
        }
        else {
            this.removeAttribute(attributes.PRESSED);
        }
        this.shouldUpdate = true;
        this.refreshIcon();
        this.refreshText();
    }
    get pressed() {
        return this.state.pressed;
    }
    /**
     * Override setting the "type" on Toggle Buttons, since they can only be the default style
     * @param {IdsButtonType | null} val a valid type
     */
    set type(val) {
        val = BUTTON_TYPES[0];
        super.type = val;
    }
    /**
     * @returns {IdsButtonType} the currently set type
     */
    get type() {
        return super.type;
    }
    /**
     * Defines the `unpressed/off` toggle state icon.
     * @param {string} val corresponds to an IdsIcon's `icon` property
     * @returns {void}
     */
    set iconOff(val) {
        if (typeof val === 'string' && val.length) {
            this.setAttribute(attributes.ICON_OFF, val);
        }
        else {
            this.removeAttribute(attributes.ICON_OFF);
        }
        this.refreshIcon();
    }
    /**
     * @returns {string} the current icon representing the `unpressed/off` state
     */
    get iconOff() {
        return this.getAttribute(attributes.ICON_OFF) || DEFAULT_ICON_OFF;
    }
    /**
     * Defines the `pressed/on` toggle state icon.
     * @param {string} val corresponds to an IdsIcon's `icon` property
     * @returns {void}
     */
    set iconOn(val) {
        if (typeof val === 'string' && val.length) {
            this.setAttribute(attributes.ICON_ON, val);
        }
        else {
            this.removeAttribute(attributes.ICON_ON);
        }
        this.refreshIcon();
    }
    /**
     * @returns {string} the current icon representing the `pressed/on` state
     */
    get iconOn() {
        return this.getAttribute(attributes.ICON_ON) || DEFAULT_ICON_ON;
    }
    /**
     * Defines the `unpressed/off` toggle state text.
     * @param {string} val `unpressed/off` description text
     * @returns {void}
     */
    set textOff(val) {
        if (typeof val !== 'string' || !val.length) {
            this.removeAttribute(attributes.TEXT_OFF);
        }
        else {
            this.setAttribute(attributes.TEXT_OFF, val);
        }
        this.refreshText();
    }
    /**
     * @returns {string} the current icon representing the `unpressed/off` state
     */
    get textOff() {
        return this.getAttribute('text-off') || '';
    }
    /**
     * Defines the `pressed/on` toggle state icon.
     * @param {string} val corresponds to an IdsIcon's `icon` property
     * @returns {void}
     */
    set textOn(val) {
        if (typeof val !== 'string' || !val.length) {
            this.removeAttribute(attributes.TEXT_ON);
        }
        else {
            this.setAttribute(attributes.TEXT_ON, val);
        }
        this.refreshText();
    }
    /**
     * @returns {string} the current icon representing the `pressed/on` state
     */
    get textOn() {
        return this.getAttribute(attributes.TEXT_ON) || '';
    }
    /**
     * Sets (or creates) a slotted icon that represents the pressed state
     * @private
     * @returns {void}
     */
    refreshIcon() {
        this.icon = this[this.pressed ? 'iconOn' : 'iconOff'];
    }
    /**
     * Sets (or creates) a slotted span that contains text
     * @private
     * @returns {void}
     */
    refreshText() {
        this.text = this[this.pressed ? 'textOn' : 'textOff'];
    }
    /**
     * Toggles the "pressed" state of the button
     * @returns {void}
     */
    toggle() {
        this.pressed = !this.pressed;
    }
};
IdsToggleButton = __decorate([
    customElement('ids-toggle-button'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsToggleButton);
export default IdsToggleButton;
//# sourceMappingURL=ids-toggle-button.js.map