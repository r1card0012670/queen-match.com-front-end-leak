<template>
    <v-col :class="[`d-box-list-thread-chat-${actionTypeChat}`.toLowerCase(), `p-0`]" v-if="isShowDialog">
        <v-dialog v-model="showDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440" persistent
                  @click:outside="clickCloseDialog"
                  fullscreen @keydown.esc="clickCloseDialog" hide-overlay transition="dialog-bottom-transition"
                  scrollable>

            <v-card :class="[`d-list-thread-chat-${actionTypeChat}`.toLowerCase()]" :id="`dialog-list-thread-chat`">
                <v-card-title :id="'d-card-title-list-thread-chat'"
                              :class="[`headline d-header-box-list-thread-chat d-header-border-width-3 p-0`]">
                    <div class="card-header-top align-items-center">
                        <button v-on:click="clickCloseDialog">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>

                        <v-list-item :class="[`d-iframe-title-thread-chat p-0`]" role="button">
                            <v-list-item-avatar class="align-self-start"
                                                v-if="actionTypeChat === KEY_CHAT_TYPE_SUPPORT"
                                                @click="clickAvatarChat(objThreadChat.users[0].id)" role="button">
                                <template :class="[renderClassImageTitle]"
                                          v-if="actionTypeChat === KEY_CHAT_TYPE_SUPPORT">
                                    <v-img v-if="notAccountSupport"
                                           src="../../images/RG-chat-queen-support.svg"></v-img>
                                    <v-img v-else :eager="true" :src="renderAvatarSingleTitle"></v-img>
                                </template>

                            </v-list-item-avatar>

                            <v-list-item-avatar class="align-self-start"
                                                v-if="actionTypeChat === this.KEY_CHAT_TYPE_SINGLE"
                                                @click="clickAvatarChat(objThreadChat.users[0].id)" role="button">
                                <template :class="[renderClassImageTitle]"
                                          v-if="actionTypeChat === this.KEY_CHAT_TYPE_SINGLE">
                                    <v-img :eager="true" :src="renderAvatarSingleTitle"></v-img>
                                </template>
                            </v-list-item-avatar>

                            <template :class="[renderClassImageTitle]"
                                      v-if="actionTypeChat === this.KEY_CHAT_TYPE_GROUP">
                                <div class="d-box-show-multi-img">

                                    <v-list-item-avatar v-for="(its, idx) in objThreadChat.users" :key="idx" :size="24"
                                                        class="img-other"
                                                        :style="`position: absolute; top: ${18 - idx*3}px; ${((idx * 4) < 16 ? 'left: '+(idx * 4)+'px' : 'right: 0px; display: none')}; z-index: ${objThreadChat.users.length - idx}`">
                                        <v-img :src="renderUserAvatarLoop(its)"></v-img>
                                    </v-list-item-avatar>
                                </div>
                            </template>

                            <v-list-item-content class="p-0" @click="clickShowDetailInfoChat" role="button">
                                <v-list-item-title>
                                    <v-col class="d-flex justify-content-between p-0">
                                        <div class="d-inline-flex">
                                            <div class="pr-2 custom-title-header">{{ titleHeaderChat }}</div>
                                        </div>
                                    </v-col>
                                </v-list-item-title>

                                <v-list-item-subtitle :class="['d-box-title-item-subtitle']">
                                    <LoginTimeMarkComponent :nameStatus="titleHeaderContentChat"
                                                            :typeStatus="typeStatus"
                                                            :className="'d-inline-flex'"/>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-btn icon @click="moreHorizAction" plain text
                               class="m-0 justify-content-end icon-more_horiz"
                               v-if="actionTypeChat === this.KEY_CHAT_TYPE_SINGLE && notAccountSupport">
                            <v-icon>more_horiz</v-icon>
                        </v-btn>
                    </div>
                    <v-col :class="['d-box-info-order p-0',]"
                           v-if="(actionTypeChat === this.KEY_CHAT_TYPE_SINGLE || actionTypeChat === this.KEY_CHAT_TYPE_GROUP) && !!isCast">
                        <MatchingInfo v-if="hasDataOrderOfCast" :infoOrderOfCast="infoOrderOfCast" :roomId="roomId"
                                      @eventInfoMatching="callBackListenEventMatching"/>
                    </v-col>
                </v-card-title>

                <v-card-text :id="'d-card-text-list-thread-chat'" class="d-flex d-card-text-list-thread-chat p-0">
                    <div class="d-chat-wrapper">
                        <v-col class="d-chat-body d-card-list-thread-chat p-0" ref="scrollContainer">
                            <v-list three-line class="pt-4 pl-3 pr-3">
                                <div ref="sentinel"></div>
                                <template v-for="(item, index) in messagesListSuccess">
                                    <v-layout class="col-12 d-flex justify-content-center p-0">
                                        <div class="text-center" v-if="isDateLinePrint(index)">
                                            {{ renderChatTime(item.created_at) }}
                                        </div>
                                    </v-layout>

                                    <v-layout class="col-12 d-flex justify-content-center p-0"
                                              v-if="actTypeMsg(item) === KEY_CHAT_TYPE_MESSAGE.GENERAL">
                                        <div class="d-flex" v-if="item.typeShowMessage === 'TEXT_RAW'">
                                            {{ item.subtitle }}
                                        </div>
                                        <template v-else-if="item.typeShowMessage === 'HTML'">
                                            <div class="text-wrap p-2 text-justify"
                                                 v-html='item.subtitle'/>
                                        </template>
                                    </v-layout>

                                    <v-list-item :key="index" :style="`width: ${item.isOwner ? 80 : 85}%`" v-else
                                                 :class="[
                                                     'col-12 mt-3 mb-3',
                                                      {'left v-chat-user': !item.isOwner},
                                                      {'right float-right v-chat-cast text-end': item.isOwner},
                                                       'p-0 pl-1 pr-1'
                                                  ]">

                                        <v-list-item-avatar :size="32" v-if="!item.isOwner"
                                                            @click="clickAvatarChat(item.user_id)"
                                                            role="button">
                                            <v-img v-if="actionTypeChat === KEY_CHAT_TYPE_SUPPORT"
                                                   src="../../images/RG-chat-queen-support.svg"></v-img>
                                            <v-img v-else :src="itemAvatar(item)"/>
                                        </v-list-item-avatar>

                                        <v-list-item-content :class="['p-0', {'flex-row-reverse': item.isOwner}]">
                                            <v-list-item-subtitle
                                                :class="['text-wrap rounded border p-2', {'d-quote-code': (item.typeShowMessage === 'HTML_CODE' || item.typeShowMessage === 'HTML')}]">
                                                <div class="d-flex" v-if="item.typeShowMessage === 'TEXT_RAW'">
                                                    {{ item.subtitle }}
                                                </div>
                                                <template v-else-if="item.typeShowMessage === 'HTML_CODE'">
                                                    <pre class="text-wrap p-2 text-justify">
                                                        <code>{{ item.subtitle }}</code>
                                                    </pre>
                                                </template>
                                                <template v-else-if="item.typeShowMessage === 'HTML'">
                                                    <div class="text-wrap p-2 text-justify"
                                                         v-html='item.subtitle'/>
                                                </template>
                                            </v-list-item-subtitle>

                                            <div v-if="item.typeShowMessage === 'IMAGE'" role="button"
                                                 @click="clickOpenDialogImage(item)">
                                                <img :src="renderSrcImage(item)" alt="" style="width: 100%;"
                                                     onerror="this.onerror=null;this.src='http://example.com/existent-image.jpg';"/>
                                            </div>

                                            <div v-if="item.typeShowMessage === 'GIFT'"
                                                 class="p-2 d-box-show-gift-wrap">
                                                <img :src="renderSrcGift(item)" style="width: 100px;"
                                                     onerror="this.onerror=null;this.src='http://example.com/existent-image.jpg';"/>
                                                <p :class="[`p-1 m-0 d-show-success-gift`, {'d-show-gift-not-me': !item.isOwner} ]">
                                                    ギフトが贈られました！</p>
                                                <p :class="['p-1 m-0 d-show-success-gift', {'d-show-gift-not-me': !item.isOwner}]">
                                                    {{ formatPointGift(item) }}のギフト！</p>
                                            </div>

                                        </v-list-item-content>
                                    </v-list-item>
                                </template>
                            </v-list>
                        </v-col>

                        <v-col class="d-chat-footer p-0">
                            <div class="col-12 d-inline-flex d-action-thread-chat p-0">
                                <v-textarea ref="sendMsg" @focus="onFocus" class="mx-2 p-0 m-0" v-model="vModelChat"
                                            @keyup.enter.native="sendMessage" auto-grow
                                            :label="labelMsg" @focusout="focusoutMessage"
                                            :class="['d-custom-box-chat-msg']"
                                            :rows="lineRows" no-resize>
                                    <template slot="append">
                                            <span class="" v-if="isShowActionSend" @click="sendMessage" role="button">
                                                <svg class="crt8y2ji" width="20px" height="20px" viewBox="0 0 24 24">
                                                    <path fill-rule="evenodd" :fill="isFillActionColor ? '#0084ff' : ''"
                                                          d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
                                                          stroke="none"></path></svg>
                                            </span>
                                    </template>
                                </v-textarea>

                                <div class="d-flex justify-content-end d-action-thread-chat pr-0 pl-0">
                                    <v-btn icon @click="clickActionCalendar(isShowActionCalendar)"
                                           class="d-calender-box"
                                           v-if="!isCast && actionTypeChat === KEY_CHAT_TYPE_SINGLE && notAccountSupport">
                                        <v-img v-if="!isShowActionCalendar" :width="21"
                                               src="../../images/chat-icon-calendar-alt.svg"></v-img>
                                        <v-img v-if="isShowActionCalendar" :width="21"
                                               src="../../images/chat-icon-calendar-alt-active.svg"></v-img>
                                    </v-btn>

                                    <v-btn icon @click="clickActionImage(isShowActionImage)" style="padding-top: 3px">
                                        <v-img :width="26" src="../../images/chat-icon-image.svg"></v-img>
                                    </v-btn>

                                    <v-btn v-if="!isCast && actionTypeChat === KEY_CHAT_TYPE_SINGLE && notAccountSupport" icon
                                           @click="clickActionGift(isShowActionGift)">
                                        <v-img v-if="!isShowActionGift" :width="24"
                                               src="../../images/chat-icon-gift.svg"></v-img>
                                        <v-img v-if="isShowActionGift" :width="24"
                                               src="../../images/chat-icon-gift-active.svg"></v-img>
                                    </v-btn>
                                </div>
                            </div>

                            <div class="d-act-content-calendar"
                                 v-if="isShowActionCalendar && !isCast && actionTypeChat === KEY_CHAT_TYPE_SINGLE && notAccountSupport">
                                <div class="d-flex d-box-layout-calender" v-if="checkInfoCast">
                                    <OrderCastSchedule :isClearable="false" :infoCast="infoCast" :roomId="roomId"
                                                       @eventOrderOneToOne="funcEventOrderOneToOne"/>
                                </div>
                            </div>

                            <div class="d-act-content-gift"
                                 v-if="isShowActionGift && !isCast && actionTypeChat === KEY_CHAT_TYPE_SINGLE && !isDisableRoomWhenBlockChannel && notAccountSupport">
                                <v-tabs show-arrows v-model="tab">
                                    <v-tabs-slider></v-tabs-slider>

                                    <v-tab v-for="(item, k) in listGiftGroup" :key="item.id">
                                        {{ item.group_gift_name }}
                                    </v-tab>
                                </v-tabs>
                                <div class="d-content-item d-box-slider">
                                    <v-tabs-items v-model="tab" class="d-box-slides">
                                        <Gifts :dataCarouselSlider="showDataByTab"
                                               :funcEventClickSlider="handleGiftItemClick"/>
                                    </v-tabs-items>
                                </div>
                            </div>

                            <v-flex xs12 class="d-none">
                                <input type="file" style="display: none" ref="uploadImage" accept="image/*"
                                       @change="onFilePicked">
                            </v-flex>

                            <v-overlay v-if="(isShowActionCalendar || isShowActionGift) && overlay" :value="overlay"
                                       :absolute="absolute">
                                <v-progress-circular indeterminate size="30"/>
                            </v-overlay>
                        </v-col>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <ActionThreadChatDialog :isShowDialog="isShowDialogAction" :objThreadChat="objThreadChat"
                                :preventClickByType="preventClickByType" :roomId="roomId"
                                :funcCallbackEventData="callbackEventCloseThread" :actionTypeChat="actionTypeChat"/>

        <DetailInfoGroupChatDialog v-if="isShowDetailInfoGroup && actionTypeChat === this.KEY_CHAT_TYPE_GROUP"
                                   :isShowDialog="isShowDetailInfoGroup" :listMemberInGroup="objThreadChat.users"
                                   :funcCallbackClose="eventCloseDetailInfoChat"/>

        <FileViewerImageDialog v-if="isShowFileViewerImage" :isShowDialog="isShowFileViewerImage" :src="clickUrl"
                               :funcCloseDialog="clickCloseDialogImage"/>

        <v-dialog v-if="isActiveDialog" v-model="isActiveDialog" :content-class="`d-dialog-show-fullscreen`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
            <!-- Detail User -->
            <UserProfilesComponent v-if="isActiveDialog" :typeAction="'SHOW_PROFILE_OTHER'"
                                   :name="'chat2showToOther'"
                                   :userInfo="userInfo"
                                   @eventCloseProfile="funcCloseProfile"/>
        </v-dialog>

        <ConfirmCreateCardDialog v-if="isAddPayment" :isShowDialog="isAddPayment"
                                 :funcEventClose="funcEventCloseCreate"
                                 @confirmAddPayment="addPaymentInfo"/>

        <CreateCardInfoDialog v-if="isConfirmAddPayment" :isShowDialog="isConfirmAddPayment"
                              :funcCallbackEventClose="funcEventCloseCreate"
                              @addSuccess="addPaymentInfoSuccess" :isHasCard="false"/>

        <v-dialog v-if="isShowNotice" v-model="isShowNotice" fullscreen persistent
                  max-width="440"
                  :content-class="`d-dialog-show-fullscreen`"
                  transition="dialog-center-transition">

            <NoticeComponent :isShowNotice="isShowNotice" @closeNotice="handlerCloseNotice"
                             :isShowClose="false">
                <template v-slot:cbody>
                    <template v-if="typeNotice === 'success'">
                        <svg width="63" height="48" viewBox="0 0 63 48" class="ml-6"
                             fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M58.0781 0.9375L18.7031 40.3125L4.78125 26.3906C4.07812 25.8281 3.09375 25.8281 2.39062 26.3906L0.84375 28.0781C0.140625 28.6406 0.140625 29.7656 0.84375 30.4688L17.5781 47.2031C18.1406 47.7656 19.2656 47.7656 19.8281 47.2031L62.0156 5.01562C62.7188 4.3125 62.7188 3.1875 62.0156 2.625L60.4688 0.9375C59.7656 0.375 58.7812 0.375 58.0781 0.9375Z"
                                fill="white"/>
                        </svg>
                        <div class="pt-3 text-center color--white">
                            {{ alertMessageNotice }}
                        </div>
                    </template>
                    <template v-if="typeNotice === 'fail'">
                        <svg width="48" height="48" viewBox="0 0 16 16" fill="none"
                             class="ml-7"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.7031 8L15.7656 2.98438C16.0469 2.70312 16.0469 2.1875 15.7656 1.90625L14.5938 0.734375C14.3125 0.453125 13.7969 0.453125 13.5156 0.734375L8.5 5.79688L3.4375 0.734375C3.15625 0.453125 2.64062 0.453125 2.35938 0.734375L1.1875 1.90625C0.90625 2.1875 0.90625 2.70312 1.1875 2.98438L6.25 8L1.1875 13.0625C0.90625 13.3438 0.90625 13.8594 1.1875 14.1406L2.35938 15.3125C2.64062 15.5938 3.15625 15.5938 3.4375 15.3125L8.5 10.25L13.5156 15.3125C13.7969 15.5938 14.3125 15.5938 14.5938 15.3125L15.7656 14.1406C16.0469 13.8594 16.0469 13.3438 15.7656 13.0625L10.7031 8Z"
                                fill="red"></path>
                        </svg>
                        <div class="pt-3 text-center color--white">
                            {{ alertMessageNotice }}
                        </div>
                    </template>

                    <v-alert v-if="typeNotice === 'alert_success'" type="success">
                        {{ alertMessageNotice }}
                    </v-alert>

                    <v-alert v-if="typeNotice === 'alert_info'" type="info">
                        {{ alertMessageNotice }}
                    </v-alert>

                    <v-alert v-if="typeNotice === 'alert_warning'" type="warning">
                        {{ alertMessageNotice }}
                    </v-alert>

                    <v-alert v-if="typeNotice === 'alert_error'" type="error">
                        {{ alertMessageNotice }}
                    </v-alert>
                </template>
            </NoticeComponent>
        </v-dialog>
    </v-col>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import IconSvgComponent from "../../common/IconSvgComponent";
import appUtility from "../../utils/app-utility";
import LoginTimeMarkComponent from "../../common/LoginTimeMarkComponent";
import UserProfilesComponent from "../../components/UserProfilesComponent";
import ActionThreadChatDialog from "./ActionThreadChatDialog";
import DetailInfoGroupChatDialog from "./DetailInfoGroupChatDialog";
import OrderCastSchedule from "./OrderCastSchedule";
import MatchingInfo from "./../cast/MatchingInfo";
import FileViewerImageDialog from "./../file/FileViewerImageDialog";
import Gifts from './Gifts';
import {
    CHAT_MESSAGE_CAST_DISBANDED,
    CHAT_MESSAGE_CAST_JOINED_MEETING,
    CHAT_MESSAGE_CAST_LAST_10_BEFORE_END_TIME,
    CHAT_MESSAGE_FORMAT_CANCEL_CONFIRM_ORDER_1vs1,
    CHAT_MESSAGE_FORMAT_CONFIRM_ORDER_1vs1,
    CHAT_MESSAGE_FORMAT_CREATE_ORDER_1_1,
    MAX_SIZE_IMAGE,
    ROLE_CONFIRM_CAST,
    TYPE_CHANNEL_ROOMS,
    TYPE_ROLE_USER
} from "../../utils/constant";
import processDataUserProfile from "../../mixin/processDataUserProfile";
import CreateCardInfoDialog from "../payment/CreateCardInfoDialog";
import ConfirmCreateCardDialog from "../payment/ConfirmCreateCardDialog";
import channelRoom from "../../mixin/channelRoom";
import NoticeComponent from "../../components/NoticeComponent";

export default {
    name: "ThreadChatDialog",
    mixins: [
        processDataUserProfile,
        channelRoom
    ],
    data: function () {
        return {
            maxRowsMsg: 4, // Default
            lineRows: 1, //
            isFillActionColor: false, //
            labelMsg: `メッセージを入力...`, // Default
            infoCast: {},
            maxMsgChat: 26000,
            roomId: "",
            dataInfoGift: {},
            imageFile: "",
            imageUrl: "",
            isAddPayment: false,
            isConfirmAddPayment: false,
            isActiveDialog: false,
            userInfo: {},
            isShowActionGift: false,
            isShowActionImage: false,
            isShowActionCalendar: false,
            isShowDialogAction: false,
            vModelChat: "",
            tab: 0,
            swiperOption: {
                slidesPerView: 3,
                slidesPerColumn: 2,
                spaceBetween: 0,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                }
            },
            isShowDetailInfoGroup: false,
            isShowFileViewerImage: false,
            clickUrl: "",
            scrollVal: null,
            currentPage: 0,
            typeNotice: "",
            alertMessageNotice: "",
            isShowNotice: false,
            timeSetInterval: 90000, // 1 minute 30s
            timeInterval: null, // 2 minute
            absolute: true,
            overlay: false,
            typePaymentInfoSuccess: "",
            listEndObserver: null,
            previousScrollHeightMinusScrollTop: 0,
            firstLoadData: true,
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
        funcCloseDialog: {
            type: Function,
            required: true
        },
        typeChat: {
            type: String,
            required: true
        },
        objThreadChat: {
            type: Object,
            required: true,
        },
        name: {
            type: String
        }
    },
    model: {
        event: 'addSuccess'
    },
    components: {
        IconSvgComponent,
        LoginTimeMarkComponent,
        ActionThreadChatDialog,
        DetailInfoGroupChatDialog,
        Gifts,
        OrderCastSchedule,
        MatchingInfo,
        FileViewerImageDialog,
        UserProfilesComponent,
        CreateCardInfoDialog,
        ConfirmCreateCardDialog,
        NoticeComponent
    },
    mounted() {
        // Read message in room
        let self = this;
        this.$store.dispatch("markReadMessageByIdDispatch", {roomId: this.roomId});

        if (self.isUser && self.actionTypeChat === self.KEY_CHAT_TYPE_SINGLE && self.objThreadChat.users.length) {
            self.infoCast = self.objThreadChat.users[0];
        }
        self.isShowActionCalendar = false;
        self.isShowActionGift = false;
        self.$nextTick(() => {
            if (!self.isExistPayment && self.actionTypeChat !== self.KEY_CHAT_TYPE_SUPPORT) {
                // start goto other screen thread chat
                this.$store.dispatch("getListCardByUserBeforeOrderDispatch", {user_id: this.user.id})
            }
        })
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            role: state => state.user.role,
            // itemUsers: state => state.user.itemUsers, // fake
            getMessagesListSuccess: state => state.chat.getMessagesListSuccess,
            user: state => state.user.user,
            // addMessageSuccess: state => state.payment.addMessageSuccess,
            listGift: state => state.chat.listGift,
            listGiftGroup: state => state.chat.listGiftGroup,
            detailInfoEditCard: state => state.book.detailInfoEditCard,
            giftStatusType: state => state.chat.giftStatusType,
            declinedProcessWithPayment: state => state.chat.declinedProcessWithPayment,
            listOrderForCast: state => state.chat.listOrderForCast,
        }),
        ...mapGetters({
            // errorLoginMessage: "errorLoginMessage",
            getMessagesListSuccess: "getMessagesListSuccess",
            // addMessageSuccess: "addMessageSuccess",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        isCast: function () {
            return this.role === TYPE_ROLE_USER.TYPE_CAST
        },
        showDialog: function () {
            return !!this.isShowDialog
        },
        actionTypeChat: function () {
            if ([this.KEY_CHAT_TYPE_SINGLE, this.KEY_CHAT_TYPE_GROUP, this.KEY_CHAT_TYPE_SUPPORT].indexOf(this.typeChat.toUpperCase()) !== -1) {
                return this.typeChat.toUpperCase()
            }
            return "";
        },
        renderClassImageTitle: function () {
            return `iframe-title-img-header-${this.actionTypeChat}`.toLowerCase()
        },
        titleHeaderChat: function () {
            if (this.actionTypeChat === this.KEY_CHAT_TYPE_SINGLE) {
                return this.objThreadChat.users.length ? this.objThreadChat.users[0].nickname : ""
            }
            if (this.actionTypeChat === this.KEY_CHAT_TYPE_GROUP) {
                return _.has(this.objThreadChat, "title") && this.objThreadChat.title ? this.objThreadChat.title : "You, " + this.objThreadChat.users.map(ele => ele.nickname).join(", ")
            }
            if (this.actionTypeChat === this.KEY_CHAT_TYPE_SUPPORT) {
                if (this.notAccountSupport) {
                    return this.KEY_CHAT_SUPPORT_USER_NAME
                }

                return this.objThreadChat.users.length ? this.objThreadChat.users[0].nickname : ""
            }

            return ""
        },
        renderAvatarSingleTitle: function () {
            return this.objThreadChat.users.length && this.objThreadChat.users[0].avatar ? this.objThreadChat.users[0].avatar : C.AVATAR_DEFAULT
        },
        titleHeaderContentChat: function () {
            if (this.actionTypeChat === this.KEY_CHAT_TYPE_SINGLE && this.objThreadChat.users.length) {
                return appUtility.renderOnlineStatus(this.objThreadChat.users[0].last_active_time)
            }
            if (this.actionTypeChat === this.KEY_CHAT_TYPE_GROUP && this.objThreadChat.users.length) {
                // add +1 by user in group
                return `${this.objThreadChat.users.length + 1} メンバー`
            }
            if (this.actionTypeChat === this.KEY_CHAT_TYPE_SUPPORT) {
                return appUtility.renderOnlineStatus(this.objThreadChat.users[0].last_active_time)
            }

            return ""
        },
        typeStatus: function () {
            if (this.actionTypeChat === this.KEY_CHAT_TYPE_GROUP) {
                return ""
            }

            let time = this.objThreadChat && this.objThreadChat.users.length ? this.objThreadChat.users[0].last_active_time : null
            if (!time) {
                return "offline"
            }
            if (this.actionTypeChat === this.KEY_CHAT_TYPE_SINGLE) {
                return appUtility.renderOnlineTypeClass(time) //"no-plan" // "no-plan", "online", "offline"
            }

            if (this.actionTypeChat === this.KEY_CHAT_TYPE_SUPPORT) {
                return appUtility.renderOnlineTypeClass(time) //"no-plan" // "no-plan", "online", "offline"
            }

            return "offline"
        },
        isExistPayment: function () {
            if (+this.user.id === this.KEY_CHAT_SUPPORT_USER_ID) {
                return true
            }

            return !!(Object.keys(this.detailInfoEditCard).length && _.has(this.detailInfoEditCard, "id"))
        },
        showDataByTab: function () {
            return !!Object.keys(this.listGift).length ? this.listGift[this.tab] : []
        },
        checkInfoCast: function () {
            return !!Object.keys(this.infoCast).length
        },
        messagesListSuccess: function () {
            return this.getMessagesListSuccess.filter(ele => ele.room_id === this.roomId)
        },
        infoOrderOfCast: function () {
            if (!!this.isCast) {
                let keyRoomUser = `${this.roomId}_${this.user.id}`;
                if (this.listOrderForCast && this.listOrderForCast[keyRoomUser]) {
                    return _.cloneDeep(this.listOrderForCast[keyRoomUser]);
                }
            }
            return {}
        },
        hasDataOrderOfCast: function () {
            return !!Object.keys(this.infoOrderOfCast).length
        },
        preventClickByType: function () {
            return ""
        },
        isDisableRoomWhenBlockChannel: function () {
            if (this.actionTypeChat === this.KEY_CHAT_TYPE_SINGLE && this.objThreadChat && !!this.objThreadChat.isBlock) {
                // use police channel block
                return true;
            }

            return false;
        },
        isShowActionSend: function () {
            return !(!this.vModelChat.trim().length || this.vModelChat === "" || this.vModelChat === null || this.vModelChat.replace(/ /g, '').length <= 0)
        },
        isCastConfirm: function () {
            if (this.isUser || !this.isCast || this.actionTypeChat === this.KEY_CHAT_TYPE_SUPPORT) {
                return false;
            }

            return this.user.cast_confirm && +this.user.cast_confirm === ROLE_CONFIRM_CAST.CONFIRM && this.isCast
        }
    },
    methods: {
        moreHorizAction: function () {
            if (this.isCastConfirm) {
                this.setTimeoutAlertNotice("alert_warning", "現在審査中です。Queenからのご連絡をお待ちください。");
                return;
            }

            this.isShowDialogAction = true
        },
        renderUserAvatarLoop: function (item) {
            return item ? item.avatar : this.constant.AVATAR_DEFAULT
        },
        actTypeMsg: function (item) {
            return _.has(item, "actionTypeMessage") ? item.actionTypeMessage : ""
        },
        setTimeoutAlertNotice: function (typeNotice, alertMessageNotice) {
            this.typeNotice = typeNotice; // Show alert
            this.alertMessageNotice = alertMessageNotice
            this.isShowNotice = true;

            setTimeout(() => {
                this.isShowNotice = false;
                this.typeNotice = ""
                this.alertMessageNotice = ""
            }, 3333)
        },
        handlerCloseNotice: function () {
            this.isShowNotice = false
        },
        funcEventOrderOneToOne: function (data) {
            // Order success, pull message
            if (data.finishOrderSuccess === 'success') {
                let request = {
                    txtDate: (_.has(data, "dataOrder.schedule_join") && appUtility.isValidDate(data.dataOrder.schedule_join) ? appUtility.dateFormat(data.dataOrder.schedule_join, "YYYY年MM月DD日 (ddd) HH:mm ~") : ""),
                    numPeople: (_.has(data, "dataOrder.number_cast") ? `${data.dataOrder.number_cast}名` : ''),
                    txtTime: (_.has(data, "dataOrder.meeting_time") ? `${data.dataOrder.meeting_time}時間` : ''),
                    payPoint: (_.has(data, "dataOrder.actual_point") && data.dataOrder.actual_point ? appUtility.formatPriceToFixed(data.dataOrder.actual_point) : "0P"), // actual_point
                    extension: (_.has(data, "dataOrder.percentPriceNoticeFormat") ? data.dataOrder.percentPriceNoticeFormat : ""),
                }

                let textFormatMsgOrder = appUtility.renderCodeSnippet(CHAT_MESSAGE_FORMAT_CREATE_ORDER_1_1, request);
                let requestData = {
                    room_id: this.roomId,
                    content: textFormatMsgOrder,
                    type: this.KEY_CHAT_TYPE_MESSAGE.CREATE_ORDER
                }
                this.$store.dispatch("addMessageDispatch", {data: requestData});

                this.renderDataMsgForText(requestData);
            }
            this.isShowActionCalendar = false;
            this.$store.dispatch("listOrderOfUserDispatch", {roomId: this.roomId});
            this.setTimeoutAlertNotice(data.finishOrderSuccess, (data.finishOrderSuccess === 'success' ? "完了しました" : "完了できません"));
        },
        initialList: function () {
            let self = this;
            self.$nextTick().then(() => {
                let scrollContainer = self.$refs["scrollContainer"];
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
                //scrolldown
                self.$nextTick().then(() => {
                    //setup up observer after initial list loaded and scrolled all the way to the bottom
                    self.setUpInterSectionObserver();
                });
            });
        },
        lastScrollMax: function () {
            let node = this.$refs["scrollContainer"];
            if (node) {
                node.scrollTop = node.scrollHeight
            }
        },
        recordScrollPosition() {
            let node = this.$refs["scrollContainer"];
            if (node) {
                this.previousScrollHeightMinusScrollTop = node.scrollHeight - node.scrollTop;
            }
        },
        restoreScrollPosition() {
            let node = this.$refs["scrollContainer"];
            if (node) {
                node.scrollTop = node.scrollHeight - this.previousScrollHeightMinusScrollTop;
                // console.log('restoring scroll position', node.scrollTop)
            }
        },
        setUpInterSectionObserver() {
            if (!this.$refs["scrollContainer"] || !this.$refs["sentinel"]) {
                return;
            }
            let options = {
                root: this.$refs["scrollContainer"],
                margin: "10px",
            };
            this.listEndObserver = new IntersectionObserver(this.handleIntersection, options);

            this.listEndObserver.observe(this.$refs["sentinel"]);
            setTimeout(() => this.lastScrollMax(), 1000);
            this.firstLoadData = false;
        },
        handleIntersection([entry]) {
            if (entry.isIntersecting) {
                // console.log("sentinel intersecting");
            }
            if (entry.isIntersecting) {
                this.currentPage += 1;
                this.getListMessageInfo();
            }
        },
        itemAvatar: function (item) {
            return _.has(item, "avatar") && item.avatar ? item.avatar : C.AVATAR_DEFAULT
        },
        renderSrcImage: function (item) {
            return item.image
        },
        renderSrcGift: function (item) {
            return _.has(item, "gift.image") ? item.gift.image : ""
        },
        formatPointGift: function (item) {
            return _.has(item, "gift.point") && item.gift.point ? appUtility.formatPriceToFixed(item.gift.point) : "0P"
        },
        renderChatTime: function (date) {
            return appUtility.isValidDate(date) ? appUtility.dateFormat(date, "HH:mm MM/DD/YYYY") : ""
        },
        isDateLinePrint: function (index) {
            var periodsIndex = this.makePrintDateLinePeriod();
            return (periodsIndex.indexOf(index) >= 0);
        },
        makePrintDateLinePeriod: function () {
            var beforeDate = "";
            var periods = [];
            var message_comment = this.getMessagesListSuccess;
            for (var i = 0; i < message_comment.length; i++) {
                var date = message_comment[i].created_at.substr(0, 10);
                if (beforeDate != date) {
                    periods.push(i);
                    beforeDate = date;
                }
            }
            return periods;
        },
        onFilePicked(e) {
            let self = this;
            const files = e.target.files

            if (files[0] !== undefined) {
                self.imageName = files[0].name
                if (self.imageName.lastIndexOf('.') <= 0) {
                    return
                }
                const fr = new FileReader()
                let resizedImage;

                fr.readAsDataURL(files[0])
                fr.addEventListener('load', async () => {
                    let image = new Image();
                    image.onload = function (imageEvent) {
                        // Resize the image
                        let canvas = document.createElement('canvas'),
                            max_size = MAX_SIZE_IMAGE,
                            width = image.width,
                            height = image.height;
                        if (width > height) {
                            if (width > max_size) {
                                height *= max_size / width;
                                width = max_size;
                            }
                        } else {
                            if (height > max_size) {
                                width *= max_size / height;
                                height = max_size;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                        resizedImage = canvas.toDataURL('image/jpeg');
                        // Call send image to server
                        self.sendImageToServer(resizedImage)
                    }
                    // Call trigger event resize image
                    image.src = fr.result;
                })
            } else {
                self.imageName = ''
                self.imageFile = ''
                self.imageUrl = ''
            }
        },
        sendImageToServer: function (resizedImage) {
            let self = this
            this.$nextTick(() => {
                self.imageUrl = resizedImage
                self.imageFile = resizedImage; // this is an image file that can be sent to server...
                self.readyRequestSendImage(resizedImage)// // base64 image
            })
        },
        addPaymentInfoSuccess: async function (data) {
            if (this.typePaymentInfoSuccess && this.typePaymentInfoSuccess === "SEND_GIFT") {
                // Create send gift
                this.$store.dispatch("addDetailInfoAndChangeTypeSendGiftDispatch", _.has(data, "data") ? data.data : data)
            }
            if (this.typePaymentInfoSuccess && this.typePaymentInfoSuccess === "SEND_MSG") {
                this.$store.dispatch("addDetailInfoPaymentBeforeUseViaChatDispatch", _.has(data, "data") ? data.data : data)
                this.typePaymentInfoSuccess = ""
                // Has send message via message
            }
            if (this.typePaymentInfoSuccess && this.typePaymentInfoSuccess === "SEND_IMAGE") {
                this.$store.dispatch("addDetailInfoPaymentBeforeUseViaChatDispatch", _.has(data, "data") ? data.data : data)
                this.typePaymentInfoSuccess = ""
                // Has send message via upload image
            }

            this.isAddPayment = false
            this.isConfirmAddPayment = false
        },
        addPaymentInfo: function (val) {
            if (!!val) {
                this.isConfirmAddPayment = true
            }
        },
        funcEventCloseCreate: function () {
            this.isAddPayment = false
            this.isConfirmAddPayment = false
            this.typePaymentInfoSuccess = ""
        },
        focusoutMessage: function () {
            if (this.isCastConfirm) {
                this.setTimeoutAlertNotice("alert_warning", "現在審査中です。Queenからのご連絡をお待ちください。");
                return;
            }

            if (!this.vModelChat) {
                this.labelMsg = "メッセージを入力..."
            }
            this.isFillActionColor = false
        },
        onFocus: function () {
            if (this.isCastConfirm) {
                this.setTimeoutAlertNotice("alert_warning", "現在審査中です。Queenからのご連絡をお待ちください。");
                return;
            }
            this.isFillActionColor = true
            this.labelMsg = ""
            if (!!this.isDisableRoomWhenBlockChannel) {
                // Channel in block
                this.setTimeoutAlertNotice("alert_warning", "チャネルがブロックしたのでチャットすることができません。");
                return;
            }

            if (!this.isExistPayment && this.actionTypeChat !== this.KEY_CHAT_TYPE_SUPPORT && this.isUser) {
                this.isAddPayment = true;
                this.typePaymentInfoSuccess = "SEND_MSG"
                return;
            }

            this.isShowActionGift = false
            this.isShowActionImage = false
            this.isShowActionCalendar = false
        },
        funcCloseProfile: function () {
            this.isActiveDialog = false
        },
        clickCloseDialog: function () {
            this.funcCloseDialog(false);
        },
        formatTimeNotify: function (date) {
            return appUtility.isValidDate(date) ? appUtility.dateFormat(date, "HH:MM") : ""
        },
        checkTag: function (obj) {
            return _.has(obj, "tag") && obj.tag.length ? obj.tag[0] : ""
        },
        callbackEventCloseThread: function (dataEvent) {
            this.isShowDialogAction = false;
            if (_.has(dataEvent, "type")) {
                // Check type action for component
                switch (dataEvent.type){
                    case "cancel_order_by_user": {
                        this.eventActionDataCancelConfirmOrderByUser(dataEvent.data)
                    }
                }
            }
        },
        clickActionGift: function (isShowActionGift) {
            if (this.isCastConfirm) {
                this.setTimeoutAlertNotice("alert_error", "現在審査中です。Queenからのご連絡をお待ちください。");
                return;
            }
            if (this.isDisableRoomWhenBlockChannel) {
                // Channel in block
                this.setTimeoutAlertNotice("alert_warning", "チャネルがブロックしたのでチャットすることができません。");
                return
            }

            this.isShowActionGift = !isShowActionGift
            this.isShowActionImage = false
            this.isShowActionCalendar = false;
        },
        clickActionImage: function (isShowActionImage) {
            if (this.isCastConfirm) {
                this.setTimeoutAlertNotice("alert_warning", "現在審査中です。Queenからのご連絡をお待ちください。");
                return
            }
            if (!!this.isDisableRoomWhenBlockChannel) {
                // Channel in block
                this.setTimeoutAlertNotice("alert_warning", "チャネルがブロックしたのでチャットすることができません。");
                return;
            }

            if (!this.isExistPayment && this.actionTypeChat !== this.KEY_CHAT_TYPE_SUPPORT && this.isUser) {
                this.isAddPayment = true
                this.typePaymentInfoSuccess = "SEND_IMAGE"
                return;
            }
            this.isShowActionGift = false
            this.isShowActionImage = !isShowActionImage
            this.isShowActionCalendar = false;
            // Reset value
            this.$refs.uploadImage.value = null;
            this.$refs.uploadImage.click()
        },
        clickActionCalendar: function (isShowActionCalendar) {
            if (this.isCastConfirm) {
                this.setTimeoutAlertNotice("alert_warning", "現在審査中です。Queenからのご連絡をお待ちください。");
                return;
            }
            if (this.isDisableRoomWhenBlockChannel) {
                // Channel in block
                this.setTimeoutAlertNotice("alert_warning", "チャネルがブロックしたのでチャットすることができません。");
                return
            }

            this.isShowActionGift = false
            this.isShowActionImage = false
            this.isShowActionCalendar = !isShowActionCalendar;
        },
        handleGiftItemClick: function (data) {
            this.dataInfoGift = data;
            // Check payment
            // Check price
            // Send message

            if (this.isDisableRoomWhenBlockChannel) {
                // Channel in block
                this.setTimeoutAlertNotice("alert_warning", "チャネルがブロックしたのでチャットすることができません。");
                return
            }

            if (!!this.declinedProcessWithPayment) {
                this.setTimeoutAlertNotice("alert_warning", "エラーがあります！ もう一度やり直してください");
                console.error("Not access payment, when send gift")
                return;
            }

            if (!this.isExistPayment) {
                this.isAddPayment = true
                this.typePaymentInfoSuccess = "SEND_GIFT"
                return;
            }
            this.overlay = true
            this.$store.commit('giftStatusTypeMutation', this.constant.STATUS_REQUEST_GIFT_PROCESS.PAYMENT_GIFT_CREATE);
        },
        clickShowDetailInfoChat: function () {
            if (this.actionTypeChat === this.KEY_CHAT_TYPE_SINGLE) {
                return;
            }

            this.isShowDetailInfoGroup = true;
        },
        eventCloseDetailInfoChat: function () {
            this.isShowDetailInfoGroup = false;
        },
        clickAvatarChat: async function (userOrCastId) {
            // Validate
            if (!userOrCastId) {
                return;
            }

            let data = await this.initFetchUserORCastAsync(userOrCastId)
            // Validate user or cast
            if (!_.has(data, "user.id")) {
                return
            }
            this.userInfo = data.user;

            this.listUserOrCastData = data.suggestUserOrCast;
            // Init data for before use component UserProfilesComponent
            this.initProcessDataUserProfile({
                userOrCastId: data.user.id,
                fetchDataBeforeById: data.user,
                options: {role: {...data.dataRole}}
            });

            this.isActiveDialog = true
        },
        clickOpenDialogImage: function (item) {
            if (!item.image) {
                return
            }
            this.clickUrl = item.image

            this.isShowFileViewerImage = true
        },
        clickCloseDialogImage: function () {
            this.isShowFileViewerImage = false
            this.clickUrl = ""
        },
        getListMessageInfo: function () {
            this.recordScrollPosition();
            // this.$store.dispatch('loadingDispatch', true);
            this.$store.dispatch('getListMessageByRoomDispatch', {
                room_id: this.roomId,
                user_id: this.user.id,
                page: this.currentPage
            });
        },
        sendMessage: function (event) {
            if (this.isCastConfirm) {
                this.setTimeoutAlertNotice("alert_warning", "現在審査中です。Queenからのご連絡をお待ちください。");
                return;
            }
            if (this.isDisableRoomWhenBlockChannel) {
                // Channel in block
                this.setTimeoutAlertNotice("alert_warning", "チャネルがブロックしたのでチャットすることができません。");
                return
            }

            if (event.shiftKey === true && event.key === "Enter") {
                console.log("New line added, message not sended")

                this.lineRows = this.lineRows + 1
                if (this.lineRows >= this.maxRowsMsg) {
                    this.lineRows = this.maxRowsMsg
                }
                return;
            }

            if (!this.vModelChat.trim().length || this.vModelChat === "" || this.vModelChat === null || this.vModelChat.replace(/ /g, '').length <= 0) {
                this.vModelChat = '';
                return;
            }
            let data = {
                room_id: this.roomId,
                content: this.vModelChat,
                type: this.KEY_CHAT_TYPE_MESSAGE.TEXT_DIV,
            }
            this.$store.dispatch("addMessageDispatch", {data});
            this.visible = false;
            this.renderDataMsgForText(data);
            this.vModelChat = "";
            this.lineRows = 1;
        },
        readyRequestSendGift: function () {
            if (this.isDisableRoomWhenBlockChannel) {
                // Channel in block
                this.setTimeoutAlertNotice("alert_warning", "チャネルがブロックしたのでチャットすることができません。");
                return
            }

            this.$store.dispatch('createSendChatWithGiftDispatch',
                {
                    data:
                        Object.assign({},
                            _.pick(this.dataInfoGift, ["id", "name", "point"]),
                            {
                                gift: this.dataInfoGift.id,
                                gift_image: this.dataInfoGift.image,
                                room_id: this.roomId,
                                type: this.KEY_CHAT_TYPE_MESSAGE.GIFT,
                            })
                });
            this.vModelChat = '';
        },
        readyRequestPaymentSendGift: function () {
            // Validate
            if (this.cast) {
                return;
            }
            let cast_id = this.objThreadChat.users[0].id //

            if (!cast_id) {
                return;
            }
            this.$store.dispatch('readyRequestPaymentSendGiftDispatch', {
                data: {
                    gift_id: this.dataInfoGift.id,
                    cast_id: cast_id
                }
            })

            this.renderDataMsgForGift({dataInfoGift: this.dataInfoGift})
            this.vModelChat = '';
        },
        readyRequestSendImage: async function (img) {
            let self = this;
            let data = new FormData();
            await data.append('image', img)
            await data.append('room_id', this.roomId)
            await data.append('type', this.KEY_CHAT_TYPE_MESSAGE.IMAGE) // Fake

            this.$store.dispatch('createSendChatWithImageDispatch', data).then(async res => {
                self.imageFile = "";
                self.vModelChat = '';
                await self.renderDataMsgForImage({imageUrl: this.imageUrl});
                self.imageUrl = ""
            }).catch(err => {
                self.imageFile = ""
                self.vModelChat = '';
            })
        },
        renderDataMsgForText: function (payload) {
            let eventData = {
                avatar: "",
                content: payload.content,
                created_at: appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss"),
                gift: null,
                id: Math.random().toString(36).substr(2, 9), // Fill show data, not use when feature
                image: null,
                // price_point: 33
                role: this.role,
                room_id: this.roomId,
                updated_at: appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss"),
                user_id: this.user.id,
                ..._.has(payload, "type") && {type: payload.type},
                keyFakeIdAndRemoveWhenApi: true, // Fixed
            }

            let results = appUtility.convertDataMessageListChat([eventData], this.user.id);

            this.getMessagesListSuccess.push(results[0]);
            setTimeout(() => this.lastScrollMax(), 400);
        },
        renderDataMsgForImage: function (payload) {
            let eventData = {
                avatar: "",
                content: null,
                created_at: appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss"),
                gift: null,
                id: Math.random().toString(36).substr(2, 9), // Fill show data, not use when feature
                image: payload.imageUrl,
                // price_point: 33
                role: this.role,
                room_id: this.roomId,
                updated_at: appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss"),
                user_id: this.user.id,
                ..._.has(payload, "type") && {type: payload.type},
                keyFakeIdAndRemoveWhenApi: true, // Fixed
            }

            let results = appUtility.convertDataMessageListChat([eventData], this.user.id);

            this.getMessagesListSuccess.push(results[0]);

            setTimeout(() => this.lastScrollMax(), 500);
        },
        renderDataMsgForGift: function (payload) {
            let eventData = {
                avatar: "",
                content: null,
                created_at: appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss"),
                gift: payload.dataInfoGift,
                id: Math.random().toString(36).substr(2, 9), // Fill show data, not use when feature
                image: null,
                // price_point: 33
                role: this.role,
                room_id: this.roomId,
                updated_at: appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss"),
                user_id: this.user.id,
                ..._.has(payload, "type") && {type: payload.type},
                keyFakeIdAndRemoveWhenApi: true, // Fixed
            }

            let results = appUtility.convertDataMessageListChat([eventData], this.user.id);
            this.getMessagesListSuccess.push(results[0]);
            this.lastScrollMax();
        },
        checkOrderForCastInterval: function () {
            let self = this
            self.timeInterval = setInterval(() => {
                self.fetchDataOrderForCast();
            }, self.timeSetInterval)
        },
        fetchDataOrderForCast: function () {
            this.$store.dispatch("fetchDataOrderOfCastNowDispatch", {roomId: this.roomId})
        },
        eventActionDataConfirmOrder: async function (data) {
            // Check status
            if (_.has(data, "status") && data.status === "confirm_matching_success") {
                let textFormatMsgConfirmMatching = await appUtility.renderCodeSnippet(CHAT_MESSAGE_FORMAT_CONFIRM_ORDER_1vs1, {userName: this.user.nickname});
                let reqData = {
                    room_id: this.roomId,
                    content: textFormatMsgConfirmMatching,
                    type: this.KEY_CHAT_TYPE_MESSAGE.ACCESS_ORDER,
                }
                this.$store.dispatch("addMessageDispatch", {data: reqData});

                await this.renderDataMsgForText(reqData);
                // Push message
            } else {
                // Show error by  notice
                this.setTimeoutAlertNotice("alert_error", "エラーがあります！ もう一度やり直してください");
            }
        },
        eventActionDataCancelConfirmOrder: async function (data) {
            // Check status
            if (_.has(data, "status") && data.status === "cancel_matching_success") {
                let textFormatMsgCancelConfirmMatching = await appUtility.renderCodeSnippet(CHAT_MESSAGE_FORMAT_CANCEL_CONFIRM_ORDER_1vs1, {
                    userName: this.user.nickname,
                    dateTime: appUtility.dateFormat(appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss"), "HH:mm")
                });
                let reqData = {
                    room_id: this.roomId,
                    content: textFormatMsgCancelConfirmMatching,
                    type: this.KEY_CHAT_TYPE_MESSAGE.GENERAL,
                }
                this.$store.dispatch("addMessageDispatch", {data: reqData});

                await this.renderDataMsgForText(reqData);
                // Push message
            } else {
                // Show error by  notice
                this.setTimeoutAlertNotice("alert_error", "エラーがあります！ もう一度やり直してください");
            }
        },
        eventActionDataCancelConfirmOrderByUser: async function (data) {
            // Check status
            if (_.has(data, "status") && data.status === "cancel_order_success_by_user") {
                let textFormatMsgCancelConfirmMatching = await appUtility.renderCodeSnippet(CHAT_MESSAGE_FORMAT_CANCEL_CONFIRM_ORDER_1vs1, {
                    userName: this.user.nickname,
                    dateTime: appUtility.dateFormat(appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss"), "HH:mm")
                });
                let reqData = {
                    room_id: this.roomId,
                    content: textFormatMsgCancelConfirmMatching,
                    type: this.KEY_CHAT_TYPE_MESSAGE.GENERAL,
                }
                this.$store.dispatch("addMessageDispatch", {data: reqData});

                await this.renderDataMsgForText(reqData);
                // Push message
            } else {
                // Show error by  notice
                this.setTimeoutAlertNotice("alert_error", "エラーがあります！ もう一度やり直してください");
            }
        },
        eventActionDataStartOrderMatching: async function (data) {
            // Check status
            if (_.has(data, "status") && data.status === "start_matching_success") {
                // Push message
                let dateTime = this.infoOrderOfCast.order_real_times && Object.keys(this.infoOrderOfCast.order_real_times).length
                && _.has(this.infoOrderOfCast, "order_real_times.real_start_time") && appUtility.isValidDate(this.infoOrderOfCast.order_real_times.real_start_time)
                    ? appUtility.dateFormat(this.infoOrderOfCast.order_real_times.real_start_time, "HH:mm") : appUtility.momentTzNow("HH:mm")

                let textFormatMsgStartMatching = await appUtility.renderCodeSnippet(CHAT_MESSAGE_CAST_JOINED_MEETING, {
                    userName: this.user.nickname,
                    dateTime
                });

                let reqData = {
                    room_id: this.roomId,
                    content: textFormatMsgStartMatching,
                    type: this.KEY_CHAT_TYPE_MESSAGE.GENERAL,
                }
                this.$store.dispatch("addMessageDispatch", {data: reqData});

                await this.renderDataMsgForText(reqData);
            } else {
                // Show error by  notice
                this.setTimeoutAlertNotice("alert_error", "合流参加できません。もう一度やり直してください");
            }
        },
        eventActionDataLastTime10mOrderMatching: async function (data) {
            // Check status
            if (_.has(data, "status") && data.status === "status_last_time_10m_matching") {
                // Push message
                let textFormatMsgLastTime10mMatching = await appUtility.renderCodeSnippet(CHAT_MESSAGE_CAST_LAST_10_BEFORE_END_TIME, {userName: this.user.nickname});

                let reqData = {
                    room_id: this.roomId,
                    content: textFormatMsgLastTime10mMatching,
                    type: this.KEY_CHAT_TYPE_MESSAGE.GENERAL,
                }
                this.$store.dispatch("addMessageDispatch", {data: reqData});

                await this.renderDataMsgForText(reqData);
            }
        },
        eventActionDataEndOrderMatching: async function (data) {
            // Check status
            if (_.has(data, "status") && data.status === "end_matching_success") {
                let dateTime = this.infoOrderOfCast.order_real_times && Object.keys(this.infoOrderOfCast.order_real_times).length
                && _.has(this.infoOrderOfCast, "order_real_times.real_end_time") && appUtility.isValidDate(this.infoOrderOfCast.order_real_times.real_end_time)
                    ? appUtility.dateFormat(this.infoOrderOfCast.order_real_times.real_end_time, "HH:mm") : appUtility.momentTzNow("HH:mm")

                let textFormatMsgEndMatching = await appUtility.renderCodeSnippet(CHAT_MESSAGE_CAST_DISBANDED, {
                    userName: this.user.nickname,
                    dateTime
                });
                let reqData = {
                    room_id: this.roomId,
                    content: textFormatMsgEndMatching,
                    type: this.KEY_CHAT_TYPE_MESSAGE.GENERAL,
                }
                this.$store.dispatch("addMessageDispatch", {data: reqData});

                await this.renderDataMsgForText(reqData);
                // Push message
            } else {
                // Show error by  notice
                this.setTimeoutAlertNotice("alert_error", "解散できません。もう一度やり直してください");
            }
        },
        callBackListenEventMatching: async function (data) {
            // Process via event
            if (!data.hasOwnProperty("atcTypeOrderMatching")) {
                return;
            }
            if (data.atcTypeOrderMatching === 'act_confirm_matching') {
                // Check status
                await this.eventActionDataConfirmOrder(data);
            }
            if (data.atcTypeOrderMatching === 'act_cancel_matching') {
                // Check status
                await this.eventActionDataCancelConfirmOrder(data)
            }
            if (data.atcTypeOrderMatching === 'act_start_matching') {
                // Check status
                await this.eventActionDataStartOrderMatching(data)
            }
            if (data.atcTypeOrderMatching === 'act_last_time_10m_matching') {
                // Check status
                //await this.eventActionDataLastTime10mOrderMatching(data)
            }
            if (data.atcTypeOrderMatching === 'act_end_matching') {
                // Check status
                await this.eventActionDataEndOrderMatching(data)
            }
        }
    },
    watch: {
        giftStatusType: function (statusType, from) {
            let self = this;
            if (statusType) {
                switch (statusType) {
                    case self.constant.STATUS_REQUEST_GIFT_PROCESS.PAYMENT_GIFT_CREATE: {
                        self.readyRequestPaymentSendGift();
                        break
                    }
                    case self.constant.STATUS_REQUEST_GIFT_PROCESS.PAYMENT_ORDER_THROW: {
                        self.isShowActionGift = false;
                        setTimeout(() => self.overlay = false, 200)
                        break;
                    }
                    case self.constant.STATUS_REQUEST_GIFT_PROCESS.PAYMENT_GIFT_SUCCESS: {
                        self.readyRequestSendGift();
                        self.isShowActionGift = false;
                        break
                    }
                    case self.constant.STATUS_REQUEST_GIFT_PROCESS.CREATE_GIFT_FAIL: {
                        setTimeout(() => self.overlay = false, 200)
                        break;
                    }
                    case self.constant.STATUS_REQUEST_GIFT_PROCESS.CREATE_GIFT_FINISH: {
                        setTimeout(() => self.overlay = false, 200)
                        break
                    }
                }
            }
        },
        messagesListSuccess: function (newVal, oldVal) {
            if (this.firstLoadData) {
                this.initialList(); // Init register scroll
            } else {
                this.$nextTick(() => {
                    this.restoreScrollPosition();
                });
            }
        }
    },
    created() {
        let self = this;

        let roomId = self.objThreadChat.roomId;
        self.roomId = roomId
        self.getListMessageInfo();

        // Event socket
        Echo.channel(`channel_room_chat_${roomId}`).listen('MessagePosted', (eventData) => {
            // Process other
            // Check type
            if (!_.has(eventData, "typeMessage")) {
                return
            }
            if (TYPE_CHANNEL_ROOMS["thread_new_messages"] === eventData.typeMessage) {
                if (eventData && _.has(eventData, "data.user_id") && eventData.data.user_id !== this.user.id) {
                    let convertData = appUtility.convertDataMessageListChat([eventData.data], self.user.id);

                    self.getMessagesListSuccess.push(convertData[0]);

                    self.vModelChat = '';
                    self.$nextTick(() => {
                        setTimeout(() => self.lastScrollMax(), 400);
                    });
                }
            }
            if (TYPE_CHANNEL_ROOMS["thread_block_channel"] === eventData.typeMessage) {
                if (eventData && _.has(eventData, "data")) {
                    let convertData = _.pick(eventData.data, ["id", "room_id", "is_read", "type", "is_block"]);
                    convertData.roomId = eventData.roomId;

                    if (_.has(convertData, 'is_block')) {
                        convertData.isBlock = convertData.is_block;
                    }
                    self.$nextTick(() => {
                        self.$store.dispatch("updateStoreListRoomByFieldIsBlockDispatch", convertData)
                    })
                }
            }
            if (TYPE_CHANNEL_ROOMS["thread_update_order_channel"] === eventData.typeMessage) {
                self.$store.dispatch("listOrderOfUserDispatch", {roomId: roomId});
                self.fetchDataOrderForCast();
            }
        });

        if (!!self.isUser && self.actionTypeChat === this.KEY_CHAT_TYPE_SINGLE) {
            self.$store.dispatch("listGiftDispatch", {});
            self.$store.dispatch("listOrderOfUserDispatch", {roomId: roomId});
        }

        // Get order of cast
        if (self.isCast && self.objThreadChat.type !== self.KEY_CHAT_TYPE_SUPPORT) {
            self.fetchDataOrderForCast(); // Init
            self.checkOrderForCastInterval(); // trigger data
        }
    },
    beforeCreate: function () {
        // Mount component for recursive
        this.$options.components.UserProfilesComponent = require('./../../components/UserProfilesComponent.vue').default;
    },
    destroyed() {
        this.vModelChat = "";
        this.tab = 0;
        this.clickUrl = "";
        this.typeNotice = "";
        this.alertMessageNotice = "";
        this.isShowNotice = false;
        this.imageFile = "";
        this.imageUrl = "";
        this.scrollVal = null;
        if (!!this.timeInterval) {
            clearInterval(this.timeInterval);
        }

        this.timeInterval = null
        this.typePaymentInfoSuccess = "";
        this.firstLoadData = true
    }
}
</script>
<style lang="scss">
.v-list--three-line .v-list-item .v-list-item__content,
.v-list-item--three-line .v-list-item__content {
    align-self: self-end !important;
}

.v-list--three-line .v-list-item, .v-list-item--three-line {
    min-height: unset !important;
}

.v-list--three-line .v-list-item .v-list-item__subtitle,
.v-list-item--three-line .v-list-item__subtitle,
.wrap-text {
    -webkit-line-clamp: unset !important;
}

.v-list-item__content.d-msg-right {
    flex: unset !important;
}

.d-custom-box-chat-msg {
    textarea,
    & {
        max-height: 125px !important;
    }

    .v-input__control {
        margin-top: 10px;
    }
}

.d-card-list-thread-chat {
    .v-chat-user,
    .v-chat-cast {
        .v-list-item__subtitle.d-quote-code {
            border: 1px solid #ebedf0 !important;
        }
    }
}

.d-chat-footer {
    .d-action-thread-chat {
        line-height: 0;
        border: none;

        .d-calender-box > span {
            width: 19px;
        }

        .v-btn {
            margin-left: 12px;
        }
    }
}

.d-box-show-gift-wrap {
    border: 1px solid #f0f8ffb3;
    border-radius: 5px;
    text-align: center;
    background: #f0f8ffb3;

    .d-show-success-gift {
        font-size: 12px;
        color: #d273acc2;
        font-style: oblique;
    }

    .d-show-gift-not-me {
        //background: #c1d7de;
        //border: 1px solid #c1d7de;
        color: rgba(212, 109, 171, 0.76);
    }
}
</style>
