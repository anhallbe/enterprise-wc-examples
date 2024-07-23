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
import Base from './ids-hierarchy-item-base';
import styles from './ids-hierarchy-item.scss';
/**
 * IDS Hierarchy Item Component
 * @type {IdsHierarchyItem}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
let IdsHierarchyItem = class IdsHierarchyItem extends Base {
    /** store the previous "selected" value to prevent double firing events */
    #prevSelected = false;
    childElements = [];
    expander;
    dropdownMenu;
    leaf;
    nestedItemContainer;
    constructor() {
        super();
    }
    /**
     * ids-hierarchy-item `connectedCallback` implementation
     * @returns {void}
     */
    connectedCallback() {
        super.connectedCallback();
        this.expander = this.shadowRoot?.querySelector('[part="icon-btn"]');
        this.dropdownMenu = this.querySelector('[part="icon-menu"]');
        this.leaf = this.shadowRoot?.querySelector('[part="leaf"]');
        this.nestedItemContainer = this.shadowRoot?.querySelector('[part="nested-items"]');
        this.#hasNestedItems();
        this.#attachEventHandlers();
        this.#setColor();
    }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            ...super.attributes,
            attributes.COLOR,
            attributes.EXPANDED,
            attributes.ROOT_ITEM,
            attributes.SELECTED,
        ];
    }
    template() {
        return `
      <div class="ids-hierarchy-item">
        <div class="leaf" part="leaf">
          <div class="leaf-inside">
            <span class="avatar">
              <slot name="avatar"></slot>
            </span>
            <div class="details">
              <slot name="heading"></slot>
              <slot name="subheading"></slot>
              <slot name="micro"></slot>
            </div>
            <div part="actions">
              <slot name="menu"></slot>
              <ids-button part="icon-btn" id="icon-only-button-default">
                <span class="audible">Default Button</span>
                <ids-icon icon="caret-down"></ids-icon>
              </ids-button>
            </div>
          </div>
        </div>
        <div class="sub-level"><slot part="nested-items"></slot></div>
      </div>
    `;
    }
    /**
     * Set the value of the expanded attribute
     * @param {string | null} value the value of the attribute
     */
    set expanded(value) {
        const isValueTruthy = stringToBool(value);
        if (isValueTruthy) {
            this.setAttribute(attributes.EXPANDED, 'true');
        }
        else {
            this.removeAttribute?.(attributes.EXPANDED);
        }
    }
    /**
     * @returns {string | null} containing value of the expanded attribute
     */
    get expanded() {
        return this.getAttribute(attributes.EXPANDED);
    }
    /**
     * Set the value of the selected attribute
     * @param {string | boolean} value the value of the attribute
     */
    set selected(value) {
        const isValueTruthy = stringToBool(value);
        if (isValueTruthy) {
            this.setAttribute(attributes.SELECTED, 'true');
            this.setAttribute('tabindex', '0');
            if (!this.#prevSelected) {
                this.triggerEvent('itemselect', this, { bubbles: true });
            }
        }
        else {
            this.removeAttribute(attributes.SELECTED);
            this.setAttribute('tabindex', '-1');
        }
        this.#prevSelected = isValueTruthy;
    }
    /**
     * @returns {string | boolean} containing value of the selected attribute
     */
    get selected() {
        return this.hasAttribute(attributes.SELECTED);
    }
    /**
     * Set the value of the root attribute
     * @param {string | null} value the value of the attribute
     */
    set rootItem(value) {
        const isValueTruthy = stringToBool(value);
        if (isValueTruthy) {
            this.setAttribute(attributes.ROOT_ITEM, 'true');
        }
        else {
            this.removeAttribute(attributes.ROOT_ITEM);
        }
    }
    /**
     * @returns {string | null} containing value of the root attribute
     */
    get rootItem() {
        return this.getAttribute(attributes.ROOT_ITEM);
    }
    get color() {
        return this.getAttribute(attributes.COLOR);
    }
    /**
     * Set the color of the bar
     * @param {string} value The color value, this can be a hex code with the #
     */
    set color(value) {
        this.setAttribute(attributes.COLOR, String(value));
        this.#setColor();
    }
    #setColor() {
        let color = this.color;
        if (this.color?.substring(0, 1) !== '#') {
            color = `var(--ids-color-palette-${this.color})`;
        }
        const item = this.container?.querySelector('.leaf-inside');
        const avatar = this.container?.querySelector('.avatar');
        item?.style.setProperty('border-left-color', color);
        avatar?.style.setProperty('border-color', color);
    }
    /**
     * An async function that fires as the dropdown is opening allowing you to set contents.
     * @param {Function} func The async function
     */
    set loadChildren(func) {
        this.state.loadChildren = func;
    }
    get loadChildren() { return this.state.loadChildren; }
    /**
     * An async function that fires as the dropdown is opening allowing you to set contents.
     * @param {Array} value The async function
     */
    set hasChildren(value) {
        this.state.hasChildren = value;
        if (value) {
            this.container?.classList.add('has-nested-items');
        }
    }
    get hasChildren() { return this.state.hasChildren; }
    /**
     * Sets the value of the expanded attribute
     * @private
     * @param {string} expanded the value of the expanded attribute.
     * @returns {void}
     */
    #expandCollapse(expanded) {
        if (expanded) {
            this.setAttribute(attributes.EXPANDED, 'false');
        }
        else {
            this.setAttribute(attributes.EXPANDED, 'true');
        }
    }
    /**
     * Check for nested items and assign css class
     * @private
     * @returns {void}
     */
    #hasNestedItems() {
        const nestedItems = this.container?.querySelector('[part="nested-items"]');
        const hasNestedItems = !!nestedItems?.assignedElements().length;
        if (hasNestedItems) {
            this.container?.classList.add('has-nested-items');
        }
    }
    adjustZIndex(node, zIndex) {
        if (node.name === 'ids-hierarchy-item') {
            const elem = node.shadowRoot?.querySelector('.leaf');
            elem.style.zIndex = zIndex.toString();
        }
        const siblingNodes = node.childNodes;
        for (const subNode of siblingNodes) {
            if (subNode.name === 'ids-hierarchy-item') {
                this.adjustZIndex(subNode, zIndex - 2);
            }
        }
    }
    /**
     * Sets up event listeners
     * @private
     * @returns {void}
     */
    #attachEventHandlers() {
        this.onEvent('click', this.expander, async () => {
            if (this.loadChildren) {
                if (!this.expanded && !this.childElements.attached) {
                    const data = await this.loadChildren();
                    this.childElements = data.filter((d) => d.parentItem === this.getAttribute(attributes.ID));
                    if (!this.childElements.length) {
                        this.container?.classList.remove('has-nested-items');
                    }
                    const templateStr = this.childElements.reduce((prev, cur) => `${prev}
            <ids-hierarchy-item id="${cur.id}" color="${cur.color}">
              ${cur.picture ? `<img id="headshot" alt="${cur.id}" src="${cur.picture}" slot="avatar" />` : ''}
              <ids-text slot="heading">${cur.name}</ids-text>
              <ids-text slot="subheading">${cur.position}</ids-text>
              <ids-text slot="micro">${cur.employmentType}</ids-text>
            </ids-hierarchy-item>
          `, '');
                    this.innerHTML += templateStr;
                    this.childElements.attached = true;
                    const childElementItems = this.querySelectorAll('ids-hierarchy-item');
                    for (const item of childElementItems) {
                        item.hasChildren = data
                            .filter((d) => d.parentItem === item.getAttribute(attributes.ID))
                            .length > 0;
                        item.loadChildren = this.loadChildren;
                    }
                }
            }
            this.#expandCollapse(this.expanded);
        });
        if (this.dropdownMenu) {
            this.onEvent('click', this.dropdownMenu, () => {
                this.adjustZIndex(this.parentNode, 202);
                const leafElement = this.shadowRoot?.querySelector('.leaf');
                leafElement?.style.setProperty('z-index', '201');
            });
        }
        this.onEvent('touchend', this.expander, (e) => {
            if (e.touches && e.touches.length > 0) {
                this.#expandCollapse(this.expanded);
            }
        }, {
            passive: true
        });
        this.onEvent('click', this.leaf, () => {
            this.setAttribute(attributes.SELECTED, 'true');
        });
        this.onEvent('touchstart', this.leaf, () => {
            this.setAttribute(attributes.SELECTED, 'true');
        }, { passive: true });
    }
};
IdsHierarchyItem = __decorate([
    customElement('ids-hierarchy-item'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsHierarchyItem);
export default IdsHierarchyItem;
//# sourceMappingURL=ids-hierarchy-item.js.map