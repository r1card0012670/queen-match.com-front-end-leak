<template>
    <v-col :class="[`d-box-send-send-forgot-pwd p-0`]" v-if="isDialogFull">
        <v-dialog v-model="showLoginDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="`d-result-send-forgot-pwd-wrap`" :id="`dialog-send-forgot-pwd`">
                <v-card-title :id="'d-card-title-result-send-forgot-pwd'"
                              :class="[`headline d-header-box-result-send-forgot-pwd p-1 d-width-100 d-header-border-width-3`, 'd-border-bottom']">
                    <div class="d-flex align-items-center d-custom-header d-width-100 card-header-top">
                        <button v-on:click="funcCallbackEventClose">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">パスワード再設定</div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-result-send-forgot-pwd'" class="d-flex d-card-text-send-forgot-pwd p-0">
                    <div class="d-box-forgot-pwd-result text-center">
                        <svg width="169" height="169" viewBox="0 0 169 169" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <circle cx="76.5" cy="92.5" r="76" stroke="#B3B2B1"/>
                            <circle cx="76.5" cy="92.5" r="76" stroke="url(#paint0_linear)" stroke-opacity="0.75"/>
                            <path
                                d="M110.716 0.401123C108.306 1.12952 106.101 2.44238 104.276 4.26721L38.9172 69.6249C37.0562 71.486 35.7697 73.7074 35.0544 76.0651L98.105 63.4549L110.716 0.401123Z"
                                fill="#FBBD7C"/>
                            <path
                                d="M164.463 42.5138L126.216 4.26599C124.282 2.3335 121.922 0.978882 119.343 0.28125L105.827 67.8669C105.493 69.5369 104.187 70.8431 102.517 71.1771L34.9307 84.6947C35.6162 87.2128 36.9423 89.5924 38.9165 91.5667L42.2761 94.9263L26.235 110.967C24.5882 112.615 24.5882 115.286 26.2361 116.934C27.0601 117.757 28.1389 118.169 29.2189 118.169C30.2988 118.169 31.3777 117.757 32.2017 116.934L48.2428 100.893L55.0565 107.707L26.235 136.528C24.5882 138.175 24.5882 140.847 26.2361 142.494C27.0601 143.318 28.1389 143.73 29.2189 143.73C30.2988 143.73 31.3777 143.318 32.2017 142.494L61.0232 113.672L67.8369 120.487L51.7969 136.528C50.1489 138.175 50.1489 140.847 51.7969 142.494C52.6198 143.318 53.6997 143.73 54.7797 143.73C55.8596 143.73 56.9385 143.318 57.7625 142.494L73.8036 126.454L77.1632 129.813C80.0856 132.735 83.9813 134.344 88.1342 134.344C92.287 134.344 96.1839 132.735 99.1051 129.813L164.463 64.4557C170.513 58.4055 170.513 48.5629 164.463 42.5138Z"
                                fill="#FBBD7C"/>
                            <defs>
                                <linearGradient id="paint0_linear" x1="76.5" y1="16" x2="76.5" y2="169"
                                                gradientUnits="userSpaceOnUse">
                                    <stop stop-color="white"/>
                                </linearGradient>
                            </defs>
                        </svg>

                        <div class="pt-10">
                            <div>{{email}}で</div>
                            <div>再設定用のメールアドレスを確認してください</div>
                        </div>

                    </div>

                    <div class="d-action-send-forgot-pwd">
                        <v-sheet class="d-action-send-forgot-pwd-result d-width-100 fixed-bottom position-absolute">
                            <v-col>
                                <v-btn large block outlined @click="goBackToLogin">ログイン画面に戻る</v-btn>
                            </v-col>
                        </v-sheet>
                    </div>
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
            vModelDataByFiled: Object,
        }
    },
    props: {
        isDialogFull: {
            type: Boolean,
            required: true
        },
        funcCallbackEventClose: {
            type: Function,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // itemUsers: state => state.user.itemUsers,
        }),
        ...mapGetters({
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showLoginDialog: function () {
            return !!this.isDialogFull
        }
    },
    methods: {
        goBackToLogin: function () {
            // Redirect to login
            window.location.href = "/login"
        }
    }
}
</script>
