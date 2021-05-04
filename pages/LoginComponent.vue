<template>
    <div :class="`app-content-login-box`">
        <v-bottom-sheet v-model="isShow" :content-class="'d-bg-login'" :attach="true" persistent scrollable>
            <v-col class="justify-content-center text-center d-login-wrap d-custom-bottom-nav">
                <v-btn class="justify-start d-bg-login-email pl-11" large outlined block left
                       @click="clickRegisterWithEmail">
                    <v-icon left class="pr-5 d-custom-pd" size="28">mail_outline</v-icon>
                    新規ユーザー登録はこちら
                </v-btn>

                <LineLoginButton :clientId="clientId" :clientSecret="clientSecret" :callbackUri="callbackUri"/>

                <v-btn plain color="white" class="" v-on:click="clickLoginWithEmail">
                    ログイン
                </v-btn>
            </v-col>
        </v-bottom-sheet>

        <LoginDialog v-if="isLoginWithEmail" :isShowDialog="isLoginWithEmail"/>

        <RegisterDialog @emitShowLogin="eventFunc" :isDialogFull="isRegisterWithEmail" v-if="isRegisterWithEmail"/>

    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import C from '../utils/constants'
import LoginDialog from "../common/user/LoginDialog";
import RegisterDialog from "../common/user/RegisterDialog";
import {CLIENT_DOMAIN_SECRET, CLIENT_ID, CLIENT_REDIRECT, isLoggedIn} from "../utils/auth";
import LineLoginButton from './../components/LineLoginButton'

export default {
    props: {},
    data: function () {
        return {
            clientId: '',
            clientSecret: '',
            callbackUri: '',
            isShow: false
        }
    },
    components: {
        LoginDialog,
        RegisterDialog,
        LineLoginButton
    },
    mounted() {
        if (!!isLoggedIn()) {
            this.$router.replace("/home");
            this.$store.dispatch('activeNavBottomDispatch', true);
        } else {
            this.$store.dispatch('activeNavBottomDispatch', false);
        }
        this.isShow = true

        if (!!this.resetPwdByEmailSuccess) {
            this.isShow = false
            this.$store.commit("isLoginWithEmailMutation", true);
        }
    },
    methods: {
        clickLoginWithEmail: function (event) {
            this.$store.dispatch('isLoginWithEmailDispatch', true);
        },
        clickRegisterWithEmail: function () {
            this.$store.dispatch('isRegisterWithEmailDispatch', true);
        },
        eventFunc: function (data) {
            if (_.has(data, "type") && data.type === "show_login_email") {
                this.$store.dispatch('isRegisterWithEmailDispatch', false);
                this.isShow = false
                this.$store.commit("isLoginWithEmailMutation", true);
            }
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // isLoggedIn: state => state.user.isLoggedIn,
            isLoginWithEmail: state => state.user.isLoginWithEmail,
            isRegisterWithEmail: state => state.user.isRegisterWithEmail,
            resetPwdByEmailSuccess: state => state.user.resetPwdByEmailSuccess,
        }),
        ...mapGetters({
            isLoginWithEmail: "isLoginWithEmail",
            isRegisterWithEmail: "isRegisterWithEmail",
        }),
        constant: function () {
            return Object.assign({}, C)
        }
    },
    watch: {
        isLoginWithEmail: function (newData, oldData) {
            if (!newData) {
                this.isShow = true
            }
        },
        isRegisterWithEmail: function (newData, oldData) {
            if (!newData) {
                this.isShow = true
            }
        }
    },
    created() {
        this.clientId = CLIENT_ID;
        this.clientSecret = CLIENT_DOMAIN_SECRET
        this.callbackUri = CLIENT_REDIRECT
    },
    destroyed() {
        this.isShow = false
    }
}
</script>

<style lang="scss">
.v-btn__content .d-custom-pd {
    margin-left: -11px !important;
    margin-right: 8px !important;
}
</style>
