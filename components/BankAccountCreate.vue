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
                        <div class="d-title">銀行口座情報を入力</div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-detail-edit-card'" class="bg-grey mb-80">
                    <v-card-text class=" pr-0 pl-0 mt-2">
                        <v-form ref="createBankAccountForm" lazy-validation v-on:submit.prevent>
                            <v-sheet class="card-body p-0 bg-grey">
                                <v-col cols="12" class="p-0">
                                    <div class="d-label d-title-form-register pb-1">金融機関名</div>
                                    <v-text-field solo v-model="bankName" :rules="bankNameRules">
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" class="p-0">
                                    <div class="d-label d-title-form-register pb-1">支店名</div>
                                    <v-text-field solo v-model="branchName" :rules="branchNameRules">
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" class="p-0">
                                    <div class="d-label d-title-form-register pb-1">預金種別</div>
                                    <v-text-field solo v-model="accountType" :rules="accountTypeRules">
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" class="p-0">
                                    <div class="d-label d-title-form-register pb-1">口座番号</div>
                                    <v-text-field solo
                                                  v-model="accountNumber"
                                                  :rules="accountNumberRules"
                                    >
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" class="p-0">
                                    <div class="d-label d-title-form-register pb-1">口座名義</div>
                                    <v-text-field solo v-model="recipientName" :rules="recipientNameRules">
                                    </v-text-field>
                                </v-col>

                                <v-col class="col-12 p-0 box-position-footer">
                                    <v-btn type="submit" outlined block
                                           class="d-action-register btn-base"
                                           @click="submitBankAccount">
                                        追加する
                                    </v-btn>
                                </v-col>
                            </v-sheet>
                        </v-form>
                    </v-card-text>
                </v-card-text>
            </v-card>
        </v-dialog>
        <loading :active.sync="loading"></loading>
    </div>

</template>
<script>
import Loading from "vue-loading-overlay";
import {mapActions} from 'vuex';

import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    components: {
        Loading,
    },
    props: {},
    data() {
        return {
            show: true,
            loading: false,
            bankName: '',
            branchName: '',
            accountType: '',
            accountNumber: '',
            recipientName: '',
        }
    },
    computed: {
        accountNumberRules: function () {
            return [
                value => !!value || "必須",
                v => (v && v.length >= 11) || "11数字以上14数字以内で入力してください",
                v => (v && v.length <= 14) || "11数字以上14数字以内で入力してください",
                v => /^[0-9]*$/.test(v) || "11数字以上14数字以内で入力してください"
            ]
        },
        bankNameRules: function () {
            return [
                value => !!value || "必須",
            ]
        },
        branchNameRules: function () {
            return [
                value => !!value || "必須",
            ]
        },
        accountTypeRules: function () {
            return [
                value => !!value || "必須",
            ]
        },
        recipientNameRules: function () {
            return [
                value => !!value || "必須",
            ]
        },
    },
    methods: {
        ...mapActions({
            createBankAccount: 'createBankAccount',
        }),
        closeDialog: function () {
            this.$emit('close');
        },
        submitBankAccount: function () {
            const data = {
                bank_name: this.bankName,
                branch_name: this.branchName,
                account_type: this.accountType,
                account_number: this.accountNumber,
                recipient_name: this.recipientName,
            };
            if (this.$refs.createBankAccountForm && this.$refs.createBankAccountForm.validate()) {
                this.loading = true;
                this.createBankAccount(data)
                    .then((response) => {
                        this.loading = false;
                        this.$emit('bank-account-created', response.data);
                    })
                    .catch(error => {
                        console.log(error);
                        this.loading = false
                    });
            }
        }
    },
}
</script>
