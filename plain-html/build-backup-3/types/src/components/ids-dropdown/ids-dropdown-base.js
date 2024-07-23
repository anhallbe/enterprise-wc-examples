import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsPopupOpenEventsMixin from '../../mixins/ids-popup-open-events-mixin/ids-popup-open-events-mixin';
import IdsFieldHeightMixin from '../../mixins/ids-field-height-mixin/ids-field-height-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsElement from '../../core/ids-element';
import IdsValidationInputMixin from '../../mixins/ids-validation-mixin/ids-validation-input-mixin';
import IdsLabelStateParentMixin from '../../mixins/ids-label-state-mixin/ids-label-state-parent-mixin';
import IdsXssMixin from '../../mixins/ids-xss-mixin/ids-xss-mixin';
const Base = IdsThemeMixin(IdsDirtyTrackerMixin(IdsValidationInputMixin(IdsLabelStateParentMixin(IdsFieldHeightMixin(IdsColorVariantMixin(IdsPopupOpenEventsMixin(IdsTooltipMixin(IdsXssMixin(IdsLocaleMixin(IdsKeyboardMixin(IdsEventsMixin(IdsElement))))))))))));
export default Base;
//# sourceMappingURL=ids-dropdown-base.js.map