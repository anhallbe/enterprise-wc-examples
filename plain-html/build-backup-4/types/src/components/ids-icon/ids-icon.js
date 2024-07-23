var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import pathImport from 'ids-identity/dist/theme-new/icons/standard/path-data.json';
import emptyPathImport from 'ids-identity/dist/theme-new/icons/empty/path-data.json';
import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { sizes } from './ids-icon-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';
import Base from './ids-icon-base';
import styles from './ids-icon.scss';
const emptyIconPathData = emptyPathImport;
const pathData = pathImport;
const customIcons = {};
/**
 * Add a custom icon
 * @param {string} name name of attribute
 * @param {string} data attribute names and values
 */
export function addIcon(name, data) {
    if (!name || !data)
        return;
    if (typeof data === 'string') {
        customIcons[name] = data;
        return;
    }
    /**
     * Builds SVG icon data
     * @param {any} node Attribute names/values of an SVG element
     * @returns {string} SVG element string
     */
    function buildSVG(node) {
        const tagName = node.shape;
        const children = node.contents;
        let contents = '';
        // Filter valid attributes and build attribute string
        const refElem = document.createElement(tagName);
        const attrs = Object.keys(node).reduce((prev, attr) => {
            const attrNameVal = (attr in refElem || attr in refElem.style) ? `${attr}="${node[attr]}"` : '';
            return prev + attrNameVal;
        }, '');
        // Recursively iterate through children nodes, if any
        if (Array.isArray(children) && children.length) {
            children.forEach((child) => { contents += buildSVG(child); });
        }
        return `<${tagName} ${attrs}>${contents}</${tagName}>`;
    }
    customIcons[name] = data.reduce((prev, curr) => (prev + buildSVG(curr)), '');
}
/**
 * IDS Icon Component
 * @type {IdsIcon}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 * @part svg
 */
let IdsIcon = class IdsIcon extends Base {
    pathData = pathData;
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
            attributes.BADGE_COLOR,
            attributes.BADGE_POSITION,
            attributes.HEIGHT,
            attributes.ICON,
            attributes.SIZE,
            attributes.VERTICAL,
            attributes.VIEWBOX,
            attributes.WIDTH
        ];
    }
    /**
     * Handle change events
     */
    #attachEventHandlers() {
        this.offEvent('languagechange.icon-container');
        this.onEvent('languagechange.icon-container', getClosest(this, 'ids-container'), () => {
            if (this.isMirrored(this.icon)) {
                this.container?.classList.add('mirrored');
            }
            else {
                this.container?.classList.remove('mirrored');
            }
        });
    }
    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        let height = '';
        let width = '';
        let viewBox = '';
        height = this.height;
        width = this.width;
        if (this.viewbox) {
            viewBox = this.viewbox;
        }
        else {
            viewBox = '0 0 18 18';
        }
        let template = `<svg part="svg" xmlns="http://www.w3.org/2000/svg"${this.isMirrored(this.icon) ? ` class="mirrored"` : ''} stroke="currentColor" fill="none" height="${height}" width="${width}" viewBox="${viewBox}" aria-hidden="true">
      ${this.iconData()}
    </svg>`;
        if (this.badgePosition && this.badgeColor) {
            template += `<span class="notification-badge ${this.badgePosition} ${this.badgeColor}"></span>`;
        }
        return template;
    }
    /**
     * Return the icon data for the svg based on the icon name
     * @returns {string} the path data
     */
    iconData() {
        const icon = this.icon;
        return emptyIconPathData[icon] || pathData[icon] || customIcons[icon] || '';
    }
    /**
     * Some icons are mirrored in RTL Mode
     * @param {string} iconName icon name to check
     * @returns {boolean} true if mirrored / rtl
     */
    isMirrored(iconName) {
        const mirroredIcons = [
            'add-grid-record',
            'add-grid-row',
            'attach',
            'bullet-list',
            'bullet-steps',
            'caret-left',
            'caret-right',
            'cart',
            'cascade',
            'change-font',
            'chevron-left',
            'chevron-right',
            'clear-screen',
            'clockwise-90',
            'close-cancel',
            'close-save',
            'closed-folder',
            'collapse-app-tray',
            'contacts',
            'copy-from',
            'copy-mail',
            'copy-url',
            'counter-clockwise-90',
            'create-report',
            'cut',
            'delete-grid-record',
            'delete-grid-row',
            'display',
            'document',
            'drilldown',
            'duplicate',
            'expand-app-tray',
            'export',
            'export-2',
            'export-to-pdf',
            'first-page',
            'folder',
            'get-more-rows',
            'group-selection',
            'headphones',
            'help',
            'helper-list-select',
            'history',
            'import',
            'invoice-released',
            'language',
            'last-page',
            'launch',
            'left-align',
            'left-arrow',
            'left-text-align',
            'logout',
            'new-document',
            'new-expense-report',
            'new-time-sheet',
            'new-travel-plan',
            'next-page',
            'no-attachment',
            'no-comment',
            'no-filter',
            'paste',
            'phone',
            'previous-page',
            'quick-access',
            'redo',
            'refresh',
            'refresh-current',
            'restore-user',
            'right-align',
            'right-arrow',
            'right-text-align',
            'run-quick-access',
            'save',
            'save-close',
            'save-new',
            'search-results-history',
            'send',
            'send-submit',
            'show-last-x-days',
            'special-item',
            'stacked',
            'timesheet',
            'tree-collapse',
            'tree-expand',
            'undo',
            'unsubscribe',
        ];
        if (this.locale?.isRTL() && mirroredIcons.includes(iconName)) {
            return true;
        }
        return false;
    }
    /**
     * @returns {string | null} the current color of the notification badge
     */
    get badgeColor() {
        return this.getAttribute(attributes.BADGE_COLOR);
    }
    /**
     * @param {string | null} value sets the color of the notification badge
     */
    set badgeColor(value) {
        if (value && this.getAttribute(attributes.BADGE_COLOR) !== value) {
            this.setAttribute(attributes.BADGE_COLOR, value);
            this.#updateBadge();
        }
        else if (!value) {
            this.removeAttribute(attributes.BADGE_COLOR);
            this.#updateBadge();
        }
    }
    /**
     * @returns {string | null} position of notification badge
     */
    get badgePosition() {
        return this.getAttribute(attributes.BADGE_POSITION);
    }
    /**
     * @param {string} value sets the postion of the notification badge
     */
    set badgePosition(value) {
        if (value && this.getAttribute(attributes.BADGE_POSITION) !== value) {
            this.setAttribute(attributes.BADGE_POSITION, value);
            this.#updateBadge();
        }
        else if (!value) {
            this.removeAttribute(attributes.BADGE_POSITION);
            this.#updateBadge();
        }
    }
    /**
     * Returns the height attribute
     * @returns {string} a stringified height number
     */
    get height() {
        return this.getAttribute(attributes.HEIGHT) || sizes[this.size]?.toString();
    }
    /**
     * @param {string} value allows sets a custom height value for the icon svg
     */
    set height(value) {
        if (value) {
            this.removeAttribute(attributes.SIZE);
            this.setAttribute(attributes.HEIGHT, value);
            this.container?.setAttribute('height', value);
        }
        else {
            this.removeAttribute(attributes.HEIGHT);
        }
    }
    /**
     * Return the viewbox
     * @returns {string | null} the string of viewbox numbers
     */
    get viewbox() {
        return this.getAttribute(attributes.VIEWBOX);
    }
    /**
     * @param {string | null} value set a custom viewbox for the icon svg
     */
    set viewbox(value) {
        if (value) {
            this.setAttribute(attributes.VIEWBOX, value);
            this.#adjustViewbox();
        }
        else {
            this.removeAttribute(attributes.VIEWBOX);
        }
    }
    /**
     * Return the width number
     * @returns {string} the stringified width number
     */
    get width() {
        return this.getAttribute(attributes.WIDTH) || sizes[this.size]?.toString();
    }
    /**
     * @param {string} value sets a custom width for the icon svg
     */
    set width(value) {
        if (value) {
            this.removeAttribute(attributes.SIZE);
            this.setAttribute(attributes.WIDTH, value);
            this.container?.setAttribute('width', value);
        }
        else {
            this.removeAttribute(attributes.WIDTH);
        }
    }
    /**
     * Return the icon name
     * @returns {string} the icon
     */
    get icon() {
        return this.getAttribute(attributes.ICON) || '';
    }
    /**
     * Sets the icon svg path to render
     * @param {string | null} value The value must be a valid key in the path-data.json
     */
    set icon(value) {
        const svgElem = this.shadowRoot?.querySelector('svg');
        const isPathData = pathData.hasOwnProperty(value ?? '');
        const isEmptyPathData = emptyIconPathData.hasOwnProperty(value ?? '');
        const isCustomPathData = customIcons.hasOwnProperty(value ?? '');
        if (value && (isPathData || isEmptyPathData || isCustomPathData)) {
            this.setAttribute(attributes.ICON, value);
            if (svgElem) {
                svgElem.style.display = '';
                svgElem.innerHTML = this.iconData();
            }
        }
        else {
            this.removeAttribute(attributes.ICON);
            if (svgElem)
                svgElem.style.display = 'none';
        }
    }
    /**
     * Return the size. May be large, normal/medium or small
     * @returns {string} the size
     */
    get size() {
        return this.getAttribute(attributes.SIZE) || 'normal';
    }
    set size(value) {
        if (value && sizes[value]) {
            const size = sizes[this.size];
            this.setAttribute(attributes.SIZE, value);
            this.container?.setAttribute('height', String(size));
            this.container?.setAttribute('width', String(size));
        }
        else {
            this.removeAttribute(attributes.SIZE);
        }
        this.#adjustViewbox();
    }
    /**
     * Some specific icon types have different `viewBox`
     * properties that need adjusting at the component level
     * @returns {void}
     */
    #adjustViewbox() {
        let viewboxSize = '0 0 18 18';
        if (this.viewbox) {
            viewboxSize = this.viewbox;
        }
        this.container?.setAttribute('viewBox', viewboxSize);
    }
    /** @returns {boolean} Whether or not the icon is vertical */
    get vertical() {
        return this.hasAttribute(attributes.VERTICAL);
    }
    /** @param {boolean | null} value Rotate the icon to vertical */
    set vertical(value) {
        if (stringToBool(value)) {
            this.setAttribute(attributes.VERTICAL, '');
            this.container?.classList.add('vertical');
        }
        else {
            this.removeAttribute(attributes.VERTICAL);
            this.container?.classList.remove('vertical');
        }
    }
    #updateBadge() {
        let badge = this.shadowRoot?.querySelector('span');
        if (!badge && this.shadowRoot) {
            this.shadowRoot.innerHTML = this.template();
            badge = this.shadowRoot.querySelector('span');
        }
        if ((!this.badgeColor || !this.badgePosition) && badge) {
            this.className = '';
        }
        else if (badge) {
            badge.className = '';
            badge.classList.add(`notification-badge`, `${this.badgePosition}`, `${this.badgeColor}`);
        }
    }
};
IdsIcon = __decorate([
    customElement('ids-icon'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsIcon);
export default IdsIcon;
//# sourceMappingURL=ids-icon.js.map