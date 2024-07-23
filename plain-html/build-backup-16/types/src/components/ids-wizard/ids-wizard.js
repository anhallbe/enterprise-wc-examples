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
import Base from './ids-wizard-base';
// Dependencies
import '../ids-text/ids-text';
import styles from './ids-wizard.scss';
/**
 * IDS Wizard Component
 * @type {IdsWizard}
 * @inherits IdsElement
 * @part wizard - the overall wizard container
 * @part step - a step on the wizard
 * @part path-segment - the line between a step and another
 */
let IdsWizard = class IdsWizard extends Base {
    constructor() {
        super();
    }
    /**
     * maps objects to href sets;
     * this lets us know that we shouldn't re-use
     * a link with a similar label when constructing them
     */
    hrefsAssignedSet = new Set();
    /**
     * whether to update callbacks after
     * a render() event
     */
    shouldUpdateCallbacks = true;
    /**
     * stored to prevent re-calling encodeURI(label)
     */
    hrefURIs = [];
    stepObserver = new MutationObserver((mutations) => {
        for (const { type } of mutations) {
            if (type === 'childList') {
                this.shouldUpdateCallbacks = true;
                this.updateHrefURIs();
                this.render(true);
            }
        }
    });
    resizeObserver = new ResizeObserver(() => {
        this.fitAndSizeElements();
    });
    /**
     * fits and resizes all labels to fit
     * within the space available
     */
    fitAndSizeElements() {
        const labelEls = [];
        for (let i = 0; i < this.children.length; i++) {
            const labelEl = this.getStepEl(this, i + 1)?.children[1];
            if (labelEl) {
                labelEl.style.maxWidth = 'unset';
                labelEls.push(labelEl);
            }
        }
        window.requestAnimationFrame(() => {
            const stepRects = this.resizeStepLabelRects(this);
            for (let i = 0; i < stepRects.length; i++) {
                const { width } = stepRects[i];
                labelEls[i].style.maxWidth = `${width}px`;
            }
        });
    }
    /**
     * Checks whether bounding box/rects retrieved
     * from elem's bounding box are colliding horizontally
     * @param {DOMRect} r1 elem1's bounding box
     * @param {DOMRect} r2 elem2's bounding box
     * @returns {boolean} whether there is collision on x-axis
     */
    areRectsHColliding(r1, r2) {
        return (((r1.left + r1.width) > r2.left)
            && ((r1.right - r1.width) < r2.right));
    }
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [attributes.STEP_NUMBER, attributes.CLICKABLE];
    }
    /**
     * whether or not a step is clickable
     * @private
     * @param {number} stepNumber the step number to check
     * @returns {boolean} whether or not the step is clickable
     */
    isStepClickable(stepNumber) {
        const stepEl = this.children[stepNumber - 1];
        return ((!this.clickable && (stepEl.getAttribute(attributes.CLICKABLE) !== 'false'))
            || stepEl.getAttribute(attributes.CLICKABLE) !== 'false');
    }
    /**
     * Create the Template for the contents
     * @returns {string} the template to render
     */
    template() {
        let stepsHtml = '';
        // iterate through ids-wizard-step
        // lightDOM to create shadowDOM markup
        const stepIndex = this.stepNumber - 1;
        for (const [i, stepEl] of [...this.children].entries()) {
            const isCurrentStep = stepIndex === i;
            const isVisitedStep = i <= stepIndex;
            const isClickable = this.isStepClickable(i + 1);
            const label = stepEl.textContent;
            const hrefUrl = this.hrefURIs?.[i];
            let stepClassName = 'step';
            stepClassName += isCurrentStep ? ' current' : '';
            stepClassName += isVisitedStep ? ' visited' : '';
            stepClassName += isClickable ? ' clickable' : '';
            const pathSegmentHtml = (i >= this.children.length - 1) ? '' : (`<div
        class="path-segment${stepIndex <= i ? '' : ' visited'}
        part="path-segment"
      ></div>`);
            const stepLabelHtml = (`<div
        class="step-label"
        step-number=${i + 1}
      >
        <ids-text
          overflow="ellipsis"
          size=18
          font-weight="${isCurrentStep ? 'bold' : 'normal'}"
          color="unset"
        >${label}
        </ids-text>
      </div>`);
            let anchorAttribsHtml = `name="#${label}" title="${label}"`;
            anchorAttribsHtml += (!isClickable || isCurrentStep) ? '' : ` href="#${hrefUrl}"`;
            stepsHtml += (`<a
        class="${stepClassName}"
        part="step"
        step-number="${i + 1}"
        tabindex="${isClickable ? '0' : '-1'}"'
        ${anchorAttribsHtml}
      >
        <div class="step-marker">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" />
          </svg>
          ${!isCurrentStep ? '' : (`<svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" />
            </svg>`)}
        </div>
        ${stepLabelHtml}
      </a>
      ${pathSegmentHtml}`);
        }
        return (`<div class="ids-wizard">
      <nav class="steps">
        ${stepsHtml}
      </nav>
    </div>`);
    }
    /**
     * Get the step number
     * @returns {number|string} step number (1-based)
     */
    get stepNumber() {
        const stepNumber = parseInt(this.getAttribute(attributes.STEP_NUMBER) ?? '');
        if (Number.isNaN(stepNumber)) {
            return -1;
        }
        return stepNumber;
    }
    /**
     * Set the step number
     * @param {number|string} value step number (1-based)
     */
    set stepNumber(value) {
        if (Number.isNaN(Number(value))) {
            throw new Error('ids-wizard: Invalid step number provided');
        }
        const v = parseInt(value);
        if (v <= 0) {
            throw new Error('ids-wizard: step number should be > 0');
        }
        else if (v > this.children?.length) {
            throw new Error('ids-wizard: step number should be below step-count');
        }
        this.setAttribute('step-number', v.toString());
    }
    set clickable(value) {
        this.setAttribute(attributes.CLICKABLE, String(value !== 'false'));
    }
    get clickable() {
        return this.getAttribute(attributes.CLICKABLE);
    }
    connectedCallback() {
        super.connectedCallback();
        this.updateHrefURIs();
        if (window.location.hash.length) {
            const uriHash = window.location.hash.substr(1);
            const stepNumber = this.hrefURIs.indexOf(uriHash) + 1;
            if (stepNumber) {
                this.stepNumber = stepNumber;
            }
        }
        this.stepObserver.disconnect();
        // set up observer for monitoring if a child element changed
        this.stepObserver.observe(this, {
            childList: true,
            attributes: true,
            subtree: true
        });
        this.#afterConnectedCallback();
    }
    /**
     * Binds associated callbacks and cleans
     * old handlers when template refreshes
     */
    #afterConnectedCallback() {
        if (!this.shouldUpdateCallbacks) {
            return;
        }
        // stop observing changes before updating DOM
        this.resizeObserver.disconnect();
        // query through all steps and add click callbacks
        for (let stepNumber = 1; stepNumber <= this.children.length; stepNumber++) {
            if (!this.isStepClickable(stepNumber)) {
                continue;
            }
            const stepEl = this.shadowRoot?.querySelector(`.step[step-number="${stepNumber}"]`);
            const onClickStep = () => {
                this.stepNumber = `${stepNumber}`;
            };
            this.offEvent(`click.step.${stepNumber}`, this);
            this.onEvent(`click.step.${stepNumber}`, stepEl, onClickStep);
        }
        // set up observer for resize which prevents overlapping labels
        if (this.container)
            this.resizeObserver.observe(this.container);
        this.shouldUpdateCallbacks = false;
    }
    /**
     * updates hrefURIs at select points
     * so we don't need to recalculate
     * when setting clickable or step number
     * again; also allows us to easily run
     * calculations to use unique-but-meaningful
     * links
     *
     * @private
     */
    updateHrefURIs() {
        this.hrefURIs = [...this.children].map((el, i) => {
            let uriHash = encodeURI(el.textContent ?? '');
            let collisionCount;
            // if an href was already used, and it isn't
            // used by this component's children,
            // then increase the number in href hash
            while ((this.hrefURIs?.[i] !== uriHash)
                && this.hrefsAssignedSet.has?.(uriHash)) {
                collisionCount = collisionCount ? (collisionCount + 1) : 1;
                uriHash = `${encodeURI(el.textContent ?? '')}-${collisionCount}`;
            }
            this.hrefsAssignedSet.add(uriHash);
            return uriHash;
        });
    }
    /**
     * retrieves a step marker element within
     * a wizard's shadow DOM
     *
     * @param {*} wizardEl source Wizard
     * @param {*} stepNumber step number
     * @returns {HTMLElement} the step element
     */
    getStepEl(wizardEl, stepNumber) {
        return wizardEl?.shadowRoot?.querySelector(`.step[step-number="${stepNumber}"]`);
    }
    /**
     * Recursively resize steps for an element so they don't collide;
     * (only pass the wizard element to args)
     * @param {Array} args the arguments; should be IdsWizard element as only
     * user-defined element
     * @returns {Array<DOMRect>} array of rects for step positioning/sizing
     */
    resizeStepLabelRects(...args) {
        const w = args[0];
        const n = args[1] || 1;
        let rects = args[2] || [];
        let totalWidth = args[3] || -1;
        // if this is the initial run, populate the
        // rects array and grab total width
        if (totalWidth === -1) {
            const wizardRect = w.getBoundingClientRect();
            totalWidth = wizardRect.width;
            for (let i = 0; i < w.children.length; i++) {
                const [, labelEl] = this.getStepEl(w, i + 1)?.children ?? [];
                const labelRect = labelEl.getBoundingClientRect();
                const offsetRect = {
                    width: labelRect.width,
                    left: labelRect.left,
                    right: labelRect.right
                };
                rects.push(offsetRect);
            }
        }
        if (rects.length <= 1) {
            return rects;
        }
        const r1 = rects[n - 1];
        const r2 = rects[n];
        while (this.areRectsHColliding(r1, r2)) {
            const isR1LeftAligned = n === 1;
            const isR2RightAligned = n === rects.length - 1;
            let r1Mult = Math.round((r1.width / r2.width) * 0.5);
            let r2Mult = Math.round((r2.width / r1.width) * 0.5);
            if (r1.width <= 16) {
                r1Mult = 0.01;
            }
            if (r2.width <= 16) {
                r2Mult = 0.01;
            }
            if (isR1LeftAligned) {
                r1Mult *= 0.5;
            }
            if (isR2RightAligned) {
                r2Mult *= 0.5;
            }
            // gradually subtract width
            r1.width -= 8 * r1Mult;
            r2.width -= 8 * r2Mult;
            if (isR1LeftAligned) {
                r1.right -= 8 * r1Mult;
                r2.right -= 4 * r2Mult;
                r2.left += 4 * r2Mult;
            }
            if (isR2RightAligned) {
                r2.left += 8 * r2Mult;
                r1.right -= 4 * r1Mult;
                r1.left += 4 * r1Mult;
            }
            if (!isR1LeftAligned) {
                r1.left += 4 * r1Mult;
                r1.right -= 4 * r1Mult;
            }
            if (!isR2RightAligned) {
                r2.left += 4 * r2Mult;
                r2.right -= 4 * r2Mult;
            }
        }
        // update rect refs after morphing them above
        rects[n - 1] = r1;
        rects[n] = r2;
        // recursive case
        if (n < rects.length - 1) {
            rects = this.resizeStepLabelRects(w, n + 1, rects, totalWidth);
        }
        // pass back rect changes
        return rects;
    }
};
IdsWizard = __decorate([
    customElement('ids-wizard'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsWizard);
export default IdsWizard;
//# sourceMappingURL=ids-wizard.js.map