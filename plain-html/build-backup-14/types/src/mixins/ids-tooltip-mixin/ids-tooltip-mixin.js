import { attributes } from '../../core/ids-attributes';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';
import '../../components/ids-tooltip/ids-tooltip';
/**
/**
 * A mixin that adds tooltip functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsTooltipMixin = (superclass) => class extends superclass {
    constructor(...args) {
        super(...args);
    }
    static get attributes() {
        return [
            ...superclass.attributes,
            attributes.TOOLTIP
        ];
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.handleTooltipEvents();
    }
    /**
     * Init the mixin events and states
     * @private
     */
    handleTooltipEvents() {
        if (!this.tooltip) {
            return;
        }
        this.offEvent('hoverend.tooltipmixin');
        this.onEvent('hoverend.tooltipmixin', this, () => {
            this.showTooltip();
        });
    }
    /**
     * Return the correct target element
     * @private
     * @returns {HTMLElement} The correct target element
     */
    get toolTipTarget() {
        const fieldContainerElem = this.fieldContainer;
        // `this.fieldContainer` targets any IDS Component that extends IdsInput
        if (fieldContainerElem instanceof HTMLElement || fieldContainerElem instanceof SVGElement) {
            return fieldContainerElem;
        }
        const triggerField = this.shadowRoot?.querySelector('ids-trigger-field');
        if (triggerField?.fieldContainer instanceof HTMLElement || triggerField?.fieldContainer instanceof SVGElement) {
            return triggerField.fieldContainer;
        }
        return this;
    }
    /**
     * Show the tooltip if available
     */
    showTooltip() {
        // For ellipsis tooltip check if overflowing and only show if it is
        if (this.nodeName === 'IDS-TEXT' && this.tooltip === 'true' && this.container && !(this.container.scrollWidth > this.container.clientWidth)) {
            return;
        }
        // Append an IDS Tooltip and show it
        const tooltip = document.createElement('ids-tooltip');
        let container = document.querySelector('ids-container');
        if (!container) {
            container = document.body;
        }
        container?.appendChild(tooltip);
        if (!tooltip.state) {
            tooltip.state = {};
        }
        tooltip.state.noAria = true;
        tooltip.target = this.toolTipTarget;
        // Handle Ellipsis Text if tooltip="true"
        tooltip.textContent = this.tooltip === 'true' ? this.textContent : this.tooltip;
        // Show it
        tooltip.visible = true;
        if (getClosest(this, 'ids-container')?.getAttribute('dir') === 'rtl')
            tooltip.popup?.setAttribute('dir', 'rtl');
        if (this.beforeTooltipShow)
            this.beforeTooltipShow(tooltip);
        // Remove it when closed
        tooltip.onEvent('hide.tooltipmixin', tooltip, () => {
            tooltip.remove();
        });
    }
    /**
     * Setup some special config for the tooltip
     * @param {any} tooltip The tooltip to configure
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeTooltipShow(tooltip) {
    }
    /**
     * Set the tooltip to a particular string
     * @param {string} value The tooltips value
     */
    set tooltip(value) {
        if (value) {
            this.setAttribute('tooltip', value);
            this.container?.setAttribute('tooltip', value);
        }
    }
    get tooltip() {
        return this.getAttribute('tooltip');
    }
};
export default IdsTooltipMixin;
//# sourceMappingURL=ids-tooltip-mixin.js.map