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
import { attributes, htmlAttributes } from '../../core/ids-attributes';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';
import Base from './ids-tabs-base';
import IdsHeader from '../ids-header/ids-header';
import './ids-tab';
import './ids-tab-more';
import './ids-tab-divider';
import styles from './ids-tabs.scss';
/**
 * IDS Tabs Component
 * @type {IdsTabs}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsOrientationMixin
 * @mixes IdsThemeMixin
 */
let IdsTabs = class IdsTabs extends Base {
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback();
        this.setAttribute(htmlAttributes.ROLE, 'tablist');
        this.#connectMoreTabs();
        this.#detectParentColorVariant();
        this.#attachEventHandlers();
        this.#ro.observe(this.container);
        const selected = this.querySelector('[selected]') || this.querySelector('[value]');
        this.#selectTab(selected);
        this.#attachAfterRenderEvents();
    }
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.#ro.disconnect();
    }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            ...super.attributes,
            attributes.VALUE
        ];
    }
    /**
     * @returns {string} template for Tab List
     */
    template() {
        return `<div class="ids-tabs-container">
      <div class="ids-tabs-list">
        <slot></slot>
      </div>
      <div class="ids-tabs-list-more">
        <slot name="fixed"></slot>
      </div>
    </div>`;
    }
    /**
     * Watches for changes to the Tab List size and recalculates overflowed tabs, if applicable
     * @private
     * @property {ResizeObserver} ro this Popup component's resize observer
     */
    #ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
            if (entry.target.classList.contains('ids-tabs-container')) {
                this.#resize();
            }
        }
    });
    /**
     * Runs whenever the Tab List's size is altered
     */
    #resize() {
        this.#refreshOverflowedTabs();
    }
    /**
     * Inherited from `IdsColorVariantMixin`
     * @returns {Array<string>} List of available color variants for this component
     */
    colorVariants = ['alternate', 'module'];
    /**
     * @property {string} value stores a tab's value (used for syncing tab state with displayed content)
     */
    #value = '';
    /**
     * @param {string} value A value which represents a currently selected tab
     */
    set value(value) {
        const currentValue = this.#value;
        const isValidValue = this.hasTab(value);
        if (isValidValue && currentValue !== value) {
            this.#value = value;
            this.setAttribute(attributes.VALUE, value);
            this.#selectTab(this.querySelector(`ids-tab[value="${value}"]`));
            this.triggerEvent('change', this, {
                bubbles: false,
                detail: { elem: this, value }
            });
        }
        else {
            this.setAttribute(attributes.VALUE, this.value);
        }
    }
    /**
     * @returns {string} The value representing a currently selected tab
     */
    get value() {
        return this.#value;
    }
    /**
     * @returns {HTMLElement} Tab List container element reference from the shadow root
     */
    get tabListContainer() {
        return this.container?.querySelector('.ids-tabs-list');
    }
    /**
     * @returns {HTMLElement} More Container
     */
    get moreContainer() {
        return this.container?.querySelector('.ids-tabs-list-more');
    }
    /**
     * @returns {Array<HTMLElement>} tabs that are connected to this component's Main slot
     */
    get tabListElements() {
        const mainSlot = this.container?.querySelector('slot:not([name])');
        return mainSlot?.assignedElements();
    }
    get lastTab() {
        return [...this.querySelectorAll('ids-tab')].pop();
    }
    /**
     * @readonly
     * @returns {any} [IdsTab | null] The last possible tab with a usable value in the list
     */
    get lastNavigableTab() {
        return [...this.querySelectorAll('ids-tab[value]:not([actionable]):not([disabled]):not([overflowed])')].pop();
    }
    /**
     * Reference to the currently-selected tab, if applicable
     * @param {string} value the tab value to scan
     * @returns {boolean} true if this tab list contains a tab with the provided value
     */
    hasTab(value) {
        return this.querySelector(`ids-tab[value="${value}"]`) !== null;
    }
    /**
     * Traverses parent nodes and scans for parent IdsHeader components.
     * If an IdsHeader is found, adjusts this component's ColorVariant accordingly.
     * @returns {void}
     */
    #detectParentColorVariant() {
        let isHeaderDescendent = false;
        let currentElement = this.host || this.parentNode;
        while (!isHeaderDescendent && currentElement) {
            if (currentElement instanceof IdsHeader) {
                isHeaderDescendent = true;
                break;
            }
            // consider the body the ceiling of where to reach here
            if (currentElement.tagName === 'BODY') {
                break;
            }
            currentElement = currentElement.host || currentElement.parentNode;
        }
        if (isHeaderDescendent) {
            this.colorVariant = 'alternate';
        }
    }
    /**
     * When a child value or this component value changes,
     * called to rebind onclick callbacks to each child
     * @returns {void}
     */
    #attachEventHandlers() {
        // Reusable handlers
        const nextTabHandler = (e) => {
            this.nextTab(e.target.closest('ids-tab, ids-tab-more')).focus();
            if (this.tabListContainer)
                this.tabListContainer.scrollLeft = 0;
        };
        const prevTabHandler = (e) => {
            this.prevTab(e.target.closest('ids-tab, ids-tab-more')).focus();
            if (this.tabListContainer)
                this.tabListContainer.scrollLeft = 0;
        };
        // Add key listeners and consider orientation for assignments
        this.listen('ArrowLeft', this, prevTabHandler);
        this.listen('ArrowRight', this, nextTabHandler);
        this.listen('ArrowUp', this, prevTabHandler);
        this.listen('ArrowDown', this, nextTabHandler);
        // Home/End keys should navigate to beginning/end of Tab list respectively
        this.listen('Home', this, () => {
            this.children[0]?.focus();
        });
        this.listen('End', this, () => {
            this.children[this.children.length - 1]?.focus();
        });
        // Add Events/Key listeners for Tab Selection via click/keyboard
        this.listen('Enter', this, (e) => {
            const elem = e.target;
            if (elem) {
                if (elem.tagName === 'IDS-TAB') {
                    this.#selectTab(elem);
                }
                if (elem.tagName === 'IDS-TAB-MORE') {
                    if (!elem.menu.visible) {
                        elem.menu.showIfAble();
                    }
                    else {
                        elem.menu.hide();
                        elem.focus();
                    }
                }
            }
        });
        // Listen for Delete (Mac) or Backspace (PC) for removal events
        const dismissOnKeystroke = (e) => {
            const elem = e.target;
            if (elem) {
                if (elem.tagName === 'IDS-TAB') {
                    this.#dismissTab(elem);
                }
            }
        };
        this.listen('Delete', this, dismissOnKeystroke);
        this.listen('Backspace', this, dismissOnKeystroke);
        this.onEvent('tabselect', this, (e) => {
            const elem = e.target;
            if (elem && elem.tagName === 'IDS-TAB') {
                this.#selectTab(elem);
            }
        });
        this.onEvent('click.tabs', this, (e) => {
            const elem = e.target;
            if (elem) {
                if (elem.tagName === 'IDS-TAB') {
                    if (!elem.disabled) {
                        this.#selectTab(elem);
                    }
                }
                if (elem.tagName === 'IDS-TRIGGER-BUTTON') {
                    e.stopPropagation();
                    const tab = getClosest(elem, 'ids-tab');
                    this.#dismissTab(tab);
                }
            }
        });
        // Removes the tab from the list on `tabremove` events
        this.onEvent('tabremove', this, (e) => {
            e.detail.elem.remove();
        });
        // Focusing via keyboard on an IdsTab doesn't automatically fire its `focus()` method.
        // This listener applies to all tabs in the list
        this.onEvent('focusin.tabs', this, (e) => {
            const elem = e.target;
            if (elem && elem.tagName === 'IDS-TAB') {
                elem.focus();
            }
        });
    }
    /**
     * Attaches event handlers that should be applied after rendering occurs
     */
    #attachAfterRenderEvents() {
        // Refreshes the tab list on change
        this.onEvent('slotchange', this.container, () => {
            this.#connectMoreTabs();
            this.#refreshOverflowedTabs();
            this.#correctSelectedTab();
        });
    }
    /**
     * Configures any slotted `ids-tab-more` components present
     */
    #connectMoreTabs() {
        this.querySelector('ids-tab-more')?.setAttribute('slot', 'fixed');
    }
    /**
     * Navigates from a specified Tab to the next-available Tab in the list
     * @param {HTMLElement} currentTab an contained element (usually an IdsTab) to check for siblings
     * @returns {HTMLElement} the next tab in this Tab list's order
     */
    nextTab(currentTab) {
        let nextTab = currentTab.nextElementSibling;
        // If next sibling isn't a tab or is disabled, try this method again on the found sibling
        if (nextTab && (!nextTab.tagName.includes('IDS-TAB') || nextTab.tagName.includes('IDS-TAB-DIVIDER') || nextTab.disabled || nextTab.hasAttribute('overflowed'))) {
            return this.nextTab(nextTab);
        }
        // If null, reset back to the first tab (cycling behavior)
        if (!nextTab) {
            nextTab = this.children[0];
        }
        return nextTab;
    }
    /**
     * Navigates from a specified Tab to the previously-available Tab in the list
     * @param {HTMLElement} currentTab an contained element (usually an IdsTab) to check for siblings
     * @returns {HTMLElement} the previous tab in this Tab list's order
     */
    prevTab(currentTab) {
        let prevTab = currentTab.previousElementSibling;
        // If previous sibling isn't a tab or is disabled, try this method again on the found sibling
        if (prevTab && (!prevTab.tagName.includes('IDS-TAB') || prevTab.tagName.includes('IDS-TAB-DIVIDER') || prevTab.disabled || prevTab.hasAttribute('overflowed'))) {
            return this.prevTab(prevTab);
        }
        // If null, reset back to the last tab (cycling behavior)
        if (!prevTab) {
            prevTab = this.children[this.children.length - 1];
        }
        return prevTab;
    }
    /**
     * Selects a tab and syncs the entire tab list with the new selection
     * @param {any} tab the new tab to select
     * @returns {void}
     */
    #selectTab(tab) {
        if (!tab)
            return;
        if (tab.actionable) {
            if (typeof tab.onAction === 'function') {
                tab.onAction(tab.selected);
            }
            return;
        }
        if (!tab.selected) {
            const current = this.querySelector('[selected]');
            if (!current || (current && tab !== current)) {
                tab.selected = true;
                this.value = tab.value;
                if (current) {
                    current.selected = false;
                }
            }
        }
    }
    /**
     * Dismisses (removes) a Tab from the Tab List
     * @param {any} tab the new tab to select
     * @returns {void}
     */
    #dismissTab(tab) {
        if (!tab)
            return;
        tab.dismiss();
        this.#correctSelectedTab();
    }
    /**
     * Detects if a Tab no longer exists and selects an available one
     */
    #correctSelectedTab() {
        if (!this.hasTab(this.value)) {
            this.#selectTab(this.lastNavigableTab || this.lastTab);
        }
    }
    /**
     * Attempts to refresh state of the Tab List related to overflowed tabs, if applicable
     */
    #refreshOverflowedTabs() {
        const moreTab = this.querySelector('ids-tab-more');
        if (moreTab) {
            moreTab.renderOverflowedItems();
            moreTab.refreshOverflowedItems();
            this.container?.classList[!moreTab.hidden ? 'add' : 'remove']('has-more-actions');
        }
    }
    /**
     * Listen for changes to color variant, which updates each child tab.
     * @returns {void}
     */
    onColorVariantRefresh() {
        const tabs = [...this.querySelectorAll('ids-tab, ids-tab-more')];
        tabs.forEach((tab) => {
            tab.colorVariant = this.colorVariant;
        });
    }
    /**
     * Listen for changes to orientation, which updates each child tab.
     * @returns {void}
     */
    onOrientationRefresh() {
        const tabs = [...this.querySelectorAll('ids-tab, ids-tab-more')];
        tabs.forEach((tab) => {
            tab.orientation = this.orientation;
        });
        this.#resize();
    }
};
IdsTabs = __decorate([
    customElement('ids-tabs'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsTabs);
export default IdsTabs;
//# sourceMappingURL=ids-tabs.js.map