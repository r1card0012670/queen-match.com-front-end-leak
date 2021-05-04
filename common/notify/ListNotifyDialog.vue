<template>
    <v-col :class="[`d-box-list-notify p-0`]" v-if="isShowDialog">
        <v-dialog v-model="showDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="`d-list-notify`" :id="`dialog-list-notify`">
                <v-card-title :id="'d-card-title-list-notify'"
                              :class="[`headline d-header-box-list-notify p-0`]">
                    <div class="card-header-top">
                        <button v-on:click="clickCloseDialog">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">{{ btnTitle }}</div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-list-notify'" class="d-card-text-list-notify p-0 bg-grey">
                    <v-col class="d-card-list-notify p-0">
                        <v-list :class="[`d-list-notification`, 'p-0']">
                            <div v-if="noData" class="mt-5 text-center">
                                お知らせはありません
                            </div>
                            <template v-else v-for="(item, index) in items">
                                <template v-if="item.type === constant.NOTIFICATION_EVENT.EVENT_CANCEL_ORDER">
                                    <v-list-item :key="index" @click="markNotificationAsRead(item)"
                                                 :class="[`d-list-notify-item`, 'mt-2', item.isRead === 0 ? 'active' : '']">
                                        <v-list-item-avatar :size="56" class="align-self-start" role="button">
                                            <v-img :eager="true" :src="renderSrc(item)"/>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-col class="d-flex justify-content-between align-items-center p-0">
                                                    <div class="d-inline-flex align-items-center">
                                                        <div class="pr-2">{{ item.source.nickname }}</div>
                                                    </div>
                                                    <div class="d-inline-flex justify-content-end d-notify-item-time">
                                                        {{ formatTimeNotify(item.created_at) }}
                                                    </div>
                                                </v-col>
                                            </v-list-item-title>
                                            <v-list-item-subtitle :class="['text-wrap pt-2']">
                                                <div class="d-body-notify  self-introduction">
                                                    オーダーがキャンセルされました。<br/>
                                                    日程：{{ formatDate(item.payload.schedule_join) }} ~<br/>
                                                    キャスト人数：{{ item.payload.number_cast }}名<br/>
                                                </div>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>

                                <template v-else-if="item.type === constant.NOTIFICATION_EVENT.EVENT_FINISH_ORDER">
                                    <v-list-item :key="index"
                                                 :class="[`d-list-notify-item`, 'mt-2', item.isRead === 0 ? 'active' : '']">
                                        <v-list-item-avatar :size="56" class="align-self-start"
                                                            role="button" @click="clickAvatarNotify(item.source)">
                                            <v-img :eager="true" :src="renderSrc(item)"/>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-col class="d-flex justify-content-between align-items-center p-0">
                                                    <div class="d-inline-flex align-items-center">
                                                        <div class="pr-2">
                                                            {{ item.source.nickname }}
                                                        </div>
                                                        <div v-if="checkTag(item.source)"
                                                             class="p-1 chip label-chip lighten-4">
                                                            {{ checkTag(item.source) }}
                                                        </div>
                                                    </div>
                                                    <div class="d-inline-flex justify-content-end d-notify-item-time">
                                                        {{ formatTimeNotify(item.created_at) }}
                                                    </div>
                                                </v-col>
                                            </v-list-item-title>
                                            <v-list-item-subtitle :class="['text-wrap pt-2']" role="button">
                                                <div class="d-body-notify self-introduction">
                                                    レビューします。
                                                </div>
                                                <v-btn v-if="!item.isRead"
                                                       @click="showReviewCastAfterOrder(item.source); markNotificationAsRead(item);"
                                                       class="p-0 btn-base mt-4" block>キャストをレビューする
                                                </v-btn>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>

                                <template v-else-if="item.type === constant.NOTIFICATION_EVENT.EVENT_CREATE_ORDER">
                                    <v-list-item :key="index" @click="markNotificationAsRead(item)"
                                                 :class="[`d-list-notify-item`, 'mt-2', item.isRead === 0 ? 'active' : '']">
                                        <v-list-item-avatar :size="56" class="align-self-start" role="button">
                                            <v-img :eager="true" :src="renderSrc(item)"/>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-col class="d-flex justify-content-between align-items-center p-0">
                                                    <div class="d-inline-flex align-items-center">
                                                        <div class="pr-2">{{ item.source.nickname }}</div>
                                                    </div>
                                                    <div class="d-inline-flex justify-content-end d-notify-item-time">
                                                        {{ formatTimeNotify(item.created_at) }}
                                                    </div>
                                                </v-col>
                                            </v-list-item-title>
                                            <v-list-item-subtitle :class="['text-wrap pt-2']" role="button">
                                                <div class="d-body-notify  self-introduction">
                                                    {{ item.content }}
                                                </div>
                                                <v-btn @click="showDetachInvoiceAfterOrder(item.payload)"
                                                       class="p-0 btn-base mt-4" block>詳細
                                                </v-btn>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>

                                <template v-else-if="item.type === constant.NOTIFICATION_EVENT.EVENT_ORDER_MORE">
                                    <v-list-item :key="index" @click="markNotificationAsRead(item)"
                                                 :class="[`d-list-notify-item`, 'mt-2', item.isRead === 0 ? 'active' : '']">
                                        <v-list-item-avatar :size="56" class="align-self-start" role="button">
                                            <v-img :eager="true" :src="renderSrc(item)"/>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-col class="d-flex justify-content-between align-items-center p-0">
                                                    <div class="d-inline-flex align-items-center">
                                                        <div class="pr-2">{{ item.source.nickname }}</div>
                                                    </div>
                                                    <div class="d-inline-flex justify-content-end d-notify-item-time">
                                                        {{ formatTimeNotify(item.created_at) }}
                                                    </div>
                                                </v-col>
                                            </v-list-item-title>
                                            <v-list-item-subtitle :class="['text-wrap pt-2']" role="button">
                                                <div class="d-body-notify  self-introduction">
                                                    {{ item.content }}
                                                </div>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>

                                <template
                                    v-else-if="item.type === constant.NOTIFICATION_EVENT.EVENT_RECRUITED_ENOUGH_CAST">
                                    <v-list-item :key="index" @click="markNotificationAsRead(item)"
                                                 :class="[`d-list-notify-item`, 'mt-2', item.isRead === 0 ? 'active' : '']">
                                        <v-list-item-avatar :size="56" class="align-self-start" role="button">
                                            <v-img :eager="true" :src="renderSrc(item)"/>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-col class="d-flex justify-content-between align-items-center p-0">
                                                    <div class="d-inline-flex align-items-center">
                                                        <div class="pr-2">{{ item.source.nickname }}</div>
                                                    </div>
                                                    <div class="d-inline-flex justify-content-end d-notify-item-time">
                                                        {{ formatTimeNotify(item.created_at) }}
                                                    </div>
                                                </v-col>
                                            </v-list-item-title>
                                            <v-list-item-subtitle :class="['text-wrap pt-2']" role="button">
                                                <div class="d-body-notify  self-introduction">
                                                    {{ item.content }}
                                                </div>
                                                <v-btn @click="showDetachInvoiceAfterOrder(item.payload)"
                                                       class="p-0 btn-base mt-4" block>詳細
                                                </v-btn>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>

                                <template v-else-if="item.type === constant.NOTIFICATION_EVENT.EVENT_FOLLOW_CAST">
                                    <v-list-item :key="index" @click="markNotificationAsRead(item)"
                                                 :class="[`d-list-notify-item`, 'mt-2', item.isRead === 0 ? 'active' : '']">
                                        <v-list-item-avatar :size="56" class="align-self-start"
                                                            role="button" @click="clickAvatarNotify(item.source)">
                                            <v-img :eager="true" :src="renderSrc(item)"/>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-col class="d-flex justify-content-between align-items-center p-0">
                                                    <div class="d-inline-flex align-items-center">
                                                        <div class="pr-2">{{ item.source.nickname }}
                                                        </div>
                                                        <div v-if="checkTag(item.source)"
                                                             class="p-1 chip label-chip lighten-4">
                                                            {{ checkTag(item.source) }}
                                                        </div>
                                                    </div>
                                                    <div class="d-inline-flex justify-content-end d-notify-item-time">
                                                        {{ formatTimeNotify(item.created_at) }}
                                                    </div>
                                                </v-col>
                                            </v-list-item-title>
                                            <v-list-item-subtitle :class="['text-wrap pt-2']" role="button">
                                                <div class="d-body-notify  self-introduction">
                                                    ユーザーがあなたのプロフィールを「いいね」にしました。
                                                </div>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>

                                <template v-else-if="item.type === constant.NOTIFICATION_EVENT.EVENT_ORDER_ONE_ON_ONE">
                                    <v-list-item :key="index" @click="markNotificationAsRead(item)"
                                                 :class="[`d-list-notify-item`, 'mt-2', item.isRead === 0 ? 'active' : '']">
                                        <v-list-item-avatar :size="56" class="align-self-start" role="button">
                                            <v-img :eager="true" :src="renderSrc(item)"/>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-col class="d-flex justify-content-between align-items-center p-0">
                                                    <div class="d-inline-flex align-items-center">
                                                        <div class="pr-2">{{ item.source.nickname }}</div>
                                                    </div>
                                                    <div class="d-inline-flex justify-content-end d-notify-item-time">
                                                        {{ formatTimeNotify(item.created_at) }}
                                                    </div>
                                                </v-col>
                                            </v-list-item-title>
                                            <v-list-item-subtitle :class="['text-wrap pt-2']" role="button">
                                                <div class="d-body-notify  self-introduction">
                                                    {{ item.content }}
                                                </div>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>

                                <template v-else-if="item.type === constant.NOTIFICATION_EVENT.EVENT_ORDER_MATCHED">
                                    <v-list-item :key="index" @click="markNotificationAsRead(item)"
                                                 :class="[`d-list-notify-item`, 'mt-2', item.isRead === 0 ? 'active' : '']">
                                        <v-list-item-avatar :size="56" class="align-self-start" role="button">
                                            <v-img :eager="true" :src="renderSrc(item)"/>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-col class="d-flex justify-content-between align-items-center p-0">
                                                    <div class="d-inline-flex align-items-center">
                                                        <div class="pr-2">{{ item.source.nickname }}</div>
                                                    </div>
                                                    <div class="d-inline-flex justify-content-end d-notify-item-time">
                                                        {{ formatTimeNotify(item.created_at) }}
                                                    </div>
                                                </v-col>
                                            </v-list-item-title>
                                            <v-list-item-subtitle :class="['text-wrap pt-2']" role="button">
                                                <div class="d-body-notify  self-introduction">
                                                    オーダーにマッチングされました。<br/>
                                                    日程：{{ formatDate(item.payload.schedule_join) }} ~<br/>
                                                    人数：{{ item.payload.meeting_time }}名<br/>
                                                </div>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>

                                <template
                                    v-else-if="item.type === constant.NOTIFICATION_EVENT.EVENT_PAYMENT_REQUEST_ACCEPTED">
                                    <v-list-item :key="index" @click="markNotificationAsRead(item)"
                                                 :class="[`d-list-notify-item`, 'mt-2', item.isRead === 0 ? 'active' : '']">
                                        <v-list-item-avatar :size="56" class="align-self-start" role="button">
                                            <v-img :eager="true" :src="renderSrc(item)"/>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-col class="d-flex justify-content-between align-items-center p-0">
                                                    <div class="d-inline-flex align-items-center">
                                                        <div class="pr-2">{{ item.source.nickname }}</div>
                                                    </div>
                                                    <div class="d-inline-flex justify-content-end d-notify-item-time">
                                                        {{ formatTimeNotify(item.created_at) }}
                                                    </div>
                                                </v-col>
                                            </v-list-item-title>
                                            <v-list-item-subtitle :class="['text-wrap pt-2']" role="button">
                                                <div class="d-body-notify  self-introduction">
                                                    支払要求が承認されました。詳細は支払歴史を参考して下さい。<br/>
                                                </div>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>

                                <template
                                    v-else-if="item.type === constant.NOTIFICATION_EVENT.EVENT_PAYMENT_REQUEST_REJECTED">
                                    <v-list-item :key="index" @click="markNotificationAsRead(item)"
                                                 :class="[`d-list-notify-item`, 'mt-2', item.isRead === 0 ? 'active' : '']">
                                        <v-list-item-avatar :size="56" class="align-self-start" role="button">
                                            <v-img :eager="true" :src="renderSrc(item)"/>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-col class="d-flex justify-content-between align-items-center p-0">
                                                    <div class="d-inline-flex align-items-center">
                                                        <div class="pr-2">{{ item.source.nickname }}</div>
                                                    </div>
                                                    <div class="d-inline-flex justify-content-end d-notify-item-time">
                                                        {{ formatTimeNotify(item.created_at) }}
                                                    </div>
                                                </v-col>
                                            </v-list-item-title>
                                            <v-list-item-subtitle :class="['text-wrap pt-2']" role="button">
                                                <div class="d-body-notify  self-introduction">
                                                    支払要求が却下されました。<br/>
                                                </div>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>

                                <template v-else-if="item.type === constant.NOTIFICATION_EVENT.EVENT_PRIOR_CAST">
                                    <v-list-item :key="index"
                                                 :class="[`d-list-notify-item`, 'mt-2', item.isRead === 0 ? 'active' : '']">
                                        <v-list-item-avatar :size="56" class="align-self-start" role="button">
                                            <v-img :eager="true" :src="renderSrc(item)"/>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <v-col class="d-flex justify-content-between align-items-center p-0">
                                                    <div class="d-inline-flex align-items-center">
                                                        <div class="pr-2">{{ item.source.nickname }}</div>
                                                    </div>
                                                    <div class="d-inline-flex justify-content-end d-notify-item-time">
                                                        {{ formatTimeNotify(item.created_at) }}
                                                    </div>
                                                </v-col>
                                            </v-list-item-title>
                                            <v-list-item-subtitle :class="['text-wrap pt-2']" role="button">
                                                <div class="d-body-notify">
                                                    以下のオーダーに優先マッチングされました。参加しますか。<br/>
                                                    日程：{{ formatOrderDateTime(item.schedule_join) }}<br/>
                                                    人数：{{ item.payload.number_cast }}名<br/>
                                                    時間：{{ item.payload.meeting_time }}時間<br/>
                                                    消費ポイント：{{ midnightChargeIncluded(item.payload) }}<br/>
                                                    （延長：{{ pointChargeOnHours }}/15分）<br/>
                                                </div>
                                                <div class="row" v-if="item.isRead === 0">
                                                    <div class="col-6">
                                                        <v-btn
                                                            @click="cancelOrderCast(item.payload); markNotificationAsRead(item);"
                                                            class="p-0 btn-base mt-4" block>キャンセル
                                                        </v-btn>
                                                    </div>
                                                    <div class="col-6">
                                                        <v-btn
                                                            @click="acceptOrder(item.payload); markNotificationAsRead(item);"
                                                            class="p-0 btn-base mt-4" block>参加
                                                        </v-btn>
                                                    </div>
                                                </div>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>
                            </template>

                            <div ref="infiniteScrollNotify"></div>
                        </v-list>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-if="isActiveDialog" v-model="isActiveDialog" :content-class="`d-dialog-show-fullscreen`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
            <!-- Detail User -->
            <UserProfilesComponent v-if="isActiveDialog" :typeAction="'SHOW_PROFILE_OTHER'" :name="'notify2ShowProfile'" :listUserOrCastData="listUserOrCastData"
                                   :userInfo="userInfo"
                                   @eventCloseProfile="funcCloseProfile"/>
        </v-dialog>

        <ReviewCastDialog v-if="isUser && isShowReviewCastAfterOrder && userId"
                          v-on:fetch_detail_review_cast="fetchDetailReviewCast"
                          :isShowDialog="isShowReviewCastAfterOrder" :userId="userId"
                          :funcCloseEventData="() => isShowReviewCastAfterOrder = false"/>

        <DetachInvoiceDialog v-if="isUser && isShowDetachInvoiceAfterOrder && order" :order="order"
                             :isShowDialog="isShowDetachInvoiceAfterOrder"
                             :funcCloseEventData="() => isShowDetachInvoiceAfterOrder = false"/>
    </v-col>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import IconSvgComponent from "../../common/IconSvgComponent";
import UserProfilesComponent from "../../components/UserProfilesComponent";
import appUtility from "../../utils/app-utility";
import ReviewCastDialog from "../../common/book/ReviewCastDialog";
import DetachInvoiceDialog from "../../common/book/DetachInvoiceDialog";
import {TYPE_ROLE_USER} from "../../utils/constant";
import processDataUserProfile from "../../mixin/processDataUserProfile";
import moment from "moment";

export default {
    mixins: [
        processDataUserProfile
    ],
    data: () => ({
        isActiveDialog: false,
        userInfo: {},
        userId: "",
        isShowReviewCastAfterOrder: false,
        isShowDetachInvoiceAfterOrder: false,
        items: [],
        noData: false,
        order: null,
        observer: null,
        listUserOrCastData: null,
    }),
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
        btnTitle: {
            type: String,
            required: true
        },
        iconBtnTitle: {
            type: String,
            required: false,
            default: "arrow_back"
        },
    },
    components: {
        IconSvgComponent,
        UserProfilesComponent,
        ReviewCastDialog,
        DetachInvoiceDialog,
    },
    mounted() {
        let self = this;
        self.scrollTrigger();
    },
    computed: {
        ...mapState({
            role: state => state.user.role,
        }),
        ...mapGetters({
            user: 'user',
            prices: 'prices',
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showDialog: function () {
            return this.isShowDialog
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        lastNotificationId: function () {
            if (this.items.length) {
                return this.items[this.items.length - 1].id;
            }

            return null;
        },
        pointChargeOnHours: function () {
            if(this.prices) {
                return (_.has(this.prices, "normal_price") ? "+" + this.numberWithFormat(Math.round(this.prices.normal_price.value * this.constant.PRICE.ORDER_MORE_RATIO / 2)) : "")
            }

            return 0;
        },
    },
    methods: {
        ...mapActions({
            fetchNotification: 'fetchNotification',
            applyOrder: 'applyOrder',
            cancelOrder: 'cancelOrder',
        }),
        acceptOrder: function (order) {
            const payload = {
                orderId: order.id,
            };

            this.applyOrder(payload).then(res => {
            }).catch(error => {
                console.log(error);
            });
        },
        cancelOrderCast: function (order) {
            const payload = {
                orderId: order.id,
            };

            this.cancelOrder(payload).then(res => {
            }).catch(error => {
                console.log(error);
            });
        },
        fetchListNotify: function () {
            this.$store.dispatch('fetchNotification', {last_id: this.lastNotificationId}).then(response => {
                if (_.has(response, "data") && _.isArray(response.data)) {
                    this.items.push(...response.data);

                    if (this.items.length === 0) {
                        this.noData = true;
                    }
                }
            }).catch(error => {
                // console.log(error);
            });
        },
        scrollTrigger: function () {
            let self = this;
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0 || _.isNull(self.lastNotificationId) || +self.lastNotificationId === 0) {
                        self.fetchListNotify();
                    }
                });
            });

            if (!!self.$refs.infiniteScrollNotify) {
                this.observer.observe(self.$refs.infiniteScrollNotify);
            }
        },
        clickCloseDialog: function () {
            this.funcCloseDialog(false);
        },
        formatTimeNotify: function (date) {
            return appUtility.isValidDate(date) ? appUtility.dateFormat(date, "MM/DD HH:mm") : ""
        },
        checkTag: function (obj) {
            if (obj.cast_type) {
                return this.constant.CAST_TYPE.find(item => {
                    return obj.cast_type == item.id;
                }).name;
            }
            if (obj.user_type) {
                return this.constant.USER_TYPE.find(item => {
                    return obj.user_type == item.id;
                }).name;
            }

            return null;
        },
        funcCloseProfile: function (data) {
            this.isActiveDialog = false;
            this.userInfo = {}
        },
        clickAvatarNotify: async function (itemData) {
            // Validate
            if (!itemData || !_.has(itemData, "id") || !itemData.id) {
                return;
            }

            let data = await this.initFetchUserORCastAsync(itemData.id)
            // Validate user or cast
            if (!_.has(data, "user.id")) {
                return
            }

            this.$nextTick(() => {
                this.userInfo = data.user;

                this.listUserOrCastData = data.suggestUserOrCast;
                // Init data for before use component UserProfilesComponent
                this.initProcessDataUserProfile({
                    userOrCastId: data.user.id,
                    fetchDataBeforeById: data.user,
                    options: {role: {...data.dataRole}}
                });
                this.isActiveDialog = true;
            })
        },
        showReviewCastAfterOrder: async function (itemData) {
            if (!this.isUser) {
                return;
            }

            this.userId = `${itemData.id}`;
            this.isShowReviewCastAfterOrder = true;
        },
        showDetachInvoiceAfterOrder: function (itemData) {
            this.order = itemData;
            this.isShowDetachInvoiceAfterOrder = true;
        },
        fetchDetailReviewCast: function (data) {
            if (data && _.has(data, 'type') && data.type === 'fetch_detail_review_cast_throw') {
                this.isShowReviewCastAfterOrder = false;
            }
        },
        markNotificationAsRead: function (notification) {
            this.$store.dispatch('markNotificationAsRead', {id: notification.id})
                .then(response => {
                    const index = this.items.findIndex((element) => element.id === notification.id);
                    const newNotification = {...notification, isRead: true};
                    this.items.splice(index, 1, newNotification);
                })
        },
        formatDate: function (date) {
            return appUtility.dateFormat(date, 'YYYY年MM月DD日HH:mm');
        },
        renderSrc: function (item) {
            return item.source.avatar ? item.source.avatar : this.constant.AVATAR_DEFAULT
        },
        formatOrderDateTime(date) {
            return appUtility.dateFormat(date, "YYYY年MM月DD日 (ddd) HH:mm ~")
        },
        hasNightCharge: function (order) {
            console.log(order)
            const startTime = moment(order.schedule_join.split(' ')[1], 'h:mm:ss');
            const endTime = moment(order.schedule_join.split(' ')[1], 'h:mm:ss').add(order.meeting_time, 'hours');
            const nightTimeStart = moment('23:45:00', 'h:mm:ss');
            const nightTimeEnd = moment('06:00:00', 'h:mm:ss').add(1, 'days');

            return startTime.isBetween(nightTimeStart, nightTimeEnd) || endTime.isBetween(nightTimeStart, nightTimeEnd) || (startTime.isBefore(nightTimeStart) && endTime.isAfter(nightTimeEnd));
        },
        midnightChargeIncluded: function (order) {
            let total = this.prices.normal_price.value * order.meeting_time * 2;

            if (this.hasNightCharge(order)) {
                total += this.constant.PRICE.NIGHT_CHARGE;
            }

            return this.numberWithFormat(Math.round(total));
        },
        numberWithFormat: function (value) {
            return value ? appUtility.formatPriceToFixed(value) : 0;
        },
    },
    watch: {
        isActiveDialog: function (t, f) {
            // console.log("ListNotifyDialog::isActiveDialog", f, t)
        }
    },
    created() {
        Echo.channel(`content-notification.${this.user.id}`).listen('.notification_channel', (data) => {
            if (data) {
                this.items.unshift(data.data);
            }
        });

        if (Object.keys(this.prices).length === 0) {
            this.$store.dispatch('getPrices');
        }
    },
    destroyed() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
</script>

<style lang="scss" scoped>
.self-introduction {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    padding-bottom: 0;
}

.v-list-item__title {
    .pr-2 {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .d-inline-flex {
        width: calc(100% - 80px);
    }
}
</style>
