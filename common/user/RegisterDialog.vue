<template>
    <v-col :class="[`d-box-register p-0`]" v-if="isDialogFull">
        <v-dialog v-model="showLoginDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="`d-form-register-wrap`" :id="`dialog-form-register`">
                <v-card-title :id="'d-card-title-form-register'"
                              :class="[`headline d-header-box-register p-1 no-shadow`, 'text-white']">
                    <div class="d-flex align-items-center justify-content-between p-2 d-width-100">
                        <button @click="clickCloseDialog" class="d-flex pl-2 align-items-center">
                            <v-icon class="pr-3 text-white">arrow_back</v-icon>
                            登録
                        </button>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-form-register'" class="d-card-text-form-register p-0">
                    <v-col class="px-4 d-card-form-register p-0">
                        <v-card-text class="p-0">
                            <v-form ref="registerForm" v-model="valid" lazy-validation>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" class="p-0">

                                            <div class="d-label d-title-form-register font-weight-bold pb-1">メールアドレス
                                            </div>
                                            <v-text-field solo v-model="vModelEmail" :rules="loginEmailRules"
                                                          label="メールアドレスを入力"
                                                          :error-messages="errorMsgEmail" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" class="p-0">
                                            <div class="d-label d-title-form-register font-weight-bold pb-1">パスワード
                                            </div>
                                            <v-text-field solo v-model="vModelPassword"
                                                          :append-icon="showPassword ? 'remove_red_eye' : 'fa-eye-slash d-font-size-19 d-color-eye'"
                                                          :rules="[rules.required, rules.min, rules.max]"
                                                          :type="showPassword ? 'text' : 'password'"
                                                          name="inputPwd"
                                                          ref="password"
                                                          label="パスワードを入力"
                                                          :error-messages="errorMsgPassword"
                                                          hint="8文字以上16文字以内(文字と数字)で入力してください。"
                                                          @click:append="showPassword = !showPassword"></v-text-field>
                                        </v-col>

                                        <v-col cols="12" class="p-0">
                                            <div class="d-label d-title-form-register font-weight-bold pb-1">確認パスワード
                                            </div>
                                            <v-text-field solo v-model="vModelConfirmPassword"
                                                          :append-icon="showPasswordConfirm ? 'remove_red_eye' : 'fa-eye-slash d-font-size-19 d-color-eye'"
                                                          :rules="confirmPasswordRules.concat(passwordConfirmationRule)"
                                                          :type="showPasswordConfirm ? 'text' : 'password'"
                                                          name="inputPwdConfirm"
                                                          label="確認パスワードを入力"
                                                          :error-messages="errorMsgConfirmPassword"
                                                          :v-validate="'required|confirmed:password'"
                                                          hint="8文字以上16文字以内(文字と数字)で入力してください。"
                                                          @click:append="showPasswordConfirm = !showPasswordConfirm"></v-text-field>
                                        </v-col>
                                        <v-col class="d-flex" cols="12" xsm="12">
                                        <span v-if="errorRegisterMessage"
                                              style="color: #dc3545; font-size: 80%;">{{ errorRegisterMessage }}</span>
                                        </v-col>

                                        <v-spacer></v-spacer>

                                        <v-col class="d-flex" cols="12" align-end>
                                            <v-btn type="submit" x-large block :disabled="!valid"
                                                   class="d-action-register"
                                                   @click="validateActRegister">
                                                登録
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-form>
                            <div class="d-flex d-box-link-register" cols="12">
                                <div role="button" @click="goToLoginByEmail" class="v-btn">会員の方はこちら</div>
                            </div>
                        </v-card-text>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-col>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";

export default {
    data: function () {
        return {
            valid: true,
            verify: "",
            vModelPassword: "",
            vModelConfirmPassword: "",
            vModelEmail: "",
            loginEmailRules: [
                v => !!v || "必須項目に入力してください。",
                v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "メールアドレスの形式が正しくありません。"
            ],
            showPassword: false,
            showPasswordConfirm: false,
            rules: {
                required: value => !!value || "パスワードを入力してください。",
                min: v => (v && v.length >= 8) || "8文字以上16文字以内(文字と数字)で入力してください。",
                max: v => (v && v.length <= 17) || "8文字以上16文字以内(文字と数字)で入力してください。",
                // regex: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#^$!%*?&()])[A-Za-z\d@#^$!%*?&()]{8,}/.test(v) || "8文字以上16文字以内(文字と数字)で入力してください。"
            },
            confirmPasswordRules: [v => !!v || "必須項目に入力してください。"]
        }
    },
    props: {
        className: {
            type: String,
            defaultValue: ""
        },
        isDialogFull: {
            type: Boolean,
            required: true
        },
    },
    model: {
      event: ["emitShowLogin"]
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            isRegisterWithEmail: state => state.user.isRegisterWithEmail,
            registerFailure: state => state.user.registerFailure,

        }),
        ...mapGetters({
            isRegisterWithEmail: "isRegisterWithEmail",
            registerFailure: "registerFailure",
            referrerCode: 'referrerCode',
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        passwordConfirmationRule() {
            return () => this.vModelPassword === this.vModelConfirmPassword || "新パスワードと再入力パスワードが一致しません。";
        },
        showLoginDialog: function () {
            return !!this.isRegisterWithEmail
        },
        errorMsgEmail: function () {
            return _.has(this.registerFailure, "message.email") ? this.registerFailure.message.email[0] : ""
        },
        errorMsgPassword: function () {
            return _.has(this.registerFailure, "message.password") ? this.registerFailure.message.password[0] : ""
        },
        errorMsgConfirmPassword: function () {
            return _.has(this.registerFailure, "message.confirm_password") ? this.registerFailure.message.confirm_password[0] : ""
        },
        errorRegisterMessage: function () {
            return this.registerFailure && _.isString(this.registerFailure) ? this.registerFailure : ""
        }
    },
    watch: {
        vModelEmail: function (newData, oldData) {
            this.valid = true
        }
    },
    methods: {
        clickCloseDialog: function () {
            this.$store.dispatch('isRegisterWithEmailDispatch', false);
        },
        validateActRegister(event) {
            event.preventDefault();
            if (this.$refs.registerForm && this.$refs.registerForm.validate()) {
                // submit form to server/API here...

                this.$store.dispatch('registerByEmailDispatch', {
                    email: this.vModelEmail,
                    password: this.vModelPassword,
                    password_confirmation: this.vModelConfirmPassword,
                    ref: this.referrerCode,
                });
            }
        },
        reset() {
            this.$refs.form.reset();
        },
        resetValidation() {
            this.$refs.form.resetValidation();
        },
        goToLoginByEmail: function () {
            this.$emit("emitShowLogin", {type: "show_login_email"})
        }
    }
}
</script>

<style lang="scss">
.v-application {
    .d-color-eye.error--text,
    .v-icon.error--text {
        color: rgba(0, 0, 0, .54) !important;
    }

    .v-messages__message {
        line-height: 15px;
    }
}
</style>
