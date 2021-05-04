<template>
    <div :class="[`d-dialog-action-thread-chat p-0`]" v-if="isShowDialog">

        <v-bottom-sheet v-if="isShowDialog" v-model="showDataActionDialog" persistent
                        @click:outside="clickCallbackEventData"
                        :content-class="`d-dialog-show-not-fullscreen`" @keydown.esc="clickCallbackEventData"
                        max-width="440">

            <v-card :class="[`d-action-thread-chat`, 'd-border-radius-top-15']" :id="`dialog-action-thread-chat`">
                <v-card-text :id="'d-card-text-action-thread-chat'">
                    <div v-if="actionTypeChat === this.KEY_CHAT_TYPE_SINGLE && !!isUser"
                         v-on:click="clickListOrderOfUser" role="button">予約一覧
                    </div>
                    <div v-if="actionTypeChat === KEY_CHAT_TYPE_SINGLE" role="button"
                         @click="dialogBlockChannel = true">
                        {{ (isBockChannel ? "ブロック削除" : 'ブロックする') }}
                    </div>
                    <div v-on:click="clickCallbackEventData" role="button">キャンセル</div>
                </v-card-text>

            </v-card>
        </v-bottom-sheet>

        <v-dialog v-model="dialogBlockChannel" persistent max-width="320" :content-class="'p-0 m-0'"
                  @keydown.esc="dialogBlockChannel = false" @click:outside="dialogBlockChannel = false">
            <v-card class="p-0 m-0">
                <v-card-title class="p-1 d-title-act-block">
                    {{ isBockChannel ? 'ブロック削除してもよろしいですか？' : 'ブロックしてもよろしいですか？' }}
                </v-card-title>
                <v-card-text v-if="!isBockChannel">
                    <p>ブロックするとお相手とメッセージすることができなくなります。</p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="() => dialogBlockChannel = false">キャンセル</v-btn>
                    <v-btn color="green darken-1" text @click="eventBlockUser">申請する</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <ChatOrderInfoDialog v-if="isUser && isShowDialogListOrder" :roomId="roomId" @eventCancelOrderByUser="funcCancelOrderByUser"
                             :isShowDialog="isShowDialogListOrder" :funcCallbackClose="funcCallbackCloseListOrder"/>
    </div>
</template>

<script>

import {mapState} from "vuex";
import C from "../../utils/constants";
import processDataUserProfile from "../../mixin/processDataUserProfile";
import channelRoom from "../../mixin/channelRoom";
import ChatOrderInfoDialog from "./ChatOrderInfoDialog";
import {TYPE_ROLE_USER} from "../../utils/constant";

export default {
    mixins: [
        processDataUserProfile,
        channelRoom
    ],
    data: function () {
        return {
            isShowDialogListOrder: false,
            dialogBlockChannel: false,
            targetUserId: null,
            objThreadOfChat: {},
        }
    },
    model: {
        event: 'change'
    },
    components: {
        ChatOrderInfoDialog,
    },
    props: {
        objThreadChat: {
            type: Object,
            required: true,
        },
        actionTypeChat: {
            type: String,
            required: true,
        },
        roomId: {
            required: true,
        },
        preventClickByType: {
            type: String,
            required: false,
        },
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
        if (this.vModel && _.has(this.vModel, "id")) {
            this.vModelDataRadio = this.vModel.id
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            role: state => state.user.role,
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showDataActionDialog: function () {
            return !!this.isShowDialog
        },
        isBockChannel: function () {
            return this.objThreadOfChat && _.has(this.objThreadOfChat, "isBlock") ? !!this.objThreadOfChat.isBlock : false
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        // isBockChannelSingle: function () {
        //     return this.isBockChannel
        // }
    },
    methods: {
        funcCancelOrderByUser: function (data) {
            this.callbackEmitEventData({type: "cancel_order_by_user", data})
        },
        funcCallbackCloseListOrder: function (data) {
            this.$nextTick(() => {
                this.callbackEmitEventData({type: "fetchDataOrder", data: {}})
                this.isShowDialogListOrder = false
            })
        },
        clickListOrderOfUser: function () {
            this.isShowDialogListOrder = true;
        },
        eventBlockUser: function () {
            let req = {
                act_block_channel_single: this.isBockChannel ? 'unblock' : 'block',
                room_id: this.roomId
            }

            this.$store.dispatch("eventBlockUserChannelDispatch", {
                roomId: this.roomId,
                data: {
                    target_user_id: this.targetUserId,
                    ...req
                }
            }).then(res => {
                if (_.isBoolean(res) && res && req.act_block_channel_single === 'block') {
                    location.reload()
                }
                this.dialogBlockChannel = false;
                this.callbackEmitEventData({})
            }).catch(err => {
                this.dialogBlockChannel = false
                this.callbackEmitEventData({})
            })
        },
        callbackEmitEventData: function (data) {
            this.$nextTick(() => {
                // Emit data before use method callback
                this.funcCallbackEventData(data)
            })
        },
        clickCallbackEventData: function () {

            // Emit data before use method callback
            this.$nextTick(() => {
                this.callbackEmitEventData({isTypeAction: true})
            });
        },
    },
    watch: {
        objThreadChat: {
            handler: function (newVal, oldVal) {
                if (_.isObject(newVal)) {
                    this.objThreadOfChat = newVal
                }
            },
            deep: true
        }
    },
    created() {
        let self = this;
        self.objThreadOfChat = self.objThreadChat
        let targetUserId = self.objThreadOfChat && self.objThreadOfChat.users && self.objThreadOfChat.users.length ? self.objThreadOfChat.users[0].id : null

        if (self.objThreadOfChat && self.objThreadOfChat.type === this.KEY_CHAT_TYPE_SINGLE && targetUserId) {
            self.targetUserId = targetUserId;

            // self.$store.dispatch("fetchCheckBlockUserDispatch", {
            //     userId: targetUserId
            // }).then(res => {
            //     this.isVisibleActionBlockChannelSingle = _.isBoolean(res) ? res : false
            // }).catch(err => {
            //     this.isVisibleActionBlockChannelSingle = false
            // })
        }
    },
    destroyed() {
        // this.isVisibleActionBlockChannelSingle = true
        this.targetUser = null
        this.isShowDialogListOrder = false
    }
}
</script>

<style lang="scss">
.v-dialog {
    .v-card {
        .d-title-act-block {
            font-size: 1rem !important;
        }
    }
}
</style>
