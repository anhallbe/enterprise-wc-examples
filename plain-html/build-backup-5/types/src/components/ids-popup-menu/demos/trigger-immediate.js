"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const popupmenuEl = document.querySelector('ids-popup-menu');
    const popupEl = popupmenuEl.popup;
    // Preconfigure the Popup
    popupEl.align = 'top, left';
    popupEl.x = 20;
    popupEl.y = 120;
    // Log to the console on `selected`
    popupmenuEl.addEventListener('selected', (e) => {
        console.info(`Item "${e.detail.elem.text}" was selected`);
    });
    // The first time the Popupmenu hides, re-configure it
    // to activate again when clicking on the page.
    popupEl.addEventListener('hide', () => {
        popupmenuEl.triggerType = 'contextmenu';
    }, { once: true });
});
//# sourceMappingURL=trigger-immediate.js.map