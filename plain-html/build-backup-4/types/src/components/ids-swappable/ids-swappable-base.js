import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsSelectionMixin from '../../mixins/ids-selection-mixin/ids-selection-mixin';
import IdsElement from '../../core/ids-element';
const Base = IdsThemeMixin(IdsKeyboardMixin(IdsLocaleMixin(IdsEventsMixin(IdsSelectionMixin(IdsElement)))));
export default Base;
//# sourceMappingURL=ids-swappable-base.js.map