<template>
    <div :class="`app-content-box`">
        <div class="d-reset-pwd-wrapper d-dialog d-dialog-show-fullscreen">
            <v-col :class="`height-vh-100 d-reset-pwd-wrap p-0`">
                <v-card-title :id="'d-card-title-form-login'"
                              :class="[`headline d-header-box-reset-pwd p-0 d-width-100 d-header-border-width-3`, 'd-border-bottom']">
                    <div class="d-flex align-items-center d-custom-header d-width-100 card-header-top">
                        <button v-on:click="goBackToLogin">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">パスワード再設定</div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-form-login'" class="d-flex d-card-text-form-login p-0">
                    <v-form ref="resetPwdForm" v-model="valid" lazy-validation class="d-width-100">
                        <div class="d-box-form-login">
                            <v-col class="pb-1">
                                <div class="font-weight-bold">新しいパスワードを入力</div>
                                <v-text-field v-model="vModelPassword" solo label="メールアドレスを入力"
                                              :append-icon="showPassword ? 'remove_red_eye' : 'fa-eye-slash d-font-size-19 d-color-eye'"
                                              :rules="[rules.required, rules.min, rules.max]"
                                              :type="showPassword ? 'text' : 'password'"
                                              hint="8文字以上16文字以内(文字と数字)で入力してください。"
                                              @click:append="showPassword = !showPassword"/>
                            </v-col>
                            <v-col class="pt-0">
                                <div class="font-weight-bold">新しいパスワードを入力 ( 確認用)</div>
                                <v-text-field v-model="vModelConfirmPassword" solo label="メールアドレスを入力"
                                              :v-validate="'required|confirmed:password'"
                                              :append-icon="showPasswordConfirm ? 'remove_red_eye' : 'fa-eye-slash d-font-size-19 d-color-eye'"
                                              :rules="confirmPasswordRules.concat(passwordConfirmationRule)"
                                              :type="showPasswordConfirm ? 'text' : 'password'"
                                              hint="8～16半角文字(文字と数字)"
                                              @click:append="showPasswordConfirm = !showPasswordConfirm"/>
                            </v-col>
                        </div>
                        <v-col class="d-flex" cols="12" xsm="12">
                            <span v-if="errorMsgFail" style="color: #dc3545; font-size: 80%;">{{ errorMsgFail }}</span>
                        </v-col>
                    </v-form>

                    <div class="d-action-reset-pwd-wrap">
                        <v-sheet class="d-action-reset-pwd d-width-100 fixed-bottom position-absolute">
                            <v-col>
                                <v-btn largel block outlined :disabled="!valid" @click="validateActResetPwd">再設定</v-btn>
                            </v-col>
                        </v-sheet>
                    </div>
                </v-card-text>
            </v-col>
        </div>

    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import C from '../utils/constants'
import IconSvgComponent from "../common/IconSvgComponent";
import LoginDialog from "../common/user/LoginDialog";
import router from "../router";

export default {
    data: function () {
        return {
            email: this.$route.query.email,
            token: this.$route.params.token,
            valid: true,
            vModelPassword: "",
            vModelConfirmPassword: "",
            showPassword: false,
            showPasswordConfirm: false,
            rules: {
                required: value => !!value || "必須項目に入力してください。",
                min: v => (v && v.length >= 8) || "8文字以上16文字以内(文字と数字)で入力してください。",
                max: v => (v && v.length <= 17) || "8文字以上16文字以内(文字と数字)で入力してください。",
                // regex: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#^$!%*?&])[A-Za-z\d@#^$!%*?&]{8,}/.test(v) || "8文字以上16文字以内(大文字、小文字、数字、記号)で入力してください。"
            },
            confirmPasswordRules: [v => !!v || "必須項目に入力してください。"],
        }
    },
    props: {
        typeHeader: String,
        funcGotoBack: {
            type: Function,
            defaultValue: null
        }
    },

    components: {
        IconSvgComponent,
        LoginDialog
    },
    mounted() {
        this.$store.dispatch('logoutDispatch', {isRedirect: false});
    },
    methods: {
        goBackToLogin: function (event) {
            this.$router.push('/login')
        },
        validateActResetPwd() {
            if (this.$refs.resetPwdForm && this.$refs.resetPwdForm.validate()) {
                // submit form to server/API here...

                this.$store.dispatch('resetPasswordViaEmailTokenDispatch', {
                    email: this.email,
                    token: this.token,
                    password: this.vModelPassword,
                    password_confirmation: this.vModelConfirmPassword
                });
            }
        },
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            errorFailureAlert: state => state.user.errorFailureAlert,
            resetPwdByEmailSuccess: state => state.user.resetPwdByEmailSuccess
        }),
        ...mapGetters({
            errorFailureAlert: "errorFailureAlert",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        passwordConfirmationRule() {
            return () => this.vModelPassword === this.vModelConfirmPassword || "新パスワードと再入力パスワードが一致しません。";
        },
        errorMsgFail: function () {
            return _.has(this.errorFailureAlert, "message") && _.isString(this.errorFailureAlert.message)
                ? this.errorFailureAlert.message : ""
        }
    },
    watch: {
        resetPwdByEmailSuccess: function (newValue, oldValue) {
            if (!!newValue) {
                router.replace({name: "Login"})
            }
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
