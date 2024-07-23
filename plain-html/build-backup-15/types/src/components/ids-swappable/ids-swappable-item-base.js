import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';
const Base = IdsThemeMixin(IdsKeyboardMixin(IdsLocaleMixin(IdsEventsMixin(IdsElement))));
export default Base;
//# sourceMappingURL=ids-swappable-item-base.js.map