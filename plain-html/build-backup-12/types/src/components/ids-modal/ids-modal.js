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
import { breakpoints } from '../../utils/ids-breakpoint-utils/ids-breakpoint-utils';
import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-modal-base';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { waitForTransitionEnd } from '../../utils/ids-dom-utils/ids-dom-utils';
import { cssTransitionTimeout } from '../../utils/ids-timer-utils/ids-timer-utils';
import zCounter from './ids-modal-z-counter';
import '../ids-popup/ids-popup';
import '../ids-modal-button/ids-modal-button';
import IdsOverlay from './ids-overlay';
// Import Styles
import styles from './ids-modal.scss';
/**
 * IDS Modal Component
 * @type {IdsModal}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsFocusCaptureMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsPopupInteractionsMixin
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsXssMixin
 * @part popup - the popup outer element
 * @part overlay - the inner overlay element
 */
let IdsModal = class IdsModal extends Base {
    shouldUpdate = false;
    onButtonClick;
    globalKeydownListener = (e) => {
        switch (e.key) {
            case 'Escape':
                e.stopImmediatePropagation();
                this.hide();
                break;
            default:
                break;
        }
    };
    constructor() {
        super();
        if (!this.state) {
            this.state = {};
        }
        this.state.fullsize = '';
        this.state.overlay = null;
        this.state.messageTitle = null;
    }
    static get attributes() {
        return [
            ...super.attributes,
            attributes.FULLSIZE,
            attributes.MESSAGE_TITLE,
            attributes.VISIBLE
        ];
    }
    /**
     * @returns {Array<string>} Modal vetoable events
     */
    vetoableEventTypes = ['beforeshow', 'beforehide'];
    connectedCallback() {
        super.connectedCallback?.();
        if (this.popup) {
            this.popup.type = 'modal';
            this.popup.animated = true;
            this.popup.animationStyle = 'scale-in';
        }
        // Update ARIA / Sets up the label
        this.messageTitle = this.querySelector('[slot="title"]')?.textContent ?? '';
        this.setAttribute('role', 'dialog');
        this.refreshAriaLabel();
        // Update Outer Modal Parts
        this.#refreshOverlay(this.overlay);
        this.attachEventHandlers();
        this.shouldUpdate = true;
        this.#setFullsizeDefault();
        this.#setFocusIfVisible();
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.#clearBreakpointResponse();
    }
    /**
     * Inner template contents
     * @returns {string} The template
     */
    template() {
        const extraClass = this.name !== 'ids-modal' ? this.name : '';
        const extraContentClass = extraClass ? ` ${extraClass}-content` : '';
        const extraHeaderClass = extraClass ? ` ${extraClass}-header` : '';
        const extraFooterClass = extraClass ? ` ${extraClass}-footer` : '';
        const footerHidden = this.buttons.length ? '' : ' hidden';
        return `<ids-popup part="modal" class="ids-modal" type="modal" position-style="viewport">
      <div class="ids-modal-container" slot="content">
        <div class="ids-modal-header${extraHeaderClass}">
          <slot name="title"></slot>
        </div>
        <div class="ids-modal-content${extraContentClass}">
          <slot></slot>
        </div>
        <div class="ids-modal-footer${extraFooterClass}" ${footerHidden}>
          <slot name="buttons"></slot>
        </div>
      </div>
    </ids-popup>`;
    }
    /**
     * Used for ARIA Labels and other content
     * @readonly
     * @returns {string} concatenating the status and title together.
     */
    get ariaLabelContent() {
        return this.messageTitle;
    }
    /**
     * @readonly
     * @returns {NodeListOf<IdsModalButton> } currently slotted buttons
     */
    get buttons() {
        return this.querySelectorAll('[slot="buttons"]');
    }
    /**
     * @returns {IdsModalFullsizeAttributeValue} the breakpoint at which
     * the Modal will change from normal mode to fullsize mode
     */
    get fullsize() {
        return this.state.fullsize;
    }
    /**
     * @param {IdsModalFullsizeAttributeValue} val the breakpoint at which
     * the Modal will change from normal mode to fullsize mode
     */
    set fullsize(val) {
        const current = this.state.fullsize;
        const makeFullsize = (doFullsize) => {
            if (!this.popup)
                return;
            this.popup.classList[doFullsize ? 'add' : 'remove'](attributes.FULLSIZE);
            this.popup.width = doFullsize ? '100%' : '';
            this.popup.height = doFullsize ? '100%' : '';
            this.popup.place();
            if (this.popup.open) {
                this.popup.correct3dMatrix();
            }
        };
        const safeVal = `${val}`;
        if (current !== val) {
            switch (val) {
                case 'always':
                    this.#clearBreakpointResponse();
                    this.state.fullsize = 'always';
                    this.popup?.classList.add(`can-fullsize`);
                    makeFullsize(true);
                    break;
                case null:
                case 'null':
                case '':
                    this.state.fullsize = '';
                    this.#clearBreakpointResponse();
                    this.removeAttribute(attributes.FULLSIZE);
                    this.popup?.classList.remove('can-fullsize');
                    makeFullsize(false);
                    break;
                default:
                    if (Object.keys(breakpoints).includes(safeVal)) {
                        this.state.fullsize = safeVal;
                        this.setAttribute(attributes.FULLSIZE, safeVal);
                        this.popup?.classList.add(`can-fullsize`);
                        this.respondDown = safeVal;
                        this.onBreakpointDownResponse = (detectedBreakpoint, matches) => {
                            makeFullsize(matches);
                        };
                    }
                    this.respondToCurrentBreakpoint();
                    break;
            }
        }
    }
    /**
     * Removes established callbacks for responding to breakpoints, if set
     */
    #clearBreakpointResponse() {
        if (this.respondDown) {
            this.respondDown = null;
        }
        if (this.onBreakpointDownResponse) {
            this.onBreakpointDownResponse = undefined;
        }
    }
    /**
     * Runs on connectedCallback or any refresh to adjust the `fullsize` attribute, if set
     */
    #setFullsizeDefault() {
        // Default all Modals to `sm` fullsize
        if (this.hasAttribute(attributes.FULLSIZE)) {
            this.fullsize = this.getAttribute(attributes.FULLSIZE);
        }
        else {
            this.fullsize = 'sm';
        }
    }
    /**
     * @returns {HTMLElement} either an external overlay element, or none
     */
    get overlay() {
        return this.state.overlay || this.shadowRoot?.querySelector('ids-overlay');
    }
    /**
     * @param {HTMLElement | undefined} val an overlay element
     */
    set overlay(val) {
        if (val instanceof HTMLElement || val instanceof SVGElement) {
            this.state.overlay = val;
        }
        else {
            this.state.overlay = null;
        }
        this.#refreshOverlay(this.state.overlay);
    }
    /**
     * @returns {string} the content of the message's title
     */
    get messageTitle() {
        const titleEl = this.querySelector('[slot="title"]');
        return titleEl?.textContent || this.state.messageTitle;
    }
    /**
     * @param {string} val the new content to be used as the message's title
     */
    set messageTitle(val) {
        const trueVal = this.xssSanitize(val);
        const currentVal = this.state.messageTitle;
        if (currentVal !== trueVal) {
            if (typeof trueVal === 'string' && trueVal.length) {
                this.state.messageTitle = trueVal;
                this.setAttribute(attributes.MESSAGE_TITLE, trueVal);
            }
            else {
                this.state.messageTitle = '';
                this.removeAttribute(attributes.MESSAGE_TITLE);
            }
            this.#refreshModalHeader(!!trueVal);
        }
    }
    /**
     * Refreshes the state of the Modal header, either adding its slot/contents or removing it
     * @param {boolean} hasTitle true if the title should be rendered
     * @returns {void}
     */
    #refreshModalHeader(hasTitle) {
        let titleEls = [...this.querySelectorAll('[slot="title"]')];
        if (hasTitle) {
            // Search for slotted title elements.
            // If one is found, replace the contents.  Otherwise, create one.
            if (!titleEls.length) {
                this.insertAdjacentHTML('afterbegin', `<ids-text slot="title" type="h2" font-size="24">${this.state.messageTitle}</ids-text>`);
                titleEls = [this.querySelector('[slot="title"]')];
            }
        }
        this.refreshAriaLabel();
        titleEls.forEach((el, i) => {
            if (hasTitle) {
                if (i > 0) {
                    el.remove();
                    return;
                }
                el.textContent = this.state.messageTitle;
            }
            else {
                el.remove();
            }
        });
    }
    /**
     * Renders or Removes a correct `aria-label` attribute on the Modal about its contents.
     * @returns {void}
     */
    refreshAriaLabel() {
        const title = this.ariaLabelContent;
        if (title) {
            this.setAttribute('aria-label', title);
            return;
        }
        this.removeAttribute('aria-label');
    }
    /**
     * Refreshes the state of the Modal footer, hiding/showing it
     * @returns {void}
     */
    #refreshModalFooter() {
        if (!this.container)
            return;
        const footerEl = this.container.querySelector('.ids-modal-footer');
        if (this.buttons.length) {
            footerEl?.removeAttribute('hidden');
        }
        else {
            footerEl?.setAttribute('hidden', '');
        }
    }
    /**
     * @property {boolean} visible true if this Modal instance is visible.
     */
    #visible = false;
    /**
     * @returns {boolean} true if the Modal is visible.
     */
    get visible() {
        return this.#visible;
    }
    /**
     * @param {boolean|string} val true if the Modal is visible.
     */
    set visible(val) {
        const trueVal = stringToBool(val);
        if (this.#visible !== trueVal) {
            this.#visible = trueVal;
            if (trueVal) {
                this.setAttribute(attributes.VISIBLE, '');
            }
            else {
                this.removeAttribute(attributes.VISIBLE);
            }
            this.#refreshVisibility(trueVal);
        }
    }
    /**
     * Shows the modal with possibity to veto the promise
     * @returns {Promise<void> }
     */
    async show() {
        // Trigger a veto-able `beforeshow` event.
        if (!this.triggerVetoableEvent('beforeshow')) {
            return;
        }
        // Setting the value reruns this method, so exit afterward
        if (!this.visible) {
            this.visible = true;
            return;
        }
        // Check if buttons have been added/removed, and adjust the footer visibility (if applicable)
        if (this.container) {
            const footer = this.container.querySelector('.ids-modal-footer');
            if (this.buttons.length) {
                footer?.removeAttribute(attributes.HIDDEN);
            }
            else {
                footer?.setAttribute(attributes.HIDDEN, '');
            }
        }
        // Animation-in needs the Modal to appear in front (z-index), so this occurs on the next tick
        this.style.setProperty('z-index', String(zCounter.increment()));
        if (this.overlay)
            this.overlay.visible = true;
        if (this.popup) {
            this.popup.visible = true;
            if (this.popup.animated && this.popup.container) {
                await waitForTransitionEnd(this.popup.container, 'opacity');
            }
        }
        this.removeAttribute('aria-hidden');
        // Focus the correct element
        this.capturesFocus = true;
        this.setFocus('last');
        this.addOpenEvents();
        this.triggerEvent('show', this, {
            bubbles: true,
            detail: {
                elem: this
            }
        });
        if (this.popup) {
            this.popup.animated = false;
        }
        this.respondToCurrentBreakpoint();
        this.triggerEvent('aftershow', this, {
            bubbles: true,
            detail: {
                elem: this
            }
        });
    }
    /**
     * Hides the modal with possibity to veto the promise
     * @returns {Promise<void>}
     */
    async hide() {
        // Trigger a veto-able `beforehide` event.
        if (!this.triggerVetoableEvent('beforehide')) {
            return;
        }
        // Setting the value reruns this method, so exit afterward
        if (this.visible) {
            this.visible = false;
            return;
        }
        const popupElem = this.popup;
        if (popupElem)
            popupElem.animated = true;
        this.removeOpenEvents();
        this.overlay.visible = false;
        if (popupElem)
            popupElem.visible = false;
        // Animation-out can wait for the opacity transition to end before changing z-index.
        if (popupElem && popupElem.container && popupElem.animated) {
            await waitForTransitionEnd(popupElem.container, 'opacity');
        }
        this.style.zIndex = '';
        this.setAttribute('aria-hidden', 'true');
        zCounter.decrement();
        // Disable focus capture
        this.capturesFocus = false;
        this.triggerEvent('hide', this, {
            bubbles: true,
            detail: {
                elem: this
            }
        });
        this.#setTargetFocus();
        this.triggerEvent('afterhide', this, {
            bubbles: true,
            detail: {
                elem: this
            }
        });
    }
    /**
     * Overrides `addOpenEvents` from the OpenEvents mixin to add additional "Escape" key handling
     * @private
     */
    addOpenEvents() {
        super.addOpenEvents();
        // Adds a global event listener for the Keydown event on the body to capture close via Escape
        // (NOTE cannot use IdsEventsMixin here due to scoping)
        document.addEventListener('keydown', this.globalKeydownListener);
        // If a Modal Button is clicked, fire an optional callback
        if (this.container) {
            const buttonSlot = this.container.querySelector('slot[name="buttons"]');
            this.onEvent('click.buttons', buttonSlot, (e) => {
                this.handleButtonClick(e);
            });
        }
    }
    /**
     * Overrides `removeOpenEvents` from the OpenEvents mixin to remove "Escape" key handling
     * @private
     */
    removeOpenEvents() {
        super.removeOpenEvents();
        document.removeEventListener('keydown', this.globalKeydownListener);
        this.unlisten('Escape');
        this.offEvent('click.buttons');
    }
    /**
     * Refreshes the state of the overlay used behind the modal.  If a shared overlay isn't applied,
     * an internal one is generated and applied to the ShadowRoot.
     * @param {boolean} val if true, uses an external overlay
     * @returns {void}
     */
    #refreshOverlay(val) {
        if (!this.shadowRoot)
            return;
        let overlay;
        if (!val) {
            overlay = new IdsOverlay();
            this.shadowRoot.prepend(overlay);
            this.popupOpenEventsTarget = this.overlay;
        }
        else {
            overlay = this.shadowRoot.querySelector('ids-overlay');
            if (overlay)
                overlay.remove();
        }
    }
    /**
     * @param {boolean} val if true, makes the Modal visible to the user
     * @returns {void}
     */
    #refreshVisibility(val) {
        if (val) {
            this.show();
        }
        else {
            this.hide();
        }
    }
    /**
     * Focuses the defined target element, if applicable
     * @returns {void}
     */
    #setTargetFocus() {
        if (this.target) {
            this.target.focus();
        }
    }
    /**
     * @property {Function} setFocusIfVisible runs calculation-sensitive routines when the entire DOM has loaded
     */
    #setFocusIfVisible = async () => {
        this.visible = this.getAttribute('visible');
        if (this.visible) {
            this.setFocus('last');
        }
    };
    /**
     * Sets up overall events
     * @private
     */
    attachEventHandlers() {
        const titleSlot = this.container?.querySelector('slot[name="title"]');
        const buttonSlot = this.container?.querySelector('slot[name="buttons"]');
        // Stagger these one frame to prevent them from occuring
        // immediately when the component invokes
        window.requestAnimationFrame(() => {
            this.onEvent('slotchange.title', titleSlot, () => {
                const titleNodes = titleSlot?.assignedNodes();
                if (titleNodes?.length) {
                    this.messageTitle = titleNodes[0].textContent ?? '';
                }
            });
            this.onEvent('slotchange.buttonset', buttonSlot, () => {
                this.#refreshModalFooter();
            });
            if (this.visible) {
                this.addOpenEvents();
            }
        });
        // Set up all the events specifically-related to the "trigger" type
        this.refreshTriggerEvents();
    }
    /**
     * Handles when Modal Button is clicked.
     * @param {any} e the original event object
     */
    async handleButtonClick(e) {
        await cssTransitionTimeout(200);
        if (typeof this.onButtonClick === 'function') {
            this.onButtonClick(e.target);
        }
        // If this IdsModalButton has a `cancel` prop, treat
        // it as a `cancel` button and hide.
        const modalBtn = e.target.closest('ids-modal-button');
        if (modalBtn?.cancel) {
            this.hide();
        }
    }
    /**
     * Handle `onTriggerClick` from IdsPopupInteractionsMixin
     * @returns {void}
     */
    onTriggerClick() {
        this.show();
    }
    /**
     * Handle `onOutsideClick` from IdsPopupOpenEventsMixin
     * @param {MouseEvent} e the original click event
     * @returns {void}
     */
    onOutsideClick(e) {
        if (!e || !e?.target) {
            return;
        }
        this.hide();
    }
};
IdsModal = __decorate([
    customElement('ids-modal'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsModal);
export default IdsModal;
//# sourceMappingURL=ids-modal.js.map