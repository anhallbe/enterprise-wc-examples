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
import { stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-layout-flex-base';
import styles from './ids-layout-flex.scss';
import './ids-layout-flex-item';
// List of flex options
export const FLEX_OPTIONS = {
    alignContent: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'stretch', 'start', 'end', 'baseline'],
    alignItems: ['start', 'end', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    direction: ['row', 'row-reverse', 'column', 'column-reverse'],
    display: ['flex', 'inline-flex'],
    justifyContent: ['start', 'end', 'flex-start', 'flex-end', 'center', 'left', 'right', 'space-between', 'space-around', 'space-evenly'],
    wrap: ['nowrap', 'wrap', 'wrap-reverse'],
    units: [0, 1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40]
};
/**
 * IDS Layout Flex Component
 * @type {IdsLayoutFlex}
 * @inherits IdsElement
 */
let IdsLayoutFlex = class IdsLayoutFlex extends Base {
    constructor() {
        super();
    }
    static get attributes() {
        return [
            ...super.attributes,
            attributes.ALIGN_CONTENT,
            attributes.ALIGN_ITEMS,
            attributes.DIRECTION,
            attributes.DISPLAY,
            attributes.GAP,
            attributes.GAP_X,
            attributes.GAP_Y,
            attributes.JUSTIFY_CONTENT,
            attributes.WRAP
        ];
    }
    connectedCallback() {
        super.connectedCallback();
    }
    template() {
        return `<slot></slot>`;
    }
    /**
     * Set the align content setting
     * @param {string} value The value
     */
    set alignContent(value) {
        if (value && FLEX_OPTIONS.alignContent.includes(value)) {
            this.setAttribute(attributes.ALIGN_CONTENT, value);
        }
        else {
            this.removeAttribute(attributes.ALIGN_CONTENT);
        }
    }
    get alignContent() { return this.getAttribute(attributes.ALIGN_CONTENT); }
    /**
     * Set the align items setting
     * @param {string} value The value
     */
    set alignItems(value) {
        if (value && FLEX_OPTIONS.alignItems.includes(value)) {
            this.setAttribute(attributes.ALIGN_ITEMS, value);
        }
        else {
            this.removeAttribute(attributes.ALIGN_ITEMS);
        }
    }
    get alignItems() { return this.getAttribute(attributes.ALIGN_ITEMS); }
    /**
     * Set the direction setting
     * @param {string} value The value
     */
    set direction(value) {
        if (value && FLEX_OPTIONS.direction.includes(value)) {
            this.setAttribute(attributes.DIRECTION, value);
        }
        else {
            this.removeAttribute(attributes.DIRECTION);
        }
    }
    get direction() { return this.getAttribute(attributes.DIRECTION); }
    /**
     * Set the display setting
     * @param {string} value The value
     */
    set display(value) {
        if (value && FLEX_OPTIONS.display.includes(value)) {
            this.setAttribute(attributes.DISPLAY, value);
        }
        else {
            this.removeAttribute(attributes.DISPLAY);
        }
    }
    get display() { return this.getAttribute(attributes.DISPLAY); }
    /**
     * Set the gap, apply same for both horizontal and vertical sides
     * @param {number|string} value The value
     */
    set gap(value) {
        const val = stringToNumber(value);
        if (!Number.isNaN(val) && FLEX_OPTIONS.units.includes(val)) {
            this.setAttribute(attributes.GAP, String(val));
        }
        else {
            this.removeAttribute(attributes.GAP);
        }
    }
    get gap() { return this.getAttribute(attributes.GAP); }
    /**
     * Set the horizontal gap
     * @param {number|string} value The value
     */
    set gapX(value) {
        const val = stringToNumber(value);
        if (!Number.isNaN(val) && FLEX_OPTIONS.units.includes(val)) {
            this.setAttribute(attributes.GAP_X, String(val));
        }
        else {
            this.removeAttribute(attributes.GAP_X);
        }
    }
    get gapX() { return this.getAttribute(attributes.GAP_X); }
    /**
     * Set card vertical gap
     * @param {number|string} value The value
     */
    set gapY(value) {
        const val = stringToNumber(value);
        if (!Number.isNaN(val) && FLEX_OPTIONS.units.includes(val)) {
            this.setAttribute(attributes.GAP_Y, String(val));
        }
        else {
            this.removeAttribute(attributes.GAP_Y);
        }
    }
    get gapY() { return this.getAttribute(attributes.GAP_Y); }
    /**
     * Set the justify content setting
     * @param {string} value The value
     */
    set justifyContent(value) {
        if (value && FLEX_OPTIONS.justifyContent.includes(value)) {
            this.setAttribute(attributes.JUSTIFY_CONTENT, value);
        }
        else {
            this.removeAttribute(attributes.JUSTIFY_CONTENT);
        }
    }
    get justifyContent() { return this.getAttribute(attributes.JUSTIFY_CONTENT); }
    /**
     * Set the wrap setting
     * @param {string} value The value
     */
    set wrap(value) {
        if (value && FLEX_OPTIONS.wrap.includes(value)) {
            this.setAttribute(attributes.WRAP, value);
        }
        else {
            this.removeAttribute(attributes.WRAP);
        }
    }
    get wrap() { return this.getAttribute(attributes.WRAP); }
};
IdsLayoutFlex = __decorate([
    customElement('ids-layout-flex'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsLayoutFlex);
export default IdsLayoutFlex;
//# sourceMappingURL=ids-layout-flex.js.map