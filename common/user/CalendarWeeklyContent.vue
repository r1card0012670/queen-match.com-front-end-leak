<template>
    <v-col class="p-0 d-calendar-content">
        <v-sheet height="90" :class="'d-box-calendar-week-wrapper'">
            <v-calendar-weekly :class="'d-box-calendar-week'" :start="start" :weekdays="weekdays" ref="vCalendarWeekly"
                               :month-format="funcMonthFormat"
                               :locale="'ja'" min-weeks="1" :day-format="funcDayFormat">
                <template v-slot:day="{ past, date }">
                    <template v-if="handleDayContent(past, date)">
                        <div class="d-inline-flex v-sheet d-line-no-plan">
                            <LoginTimeMarkComponent :typeStatus="`no-plan`"/>
                        </div>
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
import IconSvgComponent from "../../common/IconSvgComponent";
import LoginTimeMarkComponent from "../LoginTimeMarkComponent";


export default {
    data: function () {
        return {}
    },
    props: {
        userId: {
            type: String,
            required: true
        },
        dateWorkingTime: {
            type: Array,
            required: true
        },
        dateItem: {
            type: Object,
            defaultValue: {
                currentDay: new Date(),
            },
            required: true
        },
        isThumbBg: {
            type: Boolean,
            required: false
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // currentType: state => state.main.currentType
            listWorkingTime: state => state.cast.listWorkingTime,
        }),
        ...mapGetters({}),
        constant: function () {
            return Object.assign({}, C)
        },
        start: function () {
            return appUtility.dateFormat(this.dateItem.currentDay, "YYYY-MM-DD")
        },
        weekdays: function () {
            let results = [];
            let dayOfWeekNumber = +appUtility.getWeekDay(this.start, 'd');

            results.push(dayOfWeekNumber);
            Array((6 - dayOfWeekNumber)).fill(1).forEach((item, index) => results.push(dayOfWeekNumber + 1 + index));
            Array((dayOfWeekNumber)).fill(1).forEach((item, index) => results.push(index));

            return results;
        },
    },
    components: {
        IconSvgComponent,
        LoginTimeMarkComponent,
    },
    methods: {
        funcDayFormat: function (date) {
            return date.day
        },
        handleDayContent: function (past, date) {
            return this.dateWorkingTime.findIndex(ele => ele.date === date) !== -1
        },
        funcMonthFormat: function (date) {
            // Not show month
            return ""
        },
        processHasWorking: function () {
            let elementWorkingLast = document.querySelectorAll(".v-calendar-weekly__week > .v-calendar-weekly__day");
            [...elementWorkingLast].forEach(ele => {
                let elementChildren = ele.querySelector("div.d-line-no-plan");

                if (!!elementChildren) {
                    ele.classList.add("d-has-working")
                } else {
                    ele.classList.remove("d-has-working")
                }
            });
        }
    },
    mounted: function () {
        let self = this;
        self.processHasWorking()
    },
    watch: {
        dateWorkingTime: {
            handler: function (t, f) {
                this.$nextTick(() => {
                    setTimeout(() => this.processHasWorking(), 500)
                })
            },
            deep: true
        }
    }
}
</script>
