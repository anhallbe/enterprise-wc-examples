"use strict";
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
    // ============================================================
    // Close behavior
    const checkbox = document.querySelector('ids-checkbox');
    const defaultOnOutsideClick = modal.onOutsideClick;
    checkbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            modal.onOutsideClick = defaultOnOutsideClick;
        }
        else {
            // Overrides the default `onOutsideClick` to just keep the Modal open
            modal.onOutsideClick = () => { };
        }
    });
});
//# sourceMappingURL=keep-open.js.map