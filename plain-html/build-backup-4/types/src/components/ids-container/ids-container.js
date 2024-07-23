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
import Base from './ids-container-base';
import locale from '../ids-locale/ids-locale-global';
import styles from './ids-container.scss';
/**
 * IDS Container Component
 * @type {IdsContainer}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @part container - the entire container element
 */
let IdsContainer = class IdsContainer extends Base {
    constructor() {
        super();
        this.state.locale = locale;
    }
    /**
     * Invoked each time the custom element is appended into a document-connected element.
     */
    connectedCallback() {
        super.connectedCallback();
        if (this.reset) {
            this.#addReset();
        }
        // Set initial lang and locale
        this.setAttribute('language', this.state.locale.state.language);
        this.setAttribute('locale', this.state.locale.state.localeName);
        // Remove hidden for FOUC
        this.onEvent('load.container', window, () => {
            this.removeAttribute('hidden');
            this.offEvent('load.container', window);
        });
        // In some cases the page may be loaded
        if (document.readyState === 'complete') {
            this.removeAttribute('hidden');
        }
        this.container?.style.setProperty('padding', `${this.padding}px`);
    }
    disconnectedCallback() {
        this.state.locale.removeLangAttribute();
        super.disconnectedCallback();
    }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            ...super.attributes,
            attributes.LANGUAGE,
            attributes.LOCALE,
            attributes.PADDING,
            attributes.RESET,
            attributes.SCROLLABLE,
            attributes.MODE
        ];
    }
    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        return `<div class="ids-container" part="container"${this.scrollable === 'true' ? ' tabindex="0"' : ''}><slot></slot></div>`;
    }
    /**
     * Inherited from `IdsColorVariantMixin`
     * @returns {Array<string>} List of available color variants for this component
     */
    colorVariants = ['alternate'];
    /**
     * If set to number the container will have padding added (in pixels)
     * @param {string} value sets the padding to the container
     */
    set padding(value) {
        if (this.container)
            this.container.style.padding = `${value}px`;
        this.setAttribute(attributes.PADDING, value.toString());
    }
    get padding() {
        return this.getAttribute(attributes.PADDING);
    }
    /**
     * If set to true the container is scrollable
     * @param {boolean|string} value true of false depending if the tag is scrollable
     */
    set scrollable(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.SCROLLABLE, 'true');
            this.container?.setAttribute(attributes.SCROLLABLE, 'true');
            this.container?.setAttribute('tabindex', '0');
            return;
        }
        this.setAttribute(attributes.SCROLLABLE, 'false');
        this.container?.setAttribute(attributes.SCROLLABLE, 'false');
        this.container?.removeAttribute('tabindex');
    }
    get scrollable() { return this.getAttribute(attributes.SCROLLABLE) || 'true'; }
    /**
     * Add the reset to the body
     * @private
     */
    #addReset() {
        document.querySelector('body')?.style.setProperty('margin', '0');
    }
    /**
     * If set to true body element will get reset
     * @param {boolean|string} value true of false
     */
    set reset(value) {
        if (stringToBool(value)) {
            this.#addReset();
            return;
        }
        this.removeAttribute(attributes.RESET);
        document.querySelector('body')?.style.setProperty('margin', '');
    }
    get reset() { return this.getAttribute(attributes.RESET) || 'true'; }
    /**
     * Set the language for a component and wait for it to finish (async)
     * @param {string} value The language string value
     */
    async setLanguage(value) {
        await this.state.locale.setLanguage(value);
        this.language = value;
        this.triggerEvent('languagechange', this, { detail: { elem: this, language: this.language, locale: this.state?.locale } });
    }
    /**
     * Set the language for a component
     * @param {string} value The language string value
     */
    set language(value) {
        if (value) {
            this.state.locale.setLanguage(value);
            this.state.locale.updateLangTag(this, value);
            this.setAttribute('language', value);
            requestAnimationFrame(() => {
                this.triggerEvent('languagechange', this, { detail: { elem: this, language: this.language, locale: this.state?.locale } });
            });
        }
    }
    /**
     * Get the language data keys and message for the current language
     * @returns {object} The language data object
     */
    get language() {
        return this.state?.locale?.language;
    }
    /**
     * Set the locale for a component and wait for it to finish (async)
     * @param {string} value The locale string value
     */
    async setLocale(value) {
        if (value) {
            await this.state.locale.setLocale(value);
            const lang = this.state.locale.correctLanguage(value);
            this.setAttribute('locale', value);
            this.setAttribute('language', lang);
            this.state.locale.updateLangTag(this, lang);
            this.triggerEvent('localechange', this, { detail: { elem: this, language: this.language, locale: this.state?.locale } });
        }
    }
    /**
     * Set the locale for a component
     * @param {string} value The locale string value
     */
    set locale(value) {
        if (value) {
            this.state.locale.setLocale(value);
            const lang = this.state.locale.correctLanguage(value);
            this.setAttribute('locale', value);
            this.setAttribute('language', lang);
            this.state.locale.updateLangTag(this, lang);
            requestAnimationFrame(() => {
                this.triggerEvent('localechange', this, { detail: { elem: this, language: this.language, locale: this.state?.locale } });
            });
        }
    }
    get locale() {
        return this.state.locale;
    }
    get localeName() {
        return this.state.locale.state.localeName;
    }
};
IdsContainer = __decorate([
    customElement('ids-container'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsContainer);
export default IdsContainer;
//# sourceMappingURL=ids-container.js.map