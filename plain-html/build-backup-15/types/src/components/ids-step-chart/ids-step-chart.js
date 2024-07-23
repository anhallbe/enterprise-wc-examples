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
import '../ids-color/ids-color';
import '../ids-icon/ids-icon';
import '../ids-text/ids-text';
import Base from './ids-step-chart-base';
import styles from './ids-step-chart.scss';
/**
 * IDS Step Chart Component
 * @type {IdsStepChart}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part icon - slot for completed message icons
 */
let IdsStepChart = class IdsStepChart extends Base {
    internalStepsInProgress = [];
    constructor() {
        super();
    }
    /**
     * Invoked each time the custom element is add into a document-connected element
     */
    connectedCallback() {
        super.connectedCallback();
    }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            ...super.attributes,
            attributes.COLOR,
            attributes.COMPLETED_LABEL,
            attributes.LABEL,
            attributes.PROGRESS_COLOR,
            attributes.STEP_NUMBER,
            attributes.STEPS_IN_PROGRESS,
            attributes.VALUE
        ];
    }
    /**
     * @returns {string} returns the current ids color variable
     * for completed steps
     */
    get color() { return this.getAttribute(attributes.COLOR); }
    /**
     * @param {string} value sets the color variable that is used to fill
     * completed steps
     */
    set color(value) {
        if (value && this.getAttribute(attributes.COLOR) !== value) {
            this.setAttribute('color', value);
            this.container?.querySelectorAll(`.complete`).forEach((completedStep) => {
                completedStep.setAttribute('color', value);
            });
        }
    }
    /**
     * @returns {string} returns the text for the step charts secondary label
     */
    get completedLabel() { return this.getAttribute(attributes.COMPLETED_LABEL) ?? ''; }
    /**
     * @param {string} value set the text for the secondary label
     */
    set completedLabel(value) {
        if (this.getAttribute(attributes.COMPLETED_LABEL) !== value) {
            this.setAttribute('completed-label', value);
            const labelElem = this.container?.querySelector('.completed-label');
            if (labelElem)
                labelElem.innerHTML = `${value}`;
        }
    }
    /**
     * @returns {string} returns the current primary label text
     */
    get label() { return this.getAttribute(attributes.LABEL) ?? ''; }
    /**
     * @param {string} value set the primary label for the step chart
     */
    set label(value) {
        if (this.getAttribute(attributes.LABEL) !== value) {
            this.setAttribute('label', value);
            const labelElem = this.container?.querySelector('.label');
            if (labelElem)
                labelElem.innerHTML = `${value}`;
        }
    }
    /**
     * @returns {string} the ids color variable that
     * in progress steps are currently set with
     */
    get progressColor() { return this.getAttribute(attributes.PROGRESS_COLOR); }
    /**
     * @param {string} value sets the ids color variable that in progress steps use
     */
    set progressColor(value) {
        if (this.getAttribute(attributes.PROGRESS_COLOR) !== value) {
            this.setAttribute('progress-color', String(value));
            this.container?.querySelectorAll(`.in-progress`).forEach((element) => {
                element.setAttribute('color', String(value));
            });
        }
    }
    /**
     * @returns {number} the current number of steps displayed in the step chart
     */
    get stepNumber() { return parseInt(this.getAttribute(attributes.STEP_NUMBER) ?? ''); }
    /**
     * @param {string|number} value sets the number of steps in the step chart
     */
    set stepNumber(value) {
        if (this.getAttribute(attributes.STEP_NUMBER) !== value) {
            this.setAttribute('step-number', String(value));
            if (this.container)
                this.container.innerHTML = this.template();
            this.#updateColor();
        }
    }
    /**
     * @returns {Array} an array of the steps that have been marked as in progress
     */
    get stepsInProgress() {
        return this.internalStepsInProgress;
    }
    /**
     * @param {Array} value updates the list of steps that are marked as
     * in progress
     */
    set stepsInProgress(value) {
        if (typeof value === 'string')
            value = value.split(',');
        this.internalStepsInProgress = value.map(Number);
        this.#updateColor();
    }
    /**
     * @returns {number} the number of the last step to be filled in
     */
    get value() { return parseInt(this.getAttribute(attributes.VALUE) ?? ''); }
    /**
     * @param {string} value sets the number of the last step in the array to be filled in
     */
    set value(value) {
        this.setAttribute('value', String(value));
        this.#updateColor();
    }
    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        let labelContainer = `<ids-text class="label" id="chart-label" font-size="16">${this.label}</ids-text>`;
        let rightContainer = ``;
        let stepChart = '';
        let stepDiv = '';
        let template = '';
        for (let i = 1; i <= this.stepNumber; i++) {
            let classes = 'step';
            let color = ``;
            if (this.internalStepsInProgress && this.internalStepsInProgress.length > 0
                && this.progressColor
                && this.internalStepsInProgress.includes(i)) {
                classes += ` in-progress`;
                color = `${this.progressColor}`;
            }
            else if (i <= this.value) {
                color = `${this.color}`;
                classes += ` complete`;
            }
            else {
                color = `slate02`;
                classes += ` untouched`;
            }
            stepDiv += `<div class="${classes}" color="${color}" part="step"></div>`;
        }
        stepChart = `<div class="step-chart-container" part="step-chart"> ${stepDiv} </div>`;
        if (this.completedLabel) {
            rightContainer += `<ids-text class="completed-label" font-size="14">${this.completedLabel}</ids-text>`;
        }
        else {
            rightContainer += `<ids-text class="completed-label" font-size="14"></ids-text>`;
        }
        rightContainer += `<slot name="icon"></slot>`;
        labelContainer += `<div class="secondary-label">${rightContainer}</div>`;
        template = `<div class="ids-step-chart"><div class="step-label-container">${labelContainer}</div>${stepChart}</div>`;
        return template;
    }
    /**
     * updates the colors and classes of the step divs
     */
    #updateColor() {
        this.container?.querySelectorAll(`.step`).forEach((element, index) => {
            element.className = '';
            if (this.internalStepsInProgress
                && this.internalStepsInProgress.length > 0
                && this.progressColor
                && this.internalStepsInProgress.includes(index + 1)) {
                element.classList.add(`step`, `in-progress`);
                element.setAttribute(`color`, `${this.progressColor}`);
            }
            else if (index <= this.value - 1) {
                element.setAttribute(`color`, `${this.color}`);
                element.classList.add(`step`, `complete`);
            }
            else {
                element.setAttribute(`color`, `slate02`);
                element.classList.add(`step`, `untouched`);
            }
        });
    }
};
IdsStepChart = __decorate([
    customElement('ids-step-chart'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsStepChart);
export default IdsStepChart;
//# sourceMappingURL=ids-step-chart.js.map