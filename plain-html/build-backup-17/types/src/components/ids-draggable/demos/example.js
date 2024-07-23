import css from '../../../assets/css/ids-draggable/index.css';
const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
    head.insertAdjacentHTML('afterbegin', cssLink);
}
const draggables = [...document.querySelectorAll('ids-draggable')];
draggables.forEach((d) => {
    d.addEventListener('ids-dragstart', (e) => {
        console.info('ids-dragstart', d, e.detail);
    });
    d.addEventListener('ids-drag', (e) => {
        console.info('ids-drag', d, e.detail);
    });
    d.addEventListener('ids-dragend', (e) => {
        console.info('ids-dragend', d, e.detail);
    });
});
//# sourceMappingURL=example.js.map