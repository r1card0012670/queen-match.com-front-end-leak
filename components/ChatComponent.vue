<template>
    <div id="body-content-scroll" :class="[`container body-content-chat`, 'p-0', className]">
        <div class="justify-content-center" :style="styleOption">
            <v-card-text class="justify-content-center p-0" scrollable>
                <v-list :class="[`d-list-notification`, 'p-0']">
                    <v-list-item @click="clickOpenThreadChatSupport()" v-if="checkExistRoomSupport && notAccountSupport"
                                 :key="roomSupportSuccess.id"
                                 :class="[`d-list-notify-item`, 'border', 'pt-2', 'pb-2', {'active': !roomSupportSuccess.isReadRoom }]">
                        <div class="d-notify-avatar">
                            <v-list-item-avatar :size="56" class="align-self-start">
                                <v-img src="../../images/RG-chat-queen-support.svg"></v-img>
                            </v-list-item-avatar>
                            <LoginTimeMarkComponent :className="'d-inline-flex'" :type-status="onlineTypeStatus()"/>
                        </div>

                        <v-list-item-content class="p-0">
                            <v-list-item-title class="pl-0">
                                <v-col class="d-flex justify-content-between align-items-center p-0">
                                    <div class="d-inline-flex align-items-center">
                                        <div class="pr-2">{{ renderUserNameSupport() }}</div>
                                    </div>
                                </v-col>
                            </v-list-item-title>

                            <v-list-item-subtitle :class="['d-inline-flex', 'wrap-text']">
                                <v-list-item-title class="d-msg-latest">
                                    {{ renderLastMsgSupport() }}
                                </v-list-item-title>
                                <div class="p-0 pl-2 d-notify-item-time">{{ formatTimeChatSupport() }}
                                </div>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <template v-for="(item, index) in roomListSuccess">
                        <v-list-item :key="index" @click="clickOpenThreadChat(item)"
                                     :class="[`d-list-notify-item`, 'border', 'pt-2', 'pb-2', item.isReadRoom !== 1 ? 'active' : '']">

                            <div class="d-notify-avatar" v-if="item.type === KEY_CHAT_TYPE_SINGLE || item.type === KEY_CHAT_TYPE_SUPPORT">
                                <v-list-item-avatar :size="56" class="align-self-start">
                                    <v-img :src="renderUserAvatar(item.users, item.type)"></v-img>
                                </v-list-item-avatar>
                                <LoginTimeMarkComponent :className="'d-inline-flex'"
                                                        :type-status="onlineTypeStatusAuto(item.users, item.type)"/>
                            </div>
                            <template v-if="item.type === KEY_CHAT_TYPE_GROUP">
                                <div class="d-box-show-multi-img"
                                     style="position: relative;width: 55px;height: 55px;margin-right: 15px;">

                                    <v-list-item-avatar v-for="(its, idx) in item.users" :key="idx" :size="34"
                                                        class="img-other"
                                                        :style="`position: absolute; top: ${18 - idx*3}px; ${((idx * 4) < 20 ? 'left: '+(idx * 4)+'px' : 'right: 0px')}; z-index: ${item.users.length - idx}`">
                                        <v-img :src="renderUserAvatarLoop(its)"></v-img>
                                    </v-list-item-avatar>
                                </div>
                            </template>

                            <v-list-item-content class="p-0">
                                <v-list-item-title class="pl-0">
                                    <v-col class="d-flex justify-content-between align-items-center p-0">
                                        <div class="d-inline-flex align-items-center">
                                            <div class="pr-2">
                                                {{ renderUserName(item.users, item.type, item.title) }}
                                            </div>
                                            <div :class="[`p-1 chip label-chip lighten-4`, classTypeCast(item.users)]"
                                                 v-if="!!checkTag(item.users, item.type) && (item.type === KEY_CHAT_TYPE_SINGLE || item.type === KEY_CHAT_TYPE_SUPPORT)">
                                                {{ checkTag(item.users, item.type) }}
                                            </div>
                                        </div>
                                    </v-col>
                                </v-list-item-title>

                                <v-list-item-subtitle :class="['d-inline-flex', 'wrap-text']">
                                    <v-list-item-title class="d-msg-latest">
                                        {{ renderLastMsg(item.chat) }}
                                    </v-list-item-title>
                                    <div class="p-0 pl-2 d-notify-item-time">{{ formatTimeChat(item.chat.created_at) }}
                                    </div>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </template>

                    <div ref="infiniteScrollRoom"></div>

                    <div v-if="!checkHasListChatRoom">
                        <div
                            class="d-flex align-items-center justify-content-center mt-13 flex-column d-resultf-content">
                            <svg width="158" height="146" viewBox="0 0 158 146" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <circle cx="71.9432" cy="71.9271" r="71.7747" fill="#F1F1F1"/>
                                <circle cx="71.356" cy="72.0497" r="41.9195" fill="#F1F1F1" stroke="#C4C4C4"
                                        stroke-width="2"/>
                                <circle cx="71.356" cy="72.0497" r="29.6568" fill="#FFFEFF" stroke="#C4C4C4"
                                        stroke-width="2"/>
                                <path
                                    d="M71.3561 49.5112C71.3561 49.0611 70.9909 48.6946 70.541 48.7103C64.9084 48.9069 59.5259 51.1354 55.3976 54.9992C51.2694 58.8631 48.69 64.0865 48.1216 69.6938C48.0762 70.1417 48.4177 70.5303 48.8669 70.5601C49.3161 70.5898 49.7028 70.2494 49.7493 69.8017C50.2897 64.6073 52.6855 59.7706 56.5117 56.1895C60.3378 52.6084 65.3223 50.5375 70.541 50.3417C70.9909 50.3248 71.3561 49.9614 71.3561 49.5112Z"
                                    fill="#C4C4C4"/>
                                <rect x="104.033" y="117.563" width="14" height="42" rx="7"
                                      transform="rotate(-45 104.033 117.563)" fill="#F1F1F1"
                                      stroke="#C4C4C4" stroke-width="2"/>
                                <rect x="102.611" y="107.656" width="2" height="8"
                                      transform="rotate(-45 102.611 107.656)" fill="#C4C4C4"/>
                                <rect x="123.831" y="67.0135" width="20" height="2" rx="1" fill="#C4C4C4"/>
                                <rect x="0.168457" y="83.5583" width="20" height="2" rx="1" fill="#C4C4C4"/>
                                <rect x="147.831" y="67.0135" width="10" height="2" rx="1" fill="#C4C4C4"/>
                                <rect x="128.831" y="74.3515" width="10" height="2" rx="1" fill="#C4C4C4"/>
                                <rect x="5.16846" y="90.8963" width="10" height="2" rx="1" fill="#C4C4C4"/>
                            </svg>
                            <span class="mt-7" v-if="isUser"> 検索条件に合うキャストがいません </span>
                            <span class="mt-7" v-if="isCast"> 検索条件に合うユーザーがいません </span>
                        </div>
                    </div>
                </v-list>
            </v-card-text>
        </div>

        <input type="text" :value="forceUpdate" class="d-none">

        <ListNotifyDialog v-if="isShowListNotify" :isShowDialog="isShowListNotify" :btnTitle="'お知らせ'"
                          :funcCloseDialog="funcEventCloseListNotify"/>

        <ThreadChatDialog :isShowDialog="isShowDialogThreadChat" :objThreadChat="objThreadChat" name="threadChat"
                          v-if="isShowDialogThreadChat" :typeChat="typeChat"
                          :funcCloseDialog="eventCloseDialogThreadChat"/>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import constantMain from "../utils/constants";
import C from "../utils/constants";
import appUtility from "../utils/app-utility";
import ListNotifyDialog from "../common/notify/ListNotifyDialog";
import ThreadChatDialog from "../common/chat/ThreadChatDialog";
import LoginTimeMarkComponent from "../common/LoginTimeMarkComponent";
import {TYPE_ROLE_USER} from "../utils/constant";
import channelRoom from "../mixin/channelRoom";


export default {
    mixins: [
        channelRoom
    ],
    props: {
        styleOption: {
            type: String,
            defaultValue: ""
        },
        payload: {
            type: Object,
            defaultValue: {}
        },
        className: {
            type: String,
            defaultValue: ""
        },
    },
    data: function () {
        return {
            forceUpdate: 0,
            objThreadChat: {},
            isShowDialogThreadChat: false,
            typeChat: "",
            currentPage: 0,
            checkHasListChatRoom: 1,
            observer: null
        }
    },
    components: {
        ListNotifyDialog,
        ThreadChatDialog,
        LoginTimeMarkComponent,
    },
    mounted() {
        let self = this;
        self.scrollTrigger();

        if (!!self.isUser || !!self.isCast) {
            this.$store.dispatch("getListCardByUserBeforeOrderDispatch", {user_id: this.user.id})
        }
    },
    methods: {
        scrollTrigger() {
            let self = this;
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0) {
                        // console.log(0)
                        self.currentPage += 1;
                        self.getListRoomInfo();
                    }
                });
            });

            if (!!self.$refs.infiniteScrollRoom) {
                this.observer.observe(self.$refs.infiniteScrollRoom);
            }
        },
        renderUserAvatarLoop: function (item) {
            return item ? item.avatar : this.constant.AVATAR_DEFAULT
        },
        renderUserAvatar: function (item, type) {
            if (type === this.KEY_CHAT_TYPE_GROUP) {
                // TODO Select avatar for group
                return this.constant.AVATAR_DEFAULT
            }

            return item && item.length ? item[0].avatar : this.constant.AVATAR_DEFAULT
        },
        renderUserName: function (item, type, title) {
            if (type === this.KEY_CHAT_TYPE_SINGLE) {
                return item && item.length ? item[0].nickname : ""
            } else if (type === this.KEY_CHAT_TYPE_GROUP) {
                return title ? title : "You, " + item.map(ele => ele.nickname).join(", ")
            } else if (type === this.KEY_CHAT_TYPE_SUPPORT) {
                return !this.notAccountSupport
                    ? (item && item.length ? item[0].nickname : "")
                    : "Queen Support Center"
            } else {
                return ""
            }
        },
        renderLastMsg: function (chatData) {
            return ` メッセージが届いてます `
        },
        formatTimeChat: function (date) {
            return appUtility.isValidDate(date) ? appUtility.dateFormat(date, "HH:mm") : ""
        },
        checkTag: function (item, type) {
            if (type === this.KEY_CHAT_TYPE_GROUP) {
                return ""
            }

            return item.length && _.has(item[0], "tag") && item[0].tag ? item[0].tag : ""
        },
        funcEventCloseListNotify: function () {
            this.$store.dispatch('isShowListNotifyDispatch', false);
        },
        eventCloseDialogThreadChat: function () {
            this.isShowDialogThreadChat = false;
            // this.itemObjThreadChat = {}
            this.objThreadChat = {}
            this.typeChat = ""
            this.forceUpdate = this.forceUpdate + 1
        },
        clickOpenThreadChat: function (data) {
            // this.itemObjThreadChat = data
            this.objThreadChat = data
            this.typeChat = data.type;

            this.$nextTick(() => {
                this.isShowDialogThreadChat = true
            })
        },
        clickOpenThreadChatSupport: function () {
            this.objThreadChat = this.roomSupportSuccess
            this.typeChat = this.roomSupportSuccess.type;

            this.$nextTick(() => {
                this.isShowDialogThreadChat = true
            })
        },
        getListRoomInfo: function () {
            this.$store.dispatch('getListRoomByUserDispatch', {user_id: this.user.id, page: this.currentPage});
        },
        renderUserAvatarSupport: function () {
            return ""
        },
        renderUserNameSupport: function () {
            return this.KEY_CHAT_SUPPORT_USER_NAME
        },
        renderLastMsgSupport: function () {
            return "メッセージが届いてます"
        },
        formatTimeChatSupport: function () {
            let time = this.roomSupportSuccess && _.has(this.roomSupportSuccess, "chat.created_at") ? this.roomSupportSuccess.chat.created_at : null;
            return (!time || _.isNull(time)) ? "" : appUtility.isValidDate(time) ? appUtility.dateFormat(time, "HH:mm") : ""
        },
        onlineTypeStatus: function () {
            let time = this.roomSupportSuccess && this.roomSupportSuccess.users.length ? this.roomSupportSuccess.users[0].last_active_time : null
            if (_.isNull(time)) {
                return "offline"
            }

            return appUtility.renderOnlineTypeClass(time) //"no-plan" // "no-plan", "online", "offline"
        },
        onlineTypeStatusAuto: function (item, type) {
            if (type === this.KEY_CHAT_TYPE_GROUP) {
                return ""
            }
            let time = item && item.length ? item[0].last_active_time : null
            if (!time) {
                return "offline"
            }
            return appUtility.renderOnlineTypeClass(time) //"no-plan" // "no-plan", "online", "offline"
        },
        renderAvatarGroupTitleFirst: function (item) {
            return item.users.length && item.users[0].avatar ? item.users[0].avatar : C.AVATAR_DEFAULT
        },
        renderAvatarGroupTitleSecond: function (item) {
            return item.users.length && item.users.length > 2 && item.users[1].avatar
                ? item.users[1].avatar : C.AVATAR_DEFAULT
        },
        classTypeCast: function (obj) {
            let class_name = '';
            if (obj && obj[0] && (obj[0].cast_type === parseInt(this.constant.CAST_TYPE[1]['id']))) {
                class_name = "vip";
            } else if (obj && obj[0] && (obj[0].cast_type === parseInt(this.constant.CAST_TYPE[2]['id']))) {
                class_name = "royal-vip";
            }

            return class_name;
        },
        updateObjThreadChat: function () {
            let self = this
            this.$nextTick(() => {
                if (self.objThreadChat && Object.keys(self.objThreadChat).length) {
                    // debugger
                    let roomId = self.objThreadChat.roomId;
                    let fi = (self.getRoomListSuccess || []).findIndex(ele => +ele.roomId === +roomId);
                    if (fi !== -1) {
                        // Update data when change info of room
                        self.objThreadChat = Object.assign({}, self.objThreadChat, self.getRoomListSuccess[fi])
                    }
                }
            })
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            isShowListNotify: state => state.main.isShowListNotify,
            getRoomListSuccess: state => state.chat.getRoomListSuccess,
            filterChatRoom: state => state.chat.filterChatRoom,
            user: state => state.user.user,
            role: state => state.user.role,
            fetchedDataListRoom: state => state.chat.fetchedDataListRoom,
        }),
        ...mapGetters({
            isShowListNotify: "isShowListNotify",
            getRoomListSuccess: "getRoomListSuccess",
        }),
        constant: function () {
            return Object.assign({}, constantMain)
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        isCast: function () {
            return this.role === TYPE_ROLE_USER.TYPE_CAST
        },
        roomListSuccess: function () {
            if (this.notAccountSupport) {
                // List channel not not account support
                return _.orderBy(this.getRoomListSuccess.filter(ele => ele.type !== this.KEY_CHAT_TYPE_SUPPORT), ['latest_message_id'], ['desc']);
            }

            // Show all channel of support
            return _.orderBy(this.getRoomListSuccess, ['latest_message_id'], ['desc']);
        },
        roomSupportSuccess: function () {
            let findIndex = this.getRoomListSuccess.findIndex(ele => ele.type === this.KEY_CHAT_TYPE_SUPPORT);
            if (findIndex !== -1) {
                return this.getRoomListSuccess[findIndex];
            }

            return {}
        },
        checkExistRoomSupport: function () {
            return !!Object.keys(this.roomSupportSuccess).length
        },
        // checkHasListChatRoom: function () {
        //     return !!this.getRoomListSuccess.length
        // }
    },
    watch: {
        user: function (to, from) {
            this.getListRoomInfo()
        },
        filterChatRoom: {
            handler: function (newVal, oldVal) {
                this.currentPage = 0
                if (newVal && Object.keys(newVal).length) {
                    this.checkHasListChatRoom = 1
                    setTimeout(() => this.getListRoomInfo(), 200);
                    if (_.has(newVal, "nickname") && newVal.nickname) {
                        this.$store.commit("getRoomListSuccessMutation", []);
                    }
                }
            },
            deep: true
        },
        getRoomListSuccess: function (newVal) {
            setTimeout(() => {
                if (!this.fetchedDataListRoom) {
                    this.checkHasListChatRoom = !!this.getRoomListSuccess.length
                }
            }, 1000);

            // Update data prarent
            this.updateObjThreadChat();
        }
    },
    created() {
        // // Call number read message
        // this.$store.dispatch("fetchNumUnreadMessageDispatch", {userOrCastId: this.user.id});
        // this.$store.dispatch("fetchCouponForNewOrderDispatch", {user_id: this.user.id, key: NEW_USER_COUPON_KEY})
    },
    destroyed() {
        this.objThreadChat = {}
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
</script>
