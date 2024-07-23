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
import Base from './ids-masthead-base';
import '../ids-header/ids-header';
import '../ids-toolbar/ids-toolbar';
import styles from './ids-masthead.scss';
/**
 * IDS Masthead Component
 * @type {IdsMasthead}
 * @inherits IdsHeader
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
let IdsMasthead = class IdsMasthead extends Base {
    /**
     * @private
     * @see IdsMasthead.slots()
     */
    #cachedSlots = null;
    /**
     * @private
     * @see IdsMasthead.breakpoints()
     */
    #cachedBreakpoints = null;
    constructor() {
        super();
    }
    /**
     * Get a list of element dependencies for this component
     * @returns {object} of elements
     */
    get elements() {
        return {
            logo: this.container?.querySelector('#logo-wrapper'),
            title: this.container?.querySelector('#title'),
            sections: {
                start: this.container?.querySelector('ids-toolbar-section#start'),
                center: this.container?.querySelector('ids-toolbar-section#center'),
                end: this.container?.querySelector('ids-toolbar-section#end'),
                more: this.container?.querySelector('ids-toolbar-more-actions#more'),
            },
        };
    }
    /**
     * @readonly
     * @returns {object} the user-provided slots that were nested in ids-masthead
     */
    get slots() {
        this.#cachedSlots = this.#cachedSlots || {
            start: this.querySelector('[slot="start"]'),
            center: this.querySelector('[slot="center"]'),
            end: this.querySelector('[slot="end"]'),
            more: this.querySelector('[slot="more"]'),
        };
        return this.#cachedSlots;
    }
    /**
     * @readonly
     * @returns {object} window.matchMedia output for mobile, tablet and desktop
     */
    get breakpoints() {
        this.#cachedBreakpoints = this.#cachedBreakpoints || {
            // @see https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
            mobile: window.matchMedia('(max-width: 425px)'),
            tablet: window.matchMedia('(min-width: 426px) and (max-width: 768px)'),
            desktop: window.matchMedia('(min-width: 769px)'),
        };
        return this.#cachedBreakpoints;
    }
    /**
     * @readonly
     * @returns {boolean} true if the mobile breakpoint is active
     */
    get isMobile() { return this.breakpoints.mobile.matches; }
    /**
     * @readonly
     * @returns {boolean} true if the tablet breakpoint is active
     */
    get isTablet() { return this.breakpoints.tablet.matches; }
    /**
     * @readonly
     * @returns {boolean} true if the desktop breakpoint is active
     */
    get isDesktop() { return this.breakpoints.desktop.matches; }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            ...super.attributes,
            attributes.ICON,
            attributes.TITLE,
        ];
    }
    /**
     * Sets the icon attribute
     * @param {string} value - the icon name
     * @returns {void}
     */
    set icon(value) {
        this.setAttribute(attributes.ICON, value);
        if (this.elements.logo) {
            this.elements.logo.innerHTML = this.logo();
        }
    }
    /**
     * Gets the icon attribute
     * @returns {string} value - the icon name
     */
    get icon() { return this.getAttribute(attributes.ICON) || ''; }
    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        return `
      <ids-toolbar class="ids-masthead" tabbable="true">
        <ids-toolbar-section id="start" align="start" type="fluid">
          <span id="logo-wrapper">${this.logo()}</span>
          <ids-text id="title" color-variant="alternate" font-size="14" font-weight="bold">${this.title}</ids-text>
          <slot name="start"></slot>
        </ids-toolbar-section>

        <ids-toolbar-section id="center" align="center" type="fluid">
          <slot name="center"></slot>
        </ids-toolbar-section>

        <ids-toolbar-section id="end" align="end" type="fluid">
          <slot name="end"></slot>
        </ids-toolbar-section>

        <ids-toolbar-more-actions id="more" icon="expand-app-tray" class="hidden">
          <slot name="more"></slot>
        </ids-toolbar-more-actions>
      </ids-toolbar>
    `;
    }
    /**
     * Create the HTML template for the logo
     * @returns {string} The template
     */
    logo() {
        let icon = this.icon;
        if (icon) {
            const logoIcon = `<ids-icon icon="${icon}" viewbox="0 0 32 34" width="30" height="30"></ids-icon>`;
            const otherIcon = `<ids-icon icon="${icon}"></ids-icon>`;
            icon = `
        <ids-button id="logo" class="icon-${icon}" color-variant="alternate" square="true">
          ${icon === 'logo' ? logoIcon : otherIcon}
          <ids-text audible="true">Masthead logo</ids-text>
        </ids-button>
      `;
        }
        return icon;
    }
    /**
     * Invoked each time the custom element is appended into a document-connected element.
     */
    connectedCallback() {
        super.connectedCallback();
        this.#attachEventHandlers();
        this.renderBreakpoint();
    }
    /**
     * Rearranges user's slots in masthead according to desktop, tablet and mobile viewports.
     *
     * @returns {void}
     */
    renderBreakpoint() {
        const { start, center, end } = this.slots;
        const { more } = this.elements.sections;
        if (more?.menu?.popup) {
            more.menu.popup.type = 'menu-alt';
        }
        if (this.isDesktop) {
            start?.setAttribute('slot', 'start');
            center?.setAttribute('slot', 'center');
            end?.setAttribute('slot', 'end');
            more?.classList.add('hidden');
        }
        else if (this.isTablet) {
            start?.setAttribute('slot', 'start');
            center?.setAttribute('slot', 'more');
            end?.setAttribute('slot', 'more');
            more?.classList.remove('hidden');
        }
        else if (this.isMobile) {
            start?.setAttribute('slot', 'more');
            center?.setAttribute('slot', 'more');
            end?.setAttribute('slot', 'more');
            more?.classList.remove('hidden');
        }
        this.#restyleButtons();
    }
    /**
     * Handles title attribute changes
     * @param {string} value title value
     */
    onTitleChange(value) {
        if (this.elements.title) {
            this.elements.title.innerHTML = value ?? '';
        }
    }
    /**
     * Attach desktop, mobile and table breakpoint listeners for masthead
     * @private
     * @returns {void}
     */
    #attachEventHandlers() {
        this.breakpoints.mobile.addEventListener('change', () => this.renderBreakpoint());
        this.breakpoints.tablet.addEventListener('change', () => this.renderBreakpoint());
        this.breakpoints.desktop.addEventListener('change', () => this.renderBreakpoint());
    }
    /**
     * Helper method to give nested buttons transparent backgrounds
     * @private
     * @returns {void}
     */
    #restyleButtons() {
        const { sections } = this.elements;
        const buttons = [
            sections.more?.button,
            ...this.querySelectorAll('ids-button, ids-menu-button'),
        ];
        buttons.forEach((button) => {
            if (button) {
                button.colorVariant = 'alternate';
                button.iconAlign = 'start';
                button.square = true;
                button.type = 'default';
                const buttonParentSlot = button.closest('[slot]');
                const buttonText = button.querySelector('span, ids-text');
                const hasAudible = buttonText?.classList.contains('audible');
                const hasAudibleOff = buttonText?.classList.contains('audible-off');
                if (hasAudible) {
                    if (buttonParentSlot?.slot === 'more') {
                        buttonText?.classList.remove('audible');
                        buttonText?.classList.add('audible-off');
                        buttonText?.style.setProperty('padding', '0 4px');
                    }
                }
                if (hasAudibleOff) {
                    if (buttonParentSlot?.slot !== 'more') {
                        buttonText?.classList.remove('audible-off');
                        buttonText?.classList.add('audible');
                        buttonText?.style.setProperty('padding', '');
                    }
                }
            }
        });
    }
};
IdsMasthead = __decorate([
    customElement('ids-masthead'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsMasthead);
export default IdsMasthead;
//# sourceMappingURL=ids-masthead.js.map