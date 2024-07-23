var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { customElement } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-layout-grid-cell-base';
/**
 * IDS Layout Grid Cell Component
 * @type {IdsLayoutGridCell}
 * @inherits IdsElement
 */
let IdsLayoutGridCell = class IdsLayoutGridCell extends Base {
    constructor() {
        super();
    }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            attributes.COL_SPAN,
            attributes.COL_SPAN_XS,
            attributes.COL_SPAN_SM,
            attributes.COL_SPAN_MD,
            attributes.COL_SPAN_LG,
            attributes.COL_SPAN_XL,
            attributes.COL_SPAN_XXL,
            attributes.COL_START,
            attributes.COL_END,
            attributes.FILL,
            attributes.JUSTIFY,
            attributes.ORDER,
            attributes.ROW_SPAN,
            attributes.ROW_START,
            attributes.ROW_END,
        ];
    }
    parentColSetting = this.parentElement?.getAttribute(attributes.COLS);
    defaultColSetting = 'fluid-grid';
    /**
     * Handle The Fill Setting
     * @returns {string | null} The fill to true for theme default color
     */
    get fill() { return this.getAttribute(attributes.FILL); }
    /**
     * Set the background fill
     * @param {string | null} value The fill color or true for theme default color
     */
    set fill(value) {
        if (value) {
            this.setAttribute(attributes.FILL, value);
            this.classList.add('ids-background-fill');
            return;
        }
        this.removeAttribute(attributes.FILL);
        this.classList.remove('ids-background-fill');
    }
    /**
     * Set the amount of columns to span
     * @param {string | null} value The number value for the columns to span in the grid
     */
    set colSpan(value) {
        if (value) {
            this.setAttribute(attributes.COL_SPAN, value);
            this.style.setProperty('--grid-col-span', value);
            this.classList.add(`ids-layout-grid-col-span`);
            if (value === 'full') {
                this.style.setProperty('--grid-col-span', '1 / -1');
                this.classList.add(`ids-layout-grid-col-span-full`);
            }
            const gridCols = this.parentColSetting ? this.parentColSetting : this.defaultColSetting;
            if (gridCols === this.defaultColSetting || gridCols === 'fluid-grid-xl') {
                this.classList.remove(`ids-layout-grid-col-span`);
                this.classList.add(`ids-layout-grid-col-span-${value}`);
            }
            return;
        }
        this.style.removeProperty('--grid-col-span');
        this.classList.remove(`ids-layout-grid-col-span`);
        this.removeAttribute(attributes.COL_SPAN);
    }
    get colSpan() { return this.getAttribute(attributes.COL_SPAN); }
    /**
     * Sets the col span for colSpanXs breakpoint 360px
     * @param {string | null} value The number value for the colSpanXs col span
     */
    set colSpanXs(value) {
        if (value) {
            this.setAttribute(attributes.COL_SPAN_XS, value);
            this.style.setProperty('--grid-col-span-xs', value);
            this.classList.add(`ids-layout-grid-col-span`);
            const gridCols = this.parentColSetting ? this.parentColSetting : this.defaultColSetting;
            if (gridCols === this.defaultColSetting || gridCols === 'fluid-grid-xl') {
                this.classList.remove(`ids-layout-grid-col-span`);
                this.classList.add(`ids-layout-grid-col-span-xs-${value}`);
            }
        }
    }
    get colSpanXs() {
        return this.getAttribute(attributes.COL_SPAN_XS);
    }
    /**
     * Sets the col span for sm breakpoint 600px
     * @param {string | null} value The number value for the sm col span
     */
    set colSpanSm(value) {
        if (value) {
            this.setAttribute(attributes.COL_SPAN_SM, value);
            this.style.setProperty('--grid-col-span-sm', value);
            this.classList.add(`ids-layout-grid-col-span`);
            const gridCols = this.parentColSetting ? this.parentColSetting : this.defaultColSetting;
            if (gridCols === this.defaultColSetting || gridCols === 'fluid-grid-xl') {
                this.classList.remove(`ids-layout-grid-col-span`);
                this.classList.add(`ids-layout-grid-col-span-sm-${value}`);
            }
        }
    }
    get colSpanSm() {
        return this.getAttribute(attributes.COL_SPAN_SM);
    }
    /**
     * Sets the col span for md breakpoint 840px
     * @param {string | null} value The number value for the md col span
     */
    set colSpanMd(value) {
        if (value) {
            this.setAttribute(attributes.COL_SPAN_MD, value);
            this.style.setProperty('--grid-col-span-md', value);
            this.classList.add(`ids-layout-grid-col-span`);
            const gridCols = this.parentColSetting ? this.parentColSetting : this.defaultColSetting;
            if (gridCols === this.defaultColSetting || gridCols === 'fluid-grid-xl') {
                this.classList.remove(`ids-layout-grid-col-span`);
                this.classList.add(`ids-layout-grid-col-span-md-${value}`);
            }
        }
    }
    get colSpanMd() {
        return this.getAttribute(attributes.COL_SPAN_MD);
    }
    /**
     * Sets the col span for lg breakpoint 1024px
     * @param {string | null} value The number value for the lg col span
     */
    set colSpanLg(value) {
        if (value) {
            this.setAttribute(attributes.COL_SPAN_LG, value);
            this.style.setProperty('--grid-col-span-lg', value);
            this.classList.add(`ids-layout-grid-col-span`);
            const gridCols = this.parentColSetting ? this.parentColSetting : this.defaultColSetting;
            if (gridCols === this.defaultColSetting || gridCols === 'fluid-grid-xl') {
                this.classList.remove(`ids-layout-grid-col-span`);
                this.classList.add(`ids-layout-grid-col-span-lg-${value}`);
            }
        }
    }
    get colSpanLg() {
        return this.getAttribute(attributes.COL_SPAN_LG);
    }
    /**
     * Sets the col span for xl breakpoint 1280px
     * @param {string | null} value The number value for the xl col span
     */
    set colSpanXl(value) {
        if (value) {
            this.setAttribute(attributes.COL_SPAN_XL, value);
            this.style.setProperty('--grid-col-span-xl', value);
            this.classList.add(`ids-layout-grid-col-span`);
            const gridCols = this.parentColSetting ? this.parentColSetting : this.defaultColSetting;
            if (gridCols === this.defaultColSetting || gridCols === 'fluid-grid-xl') {
                this.classList.remove(`ids-layout-grid-col-span`);
                this.classList.add(`ids-layout-grid-col-span-xl-${value}`);
            }
        }
    }
    get colSpanXl() {
        return this.getAttribute(attributes.COL_SPAN_XL);
    }
    /**
     * Sets the col span for xxl breakpoint 1440px
     * @param {string | null} value The number value for the xxl col span
     */
    set colSpanXxl(value) {
        if (value) {
            this.setAttribute(attributes.COL_SPAN_XXL, value);
            this.style.setProperty('--grid-col-span-xxl', value);
            this.classList.add(`ids-layout-grid-col-span`);
            const gridCols = this.parentColSetting ? this.parentColSetting : this.defaultColSetting;
            if (gridCols === this.defaultColSetting || gridCols === 'fluid-grid-xl') {
                this.classList.remove(`ids-layout-grid-col-span`);
                this.classList.add(`ids-layout-grid-col-span-xxl-${value}`);
            }
        }
    }
    get colSpanXxl() {
        return this.getAttribute(attributes.COL_SPAN_XXL);
    }
    /**
     * Set the starting column
     * @param {string | null} value The number value for the column starting point
     */
    set colStart(value) {
        if (value) {
            this.setAttribute(attributes.COL_START, value);
            this.style.setProperty('--grid-col-start', value);
            this.classList.add(`ids-layout-grid-col-start`);
            return;
        }
        this.style.removeProperty('--grid-col-start');
        this.classList.remove(`ids-layout-grid-col-start`);
        this.removeAttribute(attributes.COL_START);
    }
    get colStart() { return this.getAttribute(attributes.COL_START); }
    /**
     * Set the ending column
     * @param {string | null} value The number value for the column starting point
     */
    set colEnd(value) {
        if (value) {
            this.setAttribute(attributes.COL_END, value);
            this.style.setProperty('--grid-col-end', value);
            this.classList.add(`ids-layout-grid-col-end`);
            return;
        }
        this.style.removeProperty('--grid-col-end');
        this.classList.remove(`ids-layout-grid-col-end`);
        this.removeAttribute(attributes.COL_END);
    }
    get colEnd() { return this.getAttribute(attributes.COL_END); }
    /**
     * Set the amount of rows to span
     * @param {string | null} value The number value for the rows to span in the grid
     */
    set rowSpan(value) {
        if (value) {
            this.setAttribute(attributes.ROW_SPAN, value);
            this.style.setProperty('--grid-row-span', value);
            this.classList.add(`ids-layout-grid-row-span`);
            return;
        }
        this.style.removeProperty('--grid-row-span');
        this.classList.remove(`ids-layout-grid-row-span`);
        this.removeAttribute(attributes.ROW_SPAN);
    }
    get rowSpan() { return this.getAttribute(attributes.ROW_SPAN); }
    /**
     * Set the starting row
     * @param {string | null} value The number value for the row starting point
     */
    set rowStart(value) {
        if (value) {
            this.setAttribute(attributes.ROW_START, value);
            this.style.setProperty('--grid-row-start', value);
            this.classList.add(`ids-layout-grid-row-start`);
            return;
        }
        this.style.removeProperty('--grid-row-start');
        this.classList.remove(`ids-layout-grid-row-start`);
        this.removeAttribute(attributes.ROW_START);
    }
    get rowStart() { return this.getAttribute(attributes.ROW_START); }
    /**
     * Set the ending row
     * @param {string | null} value The number value for the row ending point
     */
    set rowEnd(value) {
        if (value) {
            this.setAttribute(attributes.ROW_END, value);
            this.style.setProperty('--grid-row-end', value);
            this.classList.add(`ids-layout-grid-row-end`);
            return;
        }
        this.style.removeProperty('--grid-row-end');
        this.classList.remove(`ids-layout-grid-row-end`);
        this.removeAttribute(attributes.ROW_END);
    }
    get rowEnd() { return this.getAttribute(attributes.ROW_END); }
    /**
     * Float the element to the right using justify-self
     * @param {string | null} value The number value for the row ending point
     */
    set justify(value) {
        if (value) {
            this.setAttribute(attributes.JUSTIFY, value);
            this.style.justifySelf = value;
            if (value === 'end') {
                this.style.marginRight = '32px';
            }
            return;
        }
        this.style.removeProperty('justify-self');
        this.style.marginRight = '0px';
        this.removeAttribute(attributes.JUSTIFY);
    }
    get justify() { return this.getAttribute(attributes.JUSTIFY); }
    /**
     * Set the order of the grid cell
     * @param { string | null } value The number value for the order of the grid cell
     * @memberof IdsLayoutGridCell
     */
    set order(value) {
        if (value) {
            this.setAttribute(attributes.ORDER, value.toString());
            this.style.setProperty('--grid-order', value);
            this.classList.add(`ids-layout-grid-cell-order`);
        }
        this.removeAttribute(attributes.ORDER);
    }
    get order() { return this.getAttribute(attributes.ORDER); }
};
IdsLayoutGridCell = __decorate([
    customElement('ids-layout-grid-cell'),
    __metadata("design:paramtypes", [])
], IdsLayoutGridCell);
export default IdsLayoutGridCell;
//# sourceMappingURL=ids-layout-grid-cell.js.map