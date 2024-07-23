import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsOrientationMixin from '../../mixins/ids-orientation-mixin/ids-orientation-mixin';
import IdsElement from '../../core/ids-element';
const Base = IdsOrientationMixin(IdsColorVariantMixin(IdsKeyboardMixin(IdsThemeMixin(IdsEventsMixin(IdsElement)))));
export default Base;
//# sourceMappingURL=ids-tabs-base.js.map