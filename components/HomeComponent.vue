<template>
    <div id="body-content-scroll" :class="`container body-content-home`" :style="styleOption">
        <div class="row justify-content-center">
            <v-card class="col-12 p-0 m-0 overflow-y-auto">
                <div v-if="getCoupon && getCoupon.content && getCoupon.end_push_at" class="card-body p-0">
                    <div class="has-classup-coupon-wrapper">
                        <div class="point">
                            初回利用限定クーポン:
                            {{ numberWithDot(getCoupon.content) }}割引•{{ formatDateString(getCoupon.end_push_at) }}まで
                        </div>
                    </div>
                </div>
                <div v-if="threeDayCastList.length" class="card-body d-list-content d-list-content-scroll">
                    <div class="d-flex d-title-content">
                        <span class="label-text-left">面談通過3日以内キャスト</span>
                        <span class="action-more-user d-flex" role="button" v-on:click="actMoreListUser">
                            すべて見る
                            <IconSvgComponent :className="'d-inline-block'" :type="'chevron-right'"/>
                        </span>
                    </div>
                    <div class="d-inline-flex box-1 p-0 d-box-new-card d-box-new-card-scroll">
                        <CardUserComponent v-for="(item, index) in threeDayCastList" :key="index" :itemData="item"
                                           :name="'home'"
                                           :imgAvatarDefault="item.avatar"
                                           :type="'all-users'"/>
                    </div>
                </div>
                <div v-if="todayCastList.length" class="card-body d-list-content d-list-content-scroll mt-3">
                    <div class="d-flex d-title-content">
                        <span class="label-text-left">本日出勤キャスト</span>
                        <span class="d-flex action-more-user action-more-rank-user" role="button"
                              v-on:click="actMoreListCastToday">
                            すべて見る
                            <IconSvgComponent :className="'d-inline-block'" :type="'chevron-right'"/>
                        </span>
                    </div>
                    <div class="d-inline-flex box-1 p-0 d-box-new-card d-box-new-card-scroll">
                        <CardUserComponent v-for="(item, index) in todayCastList" :key="index" :itemData="item"
                                           :name="'home2'"
                                           :imgAvatarDefault="item.avatar"
                                           :type="'list-cast-today'"/>
                    </div>
                </div>
                <div v-if="rankingCastList.length" class="card-body d-list-content d-list-content-scroll mt-3">
                    <div class="d-flex d-title-content">
                        <span class="label-text-left">ランキング</span>
                        <span class="d-flex action-more-user action-more-rank-user" role="button"
                              v-on:click="actShowRankUser">
                            すべて見る
                            <IconSvgComponent :className="'d-inline-block'" :type="'chevron-right'"/>
                        </span>
                    </div>
                    <div class="d-inline-flex box-1 p-0 d-box-new-card d-box-new-card-scroll">
                        <CardUserComponent v-for="(item, index) in rankingCastList" :key="index" :itemData="item"
                                           :name="'home3'"
                                           :imgAvatarDefault="item.avatar"
                                           :type="'user-rank'"/>
                    </div>
                </div>
                <div v-if="highlySatisfiedCastList.length || firstLoad" class="card-body d-list-content mt-3">
                    <div class="d-flex d-title-content">
                        <span class="label-text-left">ユーザー満足度の高いキャスト</span>
                    </div>
                    <div class="d-inline-flex box-1 p-0 d-box-new-card">
                        <CardUserComponent v-for="(item, index) in highlySatisfiedCastList" :key="index" :name="'home4'"
                                           :itemData="item"
                                           :imgAvatarDefault="item.avatar"
                                           :type="'user-satisfied'"/>

                        <div ref="infiniteScrollHighlySatisfied"></div>
                    </div>
                </div>
            </v-card>

            <ShowAllUsersComponent :dialogShowAllUser="dialogShowAllUser" v-if="dialogShowAllUser"
                                   :title-header="`面談通過3日以内キャスト`"
                                   :funcCloseShowAllUserDialog="funcCloseShowAllUserDialog"
                                   ref="showAllUsersComponent"/>
            <ShowListCastTodayComponent :dialogShowListCastToday="dialogShowListCastToday" v-if="dialogShowListCastToday"
                                        :title-header="`本日出勤キャスト`"
                                        :funcCloseShowListCastTodayDialog="funcCloseShowListCastTodayDialog"
                                        ref="showListCastTodayComponent"/>
            <RankUsersComponent :dialogShowUserRank="dialogShowUserRank"
                                :title-header="`ランキング`"
                                :funcCloseRankDialog="funcCloseRankDialog"
                                :tab-type="'cast'"/>
            <FilterCastComponent v-if="showDialogFilterCast"/>
            <ListNotifyDialog v-if="isShowListNotify" :isShowDialog="isShowListNotify" :btnTitle="'お知らせ'"
                              :funcCloseDialog="funcEventCloseListNotify"/>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import constantMain from "../utils/constants";
import CardUserComponent from "./../common/CardUserComponent";
import IconSvgComponent from "../common/IconSvgComponent";
import ShowAllUsersComponent from "./ShowAllUsersComponent";
import ShowListCastTodayComponent from "./ShowListCastTodayComponent";
import RankUsersComponent from "./RankUsersComponent";
import FilterCastComponent from "./FilterCastComponent";
import ListNotifyDialog from "./../common/notify/ListNotifyDialog";
import {TYPE_ROLE_USER} from "../utils/constant";
import moment from "moment";
import appUtility from "../utils/app-utility";

export default {
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
    data: function () {
        return {
            dialogShowAllUser: false,
            dialogShowUserRank: false,
            dialogShowListCastToday: false,
            threeDayCastList: [],
            todayCastList: [],
            rankingCastList: [],
            highlySatisfiedCastList: [],
            highlySatisfiedCastListPage: 0,
            firstLoad: true,
            coupon: null,
            observer: null,
        }
    },
    components: {
        CardUserComponent,
        IconSvgComponent,
        ShowAllUsersComponent,
        ShowListCastTodayComponent,
        RankUsersComponent,
        FilterCastComponent,
        ListNotifyDialog,
        // InfiniteLoading,
    },
    methods: {
        ...mapActions({
            getThreeDayCasts: 'getThreeDayCasts',
            getTodayInterviewCasts: 'getTodayInterviewCasts',
            getRankingCasts: 'getRankingCasts',
            getHighlySatisfiedCasts: 'getHighlySatisfiedCasts',
            getFirstOrderCoupon: 'getFirstOrderCoupon',
        }),
        fetchListData: function () {
            this.$store.dispatch('getHighlySatisfiedCasts', {page: this.highlySatisfiedCastListPage}).then(response => {
                if (_.has(response, "data.data") && _.isArray(response.data.data)) {
                    this.highlySatisfiedCastList.push(...response.data.data);
                    this.firstLoad = false;
                    // if (response.data.next_page_url) {
                    //     this.threeDayCastListPage++;
                    // }
                }
            }).catch(error => {
                // console.log(error);
            });
        },
        scrollTrigger: function () {
            let self = this;
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0 || self.highlySatisfiedCastListPage === 0) {
                        self.highlySatisfiedCastListPage++;
                        self.fetchListData();
                    }
                });
            });

            if (!!self.$refs.infiniteScrollHighlySatisfied) {
                this.observer.observe(self.$refs.infiniteScrollHighlySatisfied);
            }
        },
        // infiniteHandler($state) {
        //     this.$store.dispatch('getHighlySatisfiedCasts', {page: this.highlySatisfiedCastListPage})
        //         .then(response => {
        //             this.highlySatisfiedCastList.push(...response.data.data);
        //             this.firstLoad = false;
        //             if (response.data.next_page_url) {
        //                 $state.loaded();
        //                 this.highlySatisfiedCastListPage++;
        //
        //             } else {
        //                 $state.complete();
        //             }
        //         })
        //         .catch(error => {
        //             // console.log(error);
        //             $state.complete();
        //         });
        // },
        showDetail: function () {
            // this.$router.push('user-profile')
            //
            // // Not show nav bottom
            // this.$store.dispatch('activeNavBottomDispatch', false);
        },
        actMoreListUser: function () {
            this.dialogShowAllUser = true;
            // this.$refs.showAllUsersComponent.resetInfiniteHandler();
        },
        funcCloseShowAllUserDialog: function (val) {
            this.dialogShowAllUser = val;
        },
        actMoreListCastToday: function () {
            this.dialogShowListCastToday = true;
            // this.$refs.showListCastTodayComponent.resetInfiniteHandler();
        },
        funcCloseShowListCastTodayDialog: function (val) {
            this.dialogShowListCastToday = val;
        },
        actShowRankUser: function () {
            this.dialogShowUserRank = true;
        },
        funcCloseRankDialog: function (val) {
            this.dialogShowUserRank = val;
        },
        funcEventCloseListNotify: function () {
            this.$store.dispatch('isShowListNotifyDispatch', false);
        },
        numberWithDot: function (value) {
            return value ? appUtility.formatPriceToFixed(value) : "";
        },
        formatDateString: function (date) {
            return moment(date).format('YYYY/MM/DD')
        }
    },
    mounted() {
        let self = this;
        self.scrollTrigger();
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // itemUsers: state => state.user.itemUsers,
            showDialogFilterCast: state => state.cast.showDialogFilterCast,
            isShowListNotify: state => state.main.isShowListNotify,
            role: state => state.user.role,
            getCoupon: state => state.home.getCoupon,
            user: state => state.user.user,
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
    },
    created() {
        this.$store.dispatch('getThreeDayCasts', {})
            .then(response => {
                this.threeDayCastList = response.data.data;
            })
            .catch(error => {
                // console.log(error);
            });

        this.$store.dispatch('getTodayInterviewCasts')
            .then(response => {
                this.todayCastList = response.data.data;
            })
            .catch(error => {
                // console.log(error);
            });

        this.$store.dispatch('getRankingCasts')
            .then(response => {
                this.rankingCastList = _.isArray(response.data) ? response.data : [];
            })
            .catch(error => {
                // console.log(error);
            });
        this.$store.commit('getCouponMutation', {});
        this.$store.dispatch('getCouponDispatch', {});
        // Optimize
        // this.$store.dispatch("fetchCouponForNewOrderDispatch", {user_id: this.user.id, key: NEW_USER_COUPON_KEY})
    },
    destroyed() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.highlySatisfiedCastList = []
        this.highlySatisfiedCastListPage = 0
    }
}
</script>
