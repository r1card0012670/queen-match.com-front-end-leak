<template>
    <div :class="[`d-dialog-detail-edit-card p-0`]" v-if="showCreateCardDialog">

        <v-dialog v-if="isShowDialog" v-model="showCreateCardDialog"
                  :content-class="`d-dialog-show-fullscreen d-detail-edit-card-wrapper`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="[`d-my-qrcode bg-grey`]" :id="`dialog-detail-edit-card`">
                <v-card-title :id="'d-card-title-detail-edit-card'"
                              :class="[`headline d-header-box-detail-edit-card p-0`]">
                    <div class="card-header-top">
                        <button v-on:click="clickCallbackEventClose">
                            <v-img contain src="../../images/times.svg"/>
                        </button>
                        <div class="d-title">{{ btnTitle }}</div>
                    </div>
                    <div class="dialog-detail-edit-card-list-icon d-width-100">
                        <v-img contain src="../../images/GR-list-icon-card.svg"/>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-detail-edit-card'" class="bg-grey mb-80">
                    <v-card-text class="d-flex pr-0 pl-0 mt-2">
                        <v-form ref="addPaymentInfo" v-model="valid" lazy-validation v-on:submit.prevent>

                            <v-sheet class="card-body p-0 bg-grey" role="button" @click="isAddPayment = true">
                                <v-col cols="12" class="p-0">

                                    <div class="d-label d-title-form-register pb-1">カード番号</div>
                                    <v-text-field solo v-model="vModelNumber"
                                                  :rules="[cardNumberRules.required, cardNumberRules.min, cardNumberRules.max, cardNumberRules.regex]"
                                                  label="12345"
                                                  :error-messages="errorMsgNumber"
                                                  required>

                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" class="p-0 d-inline-flex">
                                    <v-col cols="6" class="p-0 pr-2">
                                        <div class="d-label d-title-form-register pb-1">有効期限</div>
                                        <v-text-field solo v-model="vModelExpDate"
                                                      :rules="expDateRules.concat(expDateRule)"
                                                      label="MM/YYYY"
                                                      :error-messages="errorMsgExpDate"
                                                      required
                                                      @click="clickSetTimePlan()">
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="6" class="p-0 pl-2">
                                        <div class="d-label d-title-form-register pb-1">セキュリティコード</div>
                                        <v-text-field solo v-model="vModelCvc"
                                                      :rules="[cvcRules.required, cvcRules.min, cvcRules.max, cvcRules.regex]"
                                                      label="123"
                                                      :error-messages="errorMsgCvc"
                                                      required>

                                        </v-text-field>
                                    </v-col>
                                </v-col>

                                <v-col cols="12" class="p-0">
                                    <div class="d-label d-title-form-register pb-1">カード所有者の氏名</div>
                                    <v-text-field solo v-model="vModelName"
                                                  :rules="[nameRules.required, nameRules.max]"
                                                  label="TARO TANAKA"
                                                  :error-messages="errorMsgName"
                                                  required>

                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" class="p-0">
                                    <p style="color: #ff5252">※ご本人名義のカードのみご利用いただけます</p>
                                </v-col>
                                <v-col cols="12" class="p-0 d-inline-flex" v-if="isHasCard">
                                    <v-col cols="6" class="p-0 pr-2">
                                        <div class="d-label">マインカード</div>
                                    </v-col>
                                    <v-col cols="6" class="p-0 pr-2">
                                        <div class="d-label float-right" id="swt-main">
                                            <v-switch class="m-0 p-0" v-model="vModelIsMain"></v-switch>
                                        </div>
                                    </v-col>
                                </v-col>
                                <v-col class="col-12 p-0">
                                    <p style="color: limegreen" class="text-center">決済は、STRIPE PAYMENT サービスを利用しています。</p>
                                </v-col>
                                <v-col class="col-12 p-0 box-position-footer">

                                    <v-btn type="submit" outlined block :disabled="!valid" class="d-action-register btn-base"
                                           @click="validateActAddPayment">
                                        追加する
                                    </v-btn>
                                </v-col>
                            </v-sheet>
                        </v-form>
                    </v-card-text>
                </v-card-text>

            </v-card>
        </v-dialog>

        <CreateFailedDialog v-if="createCardFailed" :createCardFailed="createCardFailed" @closeAct="closeAction"/>
        <ExpirationDateDialog v-if="isCloseTimePlan" :isShowDialog="isCloseTimePlan" @changeTime="funcEmitDataTimePlan"/>
        <loading :active.sync="visible" :can-cancel="canCancel"></loading>
    </div>
</template>
<script>

    // Import component
    import Loading from 'vue-loading-overlay';
    // Import stylesheet
    import 'vue-loading-overlay/dist/vue-loading.css';
    import {mapGetters, mapState} from "vuex";
    import C from "../../utils/constants";
    import CreateFailedDialog from "./../payment/CreateFailedDialog";
    import ExpirationDateDialog from "./../payment/ExpirationDateDialog";
    import {api} from "../../_services/api";

    export default {
        data: function () {
            return {
                canCancel: false,
                visible: false,
                valid: true,
                vModelNumber: "",
                vModelExpDate: "",
                vModelCvc: "",
                vModelName: "",
                vModelIsMain: true,
                cardNumberRules: {
                    required: value => !!value || "カード番号は必須です",
                    min: v => (v && v.length >= 14) || "14数字以上16数字以内で入力してください",
                    max: v => (v && v.length <= 16) || "14数字以上16数字以内で入力してください",
                    regex: v => /^[0-9]*$/.test(v) || "14数字以上16数字以内で入力してください"
                },
                expDateRules: [value => !!value || "この項目は必須です"],
                cvcRules: {
                    required: value => !!value || "セキュリティコードは必須です",
                    min: v => (v && v.length >= 3) || "3文字以上4文字以下で入力してください ",
                    max: v => (v && v.length <= 4) || "3文字以上4文字以下で入力してください ",
                    regex: v => /^[0-9]*$/.test(v) || "3文字以上4文字以下で入力してください "
                },
                nameRules: {
                    required: value => value.replace(/ /g,'').length > 0 || "カード所有者の氏名は必須です",
                    max: v => (v && v.length <= 255) || "255文字以下で入力してください",
                },
                isCloseTimePlan: false,
                createCardFailed: false
            }
        },
        props: {
            isShowDialog: {
                type: Boolean,
                required: true
            },
            funcCallbackEventClose: {
                type: Function,
                required: true
            },
            isHasCard: {
                type: Boolean,
                required: true
            }
        },
        model: {
            event: 'addSuccess'
        },
        components: {
            ExpirationDateDialog,
            Loading,
            CreateFailedDialog
        },
        computed: {
            ...mapState({
                // Format [stageName] => state.[modulesName].[stageName],
                addPaymentFailure: state => state.payment.addPaymentFailure,
                user: state => state.user.user
            }),
            ...mapGetters({
                addPaymentFailure: "addPaymentFailure",
            }),
            constant: function () {
                return Object.assign({}, C)
            },
            btnTitle: function () {
                return "お支払い情報を登録する"
            },
            titleName: function () {
                return ""
            },
            showCreateCardDialog: function () {
                return !!this.isShowDialog
            },
            errorMsgNumber: function () {
                return _.has(this.addPaymentFailure, "message.number") ? this.addPaymentFailure.message.number[0] : ""
            },
            errorMsgExpDate: function () {
                return _.has(this.addPaymentFailure, "message.exp_date") ? this.addPaymentFailure.message.exp_date[0] : ""
            },
            errorMsgCvc: function () {
                return _.has(this.addPaymentFailure, "message.cvc") ? this.addPaymentFailure.message.cvc[0] : ""
            },
            errorMsgName: function () {
                return _.has(this.addPaymentFailure, "message.name") ? this.addPaymentFailure.message.name[0] : ""
            },
            expDateRule() {
                let today, someday;
                let expTime = (this.vModelExpDate).split('/');
                today = new Date();
                someday = new Date();
                someday.setFullYear(expTime[1], expTime[0], 1);
                return () => (someday > today)  || "既存年月日より大きいのを選択してください。";
            },
        },
        watch: {
            vModelNumber: function (newData, oldData) {
                this.valid = true
            }
        },
        methods: {
            clickCallbackEventClose: function () {
                this.funcCallbackEventClose(false);
            },
            validateActAddPayment() {
                if (this.$refs.addPaymentInfo && this.$refs.addPaymentInfo.validate()) {
                    // submit form to server/API here...
                    let expTime = (this.vModelExpDate).split('/');

                    this.addPayment({
                        number: this.vModelNumber,
                        exp_month: expTime[0],
                        exp_year: expTime[1],
                        cvc: this.vModelCvc,
                        name: this.vModelName,
                        user_id: this.user.id,
                        is_main_card: this.vModelIsMain
                    });

                    this.visible = true
                }
            },
            funcEmitDataTimePlan: function (data) {
                if (_.has(data, "date") && !!data.isAction) {
                    let expDate = data.date[0] + '/' + data.date[1];

                    this.vModelExpDate = expDate;
                }

                this.isCloseTimePlan = false
            },
            clickSetTimePlan: function () {
                this.$nextTick(() => {
                    this.isCloseTimePlan = true;
                });
            },
            addPayment: function(payload) {
                const requestOptions = {
                    method: 'POST',
                    url: '/paymentinfo/create',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: Object.assign({}, _.pick(payload, ["number", "exp_month", "exp_year", "cvc", "name", "user_id", "is_main_card"]))
                };

                api(requestOptions).then(async result => {
                    await this.$emit('addSuccess', result);
                    this.$nextTick(() => {
                        this.vModelNumber = "";
                        this.vModelExpDate = "";
                        this.vModelCvc = "";
                        this.vModelName = "";
                        this.vModelIsMain = true;
                        this.canCancel = true;
                        this.visible = false;
                    })
                }).catch(err => {
                    this.createCardFailed = true;
                    this.canCancel = true;
                    this.visible = false;
                });
            },
            closeAction: function (data) {
                if (data === true) {
                    this.createCardFailed = false;
                }
            }
        },
        destroyed() {
            this.vModelNumber = "";
            this.vModelExpDate = "";
            this.vModelCvc = "";
            this.vModelName = "";
            this.vModelIsMain = true;
        }
    }
</script>
<style lang="scss">
    #swt-main .v-input__slot {
        border: none !important;
    }
</style>
