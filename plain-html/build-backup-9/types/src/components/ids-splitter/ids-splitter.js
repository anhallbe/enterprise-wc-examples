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
import Base from './ids-splitter-base';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import IdsSplitterLocalStorage from './ids-splitter-local-storage';
import IdsSplitterPane from './ids-splitter-pane';
import '../ids-draggable/ids-draggable';
import styles from './ids-splitter.scss';
// Defaults
const SPLITTER_DEFAULTS = {
    align: 'start',
    axis: 'x',
    disabled: false,
    label: 'Resize',
    resizeOnDragEnd: false,
    savePosition: false,
    uniqueId: null
};
// Align to be used only
const ALIGN = ['start', 'end'];
// Axis to be used only
const AXIS = ['x', 'y'];
// Event name strings
const EVENTS = {
    beforecollapsed: 'beforecollapsed',
    collapsed: 'collapsed',
    beforeexpanded: 'beforeexpanded',
    expanded: 'expanded',
    beforesizechanged: 'beforesizechanged',
    sizechanged: 'sizechanged'
};
// Collapsed strings
const COLLAPSED = 'collapsed';
/**
 * IDS Splitter Component
 * @type {IdsSplitter}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 * @part splitter - the splitter container element
 * @part split-bar - the split bar element
 * @part split-bar-icon - the split bar icon element
 */
let IdsSplitter = class IdsSplitter extends Base {
    constructor() {
        super();
        this.state = {
            ...this.state,
            ...SPLITTER_DEFAULTS
        };
    }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            ...super.attributes,
            attributes.ALIGN,
            attributes.AXIS,
            attributes.DISABLED,
            attributes.LABEL,
            attributes.RESIZE_ON_DRAG_END,
            attributes.SAVE_POSITION,
            attributes.UNIQUE_ID
        ];
    }
    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        const cssClass = ` class="ids-splitter axis-${this.axis} align-${this.align}"`;
        const disabled = this.disabled ? ' disabled' : '';
        return `
      <div part="splitter" role="presentation"${cssClass}${disabled}>
        <slot></slot>
      </div>`;
    }
    /**
     * Invoked each time the custom element is appended into a document-connected element.
     */
    connectedCallback() {
        super.connectedCallback();
        this.#init();
    }
    /**
     * Get list of current pane sizes.
     * @returns {Array} The list of current pane sizes.
     */
    sizes() {
        return this.#sizes;
    }
    /**
     * Get list of current pane minimum sizes.
     * @returns {Array} The list of current pane minimum sizes.
     */
    minSizes() {
        return this.#minSizes;
    }
    /**
     * Get list of current pane maximum sizes, limited to single split.
     * @returns {Array} The list of current pane maximum sizes.
     */
    maxSizes() {
        return this.#maxSizes;
    }
    /**
     * Collapse start pane size for given start/end panes or panes css selector.
     * @param {object} [options] The collapse options.
     * @param {HTMLElement|string} [options.startPane] The start pane.
     * @param {HTMLElement|string} [options.endPane] The end pane.
     * @param {object} [options.pair] The pair.
     * @returns {void}
     */
    collapse(options = {}) {
        if (this.disabled) {
            if (!options.initial)
                return;
        }
        const pair = options.pair || this.getPair(options);
        if (pair && pair.start) {
            let canProceed = true;
            const response = (veto) => {
                canProceed = !!stringToBool(veto);
            };
            this.#triggerEvent(EVENTS.beforecollapsed, pair, response);
            if (!canProceed) {
                return;
            }
            const { pane, idx } = pair.start;
            const before = this.#sizes[idx];
            const hasSize = this.#sizes[idx] > this.#minSizes[idx];
            this.#expandSizes[idx] = hasSize ? this.#sizes[idx] : this.#defaultsSize;
            if (hasSize) {
                const diff = this.#minSizes[idx] - this.#sizes[idx];
                const pixelDiff = this.#toPixel(diff);
                this.#move({ ...pair, diff: pixelDiff, initial: options.initial });
            }
            if (before !== this.#sizes[idx]) {
                pane.setAttribute(COLLAPSED, '');
                this.#triggerEvent(EVENTS.collapsed, pair);
            }
        }
    }
    /**
     * Expand start pane size for given start/end panes or panes css selector.
     * @param {object} [options] The expand options.
     * @param {HTMLElement|string} [options.startPane] The start pane.
     * @param {HTMLElement|string} [options.endPane] The end pane.
     * @param {object} [options.pair] The pair.
     * @returns {void}
     */
    expand(options = {}) {
        if (this.disabled) {
            return;
        }
        const pair = options.pair || this.getPair(options);
        if (pair && pair.start) {
            let canProceed = true;
            const response = (veto) => {
                canProceed = !!stringToBool(veto);
            };
            this.#triggerEvent(EVENTS.beforeexpanded, pair, response);
            if (!canProceed) {
                return;
            }
            const { pane, idx } = pair.start;
            const before = this.#sizes[idx];
            const collapsed = stringToBool(pane.getAttribute(COLLAPSED));
            if (collapsed) {
                const diff = this.#expandSizes[idx] - this.#minSizes[idx];
                this.#move({ ...pair, diff: this.#toPixel(diff) });
            }
            if (before !== this.#sizes[idx]) {
                pane.removeAttribute(COLLAPSED);
                this.#triggerEvent(EVENTS.expanded, pair);
            }
        }
    }
    /**
     * Get list of all pairs.
     * @returns {Array} The pair.
     */
    getAllPairs() {
        return this.#pairs;
    }
    /**
     * Get pair for given start/end panes or panes css selector.
     * @param {object} [options] The expand options.
     * @param {HTMLElement|string} [options.startPane] The start pane.
     * @param {HTMLElement|string} [options.endPane] The end pane.
     * @returns {object|undefined} The pair.
     */
    getPair(options = {}) {
        const { startPane, endPane } = options;
        let pair;
        const isValid = (el) => typeof el === 'string' || el instanceof IdsSplitterPane;
        if (isValid(startPane) && isValid(endPane)) {
            const elem = (sel) => (typeof sel === 'string' ? this.querySelector(sel) : sel);
            const startElem = elem(startPane);
            const endElem = elem(endPane);
            this.#pairs.forEach((p) => {
                if ((p.start.pane === startElem) || (p.end.pane === endElem)) {
                    pair = p;
                }
            });
        }
        return pair;
    }
    /**
     * Container width.
     * @private
     */
    #container = { size: 0 };
    /**
     * Store some properties based on current axis.
     * @private
     */
    #prop = {};
    /**
     * Track while moving.
     * @private
     */
    #moving = {};
    /**
     * List of pane elements attached.
     * @private
     */
    #panes = [];
    /**
     * List of pair elements attached.
     * @private
     */
    #pairs = [];
    /**
     * Defaults pane size.
     * @private
     */
    #defaultsSize = 0;
    /**
     * List of pane expand sizes.
     * @private
     */
    #expandSizes = [];
    /**
     * List of pane sizes.
     * @private
     */
    #sizes = [];
    /**
     * List of pane minimun sizes.
     * @private
     */
    #minSizes = [];
    /**
     * List of pane maximum sizes.
     * @private
     */
    #maxSizes = [];
    /**
     * Attach the resize observer.
     * @private
     */
    #resizeObserver = new ResizeObserver(() => this.#resize());
    /**
     * Attach the initialize observer.
     * @private
     */
    #initObserverCallback() {
        this.#destroy();
        this.#setProp();
        this.#setContainer();
        this.#initialSizes();
        this.#addSplitBars();
        this.#setPairs();
        this.#positionSplitBars();
        this.#attachEventHandlers();
        this.#setInitialCollapsed();
    }
    /**
     * Attach the initialize observer.
     * @private
     */
    #initObserver = 'IntersectionObserver' in window
        ? new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.#initObserver?.disconnect();
                    this.#initObserverCallback();
                }
            });
        }) : null;
    /**
     * Local storage instance attached to component.
     * @private
     */
    #ls = new IdsSplitterLocalStorage(this);
    /**
     * Clear the saved position from local storage
     * @param {string} uniqueId If undefined, will use Internal attached.
     * @returns {void}
     */
    clearPosition = this.#ls.clearPosition.bind(this.#ls);
    /**
     * Clear all related saved position from local storage
     * @returns {void}
     */
    clearPositionAll = this.#ls.clearPositionAll.bind(this.#ls);
    /**
     * Get the id to be use.
     * @param {string} uniqueId The uniqueId.
     * @param {string} suffix Optional suffix string to make the id more unique.
     * @param {string} prefix Optional prefix string to make the id more unique.
     * @returns {string} The id.
     */
    idTobeUse = this.#ls.idTobeUse.bind(this.#ls);
    /**
     * Initialize the component
     * @private
     * @returns {void}
     */
    #init() {
        if (this.#initObserver && this.container)
            this.#initObserver.observe(this.container);
        else
            this.#initObserverCallback();
    }
    /**
     * Resize the component
     * @private
     * @returns {void}
     */
    #resize() {
        this.#setProp();
        window.requestAnimationFrame(() => {
            this.#setContainer();
            this.#positionSplitBars();
            this.#setInitialCollapsed();
        });
    }
    /**
     * Set to store properties based on current axis.
     * @private
     * @returns {object} This API object for chaining
     */
    #setProp() {
        let prop = {};
        if (this.axis === 'y') {
            prop = {
                orientation: 'vertical',
                dimension: 'height',
                posStart: 'top',
                posEnd: 'bottom',
                delta: 'dragDeltaY',
                translate: 'translateY',
                minTransform: 'minTransformY',
                maxTransform: 'maxTransformY',
                useRTL: false
            };
        }
        else {
            prop = {
                orientation: 'horizontal',
                dimension: 'width',
                posStart: 'left',
                posEnd: 'right',
                delta: 'dragDeltaX',
                translate: 'translateX',
                minTransform: 'minTransformX',
                maxTransform: 'maxTransformX',
                useRTL: this.locale?.isRTL()
            };
        }
        this.#prop = { ...prop, barPixel: 22, barPercentage: this.#toPercentage(22) };
        return this;
    }
    /**
     * Set container size width/height value based on current axis.
     * @private
     * @returns {object} This API object for chaining
     */
    #setContainer() {
        if (!this.#container)
            return this;
        this.#container.rect = this.container?.getBoundingClientRect() || {};
        this.#container.posStart = this.#container.rect[this.#prop.posStart];
        this.#container.size = this.#container.rect[this.#prop.dimension];
        return this;
    }
    /**
     * Set initial sizes, min-sizes and pane elements
     * @private
     * @returns {object} This API object for chaining
     */
    #initialSizes() {
        const panes = [...this.childNodes].filter((n) => n instanceof IdsSplitterPane);
        const defaults = { minSize: 0, size: (100 / panes.length) };
        const initial = {
            adjustable: { minSizes: [], sizes: [] },
            sum: { minSizes: 0, sizes: 0 }
        };
        panes.forEach((elem, i) => {
            let minSize = elem.getAttribute('min-size');
            let size = elem.getAttribute('size');
            if (size !== null && minSize === null) {
                size = this.#percentageVal(size);
                initial.sum.sizes += size;
                initial.adjustable.sizes.push({ elem, idx: i, size });
            }
            else if (size === null && minSize !== null) {
                minSize = this.#percentageVal(minSize);
                initial.sum.minSizes += minSize;
                initial.adjustable.minSizes.push({ elem, idx: i, minSize });
            }
            else if (size !== null && minSize !== null) {
                size = this.#percentageVal(size);
                minSize = this.#percentageVal(minSize);
                size = minSize > size ? minSize : size;
                initial.sum.minSizes += minSize;
                initial.sum.sizes += size;
                initial.adjustable.minSizes.push({ elem, idx: i, minSize });
                initial.adjustable.sizes.push({ elem, idx: i, size });
            }
        });
        // Use percentage 100%
        const total = 100;
        // max-size with single splitter only
        if (panes.length === 2) {
            let maxSize = panes[0].getAttribute('max-size');
            if (maxSize !== null) {
                maxSize = this.#percentageVal(maxSize);
                maxSize = maxSize > total ? total : maxSize;
                const sizes = initial.adjustable.sizes;
                const minSizes = initial.adjustable.minSizes;
                const len = { sizes: sizes.length, minSizes: minSizes.length };
                const args = { idx: 0, elem: panes[0] };
                if (len.sizes && !len.minSizes && sizes[0].idx === 0
                    && sizes[0].size >= maxSize) {
                    initial.sum.sizes -= (sizes[0].size - maxSize);
                    sizes[0].size = maxSize;
                }
                else if (!len.sizes && len.minSizes && minSizes[0].idx === 0
                    && minSizes[0].minSize >= maxSize) {
                    maxSize = minSizes[0].minSize;
                    initial.sum.sizes += maxSize;
                    initial.adjustable.sizes.push({ ...args, size: maxSize });
                }
                else if (len.sizes && len.minSizes && sizes[0].idx === 0
                    && minSizes[0].idx === 0 && minSizes[0].minSize >= maxSize) {
                    maxSize = minSizes[0].minSize;
                    initial.sum.sizes -= (sizes[0].size - maxSize);
                    sizes[0].size = maxSize;
                }
                else if (!len.sizes && !len.minSizes) {
                    initial.sum.sizes += maxSize;
                    initial.adjustable.sizes.push({ ...args, size: maxSize });
                }
                this.#maxSizes = [maxSize];
            }
        }
        // Adjust excess sizes
        const adjustExcessSizes = () => {
            if (initial.sum.minSizes >= total) {
                const extra = initial.sum.minSizes - total;
                const maxToMin = initial.adjustable.minSizes.sort((a, b) => b.minSize - a.minSize);
                for (let i = 0, l = maxToMin.length, ext = extra; ((i < l) && (ext > 0)); i++) {
                    if (maxToMin[i].minSize >= ext) {
                        maxToMin[i].minSize -= ext;
                        ext = 0;
                    }
                    else {
                        ext -= maxToMin[i].minSize;
                        maxToMin[i].minSize = 0;
                    }
                }
                initial.adjustable.minSizes = maxToMin.sort((a, b) => a.idx - b.idx);
            }
            if (initial.sum.sizes >= total) {
                const extra = initial.sum.sizes - total;
                const maxToMin = initial.adjustable.sizes.sort((a, b) => b.size - a.size);
                for (let i = 0, l = maxToMin.length, ext = extra; ((i < l) && (ext > 0)); i++) {
                    if (maxToMin[i].size >= ext) {
                        maxToMin[i].size -= ext;
                        ext = 0;
                    }
                    else {
                        ext -= maxToMin[i].size;
                        maxToMin[i].size = 0;
                    }
                }
                initial.sum.sizes = total;
                initial.adjustable.sizes = maxToMin.sort((a, b) => a.idx - b.idx);
            }
        };
        adjustExcessSizes();
        // Adjust default pane sizes
        const adjustDefaultSizes = () => {
            if (initial.sum.sizes > 0) {
                const len = panes.length - initial.adjustable.sizes.length;
                if (len > 0) {
                    defaults.size = (total - initial.sum.sizes) / len;
                }
            }
        };
        adjustDefaultSizes();
        // Readjust if min-sizes have sum
        if (initial.sum.minSizes > 0) {
            let found = false;
            initial.adjustable.minSizes.forEach((elem, i) => {
                const size = initial.adjustable.sizes[elem.idx]?.size;
                if (size && elem.minSize > size) {
                    initial.adjustable.sizes[i].size = elem.minSize;
                    found = true;
                }
                else if (!size && elem.minSize > defaults.size) {
                    initial.adjustable.sizes.push({ elem, idx: elem.idx, size: elem.minSize });
                    initial.sum.sizes += elem.minSize;
                    found = true;
                }
                if (found) {
                    adjustDefaultSizes();
                    adjustExcessSizes();
                }
            });
        }
        // Restore saved positions from local storage
        const saved = this.#ls.restorePosition();
        if (saved) {
            initial.adjustable.sizes = panes.map((elem, i) => ({ elem, idx: i, size: saved?.sizes?.[i] }));
        }
        // Set calculated initial dimension to pane elements,
        // push to #minSizes and #sizes
        this.#minSizes = [];
        this.#sizes = [];
        this.#panes = panes.map((elem, i) => {
            const minSizeObj = initial.adjustable.minSizes.find((x) => x.idx === i);
            const sizeObj = initial.adjustable.sizes.find((x) => x.idx === i);
            const minSize = minSizeObj ? minSizeObj.minSize : defaults.minSize;
            const size = sizeObj ? sizeObj.size : defaults.size;
            elem.style[this.#prop.dimension] = `${size}%`;
            this.#minSizes.push(minSize);
            this.#sizes.push(size);
            return elem;
        });
        this.#defaultsSize = defaults.size;
        this.#expandSizes = [...this.#sizes];
        return this;
    }
    /**
     * Get splitId prefix with given value, use for each split bar element.
     * @private
     * @param {number} value The value to be use as id.
     * @returns {string} prefix with given value.
     */
    #splitId(value) {
        return `split-${value}`;
    }
    /**
     * Add split bar elements.
     * @private
     * @returns {object} This API object for chaining.
     */
    #addSplitBars() {
        const cssClass = ` class="ids-splitter-split-bar align-${this.align}"`;
        const disabled = this.disabled ? ' disabled aria-disabled="true"' : '';
        this.#panes.forEach((pane, i) => {
            if (i > 0) {
                const template = document.createElement('template');
                template.innerHTML = `
          <ids-draggable axis=${this.axis} id="${this.#splitId(i)}"
            aria-orientation="${this.#prop.orientation}"
            role="separator" aria-label="${this.label}" tabindex="0"${cssClass}${disabled}>
            <div class="split-bar" part="split-bar" role="presentation">
              <ids-icon icon="drag" size="large" part="split-bar-icon"></ids-icon>
            </div>
          <ids-draggable>`;
                this.container?.appendChild(template.content.cloneNode(true));
            }
        });
        return this;
    }
    /**
     * Each pair has reference to start/end panes and each split bar.
     * @private
     * @returns {object} This API object for chaining.
     */
    #setPairs() {
        this.shadowRoot?.host.setAttribute('role', 'group');
        this.#panes.forEach((pane, i) => {
            if (i > 0) {
                const splitBar = this.container?.querySelector(`#${this.#splitId(i)}`);
                const zIdx = i - 1;
                const start = {
                    pane: this.#panes[zIdx],
                    idx: zIdx,
                    size: this.#sizes[zIdx],
                    minSize: this.#minSizes[zIdx],
                };
                const end = {
                    pane,
                    idx: i,
                    size: this.#sizes[i],
                    minSize: this.#minSizes[i],
                };
                start.id = start.pane.getAttribute('id');
                if (!start.id) {
                    start.id = this.#uniquePaneId();
                    start.pane.setAttribute('id', start.id);
                }
                end.id = end.pane.getAttribute('id');
                if (!end.id) {
                    end.id = this.#uniquePaneId();
                    end.pane.setAttribute('id', end.id);
                }
                // splitBar.setAttribute('aria-controls', `${start.id} ${end.id}`);
                this.#pairs.push({ splitBar, start, end, idx: zIdx }); // eslint-disable-line
            }
        });
        return this;
    }
    /**
     * Adjust split bars position
     * @private
     * @returns {object} This API object for chaining
     */
    #positionSplitBars() {
        const s = { min: 0, mid: 0, max: 0 };
        const { minTransform, maxTransform, translate, useRTL } = this.#prop; // eslint-disable-line
        const last = this.#panes.length - 1;
        const single = this.#maxSizes.length === 1;
        this.#panes.forEach((pane, i) => {
            const size = this.#toPixel(this.#sizes[i]);
            s.min = s.mid;
            s.mid = s.max;
            s.max += size;
            if (i > 0) {
                let extra = {};
                if (this.align === 'start') {
                    extra = {
                        min: i > 1 ? this.#prop.barPixel : 0,
                        max: this.#prop.barPixel
                    };
                }
                else {
                    extra = {
                        min: ((i === 1) && (this.#minSizes[0] > this.#prop.barPercentage)) ? 0 : this.#prop.barPixel,
                        max: i < last ? this.#prop.barPixel : 0
                    };
                }
                const pair = this.#pairs[i - 1];
                const sb = pair.splitBar;
                const minTransVal = s.min + this.#toPixel(this.#minSizes[pair.start.idx]) + extra.min;
                let maxTransVal = s.max - this.#toPixel(this.#minSizes[pair.end.idx]) - extra.max;
                if (single) {
                    maxTransVal = this.#toPixel(this.#maxSizes[0]) - extra.max;
                }
                if (useRTL) {
                    const min = maxTransVal * -1;
                    const max = minTransVal * -1;
                    const mid = s.mid * -1;
                    if (sb) {
                        sb.style.setProperty('transform', `${translate}(${mid}px)`);
                        sb[minTransform] = `${min}px`;
                        sb[maxTransform] = `${max}px`;
                    }
                }
                else if (sb) {
                    sb.style.setProperty('transform', `${translate}(${s.mid}px)`);
                    sb[minTransform] = `${minTransVal}px`;
                    sb[maxTransform] = `${maxTransVal}px`;
                }
            }
        });
        return this;
    }
    /**
     * Set initial collapsed panes.
     * @private
     * @returns {object} This API object for chaining
     */
    #setInitialCollapsed() {
        this.#pairs.forEach((pair) => {
            const collapsed = stringToBool(pair.start.pane.getAttribute(COLLAPSED));
            if (collapsed) {
                this.collapse({ pair, initial: true });
            }
        });
        return this;
    }
    /**
     * Set collapsed attribute to given start pane based start pane size.
     * @private
     * @param {any} pair The pair object.
     * @returns {object} This API object for chaining
     */
    #setCollapsedAttribute(pair) {
        const { start, initial } = pair;
        window.requestAnimationFrame(() => {
            const bar = start.idx === 0 && this.align === 'start' ? 0 : this.#prop.barPercentage;
            if (this.#sizes[start.idx] > (this.#minSizes[start.idx] + bar)) {
                start.pane.removeAttribute(COLLAPSED);
            }
            else if (!start.pane.hasAttribute(COLLAPSED) || initial) {
                this.#expandSizes[start.idx] = this.#defaultsSize;
                start.pane.setAttribute(COLLAPSED, '');
            }
        });
        return this;
    }
    /**
     * Set disabled state to container and for each split bars.
     * @private
     * @returns {object} This API object for chaining
     */
    #setDisabled() {
        const toggleAttribute = (el, attr = attributes.DISABLED, val = '') => {
            if (this.disabled)
                el.setAttribute(attr, val);
            else
                el.removeAttribute(attr);
        };
        if (this.container)
            toggleAttribute(this.container);
        this.#pairs.forEach((pair) => {
            toggleAttribute(pair.splitBar);
            toggleAttribute(pair.splitBar, 'aria-disabled', 'true');
        });
        return this;
    }
    /**
     * Set pair and moving values to go with move.
     * @private
     * @param {any} pair The pair object.
     * @returns {void}
     */
    #moveStart(pair) {
        if (!this.#moving.isMoving) {
            let canProceed = true;
            const response = (veto) => {
                canProceed = !!stringToBool(veto);
            };
            this.#triggerEvent(EVENTS.beforesizechanged, pair, response);
            if (!canProceed) {
                pair.splitBar.isDragging = false;
                return;
            }
            const single = this.#maxSizes.length === 1;
            const { start, end } = pair;
            start.size = this.#sizes[start.idx];
            end.size = this.#sizes[end.idx];
            this.#moving = {
                isMoving: true,
                startSize: start.size * -1,
                endSize: end.size,
                pad: 1
            };
            if (single) {
                this.#moving.max = this.#maxSizes[start.idx] - this.#sizes[start.idx] + this.#minSizes[end.idx];
            }
        }
    }
    /**
     * Adjust moving difference to apply with pair.
     * @private
     * @param {object} pair The pair object.
     * @returns {void}
     */
    #moveEnd(pair) {
        if (this.#moving.isMoving) {
            this.#updateSizeAndSplitBar(pair);
            this.#setCollapsedAttribute(pair);
            this.#triggerEvent(EVENTS.sizechanged, pair);
            this.#ls.savePosition();
        }
        this.#moving = {};
    }
    /**
     * Move split bar and adjust panes for given difference.
     * @private
     * @param {object} pair The pair object.
     * @returns {void}
     */
    #move(pair) {
        this.#moveStart(pair);
        if (this.#moving.isMoving) {
            let diff = this.#adjustDiff({ ...pair, diff: this.#toPercentage(pair.diff) });
            diff *= this.#prop.useRTL ? -1 : 1;
            this.#moveEnd({ ...pair, diff });
            if (diff) {
                const sb = pair.splitBar;
                const matrix = window.getComputedStyle(sb).getPropertyValue('transform')
                    ?.replace(/^matrix\((.+)\)$/g, '$1').split(',');
                const translate = { x: +matrix[4], y: +matrix[5] };
                const trans = translate[this.axis] + this.#toPixel(diff);
                sb?.style.setProperty('transform', `${this.#prop.translate}(${trans}px)`);
            }
        }
    }
    /**
     * Adjust given difference and ignore out of bound value.
     * @private
     * @param {object} pair The start object in pair.
     * @returns {number} The adjusted difference.
     */
    #adjustDiff(pair) {
        const { startSize, endSize, pad, max, isMoving } = this.#moving; // eslint-disable-line
        const { useRTL, barPercentage } = this.#prop;
        const { start, end, diff } = pair;
        const useEndSize = typeof max !== 'undefined' ? max : endSize;
        const extra = {};
        if (this.align === 'start') {
            extra.min = start.idx === 0 ? 0 : barPercentage;
            extra.max = barPercentage;
        }
        else {
            extra.min = ((start.idx === 0) && (this.#minSizes[0] > barPercentage)) ? 0 : barPercentage;
            extra.max = end.idx === this.#pairs.length ? 0 : barPercentage;
        }
        let newDiff = diff * (useRTL ? -1 : 1);
        if (isMoving) {
            if (useRTL && (newDiff < 0 && newDiff < ((startSize + start.minSize) + pad))) {
                newDiff = startSize + start.minSize + extra.min;
            }
            else if (useRTL && (newDiff > 0 && newDiff > ((useEndSize - end.minSize) - pad))) {
                newDiff = useEndSize - end.minSize - extra.max;
            }
            else if (!useRTL && (diff > 0 && diff > ((useEndSize - end.minSize) - pad - extra.max))) {
                newDiff = useEndSize - end.minSize - extra.max;
            }
            else if (!useRTL && (diff < 0 && diff < ((startSize + start.minSize) + pad + extra.min))) {
                newDiff = startSize + start.minSize + extra.min;
            }
        }
        return newDiff === Infinity ? 0 : newDiff;
    }
    /**
     * Update pair size with given difference percentages value.
     * @private
     * @param {object} pair The pair.
     * @returns {object} new updated size
     */
    #updateSize(pair) {
        const { start, end } = pair;
        const newSize = { diff: this.#adjustDiff(pair) };
        newSize.start = start.size + newSize.diff;
        newSize.end = end.size - newSize.diff;
        start.pane.style[this.#prop.dimension] = `${newSize.start}%`;
        end.pane.style[this.#prop.dimension] = `${newSize.end}%`;
        start.pane.setAttribute(attributes.SIZE, `${newSize.start}%`);
        end.pane.setAttribute(attributes.SIZE, `${newSize.end}%`);
        return newSize;
    }
    /**
     * Trigger given event with current params.
     * @private
     * @param {string} evt The event to be trigger.
     * @param {object} pair The pair.
     * @param {object} res The veto response method.
     * @returns {void}
     */
    #triggerEvent(evt, pair, res) {
        const { start, end, splitBar } = pair;
        const args = {
            detail: {
                elem: this,
                start,
                end,
                splitBar,
                sizes: this.sizes(),
                minSizes: this.minSizes(),
                maxSizes: this.maxSizes()
            }
        };
        if (typeof res === 'function') {
            args.detail.response = res;
        }
        this.triggerEvent(evt, this, args);
    }
    /**
     * Update given pair size and adjust split bars min/max positions.
     * @private
     * @param {object} pair The pair.
     * @returns {void}
     */
    #updateSizeAndSplitBar(pair) {
        const { start, end, idx, diff } = pair; // eslint-disable-line
        // Update and get new updated size
        const newSize = this.#updateSize({ start, end, diff });
        this.#sizes[start.idx] = newSize.start;
        this.#sizes[end.idx] = newSize.end;
        start.size = newSize.start;
        end.size = newSize.end;
        // Adjust min/max on split bar, if more than one split bars
        const { minTransform, maxTransform, useRTL } = this.#prop; // eslint-disable-line
        const last = this.#pairs.length - 1;
        if (last > 0) {
            const pixelDeff = this.#toPixel(newSize.diff);
            const sb = {
                prev: this.#pairs[idx - 1]?.splitBar,
                next: this.#pairs[idx + 1]?.splitBar
            };
            if (idx === 0) {
                if (useRTL)
                    sb.next[maxTransform] -= pixelDeff;
                else
                    sb.next[minTransform] += pixelDeff;
            }
            else if (idx === last) {
                if (useRTL)
                    sb.prev[minTransform] -= pixelDeff;
                else
                    sb.prev[maxTransform] += pixelDeff;
            }
            else {
                if (useRTL)
                    sb.prev[minTransform] -= pixelDeff;
                else
                    sb.prev[maxTransform] += pixelDeff;
                if (useRTL)
                    sb.next[maxTransform] -= pixelDeff;
                else
                    sb.next[minTransform] += pixelDeff;
            }
        }
    }
    /**
     * Get given value as percentages
     * @private
     * @param {string|number|null} value The value
     * @returns {number} The percentage value
     */
    #percentageVal(value) {
        return /%$/i.test(`${value}`)
            ? parseInt(`${value}`, 10) : this.#toPercentage(value);
    }
    /**
     * Convert given value to percentages
     * @private
     * @param {string|number|null} value The value
     * @returns {number} The percentage value
     */
    #toPercentage(value) {
        const doPercentage = (v) => {
            const isNegative = v < 0;
            v = Math.abs(v);
            return (((v / this.#container.size) * 100) * (isNegative ? -1 : 1));
        };
        let r = 0;
        if (typeof value === 'number') {
            r = doPercentage(value);
        }
        else {
            const val = parseInt(`${value}`, 10);
            if ((!Number.isNaN(val)) && (/px$/i.test(`${value}`))) {
                r = doPercentage(val);
            }
        }
        return r;
    }
    /**
     * Convert given value to pixels
     * @private
     * @param {string|number|null} value The value
     * @returns {number} The pixels value
     */
    #toPixel(value) {
        const doPixel = (v) => {
            const isNegative = v < 0;
            v = Math.abs(v);
            return ((this.#container.size * (v / 100)) * (isNegative ? -1 : 1));
        };
        let r = 0;
        if (typeof value === 'number') {
            r = doPixel(value);
        }
        else {
            const val = parseInt(`${value}`, 10);
            if ((!Number.isNaN(val)) && (/%$/i.test(`${value}`))) {
                r = doPixel(val);
            }
        }
        return r;
    }
    /**
     * Generate unique pane id.
     * @private
     * @returns {string} The genrated id.
     */
    #uniquePaneId() {
        return `splitter-pane-${Math.floor(Math.random() * Date.now())}`;
    }
    /**
     * Establish Internal Event Handlers
     * @private
     * @returns {object} This API object for chaining
     */
    #attachEventHandlers() {
        // Respond to parent changing language
        this.offEvent('languagechange.splitter');
        this.onEvent('languagechange.splitter', this.closest('ids-container'), () => {
            this.#resize();
        });
        const slot = this.shadowRoot?.querySelector('slot');
        this.offEvent('slotchange.splitter', slot);
        this.onEvent('slotchange.splitter', slot, () => {
            this.#init();
        });
        // Draggable events
        this.#pairs.forEach((pair, i) => {
            const sb = pair.splitBar;
            const namespace = `splitter${i}`;
            this.offEvent(`ids-dragstart.${namespace}`, sb);
            this.onEvent(`ids-dragstart.${namespace}`, sb, () => {
                if (!this.disabled)
                    this.#moveStart(pair);
            });
            this.offEvent(`ids-drag.${namespace}`, sb);
            this.onEvent(`ids-drag.${namespace}`, sb, (e) => {
                if (!this.disabled && !this.resizeOnDragEnd && this.#moving.isMoving) {
                    const diff = this.#toPercentage(e.detail[this.#prop.delta]);
                    this.#updateSize({ ...pair, diff });
                }
            });
            this.offEvent(`ids-dragend.${namespace}`, sb);
            this.onEvent(`ids-dragend.${namespace}`, sb, (e) => {
                if (!this.disabled) {
                    const diff = this.#toPercentage(e.detail[this.#prop.delta]);
                    this.#moveEnd({ ...pair, diff });
                }
            });
            this.offEvent(`click.${namespace}`, sb);
            this.onEvent(`click.${namespace}`, sb, () => {
                sb.focus();
            });
            this.offEvent(`keydown.${namespace}`, sb);
            this.onEvent(`keydown.${namespace}`, sb, (e) => {
                if (!this.disabled) {
                    // Keep `Space` in keydown allow options, so page not scrolls
                    const allow = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Space'];
                    const key = e.code;
                    if (allow.indexOf(key) > -1) {
                        if (key !== 'Space') {
                            const useRTL = this.#prop.useRTL;
                            let move = 10;
                            if (key === 'ArrowDown' || key === 'ArrowLeft') {
                                move *= useRTL || !this.isHorizontal ? 1 : -1;
                            }
                            else if (key === 'ArrowUp' || key === 'ArrowRight') {
                                move *= useRTL || !this.isHorizontal ? -1 : 1;
                            }
                            this.#move({ ...pair, diff: move });
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            });
        });
        // Set observer for resize
        this.#resizeObserver.disconnect();
        if (this.container)
            this.#resizeObserver.observe(this.container);
        return this;
    }
    /**
     * Destroy added elements and unbind events.
     * @returns {object} This API object for chaining
     */
    #destroy() {
        const slot = this.shadowRoot?.querySelector('slot');
        this.offEvent('slotchange.splitter', slot);
        this.offEvent('languagechange.splitter');
        this.#resizeObserver.disconnect();
        this.#initObserver?.disconnect();
        this.#pairs.forEach((pair, i) => {
            const { start, end, splitBar } = pair;
            const namespace = `splitter${i}`;
            start.pane.removeAttribute('style');
            end.pane.removeAttribute('style');
            this.offEvent(`ids-dragstart.${namespace}`, splitBar);
            this.offEvent(`ids-drag.${namespace}`, splitBar);
            this.offEvent(`ids-dragend.${namespace}`, splitBar);
            this.offEvent(`click.${namespace}`, splitBar);
            this.offEvent(`keydown.${namespace}`, splitBar);
            splitBar?.remove?.();
        });
        this.#container = { size: 0 };
        this.#prop = {};
        this.#moving = {};
        this.#panes = [];
        this.#pairs = [];
        this.#defaultsSize = 0;
        this.#expandSizes = [];
        this.#sizes = [];
        this.#minSizes = [];
        return this;
    }
    /**
     * Check if current orientation is horizontal
     * @returns {boolean} True if, orientation is horizontal
     */
    get isHorizontal() { return this.#prop.orientation === 'horizontal'; }
    /**
     * Set the split bar align direction start/end
     * @param {string} value of the align start, end
     */
    set align(value) {
        if (value !== this.state.align) {
            const prefixed = (v) => `align-${v}`;
            this.container?.classList.remove(...ALIGN.map((v) => prefixed(v)));
            if (ALIGN.indexOf(value) > -1) {
                this.setAttribute(attributes.ALIGN, value);
                this.state.align = value;
            }
            else {
                this.removeAttribute(attributes.ALIGN);
                this.state.align = SPLITTER_DEFAULTS.align;
            }
            this.container?.classList.add(prefixed(this.state.align));
            this.#init();
        }
    }
    get align() { return this.state.align; }
    /**
     * Set the splitter axis direction x: horizontal or y: vertical
     * @param {string} value of the axis x or y
     */
    set axis(value) {
        if (value !== this.state.axis) {
            const prefixed = (v) => `axis-${v}`;
            this.container?.classList.remove(...AXIS.map((v) => prefixed(v)));
            if (AXIS.indexOf(value) > -1) {
                this.setAttribute(attributes.AXIS, value);
                this.state.axis = value;
            }
            else {
                this.removeAttribute(attributes.AXIS);
                this.state.axis = SPLITTER_DEFAULTS.axis;
            }
            this.container?.classList.add(prefixed(this.state.axis));
            this.#init();
        }
    }
    get axis() { return this.state.axis; }
    /**
     * Sets the splitter to disabled
     * @param {boolean|string} value If true will set disabled attribute
     */
    set disabled(value) {
        const val = stringToBool(value);
        if (val !== this.state.disabled) {
            this.state.disabled = val;
            if (val) {
                this.setAttribute(attributes.DISABLED, '');
            }
            else {
                this.removeAttribute(attributes.DISABLED);
            }
            this.#setDisabled();
        }
    }
    get disabled() { return this.state.disabled; }
    /**
     * Set the aria-label text for each split bar.
     * @param {string} value of the label text.
     */
    set label(value) {
        if (value !== this.state.label) {
            if (value) {
                this.setAttribute(attributes.LABEL, value);
                this.state.label = value;
            }
            else {
                this.removeAttribute(attributes.LABEL);
                this.state.label = SPLITTER_DEFAULTS.label;
            }
        }
    }
    get label() { return this.state.label; }
    /**
     * Sets the splitter to resize on drag end
     * @param {boolean|string} value If true will set to resize on drag end
     */
    set resizeOnDragEnd(value) {
        const val = stringToBool(value);
        if (val !== this.state.resizeOnDragEnd) {
            this.state.resizeOnDragEnd = val;
            if (val) {
                this.setAttribute(attributes.RESIZE_ON_DRAG_END, '');
            }
            else {
                this.removeAttribute(attributes.RESIZE_ON_DRAG_END);
            }
        }
    }
    get resizeOnDragEnd() { return this.state.resizeOnDragEnd; }
    /**
     *  Set splitter save position to local storage.
     * @param {boolean|string} value if true, will allow to save position to local storage.
     */
    set savePosition(value) {
        const val = stringToBool(value);
        if (val !== this.state.savePosition) {
            this.state.savePosition = val;
            if (val) {
                this.setAttribute(attributes.SAVE_POSITION, '');
            }
            else {
                this.removeAttribute(attributes.SAVE_POSITION);
            }
        }
    }
    get savePosition() { return this.state.savePosition; }
    /**
     * Set uniqueId to save to local storage.
     * @param {number|string|null} value A uniqueId use to save to local storage.
     */
    set uniqueId(value) {
        const val = /number|string/g.test(typeof value) ? `${value}` : null;
        if (typeof val === 'string' && val !== '') {
            if (val !== this.state.uniqueId) {
                this.setAttribute(attributes.UNIQUE_ID, val);
                this.state.uniqueId = val;
            }
            return;
        }
        this.removeAttribute(attributes.UNIQUE_ID);
        this.state.uniqueId = SPLITTER_DEFAULTS.uniqueId;
    }
    get uniqueId() { return this.state.uniqueId; }
};
IdsSplitter = __decorate([
    customElement('ids-splitter'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsSplitter);
export default IdsSplitter;
//# sourceMappingURL=ids-splitter.js.map