<template>
    <div v-if="isShowDialog" :class="[`d-dialog-schedule-to-join p-0`]">

        <v-bottom-sheet v-if="isShowDialog" v-model="showDataActionDialog"
                        :content-class="`d-dialog-show-not-fullscreen`" @keydown.esc=funcCloseEventData
                        max-width="440" persistent @click:outside="funcCloseEventData">

            <v-card :id="`dialog-action-schedule-to-join`"
                    :class="[`d-action-schedule-to-join d-dialog-footer`, 'd-border-radius-top-15']">
                <v-card-title :id="'d-card-title-schedule-to-join'"
                              :class="[`headline d-header-box-action-schedule-to-join p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <button class="d-flex pl-2 pr-3" v-on:click="funcCloseEventData">
                            <v-img src="../../images/times.svg"></v-img>
                        </button>
                        <v-card-title :class="`p-0`">{{ btnTitle }}</v-card-title>

                        <div v-if="titleName" class="info-bar d-title-schedule-to-join pr-5 btn">
                            {{ titleName }}
                        </div>
                        <v-btn class="info-bar d-act-title-schedule-to-join pr-0 button-choice text-brown"
                               color="green darken-1"
                               text @click="clickCallbackEventData">
                            保存
                        </v-btn>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-schedule-to-join'" class="d-schedule-to-join">
                    <div class="d-content-item schedule-to-join-item d-box-list-items">
                        <v-item-group v-if="listItemAllowScheduleToJoin.length" class="tag-wrapper p-0">
                            <div class="list-tag list-tag-v2 no-scroll m-0">
                                <v-chip v-for="(item, i) in listItemAllowScheduleToJoin" :key="i"
                                        @click="clickActive(item)"
                                        :color="checkColorToJoin(item.id)">
                                    {{ item.name }}
                                </v-chip>
                            </div>
                        </v-item-group>
                        <div v-if="isShowOther" class="d-box-calender-filter-wrap mt-0 pb-0">
                            <v-col class="p-0">
                                <v-col class="d-flex justify-content-between p-0 d-calendar-title v-sheet m-0">
                                    <div class="d-flex d-inline-flex">
                                        <v-btn plain text color="red" class="pr-0" @click="clickCalendarPrev">
                                            <v-icon left>chevron_left</v-icon>
                                            {{ txtCalendarPrevTitle }}
                                        </v-btn>
                                    </div>
                                    <div class="v-toolbar__title d-inline-flex p-0">
                                        <div plain text class="text--black p-0">{{ formatDateSchedule }}</div>
                                    </div>
                                    <div class="d-flex d-inline-flex">
                                        <v-btn plain text color="red" class="pl-0" @click="clickCalendarNext">
                                            {{ txtCalendarNextTitle }}
                                            <v-icon right>chevron_right</v-icon>
                                        </v-btn>
                                    </div>
                                </v-col>

                                <v-calendar ref="calendar" v-model="vModelCalendarValue" :color="colorSchedule"
                                            :weekdays="weekdays" :type="typeCalendar" :event-overlap-threshold="30"
                                            :locale="locale" :now="startDate" :month-format="funcMonthFormat"
                                            :day-format="funcDayFormat" :hide-header="false"
                                            @click:date="clickDayOfCalendar" :interval-count="8" :first-interval="9"/>

                                <v-col
                                    class="d-flex justify-content-between d-box-wrap-schedule-to-join p-0 flex-column">
                                    <div class="d-box-wrap-schedule-to-join-title">時刻</div>
                                    <div class="col-12 p-0 d-flex justify-content-center">
                                        <div class="d-box-time-1 col-2 pt-0 pb-0">
                                            <TimeRequestMerge :idElement="'hours'" :vModelCurrent="vModelCurrentHours"
                                                              :keyDefault="keyDefaultHour"
                                                              @changeTime="handleEventChangeHours"
                                                              :renderTimePlan="renderTimeHours"/>
                                        </div>
                                        <div
                                            class="d-flex d-box-2 text-center justify-content-center align-self-center p-0 col-1 mb-7">
                                            :
                                        </div>
                                        <div class="d-box-time-2 col-2 pt-0 pb-0">
                                            <TimeRequestMerge :idElement="'minutes'"
                                                              @changeTime="handleEventChangeMinute"
                                                              :vModelCurrent="vModelCurrentMinutes"
                                                              :keyDefault="keyDefaultMinutes"
                                                              :renderTimePlan="renderTimeMinutes"/>
                                        </div>
                                    </div>
                                </v-col>
                            </v-col>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>

import C from "../../utils/constants";
import {mapState} from "vuex";
import appUtility from "../../utils/app-utility";
import TimeRequestMerge from "./TimeRequestMerge";

const _other = "m_other"

export default {
    data: function () {
        return {
            objItemSelect: {},
            itemSelectId: "",
            color: "",
            colorActive: "active",
            valueItemSelect: "",
            vModelCalendarValue: "",
            isShowCalendarForSchedule: "",
            typeCalendar: "month",
            locale: "ja",
            startDate: appUtility.momentTzNow("YYYY-MM-DD"), // Default
            elementCalendar: null,
            txtCalendarPrevTitle: "",
            txtCalendarNextTitle: "",
            colorSchedule: "red",
            vModelCurrentHours: "",
            vModelCurrentMinutes: "",
        }
    },
    model: {
        event: 'change'
    },
    props: {
        btnTitle: {
            type: String,
            defaultValue: ""
        },
        titleName: {
            type: String,
            defaultValue: ""
        },
        classList: {
            type: String,
            defaultValue: ""
        },
        isShowDialog: {
            type: Boolean,
            required: true
        },
        isDraft: {
            type: Boolean,
            required: true
        },
        funcCloseEventData: {
            type: Function,
            required: true
        },
    },
    mounted: function () {
        let self = this;
        if (self.step1.scheduleToJoin.id === _other) {
            self.handleCalendarNextTitle()
            self.handleCalendarPrevTitle()
        }
    },
    components: {
        TimeRequestMerge
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            step1: state => state.book.step1,
            tempStep1: state => state.book.tempStep1,
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        dataStep1: function () {
            if (this.isDraft) {
                return this.tempStep1;
            }
            return this.step1
        },
        showDataActionDialog: function () {
            return !!this.isShowDialog
        },
        listItemAllowScheduleToJoin: function () {
            return this.constant.SCHEDULE_TO_JOIN_MINUTES;
        },
        itemOther: function () {
            return this.constant.SCHEDULE_TO_JOIN_MINUTES.filter(ele => {
                return ele.id === _other
            })
        },
        isShowOther: function () {
            // if (this.objItemSelect.id === _other) {
            //     this.loadingElement = true
            // }
            return this.objItemSelect.id === _other;

        },
        weekdays: function () {
            return [0, 1, 2, 3, 4, 5, 6]

            // let results = [];
            // let dayOfWeekNumber = +appUtility.getWeekDay(this.startDate, 'd');
            //
            // results.push(dayOfWeekNumber);
            // Array((6 - dayOfWeekNumber)).fill(1).forEach((item, index) => results.push(dayOfWeekNumber + 1 + index));
            // Array((dayOfWeekNumber)).fill(1).forEach((item, index) => results.push(index));
            //
            // return results;
        },
        formatDateSchedule: function () {
            return appUtility.dateFormat(this.startDate, "MM月DD日")
        },
        renderTimeHours: function () {
            return Array(24).fill(1).map((element, idx) => ({
                id: (idx < 10 ? "0" : "") + idx,
                value: (idx < 10 ? "0" : "") + idx
            }))
        },
        keyDefaultHour: function () {
            return appUtility.dateFormat(appUtility.dateAdd(appUtility.momentTzNow("YYYY-MM-DD HH:mm:00"), 30, "m"), "HH");
        },
        renderTimeMinutes: function () {
            return Array(60).fill(1).map((element, idx) => ({
                id: (idx < 10 ? "0" : "") + idx,
                value: (idx < 10 ? "0" : "") + idx
            }))
        },
        keyDefaultMinutes: function () {
            return appUtility.dateFormat(appUtility.dateAdd(appUtility.momentTzNow("YYYY-MM-DD HH:mm:00"), 30, "m"), "mm");
        },
    },
    methods: {
        funcDayFormat: function (date) {
            return date.day
        },
        funcMonthFormat: function (date) {
            // Not show month
            return ""
        },
        clickDayOfCalendar: function (event) {
            let now = appUtility.momentTzNow("YYYY-MM-DD")
            if (appUtility.isSameOrAfter(now, event.date)) {
                return;
            }
            this.startDate = appUtility.dateFormat(event.date, "YYYY-MM-DD");
            // this.$nextTick(() => {
            //     this.funcEmitData();
            // });
        },
        clickChangeScheduleToJoin: function () {
            this.isShowCalendarForSchedule = true;
        },
        checkColorToJoin: function (itemId) {
            return itemId === this.itemSelectId ? this.colorActive : this.color
        },
        clickActive: function (item) {
            this.itemSelectId = item.id
            this.objItemSelect = item

            if (item.id === _other) {
                this.initFetchTitle()
            }
        },
        clickCallbackEventData: function () {
            // Validate
            if (!_.isObject(this.objItemSelect) || !Object.keys(this.objItemSelect).length) {
                return;
            }
            let value = this.objItemSelect.value
            let name = (this.objItemSelect.id === 'm_30') ? `今すぐ(${this.objItemSelect.name})` : this.objItemSelect.name
            let tmpMinute = this.objItemSelect.id === _other ? 0 : this.objItemSelect.value;
            let now = appUtility.momentTzNow("YYYY-MM-DD HH:mm:00");
            let date = appUtility.dateFormat(appUtility.dateAdd(now, tmpMinute, 'm'), "YYYY-MM-DD HH:mm:00");

            if (this.objItemSelect.id === _other) {
                let weekDays = {0: "日", 1: "月", 2: "火", 3: "水", 4: "木", 5: "金", 6: "土"}
                value = this.startDate
                name = appUtility.dateFormat(this.startDate, "MM月DD日");
                name += `(${weekDays[appUtility.getWeekDay(this.startDate, 'd')]}) ${this.vModelCurrentHours}:${this.vModelCurrentMinutes}`;
                date = appUtility.dateFormat(`${this.startDate} ${this.vModelCurrentHours}:${this.vModelCurrentMinutes}`, "YYYY-MM-DD HH:mm:00");

                // Validate datetime other
                let now30Minute = appUtility.dateFormat(appUtility.dateAdd(now, 30, 'm'), "YYYY-MM-DD HH:mm:00")
                if (appUtility.isSameOrAfter(now30Minute, date)) {
                    return;
                }
            }

            // Emit data before use method callback
            this.$store.dispatch("updateScheduleToJoinStep1Dispatch", {
                scheduleToJoin: {
                    id: this.objItemSelect.id, //Required
                    name, // Required
                    value, // Required
                    date: date, // Required
                    ...this.objItemSelect.id === _other && {startDate: this.startDate},
                    ...this.objItemSelect.id === _other && {hours: this.vModelCurrentHours},
                    ...this.objItemSelect.id === _other && {minutes: this.vModelCurrentMinutes},
                },
                isDraft: this.isDraft
            });

            this.funcCloseEventData({isTypeAction: true})
        },
        clickCalendarPrev: function () {
            this.$refs.calendar.prev();
            this.initFetchTitle()
        },
        clickCalendarNext: function () {
            this.$refs.calendar.next();
            this.initFetchTitle()
        },
        handleCalendarPrevTitle: function () {
            let self = this;
            self.$nextTick(() => {
                let lastStartDate = self.$refs.calendar.lastStart.date;

                if (self.typeCalendar === "month") {
                    lastStartDate = appUtility.dateSubtract(lastStartDate, 1, "month")
                }

                this.txtCalendarPrevTitle = appUtility.dateFormat(lastStartDate, "MM/YYYY")
            });
        },
        handleCalendarNextTitle: function () {
            let self = this;
            self.$nextTick(() => {
                let lastEndDate = this.$refs.calendar.lastEnd.date;
                if (self.typeCalendar === "month") {
                    lastEndDate = appUtility.dateAdd(lastEndDate, 1, "month")
                }

                this.txtCalendarNextTitle = appUtility.dateFormat(lastEndDate, "MM/YYYY")
            })
        },
        handleEventChangeHours: function (data) {
            this.vModelCurrentHours = data
        },
        handleEventChangeMinute: function (data) {
            this.vModelCurrentMinutes = data
        },
        initFetchTitle: function () {
            this.handleCalendarNextTitle()
            this.handleCalendarPrevTitle()
        }
    },
    created() {
        let self = this;
        if (_.has(self.dataStep1, "scheduleToJoin.id")) {
            self.itemSelectId = self.dataStep1.scheduleToJoin.id

            if (self.itemSelectId === _other) {
                this.objItemSelect = self.dataStep1.scheduleToJoin;

                let valDate = _.has(self.dataStep1, "scheduleToJoin.startDate") ? self.dataStep1.scheduleToJoin.startDate : appUtility.momentTzNow("YYYY-MM-DD HH:mm:00");
                let startDate = appUtility.dateFormat(valDate, "YYYY-MM-DD");

                this.vModelCurrentHours = _.has(self.dataStep1, "scheduleToJoin.hours") ? self.dataStep1.scheduleToJoin.hours : appUtility.dateFormat(valDate, "HH");
                this.vModelCurrentMinutes = _.has(self.dataStep1, "scheduleToJoin.minutes") ? self.dataStep1.scheduleToJoin.minutes : appUtility.dateFormat(valDate, "mm");
                self.startDate = startDate;
                self.vModelCalendarValue = startDate;
            }
        }
    },
    destroyed() {
        this.objItemSelect = {}
        this.itemSelectId = "";
    }
}
</script>
