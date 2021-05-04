<template>
    <v-card-text :class="[`d-time-plan-cast p-0 no-bg d-step-book d-step-book-1`]">
        <div :class="[`${classNameBox}d-book-wrapper`]">
            <div :class="[`${classNameBox}d-book-body`, {'p-2': !classNameBox.length}]">
                <v-col class="col-12 p-0 mt-1">
                    <v-col class="justify-content-center p-0" v-if="isShowIntro && getCoupon && getCoupon.content && getCoupon.end_push_at">
                        <div class="card-body p-0">
                            <div class="has-classup-coupon-wrapper">
<!--                                <div class="point"> 初回利用限定クーポン: 5,000P割引•2021/2/18まで</div>-->
                                <div class="point">
                                    初回利用限定クーポン: {{numberWithDot(getCoupon.content)}}割引•{{ formatDateString(getCoupon.end_push_at) }}まで
                                </div>
                            </div>
                        </div>
                    </v-col>

                    <div class="p-0 flex-wrap">
                        <span class="mb-2" v-if="isShowIntro">最短30分で近くのキャストがあなたのもとへ </span>
                        <div class="d-flex justify-content-between flex-wrap d-book-address-list mt-2">
                            <div class="col-6 p-0 m-0 d-book-address-item">
                                <v-card class="d-flex m-0 justify-content-between" role="button"
                                        @click="isScheduleToJoin = true">
                                    <v-list-item-avatar class="p-0 pr-1 m-0" :size="27">
                                        <v-img src="../../images/GR-book-icon-time.svg"></v-img>
                                    </v-list-item-avatar>

                                    <v-list-item-content class="p-0">
                                        <v-list-item-title v-html="'合流予定: '"></v-list-item-title>

                                        <v-list-item-subtitle class="mt-2">
                                            <div class="schedule-to-join">{{ scheduleToJoin }}</div>
                                        </v-list-item-subtitle>

                                    </v-list-item-content>
                                </v-card>
                            </div>

                            <div class="col-6 p-0 m-0 d-book-address-item">
                                <v-card class="d-flex m-0 justify-content-between" role="button"
                                        @click="isSetNumberOfCast = true">
                                    <v-list-item-avatar class="p-0 pr-1 m-0" :size="27">
                                        <v-img src="../../images/GR-book-icon-user.svg"></v-img>
                                    </v-list-item-avatar>

                                    <v-list-item-content class="p-0">
                                        <v-list-item-title v-html="'キャスト人数:  '"></v-list-item-title>

                                        <v-list-item-subtitle class="mt-2">
                                            <div class="num-of-cast-member">{{ numOfCastMember }}</div>
                                        </v-list-item-subtitle>

                                    </v-list-item-content>
                                </v-card>
                            </div>

                            <div class="col-6 p-0 m-0 d-book-address-item">
                                <v-card class="d-flex m-0 justify-content-between" role="button"
                                        @click="isSetTimeBook = true">
                                    <v-list-item-avatar class="p-0 pr-1 m-0" :size="27">
                                        <v-img src="../../images/GR-book-icon-time.svg"></v-img>
                                    </v-list-item-avatar>

                                    <v-list-item-content class="p-0">
                                        <v-list-item-title v-html="'設定時間: '"></v-list-item-title>

                                        <v-list-item-subtitle class="mt-2">
                                            <div class="num-time-hours">{{ setTimeHours }}</div>
                                        </v-list-item-subtitle>

                                    </v-list-item-content>
                                </v-card>
                            </div>

                            <div class="col-6 p-0 m-0 d-book-address-item">
                                <v-card class="d-flex m-0 justify-content-between" role="button"
                                        @click="isSetCastClass = true">
                                    <v-list-item-avatar class="p-0 pr-1 m-0" :size="27">
                                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.3215 25.521C24.6652 25.521 26.5627 23.6223 26.5627 21.2798V17.9048C25.0127 17.9048 23.7627 16.6548 23.7627 15.106C23.7627 13.556 25.0127 12.3073 26.5627 12.3073L26.5602 8.92851C26.5602 6.58601 24.6627 4.68726 22.3202 4.68726H7.68024C5.33774 4.68726 3.43899 6.58601 3.43899 8.92851L3.43774 12.416C4.98649 12.416 6.23649 13.556 6.23649 15.106C6.23649 16.6548 4.98649 17.9048 3.43774 17.9048V21.2798C3.43774 23.6223 5.33524 25.521 7.67774 25.521H22.3215Z" stroke="#B3B2B1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9996 17.3179L17.1746 18.4617C17.3784 18.5679 17.6171 18.3954 17.5784 18.1692L17.1621 15.7454L18.9234 14.0317C19.0884 13.8704 18.9971 13.5917 18.7696 13.5579L16.3371 13.2042L15.2484 10.9992C15.1471 10.7929 14.8534 10.7929 14.7509 10.9992L13.6621 13.2042L11.2309 13.5579C11.0034 13.5917 10.9121 13.8704 11.0771 14.0317L12.8371 15.7454L12.4209 18.1692C12.3821 18.3954 12.6209 18.5679 12.8246 18.4617L14.9996 17.3179Z" stroke="#B3B2B1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </v-list-item-avatar>

                                    <v-list-item-content class="p-0">
                                        <v-list-item-title v-html="' キャストクラス:'"></v-list-item-title>

                                        <v-list-item-subtitle class="mt-2">
                                            <div class="cast-class">{{ castClass }}</div>
                                        </v-list-item-subtitle>

                                    </v-list-item-content>
                                </v-card>
                            </div>
                        </div>
                    </div>
                </v-col>

                <div class="col-12 p-0 m-0 d-book-address-item no-padding-left no-padding-right">
                    <v-card class="d-flex m-0 justify-content-between " role="button" @click="isLocationBook = true">
                        <v-list-item-avatar class="p-0 pr-1 m-0 mr-1" :size="27">
                            <v-img src="../../images/GR-book-icon-map-marker.svg"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content class="p-0">
                            <v-list-item-title v-html="'場所:'"></v-list-item-title>

                            <v-list-item-subtitle class="mt-2">
                                <div class="location">{{ location }}</div>
                            </v-list-item-subtitle>

                        </v-list-item-content>
                    </v-card>
                </div>
            </div>

            <div :class="[`${classNameBox}d-book-footer`]">
                <v-btn v-if="isShowIntro" block outlined :disabled="checkValidStep1" @click="clickStepTo2"
                       :class="[`btn-base mt-4`, {'d-opacity-60': checkValidStep1}]">キャストを呼ぶ 1/5
                </v-btn>
            </div>
        </div>
        <ScheduleToJoinDialog v-if="isScheduleToJoin" :isShowDialog="isScheduleToJoin" :btnTitle="'いつ呼びますか？'"
                              :funcCloseEventData="() => isScheduleToJoin = false" :isDraft="isDraft"/>


        <SetNumberOfCastDialog v-if="isSetNumberOfCast" :isShowDialog="isSetNumberOfCast" :btnTitle="'何人呼びますか？'"
                               :funcCloseEventData="(data) => isSetNumberOfCast = false" :isDraft="isDraft"/>

        <SetTimeHoursDialog v-if="isSetTimeBook" :isShowDialog="isSetTimeBook" :btnTitle="'何時間呼びますか？'"
                            :funcCloseEventData="(data) => isSetTimeBook = false" :isDraft="isDraft"/>

        <SetCastClassDialog v-if="isSetCastClass" :isShowDialog="isSetCastClass" :btnTitle="'ご希望のキャストクラスは？'"
                            :funcCallbackEventData="() => isSetCastClass = false" :isDraft="isDraft"/>

        <LocationBookDialog v-if="isLocationBook" :isShowDialog="isLocationBook" :btnTitle="'どこに呼びますか？'"
                            :funcCloseEventData="(data) => isLocationBook = false" :isDraft="isDraft"/>
    </v-card-text>
</template>

<script>


import {mapGetters, mapState} from "vuex";
import constantMain from "../../utils/constants";
import ScheduleToJoinDialog from "./ScheduleToJoinDialog";
import SetCastClassDialog from "./SetCastClassDialog";
import SetNumberOfCastDialog from "./SetNumberOfCastDialog";
import SetTimeHoursDialog from "./SetTimeHoursDialog";
import LocationBookDialog from "./LocationBookDialog";
import Vue from "vue";
import {KEY_DEFINE_COOKIES, NEW_USER_COUPON_KEY} from "../../utils/constant";
import appUtility from "../../utils/app-utility";
import moment from "moment";

export default {
    data: function () {
        return {
            isScheduleToJoin: false,
            isSetCastClass: false,
            isSetNumberOfCast: false,
            isSetTimeBook: false,
            isLocationBook: false,
            validScheduleToJoin: 1,
            validNumOfCastMember: 1,
            validSetTimeHours: 1,
            validCastClass: 1,
            validLocation: 1,
        }
    },
    props: {
        classList: {
            type: String,
            defaultValue: ""
        },
        isDraftData: {
            type: Boolean,
            default: false,
            required: false
        },
        showIntro: {
            type: Boolean,
            default: true,
            required: false
        },
        classNameBox: {
            type: String,
            default: "",
            required: false
        }
    },
    components: {
        ScheduleToJoinDialog,
        SetCastClassDialog,
        SetNumberOfCastDialog,
        LocationBookDialog,
        SetTimeHoursDialog
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            role: state => state.user.role,
            step1: state => state.book.step1,
            tempStep1: state => state.book.tempStep1,
            getCoupon: state => state.home.getCoupon,
            user: state => state.user.user,
        }),
        ...mapGetters({
            // infoShowDetail: "infoShowDetail",
        }),
        constant: function () {
            return Object.assign({}, constantMain)
        },
        scheduleToJoin: function () {
            if (!_.isObject(this.dataStep1.scheduleToJoin)) {
                this.validScheduleToJoin = 1;
                return ""
            }
            this.validScheduleToJoin = 0;

            return `${this.dataStep1.scheduleToJoin.name}`
        },
        numOfCastMember: function () {
            if (!_.isNumber(this.dataStep1.numOfCastMember)) {
                this.validNumOfCastMember = 1
                return ""
            }
            this.validNumOfCastMember = 0

            return `${this.dataStep1.numOfCastMember}人`
        },
        setTimeHours: function () {
            if (!_.isNumber(this.dataStep1.numOfCastMember)) {
                this.validSetTimeHours = 1
                return ""
            }
            this.validSetTimeHours = 0

            return `${this.dataStep1.setTimeHours}時間`
        },
        castClass: function () {
            if (!_.isObject(this.dataStep1.castClass)) {
                this.validCastClass = 1;
                return ""
            }
            this.validCastClass = 0;

            return `${this.dataStep1.castClass.name} ${(_.has(this.dataStep1.castClass, "recommend") && this.dataStep1.castClass.id === "vip" ? this.dataStep1.castClass.recommend : "")}`
        },
        location: function () {
            if (!this.dataStep1.location || !_.isObject(this.dataStep1.location) || !_.has(this.dataStep1.location, "valueChosen")) {
                this.validLocation = 1

                return "エリア"
            }
            this.validLocation = 0
            return `${this.dataStep1.location.valueChosen}`
        },
        checkValidStep1: function () {
            return [
                this.validScheduleToJoin,
                this.validNumOfCastMember,
                this.validCastClass,
                this.validSetTimeHours,
                this.validLocation,
            ].reduce((a, b) => a + b, 0) >= 1;
        },
        isShowIntro: function () {
            return !!this.showIntro
        },
        isDraft: function () {
            return !!this.isDraftData
        },
        dataStep1: function () {
            if (this.isDraft) {
                return this.tempStep1;
            }
            return this.step1
        },
        locationItems: function () {
            return this.constant.LOCATION_ITEMS;
        },
    },
    methods: {
        funcEmitData: function (id) {
            this.$nextTick(() => {
                this.$emit('change', id);
            });
        },
        clickStepTo2: function () {
            this.$store.dispatch("stepDispatch", 2)
        },
        numberWithDot: function (value) {
            return value ? appUtility.formatPriceToFixed(value) : "";
        },
        formatDateString: function (date) {
            return moment(date).format('YYYY/MM/DD')
        }
    },
    mounted() {
        this.$store.dispatch("fetchCouponForNewOrderDispatch", {user_id: this.user.id, key: NEW_USER_COUPON_KEY})
    },
    created: function () {
        let self = this;
        if (Vue.$cookies.isKey(KEY_DEFINE_COOKIES.SELECT_LOCAL_BOOK)) {
            let localSelectedCookie = Vue.$cookies.get(KEY_DEFINE_COOKIES.SELECT_LOCAL_BOOK);
            if (_.has(localSelectedCookie, "idLocation")) {
                let findIndex = self.locationItems.findIndex(ele => {
                    return ele.id === localSelectedCookie.idLocation
                })

                if (findIndex === -1) {
                    return;
                }

                let itemLocals = self.locationItems[findIndex].items;
                let findIndexItemSelect = _.has(localSelectedCookie, "key") && _.isArray(itemLocals)
                    ? itemLocals.findIndex(ele => ele && ele.key === localSelectedCookie.key)
                    : -1;

                if (findIndexItemSelect !== -1) {
                    // Set data from in cookie
                    this.$store.dispatch("updateLocaleStep1Dispatch", {
                        location: {
                            valueChosen: localSelectedCookie.name,
                            keyChosen: localSelectedCookie.key,
                            idLocale: localSelectedCookie.idLocation
                        },
                        isDraft: false, // Action update data
                    });
                }
            }
        }
    }
}
</script>

<style lang="scss">

@media screen and (min-width: 411px) and (max-width: 440px) {
    .schedule-to-join,
    .num-of-cast-member,
    .num-time-hours,
    .cast-class,
    .location {
        font-size: 13px;
    }
}

@media screen and (max-width: 411px) {
    .schedule-to-join,
    .num-of-cast-member,
    .num-time-hours,
    .cast-class,
    .location {
        font-size: 12px;
    }
}

@media screen and (max-width: 360px) {
    .schedule-to-join,
    .num-of-cast-member,
    .num-time-hours,
    .cast-class,
    .location {
        font-size: 11px;
    }
}

</style>
