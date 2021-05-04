<template>
    <div :class="[`d-dialog-payment-info p-0`]" v-if="showPaymentInfoDialog">

        <v-dialog v-if="isShowDialog" v-model="showPaymentInfoDialog"
                  :content-class="`d-dialog-show-fullscreen d-payment-info-wrapper`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="[`d-my-qrcode`]" :id="`dialog-payment-info`">
                <v-card-title :id="'d-card-title-payment-info'"
                              :class="[`headline d-header-box-payment-info p-0`, 'd-border-bottom']">
                    <div class="card-header-top">
                        <button v-on:click="clickCallbackEventDataClose">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">{{ btnTitle }}</div>
                    </div>
                </v-card-title>
                <v-card-text v-if="loading">
                </v-card-text>
                <template v-else>
                    <v-card-text :id="'d-card-text-payment-info'" v-if="showListCardDialog || isAddPaymentSuccess"
                                 :class="`d-card-text-payment-info`">
                        <v-card-text v-for="(item, index) of getPaymentListSuccess" :key="index" :data-id="item.id"
                                     class="d-flex justify-content-between pr-0 pl-0 d-card-item"
                                     data-action="actUserName">
                            <v-sheet class="d-inline-flex card-body p-0" role="button" @click="goDetail(item.id, item.is_main_card)">
                                <v-list-item-avatar style="border-radius: unset" :width="47">
                                    <v-img :width="47" :src="`../../images/GR-icon-${item.brand.toLowerCase().replace(/ /g,'-')}-for-list.svg`"/>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>{{item.brand}}</v-list-item-title>

                                    <v-list-item-subtitle>
                                        **** **** **** {{item.last_four}}
                                    </v-list-item-subtitle>

                                </v-list-item-content>
                            </v-sheet>
                            <v-col v-if="!!item.is_main_card">
                                <v-list-item-subtitle id="main-card-text">
                                    デフォルト
                                </v-list-item-subtitle>
                            </v-col>
                            <v-icon class="d-inline-flex p-0 v-icon-arrow-right">keyboard_arrow_right</v-icon>
                        </v-card-text>
                    </v-card-text>

                    <v-card-text v-else-if="showEmptyDialog || deleteSuccess" :class="`d-card-text-payment-info p-0`">
                        <v-sheet class="text-center pt-10">
                            <v-col class="text-center" style="margin-top: 150px">
                                <IconSvgComponent :type="'card-info'"/>
                            </v-col>
                        </v-sheet>
                    </v-card-text>
                    <v-card-text v-else :class="`d-card-text-payment-info p-0`">
                    </v-card-text>
                    <v-card-text :class="`d-card-text-payment-info p-0`">
                        <v-col class="p-0 box-position-footer">
                            <v-btn block @click="isAddPayment = true" :class="`btn-base`">
                                お支払い情報を追加する
                            </v-btn>
                        </v-col>
                    </v-card-text>
                </template>
            </v-card>
        </v-dialog>
        <CreateCardInfoDialog :isShowDialog="isAddPayment" :funcCallbackEventClose="funcCallbackEventClose"
                              @addSuccess="addPaymentInfoSuccess" :isHasCard="showListCardDialog"/>

        <DetailEditCardDialog v-if="isShowDetailEditCard" :isShowDialog="isShowDetailEditCard"
                              :paymentInfoId="paymentInfoId" :funcCallbackEventClose="funcCallbackEventClose" :isMainCard="isMainCard"
                              @deleteSuccess="deletePaymentInfoSuccess" @turnOff="offSpinner" @setMainSuccess="setMainSuccess"/>
        <loading :active.sync="visible" :can-cancel="canCancel"></loading>
    </div>

</template>
<script>

    // Import component
    import Loading from 'vue-loading-overlay';
    // Import stylesheet
    import 'vue-loading-overlay/dist/vue-loading.css';
    import C from "../../utils/constants";
    import {mapGetters, mapState} from "vuex";
    import DetailEditCardDialog from "./../payment/DetailEditCardDialog";
    import IconSvgComponent from "../../common/IconSvgComponent";
    import CreateCardInfoDialog from "./../payment/CreateCardInfoDialog";

    export default {
        data: function () {
            return {
                isShowDetailEditCard: false,
                isAddPayment: false,
                isShowListCard: false,
                paymentInfoId: "",
                isMainCard: "",
                isEmptyCard: true,
                visible: false,
                canCancel: false,
                isAddPaymentSuccess: false,
                isDeletePaymentSuccess: false,
            }
        },
        props: {
            classList: {
                type: String,
                defaultValue: ""
            },
            isShowDialog: {
                type: Boolean,
                required: true
            },
        },
        components: {
            CreateCardInfoDialog,
            DetailEditCardDialog,
            IconSvgComponent,
            Loading
        },
        computed: {
            ...mapState({
                // Format [stageName] => state.[modulesName].[stageName],
                isShowPaymentInfoDialog: state => state.payment.isShowPaymentInfoDialog,
                addPaymentSuccess: state => state.payment.addPaymentSuccess,
                user: state => state.user.user,
                getPaymentListSuccess: state => state.payment.getPaymentListSuccess,
                deleteSuccess: state => state.payment.deleteSuccess,
                loading: state => state.payment.loading,
            }),
            ...mapGetters({
                isShowPaymentInfoDialog: "isShowPaymentInfoDialog",
                addPaymentSuccess: "addPaymentSuccess",
                getPaymentListSuccess: "getPaymentListSuccess",
                deleteSuccess: "deleteSuccess",
            }),
            constant: function () {
                return Object.assign({}, C)
            },
            btnTitle: function () {
                return "お支払い情報"
            },
            titleName: function () {
                return ""
            },
            showPaymentInfoDialog: function () {
                return !!this.isShowPaymentInfoDialog
            },
            showListCardDialog: function () {
                let check = !!Object.keys(this.getPaymentListSuccess).length;
                if (check) {
                    this.visible = false;
                }
                return check;
            }
            ,
            showEmptyDialog: function () {
                let check = !!Object.keys(this.getPaymentListSuccess).length;
                if (check) {
                    this.isEmptyCard = false;
                }
                this.visible = false;
                return this.isEmptyCard;
            },
            isShowLoading: function () {
                if (!!this.loading) {
                    this.visible = true
                } else {
                    this.visible = false
                }
                return this.visible;
            }

        },
        created() {
            this.isShowLoading;
        },
        mounted: async function () {
            await this.getListCardInfo();
        },
        methods: {
            clickCallbackEventDataClose: function () {
                this.$store.dispatch('loadingDispatch', true);
                this.$store.dispatch('isShowPaymentInfoDispatch', false);
            },
            funcCallbackEventClose: function () {
                this.isShowDetailEditCard = false;
                this.isAddPayment = false;
                this.isShowListCard = false;
            },
            getListCardInfo: function () {
                this.$store.dispatch('loadingDispatch', true);
                this.$store.dispatch('getListCardByUserDispatch', {user_id: this.user.id});
            },
            goDetail: function (id, isMain) {
                this.paymentInfoId = `${id}`;
                this.isMainCard = `${isMain}`;
                this.isAddPaymentSuccess = false;
                this.isDeletePaymentSuccess = false;
                this.isShowDetailEditCard = true;
                this.visible = true;
            },
            addPaymentInfoSuccess: function (data) {
                if (_.has(data, "code") && data.code === 201) {
                    this.getListCardInfo();
                    this.isDeletePaymentSuccess = false;
                    this.isAddPaymentSuccess = true;
                    this.isAddPayment = false;
                    this.visible = true;
                }
            },
            deletePaymentInfoSuccess: function (data) {
                if (_.has(data, "code") && data.code === 200) {
                    this.getListCardInfo();
                    this.isAddPaymentSuccess = false;
                    this.isDeletePaymentSuccess = true;
                    this.isShowDetailEditCard = false;
                    this.visible = true;
                }
            },
            setMainSuccess: function (data) {
                if (data) {
                    this.getListCardInfo();
                    this.isAddPaymentSuccess = false;
                    //this.isSetMainSuccess = true;
                    this.isShowDetailEditCard = false;
                    this.visible = true;
                }
            },
            offSpinner: function (data) {
                if (_.has(data, "off") && data.off === true) {
                    this.visible = false;
                }
            }
        }
    }
</script>
<style lang="scss">
    #main-card-text {
        box-shadow: none !important;
        border: 1px solid orangered;
        border-radius: 5px;
        margin-top: 5px;
        padding: 0 5px 0 5px;
        color: orangered;
    }
</style>
