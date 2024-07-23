import { attributes } from '../../core/ids-attributes';
import { checkOverflow } from '../../utils/ids-dom-utils/ids-dom-utils';
import { kebabCase } from '../../utils/ids-string-utils/ids-string-utils';
/**
 * A mixin that adds selection functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsChartLegendMixin = (superclass) => class extends superclass {
    legendsHref = [];
    constructor(...args) {
        super(...args);
    }
    static get attributes() {
        return [
            ...superclass.attributes,
            attributes.LEGEND_PLACEMENT,
        ];
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.attachLegendEvents();
    }
    /**
     * Set the legend placement between top, bottom, left, right
     * @param {string} value The placement value
     */
    set legendPlacement(value) {
        const chartContainer = this.shadowRoot?.querySelector('.ids-chart-container');
        this.setAttribute(attributes.LEGEND_PLACEMENT, value);
        chartContainer?.classList.remove('legend-top', 'legend-bottom', 'legend-left', 'legend-right');
        chartContainer?.classList.add(`legend-${value}`);
    }
    get legendPlacement() { return this.getAttribute(attributes.LEGEND_PLACEMENT) || 'bottom'; }
    /**
     * Calculate the legend markup and return it
     * @param {string} setting The setting to use between name,shortName and abbreviatedName
     * @returns {string} The legend markup.
     */
    legendTemplate(setting = 'name') {
        let legend = `<div class="chart-legend">`;
        this.data.forEach((group, index) => {
            const text = group[setting] ? group[setting] : group.name;
            const patternSvg = group.pattern ? `<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
        <rect width="12" height="12" fill="url(#${group.pattern})"></rect>
      </svg>` : '';
            const colorClass = group.pattern ? '' : `color-${index + 1}`;
            legend += `<a href="#legend-${kebabCase(text)}" data-index="${index}" class="chart-legend-item"><div class="swatch ${colorClass}">${patternSvg}</div>${text}</a>`;
        });
        legend += `</div>`;
        return legend;
    }
    /**
     * Set the labels between name, shortName and abbreviatedName depending which fits best
     */
    adjustLabels() {
        let legend = this.shadowRoot?.querySelector('.chart-legend');
        if (legend && checkOverflow(legend)) {
            legend.outerHTML = this.legendTemplate('shortName');
        }
        legend = this.shadowRoot?.querySelector('.chart-legend');
        if (legend && checkOverflow(legend)) {
            legend.outerHTML = this.legendTemplate('abbreviatedName');
        }
    }
    /**
     * Adjust legends clickable
     * @param {boolean} selectable The selectable value
     * @returns {void}
     */
    legendsClickable(selectable) {
        if (!this.shadowRoot)
            return;
        const legends = [...this.shadowRoot.querySelectorAll('.chart-legend-item')];
        if (!legends[0])
            return;
        let isChanged = false;
        this.legendsHref = this.legendsHref || legends.map((el) => el.getAttribute('href'));
        if (selectable && !legends[0].hasAttribute('href')) {
            legends.forEach((el, index) => {
                el.setAttribute('href', this.legendsHref[index] ?? '#');
                el.removeAttribute('aria-hidden');
            });
            isChanged = true;
        }
        else if (!selectable && legends[0].hasAttribute('href')) {
            legends.forEach((el) => {
                el.setAttribute('aria-hidden', 'true');
                el.removeAttribute('href');
            });
            isChanged = true;
        }
        if (isChanged) {
            this[selectable ? 'attachLegendEvents' : 'detachLegendEvents']();
        }
    }
    /**
     * Setup handlers on legend elements
     * @returns {void}
     */
    attachLegendEvents() {
        const legend = this.shadowRoot?.querySelector('slot[name="legend"]');
        this.offEvent('click.chartlegend', legend);
        this.onEvent('click.chartlegend', legend, async (e) => {
            const target = e.target;
            if (target?.classList?.contains('chart-legend-item')) {
                e.preventDefault();
                const idx = target.getAttribute('data-index');
                this.setSelection?.(idx, true);
            }
        });
    }
    /**
     * Detatch legend handlers on elements
     * @returns {void}
     */
    detachLegendEvents() {
        const legend = this.shadowRoot?.querySelector('slot[name="legend"]');
        this.offEvent('click.chartlegend', legend);
    }
};
export default IdsChartLegendMixin;
//# sourceMappingURL=ids-chart-legend-mixin.js.map