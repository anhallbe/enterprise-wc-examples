import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';
const Base = IdsColorVariantMixin(IdsThemeMixin(IdsKeyboardMixin(IdsLocaleMixin(IdsEventsMixin(IdsElement)))));
export default Base;
//# sourceMappingURL=ids-accordion-base.js.map