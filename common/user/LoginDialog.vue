<template>
    <v-col :class="[`d-box-fom-login p-0`]" v-if="isLoginWithEmail">
        <v-dialog v-model="showLoginDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="`d-form-login-email`" :id="`dialog-form-login-email`">
                <v-card-title :id="'d-card-title-form-login'"
                              :class="[`headline d-header-box-feed-detail p-1 no-shadow`, 'text-white']">
                    <div class="d-flex align-items-center justify-content-between p-2 d-width-100">
                        <button v-on:click="clickCloseDialog" class="d-flex pl-2 align-items-center">
                            <v-icon class="pr-3 text-white">arrow_back</v-icon>
                            ログイン
                        </button>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-form-login'" class="d-card-text-form-login p-0">
                    <v-col class="px-4 d-card-form-login">
                        <v-card-text class="p-0">
                            <v-form ref="loginForm" v-model="valid" lazy-validation>
                                <v-container>
                                <v-row>
                                    <v-col cols="12" class="p-0">
                                        <div class="d-label d-title-form-email font-weight-bold pb-1">メールアドレス</div>
                                        <v-text-field solo v-model="vModelEmail" :rules="loginEmailRules"
                                                      label="メールアドレスを入力"
                                                      required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="p-0">
                                        <div class="d-flex d-title-form-pwd justify-content-between pb-1">
                                            <span class="font-weight-bold d-password-label">パスワード</span>
                                            <span class="d-inline-flex d-action-forgot-pwd" role="button"
                                                 @click="clickShowForgotPassword">パスワードを忘れた方はこちら
                                            </span>
                                        </div>
                                        <v-text-field solo v-model="vModelPassword"
                                                      :append-icon="showPassword ? 'remove_red_eye' : 'fa-eye-slash d-font-size-19 d-color-eye'"
                                                      :rules="[rules.required]"
                                                      :type="showPassword ? 'text' : 'password'"
                                                      name="input-10-1"
                                                      label="パスワードを入力"
                                                      hint="必須項目に入力してください。"
                                                      @click:append="showPassword = !showPassword"></v-text-field>


                                    </v-col>
                                    <v-col class="d-flex pl-0 pr-0 pt-0" cols="12" xsm="12">
                                        <span v-if="errorLoginMessage" style="color: #dc3545; font-size: 80%;">{{ errorLoginMessage }}</span>
                                        <span v-else-if="alert && alert.length" style="color: #41cf3c; font-size: 80%;">{{ alert }}</span>
                                    </v-col>

                                    <v-spacer></v-spacer>
                                    <v-col class="d-flex p-0" cols="12" align-end>
                                        <v-btn type="submit" x-large block :disabled="!valid" class="d-action-login"
                                               @click="validate">
                                            ログイン
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                </v-container>
                            </v-form>
                            <div class="d-flex d-box-link-register flex-wrap" cols="12">
                                <div
                                    class="v-btn v-btn--block v-btn--plain theme--light v-size--large d-flex flex-wrap justify-content-between">
                                    <span class="register-link" @click="showRegisterCastForm">キャスト登録</span>
                                    <span class="register-link" @click="clickRegisterWithEmail">ユーザー登録</span>
                                </div>

                            </div>
                        </v-card-text>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-dialog>

        <ForgotPasswordDialog :isDialogFull="isDialogFullForgotPwd" :funcCallbackClose="eventCallbackForgotPwdClose"/>

        <RegisterDialog @emitShowLogin="eventFuncLogin" v-if="isRegisterWithEmail" :isDialogFull="isRegisterWithEmail"/>

        <register-cast v-if="showRegisterCast" @close="showRegisterCast = false"></register-cast>
    </v-col>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import RegisterDialog from "./RegisterDialog";
import RegisterCast from "../../components/RegisterCast";

export default {
    data: () => ({
        isDialogFullForgotPwd: false,
        isDialogFullRegister: false,
        valid: true,
        vModelEmail: "",
        vModelPassword: "",
        verify: "",
        loginEmailRules: [
            v => !!v || "必須項目に入力してください。",
            v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "メールアドレスの形式が正しくありません。"
        ],

        showPassword: false,
        rules: {
            required: value => !!value || "必須項目に入力してください。",
            min: v => (v && v.length >= 8) || "8文字以上16文字以内(文字と数字)で入力してください。"
        },
        showRegisterCast: false,
    }),
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
        ForgotPasswordDialog,
        RegisterDialog,
        RegisterCast
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            isRegisterWithEmail: state => state.user.isRegisterWithEmail,
            isLoginWithEmail: state => state.user.isLoginWithEmail,
            errorLoginMessage: state => state.user.errorLoginMessage,
            alert: state => state.user.alert,
        }),
        ...mapGetters({
            isLoginWithEmail: "isLoginWithEmail",
            isRegisterWithEmail: "isRegisterWithEmail",
            errorLoginMessage: "errorLoginMessage",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showLoginDialog: function () {
            return !!this.isShowDialog
        },
    },
    methods: {
        clickCloseDialog: function () {
            this.$store.dispatch('isLoginWithEmailDispatch', false);
        },
        validate(event) {
            event.preventDefault();

            let self = this;
            if (self.$refs.loginForm.validate()) {
                this.$store.dispatch('loginDispatch', {email: self.vModelEmail, password: self.vModelPassword});
            }
        },
        reset() {
            this.$refs.form.reset();
        },
        resetValidation() {
            this.$refs.form.resetValidation();
        },
        clickShowForgotPassword: function () {
            this.isDialogFullForgotPwd = true;
        },
        eventCallbackForgotPwdClose: function () {
            this.isDialogFullForgotPwd = false;
        },
        clickRegisterWithEmail: function () {
            this.$store.dispatch('isRegisterWithEmailDispatch', true);
        },
        eventFuncLogin: function (data) {
            if (_.has(data, "type") && data.type === "show_login_email") {
                this.$store.dispatch('isRegisterWithEmailDispatch', false);
            }
        },
        showRegisterCastForm: function () {
            this.showRegisterCast = true;
        },
    },
    destroyed() {
        this.$store.commit("alertMutation", "")
    }
}
</script>

<style lang="scss">
.v-application {
    .v-icon.primary--text,
    .d-color-eye.error--text,
    .v-icon.error--text {
        color: rgba(0, 0, 0, .54) !important;
    }

    .v-messages__message {
        line-height: 15px;
    }
}

.register-link {
    color: #FBBD7C;
    text-decoration: none;
    cursor: pointer;
}

.d-password-label {
    flex: 1 1;
}
</style>
