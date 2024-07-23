/**
 * Debounce method called only once in a given time period, delay after its last invocation.
 * @param {object} func the callback function to be run on a stagger.
 * @param {object} func.apply the apply method for given callback.
 * @param {number} threshold the amount of time in CPU ticks to delay.
 * @param {boolean} execAsap if true, executes the callback immediately
 *  instead of waiting for the threshold to complete.
 * @returns {object} the return debounced callback to run
 */
export default function debounce(func, threshold, execAsap) {
    let timeout;
    return function debounced(...args) {
        const obj = this;
        const path = args[0]?.composedPath?.();
        if (path?.length)
            args[0].orignPath = path;
        const delayed = () => {
            if (!execAsap) {
                func.apply(obj, args);
            }
            timeout = null;
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        else if (execAsap) {
            func.apply(obj, args);
        }
        timeout = setTimeout(delayed, threshold || 250);
    };
}
//# sourceMappingURL=ids-debounce-utils.js.map