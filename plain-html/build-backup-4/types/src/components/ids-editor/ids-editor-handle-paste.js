import { cleanHtml } from './ids-editor-clean-utils';
import { escapeHTML } from '../../utils/ids-xss-utils/ids-xss-utils';
/**
 * Paste as plain text.
 * @private
 * @param {ClipboardEvent} e The event
 * @returns {string|null} The updated pasted data
 */
export function handlePasteAsPlainText(e) {
    if (!e)
        return null;
    let paste;
    let html = '';
    if (e.clipboardData?.getData) {
        paste = e.clipboardData.getData('text/plain');
    }
    else {
        paste = window.clipboardData?.getData ? window.clipboardData.getData('Text') : false;
    }
    if (paste) {
        const nodes = paste.split(/[\r\n]/g);
        nodes.forEach((node, i) => {
            if (node !== '') {
                if (navigator.userAgent.match(/firefox/i) && i === 0) {
                    html += `<p>${escapeHTML(node)}</p>`;
                }
                else if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(node)) {
                    html += `<img src="${escapeHTML(node)}" />`;
                }
                else {
                    html += `<p>${escapeHTML(node)}</p>`;
                }
            }
        });
    }
    return html;
}
/**
 * Paste as Html.
 * @private
 * @param {ClipboardEvent} e The event
 * @returns {string|null} The updated pasted data
 */
export function handlePasteAsHtml(e) {
    if (!e)
        return null;
    const clipboardData = e.clipboardData;
    let html;
    if (clipboardData?.types) {
        const types = clipboardData.types;
        if ((types instanceof DOMStringList && types.contains('text/html'))
            || (types.indexOf && types.indexOf('text/html') !== -1)) {
            html = e.clipboardData?.getData('text/html');
        }
        if (types instanceof DOMStringList && types.contains('text/plain')) {
            html = e.clipboardData?.getData('text/plain');
        }
        if ((typeof types === 'object' && types[0] === 'text/plain') && !types[1]) {
            html = e.clipboardData?.getData('text/plain');
        }
    }
    else {
        const paste = window.clipboardData ? window.clipboardData.getData('Text') : '';
        const nodes = paste.split(/[\r\n]/g);
        html = '';
        nodes.forEach((node, i) => {
            if (node !== '') {
                if (navigator.userAgent.match(/firefox/i) && i === 0) {
                    html += `<p>${escapeHTML(node)}</p>`;
                }
                else if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(node)) {
                    html += `<img src="${escapeHTML(node)}" />`;
                }
                else {
                    html += `<p>${escapeHTML(node)}</p>`;
                }
            }
        });
    }
    return html ? cleanHtml(html) : null;
}
//# sourceMappingURL=ids-editor-handle-paste.js.map