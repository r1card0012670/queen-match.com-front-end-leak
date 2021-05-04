<template>
    <div :class="[`d-dialog-plan-cast p-0`]" v-if="isShowDialog">

        <v-bottom-sheet v-if="isShowDialog" v-model="showClassCastDialog" persistent
                        :content-class="`d-dialog-show-not-fullscreen d-dialog-footer`" max-width="440">

            <v-card :class="[`d-plan-cast`, 'd-border-radius-top-15']" :id="`dialog-plan-cast`">
                <v-card-title :id="'d-card-title-plan-cast'"
                              :class="[`headline d-header-box-plan-cast p-1`]">
                    <div
                        class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100 d-border-radius-top-15">
                        <v-btn icon dark v-on:click="clickCallbackEventDataClose">
                            <v-icon class="mr-2 pt-1">close</v-icon>
                        </v-btn>
                        <v-card-title :class="`p-0`">{{ btnTitle }}</v-card-title>

                        <div class="info-bar d-title-plan-cast pr-5 btn" v-if="titleName">
                            {{ titleName }}
                        </div>
                        <v-btn class="info-bar d-act-title-plan-cast pr-0 button-choice text-brown"
                               color="green darken-1" text
                               @click="clickSubmitEventData">
                            保存
                        </v-btn>
                    </div>
                </v-card-title>

                <div class="col-12 p-0">
                    <v-divider :class="`mt-0 mb-0 width-2`"/>
                </div>

                <v-card-text :id="'d-card-text-feed-detail'">
                    <v-sheet height="64" class="d-flex justify-content-between p-0 d-calendar-title">
                        <v-btn text class="d-inline-flex btn p-0 ml-0" :disabled="dateItem.prev" @click="prev">
                            <div class="d-inline-flex">
                                <IconSvgComponent :className="'d-inline-block btn p-0'" :type="'chevron-left'"/>
                            </div>
                            前の週
                        </v-btn>

                        <v-toolbar-title :class="'d-inline-flex p-0'">{{ currentYearMonth }}</v-toolbar-title>

                        <v-btn text class="d-inline-flex btn p-0 mr-0" @click="next" :disabled="dateItem.next">
                            次の週
                            <div class="d-inline-flex mr-0 p-0">
                                <IconSvgComponent :className="'d-inline-block btn p-0'" :type="'chevron-right'"/>
                            </div>
                        </v-btn>

                    </v-sheet>
                    <v-spacer></v-spacer>

                    <v-sheet class="d-set-plan-for-cast">
                        <v-calendar-weekly :class="'d-box-calendar-week'" :start="start" :weekdays="weekdays"
                                           :month-format="funcMonthFormat"
                                           :locale="'ja'" min-weeks="1" :day-format="funcDayFormat">
                            <template v-slot:day="{ past, date }">
                                <template v-if="handleDayContent(past, date)">
                                    <div class="d-box-action p-0">
                                        <div class="d-flex justify-content-between">
                                            <div class=" justify-content-start col-10 p-0" role="button"
                                                 @click="clickSetTimePlan(date)">
                                                <!-- Force update component-->
                                                <input type="hidden" name="" :value="forceUpdate">
                                                <v-btn outlined plain
                                                       :class="[`justify-start d-width-100 justify-content-between`, checkValueDayOfPlan(date) ? '' : 'choiced']">
                                                    <div class="d-value-plan-time">{{ getValueTimeOfPlan(date) }}</div>
                                                    <v-icon right class="justify-end">query_builder</v-icon>
                                                </v-btn>
                                            </div>

                                            <div class="justify-content-end">
                                                <v-switch class="" :disabled="checkValueDayOfPlan(date)"
                                                          v-model="valueActiveOfPlan" :value="funcFormatKey(date)"
                                                          @click="handleDayActive(date)"></v-switch>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                        </v-calendar-weekly>
                    </v-sheet>

                    <v-sheet class="d-note-plan p-2">
                        <p>待機時間を事前に登録をするとプロフィールに空き時間が表 示され、個別アポが取りやすくなります。待機時間中はコー ル当選率が上がり「探す」にも優先表示されるようになりま
                            す。</p>
                    </v-sheet>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>

        <SetupTimePlanDialog v-if="isCloseTimePlan" :btnTitle="btnTitleTimePlan" :isShowDialog="isCloseTimePlan"
                             :vModel="vModelTimeChange" :stringDate="stringDate" @changeTime="funcEmitDataTimePlan"/>
    </div>
</template>

<script>
import C from "../../utils/constants";
import SetupTimePlanDialog from "./SetupTimePlanDialog";
import IconSvgComponent from "./../../common/IconSvgComponent";
import appUtility from "../../utils/app-utility";
import {mapGetters, mapState} from "vuex";

/**
 * Interface: constructor
 */
let StructDataPlans = function (payload) {
    this.valDay = _.has(payload, "valDay") ? payload.valDay : null
    this.valDayFrom = _.has(payload, "valDayFrom") ? payload.valDayFrom : null
    this.valDayTo = _.has(payload, "valDayTo") ? payload.valDayTo : null
    this.dateKey = _.has(payload, "dateKey") ? payload.dateKey : null
    this.isActive = _.has(payload, "isActive") ? payload.isActive : false
}

/**
 *
 * @param payload, it's object
 * @returns {StructDataFormat}
 */
let dataFormatPlan = function (payload) {
    return new StructDataPlans(payload)
}

export default {
    data: function () {
        return {
            forceUpdate: 0,
            isCloseTimePlan: false,
            dateItem: {
                currentDay: new Date(),
                prev: true,
                next: false
            },
            countActiveNext: 1,

            btnTitleTimePlan: '',
            vModelData: {},
            stringDate: '',
            vModelTimeChange: [],
            valueActiveOfPlan: []
        }
    },
    model: {
        event: 'change'
    },
    props: {
        btnTitle: {
            type: String,
            default: "活動予定カレンダー"
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
        funcCallbackEventData: {
            type: Function,
            required: true
        },
        vModel: {
            type: Array,
            defaultValue: ""
        }
    },
    components: {
        SetupTimePlanDialog,
        IconSvgComponent
    },
    mounted() {
    },
    computed: {
        ...mapState({
            listWorkingTime: state => state.cast.listWorkingTime
        }),
        ...mapGetters({}),
        constant: function () {
            return Object.assign({}, C)
        },
        showClassCastDialog: function () {
            return !!this.isShowDialog
        },
        currentYearMonth: function () {
            return appUtility.dateFormat(new Date(), "YYYY年MM月")
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
        getValueTime: function () {
            return this.vModelData
        }
    },
    methods: {
        mapData: function () {

            let result = {}
            let listKey = []
            this.listWorkingTime.forEach(ele => {
                let key = appUtility.dateFormat(ele.date, "YYYYMMDD");

                let valDay = appUtility.dateFormat(ele.date + ' ' + ele.start_time, "HH:mm") + ' ~ ' + appUtility.dateFormat(ele.date + ' ' + ele.end_time, "HH:mm");
                let valDayFrom = appUtility.dateFormat(ele.date + ' ' + ele.start_time, "HHmm");
                let valDayTo = appUtility.dateFormat(ele.date + ' ' + ele.end_time, "HHmm");
                let isActive = true;
                listKey.push(key)

                result[key] = Object.assign({}, {valDay, valDayFrom, valDayTo, dateKey: key, isActive})
            });

            this.valueActiveOfPlan = listKey;
            this.vModelData = result;
        },
        clickCallbackEventDataClose: function () {
            this.funcCallbackEventData({changeData: false})
        },
        clickSubmitEventData: async function () {
            // TODO
            // call api save
            // Close dialog
            await this.$store.dispatch('updateListWorkingTimeDispatch', this.vModelData)
            this.funcCallbackEventData({changeData: true});
            this.$emit('resetListWorkingTime');
        },
        insertString: function (origString = "", indexPosition = 2, stringToAdd = ":") {
            // Split the string into individual
            // characters
            origString = origString.split('');
            // Insert the string at the index position
            origString.splice(indexPosition, 0, stringToAdd);

            // Join back the individual characters
            // to form a new string
            return origString.join('');
        },
        funcEmitDataTimePlan: function (data) {
            if (_.has(data, "date") && _.has(data, "stringDate") && this.vModelData[data.stringDate] && !!data.isAction) {
                let tmp = this.vModelData[data.stringDate];
                let dataDate = (data.date || []).sort();
                tmp.valDay = this.insertString(dataDate[0]) + " ~ " + this.insertString(dataDate[1]);

                tmp.valDayFrom = dataDate[0];
                tmp.valDayTo = dataDate[1];

                this.vModelData[data.stringDate] = tmp;

                // Trigger: Force update component
                this.forceUpdate++
            }

            this.isCloseTimePlan = false
        },
        clickSetTimePlan: function (date) {
            this.btnTitleTimePlan = appUtility.dateFormat(date, "YYYY年MM月DD金");
            this.stringDate = appUtility.dateFormat(date, "YYYYMMDD");
            let tmp = this.vModelData[this.stringDate];
            if (tmp.valDayFrom && tmp.valDayTo) {
                this.vModelTimeChange = ([tmp.valDayFrom, tmp.valDayTo]).sort()
            } else {
                this.vModelTimeChange = []
            }

            this.$nextTick(() => {
                this.isCloseTimePlan = true;
            });
        },
        prev() {
            let currentDay = appUtility.dateSubtract(this.dateItem.currentDay, 7, 'day');
            let isCheck = appUtility.isSameOrAfter(new Date(), currentDay.toString());
            if (isCheck) {
                this.countActiveNext = this.countActiveNext - 1;
            }
            if (!this.dateItem.prev) {
                this.dateItem = Object.assign({}, this.dateItem, {
                    prev: isCheck,
                    next: this.countActiveNext >= 2,
                    currentDay: appUtility.dateSubtract(this.dateItem.currentDay, 7, 'day')
                })
            }
            this.forceUpdate++
        },
        next() {
            let currentDay = appUtility.dateAdd(this.dateItem.currentDay, 7, 'day');
            let isCheck = appUtility.isSameOrAfter(new Date(), currentDay.toString());
            if (!isCheck) {
                this.countActiveNext = ++this.countActiveNext;
            }
            this.dateItem = Object.assign({}, this.dateItem, {
                prev: isCheck,
                next: this.countActiveNext >= 2,
                currentDay
            })

            this.forceUpdate++
        },
        funcDayFormat: function (date) {
            return date.day
        },
        handleDayContent: function (past, date) {
            let self = this;

            //
            let formatDateKey = this.funcFormatKey(date);

            if (!_.has(self.vModelData, formatDateKey)) {
                self.initDateWeekPlan({dateKey: formatDateKey});
            }

            //TODO
            // Map data had plan
            // let currentDate = _.cloneDeep(self.vModelData[formatDateKey]);

            return true
        },
        funcMonthFormat: function (date) {
            // Not show month
            return ""
        },
        initDateWeekPlan: function (payload) {
            let tmpDataFilter = dataFormatPlan(payload);

            if (_.has(tmpDataFilter, "dateKey") && tmpDataFilter.dateKey) {
                this.vModelData[tmpDataFilter.dateKey] = tmpDataFilter
            }
        },
        funcFormatKey: function (date) {

            return `${appUtility.dateFormat(date, "YYYYMMDD")}`
        },
        getValueTimeOfPlan: function (date) {
            let self = this;
            let formatDateKey = this.funcFormatKey(date);
            let obj = self.vModelData[formatDateKey];
            if (!_.has(obj, "valDay") || !obj.valDay) {
                return "出勤登録する"
            }

            return obj.valDay
        },
        checkValueDayOfPlan: function (date) {
            let self = this;
            let formatDateKey = this.funcFormatKey(date);
            let obj = self.vModelData[formatDateKey];

            return (!_.has(obj, "valDay") || !obj.valDay);
        },
        handleDayActive: function (date) {
            let self = this;
            let formatDateKey = this.funcFormatKey(date);
            let obj = self.vModelData[formatDateKey];

            if (!_.has(obj, "valDay") || !obj.valDay) {
                return;
            }

            obj.isActive = !obj.isActive
            // Set data
            self.vModelData[formatDateKey] = obj;
        }
    },
    created() {
        this.mapData();
    },
    destroyed() {
        this.stringDate = ""
        this.vModelData = {}
        this.vModelTimeChange = []
        this.valueActiveOfPlan = []
    }
}
</script>
