import { breakpoints } from '../../../utils/ids-breakpoint-utils/ids-breakpoint-utils';
import '../../ids-radio/ids-radio-group';
import '../../ids-radio/ids-radio';
document.addEventListener('DOMContentLoaded', () => {
    const triggerId = '#modal-trigger-btn';
    const triggerBtn = document.querySelector(triggerId);
    const modal = document.querySelector('ids-modal');
    // Links the Modal to its trigger button (sets up click/focus events)
    modal.target = triggerBtn;
    modal.triggerType = 'click';
    // Disable the trigger button when showing the Modal.
    modal.addEventListener('beforeshow', () => {
        triggerBtn.disabled = true;
        return true;
    });
    // Close the modal when its inner button is clicked.
    modal.onButtonClick = () => {
        modal.hide();
    };
    // After the modal is done hiding, re-enable its trigger button.
    modal.addEventListener('hide', () => {
        triggerBtn.disabled = false;
    });
    // ===================================================================
    // Resize Observer for displaying current window width
    const sizeDisplayEls = [...document.querySelectorAll('.current-window-width')];
    const ro = new ResizeObserver(() => {
        sizeDisplayEls.forEach((el) => {
            el.innerHTML = `${window.innerWidth}px`;
        });
    });
    ro.observe(document.querySelector('body'));
    // ===================================================================
    // Build the Radio Buttons that represent different fullsize settings
    const sizeRadioContainer = document.querySelector('#sizes');
    const breakDisplayEl = document.querySelector('#break');
    const fullsizeValues = [null, ...Object.keys(breakpoints).reverse(), 'always'];
    // Render IdsRadios representing actual breakpoint values
    let radioHTML = '';
    fullsizeValues.forEach((val) => {
        let radioText = val;
        let breakpointSize = '';
        let checked = '';
        if (val !== null && val !== 'always') {
            breakpointSize = breakpoints[val];
        }
        if (val === null) {
            radioText = 'Never';
        }
        if (val === 'always') {
            radioText = 'Always';
        }
        if (val === 'sm') {
            checked = ' checked';
        }
        if (breakpointSize.length) {
            radioText += ` (${breakpointSize})`;
        }
        radioHTML += `<ids-radio value="${val}" label="${radioText}"${checked}></ids-radio>`;
    });
    sizeRadioContainer.insertAdjacentHTML('beforeend', radioHTML);
    // Change the fullsize setting on the Modal sample when radios are changed
    sizeRadioContainer.addEventListener('change', (e) => {
        const target = e.target;
        let selected;
        if (target) {
            selected = target.querySelector(`ids-radio[value="${target.value}"]`);
        }
        if (selected) {
            modal.fullsize = selected.value;
            breakDisplayEl.innerHTML = `"${selected.label}"`;
        }
    });
});
//# sourceMappingURL=fullsize.js.map