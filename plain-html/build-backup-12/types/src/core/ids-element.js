import { camelCase } from '../utils/ids-string-utils/ids-string-utils';
import styles from './ids-element.scss';
/**
 * IDS Base Element
 */
export default class IdsElement extends HTMLElement {
    args;
    /** Component's name */
    name;
    /** State object for current states */
    state = {};
    /** Nonce used for scripts, links */
    cachedNonce = '';
    /** Component's first child element */
    container = null;
    /** Styles Flag */
    hasStyles = false;
    constructor(args) {
        super();
        this.args = args;
        if (!args?.noShadowRoot) {
            this.#addBaseName();
            this.#appendHostCss();
        }
    }
    /** Run the template when a component Is inserted */
    connectedCallback() {
        if (!this.args?.noShadowRoot)
            this.render();
    }
    /**
     * Add a base name property
     * @private
     */
    #addBaseName() {
        // Add the base name
        this.name = this.nodeName?.toLowerCase();
    }
    /**
     * Handle Setting changes of the value has changed by calling the getter
     * in the extending class.
     * @param {string} name The property name
     * @param {string} oldValue The property old value
     * @param {string} newValue The property new value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // TODO: Prevent double calls
        if (oldValue === newValue)
            return;
        /**
         * Maps global html attributes/property changes to
         * their internal component callbacks
         */
        const self = this;
        const setter = {
            id: self.onIdChange,
            hidden: self.onHiddenChange,
            title: self.onTitleChange
        }[name];
        if (typeof setter === 'function') {
            setter.call(this, newValue);
            return;
        }
        /**
         * Fixes our handling of kebab-to-camelCase conversions in some specific cases
         * where HTMLElement uses different casing internally.
         * @param {string} thisName the attribute name to check
         * @returns {string} corrected camelCase (or not) attribute name
         */
        const getAttributeName = (thisName) => {
            switch (thisName) {
                case 'tabindex':
                    return (typeof this.tabIndex === 'number') ? 'tabIndex' : 'tabindex';
                default:
                    return camelCase(thisName);
            }
        };
        this[getAttributeName(name)] = newValue;
    }
    /**
     * Release events and cleanup, if implementing disconnectedCallback
     * in a component you can just call super.
     */
    disconnectedCallback() {
        this.cssStyles = null;
        this.popupOpenEventsTarget = null;
    }
    /**
     * Handle Changes on Properties, this is part of the web component spec.
     * @type {Array}
     */
    static get observedAttributes() {
        return this.attributes;
    }
    /**
     * @returns {Array<string>} this component's observable properties
     */
    static get attributes() {
        return [];
    }
    /**
     * Render the component using the defined template.
     * @param {string} force force to (re)render the component
     * @returns {object} The object for chaining.
     */
    render(force) {
        if ((!this.template || this.shadowRoot) && !force) {
            return this;
        }
        const templateHTML = this.template();
        if (!templateHTML) {
            return this;
        }
        // Make template and shadow objects
        const template = document.createElement('template');
        if (this.shadowRoot?.innerHTML) {
            for (const el of this.shadowRoot.children) {
                if (el.nodeName !== 'STYLE') {
                    el.remove();
                }
            }
        }
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }
        // TODO: Is this the fastest way to do this but why use constructed style sheets
        // TODO: Can it be done in one shot (including the remove above)
        this.appendStyles();
        template.innerHTML = templateHTML;
        // TODO: Is insertAdjacentHTML faster than appendChild vs creating a template
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
        this.container = this.shadowRoot?.querySelector(`.${this.name}`);
        if (this.shadowRoot?.firstElementChild?.nodeName === 'STYLE' && !this.container) {
            this.container = this.shadowRoot?.firstElementChild.nextElementSibling;
        }
        if (this.shadowRoot?.firstElementChild?.nodeName !== 'STYLE' && !this.container) {
            this.container = this.shadowRoot?.firstElementChild;
        }
        return this;
    }
    /**
     * @returns {string} containing this component's HTML Template
     */
    template() {
        return '';
    }
    /**
     * @returns {string} gets the nonce from the meta tag
     */
    get nonce() {
        const documentElement = document;
        if (!documentElement.nonce) {
            const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (csp) {
                let nonce = csp.getAttribute('content').match(/'nonce-(.*?)'/g);
                nonce = nonce ? nonce[0]?.replace('\'nonce-', '').replace('\'', '') : undefined;
                documentElement.nonce = nonce;
            }
        }
        return documentElement.nonce || '0a59a005';
    }
    /**
     * Append Styles if present
     * @private
     */
    appendStyles() {
        if (this.hasStyles || this.args?.noStyles) {
            return;
        }
        const style = document.createElement('style');
        style.textContent = this.cssStyles;
        style.setAttribute('nonce', this.nonce);
        this.shadowRoot?.appendChild(style);
        this.hasStyles = true;
    }
    /**
     * Append One host css
     * @private
     */
    #appendHostCss() {
        const win = window;
        if (!win.idsStylesAdded) {
            const doc = document.head;
            const style = document.createElement('style');
            // TODO This can work without a replace
            style.textContent = styles.replace(':host {', ':root {');
            style.id = 'ids-styles';
            style.setAttribute('nonce', this.nonce);
            doc.appendChild(style);
            win.idsStylesAdded = true;
        }
    }
}
//# sourceMappingURL=ids-element.js.map