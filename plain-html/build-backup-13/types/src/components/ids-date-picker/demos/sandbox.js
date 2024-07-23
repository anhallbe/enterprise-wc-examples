import '../ids-date-picker';
const datePickerAvailable = document.querySelector('#e2e-date-picker-available');
if (datePickerAvailable) {
    datePickerAvailable.disableSettings = {
        dates: ['2/15/2010', '2/25/2010'],
        dayOfWeek: [0, 6]
    };
}
//# sourceMappingURL=sandbox.js.map