<template>
    <v-col :class="[`d-box-fom-login p-0`]" v-if="isDialogFull">
        <v-dialog v-model="showLoginDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="`d-form-forgot-pwd-wrap`" :id="`dialog-forgot-pwd`">
                <v-card-title :id="'d-card-title-forgot-pwd'"
                              :class="[`headline d-header-box-forgot-pwd p-1 d-width-100 d-header-border-width-3`, 'd-border-bottom']">
                    <div class="d-flex align-items-center d-custom-header d-width-100 card-header-top">
                        <button v-on:click="goBackToLogin">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">パスワード再設定</div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-forgot-pwd'" class="d-card-text-forgot-pwd p-0">
                    <v-form ref="forgotPwdForm" v-model="valid" lazy-validation>
                        <div class="d-box-forgot-pwd">
                            <v-col class="pb-1">
                                <div class="font-weight-bold">有効なメールアドレスを入力してください</div>
                                <v-text-field class="p-0 pt-2 pb-2" v-model="vModelForgotEmail" solo label="メールアドレスを入力"
                                              :rules="emailRules" clearable></v-text-field>

                                <div>「パスワード再設定ページURL」を記載したメールをお送りいたします。</div>
                            </v-col>
                        </div>

                        <div class="d-action-send-email">
                            <v-sheet class="d-action-send-email-pwd d-width-100 fixed-bottom position-absolute">
                                <v-col>
                                    <v-btn type="submit" :disabled="!valid" large block outlined @click="validateActForgotPwd">送信
                                    </v-btn>
                                </v-col>
                            </v-sheet>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <ForgotPwdSendEmailDialog v-if="isSendEmailForForgotPwd" :isDialogFull="isSendEmailForForgotPwd"
                                  :email="vModelForgotEmail"
                                  :funcCallbackEventClose="clickEventClose"/>
    </v-col>
</template>

<script>

import ForgotPwdSendEmailDialog from "./ForgotPwdSendEmailDialog";

export default {
    data: function () {
        return {
            valid: true,
            vModelForgotEmail: "",
            isSendEmailForForgotPwd: false,
            emailRules: [
                v => !!v || "必須項目に入力してください。",
                v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "メールアドレスの形式が正しくありません。"
            ],
        }
    },
    props: {
        isDialogFull: {
            type: Boolean,
            required: true
        },
        funcCallbackClose: {
            type: Function,
            required: true
        }
    },
    components: {
        ForgotPwdSendEmailDialog
    },
    computed: {
        showLoginDialog: function () {
            return !!this.isDialogFull
        }
    },
    methods: {
        goBackToLogin: function () {
            this.funcCallbackClose(false);
        },
        clickEventClose: function () {
            this.vModelForgotEmail = ""
            this.isSendEmailForForgotPwd = false
        },
        validateActForgotPwd(event) {
            event.preventDefault();
            if (this.$refs.forgotPwdForm && this.$refs.forgotPwdForm.validate()) {
                this.isSendEmailForForgotPwd = true
                // submit form to server/API here...
                this.$store.dispatch('forgotPasswordSendEmailDispatch', {
                    email: this.vModelForgotEmail
                });
            }
        },
    }
}
</script>
