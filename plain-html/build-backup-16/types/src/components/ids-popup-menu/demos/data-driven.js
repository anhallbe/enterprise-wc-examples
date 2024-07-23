// Supporting components
import '../ids-popup-menu';
import '../../ids-popup/ids-popup';
import json from '../../../assets/data/menu-contents.json';
document.addEventListener('DOMContentLoaded', () => {
    const popupmenuEl = document.querySelector('#popupmenu');
    // Configure the menu
    const popupEl = popupmenuEl.popup;
    // Load/set data
    const url = json;
    const setData = async () => {
        const res = await fetch(url);
        const data = await res.json();
        popupmenuEl.data = data;
        popupEl.align = 'top, left';
    };
    setData();
});
//# sourceMappingURL=data-driven.js.map