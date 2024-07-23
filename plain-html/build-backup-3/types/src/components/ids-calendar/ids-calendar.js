var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import Base from './ids-calendar-base';
import IdsMonthView from '../ids-month-view/ids-month-view';
import '../ids-toolbar/ids-toolbar';
import styles from './ids-calendar.scss';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import { breakpoints } from '../../utils/ids-breakpoint-utils/ids-breakpoint-utils';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';
import { dateDiff, firstDayOfWeekDate, isValidDate, lastDayOfWeekDate, subtractDate } from '../../utils/ids-date-utils/ids-date-utils';
/**
 * IDS Calendar Component
 * @type {IdsCalendar}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @mixes IdsCalendarEventsMixin
 */
let IdsCalendar = class IdsCalendar extends Base {
    #mobileBreakpoint = parseInt(breakpoints.md);
    #resizeObserver;
    #selectedEventId = '';
    constructor() {
        super();
        if (!this.state)
            this.state = {};
    }
    static get attributes() {
        return [
            ...super.attributes,
            attributes.DATE,
            attributes.SHOW_DETAILS,
            attributes.SHOW_LEGEND
        ];
    }
    /**
     * Setting for calendar details pane
     * @param {boolean|string} val show/hides details
     */
    set showDetails(val) {
        if (stringToBool(val)) {
            this.setAttribute(attributes.SHOW_DETAILS, '');
            this.updateEventDetails(this.state.selected);
            this.container?.classList.add('show-details');
        }
        else {
            const detailsPane = this.container?.querySelector('.calendar-details-pane');
            if (detailsPane)
                detailsPane.innerHTML = '';
            this.removeAttribute(attributes.SHOW_DETAILS);
            this.container?.classList.remove('show-details');
        }
    }
    /**
     * @returns {boolean} true if detail pane enabled
     */
    get showDetails() {
        return this.hasAttribute(attributes.SHOW_DETAILS);
    }
    /**
     * Setting for calendar legend pane
     * @param {boolean|string} val show/hides legend
     */
    set showLegend(val) {
        if (stringToBool(val)) {
            this.setAttribute(attributes.SHOW_LEGEND, '');
            this.renderLegend(this.eventTypesData);
            this.container?.classList.add('show-legend');
        }
        else {
            this.removeAttribute(attributes.SHOW_LEGEND);
            this.querySelector('#event-types-legend')?.remove();
            this.container?.classList.remove('show-legend');
        }
    }
    /**
     * @returns {boolean} true of legend pane enabled
     */
    get showLegend() {
        return this.hasAttribute(attributes.SHOW_LEGEND);
    }
    /**
     * show-today attribute
     * @returns {boolean} showToday param converted to boolean from attribute value
     */
    get showToday() {
        const attrVal = this.getAttribute(attributes.SHOW_TODAY);
        return stringToBool(attrVal);
    }
    /**
     * Set whether or not the today button should be shown
     * @param {string|boolean} val showToday param value
     */
    set showToday(val) {
        const boolVal = stringToBool(val);
        if (boolVal) {
            this.setAttribute(attributes.SHOW_TODAY, 'true');
        }
        else {
            this.removeAttribute(attributes.SHOW_TODAY);
        }
        this.#updateTodayBtn(boolVal);
    }
    #updateTodayBtn(val) {
        const el = this.container?.querySelector('ids-toolbar-section');
        if (val) {
            el?.insertAdjacentHTML('beforeend', this.#todayBtnTemplate());
        }
        else {
            this.container?.querySelector('.btn-today')?.remove();
        }
    }
    /**
     * Setting for calendar date
     * @param {Date|string} val user date input
     */
    set date(val) {
        const date = new Date(val);
        if (isValidDate(date)) {
            this.setAttribute(attributes.DATE, val.toString());
            if (!this.state.skipRender) {
                this.changeDate(date, this.state.view === 'day');
                this.updateEventDetails();
            }
        }
        else {
            this.setAttribute(attributes.DATE, new Date().toString());
        }
    }
    /**
     * Returns active date
     * @returns {Date} date
     */
    get date() {
        const date = new Date(this.getAttribute(attributes.DATE) || Date.now());
        return isValidDate(date) ? date : new Date();
    }
    /**
     * Ids Calendar Component connected life-cycle hook
     */
    connectedCallback() {
        super.connectedCallback();
        this.setDirection();
        this.changeView('month');
        this.#attachEventHandlers();
        this.#configureResizeObserver();
        this.viewPickerConnected();
    }
    /**
     * Ids Calendar Component disconnected life-cycle hook
     */
    disconnectedCallback() {
        super.disconnectedCallback?.();
        if (this.#resizeObserver) {
            this.#resizeObserver.disconnect();
            this.#resizeObserver = null;
        }
    }
    /**
     * Configures IdsCalendar's resize observer
     */
    #configureResizeObserver() {
        this.#resizeObserver = new ResizeObserver((entries) => this.#onResize(entries));
        this.#resizeObserver.observe(getClosest(this, 'ids-container'));
    }
    /**
     * Handle event type data changes
     * @param {CalendarEventTypeData[]} data event types
     */
    onEventTypesChange(data) {
        this.renderLegend(data);
        this.#toggleMonthLegend(data, this.state.isMobile);
    }
    /**
     * @param {IdsLocale} locale the new locale object
     */
    onLocaleChange = (locale) => {
        this.#updateDatePickerPopupTrigger(locale);
    };
    /**
     * Ids Calendar template
     * @returns {string} html template
     */
    template() {
        return `
      <div class="ids-calendar">
        <div class="calendar-legend-pane"><slot name="legend"></slot></div>
        <div class="calendar-contents">
          <div class="calendar-toolbar-pane">${this.#createToolbarTemplate()}</div>
          <div class="calendar-view-pane"></div>
        </div>
        <div class="calendar-details-pane"></div>
      </div>
    `;
    }
    /**
     * Create accordion template for events detail
     * @param {CalendarEventDetail[]} data event detail data
     * @returns {string} html accordion template
     */
    detailAccordionTemplate(data) {
        const panels = data.map((item, idx) => `
      <ids-accordion-panel expanded="${idx === 0}">
        <ids-accordion-header color="${item.color}" slot="header">
          <ids-text font-weight="bold" overflow="ellipsis">${item.shortSubject || item.subject}</ids-text>
        </ids-accordion-header>
        <div slot="content" class="panel-content">
          ${item.status ? `<ids-data-label label="${this.locale.translate('Status')}">${item.status}</ids-data-label><hr>` : ''}
          <ids-data-label label="${this.locale.translate('Date')}">${item.dateRange}</ids-data-label><hr>
          <ids-data-label label="Event Type">${item.eventType}</ids-data-label><hr>
          <ids-data-label label="${this.locale.translate('Duration')}">${item.duration}</ids-data-label>
          ${item.comments ? `<hr><ids-data-label label="${this.locale.translate('Comments')}">${item.comments}</ids-data-label>` : ''}
        </div>
      </ids-accordion-panel>
    `).join('');
        return `<ids-accordion allow-one-pane="true">${panels}</ids-accordion>`;
    }
    /**
     * Create list template for events detail
     * @param {CalendarEventDetail[]} data event detail data
     * @returns {string} html accordion template
     */
    detailListTemplate(data) {
        const listItems = data.map((item) => `
      <li color="${item.color}" class="detail-item" tabindex="0" data-id="${item.id}">
        <div class="calendar-detail-content">
          <ids-text font-size="18" font-weight="bold">${item.subject}</ids-text>
          <ids-text font-size="14">${item.dateRange}</ids-text>
          <ids-text font-size="14">${item.comments || ''}${item.status ? ` | ${item.status}` : ''}</ids-text>
        </div>
        <ids-text font-size="12" class="detail-item-duration">${item.duration}</ids-text>
        <ids-icon icon="caret-right"></ids-icon>
      </li>
    `).join('');
        return `<ul class="calendar-events-list">${listItems}</ul>`;
    }
    /**
     * @returns {string} containing the template for the Calendar Toolbar's "Today" Button
     */
    #todayBtnTemplate() {
        return this.showToday ? `<ids-button css-class="no-padding" class="btn-today">
      <ids-text class="btn-today-text" font-size="16" translate-text="true" font-weight="bold">Today</ids-text>
    </ids-button>` : '';
    }
    /**
     * Renders an IdsToolbar component with calendar controls
     * @returns {string} Calendar's IdsToolbar template
     */
    #createToolbarTemplate() {
        const navBtns = `<ids-button class="btn-previous">
      <ids-text audible="true" translate-text="true">PreviousMonth</ids-text>
      <ids-icon icon="chevron-left"></ids-icon>
    </ids-button>
    <ids-button class="btn-next">
      <ids-text audible="true" translate-text="true">NextMonth</ids-text>
      <ids-icon icon="chevron-right"></ids-icon>
    </ids-button>`;
        const datePickerPopup = `<ids-button class="btn-picker" id="btn-picker" css-class="no-padding">
      <ids-text font-size="20"></ids-text>
      <ids-icon icon="calendar"></ids-icon>
    </ids-button>
    <ids-date-picker-popup
      show-today="true"
      target="#btn-picker"
      trigger-elem="#btn-picker"
      trigger-type="click"></ids-date-picker-popup>`;
        const todayBtn = this.#todayBtnTemplate();
        return `
      <ids-toolbar slot="toolbar" id="calendar-toolbar" class="calendar-toolbar" tabbable="true">
        <ids-toolbar-section type="buttonset" class="toolbar-buttonset">
          ${navBtns}
          ${datePickerPopup}
          ${todayBtn}
        </ids-toolbar-section>
        <ids-toolbar-section type="buttonset" align="end">
          ${this.viewPicker ? this.createViewPickerTemplate('month') : ''}
        </ids-toolbar-section>
      </ids-toolbar>
    `;
    }
    /**
     * Creates new calendar event
     * @param {string} id user defined id
     * @param {boolean} isModal opens modal if true
     */
    createNewEvent(id, isModal = false) {
        const date = new Date(this.date);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const event = {
            id,
            subject: 'New Event',
            isAllDay: 'true',
            starts: new Date(year, month, day, 0, 0, 0).toISOString(),
            ends: new Date(year, month, day, 23, 59, 59, 999).toISOString(),
            type: 'dto',
            comments: 'New Event Comments'
        };
        if (isModal) {
            const view = this.getView();
            const target = view instanceof IdsMonthView ? view.getSelectedDay() : this.container;
            if (target)
                this.#insertFormPopup(target, event);
        }
        else {
            this.addEvent(event);
        }
    }
    /**
     * Create calendar event form template
     * @param {CalendarEventData} data event data
     * @returns {string} event form template
     */
    #eventFormTemplate(data) {
        const start = new Date(data.starts);
        const end = new Date(data.ends);
        const eventType = this.getEventTypeById(data.type);
        // Ids List Box Option template
        const eventTypeOptions = this.eventTypesData.map((item) => `
      <ids-list-box-option value="${item.id}">
        <ids-text>${item.label}</ids-text>
      </ids-list-box-option>
    `).join('');
        // Ids Date Picker template
        const datePicker = (id, labelKey, date) => `
      <ids-date-picker
        id="${id}"
        label="${this.locale.translate(labelKey)}"
        size="full"
        year="${date.getFullYear()}"
        month="${date.getMonth()}"
        day="${date.getDate()}"
        value="${this.locale.formatDate(date)}"
        mask>
      </ids-date-picker>
    `;
        // Ids Time Picker template
        const timePicker = (id, date) => `
      <ids-time-picker
        id="${id}"
        label="&nbsp"
        size="full"
        disabled="${stringToBool(data.isAllDay)}"
        value="${this.locale.formatHour(date.getHours() + (date.getMinutes() / 60))}">
      </ids-time-picker>
    `;
        return `
      <form id="event-form" data-id="${data.id}" slot="content">
        <div id="event-form-header" class="inline-container" color="${eventType?.color || 'azure'}">
          <ids-text font-size="16" font-weight="bold">${eventType?.label || ''}</ids-text>
          <ids-button data-action="close">
            <ids-icon icon="close"></ids-icon>
          </ids-button>
        </div>
        <div id="event-form-content">
          <ids-input size="full" id="event-subject" type="text" label="${this.locale.translate('Subject')}" value="${data.subject}"></ids-input>
          <ids-dropdown size="full" id="event-type" label="${this.locale.translate('EventType')}" value="${data.type}">
            <ids-list-box>${eventTypeOptions}</ids-list-box>
          </ids-dropdown>
          <ids-checkbox id="event-is-all-day" label="${this.locale.translate('AllDay')}" checked="${data.isAllDay}"></ids-checkbox>
          <div class="inline-container">
            ${datePicker('event-from-date', 'From', start)}
            ${timePicker('event-from-hour', start)}
          </div>
          <div class="inline-container">
            ${datePicker('event-to-date', 'To', end)}
            ${timePicker('event-to-hour', end)}
          </div>
          <ids-textarea size="full" id="event-comments" label="${this.locale.translate('Comments')}" autoselect="true">${data.comments || ''}</ids-textarea>
        </div>
        <div id="event-form-actions" class="inline-container">
          <ids-button data-action="close" no-padding>
            <ids-text font-weight="bold" translate-text="true">Cancel</ids-text>
          </ids-button>
          <ids-button data-action="submit" no-padding>
            <ids-text font-weight="bold" translate-text="true">Submit</ids-text>
          </ids-button>
        </div>
      </form>
    `;
    }
    /**
     * Attach calendar event handlers
     */
    #attachEventHandlers() {
        let daySelectTimer;
        let daySelectCount = 0;
        let daySelectedDate;
        this.offEvent('dayselected.calendar-container');
        this.onEvent('dayselected.calendar-container', this.container, (evt) => {
            evt.stopPropagation();
            clearTimeout(daySelectTimer);
            daySelectCount++;
            const updateCalendar = () => {
                this.#updateActiveDate(evt.detail.date);
                this.state.selected = evt.detail?.events || [];
                this.updateEventDetails(evt.detail?.events);
            };
            const createNewEvent = () => {
                const id = Date.now().toString() + Math.floor(Math.random() * 100);
                this.createNewEvent(id, true);
            };
            daySelectTimer = setTimeout(() => {
                updateCalendar();
                daySelectCount = 0;
            }, 200);
            if (daySelectCount === 2 && evt.detail.date.getTime() === daySelectedDate?.getTime()) {
                clearTimeout(daySelectTimer);
                updateCalendar();
                createNewEvent();
                daySelectCount = 0;
            }
            daySelectedDate = evt.detail.date;
        });
        this.offEvent('viewchange.calendar');
        this.onEvent('viewchange.calendar', this, (evt) => {
            evt.stopPropagation();
            this.#updateActiveDate(evt.detail.date);
            this.changeView(evt.detail.view);
            this.renderEventsData();
        });
        this.offEvent('datechange.calendar-container');
        this.onEvent('datechange.calendar-container', this.container, (evt) => {
            evt.stopPropagation();
            this.#updateActiveDate(evt.detail.date);
            this.renderEventsData();
        });
        this.offEvent('change.calendar-legend');
        this.onEvent('change.calendar-legend', this.container?.querySelector('.calendar-legend-pane'), (evt) => {
            evt.stopPropagation();
            this.#removePopup();
            this.#toggleEventType(evt.detail.elem, evt.detail.checked);
            this.relayCalendarData();
            this.updateEventDetails(this.state.selected);
        });
        this.offEvent('overflow-click.calendar-container');
        this.onEvent('overflow-click.calendar-container', this.container, (evt) => {
            evt.stopPropagation();
            if (evt.detail.date) {
                this.setViewPickerValue('day');
                this.updateEventDetails(this.state.selected);
            }
        });
        this.offEvent('localechange.calendar-container');
        this.onEvent('localechange.calendar-container', this.closest('ids-container'), () => {
            this.updateEventDetails(this.state.selected);
            this.renderLegend(this.eventTypesData);
        });
        this.onEvent('click.details-item', this.container?.querySelector('.calendar-details-pane'), (evt) => {
            const detailItem = evt.target.closest('.detail-item');
            if (detailItem) {
                evt.stopPropagation();
                evt.stopImmediatePropagation();
                const id = detailItem.getAttribute('data-id');
                const eventData = this.getEventById(id);
                if (eventData) {
                    this.#selectedEventId = id;
                    this.#removePopup();
                    if (this.container)
                        this.#insertFormPopup(this.container, eventData);
                }
            }
        });
        this.offEvent('click-calendar-event', this);
        this.onEvent('click-calendar-event', this, (evt) => {
            const elem = evt.detail.elem;
            this.#selectedEventId = elem.eventData.id;
            this.#removePopup();
            this.#insertFormPopup(elem.container, elem.eventData);
        });
        if (this.viewPicker)
            this.attachViewPickerEvents('month');
        this.#attachToolbarEventHandlers();
    }
    /**
     * Get IdsPopup containg calendar event form
     * @returns {IdsPopup} popup component
     */
    #getEventFormPopup() {
        return this.container?.querySelector('#event-form-popup');
    }
    /**
     * Add next/previous/today click events when toolbar is attached
     */
    #attachToolbarEventHandlers() {
        const buttonSet = this.container?.querySelector('ids-toolbar-section.toolbar-buttonset');
        const toolbarDatepickerPopup = this.container?.querySelector('ids-date-picker-popup');
        this.offEvent('show.popup');
        this.onEvent('show.popup', toolbarDatepickerPopup, () => {
            this.#updateDatePickerPopupTrigger(this.locale);
        });
        // Date Picker Popup's `hide` event can cause the field to become focused
        this.offEvent('hide.popup');
        this.onEvent('hide.popup', toolbarDatepickerPopup, (e) => {
            e.stopPropagation();
            if (e.detail.doFocus) {
                if (toolbarDatepickerPopup)
                    toolbarDatepickerPopup.target?.focus();
            }
        });
        this.offEvent('click.month-view-buttons');
        this.onEvent('click.month-view-buttons', buttonSet, (e) => {
            e.stopPropagation();
            const target = e.target;
            const monthView = this.container?.querySelector('ids-month-view');
            const weekView = this.container?.querySelector('ids-week-view');
            if (target.classList.contains('btn-previous')) {
                monthView?.changeDate('previous-month');
                weekView?.changeDate('previous');
            }
            if (target.classList.contains('btn-next')) {
                monthView?.changeDate('next-month');
                weekView?.changeDate('next');
            }
            if (target.classList.contains('btn-today')) {
                const targetView = monthView || weekView;
                targetView?.changeDate('today');
                targetView?.focus();
            }
            if (target.classList.contains('btn-apply')) {
                const year = toolbarDatepickerPopup?.year ?? null;
                const month = toolbarDatepickerPopup?.month ?? null;
                if (monthView) {
                    monthView.year = year;
                    monthView.month = month;
                }
                if (toolbarDatepickerPopup)
                    toolbarDatepickerPopup.expanded = false;
            }
        });
        this.offEvent('dayselected.month-view-datepicker');
        this.onEvent('dayselected.month-view-datepicker', toolbarDatepickerPopup, (e) => {
            e.stopPropagation();
            const date = e.detail.date;
            this.changeDate(date, this.state.view === 'day');
        });
        // Date picker dropdown picklist expanded or collapsed
        this.offEvent('expanded.month-view-picklist');
        this.onEvent('expanded.month-view-picklist', toolbarDatepickerPopup, (e) => {
            const expanded = e.detail.expanded;
            this.container?.querySelector('.btn-today')?.setAttribute('hidden', expanded.toString());
            this.container?.querySelector('.btn-apply')?.setAttribute('hidden', (!expanded).toString());
            this.container?.querySelector('.btn-previous')?.setAttribute('hidden', expanded.toString());
            this.container?.querySelector('.btn-next')?.setAttribute('hidden', expanded.toString());
            if (expanded) {
                this.container?.querySelector('td.is-selected')?.removeAttribute('tabindex');
            }
            else {
                this.container?.querySelector('td.is-selected')?.setAttribute('tabindex', '0');
            }
        });
        if (this.showToday) {
            this.offEvent('click.week-view-today');
            this.onEvent('click.week-view-today', this.container?.querySelector('.btn-today'), () => {
                this.getView()?.changeDate('today');
            });
        }
        else {
            this.offEvent('click.week-view-today');
        }
    }
    /**
     * Attach calendar event form handlers
     */
    #attachFormEventHandlers() {
        const popup = this.#getEventFormPopup();
        // Don't allow IdsDatePicker `dayselected` events from inside this form
        // to propagate to the main IdsMonthView
        this.offEvent('dayselected.calendar-event-form');
        this.onEvent('dayselected.calendar-event-form', popup, (evt) => {
            evt.stopPropagation();
        });
        this.offEvent('click.calendar-event-form', popup);
        this.onEvent('click.calendar-event-form', popup, (evt) => {
            if (evt.target && evt.target.tagName === 'IDS-BUTTON') {
                evt.stopPropagation();
                const action = evt.target.getAttribute('data-action');
                if (!action)
                    return;
                if (action === 'close') {
                    this.#removePopup();
                    return;
                }
                if (action === 'submit') {
                    const formElem = this.#getEventFormPopup()?.querySelector('#event-form');
                    this.#submitEventForm(formElem);
                    this.#removePopup();
                }
            }
        });
        this.offEvent('change.calendar-event-form', popup);
        this.onEvent('change.calendar-event-form', popup, (evt) => {
            evt.stopPropagation();
            const checked = evt.detail.checked;
            this.#toggleTimePickers(checked);
        });
    }
    /**
     * Insert event form popup into view.
     * Attach it to provided calendar event
     * @param {HTMLElement} target target to attach popup to
     * @param {CalendarEventData} eventData calendar event component
     */
    #insertFormPopup(target, eventData) {
        const popup = this.#getEventFormPopup();
        if (popup) {
            popup.innerHTML = `${this.#eventFormTemplate(eventData)}`;
        }
        else {
            this.container?.insertAdjacentHTML('beforeend', `
        <ids-popup
          id="event-form-popup"
          arrow="right"
          x="160"
          align="center"
          animated="false"
          visible="false"
          type="menu"
          position-style="absolute">
          ${this.#eventFormTemplate(eventData)}
        </ids-popup>
      `);
        }
        this.positionFormPopup(target);
        this.#attachFormEventHandlers();
        this.#getEventFormPopup()?.querySelector('#event-subject')?.focus();
    }
    /**
     * Enables/Disabled time pickers inside event form
     * @param {boolean} disable boolean
     */
    #toggleTimePickers(disable) {
        const popup = this.#getEventFormPopup();
        if (popup) {
            popup.querySelectorAll('ids-time-picker').forEach((elem) => {
                elem.disabled = disable;
            });
        }
    }
    /**
     * Aligns form popup with provided html target element
     * @param {HTMLElement} target element
     */
    positionFormPopup(target) {
        const popup = this.#getEventFormPopup();
        if (popup && target) {
            popup.alignTarget = null;
            popup.alignTarget = target;
            popup.place();
            popup.visible = true;
        }
    }
    /**
     * Remove calendar event form popup
     */
    #removePopup() {
        const popup = this.#getEventFormPopup();
        if (popup) {
            this.offEvent('click.calendar-event-form', popup);
            popup.remove();
        }
    }
    /**
     * Gets values from event form and updates event
     * @param {HTMLElement} formElem form element
     */
    #submitEventForm(formElem) {
        const id = formElem.getAttribute('data-id');
        const subject = formElem.querySelector('#event-subject')?.value;
        const type = formElem.querySelector('#event-type')?.value;
        const isAllDayBool = formElem.querySelector('#event-is-all-day')?.checked;
        const isAllDay = isAllDayBool === 'true' ? 'true' : 'false';
        const comments = formElem.querySelector('#event-comments')?.value;
        const fromDate = formElem.querySelector('#event-from-date');
        const fromHours = formElem.querySelector('#event-from-hour');
        const starts = new Date(fromDate.year, fromDate.month, fromDate.day, isAllDayBool ? 0 : fromHours.hours24, isAllDayBool ? 0 : fromHours.minutes, isAllDayBool ? 0 : fromHours.seconds).toISOString();
        const toDate = formElem.querySelector('#event-to-date');
        const toHours = formElem.querySelector('#event-to-hour');
        const ends = new Date(toDate.year, toDate.month, toDate.day, isAllDayBool ? 23 : toHours.hours24, isAllDayBool ? 59 : toHours.minutes, isAllDayBool ? 59 : toHours.seconds).toISOString();
        const eventData = {
            id, subject, type, isAllDay, starts, ends, comments
        };
        this.updateEvent(eventData);
    }
    /**
     * Update event type data checked state
     * @param {IdsCheckbox} checkbox IdsCheckbox component
     * @param {boolean} checked true if checked
     */
    #toggleEventType(checkbox, checked) {
        const id = checkbox.getAttribute('data-id');
        const eventType = this.getEventTypeById(id);
        if (eventType) {
            eventType.checked = checked;
        }
    }
    /**
     * Changes view component
     * @param {CalendarViewTypes} view month | week | day
     */
    changeView(view = 'month') {
        if (this.state.view === view)
            return;
        const template = view === 'month'
            ? this.#createMonthTemplate()
            : this.#createWeekTemplate(view === 'day');
        this.insertViewTemplate(template);
        this.relayCalendarData();
        this.state.view = view;
    }
    /**
     * Update date range of current view
     * @param {Date} date Date
     * @param {boolean} isDayView true if range is 1 day
     */
    changeDate(date, isDayView) {
        const view = this.getView();
        if (!view || !isValidDate(date))
            return;
        if (view.tagName === 'IDS-MONTH-VIEW') {
            view.setAttribute(attributes.YEAR, String(date.getFullYear()));
            view.setAttribute(attributes.MONTH, String(date.getMonth()));
            view.setAttribute(attributes.DAY, String(date.getDate()));
        }
        else if (view.tagName === 'IDS-WEEK-VIEW') {
            const start = isDayView ? date : firstDayOfWeekDate(date);
            const end = isDayView ? date : lastDayOfWeekDate(date);
            view.setAttribute(attributes.START_DATE, String(start));
            view.setAttribute(attributes.END_DATE, String(end));
        }
    }
    /**
     * Inserts view component template
     * @param {string} template view component template
     */
    insertViewTemplate(template) {
        const viewPane = this.container?.querySelector('.calendar-view-pane');
        if (viewPane)
            viewPane.innerHTML = template;
    }
    /**
     * Passes calendar event data to active view
     */
    relayCalendarData() {
        const viewElem = this.getView();
        const eventsData = this.#filterEventsByType(this.eventsData);
        if (viewElem) {
            viewElem.eventsData = eventsData;
            viewElem.eventTypesData = this.eventTypesData;
        }
    }
    /**
     * Updates active date
     * Reflects date attribute without re-render
     * @param {Date} date active date
     */
    #updateActiveDate(date) {
        this.state.skipRender = true;
        date = date || this.date;
        const dateAttr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        this.setAttribute('date', dateAttr);
        this.#updateDatePickerPopupTrigger(undefined, date);
        this.state.skipRender = false;
    }
    /**
     * Updates the text content of the Date Picker Popup's trigger button
     * @param {IdsLocale} [locale] if provided, sets a different locale from the currently-set locale
     * @param {Date} [date] if provided, sets an alternate date from the currently-set date
     */
    #updateDatePickerPopupTrigger(locale, date) {
        const btnEl = this.container?.querySelector('.btn-picker');
        const textEl = btnEl?.querySelector('ids-text');
        const targetDate = date || this.date;
        const formattedDate = this.formatMonthRange(locale) || null;
        if (textEl) {
            textEl.textContent = formattedDate;
        }
        const datePickerPopup = this.container?.querySelector('ids-date-picker-popup');
        if (datePickerPopup) {
            datePickerPopup.day = targetDate.getDate();
            datePickerPopup.month = targetDate.getMonth();
            datePickerPopup.year = targetDate.getFullYear();
            datePickerPopup.updateMonthYearPickerTriggerDisplay(locale, targetDate);
        }
    }
    #getSelectedEvents() {
        // if month view, query events and update details
        const view = this.getView();
        if (view && view instanceof IdsMonthView) {
            this.state.selected = view.getActiveDayEvents();
            return this.state.selected;
        }
        return [];
    }
    /**
     * Renders IdsMonthView component
     * @returns {string} ids month view template
     */
    #createMonthTemplate() {
        const date = this.date;
        return `
      <ids-month-view
        month="${date.getMonth()}"
        day="${date.getDate()}"
        year="${date.getFullYear()}">
        <slot name="MonthViewCalendarEventTemplate" slot="customCalendarEvent"></slot>
      </ids-month-view>
    `;
    }
    /**
     * Renders IdsWeekView component
     * @param {boolean} isDayView show day view
     * @returns {string} ids week view template
     */
    #createWeekTemplate(isDayView = false) {
        const date = this.date;
        const start = isDayView ? date : firstDayOfWeekDate(date);
        const end = isDayView ? date : lastDayOfWeekDate(date);
        return `
      <ids-week-view
        start-date="${start}"
        end-date="${end}"
      ></ids-week-view>
    `;
    }
    /**
     * Filters calendar events by checked event types
     * @param {Array<CalendarEventData>} events Array<CalendarEventData>
     * @returns {Array<CalendarEventData>} Array<CalendarEventData>
     */
    #filterEventsByType(events) {
        if (!this.eventTypesData?.length)
            return events;
        // filter for checked event types
        const eventTypes = this.eventTypesData
            .filter((item) => item.checked)
            .map((item) => item.id);
        return events.filter((e) => eventTypes.includes(e.type));
    }
    /**
     * Create localized date range string
     * @param {Date} start start date
     * @param {Date} end end date
     * @returns {string} localized date range
     */
    formatDateRange(start, end) {
        const dateTimeOpts = { dateStyle: 'long', timeStyle: 'short' };
        const startDateStr = this.locale.formatDate(start, dateTimeOpts);
        const endDateStr = this.locale.formatDate(end, dateTimeOpts);
        // eslint-disable-next-line no-irregular-whitespace
        return `${startDateStr} - ${endDateStr}`.replace(/ /g, ' ');
    }
    /**
     * Create localized duration string
     * @param {Date} start start date
     * @param {Date} end end date
     * @returns {string} duration string
     */
    formatDuration(start, end) {
        const hours = dateDiff(start, end, true);
        // Day(s)
        if (hours >= 24) {
            const days = Math.round(hours / 24);
            const dayStr = this.locale.translate(days === 1 ? 'Day' : 'Days');
            return `${this.locale.parseNumber(days.toString())} ${dayStr}`;
        }
        // Minute(s)
        if (hours < 1) {
            const startMinutes = start.getMinutes();
            const endMinutes = end.getMinutes();
            const diffMinutes = endMinutes - startMinutes;
            const minutesStr = this.locale.translate(diffMinutes === 1 ? 'Minute' : 'Minutes');
            return `${this.locale.parseNumber(diffMinutes.toString())} ${minutesStr}`;
        }
        // Hour(s)
        const hoursStr = this.locale.translate(hours === 1 ? 'Hour' : 'Hours');
        return `${this.locale.parseNumber(hours.toString())} ${hoursStr}`;
    }
    /**
     * Formats calendar event data for detail views
     * @param {CalendarEventData} event calendar event data
     * @returns {CalendarEventDetail} detail data
     */
    #formatDetailData(event) {
        const startDate = new Date(event.starts);
        const endDate = new Date(event.ends);
        const eventType = this.getEventTypeById(event.type);
        return {
            ...event,
            dateRange: this.formatDateRange(startDate, endDate),
            duration: this.formatDuration(startDate, endDate),
            eventType: event.type,
            color: eventType?.color || 'azure'
        };
    }
    /**
     * Updates detail view with selected day events
     * @param {CalendarEventData[]} selected selected calendar events data
     */
    updateEventDetails(selected) {
        const container = this.container?.querySelector('.calendar-details-pane');
        if (!this.showDetails || !container)
            return;
        // if not month view, clear details container
        const view = this.getView();
        if (view?.tagName !== 'IDS-MONTH-VIEW') {
            container.innerHTML = '';
            return;
        }
        selected = selected || this.#getSelectedEvents() || [];
        selected = this.#filterEventsByType(selected);
        const details = selected.map((event) => this.#formatDetailData(event));
        container.innerHTML = this.state.isMobile
            ? this.detailListTemplate(details)
            : this.detailAccordionTemplate(details);
    }
    /**
     * Add new calendar event data to collection
     * @param {CalendarEventData} eventData event data
     */
    addEvent(eventData) {
        this.eventsData = this.eventsData.concat(eventData);
        this.triggerEvent('eventadded', this, {
            detail: {
                elem: this,
                value: eventData
            },
            bubbles: true,
            cancelable: true,
            composed: true
        });
    }
    /**
     * Update existing calendar event and rerender events
     * If event doesn't exist, it creates new calendar event
     * @param {CalendarEventData} data event data
     */
    updateEvent(data) {
        const events = this.eventsData.slice(0);
        const event = events.find((item) => item.id === data.id);
        if (event) {
            const eventData = Object.assign(event, data);
            this.eventsData = events;
            this.triggerEvent('eventupdated', this, {
                detail: {
                    elem: this,
                    value: eventData
                },
                bubbles: true,
                cancelable: true,
                composed: true
            });
        }
        else {
            this.addEvent(data);
        }
    }
    /**
     * Remove calendar events data and components
     */
    clearEvents() {
        this.eventsData = [];
        this.beforeEventsRender = null;
    }
    /**
     * Renders event type legend if none provided
     * @param {CalendarEventTypeData[]} eventTypes event types
     */
    renderLegend(eventTypes = []) {
        // remove previous accordion
        this.querySelector('#event-types-legend')?.remove();
        if (!this.showLegend || !eventTypes.length || this.querySelector('[slot="legend"]'))
            return;
        const checkboxes = eventTypes.map((item) => `
      <ids-checkbox
        class="event-type-checkbox"
        checked="${item.checked}"
        data-id="${item.id}"
        label="${item.translationKey ? this.locale.translate(item.translationKey) : item.label}"
        color="${item.color}07"
        disabled="${item.disabled || 'false'}">
      </ids-checkbox>
    `).join('');
        const accordion = `
      <ids-accordion id="event-types-legend" slot="legend">
        <ids-accordion-panel expanded="true">
          <ids-accordion-header slot="header" expander-type="caret">
            <ids-text translate-text="true">Legend</ids-text>
          </ids-accordion-header>
          <div slot="content"><p>${checkboxes}</p></div>
        </ids-accordion-panel>
      </ids-accordion>
    `;
        this.insertAdjacentHTML('afterbegin', accordion);
    }
    /**
     * Gets current view component
     * @returns {IdsMonthView|IdsWeekView} current view component
     */
    getView() {
        return this.container?.querySelector('ids-month-view') || this.container?.querySelector('ids-week-view');
    }
    /**
     * Toggle Month View Legend
     * @param {CalendarEventTypeData[]} eventTypes calendar event types data
     * @param {boolean} show toggle legend
     */
    #toggleMonthLegend(eventTypes, show) {
        const component = this.getView();
        if (!(component instanceof IdsMonthView))
            return;
        let legendData = null;
        if (show && Array.isArray(eventTypes) && eventTypes.length) {
            legendData = eventTypes.map((item) => ({
                name: item.label,
                color: `${item.color}-60`,
                dayOfWeek: [],
                cssClass: 'event-type',
                fontSize: 14
            }));
        }
        component.legend = legendData;
    }
    /**
     * Handle resize changes and toggle mobile/desktop elements
     * @param {ResizeObserverEntry[]} entries resize entries
     */
    #onResize(entries) {
        const width = entries[0].contentRect.width;
        const isMobile = width <= this.#mobileBreakpoint;
        if (this.state.isMobile !== isMobile) {
            this.state.isMobile = isMobile;
            this.updateEventDetails(this.state.selected);
            this.#toggleMonthLegend(this.eventTypesData, isMobile);
            this.positionFormPopup(this.getView()?.getEventElemById(this.#selectedEventId)?.container);
        }
    }
    /**
     * @returns {Date} start date
     */
    get startDate() {
        const start = this.getView()?.startDate;
        if (!start) {
            const date = this.date;
            date.setDate(1);
            return date;
        }
        return start;
    }
    /**
     * @returns {Date} end date
     */
    get endDate() {
        const end = this.getView()?.endDate;
        if (!end) {
            const date = this.date;
            date.setMonth(date.getMonth() + 1, 0);
            return date;
        }
        return end;
    }
    /**
     * Renders calendar events
     * @param {boolean} forceRender skip events fetch and render data
     * @returns {Promise<CalendarEventData>} calendar events
     */
    async renderEventsData(forceRender = false) {
        if (!forceRender && typeof this.state.beforeEventsRender === 'function') {
            this.eventsData = await this.state.beforeEventsRender(this.startDate, this.endDate);
            return;
        }
        if (!Array.isArray(this.eventsData))
            return;
        this.relayCalendarData();
        this.updateEventDetails();
    }
    /**
     * Helper to format startDate/endDate to month range
     * @param {IdsLocale} locale an optional, provided IdsLocale object
     * @returns {string} locale formatted month range
     */
    formatMonthRange(locale) {
        const targetLocale = locale || this.locale;
        if (!targetLocale)
            return '';
        const startDate = this.startDate;
        const endDate = subtractDate(this.endDate, 1, 'days');
        const startMonth = targetLocale.formatDate(startDate, { month: 'long' });
        const endMonth = targetLocale.formatDate(endDate, { month: 'long' });
        const startYear = targetLocale.formatDate(startDate, { year: 'numeric' });
        const endYear = targetLocale.formatDate(endDate, { year: 'numeric' });
        if (endYear !== startYear) {
            return `${targetLocale.formatDate(startDate, {
                month: 'short',
                year: 'numeric',
            })} - ${targetLocale.formatDate(endDate, {
                month: 'short',
                year: 'numeric',
            })}`;
        }
        if (endMonth !== startMonth) {
            return `${targetLocale.formatDate(startDate, { month: 'short' })} - ${endMonth} ${startYear}`;
        }
        return targetLocale.formatDate(startDate, { month: 'long', year: 'numeric' });
    }
};
IdsCalendar = __decorate([
    customElement('ids-calendar'),
    scss(styles),
    __metadata("design:paramtypes", [])
], IdsCalendar);
export default IdsCalendar;
//# sourceMappingURL=ids-calendar.js.map