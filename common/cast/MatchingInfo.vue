<template>
    <v-card-text :class="[`d-time-plan-cast p-0`]" v-if="checkShowBoxInfoOrderForCast && isForceShowElementOrderOfCast">
        <div class="d-inline-flex p-0">
            <div class="d-time-plan-cast-confirm">合流確定</div>
            <div class="pl-2 d-time-plan-cast-time">{{ infoOrderShow }}</div>
        </div>
        <template v-if="actionType === 'CONFIRM_ORDER'">
            <div class="d-flex justify-content-center pt-5">
                <v-col class="p-0 m-0 col-4 mr-2 d-cus-btn-base">
                    <v-btn outlined text class="btn-base" @click="cancelOrderByCast">キャンセル</v-btn>
                </v-col>
                <v-col class="p-0 m-0 col-4 ml-2">
                    <v-btn outlined class="btn-base" @click="confirmOrderByCast">確定</v-btn>
                </v-col>
            </div>
        </template>
        <template v-else-if="actionType === 'MATCHED'">
            <div class="d-flex justify-content-between pt-5">
                <div class="d-inline-flex text--white align-items-center">
                    <div v-for="(item, index) in divideTimeMerge" :key="index"
                         :class="[{'text--black p-2 border d-input-time' : !isDistance(item)}, 'mr-2 d-text-time', `d-items-${index}`]">
                        {{ item }}
                    </div>
                </div>
                <div role="button">
                    <template v-if="isMergeStart">
                        <v-btn :disabled="isWaitMatching" outlined :class="[{'d-opacity-60': isWaitMatching }]"
                               @click="startOrderMatching">合流スタート
                        </v-btn>
                    </template>
                    <template v-else>
                        <v-btn :disabled="isWaitMatching" outlined :class="[{'d-opacity-60': isWaitMatching }]"
                               @click="endOrderMatching">終了する
                        </v-btn>
                    </template>
                </div>
            </div>

            <div class="d-inline-flex flex-column d-time-plan-cast-note p-0 pt-2">
                <p class="m-0">合流したら押しましょう</p>
                <p class="m-0"> (タイマーは15分刻み）</p>
            </div>
        </template>
    </v-card-text>
</template>

<script>
import {mapState} from "vuex";
import appUtility from "../../utils/app-utility";
import {
    ORDER_STATUS_CANCEL,
    ORDER_STATUS_FINISH,
    ORDER_STATUS_HAS_RECRUITED_ENOUGH_CAST,
    ORDER_STATUS_HIRING_CAST,
    ORDER_STATUS_PAID, ORDER_STATUS_USER_CANCEL
} from "../../utils/constant";

export default {
    data: function () {
        return {
            infoOrder: {},
            timeMerge: "00:00",
            isWaitMatching: true,
            timeSetIntervalMerge: 1000, // 1 minute 30s
            timeIntervalMerge: null, // 2 minute
            timeInterval: null,
            isMergeStart: true,
            isForceShowElementOrderOfCast: true,
            atcTypeOrderMatching: "",
            actionType: "",
        }
    },
    props: {
        classList: {
            type: String,
            defaultValue: ""
        },
        roomId: {
            required: true
        },
        infoOrderOfCast: {
            type: Object,
            defaultValue: {},
            required: true
        },
    },
    model: {
        event: "eventInfoMatching"
    },
    components: {},
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            statusOrderMatching: state => state.chat.statusOrderMatching,
            user: state => state.user.user,
        }),
        divideTimeMerge: function () {
            return this.timeMerge.split("");
        },
        infoOrderShow: function () {
            let infoTxt = ""
            if (this.infoOrder && _.has(this.infoOrder, "schedule_join")) {
                infoTxt = appUtility.isValidDate(this.infoOrder.schedule_join)
                    ? appUtility.dateFormat(this.infoOrder.schedule_join, 'YYYY年MM月DD日HH:mm') : "";
                infoTxt += `～${this.infoOrder.number_cast}人${_.has(this.infoOrder, "meeting_time") ? this.infoOrder.meeting_time : ''}時間`;

                return infoTxt
            }

            return ``
        },
        checkShowBoxInfoOrderForCast: function () {
            if (!Object.keys(this.infoOrder).length) {
                return false
            }

            let isShows = [];
            // Case: not start order and time schedule large than now
            // Case: enable start order
            if (!this.scheduleJoin) {
                isShows.push(0);
            }
            if (this.checkTimeNotStartAndTimeLargeThanNow()) {
                isShows.push(1);
            } else {
                isShows.push(0);
            }

            if (this.checkTimeStartOrder) {
                isShows.push(1);
                this.isMergeStart = true;
            } else {
                isShows.push(0);
            }

            return !!isShows.reduce((a, b) => (a + b), 0)
        },
        scheduleJoin: function () {
            return this.infoOrder && _.has(this.infoOrder, "schedule_join") && appUtility.isValidDate(this.infoOrder.schedule_join)
                ? appUtility.dateFormat(this.infoOrder.schedule_join, 'YYYY-MM-DD HH:mm:00') : ""
        },
        checkTimeNotStart: function () {
            return _.has(this.infoOrder, "order_real_times") &&
                (!this.infoOrder.order_real_times || (_.has(this.infoOrder, "order_real_times.real_start_time") && !this.infoOrder.order_real_times.real_start_time))
        },
        checkTimeStartOrder: function () {
            return (_.has(this.infoOrder, "order_real_times.real_start_time") && appUtility.isValidDate(this.infoOrder.order_real_times.real_start_time))
        },
    },
    methods: {
        initRenderTypeAction: function () {
            this.actionType = ""
            if (!this.infoOrder || !_.has(this.infoOrder, "status")) {
                return ""
            }
            switch (+this.infoOrder.status) {
                case ORDER_STATUS_HIRING_CAST: {
                    // 1
                    break
                }
                case ORDER_STATUS_HAS_RECRUITED_ENOUGH_CAST: {
                    // 2
                    this.actionType = 'MATCHED'
                    break
                }
                case ORDER_STATUS_PAID: {
                    // 3
                    this.actionType = 'CONFIRM_ORDER'
                    break
                }
                case ORDER_STATUS_FINISH: {
                    // 4
                    break
                }
                case ORDER_STATUS_CANCEL: {
                    // 5
                    break
                }
                case ORDER_STATUS_USER_CANCEL: {
                    // 6
                    break
                }
            }

        },
        confirmOrderByCast: function () {
            this.atcTypeOrderMatching = "act_confirm_matching"
            this.$store.dispatch("confirmOrderByCastDispatch", {
                id: this.infoOrder.id,
                roomId: this.roomId,
                status: ORDER_STATUS_HAS_RECRUITED_ENOUGH_CAST,
                data: {
                    order_id: this.infoOrder.id,
                    cast_id: this.user.id,
                    action: 'confirm',
                    room_id: this.roomId,
                },
            })
        },
        cancelOrderByCast: function () {
            this.atcTypeOrderMatching = "act_cancel_matching"
            this.$store.dispatch("cancelOrderByCastDispatch", {
                id: this.infoOrder.id,
                roomId: this.roomId,
                status: ORDER_STATUS_CANCEL,
                data: {
                    order_id: this.infoOrder.id,
                    cast_id: this.user.id,
                    action: 'cancel',
                    room_id: this.roomId,
                },
            })
        },
        checkTimeNotStartAndTimeLargeThanNow: function () {
            let now = appUtility.momentTzNow("YYYY-MM-DD HH:mm:00");
            if (!this.scheduleJoin) {
                return true;
            }

            let scheduleJoinEnd = appUtility.dateFormat(appUtility.dateAdd(this.scheduleJoin, this.infoOrder.meeting_time, "h"), "YYYY-MM-DD HH:mm:00");

            return (appUtility.isSameOrBefore(now, scheduleJoinEnd) && this.checkTimeNotStart)
        },
        funcEmitData: function (id) {
            this.$nextTick(() => {
                this.$emit('change', id);
            });
        },
        isDistance: function (stringCheck = "", stingSpilt = ":") {
            return stringCheck === stingSpilt
        },
        runTimeOrderForCast: function (eventStartTimeOfCast) {
            let now = appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss") // some random moment after start (in ms)

            let diff = appUtility.dateDiff(now, eventStartTimeOfCast, "s");
            this.timeMerge = appUtility.durationMoment(diff, 's', "HH:mm:ss")
        },
        initDataTimer: function (payload) {
            let self = this;
            let {eventEndTime, eventStartTime, eventLast10MEndTime} = payload;
            let keyDate = "YYYYMMDDHHmmss";
            if (!self.checkShowBoxInfoOrderForCast || !self.infoOrder.schedule_join) {
                return;
            }
            let now = appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss");
            let keyNow = appUtility.dateFormat(now, keyDate);
            let formatEndSchedule = appUtility.dateFormat(eventEndTime, keyDate)

            if (self.checkTimeNotStart || appUtility.isSameOrBefore(now, self.infoOrder.schedule_join)) {
                this.timeMerge = "00:00"
                self.isMergeStart = true;
                // Check enable button start
                let formatStartSchedule = appUtility.dateFormat(self.infoOrder.schedule_join, keyDate)


                self.isWaitMatching = (formatStartSchedule > keyNow || keyNow > formatEndSchedule)
                if (now >= formatEndSchedule) {
                    this.isForceShowElementOrderOfCast = false;
                }

                return;
            }

            let hasEndTimeOrder = _.has(self.infoOrder, "order_real_times.real_end_time")
                && self.infoOrder.order_real_times.real_end_time && appUtility.isValidDate(self.infoOrder.order_real_times.real_end_time);

            if (self.checkTimeStartOrder && appUtility.isSameOrAfter(now, self.infoOrder.schedule_join) && !hasEndTimeOrder) {
                self.isMergeStart = false;

                let keyEventLast10MEndTime = appUtility.dateFormat(eventLast10MEndTime, keyDate)
                if (keyEventLast10MEndTime <= keyNow || formatEndSchedule <= keyNow) {
                    this.isWaitMatching = false;
                    // It's process in server
                    // if (keyNow === keyEventLast10MEndTime) {
                    //     // Event push message
                    //     self.atcTypeOrderMatching = "act_last_time_10m_matching"
                    //     self.$store.commit("statusOrderMatchingMutation", "LAST_TIME_10M_END_TIME_MATCHING_SUCCESS")
                    // }
                } else {
                    this.isWaitMatching = true
                }
                let eventStartTimeOfCast = appUtility.dateFormat(self.infoOrder.order_real_times.real_start_time, "YYYY-MM-DD HH:mm:ss");

                // self.timeIntervalMerge = setInterval(() => {
                    self.runTimeOrderForCast(eventStartTimeOfCast);
                // }, self.timeSetInterval)

                return;
            }
            if (formatEndSchedule <= keyNow) {
                this.isWaitMatching = false;
            }

            // Has time end order
            if (!!hasEndTimeOrder) {
                // Todo
                // Not show
                this.isForceShowElementOrderOfCast = false;
            }
        },
        startOrderMatching: function () {
            this.atcTypeOrderMatching = "act_start_matching"
            this.$store.dispatch("startTimeOrderMatchingDispatch", {
                data: {
                    roomId: this.roomId
                },
                orderId: this.infoOrder.id,
                roomId: this.roomId,
            })
        },
        endOrderMatching: function () {
            this.atcTypeOrderMatching = "act_end_matching"
            this.$store.dispatch("endTimeOrderMatchingDispatch", {
                roomId: this.roomId,
                orderId: this.infoOrder.id,
                data: {
                    roomId: this.roomId,
                    end_date: appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss"),
                }
            })
        },
        pushEventMatching: function (status, data = {}) {
            this.$emit("eventInfoMatching", Object.assign({}, {
                atcTypeOrderMatching: this.atcTypeOrderMatching,
                status,
                ...data
            }));
        }
    },
    mounted() {
        let self = this;
        let eventStartTime = appUtility.dateFormat(self.infoOrder.schedule_join, "YYYY-MM-DD HH:mm:00");
        let eventEndTime = appUtility.dateFormat(appUtility.dateAdd(self.infoOrder.schedule_join, self.infoOrder.meeting_time, 'h'), "YYYY-MM-DD HH:mm:ss");
        let eventLast10MEndTime = appUtility.dateFormat(appUtility.dateSubtract(appUtility.dateAdd(self.infoOrder.schedule_join, self.infoOrder.meeting_time, 'h'), 10, 'm'), "YYYY-MM-DD HH:mm:ss");


        self.timeInterval = setInterval(() => {
            self.initDataTimer({eventEndTime, eventStartTime, eventLast10MEndTime});
            self.initRenderTypeAction()
        }, 1000)
    },
    created: function () {
        let self = this;
        self.infoOrder = self.infoOrderOfCast
        self.initRenderTypeAction()
    },
    watch: {
        listOrderForCast: {
            handler: function (newVal, oldVal) {
                let keyRoomUser = `${this.roomId}_${this.user.id}`;
                if (newVal && newVal[keyRoomUser]) {
                    this.infoOrder = _.cloneDeep(newVal[keyRoomUser]);
                }
            },
            deep: true
        },
        infoOrderOfCast: {
            handler: function (newData, oldData) {
                this.infoOrder = newData
            },
            deep: true
        },
        statusOrderMatching: function (newVal) {
            let self = this;
            if (!newVal) {
                return;
            }
            switch (newVal) {
                case "CONFIRM_TIME_MATCHING_SUCCESS": {
                    self.$nextTick(() => {
                        self.actionType = 'MATCHED'
                        self.infoOrder.status = ORDER_STATUS_HAS_RECRUITED_ENOUGH_CAST
                    });
                    self.pushEventMatching("confirm_matching_success", {})
                    break
                }
                case "CANCEL_TIME_MATCHING_SUCCESS": {
                    self.$nextTick(() => {
                        self.infoOrder.status = ORDER_STATUS_CANCEL
                    });
                    self.pushEventMatching("cancel_matching_success", {})
                    break
                }
                case "START_TIME_MATCHING_SUCCESS": {
                    this.$nextTick(() => {
                        self.pushEventMatching("start_matching_success", {})
                    })
                    break
                }
                case "LAST_TIME_10M_END_TIME_MATCHING_SUCCESS": {
                    self.pushEventMatching("status_last_time_10m_matching", {})
                    self.actionType = ""
                    break
                }
                case "END_TIME_MATCHING_SUCCESS": {
                    self.pushEventMatching("end_matching_success", {})
                    break
                }
                case "PROCESS_MATCHING_THROW": {
                    self.pushEventMatching("matching_throw", {})
                    break
                }
            }
        }
    },
    destroyed() {
        this.infoOrder = {}
        if (!!this.timeIntervalMerge) {
            clearInterval(this.timeIntervalMerge);
        }
        this.timeIntervalMerge = null

        if (!!this.timeInterval) {
            clearInterval(this.timeInterval);
        }
        this.timeInterval = null
        this.isForceShowElementOrderOfCast = true;
        this.atcTypeOrderMatching = "";
        this.actionType = "";
        this.$store.commit("statusOrderMatchingMutation", "");
    }
}
</script>

<style lang="scss">
.d-header-box-list-thread-chat {
    .d-cus-btn-base {
        .btn-base {
            background: transparent !important;
            border: 1px solid #5D351B !important;
            color: black;
            border-radius: 5px;

            span.v-btn__content {
                color: #5D351B !important;
            }
        }
    }
}
</style>
