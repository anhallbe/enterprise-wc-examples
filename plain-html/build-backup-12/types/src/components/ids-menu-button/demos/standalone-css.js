import css from '../../../assets/css/ids-menu-button/standalone-css.css';
import { appendStyleSheets } from '../../../../scripts/append-stylesheets';
import popupMenuStyles from '../../ids-popup-menu/ids-popup-menu.scss';
import layoutStyles from '../../ids-layout-grid/ids-layout-grid.scss';
import textStyles from '../../ids-text/ids-text.scss';
import menuButtonStyles from '../../ids-button/ids-button.scss';
import popupStyles from '../../ids-popup/ids-popup.scss';
import menuGroupStyles from '../../ids-menu/ids-menu-group.scss';
import menuHeaderStyles from '../../ids-menu/ids-menu-header.scss';
import menuItemStyles from '../../ids-menu/ids-menu-item.scss';
import separatorStyles from '../../ids-separator/ids-separator.scss';
appendStyleSheets(menuButtonStyles, popupMenuStyles, layoutStyles, popupStyles, textStyles, menuGroupStyles, menuHeaderStyles, menuItemStyles, separatorStyles);
const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head').insertAdjacentHTML('afterbegin', cssLink);
//# sourceMappingURL=standalone-css.js.map