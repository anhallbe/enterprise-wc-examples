import css from '../../../assets/css/ids-card/auto-fit.css';
const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
    head.insertAdjacentHTML('afterbegin', cssLink);
}
//# sourceMappingURL=height.js.map