/**
 * Contains various Mask-related utilities, settings, masking functions, etc.
 */
/**
 * @property {string} EMPTY_STRING just an empty string
 */
export const EMPTY_STRING = '';
/**
 * @property {string} PLACEHOLDER_CHAR the default placeholder used in guides
 */
export const PLACEHOLDER_CHAR = '_';
/**
 * @property {string} CARET_TRAP the string of characters representing a caret trap in mask arrays
 */
export const CARET_TRAP = '[]';
/**
 * @property {RegExp} NON_DIGITS_REGEX regular expression matching non-digit characters
 */
export const NON_DIGITS_REGEX = /[^\u0660-\u06690-9\u0966-\u096F\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD]/g;
/**
 * @property {RegExp} DIGITS_REGEX regular expression matching digit characters
 */
export const DIGITS_REGEX = /[\u0660-\u06690-9\u0966-\u096F\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD]/;
/**
 * @property {RegExp} ALPHAS_REGEX regular expression matching alphabetic, non-special characters
 */
export const ALPHAS_REGEX = /[\u00C0-\u017Fa-zA-Z]/;
/**
 * @property {RegExp} ANY_REGEX regular expression matching any non-special characters
 */
export const ANY_REGEX = /[\u00C0-\u017Fa-zA-Z0-9]/;
/**
 * Default options that get passed for the `maskAPI.conformToMask()` method.
 * @property {object} DEFAULT_CONFORM_OPTIONS default options
 */
export const DEFAULT_CONFORM_OPTIONS = {
    caretTrapIndexes: [],
    guide: false,
    previousMaskResult: EMPTY_STRING,
    placeholderChar: PLACEHOLDER_CHAR,
    placeholder: EMPTY_STRING,
    selection: {
        start: 0
    },
    keepCharacterPositions: false
};
/**
 * @param {string} pattern a string containing a pattern that needs parsing
 * @returns {Array<string|RegExp>|undefined} a valid mask or nothing
 */
export function convertPatternFromString(pattern) {
    if (typeof pattern !== 'string' || !pattern.length) {
        return undefined;
    }
    const firstChar = pattern.charAt(0);
    const lastChar = pattern.charAt(pattern.length - 1);
    // Detect inlined arrays (JSON-like)
    if (firstChar === '[' && lastChar === ']') {
        const patternArray = pattern.substring(1, pattern.length - 1).split(/, ?/g);
        return patternArray.map((item) => {
            // Remove quotes
            // NOTE: need to detect single and double quotes here
            // eslint-disable-next-line
            if (["'", '"'].includes(item.charAt(0))) {
                return item.substring(1, item.length - 1);
            }
            // Convert string-based regex into RegExp objects
            return new RegExp(item.substring(1, item.length - 1));
        });
    }
    // @TODO: Try to detect other types of string input
    // for now, return an empty mask
    return undefined;
}
//# sourceMappingURL=ids-mask-common.js.map