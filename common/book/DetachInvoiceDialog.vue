<template>
    <div v-if="isShowDialog" :class="[`d-dialog-detach-invoice p-0`]">

        <v-dialog v-if="isShowDialog" v-model="showActionDialog" @click:outside="clickCloseData"
                  @keydown.esc="clickCloseData" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition"
                  scrollable
        >
            <v-card :id="`dialog-action-detach-invoice`"
                    :class="[`d-action-detach-invoice`, 'd-border-radius-top-15']">
                <v-card-title :id="'d-card-title-detach-invoice'"
                              :class="[`headline d-header-box-action-detach-invoice p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center d-custom-header p-2 d-width-100">
                        <button class="d-flex pl-2 pr-3" v-on:click="clickCloseData">
                            <v-img src="../../images/times.svg"></v-img>
                        </button>
                        <v-card-title :class="`p-0`" class="box-shadow-no">請求書</v-card-title>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-detach-invoice'" class="p-2 text-dark">
                    <v-card-text class="px-3">
                        <v-col class="d-flex justify-content-between p-0">
                            <div>小計</div>
                            <div>{{ numberWithFormat(order.order.total_points - nightCharge) }}</div>
                        </v-col>
                        <v-col class="d-flex justify-content-between p-0">
                            <div>初回限定クーポン</div>
                            <div>-{{ numberWithFormat(order.coupon) }}</div>
                        </v-col>
                        <v-col class="d-flex justify-content-between p-0">
                            <div>深夜手当</div>
                            <div>+{{ numberWithFormat(nightCharge) }}</div>
                        </v-col>
                        <v-col class="d-flex justify-content-between align-items-end p-0">
                            <div>合計</div>
                            <h4 class="font-weight-bold mt-2 mb-0">{{ numberWithFormat(order.order.actual_point) }}</h4>
                        </v-col>
                    </v-card-text>
                    <template v-if="order.order.number_cast > 1">
                        <v-divider/>
                        <v-card-text class="p-2">
                            <v-col class="d-flex justify-content-end p-0">
                                <div>人当たり {{
                                        numberWithFormat(Math.round(order.order.actual_point / order.order.number_cast))
                                    }}
                                </div>
                            </v-col>
                            <v-col class="d-flex justify-content-end p-0">
                                ({{ order.order.number_cast }}人で割り勘の場合)
                            </v-col>
                        </v-card-text>
                    </template>
                    <div class="box-position-footer d-flex justify-content-center pb-2">
                        <v-col cols="6">
                            <v-btn block outlined class="d-flex" @click="clickCloseData"> 閉じる</v-btn>
                        </v-col>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import C from "../../utils/constants";
import {mapState} from "vuex";
import {TYPE_ROLE_USER} from "../../utils/constant";
import moment from "moment";
import appUtility from "../../utils/app-utility";

export default {
    data: function () {
        return {}
    },
    model: {
        event: 'changeLocal'
    },
    props: {
        titleName: {
            type: String,
            defaultValue: ""
        },
        classList: {
            type: String,
            default: ""
        },
        isShowDialog: {
            type: Boolean,
            required: true
        },
        funcCloseEventData: {
            type: Function,
            required: true
        },
        order: {
            type: Object,
            required: true,
        }
    },
    mounted: function () {
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            role: state => state.user.role,
        }),
        showActionDialog: function () {
            return !!this.isShowDialog;
        },
        constant: function () {
            return Object.assign({}, C)
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        hasNightCharge: function () {
            const startTime = moment(this.order.order.schedule_join.split(' ')[1], 'h:mm:ss');
            const endTime = moment(this.order.order.schedule_join.split(' ')[1], 'h:mm:ss').add(this.order.order.meeting_time, 'hours');
            const nightTimeStart = moment('23:45:00', 'h:mm:ss');
            const nightTimeEnd = moment('06:00:00', 'h:mm:ss').add(1, 'days');

            return startTime.isBetween(nightTimeStart, nightTimeEnd) || endTime.isBetween(nightTimeStart, nightTimeEnd) || (startTime.isBefore(nightTimeStart) && endTime.isAfter(nightTimeEnd));
        },
        nightCharge: function () {
            if (this.hasNightCharge) {
                return this.order.order.number_cast * this.constant.PRICE.NIGHT_CHARGE;
            }

            return 0;
        }
    },
    methods: {
        clickCloseData: function () {
            this.funcCloseEventData();
        },
        numberWithFormat: function (value) {
            return value ? appUtility.formatPriceToFixed(value) : "0P";
        },
    },
}
</script>

<style lang="scss" scoped>
.v-btn--outlined {
    border: thin solid #5D351B;
}

.v-application .v-btn:not(.v-btn--active) span.v-btn__content {
    color: #5D351B;
}
</style>
