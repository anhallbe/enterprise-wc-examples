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
import Base from './ids-upload-base';
import '../ids-trigger-field/ids-trigger-field';
import '../ids-trigger-field/ids-trigger-button';
import '../ids-text/ids-text';
import '../ids-icon/ids-icon';
import styles from './ids-upload.scss';
// Input id
const ID = 'ids-upload-id';
/**
 * IDS Upload Component
 * @type {IdsUpload}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsEventsMixin
 * @mixes IdsFieldHeightMixin
 * @mixes IdsLabelStateParentMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 * @mixes IdsTooltipMixin
 * @part container - the main container element
 * @part label - the label element
 * @part input - the visible input element
 * @part button - the trigger input element
 */
let IdsUpload = class IdsUpload extends Base {
    constructor() {
        super();
    }
    isFormComponent = true;
    isFilePickerOpened = false;
    trigger;
    fileInput;
    files;
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */
    static get attributes() {
        return [
            ...super.attributes,
            attributes.ACCEPT,
            attributes.DISABLED,
            attributes.LABEL,
            attributes.LABEL_FILETYPE,
            attributes.LABEL_REQUIRED,
            attributes.MULTIPLE,
            attributes.NO_MARGINS,
            attributes.PLACEHOLDER,
            attributes.SIZE,
            attributes.READONLY,
            attributes.TABBABLE,
            attributes.TEXT_ELLIPSIS,
            attributes.TRIGGER_LABEL,
            attributes.VALIDATE,
            attributes.VALIDATION_EVENTS,
            attributes.VALUE
        ];
    }
    /**
     * List of available color variants for this component
     * @returns {Array<string>}
     */
    colorVariants = ['alternate-formatter'];
    /**
     * Push color variant to the trigger-field element
     * @returns {void}
     */
    onColorVariantRefresh() {
        this.textInput.colorVariant = this.colorVariant;
    }
    onLabelChange() {
        if (this.textInput)
            this.textInput.label = this.label;
    }
    /**
     * Push label-state to the trigger-field element
     * @returns {void}
     */
    onLabelStateChange() {
        this.textInput.labelState = this.labelState;
    }
    onLabelRequiredChange() {
        if (this.textInput)
            this.textInput.labelRequired = this.labelRequired;
    }
    /**
     * Push field-height/compact to the trigger-field element
     * @param {string} val the new field height setting
     */
    onFieldHeightChange(val) {
        if (val) {
            const attr = val === 'compact' ? { name: 'compact', val: '' } : { name: 'field-height', val };
            this.textInput.setAttribute(attr.name, attr.val);
        }
        else {
            this.textInput.removeAttribute('compact');
            this.textInput.removeAttribute('field-height');
        }
    }
    /**
     * Custom Element `connectedCallback` implementation
     * @returns {void}
     */
    connectedCallback() {
        super.connectedCallback();
        this.trigger = this.shadowRoot?.querySelector('.trigger');
        this.fileInput = this.shadowRoot?.querySelector(`#${ID}`);
        this.files = this.fileInput?.files;
        this.#attachEventHandlers();
    }
    /**
     * Inner template contents
     * @returns {string} The template
     */
    template() {
        const trueVal = (v) => stringToBool(v);
        const accept = this.accept ? ` accept="${this.accept}"` : '';
        const dirtyTracker = trueVal(this.dirtyTracker) ? ` dirty-tracker="${this.dirtyTracker}"` : '';
        const disabled = trueVal(this.disabled) ? ` disabled="${this.disabled}"` : '';
        const readonlyBG = trueVal(this.readonly) ? '' : ' readonly-background';
        const textEllipsis = trueVal(this.textEllipsis) ? ' text-ellipsis="true"' : '';
        const label = this.label ? ` label="${this.label}"` : '';
        const placeholder = this.placeholder ? ` placeholder="${this.placeholder}"` : '';
        const multiple = trueVal(this.multiple) ? ` multiple="multiple"` : '';
        const readonlyBtn = trueVal(this.readonly) ? ` readonly="true"` : '';
        const clearableForced = ` clearable-forced="${this.hasAccess}"`;
        const size = this.size ? ` size="${this.size}"` : '';
        const triggerLabel = this.triggerLabel || this.triggerLabelDefault;
        const labelFiletype = this.labelFiletype || this.labelFiletypeDefault;
        const validate = this.validate ? ` validate="${this.validate}"` : '';
        const validationEvents = ` validation-events="${this.validationEvents || this.validationEventsDefault}"`;
        const value = this.value ? ` value="${this.value}"` : '';
        const colorVariant = this.colorVariant ? ` color-variant="${this.colorVariant}"` : '';
        const fieldHeight = this.fieldHeight ? ` field-height="${this.fieldHeight}"` : '';
        const labelState = this.labelState ? ` label-state="${this.labelState}"` : '';
        const compact = this.compact ? ' compact' : '';
        const noMargins = this.noMargins ? ' no-margins' : '';
        return `
      <div class="ids-upload" part="container">
        <label for="${ID}" class="ids-upload-filetype-label" aria-hidden="true" tabindex="-1">
          <ids-text audible="true" class="label-filetype" part="label">${labelFiletype}</ids-text>
        </label>
        <input id="${ID}" type="file" class="ids-upload-filetype" aria-hidden="true" tabindex="-1"${accept}${multiple}${value} />
        <ids-trigger-field
          readonly="true"
          ${readonlyBG}
          ${colorVariant}${fieldHeight}${compact}${noMargins}${labelState}
          ${clearableForced}${dirtyTracker}${disabled}${label}${placeholder}${size}${validate}${validationEvents}${textEllipsis}${value}
          css-class="ids-upload"
          part="input"
        >
          <ids-trigger-button slot="trigger-end" part="button" class="trigger"${disabled}${readonlyBtn}>
            <ids-text audible="true" class="trigger-label">${triggerLabel}</ids-text>
            <ids-icon icon="folder"></ids-icon>
          </ids-trigger-button>
        </ids-trigger-field>
      </div>`;
    }
    /**
     * Callback for dirty tracker setting change
     * @param {boolean} value The changed value
     * @returns {void}
     */
    onDirtyTrackerChange(value) {
        if (this.textInput)
            this.textInput.dirtyTracker = value;
    }
    get input() {
        return this.container?.querySelector('ids-trigger-field');
    }
    /**
     * Clear the value
     * @returns {void}
     */
    clear() {
        if (this.hasAccess) {
            this.value = '';
        }
    }
    /**
     * Open file picker window
     * @returns {void}
     */
    open() {
        if (this.hasAccess) {
            this.isFilePickerOpened = true; // track cancel button on file picker window
            this.fileInput?.click();
        }
    }
    /**
     * Dispatch change event
     * @private
     * @param {object} e Actual event
     * @returns {void}
     */
    dispatchChangeEvent(e) {
        /**
         * Trigger event on parent and compose the args
         * will fire change event
         * @private
         * @param {object} elem Actual event
         * @param {string} value The updated input element value
         */
        this.triggerEvent('change', this, {
            detail: {
                files: this.fileInput?.files,
                textValue: this.value,
                elem: this,
                nativeEvent: e
            }
        });
    }
    /**
     * Handle window focus event, track file picker window cancel button
     * @private
     * @returns {void}
     */
    handleWindowFocusEvent() {
        this.onEvent('focus', window, () => {
            if (this.isFilePickerOpened) {
                this.isFilePickerOpened = false;
                // Need timeout because `focus` get before the `files` on fileInput
                setTimeout(() => {
                    const files = this.fileInput?.files;
                    const eventName = `files${files?.length ? 'select' : 'cancel'}`;
                    this.triggerEvent(eventName, this.fileInput, {
                        detail: { files, elem: this }
                    });
                }, 20);
            }
        });
    }
    /**
     * Handle fileInput change event
     * @private
     * @returns {void}
     */
    handleFileInputChangeEvent() {
        this.onEvent('change', this.fileInput, (e) => {
            const files = this.fileInput?.files;
            this.value = [].slice.call(files).map((f) => f.name).join(', ');
            this.dispatchChangeEvent(e);
        });
    }
    /**
     * Handle fileInput filescancel event
     * @private
     * @returns {void}
     */
    handleFileInputCancelEvent() {
        this.onEvent('filescancel', this.fileInput, () => {
            this.textInput.input?.dispatchEvent(new Event('blur', { bubbles: true }));
        });
    }
    /**
     * Handle drag-drop event
     * @private
     * @returns {void}
     */
    handleTextInputDragDrop() {
        if (this.hasAccess) {
            this.onEvent('dragenter', this.textInput, () => {
                this.fileInput?.style.setProperty('z-index', '1');
            });
            const events = ['dragleave', 'dragend', 'drop'];
            events.forEach((eventName) => {
                this.onEvent(eventName, this.textInput, () => {
                    setTimeout(() => {
                        this.fileInput?.style.setProperty('z-index', '');
                    }, 1);
                });
            });
        }
    }
    /**
     * Handle keydown event
     * @private
     * @returns {void}
     */
    handleTextInputKeydown() {
        this.onEvent('keydown', this.textInput, (e) => {
            const allow = ['Backspace', 'Enter', 'Space'];
            const key = e.code;
            const isClearBtn = e.path?.filter((p) => p?.classList?.contains('btn-clear')).length > 0;
            if (allow.indexOf(key) > -1 && !isClearBtn) {
                if (key === 'Backspace') {
                    this.clear();
                    this.dispatchChangeEvent(e);
                }
                else {
                    this.open();
                }
                e.preventDefault();
            }
        });
    }
    /**
     * Handle trigger click event
     * @private
     * @returns {void}
     */
    handleTriggerClickEvent() {
        this.onEvent('click', this.trigger, () => {
            this.open();
        });
    }
    /**
     * Handle input cleared event
     * @private
     * @returns {void}
     */
    handleInputClearedEvent() {
        this.onEvent('cleared', this.textInput, (e) => {
            this.clear();
            this.dispatchChangeEvent(e);
        });
    }
    /**
     * Handle events
     * @private
     * @returns {void}
     */
    #attachEventHandlers() {
        this.handleWindowFocusEvent();
        this.handleFileInputChangeEvent();
        this.handleFileInputCancelEvent();
        this.handleTextInputDragDrop();
        this.handleTextInputKeydown();
        this.handleTriggerClickEvent();
        this.handleInputClearedEvent();
    }
    /**
     * Get trigger field element as textInput
     * @returns {any} The textInput element
     */
    get textInput() {
        return this.shadowRoot?.querySelector('ids-trigger-field');
    }
    /**
     * Default label for filetype
     * @private
     * @returns {string} default label value
     */
    get labelFiletypeDefault() {
        const instructions = ', Press Enter to Browse for files';
        return `${(this.label || '')}${instructions}`;
    }
    /**
     * Default label for trigger button
     * @private
     * @returns {string} default label value
     */
    get triggerLabelDefault() { return `trigger button for ${(this.label || 'fileupload')}`; }
    /**
     * Default validation events
     * @private
     * @returns {string} default validation events value
     */
    get validationEventsDefault() { return `blur change`; }
    /**
     * Has access to use, if not disabled or readonly
     * @private
     * @returns {boolean} true, if not disabled or readonly
     */
    get hasAccess() {
        const trueVal = (v) => stringToBool(v);
        return !(trueVal(this.disabled) || trueVal(this.readonly));
    }
    /**
     * Set `accept` attribute
     * @param {string | null} value `accept` attribute
     */
    set accept(value) {
        if (value) {
            this.setAttribute(attributes.ACCEPT, value);
            this.fileInput?.setAttribute(attributes.ACCEPT, value);
        }
        else {
            this.removeAttribute(attributes.ACCEPT);
            this.fileInput?.removeAttribute(attributes.ACCEPT);
        }
    }
    get accept() { return this.getAttribute(attributes.ACCEPT); }
    /**
     * Set `disabled` attribute
     * @param {boolean|string} value If true will set `disabled` attribute
     */
    set disabled(value) {
        const val = stringToBool(value);
        if (val) {
            this.setAttribute(attributes.DISABLED, val.toString());
            if (this.textInput)
                this.textInput.disabled = true;
            if (this.trigger)
                this.trigger.disabled = true;
        }
        else {
            this.removeAttribute(attributes.DISABLED);
            if (this.textInput) {
                this.textInput.disabled = false;
                this.textInput.readonly = this.readonly;
            }
            if (this.trigger)
                this.trigger.disabled = false;
        }
    }
    get disabled() {
        return stringToBool(this.getAttribute(attributes.DISABLED));
    }
    /**
     * Set the `label` text of input label
     * @param {string} value of the `label` text property
     */
    set label(value) {
        if (value) {
            this.setAttribute(attributes.LABEL, value);
            if (this.textInput)
                this.textInput.label = value;
        }
        else {
            this.removeAttribute(attributes.LABEL);
            if (this.textInput)
                this.textInput.label = null;
        }
    }
    get label() {
        return this.getAttribute(attributes.LABEL) ?? '';
    }
    /**
     * Set the label for filetype
     * @param {string | null} value The label for filetype
     */
    set labelFiletype(value) {
        const labelEL = this.shadowRoot?.querySelector('.label-filetype');
        if (value) {
            this.setAttribute(attributes.LABEL_FILETYPE, value);
            if (labelEL)
                labelEL.textContent = value;
        }
        else {
            this.removeAttribute(attributes.LABEL_FILETYPE);
            if (labelEL)
                labelEL.textContent = this.labelFiletypeDefault;
        }
    }
    get labelFiletype() {
        return this.getAttribute(attributes.LABEL_FILETYPE);
    }
    /**
     * Set `label-required` attribute
     * @param {boolean|string} value The `label-required` attribute
     */
    set labelRequired(value) {
        if (typeof value === 'boolean' || typeof value === 'string') {
            this.setAttribute(attributes.LABEL_REQUIRED, value.toString());
        }
        else {
            this.removeAttribute(attributes.LABEL_REQUIRED);
        }
        this.textInput.labelRequired = this.labelRequired;
    }
    get labelRequired() {
        const value = this.getAttribute(attributes.LABEL_REQUIRED);
        return value !== null ? stringToBool(value) : true;
    }
    /**
     * Set the `multiple` attribute for filetype
     * @param {boolean|string} value of the `multiple` property
     */
    set multiple(value) {
        this.fileInput = this.shadowRoot?.querySelector(`#${ID}`);
        const val = stringToBool(value);
        if (val) {
            this.setAttribute(attributes.MULTIPLE, val.toString());
            this.fileInput?.setAttribute(attributes.MULTIPLE, 'multiple');
            return;
        }
        this.removeAttribute(attributes.MULTIPLE);
        this.fileInput?.removeAttribute(attributes.MULTIPLE);
    }
    get multiple() {
        return stringToBool(this.getAttribute(attributes.MULTIPLE));
    }
    /**
     * Sets the no margins attribute
     * @param {boolean} value The value for no margins attribute
     */
    set noMargins(value) {
        if (typeof value === 'boolean' || typeof value === 'string') {
            this.setAttribute(attributes.NO_MARGINS, value.toString());
        }
        else {
            this.removeAttribute(attributes.NO_MARGINS);
        }
        this.textInput.noMargins = this.noMargins;
    }
    get noMargins() {
        const value = this.getAttribute(attributes.NO_MARGINS);
        return value !== null ? stringToBool(value) : false;
    }
    /**
     * Set the text ellipsis for input text
     * @param {boolean|string} value The value
     */
    set textEllipsis(value) {
        if (typeof value === 'boolean' || typeof value === 'string') {
            this.setAttribute(attributes.TEXT_ELLIPSIS, value.toString());
        }
        else {
            this.removeAttribute(attributes.TEXT_ELLIPSIS);
        }
        this.textInput.textEllipsis = this.textEllipsis;
    }
    get textEllipsis() {
        const value = this.getAttribute(attributes.TEXT_ELLIPSIS);
        return value !== null ? stringToBool(value) : true;
    }
    /**
     * Set the `placeholder` of input
     * @param {string | null} value of the `placeholder` property
     */
    set placeholder(value) {
        if (value) {
            this.setAttribute(attributes.PLACEHOLDER, value);
            this.textInput.placeholder = value;
            return;
        }
        this.removeAttribute(attributes.PLACEHOLDER);
        this.textInput.placeholder = null;
    }
    get placeholder() {
        return this.getAttribute(attributes.PLACEHOLDER);
    }
    /**
     * Set the `readonly` of input
     * @param {boolean|string} value If true will set `readonly` attribute
     */
    set readonly(value) {
        // NOTE: IdsTriggerField is ALWAYS `readonly` when used in IdsUpload
        const val = stringToBool(value);
        if (this.textInput && !this.textInput?.readonly) {
            this.textInput.readonly = true;
        }
        if (val) {
            this.setAttribute(attributes.READONLY, val.toString());
            this.container?.classList.add(attributes.READONLY);
            if (this.textInput)
                this.textInput.readonlyBackground = false;
            if (this.trigger)
                this.trigger.readonly = true;
        }
        else {
            this.removeAttribute(attributes.READONLY);
            this.container?.classList.remove(attributes.READONLY);
            if (this.textInput)
                this.textInput.readonlyBackground = true;
            if (this.trigger)
                this.trigger.readonly = false;
        }
    }
    get readonly() {
        return stringToBool(this.getAttribute(attributes.READONLY));
    }
    /**
     * Set the size of input
     * @param {string} value [xs, sm, mm, md, lg, full]
     */
    set size(value) {
        if (value) {
            this.setAttribute(attributes.SIZE, value);
            this.textInput?.setAttribute(attributes.SIZE, value);
        }
        else {
            this.removeAttribute(attributes.SIZE);
            this.textInput?.removeAttribute(attributes.SIZE);
        }
    }
    get size() { return this.getAttribute(attributes.SIZE); }
    /**
     * Set if the upload is tabbable
     * @param {boolean|string} value True of false depending if the upload is tabbable
     */
    set tabbable(value) {
        if (typeof value === 'boolean' || typeof value === 'string') {
            this.setAttribute(attributes.TABBABLE, value.toString());
        }
        else {
            this.removeAttribute(attributes.TABBABLE);
        }
        this.textInput.tabbable = this.tabbable;
    }
    get tabbable() {
        const value = this.getAttribute(attributes.TABBABLE);
        return value !== null ? stringToBool(value) : false;
    }
    /**
     * Set the label for trigger button
     * @param {string | null} value The label for trigger button
     */
    set triggerLabel(value) {
        const labelEL = this.shadowRoot?.querySelector('.trigger-label');
        if (value) {
            this.setAttribute(attributes.TRIGGER_LABEL, value);
            if (labelEL)
                labelEL.textContent = value;
        }
        else {
            this.removeAttribute(attributes.TRIGGER_LABEL);
            if (labelEL)
                labelEL.textContent = this.triggerLabelDefault;
        }
    }
    get triggerLabel() { return this.getAttribute(attributes.TRIGGER_LABEL); }
    /**
     * Set `validate` attribute
     * @param {string | null} value The `validate` attribute
     */
    set validate(value) {
        if (value) {
            this.setAttribute(attributes.VALIDATE, value);
            if (this.textInput)
                this.textInput.validate = value;
        }
        else {
            this.removeAttribute(attributes.VALIDATE);
            if (this.textInput)
                this.textInput.validate = null;
        }
    }
    get validate() { return this.getAttribute(attributes.VALIDATE); }
    /**
     * Sets which events to fire validation on
     * @param {string} value The `validation-events` attribute
     */
    set validationEvents(value) {
        if (value) {
            this.setAttribute(attributes.VALIDATION_EVENTS, value);
            if (this.textInput)
                this.textInput.validationEvents = value;
        }
        else {
            this.removeAttribute(attributes.VALIDATION_EVENTS);
            if (this.textInput)
                this.textInput.validationEvents = this.validationEventsDefault;
        }
    }
    get validationEvents() { return this.getAttribute(attributes.VALIDATION_EVENTS); }
    /**
     * Set the `value` for text input and file input
     * @param {string} val the value property
     */
    set value(val) {
        if (val) {
            this.setAttribute(attributes.VALUE, val);
            if (this.textInput)
                this.textInput.value = val;
        }
        else {
            this.removeAttribute(attributes.VALUE);
            if (this.fileInput)
                this.fileInput.value = '';
            if (this.textInput)
                this.textInput.value = '';
        }
        if (this.files)
            this.files = this.fileInput?.files;
    }
    get value() { return this.getAttribute(attributes.VALUE); }
};
IdsUpload = __decorate([
    customElement('ids-upload'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsUpload);
export default IdsUpload;
//# sourceMappingURL=ids-upload.js.map