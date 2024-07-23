// Supporting components
import '../ids-toolbar';
import '../../ids-button/ids-button';
import '../../ids-input/ids-input';
import '../../ids-menu-button/ids-menu-button';
import '../../ids-popup-menu/ids-popup-menu';
document.addEventListener('DOMContentLoaded', () => {
    const btnFontpicker = document.querySelector('#btn-fontpicker');
    btnFontpicker?.menuEl.popup.addEventListener('selected', (e) => {
        btnFontpicker.text = e.detail.elem.text;
    });
});
//# sourceMappingURL=formatter.js.map