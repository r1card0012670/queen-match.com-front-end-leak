<template>
    <div :class="[`d-dialog-setting-profile p-0`]" v-if="showSettingProfileDialog">

        <v-dialog v-if="isShowDialog" v-model="showSettingProfileDialog" :content-class="`d-dialog-show-fullscreen d-setting-profile-wrapper`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="[`d-my-qrcode dialog-setting-profile`]" :id="`dialog-setting-profile`">
                <v-card-title :id="'d-card-title-setting-profile'"
                              :class="[`headline d-header-box-setting-profile p-0`, 'd-border-bottom']">
                    <div class="card-header-top">
                        <button v-on:click="clickCallbackEventDataClose">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">{{ btnTitle }}</div>
                    </div>
                </v-card-title>
                <v-card-text :id="'d-card-text-setting-profile'" :class="`p-0 d-card-text-setting-profile`">
                    <v-col class="col-12 d-setting-profile-item" role="button" @click="isShowDetailSettingProfileDialog = true">
                        <span class="font-weight-bold">通知設定 </span>
                    </v-col>
                    <v-col class="col-12 d-setting-profile-item" role="button">
                        <span class="font-weight-bold">ヘルプ </span>
                    </v-col>
                    <v-col class="col-12 p-0 mt-5">
                        <div class="d-flex justify-space-between">
                            <v-btn block @click="clickActionLogout" class="v-btn-logout">
                                ログアウト
                            </v-btn>
                        </div>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-dialog>
        <DetailSettingProfileDialog v-if="isShowDetailSettingProfileDialog" :isShowDialog="isShowDetailSettingProfileDialog"
                                    :funcDetailSettingProfileCallBackClose="funcDetailSettingProfileCallBackClose"/>
    </div>
</template>

<script>

import C from "../../utils/constants";
import {mapGetters, mapState} from "vuex";
import DetailSettingProfileDialog from "./DetailSettingProfileDialog";

export default {
    data: function () {
        return {
            isShowDetailSettingProfileDialog: false
        }
    },
    props: {
        btnTitle: {
            type: String,
            defaultValue: ""
        },
        titleName: {
            type: String,
            defaultValue: ""
        },
        classList: {
            type: String,
            defaultValue: ""
        },
        isShowDialog: {
            type: Boolean,
            required: true
        },
        funcCallbackEventData: {
            type: Function,
            required: true
        },
    },
    components: {
        DetailSettingProfileDialog
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            isSettingProfile: state => state.user.isSettingProfile,
        }),
        ...mapGetters({
            isSettingProfile: "isSettingProfile",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showSettingProfileDialog: function () {
            return !!this.isSettingProfile
        },
        userId: function () {
            return "userId"
        }
    },
    methods: {
        clickCallbackEventDataClose: function () {
            this.$store.dispatch('isSettingProfileDialogDispatch', false);
        },
        clickActionLogout: function (event) {
            this.$store.dispatch('logoutDispatch', {});
        },
        funcDetailSettingProfileCallBackClose: function () {
            this.isShowDetailSettingProfileDialog = false
        },
    }
}
</script>
