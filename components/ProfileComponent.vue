<template>
    <div id="body-content-scroll" :class="`container body-content-profile p-0`">
        <div class="justify-content-center">
            <v-col class="p-0 d-image-thumbnail-wrap mt-4 mb-0 d-border-bottom pb-3">
                <v-sheet class="card-body p-0 justify-content-center">
                    <div class="text-center d-image-thumbnail-box">
                        <IconUser :size="132" :userId="userId" :dataUser="getUserAvatar"/>
                    </div>
                    <div class="text-center d-box-info m-1">
                        <div class="d-username m-0">{{userInfo.nickname}}</div>
                        <v-btn class="p-0" plain><div class="d-other m-1" @click="clickSettingEdit">プロフィールを編集</div></v-btn>
                    </div>
                </v-sheet>
            </v-col>

            <div class="col-12 p-0" v-if="!!isCast">
                <v-divider :class="`mt-0 mb-0 width-4`"/>
            </div>

            <v-col class="d-plan-of-cast-wrap p-0 d-border-bottom d-border-width-8" role="button" v-if="!!isCast">
                <div class="d-flex justify-content-between">
                    <div class="v-sheet font-weight-bold d-line-title"> スケジュール</div>
                    <div role="button" class="btn-show-plan">
                        <v-btn class="p-0" plain @click="showPlanForCast">活動予定カレンダー</v-btn>
                    </div>
                </div>

                <CalendarWeekly :userId="userId" :dateWorkingTime="dateWorkingTime"/>
            </v-col>
            <v-col class="d-price-history-wrap p-0 d-border-bottom" role="button">
                <v-card-text class="d-flex justify-content-between" @click="isShowHistoryPricesDialog= true">
                    <v-sheet class="d-inline-flex card-body p-0" role="button">
                        <v-list-item-avatar>
                            <IconSvgComponent :className="'d-inline-block'" :type="'point'"/>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title v-html="itemPriceHistoryName"></v-list-item-title>

                            <v-list-item-subtitle>
                                {{user.point ? numberWithDot(user.point) : 0}} ポイント
                            </v-list-item-subtitle>

                        </v-list-item-content>
                    </v-sheet>
                    <v-icon class="d-inline-flex p-0 icon-arrow-right" role="button">keyboard_arrow_right</v-icon>
                </v-card-text>
            </v-col>

            <v-col class="d-payment-wrap p-0 d-border-bottom">
                <v-card-text class="d-flex justify-content-between" @click="funcClickPaymentIno">
                    <v-sheet class="d-inline-flex card-body p-0" role="button">
                        <v-list-item-avatar>
                            <!--                            <v-icon large class="p-0">credit_card</v-icon>-->
                            <IconSvgComponent :className="'d-inline-block'" :type="'card'"/>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title v-html="itemPaymentName"></v-list-item-title>

                            <v-list-item-subtitle>
                                決済手段を追加
                            </v-list-item-subtitle>

                        </v-list-item-content>
                    </v-sheet>
                    <v-icon class="d-inline-flex p-0 icon-arrow-right" role="button">keyboard_arrow_right</v-icon>
                </v-card-text>
            </v-col>
            <v-col class="d-store-communication-wrap p-0 ">
                <v-card-text class="d-flex justify-content-between" @click="isShowStoresDialog= true">
                    <v-sheet class="d-inline-flex card-body p-0" role="button">
                        <v-list-item-avatar>
                            <!--                            <v-icon large class="p-0">storefront</v-icon>-->
                            <IconSvgComponent :className="'d-inline-block'" :type="'stores'"/>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title v-html="itemStoreCommunicationName"></v-list-item-title>
                            <v-list-item-subtitle>
                            </v-list-item-subtitle>

                        </v-list-item-content>
                    </v-sheet>
                    <v-icon class="d-inline-flex p-0 icon-arrow-right" role="button">keyboard_arrow_right</v-icon>
                </v-card-text>
            </v-col>
            <v-col v-if="user.is_agency || isCast" class="d-store-communication-wrap p-0 ">
                <v-card-text class="d-flex justify-content-between" @click="showBankAccountDialog = true">
                    <v-sheet class="d-inline-flex card-body p-0" role="button">
                        <v-list-item-avatar>
                            <IconSvgComponent :className="'d-inline-block'" :type="'stores'"/>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title v-html="itemBankAccount"></v-list-item-title>
                            <v-list-item-subtitle>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-sheet>
                    <v-icon class="d-inline-flex p-0 icon-arrow-right" role="button">keyboard_arrow_right</v-icon>
                </v-card-text>
            </v-col>

        </div>
        <!--<loading :active.sync="visible" :can-cancel="canCancel"></loading>-->

        <MyQRCodeDialog v-if="isShowMyQRCodeDialog" :btnTitle="'ゲストコミュニティ'" :isShowDialog="isShowMyQRCodeDialog"
                        :funcCallbackEventData="funcCallbackEventQRCode"/>
        <SettingProfileDialog v-if="isSettingProfile" :btnTitle="'通知設定'" :isShowDialog="isSettingProfile"
                              :funcCallbackEventData="funcCallbackEventSetting"/>

        <PaymentInformationDialog v-if="isShow" :isShowDialog="isShow" @offOverlay="turnOff"/>

        <HistoryPricesDialog v-if="isShowHistoryPricesDialog && userInfo" :isShowDialog="isShowHistoryPricesDialog"
                             :funcHistoryPriceCallBackClose="funcHistoryPriceCallBackClose" :userInfo="userInfo"/>

        <ListStoresDialog v-if="isShowStoresDialog" :isShowDialog="isShowStoresDialog" :typeAct="'get-all'"
                          :funcStoresCallBackClose="funcStoresCallBackClose"/>

        <SetupPlanForCastDialog v-if="!!isCast && !!isShowPlanForCast && resultCallListWorkingTime"
                                :isShowDialog="!!isCast && !!isShowPlanForCast"
                                :funcCallbackEventData="handleEventDataEditPlan"
                                @resetListWorkingTime="resetListWorkingTime"/>

        <v-dialog v-model="isUpdateProfile" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
            <!-- Detail User -->
            <UserProfilesComponent :typeAction="'EDIT_PROFILE'" :name="'user2showupdate'" :userInfo="userInfo"
                                   @eventCloseProfile="funcCloseProfile"/>
        </v-dialog>

        <bank-account v-if="showBankAccountDialog" @close="showBankAccountDialog = false"></bank-account>

        <loading :active.sync="loadingPoint"></loading>
    </div>
</template>
<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import {mapGetters, mapState} from "vuex";
import constantMain from "../utils/constants";
import IconUser from "./../common/user/IconUser";
import MyQRCodeDialog from "./../common/user/MyQRCodeDialog";
import SettingProfileDialog from "./../common/user/SettingProfileDialog";
import PaymentInformationDialog from "./../common/payment/PaymentInformationDialog";
import HistoryPricesDialog from "./../common/payment/HistoryPricesDialog";
import ListStoresDialog from "./../common/store/ListStoresDialog";
import {TYPE_ROLE_USER} from "../utils/constant";
import CalendarWeekly from "../common/user/CalendarWeekly";
import SetupPlanForCastDialog from "../common/cast/SetupPlanForCastDialog";
import IconSvgComponent from "./../common/IconSvgComponent";
import UserProfilesComponent from "./../components/UserProfilesComponent";
import appUtility from "../utils/app-utility";
import BankAccount from "./BankAccount";


export default {
    props: {
        payload: {
            type: Object,
            defaultValue: {}
        },
    },
    data: function () {
        return {
            isShowHistoryPricesDialog: false,
            isShowStoresDialog: false,
            isShowPlanForCast: false,
            canCancel: false,
            visible: false,
            showBankAccountDialog: false,
        }
    },
    components: {
        IconUser,
        MyQRCodeDialog,
        SettingProfileDialog,
        PaymentInformationDialog,
        HistoryPricesDialog,
        ListStoresDialog,
        CalendarWeekly,
        SetupPlanForCastDialog,
        IconSvgComponent,
        Loading,
        UserProfilesComponent,
        BankAccount,
    },
    mounted: function (){
    },
    methods: {
        numberWithDot: function (value) {
            return value ? appUtility.formatPriceToFixed(value) : "";
        },
        funcCloseProfile: function () {
            this.$store.dispatch('isUpdateProfileDispatch', false)
        },
        funcCallbackEventQRCode: function () {
            debugger
        },
        funcCallbackEventSetting: function () {
            debugger
        },
        funcClickPaymentIno: function () {
            this.visible = true;
            this.$store.dispatch('isShowPaymentInfoDispatch', true);
        },
        funcHistoryPriceCallBackClose: function () {
            this.isShowHistoryPricesDialog = false
        },
        funcStoresCallBackClose: function () {
            this.isShowStoresDialog = false
        },
        handleEventDataEditPlan: function (data) {
            // TODO

            // Close dialog set plan for Cast
            this.isShowPlanForCast = false
        },
        turnOff: function (data) {
            if (_.has(data, "off") && data.off === true) {
                this.canCancel = true;
                this.visible = false;
            }
        },
        clickSettingEdit: function () {
            this.$store.dispatch('isUpdateProfileDispatch', true)
        },
        getCurrentUser: function () {
            if (!this.user.id) {
                location.reload();
            }

            this.$store.dispatch('getCurrentUserInfoDispatch', {user_id: this.user.id});
            this.$store.dispatch('isUpdateProfileDispatch', false)
        },
        showPlanForCast: function () {
            this.isShowPlanForCast = true
            let start_date = appUtility.dateFormat(new Date(), "YYYY-MM-DD");
            let end_date = appUtility.dateFormat(appUtility.dateAdd(start_date, 14, 'day'), "YYYY-MM-DD");
            let data = {
                start_date: start_date,
                end_date: end_date,
                cast_id: this.user.id,
                input: 'working_times.date'
            }
            this.$store.dispatch('getListWorkingTimeDispatch', data)
        },
        resetListWorkingTime: async function () {
            await this.$store.dispatch('getCurrentUserInfoDispatch', {user_id: this.user.id});
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            isUpdateProfile: state => state.user.isUpdateProfile,
            isShowMyQRCodeDialog: state => state.user.isShowMyQRCodeDialog,
            isSettingProfile: state => state.user.isSettingProfile,
            isShowPaymentInfoDialog: state => state.payment.isShowPaymentInfoDialog,
            role: state => state.user.role,
            user: state => state.user.user,
            getCurrentUserInfo: state => state.user.getCurrentUserInfo,
            loadingPoint: state => state.user.loadingPoint,
            listWorkingTime: state => state.cast.listWorkingTime,
            resultCallListWorkingTime: state => state.cast.resultCallListWorkingTime,
        }),
        ...mapGetters({
            isShowMyQRCodeDialog: "isShowMyQRCodeDialog",
            isSettingProfile: "isSettingProfile",
            isShowPaymentInfoDialog: "isShowPaymentInfoDialog",
        }),
        constant: function () {
            return Object.assign({}, constantMain)
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        isCast: function () {
            return this.role === TYPE_ROLE_USER.TYPE_CAST
        },
        userInfo: function () {
            return this.getCurrentUserInfo
        },
        userId: function () {
            return `${this.userInfo.id}`
        },
        itemPriceHistoryName: function () {
            return "ポイント履歴・領収書"
        },
        itemPaymentName: function () {
            return "お支払い情報 "
        },
        itemStoreCommunicationName: function () {
            return "提携店舗一覧 "
        },
        itemBankAccount: function () {
            return "支払要求"
        },
        isShow: function () {
            let check = !!this.isShowPaymentInfoDialog;
            if (check) {
                this.canCancel = true;
            }
            return check;
        },
        dateWorkingTime: function () {
            // Data of user login
            return _.has(this.getCurrentUserInfo, "working_time") ? this.getCurrentUserInfo.working_time : []
        },
        checkDateWorkingTime: function () {
            return !!this.dateWorkingTime.length
        },
        getUserAvatar: function () {
            let currentUser = {avatar: ''};
            if (this.getCurrentUserInfo.user_images) {
                let userImage = this.getCurrentUserInfo.user_images.filter(image => image.set_as_avatar === 1);
                if (userImage.length > 0) {
                    currentUser.avatar = userImage[0].image;
                } else {
                    if (this.getCurrentUserInfo.user_images.length) {
                        currentUser.avatar = this.getCurrentUserInfo.user_images[0].image; // Get first
                    }
                }
            }
            return currentUser;
        }
    },
    updated() {
        let elementWorking = document.querySelectorAll(".d-line-no-plan");
        [...elementWorking].forEach(ele => {
            let elementParent = ele.closest("div.v-calendar-weekly__day");
            if (!!elementParent) {
                elementParent.classList.add("d-has-working")
            }
        });

        let listTextWorking = document.querySelectorAll(".d-has-working");
        [...listTextWorking].forEach(ele => {
            let class_list = ele.lastChild.className
            let check = class_list.includes('d-line-no-plan')
            if (!check){
                ele.classList.remove('d-has-working')
            }
        });
    },
    watch:  {
        isUpdateProfile: function (t, f) {
            // console.log("ProfileComponent::isUpdateProfile", t, f)
        }
    },
    beforeMount() {
        this.getCurrentUser();
    }
}
</script>
