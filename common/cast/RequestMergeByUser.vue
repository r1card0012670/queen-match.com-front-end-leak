<template>
    <v-sheet>
        <v-card-title>{{ orderSchedule }}</v-card-title>
        <v-card :class="[`d-request-merge-by-user p-0 mt-2`, classList]">
            <div class="d-flex align-items-center justify-content-between">
                <v-col class="d-inline-flex text--white p-0">
                    <v-icon class="d-inline-flex">location_on</v-icon>
                    <div class="p-0">{{ location }}</div>
                </v-col>
                <v-col class="d-inline-flex text--white p-0">
                    <v-icon>watch_later</v-icon>
                    <div class="p-0">{{ timeRequestOrder }}</div>
                </v-col>
                <v-col class="d-inline-flex text--white p-0">
                    <v-icon>person</v-icon>
                    <div class="p-0">{{ numPerson }}</div>
                </v-col>
                <v-col class="d-inline-flex justify-end align-self-end text--white p-0">
                    <v-avatar size="32">
                        <v-img :src="urlAvatarOfUser" @click="showDetailUserProfile(itemDataRequest)"></v-img>
                    </v-avatar>
                </v-col>

            </div>

            <v-col class="col-12 d-inline-flex p-0 d-request-merge-by-user-point pt-3">
                <div>獲得予定ポイント</div>
            </v-col>

            <v-col class="d-flex justify-content-between align-items-center d-request-merge-by-user-price p-0">
                <div class="align-self-center">深夜料金込み</div>
                <p class="m-0">{{ midnightChargeIncluded }}</p>
            </v-col>

            <v-col
                class="d-flex justify-content-between p-0 d-request-merge-by-user-price-action mt-2 pt-4 align-items-center">
                <div>
                    <button class="btn btn-sm btn-outline-danger" disabled style="font-size: 0.87rem; padding: 1px 5px">
                        延長料金
                    </button>
                    {{ pointChargeOnHours }}
                </div>
                <button class="btn btn-outline-success" v-if="applied" disabled>
                    応募済み
                </button>
                <v-btn v-else outlined @click="funcShowAcceptRequest" class="btn-base">応募する</v-btn>
            </v-col>
            <v-col class="d-message-user-confirm pl-0 pr-0" v-if="isUserConfirm">
                <p>現在審査中です。Queenからのご連絡をお待ちください。</p>
            </v-col>
        </v-card>

        <AcceptRequestUserDialog v-if="isShowAcceptRequest" :isShowDialog="isShowAcceptRequest" :btnTitle="'このコールに応募する'"
                                 :itemRequestUser="orderDetail" :funcCallbackEventData="clickCloseShowDialog"
                                 @applied="applied = true"/>

        <v-dialog v-model="isActiveDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
            <!-- Detail User -->
            <UserProfilesComponent :actType="'user-item'" :actShort="typeAction" :typeAction="'SHOW_PROFILE_OTHER'"
                                   :name="'cast2user'"
                                   :userInfo="userInfo" @eventCloseProfile="funcCloseProfile"/>
        </v-dialog>
    </v-sheet>
</template>

<script>
import AcceptRequestUserDialog from "./AcceptRequestUserDialog";
import UserProfilesComponent from "./../../components/UserProfilesComponent";
import {mapGetters, mapState} from 'vuex';
import moment from "moment";
import appUtility from "../../utils/app-utility";
import processDataUserProfile from "../../mixin/processDataUserProfile";
import C from "../../utils/constants";
import {ROLE_CONFIRM_CAST, TYPE_ROLE_USER} from "../../utils/constant";

export default {
    mixins: [
        processDataUserProfile
    ],
    data: function () {
        return {
            isShowAcceptRequest: false,
            applied: false,
            isActiveDialog: false,
            userInfo: {},
            isUserConfirm: false,
        }
    },
    props: {
        classList: {
            type: String,
            defaultValue: ""
        },
        itemDataRequest: {
            type: Object,
            defaultValue: {},
            required: true
        },
    },
    components: {
        AcceptRequestUserDialog,
        UserProfilesComponent,
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
            role: state => state.user.role,
        }),
        ...mapGetters({
            prices: 'prices',
            user: 'user',
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        location: function () {
            return _.has(this.itemDataRequest, "place_name") ? this.itemDataRequest.place_name : ""
        },
        timeRequestOrder: function () {
            return (_.has(this.itemDataRequest, "meeting_time") ? this.itemDataRequest.meeting_time : "") + "時間"
        },
        numPerson: function () {
            return (_.has(this.itemDataRequest, "number_cast") ? this.itemDataRequest.number_cast : "") + "名"
        },
        midnightChargeIncluded: function () {
            let total = 0;
            if (this.itemDataRequest.number_cast == 1) {
                total = this.user.price_point * this.itemDataRequest.meeting_time * 2;
            } else {
                total = this.prices.normal_price.value * this.itemDataRequest.meeting_time * 2;
            }
            const startTime = moment(this.orderSchedule, 'h:mm A');
            const endTime = moment(this.orderSchedule, 'h:mm A').add(this.itemDataRequest.meeting_time, 'hours');
            const nightTimeStart = moment('23:45:00', 'h:mm:ss');
            const nightTimeEnd = moment('6:00:00', 'h:mm:ss').add(1, 'days');
            if (startTime.isBetween(nightTimeStart, nightTimeEnd) || endTime.isBetween(nightTimeStart, nightTimeEnd) || (nightTimeStart.isBetween(startTime, endTime) && nightTimeEnd.isBetween(startTime, endTime))) {
                total += this.constant.PRICE.NIGHT_CHARGE;
            }

            return "+" + this.numberWithFormat(Math.round(total)) + "~";
        },
        pointChargeOnHours: function () {
            if (this.itemDataRequest.number_cast == 1) {
                return this.numberWithFormat(Math.round(this.user.price_point * 2 * this.constant.PRICE.ORDER_MORE_RATIO)) + "/1時間";
            }

            return (_.has(this.prices, "normal_price") ? "+" + this.numberWithFormat(Math.round(this.prices.normal_price.value * this.constant.PRICE.ORDER_MORE_RATIO * 2)) : "") + "/1時間"
        },
        urlAvatarOfUser: function () {
            return _.has(this.itemDataRequest, "avatar") ? this.itemDataRequest.avatar : "https://cdn.vuetifyjs.com/images/lists/2.jpg"
        },
        orderSchedule: function () {
            return moment(this.itemDataRequest.schedule_join).format('h:mm A');
        },
        timeAndAddress: function () {
            const date = moment(this.itemDataRequest.schedule_join).format('MM/DD');
            const time = moment(this.itemDataRequest.schedule_join).format('HH:mm');

            return `${date} ${this.itemDataRequest.place_name ?? ''}${this.itemDataRequest.place_detail_name ?? ''} ${time}~`;
        },
        orderTags: function () {
            return this.itemDataRequest.tags.map(x => x.tag_name).join();
        },
        orderDetail: function () {
            return {
                id: this.itemDataRequest.id,
                timeAndAddress: this.timeAndAddress,
                totalTime: this.timeRequestOrder,
                midnightChargeIncluded: this.midnightChargeIncluded,
                numPerson: this.numPerson,
                tags: this.orderTags,
            }
        },
        typeAction: function () {
            if (this.action) {
                switch (this.action) {
                    case "act-cast-for-request-merge":
                        return "add-cast-for-merge"
                }
            }

            return ""
        },
        isCast: function () {
            return this.role === TYPE_ROLE_USER.TYPE_CAST
        },
    },
    methods: {
        funcShowAcceptRequest: function (event) {
            if (this.user.cast_confirm && +this.user.cast_confirm === ROLE_CONFIRM_CAST.CONFIRM && this.isCast) {
                this.isUserConfirm = true;
                return
            }
            this.isShowAcceptRequest = true;
        },
        clickCloseShowDialog: function (data) {
            this.isShowAcceptRequest = false;
        },
        numberWithFormat: function (value) {
            return value ? appUtility.formatPriceToFixed(value) : 0;
        },
        funcCloseProfile: function () {
            this.isActiveDialog = false
        },
        showDetailUserProfile: async function (itemData) {
            // Validate
            if (!itemData || !_.has(itemData, "user_id") || !itemData.user_id) {
                return;
            }

            let data = await this.initFetchUserORCastAsync(itemData.user_id)
            // Validate user or cast
            if (!_.has(data, "user.id")) {
                return
            }
            this.userInfo = data.user;
            this.listUserOrCastData = data.suggestUserOrCast;
            // Init data for before use component UserProfilesComponent
            this.initProcessDataUserProfile({
                userOrCastId: data.user.id,
                fetchDataBeforeById: data.user,
                options: {role: {...data.dataRole}}
            });
            this.isActiveDialog = true
        },
    },
    watch: {
        isActiveDialog: function (t, f) {
            // console.log("RequestMergeByUser::isActiveDialog", t, f)
        }
    },
    created: function () {
        this.applied = this.itemDataRequest.applied;
    }
}
</script>
