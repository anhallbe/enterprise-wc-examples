/**
 * Custom Element Decorator
 * @param {string} name The custom element name
 * @returns {Function} The function that did the decorating
 */
export function customElement(name) {
    return (target) => {
        if (!customElements.get(name)) {
            customElements.define(name, target);
        }
    };
}
/**
 * Styles Decorator
 * @param {string} cssStyles The css stringified stylesheet
 * @returns {Function} The function that did the decorating
 */
export function scss(cssStyles) {
    return (target) => {
        target.prototype.cssStyles = cssStyles;
    };
}
//# sourceMappingURL=ids-decorators.js.map