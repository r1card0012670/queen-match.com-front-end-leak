<template>
    <div :class="[`d-dialog-history-price p-0`]" v-if="showHistoryPricesDialog">

        <v-dialog v-if="isShowDialog" v-model="showHistoryPricesDialog"
                  :content-class="`d-dialog-show-fullscreen d-payment-info-wrapper`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="[`d-my-qrcode`]" :id="`dialog-payment-info`">
                <v-card-title :id="'d-card-title-payment-info'"
                              :class="[`headline d-header-box-payment-info p-0 d-header-border-width-3`, 'd-border-bottom']">
                    <div class="card-header-top">
                        <button v-on:click="clickCallbackEventDataClose">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">{{ btnTitle }}</div>
                    </div>
                </v-card-title>

                <v-card-text class="p-0">
                    <v-col class="col-12 p-0 pb-1 d-history-price-info">
                        <v-sheet>
                            <div class="card-body p-0 pt-4">
                                <div>現在の所有ポイント</div>
                            </div>
                            <div class="d-history-price-total pt-4">
                                <span>{{getCurrentPoint.point ? numberWithDot(getCurrentPoint.point) : 0}}</span>
                            </div>
                            <div class="pt-3">
                                <p>ポイントは3,000Pごとにオートチャージされます。</p>
                            </div>
                        </v-sheet>
                    </v-col>
                    <v-col v-if="Object.keys(monthGroup).length !== 0" class="col-12 p-0" >
                        <template v-for="(ite, ind) in monthGroup">
                            <v-col class="col-12 p-0">
                                <div class="p-2 v-setting-title-block">{{reformatMonth(ind)}}</div>
                            </v-col>
                            <div class="d-list-history-prices">
                                <v-card-text v-if="ite" class="d-flex justify-content-between p-0 flex-column" v-for="(item, index) in ite" :key="index">
                                    <div :class="`d-history-price-item`">
                                        <v-sheet class="card-body d-inline-flex card-body p-0" role="button">
                                            <v-list-item-content class="p-0">
                                                <v-list-item-title>{{item.point_type_name}}</v-list-item-title>

                                                <v-list-item-subtitle>
                                                    <div class="d-flex">
                                                        <div class="d-inline-flex">
                                                            {{reformatDate(item.created_at)}}
                                                        </div>
                                                        <div class="d-inline-flex">
                                                            <v-icon class="p-0">check_circle</v-icon>
                                                            <div class="d-history-price-status">完了</div>
                                                        </div>
                                                    </div>
                                                </v-list-item-subtitle>

                                            </v-list-item-content>
                                        </v-sheet>
                                        <div v-if="item.type === 1" class="d-inline-flex p-0 d-history-price-point minus">
                                            <div class="align-self-center">-{{ numberWithDot(item.point) }}</div>
                                        </div>
                                        <div v-else class="d-inline-flex p-0 d-history-price-point">
                                            <div class="align-self-center">+{{ numberWithDot(item.point) }}</div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </div>
                        </template>
                    </v-col>
                    <v-col v-else class="col-12 p-0">
                        <v-card-text :class="`pt-10 d-flex justify-content-center`">
                            <IconSvgComponent :type="'empty-state'"/>
                        </v-card-text>
                    </v-col>
                </v-card-text>

            </v-card>
        </v-dialog>
        <!--<loading :active.sync="loadingPoint"></loading>-->
    </div>
</template>

<script>

import C from "../../utils/constants";
import IconSvgComponent from "../../common/IconSvgComponent";
import {mapGetters, mapState} from "vuex";
import Loading from "vue-loading-overlay";
import appUtility from "../../utils/app-utility";

export default {
    data: function () {
        return {
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
        funcHistoryPriceCallBackClose: {
            type: Function,
            required: true
        },
        userInfo: {
            type: Object,
            required: false
        }
    },
    components: {
        IconSvgComponent,
        Loading
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
            getHistoriesPoint: state => state.user.getHistoriesPoint,
            getCurrentPoint: state => state.user.getCurrentPoint,
            loadingPoint: state => state.user.loadingPoint,
        }),
        ...mapGetters({
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        btnTitle: function () {
            return "ポイント履歴・領収書"
        },
        showHistoryPricesDialog: function () {
            return !!this.isShowDialog
        },
        monthGroup: function() {
            const arr = {};
            if (this.getHistoriesPoint && Object.keys(this.getHistoriesPoint).length) {
                this.getHistoriesPoint.forEach( item => {
                    const strDate = item.created_at.substr(0, 7);
                    const pointType = item.point_type;
                    let point_type_name = '';
                    if(pointType === 1) {
                        point_type_name = '友達紹介プレゼント';
                    } else if(pointType === 2) {
                        point_type_name = 'オートチャージ';
                    } else if(pointType === 3) {
                        point_type_name = 'オーダー返金';
                    } else if(pointType === 4) {
                        point_type_name = 'ギフト送信';
                    } else if(pointType === 5) {
                        point_type_name = 'オーダー支払';
                    } else if(pointType === 6) {
                        point_type_name = 'ギフト受信';
                    } else if(pointType === 7) {
                        point_type_name = '延長料金';
                    } else if(pointType === 8) {
                        point_type_name = 'オーダー料金';
                    } else if(pointType === 9) {
                        point_type_name = '個別オーダー手当';
                    } else if(pointType === 10) {
                        point_type_name = '管理者によるポイント変更';
                    } else if(pointType === 11) {
                        point_type_name = '支払要求ポイント';
                    }
                    item.point_type_name = point_type_name;
                    if (!arr[strDate]) {
                        arr[strDate] = [item];
                    } else {
                        arr[strDate].push(item);
                    }
                })
            }
            return arr;
        }
    },
    mounted: async function () {
        await this.historiesPointData();
        await this.currentPointData();
    },
    methods: {
        titleName: function (index) {
            let title = 'お支払い';
            index += 1;
            title = title + index;
            return title;
        },
        clickCallbackEventDataClose: function () {
            this.funcHistoryPriceCallBackClose(false);
        },
        historiesPointData: function () {
            this.$store.dispatch('getHistoriesPointDispatch', {user_id: this.user.id});
        },
        currentPointData: function () {
            this.$store.dispatch('getCurrentPointDispatch', {user_id: this.userInfo.id});
        },
        reformatDate: function (val) {
            let month = val.substr(5, 2);
            let date = val.substr(8, 2);
            let time = val.substr(11, 5);

            return date + '/' + month + ' - ' + time;
        },
        reformatMonth: function (val) {
            return val.replace('-', '年') + '月';
        },
        numberWithDot: function (value) {
            return value ? appUtility.formatPriceToFixed(value) : 0;
        }
    }
}
</script>
