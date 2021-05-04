<template>
    <div :class="[`d-dialog-qrcode p-0`]" v-if="showMyQRCodeDialog">

        <v-dialog v-if="isShowDialog" v-model="showMyQRCodeDialog"
                  :content-class="`d-dialog-show-fullscreen d-my-qrcode-wrapper`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="[`d-my-qrcode`]" :id="`dialog-qrcode-cast`">
                <v-card-title :id="'d-card-title-my-qrcode'"
                              :class="[`headline d-header-box-my-qrcode p-0`, 'd-border-bottom']">
                    <div class="card-header-top">
                        <button v-on:click="clickCallbackEventDataClose">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">{{ btnTitle }}</div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-qrcode'" :class="`p-0`">
                    <v-sheet class="p-3 pt-7">
                        <div class="text-center">
                            <p><b>仲間と一緒にQueenを使おう！</b></p>
<!--                            <p>-->
<!--                                お友達を紹介すると10,000Pプレゼント！素敵な時間を無料に楽しめます-->
<!--                            </p>-->
                        </div>

                        <v-col :class="`pt-13`">
                            <div class="d-box-qrcode text-center" id="qrcode" ref="qrcode">
                            </div>
                            <div class="text-center mt-2">
                                <p class="mb-0"><b>{{ user.name }}</b></p>
                                <p>ID: {{ user.id }}</p>
                            </div>
                        </v-col>
                        <v-col class="mt-6 p-0">
                            <v-btn block large :class="`btn-base`" @click="doCopy">
                                <IconSvgComponent :class="`mr-2 mb-1`" :type="'link'"/>
                                URLコピー
                            </v-btn>

                        </v-col>
                        <v-col class="mt-4 pl-0 pr-0">
                            <span>
                                ※正規の方法による紹介と認められない場合にクーポンの取り消しやアカウント停止処置を取らせていただきます。
                            </span>
                        </v-col>
                    </v-sheet>
                </v-card-text>
            </v-card>
            <v-overlay
                v-if="overlay"
                :absolute="absolute">
                <v-btn
                    color="success lighten-2">
                    <p style="color: white; padding-top: 15px">コピーしました</p>
                </v-btn>
            </v-overlay>
        </v-dialog>

    </div>
</template>

<script>

import C from "../../utils/constants";
import {mapGetters, mapState} from "vuex";
import IconSvgComponent from "../../common/IconSvgComponent";
import * as QRCode from 'easyqrcodejs'
import dynamicUerProfile from "../../mixin/dynamicUerProfile";


export default {
    mixins: [
        dynamicUerProfile,
    ],
    data: function () {
        return {
            absolute: true,
            overlay: false,
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
    mounted: function () {
        if (this.avatarPath !== '') {
            new QRCode(this.$refs.qrcode,
                {
                    width: 250,
                    height: 250,
                    text: this.profileUrl,
                    logo: this.avatarPath,
                    colorDark: "#000000",
                    logoWidth: 45,
                    logoHeight: 45,
                });
        } else {
            new QRCode(this.$refs.qrcode, {
                width: 250,
                height: 250,
                text: this.profileUrl,
            });
        }
    },
    components: {
        IconSvgComponent,
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            isShowMyQRCodeDialog: state => state.user.isShowMyQRCodeDialog,
            user: state => state.user.user,
            role: state => state.user.role
            // tabActive: state => state.main.tabActive,
        }),
        ...mapGetters({
            isShowMyQRCodeDialog: "isShowMyQRCodeDialog",
            // currentType: "currentType",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showMyQRCodeDialog: function () {
            return !!this.isShowMyQRCodeDialog
        },
        userId: function () {
            return "userId"
        },
        profileUrl: function () {
            return `${window.location.origin}/${this.constant.PATH_PROFILE_VIEW}/${this.role}/${this.user.referer_code}?ref=${this.user.referer_code}`.toLowerCase()
        },
        avatarPath: function () {
            return (this.user.avatar !== null && this.user.avatar !== '')
                ? `${window.location.origin}/${this.user.avatar}`
                : `${window.location.origin}/images/avatar-default.png`;
        }
    },
    methods: {
        clickCallbackEventDataClose: function () {
            this.$store.dispatch('isShowMyQRCodeDialogDispatch', false);
        },
        doCopy: async function () {
            this.overlay = true;

            if (navigator.clipboard !== undefined) { //Chrome
                await navigator.clipboard.writeText(this.profileUrl).then(function () {
                    console.log('Async: Copying to clipboard was successful!');
                }, function (err) {
                    console.error('Async: Could not copy text: ', err);
                });
            } else {
                this.copyToClipboardByString(this.profileUrl);
            }

            setTimeout(() => {
                this.overlay = false;
            }, 1000);
        },
    }
}
</script>
