<template>
    <div>
        <v-dialog v-model="show"
                  :content-class="`d-dialog-show-fullscreen d-detail-edit-card-wrapper`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition"
        >
            <v-card :class="[`d-my-qrcode bg-grey`]" :id="`dialog-detail-edit-card`">
                <v-card-title :id="'d-card-title-detail-edit-card'"
                              :class="[`headline d-header-box-detail-edit-card p-0`]">
                    <div class="card-header-top">
                        <button @click="closeDialog">
                            <v-img contain src="../../images/times.svg"/>
                        </button>
                        <div class="d-title">支払歴史</div>
                    </div>
                </v-card-title>
                <h6 class="text-center mt-5" v-if="noData">
                    支払歴史がありません。
                </h6>
                <v-card scrollable>
                    <v-card-text v-for="item in paymentHistories" :key="item.id"
                                 :class="`d-card-text-payment-info`">
                        <v-card-text class="d-flex justify-content-between pr-0 pl-0 d-card-item">
                            <v-sheet class="d-inline-flex card-body p-0" role="button">
                                <v-list-item-content>
                                    <v-list-item-title>{{ formatDateTime(item.created_at) }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ numberWithDot(item.point) }}ポイント⇔換算{{
                                            numberWithDot(item.conversion_money)
                                        }}円
                                    </v-list-item-subtitle>
                                    <div class="d-flex">
                                        状況 :<span :class="getStatusClass(item.status)">
                                        {{ getPaymentStatus(item.status) }}</span>
                                    </div>
                                    <v-btn v-if="item.status === constant.PAYMENT_REQUEST_STATUS.accepted"
                                           @click="showPaymentImage(item.image)"
                                           class="p-0 btn-base mt-4" block>詳細
                                    </v-btn>
                                </v-list-item-content>
                            </v-sheet>
                        </v-card-text>
                    </v-card-text>

                    <div ref="infiniteScrollBankAccountPay"></div>
                </v-card>
            </v-card>
        </v-dialog>
        <loading :active.sync="loading"></loading>

        <v-dialog v-model="showPaymentDialog" :content-class="`d-dialog-show-fullscreen`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
            <v-card :class="['d-border-radius-top-15']">
                <v-card-title :id="'d-card-title-detach-invoice'"
                              :class="[`headline d-header-box-action-detach-invoice p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center d-custom-header p-2 d-width-100">
                        <button class="d-flex pl-2 pr-3" v-on:click="showPaymentDialog = false">
                            <v-img src="../../images/times.svg"></v-img>
                        </button>
                    </div>
                </v-card-title>
                <v-card-text class="p-2 text-dark">
                    <img :src="image" alt="" style="max-width: 100%; width: 100%">
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import Loading from "vue-loading-overlay";
import {mapActions} from 'vuex';
import C from "../utils/constants.js";
import appUtility from "../utils/app-utility";

import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    components: {
        Loading,
    },
    props: {},
    data() {
        return {
            show: true,
            loading: false,
            paymentHistories: [],
            page: 0,
            noData: false,
            showPaymentDialog: false,
            image: '',
            observer: null,
        }
    },
    mounted() {
        let self = this;
        self.scrollTrigger();
    },
    computed: {
        constant: function () {
            return Object.assign({}, C)
        },
    },
    methods: {
        ...mapActions({
            getPaymentHistory: 'getPaymentHistory',
        }),
        closeDialog: function () {
            this.$emit('close');
        },
        fetchListData: function () {
            this.$store.dispatch('getPaymentHistory', {page: this.page}).then(response => {
                if (_.has(response, "data.data") && _.isArray(response.data.data)) {
                    this.paymentHistories.push(...response.data.data);
                    this.noData = !this.paymentHistories.length;
                }
            }).catch(error => {
            });
        },
        scrollTrigger: function () {
            let self = this;
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0 || self.page === 0) {
                        self.page++;
                        self.fetchListData();
                    }
                });
            });

            if (!!self.$refs.infiniteScrollBankAccountPay) {
                this.observer.observe(self.$refs.infiniteScrollBankAccountPay);
            }
        },
        // infiniteHandler($state) {
        //     this.$store.dispatch('getPaymentHistory', {page: this.page})
        //         .then(response => {
        //             this.paymentHistories.push(...response.data.data);
        //             this.noData = !this.paymentHistories.length;
        //             if (response.data.next_page_url) {
        //                 $state.loaded();
        //                 this.page++;
        //             } else {
        //                 $state.complete();
        //             }
        //         })
        //         .catch(error => {
        //             console.log(error);
        //             $state.complete();
        //         });
        // },
        formatDateTime: function (date) {
            return appUtility.dateFormat(date, 'YYYY-MM-DD HH:mm');
        },
        numberWithDot: function (value) {
            return value ? appUtility.formatPriceToFixed(value, '') : 0;
        },
        getPaymentStatus: function (status) {
            switch (status) {
                case this.constant.PAYMENT_REQUEST_STATUS.pending:
                    return '申請中';
                case this.constant.PAYMENT_REQUEST_STATUS.accepted:
                    return '支払済み';
                case this.constant.PAYMENT_REQUEST_STATUS.rejected:
                    return '却下';
            }
        },
        getStatusClass: function (status) {
            return {
                'text-pending': status === this.constant.PAYMENT_REQUEST_STATUS.pending,
                'text-success': status === this.constant.PAYMENT_REQUEST_STATUS.accepted,
                'text-danger': status === this.constant.PAYMENT_REQUEST_STATUS.rejected,
            }
        },
        showPaymentImage: function (image) {
            this.image = image;
            this.showPaymentDialog = true;
        }
    },
    destroyed() {
        if (this.observer) {
            this.observer.disconnect();
        }

        this.paymentHistories = []
        this.page = 0
    }
}
</script>

<style lang="scss" scoped>
div {
    .v-dialog {
        &__content {
            .v-card__text {
                height: auto;
            }
        }
    }
}

.text-pending {
    color: #e29930;
}
</style>
