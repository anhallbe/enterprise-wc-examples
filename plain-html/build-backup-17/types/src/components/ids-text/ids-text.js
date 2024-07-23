var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import fontSizes from 'ids-identity/dist/theme-new/tokens/web/ui.config.font-sizes';
import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';
import Base from './ids-text-base';
import styles from './ids-text.scss';
const fontWeightClasses = ['bold', 'lighter'];
// These types will have a CSS style class appended to them
const typesCssClasses = ['label', 'legend', 'span'];
// Text alignments
const TEXT_ALIGNMENTS = ['start', 'end', 'center', 'justify'];
// Statuses
const STATUSES = ['base', 'error', 'info', 'success', 'warning'];
/**
 * IDS Text Component
 * @type {IdsText}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @mixes IdsTooltipMixin
 * @mixes IdsLocaleMixin
 * @part text - the text element
 */
let IdsText = class IdsText extends Base {
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback();
        this.#attachEventHandlers();
    }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            ...super.attributes,
            attributes.AUDIBLE,
            attributes.COLOR,
            attributes.DATA,
            attributes.DISABLED,
            attributes.DISPLAY,
            attributes.ERROR,
            attributes.FONT_SIZE,
            attributes.FONT_WEIGHT,
            attributes.LABEL,
            attributes.MODE,
            attributes.OVERFLOW,
            attributes.STATUS,
            attributes.TEXT_ALIGN,
            attributes.TRANSLATE_TEXT,
            attributes.TYPE,
        ];
    }
    /**
     * Inner template contents
     * @returns {string} The template
     */
    template() {
        const tag = this.type || 'span';
        let classList = 'ids-text';
        classList += this.status ? ` ${this.statusClass()}` : '';
        classList += this.textAlign ? ` ${this.textAlignClass()}` : '';
        classList += this.color === 'unset' ? ' ids-text-color-unset' : '';
        classList += (this.overflow === 'ellipsis') ? ' ellipsis' : '';
        classList += (this.audible) ? ' audible' : '';
        classList += (this.label) ? ' label' : '';
        classList += this.fontSize ? ` ids-text-${this.fontSize}` : '';
        classList += (this.fontWeight === 'bold' || this.fontWeight === 'lighter')
            ? ` ${this.fontWeight}` : '';
        const color = this.color;
        const style = typeof color === 'string' && color !== 'unset' && color !== ''
            ? ` style="color: var(--ids-color-palette-${this.color})"` : '';
        return `<${tag}
      ${style}
      class="${classList}"
      mode="${this.mode}"
      part="text"
    ><slot></slot>
    </${tag}>`;
    }
    /**
     * Inherited from `IdsColorVariantMixin`
     * @returns {Array<string>} List of available color variants for this component
     */
    colorVariants = ['alternate'];
    /**
     * Handle internal events
     * @private
     */
    #attachEventHandlers() {
        if (this.translateText) {
            this.offEvent('languagechange.text-container');
            this.onEvent('languagechange.text-container', getClosest(this, 'ids-container'), () => {
                this.#translateAsync();
            });
        }
    }
    /**
     * Set the font size of the text with a class.
     * @param {string | null} value The font size in the font scheme
     * i.e. 10, 12, 16 ect increasing by increments of 4
     */
    set fontSize(value) {
        if (value) {
            this.setAttribute(attributes.FONT_SIZE, value);
        }
        else {
            this.removeAttribute(attributes.FONT_SIZE);
        }
        if (this.container) {
            fontSizes?.forEach((size) => {
                this.container?.classList.remove(`ids-text-${Object.keys(size)}`);
            });
            if (value) {
                this.container.classList.add(`ids-text-${value}`);
            }
        }
    }
    get fontSize() { return this.getAttribute(attributes.FONT_SIZE); }
    /**
     * Adjust font weight; can be either "bold" or "lighter"
     * @param {string | null} value (if bold)
     */
    set fontWeight(value) {
        this.container?.classList.remove(...fontWeightClasses);
        if (value && fontWeightClasses.includes(value)) {
            this.setAttribute(attributes.FONT_WEIGHT, value);
            this.container?.classList.add(value);
        }
        else {
            this.removeAttribute(attributes.FONT_WEIGHT);
        }
    }
    get fontWeight() {
        return this.getAttribute(attributes.FONT_WEIGHT);
    }
    /**
     * Set the type of element it is (h1-h6, span (default))
     * @param {string | null} value  The type of element
     */
    set type(value) {
        if (value) {
            this.setAttribute(attributes.TYPE, value);
        }
        else {
            this.removeAttribute(attributes.TYPE);
        }
        this.render();
        this.#setTypeClass(value ?? '');
    }
    get type() { return this.getAttribute(attributes.TYPE); }
    /**
     * Sets a CSS Class on the container element for some Text types
     * @param {string} value the class type to check/add
     * @returns {void}
     */
    #setTypeClass(value) {
        this.container?.classList.remove(...typesCssClasses);
        if (typesCssClasses.includes(value)) {
            this.container?.classList.add(value);
        }
    }
    /**
     * If set to "unset", color can be controlled by parent container
     * @param {string | null} value  "unset" or undefined/null
     */
    set color(value) {
        const unsetClass = 'ids-text-color-unset';
        this.container?.classList.remove(unsetClass);
        if (typeof value === 'string' && value !== '') {
            this.setAttribute(attributes.COLOR, value);
            if (value === 'unset') {
                this.container?.classList.add(unsetClass);
                this.container?.style.removeProperty('color');
            }
            else
                this.container?.style.setProperty('color', `var(--ids-color-palette-${value})`);
            return;
        }
        this.removeAttribute(attributes.COLOR);
    }
    get color() {
        return this.getAttribute(attributes.COLOR);
    }
    /**
     * Set audible as screen reader only text
     * @param {boolean | string} value The audible value
     */
    set audible(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.AUDIBLE, value.toString());
            if (this.container && !this.container.classList.contains(attributes.AUDIBLE)) {
                this.container.classList.add('audible');
            }
        }
        else {
            this.removeAttribute(attributes.AUDIBLE);
            this.container?.classList.remove('audible');
        }
    }
    get audible() { return stringToBool(this.getAttribute(attributes.AUDIBLE)); }
    /**
     * Set the text to disabled color.
     * @param {boolean} value True if disabled
     */
    set disabled(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.DISABLED, value.toString());
            return;
        }
        this.removeAttribute(attributes.DISABLED);
    }
    get disabled() { return stringToBool(this.getAttribute(attributes.DISABLED)); }
    /**
     * Set the text to error color.
     * @param {boolean} value True if error text
     */
    set error(value) {
        const val = stringToBool(value);
        if (val) {
            if (this.container)
                this.container.classList.add('error');
            this.setAttribute(attributes.ERROR, val.toString());
            return;
        }
        this.removeAttribute(attributes.ERROR);
        if (this.container)
            this.container.classList.remove('error');
    }
    get error() { return stringToBool(this.getAttribute(attributes.ERROR)); }
    /**
     * Set the text to label color.
     * @param {boolean} value True if label text
     */
    set label(value) {
        const val = stringToBool(value);
        if (val) {
            this.setAttribute(attributes.LABEL, val.toString());
            this.container?.classList.add('label');
            return;
        }
        this.removeAttribute(attributes.LABEL);
        if (this.container)
            this.container.classList.remove('label');
    }
    get label() { return stringToBool(this.getAttribute(attributes.LABEL)); }
    /**
     * Set the text to data color.
     * @param {boolean|string} value True if data text
     */
    set data(value) {
        const val = stringToBool(value);
        if (val) {
            this.container?.classList.add('data');
            this.setAttribute(attributes.DATA, val.toString());
            return;
        }
        this.removeAttribute(attributes.DATA);
        this.container?.classList.remove('data');
    }
    get data() { return stringToBool(this.getAttribute(attributes.DATA)); }
    /**
     * Set how content overflows; can specify 'ellipsis', or undefined or 'none'
     * @param {string | null} [value=null] how content is overflow
     */
    set overflow(value) {
        const isEllipsis = value === 'ellipsis';
        if (isEllipsis) {
            this.container?.classList.add('ellipsis');
            this.setAttribute('overflow', 'ellipsis');
        }
        else {
            this.container?.classList.remove('ellipsis');
            this.removeAttribute('overflow');
        }
    }
    get overflow() {
        return this.getAttribute('overflow');
    }
    /**
     * Set the given text align
     * @param {string} value The value
     */
    set textAlign(value) {
        this.container?.classList.remove(...this.textAlignClass(true));
        if (TEXT_ALIGNMENTS.includes(value)) {
            this.setAttribute(attributes.TEXT_ALIGN, value);
            this.container?.classList.add(this.textAlignClass());
        }
        else {
            this.removeAttribute(attributes.TEXT_ALIGN);
        }
    }
    get textAlign() {
        return this.getAttribute(attributes.TEXT_ALIGN) ?? '';
    }
    /**
     * Get text-align class name/s with prefixed value
     * @param {boolean|undefined} isAll If true, will return all classes as array
     * @returns {string|Array<string>} The class name with prefix
     */
    textAlignClass(isAll) {
        const prefixed = (v) => `text-align-${v}`;
        return isAll ? TEXT_ALIGNMENTS.map((v) => prefixed(v)) : prefixed(this.textAlign);
    }
    /**
     * Set the given status
     * @param {string} value The value
     */
    set status(value) {
        this.container?.classList.remove(...this.statusClass(true));
        if (STATUSES.includes(value ?? '')) {
            this.setAttribute(attributes.STATUS, value ?? '');
            this.container?.classList.add(this.statusClass());
        }
        else {
            this.removeAttribute(attributes.STATUS);
        }
    }
    get status() {
        return this.getAttribute(attributes.STATUS);
    }
    /**
     * Get status class name/s with prefixed value
     * @param {boolean|undefined} isAll If true, will return all classes as array
     * @returns {string|Array<string>} The class name with prefix
     */
    statusClass(isAll) {
        const prefixed = (v) => `status-${v}`;
        return isAll ? STATUSES.map((v) => prefixed(v)) : prefixed(this.status ?? '');
    }
    /**
     * If set to true the value in the text will be considered a key and
     * sent to the translation function
     * @param {boolean} value If true translate this value
     */
    set translateText(value) {
        const val = stringToBool(value);
        if (val && !this.getAttribute('translation-key')) {
            this.setAttribute(attributes.TRANSLATE_TEXT, val.toString());
            this.setAttribute('translation-key', this.textContent ?? '');
            this.#translateAsync();
        }
    }
    get translateText() {
        return stringToBool(this.getAttribute(attributes.TRANSLATE_TEXT));
    }
    /**
     * Translate the contents asyncronously
     * @private
     */
    async #translateAsync() {
        const translationKey = this.getAttribute('translation-key');
        if (!this.locale || !translationKey) {
            return;
        }
        await this.locale.setLanguage(this.locale.language.name);
        this.textContent = this.locale.translate(translationKey);
    }
};
IdsText = __decorate([
    customElement('ids-text'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsText);
export default IdsText;
//# sourceMappingURL=ids-text.js.map