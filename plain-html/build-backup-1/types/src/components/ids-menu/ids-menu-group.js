var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Import Core
import { customElement, scss } from '../../core/ids-decorators';
import { attributes, htmlAttributes } from '../../core/ids-attributes';
// Import Base and Mixins
import Base from './ids-menu-group-base';
// Import Utils
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { MENU_GROUP_SELECT_TYPES } from './ids-menu-attributes';
// Import Styles
import styles from './ids-menu-group.scss';
import IdsMenuHeader from './ids-menu-header';
/**
 * IDS Menu Group Component
 * @type {IdsMenuGroup}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 */
let IdsMenuGroup = class IdsMenuGroup extends Base {
    constructor() {
        super();
    }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes as an array
     */
    static get attributes() {
        return [
            attributes.KEEP_OPEN,
            attributes.SELECT
        ];
    }
    template() {
        return `<div class="ids-menu-group" role="none"><slot></slot></div>`;
    }
    /**
     * @returns {void}
     */
    connectedCallback() {
        super.connectedCallback();
        this.#attachEventHandlers();
        this.setAttribute(htmlAttributes.ROLE, 'group');
        this.refresh();
    }
    /**
     * @returns {void}
     */
    #attachEventHandlers() {
        // Listen for `selected` events from child menu items.
        // Single-select groups will force deselection of other items in the group.
        this.onEvent('selected', this, (e) => {
            const item = e.target.closest('ids-menu-item');
            if (this.select === 'single') {
                this.deselectAllExcept(item);
            }
        });
    }
    /**
     * Updates some attributes after changes to the component are made.
     * @private
     * @returns {void}
     */
    refresh() {
        const header = this.header;
        if (header) {
            if (this.header?.id) {
                this.setAttribute(htmlAttributes.ARIA_LABELLED_BY, `${this.header.id}`);
                this.removeAttribute(htmlAttributes.ARIA_LABEL);
            }
            else {
                this.setAttribute(htmlAttributes.ARIA_LABEL, `${this.header?.textContent}`);
                this.removeAttribute(htmlAttributes.ARIA_LABELLED_BY);
            }
        }
        else {
            this.setAttribute(htmlAttributes.ARIA_LABEL, this.#getGeneratedLabel());
            this.removeAttribute(htmlAttributes.ARIA_LABELLED_BY);
        }
    }
    #getGeneratedLabel() {
        const str = this.locale?.translate('MenuGroup') || '';
        return str.replace('{0}', this.items.length);
    }
    /**
     * @readonly
     * @returns {HTMLElement} the `IdsMenu` or `IdsPopupMenu` parent node.
     */
    get menu() {
        return this.parentElement;
    }
    /**
     * @readonly
     * @returns {Array<IdsMenuItem>} [Array<IdsMenuItem>] all available menu items in this group
     */
    get items() {
        return [...this.children].filter((e) => e.matches('ids-menu-item'));
    }
    /**
     * Sets/Remove an alignment CSS class
     * @private
     * @returns {void}
     */
    updateIconAlignment() {
        this.items.forEach((item) => {
            // NOTE: Sometimes the group invokes before the items, making item methods inaccessible.
            // Items run this method internally on their first run.
            if (typeof item.decorateForIcon === 'function') {
                item.decorateForIcon();
            }
        });
    }
    /**
     * Gets this groups descriptive header, if one is defined.
     * @readonly
     * @returns {any} [IdsMenuHeader] containing a menu
     */
    get header() {
        const prevHeader = this.previousElementSibling;
        if (prevHeader && prevHeader instanceof IdsMenuHeader)
            return prevHeader;
        return this.querySelector('ids-menu-header');
    }
    /**
     * @returns {string|undefined} containing the type of selection this group allows
     */
    get select() {
        return this.getAttribute(attributes.SELECT);
    }
    /**
     * @param {string|undefined} val the type of selection to set this group
     */
    set select(val) {
        let trueVal = `${val}`;
        if (MENU_GROUP_SELECT_TYPES.indexOf(trueVal) === -1) {
            trueVal = MENU_GROUP_SELECT_TYPES[0];
        }
        // Sync the attribute
        switch (trueVal) {
            case 'none':
                this.removeAttribute(attributes.SELECT);
                break;
            default:
                this.setAttribute(attributes.SELECT, trueVal);
        }
        this.updateSelectability();
    }
    /**
     * @returns {boolean} true if selection of an item within this group should
     * cause the parent menu to close
     */
    get keepOpen() {
        return this.hasAttribute(attributes.KEEP_OPEN);
    }
    /**
     * @param {boolean} val true if the menu should close when an item in this group is selected
     */
    set keepOpen(val) {
        const trueVal = stringToBool(val);
        if (trueVal) {
            this.setAttribute(attributes.KEEP_OPEN, `${val}`);
        }
        else {
            this.removeAttribute(attributes.KEEP_OPEN);
        }
    }
    /**
     * Forces items in the group to re-render the checkmark/checkbox to be in-sync with
     * the group's `select` property.
     * @private
     * @returns {void}
     */
    updateSelectability() {
        this.items.forEach((item) => {
            // NOTE: Sometimes the group invokes before the items, making item methods inaccessible.
            // Items run this method internally on their first run.
            if (typeof item.detectSelectability === 'function') {
                item.detectSelectability();
            }
        });
    }
    /**
     * Causes all menu items except for those provided to become deselected.
     * @param {HTMLElement|Array<HTMLElement>} keptItems a single item or list of items
     * whose selection will be ignored.
     * @returns {void}
     */
    deselectAllExcept(keptItems) {
        const keptItemsArr = [].concat(keptItems);
        this.items.forEach((item) => {
            if (!keptItemsArr.includes(item) && item.selected) {
                item.deselect();
            }
        });
    }
};
IdsMenuGroup = __decorate([
    customElement('ids-menu-group'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsMenuGroup);
export default IdsMenuGroup;
//# sourceMappingURL=ids-menu-group.js.map