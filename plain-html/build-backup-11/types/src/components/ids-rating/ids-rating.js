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
import Base from './ids-rating-base';
import styles from './ids-rating.scss';
/**
 * IDS Rating Component
 * @type {IdsRating}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
let IdsRating = class IdsRating extends Base {
    constructor() {
        super();
    }
    ratingArr = [];
    connectedCallback() {
        super.connectedCallback();
        this.ratingArr = [...this.container?.children ?? []];
        if (!this.readonly) {
            this.#attachEventHandlers();
        }
        else {
            this.#updateHalfStar(this.ratingArr);
        }
        if (this.getAttribute('value'))
            this.value = this.getAttribute('value') || '0';
    }
    /**
     * Create the template for the rating contents
     * @returns {string} The template
     */
    template() {
        let html = '<div class="rating">';
        for (let i = 0; i < this.stars; i++) {
            html += `<ids-icon class="star star-${i}" role="button" aria-label="${i + 1} out of 5 Stars" icon="star-outlined" tabindex="0" size="${this.size}"></ids-icon>`;
        }
        html += '</div>';
        return html;
    }
    /**
     * @returns {Array<string>} this component's observable properties
     */
    static get attributes() {
        return [
            ...super.attributes,
            attributes.CLICKABLE,
            attributes.COMPACT,
            attributes.MODE,
            attributes.READONLY,
            attributes.SIZE,
            attributes.STARS,
            attributes.VALUE
        ];
    }
    /**
     * Sets the value attribute
     * @param {string|number} val string value from the value attribute
     */
    set value(val) {
        const isReadonly = stringToBool(this.readonly);
        if (val && !isReadonly) {
            this.ratingArr.forEach((element) => {
                element.setAttribute('icon', 'star-outlined');
                element.classList.remove('is-half');
                element.classList.remove('active');
            });
            const valueArray = this.ratingArr;
            const starArray = valueArray.slice(0, parseInt(val));
            starArray.forEach((element) => {
                element.setAttribute('icon', 'star-filled');
                element.classList.add('active');
            });
            this.setAttribute('value', val.toString());
        }
        if (val && isReadonly) {
            this.ratingArr.forEach((element) => {
                element.setAttribute('icon', 'star-outlined');
                element.classList.remove('active');
                element.classList.remove('is-half');
            });
            this.#updateHalfStar(this.ratingArr);
        }
    }
    get value() {
        return Number(this.getAttribute('value') || '0');
    }
    /**
     * Sets the stars attribute
     * @param {string} num string value from the stars attribute
     */
    set stars(num) {
        if (num) {
            this.setAttribute('stars', num.toString());
        }
    }
    get stars() {
        return this.getAttribute('stars') || 5;
    }
    /**
     * Sets the readonly attribute
     * @param {string} ro string value from the readonly attribute
     */
    set readonly(ro) {
        if (stringToBool(ro)) {
            this.offEvent('click', this.container);
            this.#updateHalfStar(this.ratingArr);
            this.setAttribute(attributes.READONLY, '');
        }
        else {
            this.#attachEventHandlers();
            this.removeAttribute(attributes.READONLY);
        }
    }
    get readonly() {
        return stringToBool(this.getAttribute('readonly'));
    }
    /**
     * Sets the size attribute
     * @param {string} s string value from the size attribute
     */
    set size(s) {
        if (s) {
            this.ratingArr.forEach((element) => element.setAttribute('size', s.toString()));
            this.setAttribute('size', s.toString());
        }
    }
    get size() {
        return this.getAttribute('size') || 'large';
    }
    /**
     * Handle events
     * @private
     * @returns {void}
     */
    #attachEventHandlers() {
        this.onEvent('click', this.container, (e) => this.updateStars(e));
        this.onEvent('keyup', this.container, (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && this.readonly === false) {
                this.updateStars(e);
            }
        });
    }
    /**
     * Sets star state, active class and icon attribute
     * @param {any} event event target
     */
    updateStars(event) {
        const activeElements = this.ratingArr.filter((item) => item.classList.contains('active'));
        let attrName = 'star-filled';
        let action = 'add';
        for (const ratingOption of this.ratingArr) {
            ratingOption.classList[action]('active');
            ratingOption.setAttribute('icon', attrName);
            if (ratingOption === event.target) {
                action = 'remove';
                attrName = 'star-outlined';
            }
            if (activeElements.length === 1 && event.target.classList.contains('star-0')) {
                activeElements[0].classList.remove('active');
                activeElements[0].setAttribute('icon', 'star-outlined');
            }
        }
        this.updateValue(this.ratingArr);
    }
    /**
     * Sets and updates value attribute
     * @param {any} arr NodeList
     */
    updateValue(arr) {
        const val = [...arr];
        const value = val.filter((el) => el.classList.contains('active'));
        this.setAttribute('value', String(value.length));
    }
    /**
     * Sets and updates value attribute for halfstar
     * @param {any} arr NodeList
     */
    #updateHalfStar(arr) {
        const value = this.value;
        const roundValue = Math.round(value);
        for (let i = 0; i < roundValue; i++) {
            arr[i]?.classList.add('active');
            arr[i]?.setAttribute('icon', 'star-filled');
        }
        if (value < roundValue) {
            const activeArr = arr.filter((act) => act.classList.contains('active'));
            const lastItem = activeArr[activeArr.length - 1];
            lastItem?.classList.add('is-half');
            lastItem?.setAttribute('icon', 'star-half');
        }
    }
};
IdsRating = __decorate([
    customElement('ids-rating'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsRating);
export default IdsRating;
//# sourceMappingURL=ids-rating.js.map