<template>
    <v-col class="p-0 d-calendar-content-filter">
        <v-sheet height="120" id="d-box-calendar-week-filter-cast" :class="'d-box-calendar-week-filter-cast-wrapper'">
            <v-calendar-weekly :class="'d-box-calendar-week d-border-none'" :start="start" locale="ja"
                               :color="classColor" :weekdays="weekdays" min-weeks="2" @click:date="clickDayFilterCast"
                               :month-format="funcMonthFormat" :day-format="funcDayFormat">
                <template v-slot:day="{ past, date }">
                    <template>
                        <div class="d-none" :data-date="funcFormatKey(date)" :id="funcFormatKey(date)"></div>
                    </template>
                </template>
            </v-calendar-weekly>
        </v-sheet>
    </v-col>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import appUtility from "../../utils/app-utility";

/**
 * Interface: constructor
 */
let StructDataFormat = function (payload) {
    this.isChosenDay = _.has(payload, "isChosenDay") ? payload.isChosenDay : false
    this.dateKey = _.has(payload, "dateKey") ? payload.dateKey : null
}

/**
 *
 * @param payload, it's object
 * @returns {StructDataFormat}
 */
let dataFilter = function (payload) {
    return new StructDataFormat(payload)
}

let removeMany = function (element, classes = []) {
    if (element && _.isFunction(element.remove)) {
        (classes || []).forEach(item => {
            element.remove(item);
        });
    }
}
let addMany = function (element, classes = []) {
    if (element && _.isFunction(element.add)) {
        (classes || []).forEach(item => {
            element.add(item);
        });
    }
}
const listRemoves = ['v-future', 'v-present', 'v-pass', 'v-outside'];
const classTransparent = 'transparent';

export default {
    data: function () {
        return {
            vModelData: {},
        }
    },
    model: {
        event: 'change'
    },
    props: {
        currentDay: {
            type: Date,
            required: true
        },
        colorActive: {
            type: String,
            defaultValue: '',
            required: false
        }
    },
    computed: {
        ...mapState({}),
        ...mapGetters({}),
        constant: function () {
            return Object.assign({}, C)
        },
        start: function () {
            return appUtility.dateFormat(this.currentDay, "YYYY-MM-DD")
        },
        weekdays: function () {
            let results = [];
            let dayOfWeekNumber = +appUtility.getWeekDay(this.start, 'd');

            results.push(dayOfWeekNumber);
            Array((6 - dayOfWeekNumber)).fill(1).forEach((item, index) => results.push(dayOfWeekNumber + 1 + index));
            Array((dayOfWeekNumber)).fill(1).forEach((item, index) => results.push(index));

            return results;
        },
        classColor: function () {
            if (!this.colorActive) {
                return ""
            }
            return this.colorActive;
        }
    },
    methods: {
        initDataDateWeek: function (payload) {
            let tmpDataFilter = dataFilter(payload);

            if (_.has(tmpDataFilter, "dateKey") && tmpDataFilter.dateKey) {
                this.vModelData[tmpDataFilter.dateKey] = tmpDataFilter
            }
        },
        initResetFormatPlainCalender: function () {
            let self = this;
            let idCalendarWeekFilterCast = document.getElementById('d-box-calendar-week-filter-cast');
            if (idCalendarWeekFilterCast) {

                // v-calendar-weekly__head
                [...idCalendarWeekFilterCast.querySelectorAll(".v-calendar-weekly__head > .v-calendar-weekly__head-weekday")]
                    .forEach(element => {
                        // remove class
                        removeMany(element.classList, listRemoves);

                        element.classList.add('d-border-none')
                        element.classList.add('d-color-inherit')
                    });

                // v-calendar-weekly__week
                [...idCalendarWeekFilterCast.querySelectorAll(".v-calendar-weekly__week > .v-calendar-weekly__day")]
                    .forEach(element => {
                        removeMany(element.classList, listRemoves);

                        element.classList.add('d-border-none');
                        element.classList.add('d-border-none');
                        let dateKeyElement = element.querySelector("div[data-date]");
                        let dayButtonElement = element.querySelector(".v-calendar-weekly__day-label > button");
                        if (!!dayButtonElement) {
                            dayButtonElement.classList.add(classTransparent);
                            // Add style button
                            if (self.classColor && self.classColor.length) {
                                dayButtonElement.style["background-color"] = self.classColor;
                                dayButtonElement.style["border-color"] = self.classColor;
                            }
                        }
                        if (dateKeyElement && dateKeyElement.id) {
                            element.classList.add(`d-${dateKeyElement.id}-box`);
                            // init data default
                            let payload = {dateKey: dateKeyElement.id}
                            self.initDataDateWeek(payload)
                        }
                    });
            }
        },
        funcDayFormat: function (date) {
            return date.day
        },
        funcMonthFormat: function (date) {
            // Not show month
            return ""
        },
        clickDayFilterCast: function (event) {
            let self = this;
            let formatDateKey = this.funcFormatKey(event.date);
            if (!_.has(self.vModelData, formatDateKey)) {
                self.initDataDateWeek({dateKey: formatDateKey});
            }
            let currentDate = _.cloneDeep(self.vModelData[formatDateKey]);

            currentDate.isChosenDay = !currentDate.isChosenDay;
            let dateKeyButtonElement = document.querySelector(`div.d-${formatDateKey}-box button`);
            if (!!dateKeyButtonElement) {
                // dateKeyButtonElement.removeAttribute("style");
                if (currentDate.isChosenDay) {
                    dateKeyButtonElement.classList.remove(classTransparent);
                    addMany(dateKeyButtonElement.classList, ['d-day-active']);
                } else {
                    removeMany(dateKeyButtonElement.classList, ['d-day-active']);
                    dateKeyButtonElement.classList.add(classTransparent);
                }
            }
            // update
            self.initDataDateWeek(currentDate);
            // Event emit data
            self.funcEmitData();
        },
        funcFormatKey: function (date) {
            return `${appUtility.dateFormat(date, "YYYYMMDD")}`
        },
        funcEmitData: function () {
            this.$emit('change', this.vModelData);
        }
    },
    mounted: function () {
        this.initResetFormatPlainCalender()
    }
}
</script>
