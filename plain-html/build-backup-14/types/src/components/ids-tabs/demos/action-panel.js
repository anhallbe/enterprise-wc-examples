import '../../ids-action-panel/ids-action-panel';
import '../../ids-layout-flex/ids-layout-flex';
document.addEventListener('DOMContentLoaded', () => {
    const triggerId = '#cap-trigger-btn';
    const triggerBtn = document.querySelector(triggerId);
    const cap = document.querySelector('ids-action-panel');
    // Links the CAP to its trigger button (sets up click/focus events)
    cap.target = triggerBtn;
    cap.triggerType = 'click';
    // Disable the trigger button when showing the CAP.
    cap.addEventListener('beforeshow', () => {
        triggerBtn.disabled = true;
        return true;
    });
    // Close the modal when its inner buttons are clicked
    // (this can be in the standard button area, OR inside a Toolbar)
    cap.onButtonClick = () => {
        cap.hide();
    };
    // After the modal is done hiding, re-enable its trigger button.
    cap.addEventListener('hide', () => {
        triggerBtn.disabled = false;
    });
});
//# sourceMappingURL=action-panel.js.map