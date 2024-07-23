import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsElement from '../../core/ids-element';
const Base = IdsColorVariantMixin(IdsThemeMixin(IdsEventsMixin(IdsElement)));
export default Base;
//# sourceMappingURL=ids-hierarchy-item-base.js.map