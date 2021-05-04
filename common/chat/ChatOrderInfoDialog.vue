<template>
    <div>
        <v-dialog v-model="showLoginDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
            <v-card :class="[`d-list-chat`, 'd-box-list-chat']" :id="`dialog-list-chat`">
                <v-card-title :id="'d-card-title-detail-info-group'"
                              :class="[`headline d-header-box-detail-info-group p-0`, 'd-border-bottom']">
                    <div class="card-header-top">
                        <button v-on:click="clickClose">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">予約一覧</div>
                    </div>
                </v-card-title>
                <v-card-text :id="'d-card-text-detail-info-group'" class="d-card-text-detail-info-group p-0">
                    <v-col class="d-card-list-chat p-0">
                        <v-list :class="[`d-list-notification`, 'p-0']" v-if="hasDataOrderOfUsers">
                            <template v-for="(item, index) in listOrderOfUsers" role="button">
                                <v-list-item :key="index" :class="[`d-list-chat-item`, 'm-0', 'p-0', 'mt-1']">
                                    <v-list-item-content class="p-0">
                                        <v-list-item-title class="mt-2">
                                            <v-col class="d-flex justify-content-between p-0">
                                                <div class="d-inline-flex p-0">
                                                    <div class="d-time-plan-list-order">合流確定</div>
                                                    <div class="pl-2 d-time-plan-cast-time">
                                                        {{ infoOrderShow(item) }}
                                                    </div>
                                                </div>
                                            </v-col>
                                        </v-list-item-title>

                                        <v-list-item-subtitle :class="['text-wrap']">
                                            <v-col class="d-flex justify-content-between p-0 pt-2">
                                                <div class="p-0 m-0">合流予定</div>
                                                <div class="p-0 m-0">{{ scheduledToJoinFormat(item) }}</div>
                                            </v-col>
                                            <v-col class="d-flex justify-content-between p-0 pt-2">
                                                <div>キャスト人数</div>
                                                <div>{{ numberOfCastFormat(item) }}</div>
                                            </v-col>
                                            <v-col class="d-flex justify-content-between p-0 pt-2">
                                                <div>設定時間</div>
                                                <div>{{ setTimeFormant(item) }}</div>
                                            </v-col>
                                            <!--                                            <v-col class="d-flex justify-content-between p-0 pt-2"-->
                                            <!--                                                   v-if="typeOrder(item) ==='group'">-->
                                            <!--                                                <div>キャストクラス</div>-->
                                            <!--                                                <div>VIP (おすすめ)</div>-->
                                            <!--                                            </v-col>-->
                                            <v-col class="d-flex justify-content-between p-0 pt-2"
                                                   v-if="typeOrder(item) ==='group' && hasPlace">
                                                <div>場所</div>
                                                <div>{{ placeFormant(item) }}</div>
                                            </v-col>
                                            <v-col class="d-flex justify-content-between p-0 pt-2"
                                                   v-if="hasTotalPrice(item)">
                                                <div>合計</div>
                                                <div>{{ totalPriceFormat(item) }}</div>
                                            </v-col>
                                            <v-col class="d-flex justify-content-between p-0 pt-2">
                                                <div>ステータス</div>
                                                <div>{{ statusOrderFormat(item) }}</div>
                                            </v-col>
                                            <v-col class="p-0 pt-2 d-flex justify-content-end">
                                                <v-btn :disabled="notCancelOrder(item)" outlined color="red"
                                                       @click="confirmEventCloserOrder(item)"
                                                       :class="[{'d-opacity-60': notCancelOrder(item)}]">
                                                    キャンセル
                                                </v-btn>
                                            </v-col>
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-list>
                        <template v-else>
                            <p>注文はありません</p>
                        </template>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-if="hasInfoOrder && dialogCloseOrder" v-model="dialogCloseOrder" persistent max-width="310"
                  @keydown.esc="dialogCloseOrder = false" @click:outside="dialogCloseOrder = false">
            <v-card>
                <v-card-title class="p-2">
                    <p class="p-0 m-0" v-if="typeStatus === 'type_3_before_start'">予約をキャンセルしますか？</p>
                    <p class="p-0 m-0" v-if="typeStatus === 'type_2_before_start'">予約をキャンセルしますか？</p>
                </v-card-title>
                <v-card-text class="p-3">
                    <p v-if="typeStatus === 'type_3_before_start'">予約のキャンセルは金額が返金されます。</p>
                    <p v-if="typeStatus === 'type_2_before_start'">予約のキャンセルは金額が返金されません。</p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="() => dialogCloseOrder = false">キャンセル</v-btn>
                    <v-btn color="green darken-1" text @click="eventCloserOrderToServer">申請する</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import IconSvgComponent from "../../common/IconSvgComponent";
import appUtility from "../../utils/app-utility";
import {
    ORDER_STATUS_CANCEL,
    ORDER_STATUS_FINISH,
    ORDER_STATUS_HAS_RECRUITED_ENOUGH_CAST,
    ORDER_STATUS_PAID,
    ORDER_STATUS_USER_CANCEL
} from "../../utils/constant";

export default {
    data: () => ({
        dialogCloseOrder: false,
        listOrderOfUsers: [],
        infoOrder: {}
    }),
    props: {
        classList: {
            type: String,
            defaultValue: ""
        },
        btnTitle: {
            type: String,
            defaultValue: ""
        },
        titleName: {
            type: String,
            defaultValue: ""
        },
        roomId: {
            required: true
        },
        isShowDialog: {
            type: Boolean,
            required: true
        },
        funcCallbackClose: {
            type: Function,
            required: true
        }
    },
    model: {
        event: ["eventCancelOrderByUser"]
    },
    components: {
        IconSvgComponent
    },
    mounted() {
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            listOrderOfUser: state => state.book.listOrderOfUser,
            user: state => state.user.user,
        }),
        ...mapGetters({
            // errorLoginMessage: "errorLoginMessage",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showLoginDialog: function () {
            return !!this.isShowDialog
        },
        hasDataOrderOfUsers: function () {
            return !!this.listOrderOfUsers.length
        },
        hasInfoOrder: function () {
            return !!Object.keys(this.infoOrder).length
        },
        typeStatus: function () {
            if (!this.hasInfoOrder || !this.infoOrder.status) {
                return ""
            }
            // 2
            if (+this.infoOrder.status === ORDER_STATUS_HAS_RECRUITED_ENOUGH_CAST) {
                if (_.has(this.infoOrder, "order_real_time_alls")) {
                    let filterData = this.infoOrder.order_real_time_alls.filter(item => (item.real_start_time || item.real_end_time));
                    if (filterData || filterData.length) {
                        return "type_2_in_or_after_start";
                    }
                }

                return "type_2_before_start"
            }
            // 3
            if (+this.infoOrder.status === ORDER_STATUS_PAID) {
                return "type_3_before_start"
            }

            return ""
        }
    },
    methods: {
        typeOrder: function (infoOrder) {
            if (infoOrder && _.has(infoOrder, "number_cast")) {
                if (+infoOrder.number_cast === 1) {
                    return "single"
                } else if (+infoOrder.number_cast > 1) {
                    return "group"
                }
            }

            return ""
        },
        scheduledToJoinFormat: function (infoOrder) {
            return appUtility.isValidDate(infoOrder.schedule_join)
                ? appUtility.dateFormat(infoOrder.schedule_join, 'YYYY年MM月DD日HH:mm') : "";
        },
        numberOfCastFormat: function (infoOrder) {
            return infoOrder && _.has(infoOrder, "number_cast") ? `${infoOrder.number_cast}人` : "";
        },
        setTimeFormant: function (infoOrder) {
            return infoOrder && _.has(infoOrder, "meeting_time") ? `${infoOrder.meeting_time}時間` : "";
        },
        hasPlace: function (item) {
            return !!_.has(item, "place_id") && item.place_id
        },
        placeFormant: function (infoOrder) {
            let findIndex = infoOrder.place_id ? this.constant.LOCATION_ITEMS.findIndex(ele => {
                return ele.id === +infoOrder.place_id
            }) : -1

            if (findIndex !== -1) {
                return this.constant.LOCATION_ITEMS[findIndex].name
            }
            return "";
        },
        hasTotalPrice: function (item) {
            return item && _.has(item, "actual_point");
        },
        totalPriceFormat: function (item) {
            return item && _.has(item, "actual_point") && item.actual_point
                ? appUtility.formatPriceToFixed(item.actual_point) : '0P'
        },
        statusOrderFormat: function (item) {
            if (item && item.status) {
                if (+item.status === ORDER_STATUS_HAS_RECRUITED_ENOUGH_CAST) {
                    return "募集済み"
                } else if (+item.status === ORDER_STATUS_PAID) {
                    return "払い済み"
                }
            }
            return ""
        },
        infoOrderShow: function (infoOrder) {
            let infoTxt = ""
            if (infoOrder && _.has(infoOrder, "schedule_join")) {
                infoTxt = appUtility.isValidDate(infoOrder.schedule_join)
                    ? appUtility.dateFormat(infoOrder.schedule_join, 'YYYY年MM月DD日HH:mm') : "";
                infoTxt += `～１人${_.has(infoOrder, "meeting_time") ? infoOrder.meeting_time : ''}時間`;

                return infoTxt
            }

            return ``
        },
        checkTag: function (obj) {
            return _.has(obj, "tag") && obj.tag.length ? obj.tag[0] : ""
        },
        clickClose: function () {
            if (this.funcCallbackClose) {
                this.funcCallbackClose({isClose: true})
            }
        },
        confirmEventCloserOrder: function (data) {
            this.$nextTick(() => {
                this.infoOrder = data
                this.dialogCloseOrder = true
            })
        },
        eventCloserOrderToServer: function () {
            if (!Object.keys(this.infoOrder).length || !this.infoOrder.id) {
                return;
            }

            this.$store.dispatch("cancelOrderOfUserByUserDispatch", {
                orderId: this.infoOrder.id,
                roomId: this.roomId,
                data: {
                    room_id: this.roomId,
                    order_id: this.infoOrder.id, // Fix
                }
            }).then(res => {
                this.dialogCloseOrder = false;
                // Push event cancel order
                this.$emit("eventCancelOrderByUser", {infoOder: this.infoOder, status: "cancel_order_success_by_user"})
                // Todo
            }).catch(err => {
                this.dialogCloseOrder = false;
                this.$emit("eventCancelOrderByUser", {infoOder: this.infoOder, status: "cancel_order_fail_by_user"})
            });
        },
        getDataListOrderOfUserByRoom: function () {
            let keyRoomUser = `${this.roomId}_${this.user.id}`;

            let result = _.has(this.listOrderOfUser, keyRoomUser) && this.listOrderOfUser[keyRoomUser] ? this.listOrderOfUser[keyRoomUser] : [];

            return result.filter(ele => {
                if (ele.status === ORDER_STATUS_HAS_RECRUITED_ENOUGH_CAST && ele.order_real_time_alls && ele.order_real_time_alls.length) {
                    let filterData = ele.order_real_time_alls.filter(item => (item.real_start_time || item.real_end_time));
                    if (filterData || filterData.length) {
                        return false;
                    }
                }
                return true
            });
        },
        notCancelOrder: function (item) {
            if (!item || !_.has(item, 'status')) {
                return true
            }
            switch (+item.status) {
                case ORDER_STATUS_HAS_RECRUITED_ENOUGH_CAST:
                case ORDER_STATUS_USER_CANCEL:
                case ORDER_STATUS_CANCEL:
                case ORDER_STATUS_FINISH:
                    return true
                case ORDER_STATUS_PAID:
                    return false
                default:
                    return true
            }
        },
        updateDataListOrderUI: function (data) {
            this.$nextTick(() => {
                this.listOrderOfUsers = this.getDataListOrderOfUserByRoom()
            })
        },
    },
    created() {
        let self = this;
        self.listOrderOfUsers = self.getDataListOrderOfUserByRoom()
    },
    watch: {
        listOrderOfUser: {
            handler: function (newData, oldData) {
                this.updateDataListOrderUI(newData)
            },
            deep: true
        }
    },
    destroyed() {
        this.infoOrder = {}
    }
}
</script>

<style lang="scss">
.d-card-list-chat {
    .d-list-chat-item .v-list-item__subtitle {
        font-size: .875rem;
    }
}

.d-time-plan-list-order {
    background: #64DB88;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.75rem;
    letter-spacing: 0.3px;
    color: white;
    padding: 1px 9px;
}
</style>
