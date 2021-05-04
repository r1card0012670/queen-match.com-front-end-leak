<template>
    <v-card-text :class="[`d-time-plan-cast p-0 no-bg d-step-book d-step-book-5 pb-15 mb-4`]">
        <div :class="[`${classNameBox}d-book-wrapper`]">
            <div :class="[`${classNameBox}d-book-body`, 'p-3']">
                <v-col class="col-12 p-0 font-weight-bold d-title-block-book">予約内容をご確認</v-col>

                <v-col class="col-12 p-0 mt-3">
                    <v-card-text class="d-flex justify-content-between border-bottom d-step-book-info-item">
                        <div class="p-0">合流予定</div>
                        <div class="p-0 confirm-schedule-to-join">{{ scheduleToJoin }}</div>
                    </v-card-text>

                    <v-card-text class="d-flex justify-content-between border-bottom d-step-book-info-item">
                        <div class="p-0">キャスト人数</div>
                        <div class="p-0 confirm-num-of-cast-member">{{ numOfCastMember }}</div>
                    </v-card-text>

                    <v-card-text class="d-flex justify-content-between border-bottom d-step-book-info-item">
                        <div class="p-0">設定時間</div>
                        <div class="p-0 confirm-set-time-hours">{{ setTimeHours }}</div>
                    </v-card-text>

                    <v-card-text class="d-flex justify-content-between border-bottom d-step-book-info-item">
                        <div class="p-0">キャストクラス</div>
                        <div class="p-0 confirm-cast-class">{{ castClass }}</div>
                    </v-card-text>

                    <v-card-text class="d-flex justify-content-between d-step-book-info-item">
                        <div class="p-0">場所</div>
                        <div class="p-0 confirm-location">{{ location }}</div>
                    </v-card-text>

                    <v-btn block outlined @click="isShowEditStep5 = true" class="btn-white mt-1">編集</v-btn>
                </v-col>

                <v-card-text class="p-0 mt-1">
                    <BookStep2 :showIntro="false" :modeType="'VISIBILITY'" :classNameBox="'change-box'"/>
                    <v-btn block outlined v-if="isShowListIdTagSelected" @click="isShowEditStep5 = true" class="btn-white mt-1">編集</v-btn>
                </v-card-text>

                <v-card class="d-flex m-0 d-step-list-cast-choice" role="button">
                    <v-row>
                        <div class="col-12">優先マッチング希望</div>
                        <div class="col-12 d-list-cast-chosen d-inline-flex pt-1">
                            <div class="d-item-cast" v-if="hasCastChosen">
                                <v-avatar size="48" v-for="(item, index) in castChosenList" :key="index">
                                    <v-img :src="renderAvatar(item)"/>
                                </v-avatar>
                            </div>

                            <div class="d-add-cast-item-cast" role="button">
                                <v-btn @click="() => isShowShortcutStep3Dialog = true">+</v-btn>
                            </div>
                        </div>
                    </v-row>
                </v-card>

                <v-card class="d-flex m-0 d-step-total">
                    <v-col class="col-12 p-0">
                        <v-card-text class="d-flex m-0 p-0 justify-content-between mb-2">
                            <div class="p-0">小計</div>
                            <div class="p-0">{{ totalPriceFormat }}</div>
                        </v-card-text>

                        <!-- <v-card-text class="d-flex m-0 p-0 justify-content-between mb-5" v-if="hasPriceNight('2021-04-19 23:56:00', step1.setTimeHours, 'm_other')">-->
                        <v-card-text class="d-flex m-0 p-0 justify-content-between mb-5"
                                     v-if="hasPriceNight(step1.scheduleToJoin.date, step1.setTimeHours, step1.scheduleToJoin.id)">
                            <div class="p-0">深夜手当</div>
                            <div class="p-0">+{{ addPriceNightTotalFormat }}</div>
                        </v-card-text>

                        <v-card-text class="d-flex m-0 p-0 justify-content-between mb-5" v-if="discount">
                            <div class="p-0">初回限定クーポン</div>
                            <div class="p-0">-{{ discountPrice }}</div>
                        </v-card-text>

                        <v-card-text class="d-flex m-0 p-0 justify-content-between">
                            <div class="p-0">合計</div>
                            <div class="p-0"><b>{{ totalPriceAfterDiscountFormat }}</b></div>
                        </v-card-text>
                    </v-col>
                </v-card>

                <p class="d-step-price mb-0">1人当たり {{ divPoint }} ({{ numOfCastMember }}で割り勘の場合)</p>

                <v-card-text class="d-step-note">※延長時間は15分から15分毎に{{ percentPriceNoticeFormatStep5 }}です。
                    <p>※ご利用時間が深夜{{ renderTimeNightStart }}～{{
                            renderTimeNightEnd
                        }}を含む場合、キャスト1名当たり別途{{ renderPricePaymentNightEnd }}の深夜手当 が発生します。</p>
                </v-card-text>
            </div>

            <div :class="[`${classNameBox}d-book-footer`]">
                <div v-if="!isShowEditStep5">
                    <v-btn :disabled="!isFetchCouponForOrder || orderCastStatusType !== '' || disableBtn" block outlined
                           @click="confirmRequestBook"
                           :class="['btn-base', {'d-opacity-60': !isFetchCouponForOrder || orderCastStatusType !== ''}]">
                        次に進む
                    </v-btn>
                </div>
            </div>
        </div>

        <EditStep5ShortcutDialog v-if="isShowEditStep5" :isShowDialog="isShowEditStep5"
                                 :funcCloseEventData="() => isShowEditStep5 = false"/>

        <EditStep3ShortcutDialog v-if="isShowShortcutStep3Dialog" :isShowDialog="isShowShortcutStep3Dialog"
                                 :actShort="'not-show-btn'"
                                 :funcCloseEventData="() => isShowShortcutStep3Dialog= false"/>

        <v-dialog v-if="orderCastFinish" v-model="orderCastFinish" fullscreen persistent max-width="440"
                  :content-class="`d-dialog-show-fullscreen`"
                  transition="dialog-center-transition">

            <NoticeComponent :isShowNotice="orderCastFinish" @closeNotice="handlerCloseNotice"
                             :isShowClose="false">
                <template v-slot:cbody>
                    <svg v-if="finishOrderSuccess === 'success'" width="63" height="48" viewBox="0 0 63 48" fill="none"
                         class="ml-5"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M58.0781 0.9375L18.7031 40.3125L4.78125 26.3906C4.07812 25.8281 3.09375 25.8281 2.39062 26.3906L0.84375 28.0781C0.140625 28.6406 0.140625 29.7656 0.84375 30.4688L17.5781 47.2031C18.1406 47.7656 19.2656 47.7656 19.8281 47.2031L62.0156 5.01562C62.7188 4.3125 62.7188 3.1875 62.0156 2.625L60.4688 0.9375C59.7656 0.375 58.7812 0.375 58.0781 0.9375Z"
                            fill="white"/>
                    </svg>
                    <svg v-if="finishOrderSuccess === 'fail'" width="48" height="48" viewBox="0 0 16 16" fill="none"
                         class="ml-7"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.7031 8L15.7656 2.98438C16.0469 2.70312 16.0469 2.1875 15.7656 1.90625L14.5938 0.734375C14.3125 0.453125 13.7969 0.453125 13.5156 0.734375L8.5 5.79688L3.4375 0.734375C3.15625 0.453125 2.64062 0.453125 2.35938 0.734375L1.1875 1.90625C0.90625 2.1875 0.90625 2.70312 1.1875 2.98438L6.25 8L1.1875 13.0625C0.90625 13.3438 0.90625 13.8594 1.1875 14.1406L2.35938 15.3125C2.64062 15.5938 3.15625 15.5938 3.4375 15.3125L8.5 10.25L13.5156 15.3125C13.7969 15.5938 14.3125 15.5938 14.5938 15.3125L15.7656 14.1406C16.0469 13.8594 16.0469 13.3438 15.7656 13.0625L10.7031 8Z"
                            fill="red"></path>
                    </svg>
                    <div class="pt-3 text-center color--white">
                        {{ finishOrderSuccess === 'success' ? "完了しました" : "完了できません" }}
                    </div>
                </template>
            </NoticeComponent>
        </v-dialog>

        <ConfirmCreateCardDialog v-if="isAddPayment" :isShowDialog="isAddPayment" :funcEventClose="funcEventCloseCreate"
                                 @confirmAddPayment="addPaymentInfo"/>

        <CreateCardInfoDialog v-if="isConfirmAddPayment" :isShowDialog="isConfirmAddPayment"
                              :funcCallbackEventClose="funcEventCloseCreate"
                              @addSuccess="addPaymentInfoSuccess" :isHasCard="false"/>

    </v-card-text>
</template>

<script>

import {mapState} from "vuex";
import BookStep2 from "./BookStep2";
import EditStep5ShortcutDialog from "./EditStep5ShortcutDialog";
import EditStep3ShortcutDialog from "./EditStep3ShortcutDialog";
// import UserProfilesComponent from "./../../components/UserProfilesComponent";
import ConfirmCreateCardDialog from "./../../common/payment/ConfirmCreateCardDialog";
import CreateCardInfoDialog from "./../../common/payment/CreateCardInfoDialog";
import NoticeComponent from "./../../components/NoticeComponent";
import constantMain from "../../utils/constants";
import appUtility from "../../utils/app-utility";
import {NEW_USER_COUPON_KEY, ORDER_STATUS_PAID} from "../../utils/constant";
import bookProcess from "../../mixin/bookProcess";


export default {
    mixins: [
        bookProcess
    ],
    data: function () {
        return {
            isShowEditStep5: false,
            isShowShortcutStep3Dialog: false,
            isFinish: false,
            timer: 3000,
            isAddPayment: false,
            isConfirmAddPayment: false,
            finishOrderSuccess: "",
            disableBtn: false
        }
    },
    props: {
        classList: {
            type: String,
            defaultValue: ""
        },
        classNameBox: {
            type: String,
            default: "",
            required: false
        }
    },
    components: {
        BookStep2,
        EditStep5ShortcutDialog,
        // UserProfilesComponent,
        EditStep3ShortcutDialog,
        NoticeComponent,
        CreateCardInfoDialog,
        ConfirmCreateCardDialog,
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
            step1: state => state.book.step1,
            step2: state => state.book.step2,
            step3: state => state.book.step3,
            orderCastStatusType: state => state.book.orderCastStatusType,
            detailInfoOrder: state => state.book.detailInfoOrder,
            discount: state => state.book.discount,
            isFetchCouponForOrder: state => state.book.isFetchCouponForOrder,
            detailInfoEditCard: state => state.book.detailInfoEditCard,
            declinedProcessWithPayment: state => state.book.declinedProcessWithPayment,
        }),
        constant: function () {
            return Object.assign({}, constantMain)
        },
        castChosenList: function () {
            return _.isArray(this.step3.userIds) && this.step3.userIds.length ? this.step3.userIds : []
        },
        hasCastChosen: function () {
            return !!this.castChosenList.length
        },
        scheduleToJoin: function () {
            return `${this.step1.scheduleToJoin.name}`
        },
        numOfCastMember: function () {
            return `${this.step1.numOfCastMember}人`
        },
        setTimeHours: function () {
            return `${this.step1.setTimeHours}時間`
        },
        castClass: function () {
            return `${this.step1.castClass.name} ${(_.has(this.step1.castClass, "recommend") && this.step1.castClass.id === "vip" ? this.step1.castClass.recommend : "")}`
        },
        location: function () {
            return `${this.step1.location.valueChosen}`
        },
        totalPriceFormat: function () {
            return appUtility.formatPriceToFixed(this.totalPrice);
        },
        totalPrice: function () {
            // Price haft 30 minute
            // So 2 * priceHalf
            return 2 * (+this.step1.castClass.totalPrice) * (+this.step1.setTimeHours);
        },
        totalPricePayment: function () {
            return this.totalPrice + (this.hasPriceNight(this.step1.scheduleToJoin.date, this.step1.setTimeHours, this.step1.scheduleToJoin.id) ? this.addPriceNightTotal : 0);
        },
        discountPrice: function () {
            return appUtility.formatPriceToFixed(Math.abs(this.discount));
        },
        totalPriceAfterDiscountFormat: function () {
            return appUtility.formatPriceToFixed(this.totalPriceAfterDiscount)
        },
        totalPriceAfterDiscount: function () {
            return this.totalPricePayment > this.discount ? (this.totalPricePayment - this.discount) : 0;
        },
        divPoint: function () {
            if (!this.step1.numOfCastMember) {
                return 0
            }
            let div = Math.floor(this.totalPrice / this.step1.numOfCastMember);

            return appUtility.formatPriceToFixed(div);
        },
        isExistPayment: function () {
            return !!(Object.keys(this.detailInfoEditCard).length && _.has(this.detailInfoEditCard, "id"))
        },
        orderCastFinish: function () {
            return this.orderCastStatusType === this.constant.STATUS_REQUEST_ORDER_PROCESS.FINISH_PROCESS_ORDER
        },
        percentPriceNoticeStep5: function () {
            return Math.round(((1 + this.percentPrice) * this.totalPrice) / (2 * 2 * this.step1.setTimeHours))
        },
        percentPriceNoticeFormatStep5: function () {
            return this.percentPriceNoticeStep5 ? appUtility.formatPriceToFixed(this.percentPriceNoticeStep5) : '0P'
        },
        addPriceNightTotalFormat: function () {
            return this.addPriceNightTotal ? appUtility.formatPriceToFixed(this.addPriceNightTotal) : "0P"
        },
        addPriceNightTotal: function () {
            return this.step1.numOfCastMember * this.constant.PRICE.NIGHT_CHARGE
        },
        isShowListIdTagSelected: function () {
            return !!this.listIdTagSelected.length
        },
        listIdTagSelected: function () {
            let tags = [];
            Object.keys(this.step2).forEach(key => {
                let tmpId = this.step2[key].map(ele => ele.id);
                tags = tags.concat(tmpId);
            });

            return tags
        }
    },
    methods: {
        addPaymentInfo: function (val) {
            if (!!val) {
                this.isConfirmAddPayment = true
            }
        },
        funcEventCloseCreate: function () {
            this.isAddPayment = false
            this.isConfirmAddPayment = false
            this.disableBtn = false;
        },
        addPaymentInfoSuccess: async function (data) {
            // Create order
            this.$store.dispatch("addDetailInfoEditCardDispatch", _.has(data, "data") ? data.data : data)
            this.isAddPayment = false
            this.isConfirmAddPayment = false
        },
        readyRequestBook: function () {
            let number_cast_standard = 0, number_cast_vip = 0, number_cast_royal_vip = 0;
            switch (this.step1.castClass.id) {
                case "royal_vip":
                    number_cast_royal_vip = this.step1.numOfCastMember;
                    break;
                case "vip":
                    number_cast_vip = this.step1.numOfCastMember;
                    break;
                case "mix":
                    number_cast_royal_vip = this.step1.castClass.mixNumRoyalVip
                    number_cast_vip = this.step1.castClass.mixNumVip
                    number_cast_standard = this.step1.castClass.mixNumStandard
                    break;
                case "standard":
                    number_cast_standard = this.step1.numOfCastMember;
                    break;
            }
            let tags = [];
            Object.keys(this.step2).forEach(key => {
                let tmpId = this.step2[key].map(ele => ele.id);
                tags = tags.concat(tmpId);
            });

            let isOther = RegExp(/other_/).test("other_") && _.has(this.step1.location, "options.other")
                && this.step1.location.options.other && _.has(this.step1.location, "options.key_constant");
            let other_place = isOther ? this.step1.location.valueChosen : "";

            let place_detail_id = !isOther
                ? this.step1.location.keyChosen
                : this.step1.location.options.key_constant

            let schedule_join = appUtility.dateFormat(this.step1.scheduleToJoin.date, "YYYY-MM-DD HH:mm:00");
            let now = appUtility.momentTzNow("YYYY-MM-DD HH:mm:00");

            if (this.step1.scheduleToJoin.id !== "m_other") {
                schedule_join = appUtility.dateFormat(appUtility.dateAdd(now, this.step1.scheduleToJoin.value, "m"), "YYYY-MM-DD HH:mm:00");
            } else {
                let numDelay = 2
                let now30Minute = appUtility.dateFormat(appUtility.dateAdd(now, (30 - numDelay), 'm'), "YYYY-MM-DD HH:mm:00")

                if (appUtility.isSameOrAfter(now30Minute, schedule_join)) {
                    location.reload();
                    /// Check validate
                    return;
                }
            }

            this.$store.dispatch("requestOrderCastMeetNowDispatch", Object.assign({}, {
                data: {
                    number_cast: this.step1.numOfCastMember,
                    status: ORDER_STATUS_PAID, // Fixed, when create order
                    total_points: this.totalPricePayment,
                    actual_point: this.totalPriceAfterDiscount,
                    meeting_time: this.step1.setTimeHours,
                    schedule_join,
                    cast_package: this.step1.castClass.value, // It's id
                    cast_id: this.step3.userIds.map(ele => ele.id),
                    tags,
                    number_cast_standard,
                    number_cast_vip,
                    number_cast_royal_vip,
                    place_id: this.step1.location.idLocale,
                    place_detail_id,
                    other_place
                }
            }))
        },
        paymentAfterBook: function () {
            this.$store.dispatch("requestPaymentAfterBookDispatch", Object.assign({amount: this.totalPriceAfterDiscount}))
        },
        throwPayment: function () {
            this.$store.dispatch("requestThrowAfterBookDispatch", Object.assign({}))
        },
        confirmRequestBook: async function () {
            this.disableBtn = true;
            if (!!this.declinedProcessWithPayment) {
                console.error("Not access payment, when oder one to multi")
                return;
            }
            if (this.totalPrice <= 0) {
                location.reload()
                return;
            }

            // Case: not exist payment
            if (!this.isExistPayment) {
                this.isAddPayment = true;
                return;
            }

            // Create order
            await this.readyRequestBook();

        },
        isDistance: function (stringCheck = "", stingSpilt = ":") {
            return stringCheck === stingSpilt
        },
        clickStepTo1: function () {
            this.$store.dispatch("stepDispatch", 1)
        },
        renderAvatar: function (item) {
            return _.has(item, "avatar") && item.avatar ? item.avatar : this.constant.AVATAR_DEFAULT
        },
        handlerCloseNotice: function () {
            this.$store.commit('orderCastMeetNowFinishMutation', false);
        },
        updateSuccessTimer: function () {
            let self = this;
            setTimeout(() => {
                // redirect to home
                self.$store.dispatch('activeNavBottomDispatch', true);
                self.$router.push({name: "Home"})
            }, self.timer)
        },
    },
    mounted() {
        this.$store.dispatch('activeNavBottomDispatch', false);
        // Set time reload page
        setTimeout(() => {
            location.reload()
        }, 300000) // 5 minute
    },
    watch: {
        orderCastStatusType: function (statusType, from) {
            let self = this;
            if (statusType) {
                switch (statusType) {
                    case self.constant.STATUS_REQUEST_ORDER_PROCESS.CREATE_ORDER_START: {
                        self.readyRequestBook();
                        break
                    }
                    case self.constant.STATUS_REQUEST_ORDER_PROCESS.CREATE_ORDER_SUCCESS: {
                        // Payment
                        if (!Object.keys(self.detailInfoOrder).length) {
                            // Not allow add after create order
                            self.$store.commit("orderCastStatusTypeMutation", self.constant.STATUS_REQUEST_ORDER_PROCESS.FINISH_PROCESS_ORDER)
                            self.finishOrderSuccess = 'fail'
                        } else {
                            self.paymentAfterBook();
                        }
                        break;
                    }
                    case self.constant.STATUS_REQUEST_ORDER_PROCESS.PAYMENT_ORDER_THROW: {
                        // Remove order
                        self.throwPayment();
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
                        self.updateSuccessTimer()
                        break
                    }
                }
            }
        }
    },
    beforeMount() {
        // Optimize
        // this.$store.dispatch("fetchCouponForNewOrderDispatch", {user_id: this.user.id, key: NEW_USER_COUPON_KEY})
    },
    created: function () {
        let self = this;
        self.isFinish = true;
        self.isConfirmAddPayment = false;
        self.isAddPayment = false;
        self.$store.commit('orderCastStatusTypeMutation', "");
        self.$store.commit('detailInfoOrderMutation', {});
    },
    destroyed() {
        this.disableBtn = false;
    }
}
</script>
