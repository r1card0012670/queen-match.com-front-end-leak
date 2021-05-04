<template>
    <div>
        <v-dialog v-model="show"
                  :content-class="`d-dialog-show-fullscreen d-detail-edit-card-wrapper`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition"
                  scrollable
        >
            <v-card :class="[`d-my-qrcode bg-grey`]" :id="`dialog-detail-edit-card`">
                <v-card-title :id="'d-card-title-detail-edit-card'"
                              :class="[`headline d-header-box-detail-edit-card p-0`]">
                    <div class="card-header-top">
                        <button @click="closeDialog">
                            <v-img contain src="../../images/times.svg"/>
                        </button>
                        <div class="d-title">支払要求</div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-detail-edit-card'" class="bg-grey mb-80">
                    <v-card-text class=" pr-0 pl-0 mt-2">
                        <v-form ref="createBankAccountForm" lazy-validation v-on:submit.prevent>
                            <v-sheet class="card-body p-0 bg-grey">
                                <div class="row">
                                    <v-col cols="6">
                                        <div class="d-label d-title-form-register pb-1">ポイント</div>
                                        <v-text-field
                                            solo
                                            v-model="pointRequested"
                                            type="number"
                                            :rules="pointRequestedRules"
                                            inputmode="numeric"
                                            pattern="[0-9]*"
                                        >
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="6">
                                        <div class="d-label d-title-form-register pb-1">換算料金</div>
                                        <v-text-field
                                            solo
                                            v-model="pointAfterExchange"
                                            type="number"
                                            inputmode="numeric"
                                            pattern="[0-9]*"
                                            readonly
                                        >
                                        </v-text-field>
                                    </v-col>
                                </div>

                                <v-col class="col-12 p-0 box-position-footer">
                                    <h5 v-if="user.point < 10000" class="text-center text-danger">
                                        最低ポイント数は10000ポイントが必要です。
                                    </h5>
                                    <v-btn type="submit" outlined block
                                           class="d-action-register btn-base"
                                           @click="submitPaymentRequest"
                                           :disabled="user.point < 10000"
                                    >
                                        リクエスト
                                    </v-btn>
                                </v-col>
                            </v-sheet>
                        </v-form>
                    </v-card-text>
                </v-card-text>
            </v-card>
        </v-dialog>
        <loading :active.sync="loading"></loading>

        <v-dialog v-if="overlay" v-model="overlay" fullscreen persistent max-width="440"
                  :content-class="`d-dialog-show-fullscreen`"
                  transition="dialog-center-transition">

            <notice-component :is-show-notice="overlay" :is-show-close="false" :class-name="'d-flex flex-column align-items-center'">
                <template v-slot:cbody>
                    <svg v-if="createPaymentRequestSuccess" width="63" height="48" viewBox="0 0 63 48" fill="none"
                         class="ml-5"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M58.0781 0.9375L18.7031 40.3125L4.78125 26.3906C4.07812 25.8281 3.09375 25.8281 2.39062 26.3906L0.84375 28.0781C0.140625 28.6406 0.140625 29.7656 0.84375 30.4688L17.5781 47.2031C18.1406 47.7656 19.2656 47.7656 19.8281 47.2031L62.0156 5.01562C62.7188 4.3125 62.7188 3.1875 62.0156 2.625L60.4688 0.9375C59.7656 0.375 58.7812 0.375 58.0781 0.9375Z"
                            fill="white"/>
                    </svg>
                    <svg v-else width="48" height="48" viewBox="0 0 16 16" fill="none"
                         class="ml-7"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.7031 8L15.7656 2.98438C16.0469 2.70312 16.0469 2.1875 15.7656 1.90625L14.5938 0.734375C14.3125 0.453125 13.7969 0.453125 13.5156 0.734375L8.5 5.79688L3.4375 0.734375C3.15625 0.453125 2.64062 0.453125 2.35938 0.734375L1.1875 1.90625C0.90625 2.1875 0.90625 2.70312 1.1875 2.98438L6.25 8L1.1875 13.0625C0.90625 13.3438 0.90625 13.8594 1.1875 14.1406L2.35938 15.3125C2.64062 15.5938 3.15625 15.5938 3.4375 15.3125L8.5 10.25L13.5156 15.3125C13.7969 15.5938 14.3125 15.5938 14.5938 15.3125L15.7656 14.1406C16.0469 13.8594 16.0469 13.3438 15.7656 13.0625L10.7031 8Z"
                            fill="red"></path>
                    </svg>
                    <div class="pt-3 text-center color--white">
                        {{ createPaymentRequestSuccess ? 'リクエスト送信済み' : 'エラーがあります。 もう一度やり直してください' }}
                    </div>
                </template>
            </notice-component>
        </v-dialog>
    </div>
</template>
<script>
import Loading from "vue-loading-overlay";
import NoticeComponent from "./NoticeComponent";
import {mapActions, mapGetters, mapMutations} from 'vuex';
import C from "../utils/constants.js";
import {setUser} from "../utils/auth";

import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    components: {
        Loading,
        NoticeComponent,
    },
    props: {},
    data() {
        return {
            show: true,
            loading: false,
            pointRequested: '',
            overlay: false,
            createPaymentRequestSuccess: false,
        }
    },
    computed: {
        ...mapGetters({
            user: 'user',
        }),
        pointAfterExchange: function () {
            return this.pointRequested ? Math.round(this.pointRequested * this.constant.APP_PAYMENT_RATIO) : '';
        },
        pointRequestedRules: function () {
            return [
                value => !!value || "必須",
                v => (parseInt(v) >= this.constant.APP_PAYMENT_MIN) || `ポイントは${this.constant.APP_PAYMENT_MIN}以上の整数が必要です。`,
                v => (parseInt(v) <= this.user.point) || `所有ポイント以下のポイントを入力して下さい。`,
                v => /^[0-9]*$/.test(v) || `ポイントは${this.constant.APP_PAYMENT_MIN}以上の整数が必要です。`,
            ]
        },
        constant: function () {
            return Object.assign({}, C)
        },
    },
    methods: {
        ...mapActions({
            createPaymentRequest: 'createPaymentRequest',
        }),
        ...mapMutations({
            userMutation: 'userMutation',
        }),
        closeDialog: function () {
            this.$emit('close');
        },
        submitPaymentRequest: function () {
            const data = {
                point: parseInt(this.pointRequested),
                conversion_money: this.pointAfterExchange,
            };

            if (this.$refs.createBankAccountForm && this.$refs.createBankAccountForm.validate()) {
                this.loading = true;
                this.createPaymentRequest(data)
                    .then((response) => {
                        this.loading = false;
                        const user = {...this.user};
                        user.point -= data.point;
                        setUser(user);
                        this.userMutation(user);
                        this.createPaymentRequestSuccess = true;
                        this.overlay = true;
                        setTimeout(() => {
                            this.overlay = false;
                            this.$emit('payment-request-created', response.data);
                        }, 1000);
                    })
                    .catch(error => {
                        this.loading = false
                        this.overlay = true;
                        setTimeout(() => {
                            this.overlay = false;
                        }, 1000);
                    });
            }
        },
    },
}
</script>
