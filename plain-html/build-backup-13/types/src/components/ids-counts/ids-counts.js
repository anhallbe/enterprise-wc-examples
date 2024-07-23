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
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-count-base';
import '../ids-text/ids-text';
import '../ids-hyperlink/ids-hyperlink';
import styles from './ids-counts.scss';
/**
 * IDS Counts Component
 * @type {IdsCounts}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part link - the link element
 */
let IdsCounts = class IdsCounts extends Base {
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback();
        this.#textProperties();
        if (this.color)
            this.color = this.getAttribute(attributes.COLOR);
    }
    #textProperties() {
        this.querySelectorAll('[count-value]').forEach((value) => { value.setAttribute(attributes.FONT_SIZE, this.compact ? '40' : '48'); });
        this.querySelectorAll('[count-text]').forEach((text) => { text.setAttribute(attributes.FONT_SIZE, '16'); });
    }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            attributes.COLOR,
            attributes.COMPACT,
            attributes.HREF,
            attributes.MODE
        ];
    }
    /**
     * Inner template contents
     * @returns {string} The template
     */
    template() {
        return `
      ${this.href ? `<ids-hyperlink part="link" text-decoration="none" class="ids-counts message-text" href=${this.href} mode=${this.mode}>` : `<a class="ids-counts" mode=${this.mode}>`}
      <slot></slot>
      ${this.href ? `</ids-hyperlink>` : `</a>`}
    `;
    }
    /**
     * Set the color of the counts
     * @param {string} value The color value. This can be omitted.
     * base (blue), caution, danger, success, warning, or a hex code with the "#"
     */
    set color(value) {
        if (this.href)
            this.container?.setAttribute('color', '');
        if (value) {
            const color = value[0] === '#' ? value : `var(--ids-color-status-${value})`;
            this.container?.style.setProperty('color', color);
            this.setAttribute(attributes.COLOR, value);
        }
        else {
            this.container?.style.removeProperty('color');
            this.removeAttribute(attributes.COLOR);
        }
        this.querySelectorAll('ids-text').forEach((node) => {
            node.color = 'unset';
            node.shadowRoot?.querySelector('span')?.style.setProperty('color', value);
        });
    }
    get color() { return this.getAttribute(attributes.COLOR); }
    /**
     * Set the compact attribute
     * @param {string | boolean} value true or false. Component will
     * default to regular size if this property is ommitted.
     */
    set compact(value) {
        this.setAttribute(attributes.COMPACT, stringToBool(value) ? 'true' : 'false');
    }
    get compact() {
        return stringToBool(this.getAttribute(attributes.COMPACT));
    }
    /**
     * Set the href attribute
     * @param {string} value The href link
     */
    set href(value) {
        if (value) {
            this.setAttribute(attributes.HREF, value);
        }
        else {
            this.removeAttribute(attributes.HREF);
        }
    }
    get href() { return this.getAttribute(attributes.HREF); }
};
IdsCounts = __decorate([
    customElement('ids-counts'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsCounts);
export default IdsCounts;
//# sourceMappingURL=ids-counts.js.map