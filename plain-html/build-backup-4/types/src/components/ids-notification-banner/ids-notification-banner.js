var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { TYPES } from './ids-notification-attributes';
import '../ids-text/ids-text';
import '../ids-alert/ids-alert';
import '../ids-icon/ids-icon';
import '../ids-hyperlink/ids-hyperlink';
import '../ids-button/ids-button';
import Base from './ids-notification-banner-base';
import styles from './ids-notification-banner.scss';
/**
 * IDS Notification Banner
 * @type {IdsNotificationBanner}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @part container - the notification banner element
 * @part message - the message inside the container element
 * @part link - the link inside the container element
 * @part button - the close button inside the container element
 */
let IdsNotificationBanner = class IdsNotificationBanner extends Base {
    constructor() {
        super();
    }
    /**
     * Invoked each time the custom element is appended into a document-connected element.
     */
    connectedCallback() {
        super.connectedCallback();
        this.#attachEventHandlers();
        this.#attachKeyboardListeners();
    }
    /**
     * Return the properties we handle as getters/setters
     * @returns {Array} The properties in an array
     */
    static get attributes() {
        return [
            attributes.MESSAGE_TEXT,
            attributes.LINK,
            attributes.LINK_TEXT,
            attributes.TYPE
        ];
    }
    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    template() {
        // Set the alert icon based on the notification type
        let alertIcon;
        if (TYPES[this.type ?? '']?.type === undefined) {
            alertIcon = TYPES.success.type;
        }
        else {
            alertIcon = this.type;
        }
        const type = (!this.type || TYPES[this.type] === undefined) ? TYPES.success.type : this.type;
        return `
      <div class="ids-notification-banner" part="container" type="${type}">
        <ids-alert icon="${alertIcon}"></ids-alert>
        <div class="ids-notification-banner-message" part="message">
          <ids-text overflow="ellipsis">${this.messageText !== null ? this.messageText : 'Enter Message Text.'}</ids-text>
        </div>

        ${this.link !== null ? `<div part="link">
          <ids-hyperlink font-size="16" href="${this.link}" target="_blank">${this.linkText === null ? 'Click to view' : this.linkText}</ids-hyperlink>
        </div>` : ''}

        <div class="ids-notification-banner-button" part="button">
          <ids-button type="tertiary">
            <span class="audible">Close Button</span>
            <ids-icon icon="close" size="small"></ids-icon>
          </ids-button>
        </div>
      </div>
    `;
    }
    /**
     * Set the type of the Notification Banner
     * @param {string | null} value the type value
     * success, alert, info, error
     */
    set type(value) {
        if (!value || TYPES[value] === undefined) {
            this.removeAttribute(attributes.TYPE);
            this.setAttribute(attributes.TYPE, TYPES.success.type);
            this.container?.setAttribute(attributes.TYPE, TYPES.success.type);
        }
        else {
            this.setAttribute(attributes.TYPE, value);
            this.container?.setAttribute(attributes.TYPE, value);
        }
    }
    get type() { return this.getAttribute(attributes.TYPE); }
    /**
     * Set the link inside the Notification Banner
     * @param {string | null} value the link value
     */
    set link(value) {
        if (value) {
            this.setAttribute(attributes.LINK, value);
        }
        else {
            this.removeAttribute(attributes.LINK);
        }
    }
    get link() { return this.getAttribute(attributes.LINK); }
    /**
     * Set the custom link text of the Notification Banner
     * @param {string | null} value the link-text value
     */
    set linkText(value) {
        if (value) {
            this.setAttribute(attributes.LINK_TEXT, value);
        }
        else {
            this.removeAttribute(attributes.LINK_TEXT);
        }
    }
    get linkText() { return this.getAttribute(attributes.LINK_TEXT); }
    /**
     * Set the message text of the Notification Banner
     * @param {string | null} value the link-text value
     */
    set messageText(value) {
        if (value) {
            this.setAttribute(attributes.MESSAGE_TEXT, value);
        }
        else {
            this.removeAttribute(attributes.MESSAGE_TEXT);
        }
    }
    get messageText() { return this.getAttribute(attributes.MESSAGE_TEXT); }
    /**
     * Establish Internal Event Handlers
     * @private
     * @returns {object} The object for chaining.
     */
    #attachEventHandlers() {
        const closeBtn = this.container?.querySelector('ids-button');
        this.onEvent('click', closeBtn, () => this.dismiss());
        return this;
    }
    /**
     * Establish Internal Keyboard shortcuts
     * @private
     * @returns {object} This API object for chaining
     */
    #attachKeyboardListeners() {
        const closeBtn = this.container?.querySelector('ids-button');
        this.listen('Enter', closeBtn, () => this.dismiss());
        return this;
    }
    /**
     * Shows a notification banner dynamically
     * @param {object} notification Object passed in for notification creation
     * @returns {void}
     */
    add(notification) {
        const { id, parent, type, messageText, link, linkText } = notification;
        const messageTextEl = this.container?.querySelector('[part="message"]');
        const alertIcon = this.container?.querySelector('ids-alert');
        // Set properties
        if (id) {
            this.setAttribute('id', id);
        }
        this.type = type;
        this.messageText = messageText;
        alertIcon?.setAttribute('icon', this.type ?? '');
        if (messageTextEl)
            messageTextEl.innerHTML = `<ids-text overflow="ellipsis">${this.messageText}</ids-text>`;
        // Check for link and create the necassary elements.
        if (notification.link) {
            const linkPart = document.createElement('div');
            linkPart.setAttribute('part', 'link');
            this.link = link;
            this.linkText = linkText === undefined ? 'Click to view' : linkText;
            linkPart.innerHTML = `<ids-hyperlink href="${this.link}" target="_blank">${this.linkText}</ids-hyperlink>`;
            // Insert after the message text.
            messageTextEl?.parentNode?.insertBefore(linkPart, messageTextEl.nextSibling);
        }
        // Check if parent container is defined to prepend
        // If not prepend to body element.
        if (parent) {
            const parentEl = document.getElementById(parent);
            parentEl?.prepend(this);
        }
        else if (document.querySelector('ids-container')) {
            document.querySelector('ids-container')?.prepend(this);
        }
        else {
            document.body.prepend(this);
        }
    }
    /**
     * Remove the notification from the page
     */
    dismiss() {
        let canDismiss = true;
        const response = (veto) => {
            canDismiss = !!veto;
        };
        this.triggerEvent('beforeNotificationRemove', this, { detail: { elem: this, response } });
        if (!canDismiss) {
            return;
        }
        this.triggerEvent('notificationRemove', this, { detail: { elem: this } });
        this.remove();
        this.triggerEvent('afterNotificationRemove', this, { detail: { elem: this } });
    }
};
IdsNotificationBanner = __decorate([
    customElement('ids-notification-banner'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsNotificationBanner);
export default IdsNotificationBanner;
//# sourceMappingURL=ids-notification-banner.js.map