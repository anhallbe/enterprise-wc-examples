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
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import Base from './ids-toolbar-section-base';
import styles from './ids-toolbar-section.scss';
const TOOLBAR_SECTION_ATTRIBUTES = [
    attributes.ALIGN,
    attributes.FAVOR,
    attributes.INACTIVE,
    attributes.TOOLBAR_TYPE,
    attributes.TYPE
];
// Alignment styles that can apply to a section
const SECTION_ALIGNS = [
    'align-start',
    'align-center',
    'align-center-even',
    'align-end'
];
// Toolbar types
const TOOLBAR_TYPES = ['formatter'];
// Section types
const SECTION_TYPES = [
    'static',
    'buttonset',
    'button',
    'fluid',
    'search',
    'title',
    'more'
];
// WebComponent Tagnames that correspond to valid toolbar items
const TOOLBAR_ITEM_TAGNAMES = [
    'ids-button',
    'ids-checkbox',
    'ids-input',
    'ids-menu-button',
    'ids-radio',
    'ids-toolbar-more-actions'
];
// WebComponent Tagnames that correspond to valid text nodes
const TOOLBAR_TEXTNODE_TAGNAMES = [
    'ids-text'
];
// WebComponent Tagnames that correspond to valid ids-separator nodes
const TOOLBAR_SEPARATOR_TAGNAMES = [
    'ids-separator'
];
/**
 * Checks an element's CSS classlist for an item belonging to a group,
 * appends that item, and removes all others from the group.
 * @private
 * @param {string} targetClass the target CSS class to apply/check
 * @param {HTMLElement} targetElem the target elem on which to apply the class
 * @param {Array<string>} group the array of classes to scan for removal
 * @returns {void}
 */
function setCssClassFromGroup(targetClass, targetElem, group) {
    group.forEach((item) => {
        const cl = targetElem.classList;
        const cssClass = `${item}`;
        const thisClass = `${targetClass}`;
        if (cssClass === thisClass) {
            if (!cl.contains(cssClass)) {
                cl.add(cssClass);
            }
        }
        else {
            cl.remove(cssClass);
        }
    });
}
/**
 * IDS Toolbar Section Component
 * @type {IdsToolbarSection}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 */
let IdsToolbarSection = class IdsToolbarSection extends Base {
    constructor() {
        super();
    }
    static get attributes() {
        return [...super.attributes, ...TOOLBAR_SECTION_ATTRIBUTES];
    }
    template() {
        const align = this.hasAttribute('align') ? ` align-${this.align}` : '';
        return `
      <div class="ids-toolbar-section${align}" part="container">
        <slot></slot>
      </div>
    `;
    }
    connectedCallback() {
        super.connectedCallback();
        setCssClassFromGroup(this.type, this.container, SECTION_TYPES);
        setCssClassFromGroup(this.toolbarType ?? '', this.container, TOOLBAR_TYPES);
    }
    /**
     * @readonly
     * @returns {Array<any>} list of available items contained by the toolbar
     */
    get items() {
        return [...this.children].filter((e) => {
            const elemTagName = e.tagName.toLowerCase();
            return TOOLBAR_ITEM_TAGNAMES.includes(elemTagName);
        });
    }
    /**
     * @readonly
     * @returns {Array<any>} list of text nodes contained by the toolbar
     */
    get textElems() {
        const nodes = [...this.children].filter((e) => {
            const elemTagName = e.tagName.toLowerCase();
            return TOOLBAR_TEXTNODE_TAGNAMES.includes(elemTagName);
        });
        return nodes;
    }
    /**
     * @readonly
     * @returns {Array<any>} list of ids-separator nodes contained by the toolbar
     */
    get separators() {
        const nodes = [...this.children].filter((e) => {
            const elemTagName = e.tagName.toLowerCase();
            return TOOLBAR_SEPARATOR_TAGNAMES.includes(elemTagName);
        });
        return nodes;
    }
    /**
     * @readonly
     * @returns {HTMLElement} a reference to this section's toolbar parent node
     */
    get toolbar() {
        return this.parentElement;
    }
    /**
     * @param {string} val the alignment type to set
     */
    set align(val) {
        let trueVal = `align-${val}`;
        if (typeof val !== 'string' || val === '' || !SECTION_ALIGNS.includes(trueVal)) {
            this.removeAttribute('align');
            trueVal = SECTION_ALIGNS[0];
        }
        else {
            this.setAttribute('align', val);
            this.container?.classList.add(`align-${val}`);
        }
    }
    /**
     * @returns {string} the current alignment value
     */
    get align() {
        return this.getAttribute('align') || 'start';
    }
    /**
     * @param {boolean | string} val true if this toolbar section should be marked "favor"
     * (will try not to be collapsed/shrunk if the parent toolbar size shrinks)
     */
    set favor(val) {
        const newValue = stringToBool(val);
        if (newValue) {
            this.setAttribute(attributes.FAVOR, '');
            this.container?.classList.add(attributes.FAVOR);
        }
        else {
            this.removeAttribute(attributes.FAVOR);
            this.container?.classList.remove(attributes.FAVOR);
        }
    }
    /**
     * @returns {boolean} true if this toolbar section is marked "favor"
     * (will try not to be collapsed/shrunk if the parent toolbar size shrinks)
     */
    get favor() {
        return this.hasAttribute(attributes.FAVOR);
    }
    /**
     * @param {string | boolean | null} value truthy if this toolbar section should be made "inactive"
     * (takes up space, but items are not visible)
     */
    set inactive(value) {
        const isInactive = stringToBool(value);
        if (isInactive) {
            this.setAttribute(attributes.INACTIVE, 'true');
            this.container?.classList.add(attributes.INACTIVE);
        }
        else {
            this.removeAttribute(attributes.INACTIVE);
            this.container?.classList.remove(attributes.INACTIVE);
        }
    }
    /**
     * @returns {boolean} true if the toolbar section is "inactive" (takes up space, but items are not visible)
     */
    get inactive() {
        return this.hasAttribute(attributes.INACTIVE);
    }
    /**
     * @param {string} val the type of section
     */
    set type(val) {
        let trueVal;
        if (typeof val !== 'string' || val === '' || !SECTION_TYPES.includes(val)) {
            trueVal = SECTION_TYPES[0];
        }
        else {
            trueVal = `${val}`;
        }
        this.setAttribute(attributes.TYPE, trueVal);
        if (this.container) {
            setCssClassFromGroup(trueVal, this.container, SECTION_TYPES);
        }
    }
    /**
     * @returns {string} the type of section
     */
    get type() {
        return this.getAttribute(attributes.TYPE) || 'static';
    }
    /**
     * @param {string} value the type of toolbar
     */
    set toolbarType(value) {
        if (value && TOOLBAR_TYPES.includes(value)) {
            this.setAttribute(attributes.TOOLBAR_TYPE, value);
            this.container?.classList.add(value);
        }
        else {
            this.removeAttribute(attributes.TOOLBAR_TYPE);
            this.container?.classList.remove(TOOLBAR_TYPES[0]);
        }
    }
    /**
     * @returns {string} the type of toolbar
     */
    get toolbarType() {
        return this.getAttribute(attributes.TOOLBAR_TYPE);
    }
};
IdsToolbarSection = __decorate([
    customElement('ids-toolbar-section'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsToolbarSection);
export default IdsToolbarSection;
export { TOOLBAR_ITEM_TAGNAMES };
//# sourceMappingURL=ids-toolbar-section.js.map