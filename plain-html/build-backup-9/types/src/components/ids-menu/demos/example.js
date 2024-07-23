"use strict";
document.addEventListener('DOMContentLoaded', () => {
    // Add a `beforeselected` veto to one of the menu items
    const nonSelectableItem = document.querySelector('#no-select');
    if (!nonSelectableItem) {
        return;
    }
    nonSelectableItem.addEventListener('beforeselected', (e) => {
        console.info('%c You cannot select this item', 'color: #ff0000;', e.detail.elem);
        e.detail.response(false);
    });
    // Log to the console on `selected`
    const menu = document.querySelector('#complex-menu');
    menu?.addEventListener('selected', (e) => {
        // eslint-disable-next-line
        console.info(`Item "${e.detail.elem.text}" was selected`);
    });
});
//# sourceMappingURL=example.js.map