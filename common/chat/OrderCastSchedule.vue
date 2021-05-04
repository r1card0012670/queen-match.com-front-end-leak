<template>
    <div>
        <v-form :class="[`d-box-form-order-cast`, `p-0`]" ref="orderCastForm" v-model="valid" lazy-validation>
            <div class="d-form-box-1">
                <v-col class="p-0 pb-2 v-box-calendar-content">
                    <div class="d-label font-weight-bold">日程</div>
                    <v-text-field :value="convertDateFormat" readonly role="button"
                                  :append-icon="'keyboard_arrow_down'" @click:append="dialogScheduleTimeOpen"
                                  required solo @click="dialogScheduleTimeOpen"
                                  :rules="[rules.required]"/>

                    <v-col class="d-flex pl-0 pr-0 pt-0" cols="12" xsm="12" v-if="errorMsg.length">
                        <span v-if="errorMsg" style="color: #dc3545; font-size: 80%;">{{ errorMsg }}</span>
                    </v-col>
                    <v-dialog v-model="dialogScheduleTime" persistent max-width="310"
                              @keydown.esc="dialogScheduleTime = false" @click:outside="dialogScheduleTime = false">
                        <v-card>
                            <v-card-title class="headline">
                                日程
                            </v-card-title>
                            <v-card-text v-if="dateSelect">
                                <vc-date-picker v-if="dialogScheduleTime" :min-date='minDate' v-model="dateSelect" mode="dateTime" :locale="locale"
                                                :masks="masks"/>
                                <v-col class="d-flex pl-0 pr-0 pt-0" cols="12" xsm="12"
                                       v-if="validateDateForScheduleTime(dateSelect)">
                                    <span v-if="errorMsgSelect"
                                          style="color: #dc3545; font-size: 80%;">{{ errorMsgSelect }}</span>
                                </v-col>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <!--                                <v-btn color="green darken-1" text @click="dialogScheduleTime = false">Disagree-->
                                <!--                                </v-btn>-->
                                <v-btn color="green darken-1" text @click="dialogScheduleTimeAgree">保存</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
                <v-col class="p-0 pb-2 v-box-calendar-content">
                    <div class="d-label font-weight-bold">キャスト人数と時間</div>
                    <div class="d-inline-flex">
                        <v-select v-model="vModelOrderPerson" :items="items" solo required
                                  item-text="state" return-object item-value="abbr"
                                  :append-icon="'keyboard_arrow_down'"/>

                        <v-select class="pl-1" v-model="vModelOrderHours" :items="itemHours" solo required
                                  item-text="state" return-object item-value="abbr"
                                  :append-icon="'keyboard_arrow_down'"/>
                    </div>
                </v-col>
            </div>
            <div class="d-action">
                <v-sheet class="d-action-order pt-2 pb-2">
                    <v-col class="d-inline-flex justify-content-between p-0 pb-2">
                        <div class="justify-content-start">
                            {{ pricePointCastFormat }}（キャストP/30分）{{ formatTextShowGuide }}
                        </div>
                        <div class="justify-content-end">{{ totalPriceFormat }}</div>
                    </v-col>

                    <v-card-text class="d-flex m-0 p-0 justify-content-between mb-5" v-if="hasPriceNightOneToOne()">
                        <div class="p-0">深夜手当</div>
                        <div class="p-0">+{{ addPriceNightTotalFormat }}</div>
                    </v-card-text>

                    <v-card-text class="d-flex m-0 p-0 justify-content-between mb-2" v-if="discount">
                        <div class="p-0">初回限定クーポン</div>
                        <div class="p-0">-{{ discountPriceFormat }}</div>
                    </v-card-text>

                    <v-col class="d-inline-flex justify-content-between p-0 pb-2">
                        <div class="justify-content-start">合計（１P≒1.1円）</div>
                        <div class="justify-content-end d-action-order-total">{{ totalPriceAfterDiscountFormat }}</div>
                    </v-col>
                    <v-col class="d-inline-flex p-0 pb-5">
                        <div class="justify-content-start">
                            <small class="font-weight-medium">※延長15分につき{{ percentPriceNoticeFormat }}が発生します</small>
                        </div>
                    </v-col>

                    <v-col class="justify-content-center p-0 text-center">
                        <div>実際に合流するまでポイントは消費されません</div>
                        <v-btn :disabled="!valid" block outlined @click="validateActionOrder"
                               :class="[`btn-base m-0 mt-1`, {'d-opacity-60': !valid}]">
                            日程と人数を提案する
                        </v-btn>
                    </v-col>
                </v-sheet>
            </div>
        </v-form>

        <ConfirmCreateCardDialog v-if="isAddPayment" :isShowDialog="isAddPayment" :funcEventClose="funcEventCloseCreate"
                                 @confirmAddPayment="addPaymentInfo"/>

        <CreateCardInfoDialog v-if="isConfirmAddPayment" :isShowDialog="isConfirmAddPayment"
                              :funcCallbackEventClose="funcEventCloseCreate"
                              @addSuccess="addPaymentInfoSuccess" :isHasCard="false"/>
    </div>
</template>

<script>

import appUtility from "../../utils/app-utility";
import {mapState} from "vuex";
import CreateCardInfoDialog from "../payment/CreateCardInfoDialog";
import ConfirmCreateCardDialog from "../payment/ConfirmCreateCardDialog";
import constantMain from "../../utils/constants";
import {NEW_USER_COUPON_KEY, ORDER_STATUS_PAID, TIME_ZONE} from "../../utils/constant";
import bookProcess from "../../mixin/bookProcess";

export default {
    mixins: [
        bookProcess
    ],
    data: function () {
        return {
            dialogScheduleTime: false,
            valid: true,
            minDate: new Date(), // Fixed. error in ios
            minMinuteBeforeOrder: 30,
            masks: {
                inputDateTime: 'YYYY-MM-DD',
            },
            vModelDate: "",
            vModelOrderPerson: {state: '1名', abbr: 1},
            vModelOrderHours: {state: '2時間', abbr: 2},
            locale: 'ja',
            date: "",
            dateSelect: appUtility.momentTzNow('YYYY-MM-DD HH:mm:00'),
            time: "",
            vModelMenuPicker: false,
            errorMsgSelect: '',
            errorMsg: '',
            items: [
                {state: '1名', abbr: 1},
            ],
            itemHours: [
                {state: '1時間', abbr: 1},
                {state: '2時間', abbr: 2},
                {state: '3時間', abbr: 3},
                {state: '4時間', abbr: 4},
                {state: '5時間', abbr: 5},
                {state: '6時間', abbr: 6},
                {state: '7時間', abbr: 7},
                {state: '8時間', abbr: 8},
                {state: '9時間', abbr: 9},
                {state: '10時間', abbr: 10},
            ],
            rules: {
                required: value => !!value || "必須項目に入力してください。",
            },
            isAddPayment: false,
            isConfirmAddPayment: false,
            finishOrderSuccess: "",
            dataOnderOne2One: {}
        }
    },
    props: {
        isClearable: {
            type: Boolean,
            default: true,
            required: false
        },
        classList: {
            type: String,
            defaultValue: ""
        },
        funcEventClickOrder: {
            type: Function,
            default: null
        },
        infoCast: {
            type: Object,
            required: true
        },
        roomId: {
            required: true
        }
    },
    components: {
        ConfirmCreateCardDialog,
        CreateCardInfoDialog
    },
    mounted() {
        this.date = appUtility.dateFormat(appUtility.dateAdd(appUtility.momentTzNow('YYYY-MM-DD HH:mm:00'), this.minMinuteBeforeOrder, "m"), 'YYYY-MM-DD HH:mm:00')
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
            discount: state => state.book.discount,
            detailInfoEditCard: state => state.book.detailInfoEditCard,
            orderCastStatusType: state => state.book.orderCastStatusType,
            declinedProcessWithPayment: state => state.book.declinedProcessWithPayment,
            detailInfoOrder: state => state.book.detailInfoOrder,
        }),
        constant: function () {
            return Object.assign({}, constantMain)
        },
        showDataCarousel: function () {
            return !!this.dataCarouselSlider.length
        },
        convertDateFormat: function () {
            if (appUtility.isValidDate(this.date)) {
                return appUtility.dateFormat(this.date, 'YYYY年MM月DD日 (ddd) HH:mm');
            }

            return ""
        },
        totalPrice: function () {
            return (2 * this.vModelOrderPerson.abbr * this.vModelOrderHours.abbr) * this.pricePointCast;
                // + (this.hasPriceNightOneToOne() ? this.addPriceNightTotal : 0);
        },
        totalPriceFormat: function () {
            return this.totalPrice ? appUtility.formatPriceToFixed(this.totalPrice) : '0P'
        },
        totalPricePayment: function () {
            return this.totalPrice + (this.hasPriceNightOneToOne() ? this.addPriceNightTotal : 0);
        },
        totalPriceAfterDiscount: function () {
            return this.totalPricePayment - this.discount > 0 ? this.totalPricePayment - this.discount : 0;
        },
        totalPriceAfterDiscountFormat: function () {
            return this.totalPriceAfterDiscount ? appUtility.formatPriceToFixed(this.totalPriceAfterDiscount) : '0P'
        },
        formatTextShowGuide: function () {
            return `ｘ${this.vModelOrderPerson.state}ｘ${this.vModelOrderHours.state}`
        },
        pricePointCast: function () {
            return _.has(this.infoCast, "price_point") ? +this.infoCast.price_point : 0
        },
        pricePointCastFormat: function () {
            return this.pricePointCast ? appUtility.formatPriceToFixed(this.pricePointCast) : 0
        },
        discountPriceFormat: function () {
            return this.discount ? appUtility.formatPriceToFixed(this.discount) : '0P'
        },
        percentPriceNotice: function () {
            return Math.round(((1 + this.percentPrice) * this.totalPrice) / (2 * 2 * this.vModelOrderHours.abbr))
        },
        percentPriceNoticeFormat: function () {
            return this.percentPriceNotice ? appUtility.formatPriceToFixed(this.percentPriceNotice) : '0P'
        },
        isExistPayment: function () {
            return !!(Object.keys(this.detailInfoEditCard).length && _.has(this.detailInfoEditCard, "id"))
        },
        addPriceNightTotalFormat: function () {
            return this.addPriceNightTotal ? appUtility.formatPriceToFixed(this.addPriceNightTotal) : "0P"
        },
        addPriceNightTotal: function () {
            return 1 * this.constant.PRICE.NIGHT_CHARGE
        },
    },
    methods: {
        hasPriceNightOneToOne: function () {
            return this.hasPriceNight(appUtility.dateFormat(this.date, "YYYY-MM-DD HH:mm:00"), this.vModelOrderHours.abbr, 'm_other')
        },
        validateDateForScheduleTime: function (dateSelect, numberDelay = 0) {
            let now = appUtility.momentTzNow("YYYY-MM-DD HH:mm:00");
            let nowAdd30minute = appUtility.dateFormat(appUtility.dateAdd(now, (this.minMinuteBeforeOrder - numberDelay), 'm'), "YYYY-MM-DD HH:mm:00");

            if (!appUtility.isValidDate(dateSelect)) {
                return true
            }

            return appUtility.isSameOrAfter(nowAdd30minute, dateSelect);
        },
        dialogScheduleTimeOpen: function () {
            this.$nextTick(() => {
                this.dateSelect = this.date;
                this.dialogScheduleTime = true
            })
        },
        dialogScheduleTimeAgree: function () {
            if (this.validateDateForScheduleTime(this.dateSelect)) {
                this.errorMsgSelect = "合流時刻は現在時間より30分後の時間を入力してください。"
                return;
            }

            this.errorMsgSelect = "";
            this.date = appUtility.dateFormat(this.dateSelect, "YYYY-MM-DD HH:mm:00");
            this.dialogScheduleTime = false
            this.valid = true
        },
        changeMenuPicker: function () {
            this.vModelMenuPicker = false
        },
        funcEventCloseCreate: function () {
            this.isAddPayment = false
            this.isConfirmAddPayment = false
        },
        addPaymentInfo: function () {
            this.isAddPayment = false
            this.isConfirmAddPayment = true
        },
        addPaymentInfoSuccess: async function (data) {
            // Create order one to one
            this.$store.dispatch("addDetailInfoEditCardDispatch", _.has(data, "data") ? data.data : data)
            this.isAddPayment = false
            this.isConfirmAddPayment = false
        },
        validateActionOrder: async function () {
            let self = this;
            this.valid = false;
            if (self.$refs.orderCastForm && self.$refs.orderCastForm.validate()) {
                if (!!this.declinedProcessWithPayment) {
                    console.error("Not access payment, when oder one to one")
                    return;
                }

                // Validate with number 2 minute
                if (this.validateDateForScheduleTime(this.date, 2)) {
                    this.errorMsg = "Please select the date and time that is greater than current 30 minutes"
                    return
                }
                this.errorMsg = ''

                if (!self.isExistPayment) {
                    self.isAddPayment = true
                    return;
                }

                // Create order
                await this.readyRequestBookOneToOne();
            }
        },
        dayFormatHandle(date) {
            return appUtility.dateFormat(date, "DD")
        },
        readyRequestBookOneToOne: function () {
            let standards = this.constant.CAST_CLASS.filter(ele => ele.id === 'standard');
            let standard = standards && standards.length ? standards[0] : {};

            let dataOrder = {
                number_cast: 1, // Fixed
                status: ORDER_STATUS_PAID, // Fixed, when create order
                total_points: this.totalPricePayment,
                actual_point: this.totalPriceAfterDiscount,
                meeting_time: this.vModelOrderHours.abbr,
                schedule_join: `${appUtility.dateFormat(this.date, "YYYY-MM-DD HH:mm:00")}`,
                cast_package: _.has(standard, "id") ? +standard.value : 1, // It's id
                cast_id: [this.infoCast.id],
                tags: [],
                number_cast_standard: 1,
                number_cast_vip: 0,
                number_cast_royal_vip: 0,
                percentPrice: this.percentPrice,
                percentPriceNotice: this.percentPriceNotice,
                percentPriceNoticeFormat: this.percentPriceNoticeFormat,
                room_id: this.roomId
            };

            this.dataOnderOne2One = dataOrder
            this.$store.dispatch("requestOrderCastMeetNowDispatch", Object.assign({}, {data: {...dataOrder}}))
        },
        paymentAfterBookOneToOne: function () {
            this.$store.dispatch("requestPaymentAfterBookDispatch", Object.assign({amount: this.totalPriceAfterDiscount}))
        },
        throwPaymentOneToOne: function () {
            this.$store.dispatch("requestThrowAfterBookDispatch", Object.assign({}))
        },
        funcEventOrderFinish: function (data) {
            this.$emit("eventOrderOneToOne", {
                finishOrderSuccess: this.finishOrderSuccess,
                statusType: this.orderCastStatusType,
                ...data
            })
        }
    },
    watch: {
        orderCastStatusType: function (statusType, from) {
            let self = this;
            if (statusType) {
                switch (statusType) {
                    case self.constant.STATUS_REQUEST_ORDER_PROCESS.CREATE_ORDER_START: {
                        self.readyRequestBookOneToOne();
                        break
                    }
                    case self.constant.STATUS_REQUEST_ORDER_PROCESS.CREATE_ORDER_SUCCESS: {
                        // Payment
                        // Cast is free by price_point 0
                        if (self.totalPrice === 0) {
                            self.$store.commit("orderCastStatusTypeMutation", self.constant.STATUS_REQUEST_ORDER_PROCESS.FINISH_PROCESS_ORDER)
                            self.finishOrderSuccess = 'success'
                            return
                        }
                        if (!Object.keys(self.detailInfoOrder).length) {
                            // Not allow add after create order
                            self.$store.commit("orderCastStatusTypeMutation", self.constant.STATUS_REQUEST_ORDER_PROCESS.FINISH_PROCESS_ORDER)
                            self.finishOrderSuccess = 'fail'
                        } else {
                            self.paymentAfterBookOneToOne();
                        }
                        break;
                    }
                    case self.constant.STATUS_REQUEST_ORDER_PROCESS.PAYMENT_ORDER_THROW: {
                        // Remove order
                        self.throwPaymentOneToOne();
                        self.finishOrderSuccess = 'fail'
                        break;
                    }
                    case self.constant.STATUS_REQUEST_ORDER_PROCESS.PAYMENT_ORDER_SUCCESS: {
                        self.$store.commit("orderCastStatusTypeMutation", self.constant.STATUS_REQUEST_ORDER_PROCESS.FINISH_PROCESS_ORDER)
                        self.finishOrderSuccess = 'success'
                        break;
                    }
                    case self.constant.STATUS_REQUEST_ORDER_PROCESS.CREATE_ORDER_FAIL: {
                        self.$store.commit("orderCastStatusTypeMutation", self.constant.STATUS_REQUEST_ORDER_PROCESS.FINISH_PROCESS_ORDER)
                        self.finishOrderSuccess = 'fail'
                        break
                    }
                    case self.constant.STATUS_REQUEST_ORDER_PROCESS.FINISH_PROCESS_ORDER: {
                        self.funcEventOrderFinish({dataOrder: self.dataOnderOne2One})
                        break
                    }
                }
            }
        },
        date: function (newVal) {
            this.hasPriceNightOneToOne();
        }
    },
    created() {
        this.$store.dispatch("fetchCouponForNewOrderDispatch", {user_id: this.user.id, key: NEW_USER_COUPON_KEY})
        this.dataOnderOne2One = {};
    },
    destroyed() {
        this.vModelChat = "";
        this.$store.commit('orderCastStatusTypeMutation', "");
        this.finishOrderSuccess = "";
        this.errorMsg = "";
        this.errorMsgSelect = "";
        this.date = ""
    }
}
</script>
