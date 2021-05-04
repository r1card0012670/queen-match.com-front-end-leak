<template>
    <v-col :class="[`d-box-register p-0`]" v-if="isDialogFull">
        <v-dialog v-model="showLoginLineDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="`d-form-register-wrap`" :id="`dialog-form-register`">
                <v-card-title :id="'d-card-title-form-register'"
                              :class="[`headline d-header-box-register p-1`, 'text-white']">
                    <div class="d-flex align-items-center justify-content-between p-2 d-width-100 ">
                        <button @click="clickCloseLineDialog" class="d-flex pl-2">
                            <v-icon class="pr-2 text-white">arrow_back</v-icon>
                            ログイン
                        </button>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-form-register'" class="d-card-text-form-register p-0">
                    <v-col class="px-4 d-card-form-register">
                        <v-card-text>
                            <v-form ref="registerFormEmailLine" v-model="valid" lazy-validation>
                                <v-row>
                                    <v-col cols="12" class="p-0">
                                        <div class="d-title-form-register font-weight-bold pb-1">メールアドレス</div>
                                        <v-text-field solo v-model="vModelLoginEmailLine" :rules="loginEmailLineRules"
                                                      label="メールアドレスを入力"
                                                      :error-messages="errorMsgRegisterEmail"
                                                      required></v-text-field>
                                    </v-col>

                                    <v-col class="d-flex" cols="12" sm="6" xsm="12">
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col class="d-flex" cols="12" align-end>
                                        <v-btn type="submit" x-large block :disabled="!valid" class="d-action-register"
                                               @click="validateActRegister">
                                            登録
                                        </v-btn>
                                    </v-col>

                                    <v-col class="d-flex pt-7 justify-content-center" cols="12">
                                        <div class="text-center">会員の方はこちら</div>
                                    </v-col>
                                </v-row>
                            </v-form>
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
            vModelLoginEmailLine: "",
            loginEmailLineRules: [
                v => !!v || "必須項目に入力してください。",
                v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "メールアドレスの形式が正しくありません。"
            ],
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
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            isRegisterEmailLine: state => state.user.isRegisterEmailLine,
            registerCheckEmailLine: state => state.user.registerCheckEmailLine,
        }),
        ...mapGetters({
            isRegisterEmailLine: "isRegisterEmailLine",
            registerCheckEmailLine: "registerCheckEmailLine",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showLoginLineDialog: function () {
            return !!this.isRegisterEmailLine
        },
        errorMsgRegisterEmail: function () {
            if (_.has(this.registerCheckEmailLine, "isExist") && this.registerCheckEmailLine.isExist) {
                this.valid = false; // disable btn send data to server
                return "メールアドレスが既に存在しています。"
            }
            if (_.has(this.registerCheckEmailLine, "loginFailure.err.message")) {
                this.valid = false; // disable btn send data to server
                return this.registerCheckEmailLine.loginFailure.err.message.email[0]
            }

            return ""
        }
    },
    watch: {
        vModelLoginEmailLine: function (newData, oldData) {
            this.valid = true;
        }
    },
    methods: {
        clickCloseLineDialog: function () {
            this.$router.push("/login")
        },
        validateActRegister(event) {
            event.preventDefault();
            if (this.$refs.registerFormEmailLine && this.$refs.registerFormEmailLine.validate()) {
                // submit form to server/API here...
                this.$store.dispatch('checkAddRegisterEmailForLineDispatch', {email: this.vModelLoginEmailLine});
            }
        },
    }
}
</script>
