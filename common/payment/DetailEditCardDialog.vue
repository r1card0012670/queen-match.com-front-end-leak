<template>
    <div :class="[`d-dialog-detail-edit-card p-0`]" v-if="showPaymentDetailDialog">

        <v-dialog v-if="isHasData" v-model="getCardDetailSuccess"
                  :content-class="`d-dialog-show-fullscreen d-detail-edit-card-wrapper`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="[`d-my-qrcode bg-grey`]" :id="`dialog-detail-edit-card`">
                <v-card-title :id="'d-card-title-detail-edit-card'"
                              :class="[`headline d-header-box-detail-edit-card p-0`, 'd-border-bottom']">
                    <div class="card-header-top">
                        <button v-on:click="clickCallbackEventClose">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">{{ btnTitle }}</div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-detail-edit-card'" class="bg-grey mb-80">
                    <v-card-text class="d-flex pr-0 pl-0">
                        <v-sheet class="card-body p-0 bg-grey" role="button">
                            <div class="col-12 p-0 d-type-card">
                                <v-img contain src="../../images/GR-img-type-card.svg"></v-img>
                                <div class="d-type-card-info">
                                    <div class="flex-grow-1">
                                        <v-img :width="49"
                                               :src="`../../images/GR-icon-${renderTypCreditCard}.svg`"/>
                                    </div>
                                    <p>**** **** **** {{ getCardDetailSuccess.last_four }}</p>
                                    <p>連携中</p>
                                </div>
                            </div>
                            <div v-if="getCardDetailSuccess.response.name" class="col-12 p-0 mt-5">
                                <h5>カード所有者の氏名</h5>
                                <p>
                                    {{ getCardDetailSuccess.response.name }}
                                </p>
                            </div>
                            <div class="col-12 p-0 mt-5">
                                <h5>有効期限</h5>
                                <p>
                                    {{ responseSources.exp_month }}/{{ responseSources.exp_year }}
                                </p>
                            </div>
                            <v-col cols="12" class="p-0 d-inline-flex" v-if="isMainCard !== '1'">
                                <v-col cols="6" class="p-0 pr-2">
                                    <h5>マインカード</h5>
                                </v-col>
                                <v-col cols="6" class="p-0 pr-2">
                                    <div class="d-label float-right" id="swt-main">
                                        <v-switch class="m-0 p-0" @click="setMain"></v-switch>
                                    </div>
                                </v-col>
                            </v-col>
                            <v-col class="col-12 p-0 box-position-footer">
                                <v-btn outlined block class="btn-base btn-empty" @click="deleteCardInfo">連携解除</v-btn>
                            </v-col>
                        </v-sheet>

                    </v-card-text>
                </v-card-text>

            </v-card>
            <loading :active.sync="visible" :can-cancel="canCancel"></loading>
        </v-dialog>
    </div>
</template>
<style>
body {
    font-family: Arial, Verdana, sans-sarif;
}
</style>
<script>
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
import C from "../../utils/constants";
import {mapGetters, mapState} from "vuex";
import {api} from "../../_services/api";

export default {
    data: function () {
        return {
            canCancel: false,
            visible: false,
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
        funcCallbackEventClose: {
            type: Function,
            required: true
        },
        paymentInfoId: {
            type: String,
            defaultValue: ''
        },
        isMainCard: {
            type: String,
            defaultValue: ''
        }
    },
    components: {
        Loading
    },
    model: {
        event: 'deleteSuccess',
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            getCardDetailSuccess: state => state.payment.getCardDetailSuccess,
            user: state => state.user.user
        }),
        ...mapGetters({
            getCardDetailSuccess: "getCardDetailSuccess",
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
        showPaymentDetailDialog: function () {
            //this.visible = true;
            return !!this.isShowDialog
        },
        isHasData: function () {
            let isShowing = false;
            if (!!Object.keys(this.getCardDetailSuccess).length && !!this.getCardDetailSuccess.payment_info_id
                && this.getCardDetailSuccess.payment_info_id === this.paymentInfoId) {
                isShowing = true;
            }
            if (isShowing) {
                this.visible = false;
                this.$emit('turnOff', {off: true});
            }
            return isShowing;
        },
        responseSources: function () {
            return _.has(this.getCardDetailSuccess, "response.sources.data")
            && this.getCardDetailSuccess.response.sources.data.length
                ? this.getCardDetailSuccess.response.sources.data[0]
                : {}
        },
        renderTypCreditCard: function () {
            return _.has(this.responseSources, "brand") && this.responseSources.brand
                ? `${this.responseSources.brand}`.toLowerCase().replace(/ /g, '-')
                : ""
        }
    },
    mounted: function () {
        this.getCardDetail();
    },
    methods: {
        clickCallbackEventClose: function () {
            this.funcCallbackEventClose(false);
        },
        getCardDetail: function () {
            this.$store.dispatch('getCardDetailDispatch', {payment_info_id: this.paymentInfoId});
        },
        deleteCardInfo: function () {
            this.visible = true;
            const requestOptions = {
                method: 'DELETE',
                url: `/paymentinfo/delete/${this.paymentInfoId}`,
            };

            return api(requestOptions).then(result => {
                this.canCancel = true;
                this.visible = false;
                this.$emit('deleteSuccess', result);
            }).catch(err => {
                this.visible = false;
            });
        },
        setMain: function () {
            this.$store.dispatch('setMainCardDispatch', {
                is_main_card: true,
                user_id: this.user.id,
                payment_info_id: this.paymentInfoId
            })
            this.$emit('setMainSuccess', true);
        }
    },
}
</script>
