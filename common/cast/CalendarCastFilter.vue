<template>
    <v-sheet :class="[`d-box-${typeCalendar}-wrapper`, `calendar-wrapper`]">
        <div class="calendar-header">
            <div class="calendar-header__wrapper">
                <div class="calendar-header__day">日</div>
                <div class="calendar-header__day">月</div>
                <div class="calendar-header__day">火</div>
                <div class="calendar-header__day">水</div>
                <div class="calendar-header__day">木</div>
                <div class="calendar-header__day">金</div>
                <div class="calendar-header__day">土</div>
            </div>
        </div>
        <v-calendar ref="calendar" v-model="vModelValue" :weekdays="weekdays" :type="typeCalendar" :color="color"
                    :events="events" :event-overlap-mode="mode" :event-overlap-threshold="30" :locale="locale"
                    :event-color="getEventColor" @change="getEvents" :month-format="funcMonthFormat" :now="startDate"
                    :day-format="funcDayFormat" :hide-header="false" @click:date="clickDayOfCalendar"
                    :interval-count="8" :first-interval="9"
        >
            <template v-if="typeCalendar === 'week'" v-slot:day-label-header="event">
                <v-btn
                    small
                    fab
                    :disabled="isPast(event.date)"
                    @click="clickDayOfCalendar(event)"
                >
                    {{ event.day }}
                </v-btn>
            </template>

            <template v-if="typeCalendar === 'month'" v-slot:day-label="event">
                <v-btn
                    small
                    fab
                    :disabled="isPast(event.date)"
                    @click="clickDayOfCalendar(event)"
                >
                    {{ event.day }}
                </v-btn>
            </template>
        </v-calendar>
    </v-sheet>
</template>

<script>
import {mapActions} from "vuex";
import appUtility from './../../utils/app-utility.js';

export default {
    data: function () {
        return {
            locale: 'ja',
            startDate: new Date(),
            color: "rgba(255, 0, 0, 0.5)",
            events: [],
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            vModelValue: "", // It's v-model
            mode: 'stack',
            isShowMoreCalendar: false,
        }
    },
    props: {
        payload: {
            type: Object,
            defaultValue: {}
        },
        styleOption: {
            type: String,
            defaultValue: "",
        },
        now: {
            type: String,
            defaultValue: "",
            required: false
        },
        typeCalendar: {
            type: String,
            defaultValue: "",
            required: true
        },
    },
    model: {
        event: 'eventCalendar'
    },
    components: {},
    mounted() {
    },
    methods: {
        ...mapActions({
            getWorkingDays: 'getWorkingDays',
        }),
        funcEmitData: function () {
            this.$emit('eventCalendar', this.vModelValue);
        },
        calendarPrev: function () {
            if (appUtility.dateFormat(this.$refs.calendar.lastStart.date, "YYYY-MM-DD") > appUtility.dateFormat(new Date(), "YYYY-MM-DD")) {
                this.$refs.calendar.prev();
            }
        },
        calendarPrevTitle: function () {
            let self = this;
            let lastStartDate = this.$refs.calendar.lastStart.date;
            if (self.typeCalendar === "month") {
                lastStartDate = appUtility.dateSubtract(lastStartDate, 1, "month")
            }

            return appUtility.dateFormat(lastStartDate, "MM/YYYY")
        },
        calendarNext: function () {
            this.$refs.calendar.next();
        },
        calendarNextTitle: function () {
            let self = this;
            let lastEndDate = this.$refs.calendar.lastEnd.date;
            if (self.typeCalendar === "month") {
                lastEndDate = appUtility.dateAdd(lastEndDate, 1, "month")
            }

            return appUtility.dateFormat(lastEndDate, "MM/YYYY")
        },
        funcFormatKey: function (date) {
            return `${appUtility.dateFormat(date, "YYYYMMDD")}`
        },
        getEvents(dataEvent) {
            const params = {
                startTime: dataEvent.start.date,
                endTime: dataEvent.end.date,
            };

            this.$store.dispatch('getWorkingDays', params)
                .then(response => {
                    this.events = response.data.map(x => {
                        return {
                            start: x,
                            name: '',
                        }
                    });
                })
                .catch(error => {
                    // console.log(error);
                })
        },
        getEventColor(event) {
            return event.color
        },
        rnd(a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
        funcDayFormat: function (date) {
            return date.day
        },
        funcMonthFormat: function (date) {
            // Not show month
            return ""
        },
        clickDayOfCalendar: function (event) {
            this.startDate = event.date;
            this.vModelValue = event.date;
            this.$nextTick(() => {
                this.funcEmitData();
            });
        },
        isPast: function (date) {
            return date < appUtility.dateFormat(new Date(), "YYYY-MM-DD");
        },
    },
    computed: {
        weekdays: function () {
            return [0, 1, 2, 3, 4, 5, 6]
        },
    },
    watch: {
        vModelValue: function (after, before) {
            this.$nextTick(() => {
                this.funcEmitData();
            })
        },
    },
    created() {
        let startDate = !this.now ? appUtility.dateFormat(new Date(), "YYYY-MM-DD") : this.now;
        this.startDate = startDate;
        this.vModelValue = startDate;
    },
}
</script>

<style lang="scss" scoped>
.v-btn--is-elevated.v-btn--fab::v-deep {
    margin: 0 0 5px 0;
}

.calendar-header {
    padding: 10px 6px;
    border-bottom: 1px solid #F4F5F9;

    &__wrapper {
        display: flex;
        flex-wrap: wrap;
    }

    &__day {
        width: calc(100% / 7);
        font-size: 16px;
        font-weight: bold;
        color: #B3B2B1;
        text-align: center;
    }
}

.calendar-wrapper {
    &::v-deep {
        .theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
            background-color: unset !important;
            color: #dededd !important;

            .v-btn {
                &__content {
                    color: #B3B2B1;
                    cursor: unset;
                }
            }
        }

        .theme--light.v-btn.v-btn--has-bg {
            background-color: unset;
            box-shadow: none;
        }

        .theme--light.v-calendar-weekly .v-calendar-weekly__day {
            height: 56px;
        }
    }
}
</style>
