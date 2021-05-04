<template>
    <v-card>
        <div id="d-card-header" :class="`header-home-cast`">
            <v-col class="d-flex justify-content-between p-0">
                <div class="d-flex d-inline-flex">
                    <v-btn plain text color="red" class="pr-0" @click="clickCalendarPrev">
                        <v-icon left>chevron_left</v-icon>
                        {{ handleCalendarPrevTitle() }}
                    </v-btn>
                </div>
                <div class="d-flex d-inline-flex">
                    <v-btn plain text class="text--black p-0" @click="showFilterMergeByCalendar(isShowMoreCalendar)">
                        コール一覧
                        <v-icon right v-if="!isShowMoreCalendar">arrow_drop_down</v-icon>
                        <v-icon right v-else>arrow_drop_up</v-icon>
                    </v-btn>
                </div>
                <div class="d-flex d-inline-flex">
                    <v-btn plain text color="red" class="pl-0" @click="clickCalendarNext">
                        {{ handleCalendarNextTitle() }}
                        <v-icon right>chevron_right</v-icon>
                    </v-btn>
                </div>
            </v-col>
        </div>
        <div id="body-content-scroll" :class="`container body-content-home p-0`" :style="styleOption">
            <v-col class="p-0">
                <CalendarCastFilter @eventCalendar="eventChangeChosenDate" ref="childCalendarCast"
                                    :now="start"
                                    :typeCalendar="typeCalendar"/>
            </v-col>
            <v-col class="d-flex justify-content-between p-0 d-calendar-date-choice">
                <div style="line-height: 2rem;">{{ formatDateChosenToShow }} <small>{{ labelToday }}</small></div>
                <div class="text-center" style="line-height: 2rem;">{{ this.totalOrders }} 件</div>
                <div class="d-flex d-inline-flex justify-content-end align-items-star order-list">
                    <v-select :class="'d-select-filter-feed'" solo flat :append-icon="''"
                              item-text="name" class="option" :items="locationItems" v-model="selectLocal"
                              return-object>
                        <template v-slot:prepend-inner>
                            <IconSvgComponent :className="`margin-top-sub3`" :type="'map-marker'"/>
                        </template>
                    </v-select>
                </div>
            </v-col>

            <template v-if="!noData">
                <v-sheet class="d-box-show-info-request-merge">
                    <div v-for="(item ,index) in orders" class="mt-2 pb-3">
                        <RequestMergeByUser :itemDataRequest="item" :key="index"/>
                    </div>

                    <div ref="infiniteScrollOrderOfCast"></div>
                </v-sheet>
            </template>
            <template v-if="noData">
                <div class="d-flex justify-center justify-content-center align-items-center">
                    <IconSvgComponent :type="'no-result-order-merge'"/>
                </div>
            </template>
        </div>
        <loading :active.sync="loading"></loading>
    </v-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import constantMain from "../utils/constants";
import IconSvgComponent from "../common/IconSvgComponent";
import CalendarCastFilter from "../common/cast/CalendarCastFilter";
import RequestMergeByUser from "../common/cast/RequestMergeByUser";
import appUtility from "../utils/app-utility";
import Loading from "vue-loading-overlay";
import moment from "moment";

export default {
    data: function () {
        return {
            typeCalendar: 'week', // ['month', 'week', 'day', '4day'],
            isShowMoreCalendar: false,
            eventChosenDate: "",
            isCallRequestMerge: false,
            selectLocal: "",
            orders: [],
            totalOrders: 0,
            ordersPage: 0,
            noData: false,
            loading: true,
            observer: null,
        }
    },
    props: {
        payload: {
            type: Object,
            defaultValue: {}
        },
        styleOption: {
            type: String,
            defaultValue: "",
        }
    },
    components: {
        IconSvgComponent,
        CalendarCastFilter,
        RequestMergeByUser,
        Loading,
    },
    mounted() {
        let self = this;

        if (Object.keys(this.prices).length === 0) {
            this.$store.dispatch('getPrices');
        }
        this.selectLocal = this.locationItems[0];

        self.scrollTrigger();
    },
    methods: {
        ...mapActions({
            getOrderCastCanApply: 'getOrderCastCanApply',
            getPrices: 'getPrices',
        }),
        clickCalendarPrev: function () {
            this.$refs.childCalendarCast && this.$refs.childCalendarCast.calendarPrev()
        },
        clickCalendarNext: function () {
            this.$refs.childCalendarCast && this.$refs.childCalendarCast.calendarNext()
        },
        showFilterMergeByCalendar: function (val) {
            this.typeCalendar = !val ? 'month' : 'week'
            this.$nextTick(() => {
                this.isShowMoreCalendar = !val
            })
        },
        handleCalendarPrevTitle: function () {
            return this.$refs.childCalendarCast && this.$refs.childCalendarCast.calendarPrevTitle()
        },
        handleCalendarNextTitle: function () {
            return this.$refs.childCalendarCast && this.$refs.childCalendarCast.calendarNextTitle()
        },
        eventChangeChosenDate: function (date) {
            this.eventChosenDate = date;
            this.resetInfiniteHandler();
        },
        funcFormatKey: function (date) {
            return `${appUtility.dateFormat(date, "YYYYMMDD")}`
        },
        fetchListData: function () {
            const params = {
                date: this.eventChosenDate,
                place: this.selectLocal.id,
                page: this.ordersPage,
            };

            this.$store.dispatch('getOrderCastCanApply', params).then(response => {
                if (_.has(response, "data.data") && _.isArray(response.data.data)) {
                    this.orders.push(...response.data.data);
                    this.totalOrders = response.data.total;
                    // this.ordersPage++;
                    this.loading = false;
                    if (this.orders.length < 1) {
                        this.noData = true;
                    }
                }
            }).catch(error => {
                this.loading = false;
            });
        },
        scrollTrigger: function () {
            let self = this;
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0 || self.ordersPage === 0) {
                        self.ordersPage++;
                        self.fetchListData();
                    }
                });
            });

            if (!!self.$refs.infiniteScrollOrderOfCast) {
                this.observer.observe(self.$refs.infiniteScrollOrderOfCast);
            }
        },
        // infiniteHandler($state) {
        //     const params = {
        //         date: this.eventChosenDate,
        //         place: this.selectLocal.id,
        //         page: this.ordersPage,
        //     };
        //
        //     this.$store.dispatch('getOrderCastCanApply', params)
        //         .then(response => {
        //             this.orders.push(...response.data.data);
        //             this.totalOrders = response.data.total;
        //             this.ordersPage++;
        //             this.loading = false;
        //             if (this.orders.length < 1) {
        //                 this.noData = true;
        //             }
        //             if (response.data.next_page_url) {
        //                 $state.loaded();
        //             } else {
        //                 $state.complete();
        //             }
        //         })
        //         .catch(error => {
        //             this.loading = false;
        //             $state.complete();
        //         });
        // },
        resetInfiniteHandler() {
            this.loading = true;
            this.orders = [];
            this.ordersPage = 1;
            this.noData = false;

            this.fetchListData();
            // if (this.$refs.infiniteScrollOrder) {
            //     this.$refs.infiniteScrollOrder.stateChanger.reset();
            // }
        },
    },
    computed: {
        ...mapGetters({
            user: 'user',
            prices: 'prices',
        }),
        constant: function () {
            return Object.assign({}, constantMain)
        },
        start: function () {
            return appUtility.dateFormat(new Date(), "YYYY-MM-DD")
        },
        checkEventChosenDate: function () {
            if (!this.eventChosenDate || this.eventChosenDate && !appUtility.isValidDate(this.eventChosenDate)) {
                return;
            }
            return this.eventChosenDate;
        },
        formatDateChosenToShow: function () {

            return this.checkEventChosenDate && appUtility.dateFormat(this.eventChosenDate, "DD/MM/YYYY")
        },
        labelToday: function () {
            return moment(this.eventChosenDate).format('YYYY/MM/DD') === moment().format('YYYY/MM/DD') ? "(本日)" : "";
        },
        locationItems: function () {
            return this.constant.LOCATION_ITEMS;
        },
    },
    watch: {
        selectLocal: function (after, before) {
            this.resetInfiniteHandler();
        },
    },
    destroyed() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.orders = []
        this.ordersPage = 0
        this.loading = true;
    }
}
</script>

<style lang="scss" scoped>
.order-list::v-deep {
    .v-text-field.v-text-field--solo .v-input__control {
        min-height: unset;
        padding: 0;
        background: transparent;
    }

    .theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
        background: transparent;
    }
}

.d-calendar-date-choice {
    &::v-deep {
        .v-input {
            &__slot {
                justify-content: flex-end;

                .v-select {
                    &__slot {
                        width: unset;
                        font-size: 0.9rem;
                    }
                }
            }

            &__prepend-inner {
                margin-right: unset;
            }
        }
    }
}
</style>
