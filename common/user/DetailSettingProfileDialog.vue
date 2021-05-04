<template>
    <div :class="[`d-dialog-detail-setting-profile p-0`]" v-if="showDetailSettingProfileDialog">
        <v-dialog v-if="isShowDialog" v-model="showDetailSettingProfileDialog" :content-class="`d-dialog-show-fullscreen d-setting-profile-wrapper`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="[`d-my-qrcode dialog-detail-setting-profile`]" :id="`dialog-detail-setting-profile`">
                <v-card-title :id="'d-card-title-detail-setting-profile'"
                              :class="[`headline d-header-box-detail-setting-profile p-0`, 'd-border-bottom']">
                    <div class="card-header-top">
                        <button v-on:click="clickDetailSettingProfileCallbackClose">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">{{ btnTitle }}</div>
                    </div>
                </v-card-title>
                <v-card-text :id="'d-card-text-setting-profile'" :class="`p-0 d-card-text-setting-profile`">
                    <v-sheet class="pt-0">
                        <v-col class="col-12 d-setting-profile-item d-flex justify-space-between">
                            <div class="v-sheet font-weight-bold">通知設定</div>
                            <div class="d-inline-flex">
                                <v-switch class="p-0 m-0" v-model="vModelData" @change="updateStatusNoti"></v-switch>
                            </div>
                        </v-col>
                    </v-sheet>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>


<script>

import C from "../../utils/constants";
import {mapState} from "vuex";

export default {
    data: function () {
        return {
            vModelData: '',
        }
    },
    props: {
        classList: {
            type: String,
            defaultValue: ""
        },
        isShowDialog: {
            type: Boolean,
            required: true
        },
        funcDetailSettingProfileCallBackClose: {
            type: Function,
            required: true
        },
    },
    components: {
    },
    computed: {
        ...mapState({
            user: state => state.user.user,
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        btnTitle: function () {
            return "通知設定"
        },
        titleName: function () {
            return ""
        },
        showDetailSettingProfileDialog: function () {
            return !!this.isShowDialog
        },
    },
    created() {
        this.vModelData = this.user.block_noti == 1 ? true : false;
    },
    methods: {
        clickDetailSettingProfileCallbackClose: function () {
            this.funcDetailSettingProfileCallBackClose(false);
        },
        updateStatusNoti: function () {
            let data = {
                block_noti: this.vModelData === true ? 1 : 0,
                user_id: this.user.id
            }
            this.$store.dispatch('updateStatusNotiDispatch', data);
        }
    }
}
</script>
