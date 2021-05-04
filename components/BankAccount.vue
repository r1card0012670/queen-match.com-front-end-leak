<template>
    <div>
        <v-dialog v-model="show"
                  :content-class="`d-dialog-show-fullscreen d-payment-info-wrapper`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
            <v-card :class="[`d-my-qrcode`]" :id="`dialog-payment-info`">
                <v-card-title :id="'d-card-title-payment-info'"
                              :class="[`headline d-header-box-payment-info p-0`, 'd-border-bottom']">
                    <div class="card-header-top">
                        <button @click="closeDialog">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">支払要求</div>
                    </div>
                </v-card-title>
                <v-card-text v-if="loading">
                </v-card-text>
                <template v-else>
                    <v-card-text :id="'d-card-text-payment-info'" v-if="bankAccount"
                                 :class="`d-card-text-payment-info`">
                        <v-card-text class="d-flex justify-content-between pr-0 pl-0 d-card-item">
                            <v-sheet class="d-inline-flex card-body p-0" role="button">
                                <v-list-item-content>
                                    <v-list-item-title>{{ bankAccount.bank_name }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ bankAccount.account_number }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-sheet>
                        </v-card-text>
                    </v-card-text>
                    <v-card-text :class="`d-card-text-payment-info p-0`">
                        <v-col class="p-0 box-position-footer">
                            <v-btn block class="btn-base"
                                   v-if="!bankAccount && !loading"
                                   @click="showBankAccountCreateDialog = true"
                            >
                                銀行口座情報を入力
                            </v-btn>
                            <v-btn block class="btn-base"
                                   v-if="bankAccount && !loading"
                                   @click="showPaymentRequestDialog = true"
                            >
                                支払要求
                            </v-btn>
                            <v-btn block class="btn-base mt-3" v-if="bankAccount && !loading"
                                   @click="showPaymentHistory = true"
                            >
                                支払歴史
                            </v-btn>
                        </v-col>
                    </v-card-text>
                </template>
            </v-card>
        </v-dialog>
        <bank-account-create v-if="showBankAccountCreateDialog"
                             @close="showBankAccountCreateDialog = false"
                             @bank-account-created="bankAccountCreated"
        >
        </bank-account-create>
        <bank-account-payment-request v-if="showPaymentRequestDialog"
                                      @close="showPaymentRequestDialog = false"
                                      @payment-request-created="paymentRequestCreated"
        >
        </bank-account-payment-request>
        <bank-account-payment-history v-if="showPaymentHistory"
                                      @close="showPaymentHistory = false"
        >
        </bank-account-payment-history>
        <loading :active.sync="loading"></loading>
    </div>
</template>
<script>
import Loading from "vue-loading-overlay";
import {mapActions} from 'vuex';
import BankAccountCreate from "./BankAccountCreate";
import BankAccountPaymentRequest from "./BankAccountPaymentRequest";
import BankAccountPaymentHistory from "./BankAccountPaymentHistory";

import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    components: {
        Loading,
        BankAccountCreate,
        BankAccountPaymentRequest,
        BankAccountPaymentHistory,
    },
    data() {
        return {
            show: true,
            bankAccount: null,
            loading: true,
            showBankAccountCreateDialog: false,
            showPaymentRequestDialog: false,
            showPaymentHistory: false,
        }
    },
    methods: {
        ...mapActions({
            getBankAccount: 'getBankAccount',
        }),
        closeDialog: function () {
            this.$emit('close');
        },
        bankAccountCreated: function (data) {
            this.bankAccount = data;
            this.showBankAccountCreateDialog = false;
        },
        paymentRequestCreated: function () {
            this.showPaymentRequestDialog = false;
        },
    },
    created() {
        this.getBankAccount()
            .then(response => {
                this.bankAccount = response.data;
                this.loading = false;
            });
    },
}
</script>
