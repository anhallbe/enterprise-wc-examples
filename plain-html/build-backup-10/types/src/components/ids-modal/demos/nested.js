import '../ids-modal';
import '../../ids-button/ids-button';
document.addEventListener('DOMContentLoaded', () => {
    const parentTriggerId = '#parent-modal-trigger-btn';
    const parentTriggerBtn = document.querySelector(parentTriggerId);
    const parentModal = document.querySelector('#parent-modal');
    const nestedTriggerId = '#nested-modal-trigger-btn';
    const nestedTriggerBtn = document.querySelector(nestedTriggerId);
    const nestedModal = document.querySelector('#nested-modal');
    // Links the Modals to their trigger buttons
    parentModal.target = parentTriggerBtn;
    parentModal.triggerType = 'click';
    nestedModal.target = nestedTriggerBtn;
    nestedModal.triggerType = 'click';
    // Disable the trigger buttons when showing their Modals.
    parentModal.addEventListener('beforeshow', () => {
        parentTriggerBtn.disabled = true;
        return true;
    });
    nestedModal.addEventListener('beforeshow', () => {
        nestedTriggerBtn.disabled = true;
        return true;
    });
    // Close the modals when their "close" buttons are clicked
    parentModal.onButtonClick = (buttonEl) => {
        if (buttonEl.cancel) {
            parentModal.hide();
        }
    };
    nestedModal.onButtonClick = () => {
        nestedModal.hide();
    };
    // When the modals are fully hidden, re-enable their trigger buttons
    parentModal.addEventListener('hide', () => {
        parentTriggerBtn.disabled = false;
    });
    nestedModal.addEventListener('hide', () => {
        nestedTriggerBtn.disabled = false;
    });
});
//# sourceMappingURL=nested.js.map