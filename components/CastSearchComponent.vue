<template>
    <div id="body-content-scroll" :class="`container body-content-home`" :style="styleOption">
        <div class="row justify-content-center">
            <div class="col-12 p-0">
                <div class="card-body d-list-content d-list-content-scroll">
                    <div class="d-flex d-title-content">
                        <span class="label-text-left">直近ログインゲスト</span>
                        <span class="action-more-user d-flex" role="button" @click="showAllNewUsers = true">
                            すべて見る
                            <icon-svg-component :class-name="'d-inline-block'" :type="'chevron-right'"/>
                        </span>
                    </div>
                    <div class="d-inline-flex box-1 p-0 d-box-new-card d-box-new-card-scroll">
                        <card-user-component v-for="(item, index) in newUsers" :key="index" :item-data="item"
                                             :name="'home'"
                                             :img-avatar-default="item.image"
                                             :type="'user-item'"/>
                    </div>
                </div>
                <div class="card-body d-list-content d-list-content-scroll mt-3">
                    <div class="d-flex d-title-content">
                        <span class="label-text-left">ランキング</span>
                        <span class="d-flex action-more-user" role="button" @click="showRankedUsers = true">
                            すべて見る
                            <icon-svg-component :className="'d-inline-block'" :type="'chevron-right'"/>
                        </span>
                    </div>
                    <div class="d-inline-flex box-1 p-0 d-box-new-card d-box-new-card-scroll">
                        <card-user-component v-for="(item, index) in rankedUsers" :key="index" :item-data="item"
                                             :name="'home3'"
                                             :img-avatar-default="item.avatar"
                                             :type="'user-item'"/>
                    </div>
                </div>
                <div class="card-body d-list-content mt-3">
                    <div class="d-flex d-title-content">
                        <span class="label-text-left">おすすめゲスト</span>
                    </div>
                    <div class="d-inline-flex box-1 p-0 d-box-new-card">
                        <card-user-component v-for="(item, index) in recommendUsers" :key="index" :name="'home4'"
                                             :item-data="item"
                                             :img-avatar-default="item.avatar"
                                             :type="'user-item'"/>

                        <div ref="infiniteScrollSearchCast"></div>
                    </div>
                </div>
            </div>
            <show-new-user-component v-if="showAllNewUsers" @close-dialog="showAllNewUsers = false"
                                     :title-header="'直近ログインゲスト'"/>
            <rank-users-component :dialog-show-user-rank="showRankedUsers" :tab-type="'guests'"
                                  :title-header="`ランキング`"
                                  :func-close-rank-dialog="funcCloseRankDialog"/>
            <filter-user-component v-if="showDialogFilterUser"/>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import constantMain from "../utils/constants";
import CardUserComponent from "./../common/CardUserComponent";
import IconSvgComponent from "../common/IconSvgComponent";
import FilterUserComponent from './FilterUserComponent';
import ShowNewUserComponent from "./ShowNewUserComponent";
import RankUsersComponent from "./RankUsersComponent";

export default {
    props: {
        styleOption: {
            type: String,
            defaultValue: "",
        }
    },
    data: function () {
        return {
            conditions: {},
            newUsers: [],
            rankedUsers: [],
            recommendUsers: [],
            showAllNewUsers: false,
            showRankedUsers: false,
            recommendUsersPage: 1,
            showFilterUser: false,
            observer: null,
        }
    },
    components: {
        RankUsersComponent,
        ShowNewUserComponent,
        CardUserComponent,
        IconSvgComponent,
        FilterUserComponent,
    },
    mounted() {
        let self = this;
        self.scrollTrigger();
    },
    methods: {
        ...mapActions({
            getNewUsers: 'getNewUsers',
            getRankingUsers: 'getRankingUsers',
            getRecommendedUserForCast: 'getRecommendedUserForCast',
        }),
        fetchListData: function () {
            this.$store.dispatch('getRecommendedUserForCast', {page: this.recommendUsersPage}).then(response => {
                if (_.has(response, "data.data") && _.isArray(response.data.data)) {
                    this.recommendUsers.push(...response.data.data)
                    this.recommendUsersPage++;
                }
            }).catch(error => {
            });
        },
        scrollTrigger: function () {
            let self = this;
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0 || self.recommendUsersPage === 0) {
                        self.recommendUsersPage++;
                        self.fetchListData();
                    }
                });
            });

            if (!!self.$refs.infiniteScrollSearchCast) {
                this.observer.observe(self.$refs.infiniteScrollSearchCast);
            }
        },
        // infiniteHandler($state) {
        //     this.$store.dispatch('getRecommendedUserForCast', {page: this.recommendUsersPage})
        //         .then(response => {
        //             this.recommendUsers.push(...response.data.data)
        //             this.recommendUsersPage++;
        //             if (response.data.next_page_url) {
        //                 $state.loaded();
        //             } else {
        //                 $state.complete();
        //             }
        //         })
        //         .catch(error => {
        //             $state.complete();
        //         });
        // },
        funcCloseRankDialog: function (val) {
            this.showRankedUsers = val;
        },
    },
    computed: {
        ...mapGetters({
            showDialogFilterUser: 'showDialogFilterUser',
        }),
        constant: function () {
            return Object.assign({}, constantMain)
        },
    },
    created() {
        this.$store.dispatch('getNewUsers')
            .then(response => {
                this.newUsers = [...response.data.data];
            })
            .catch(reason => {
                // console.log(reason);
            });

        this.$store.dispatch('getRankingUsers', {api: '/ranking/user-top-spent'})
            .then(response => {
                this.rankedUsers = [...response.data];
            })
            .catch(reason => {
                // console.log(reason);
            });
    },
    destroyed() {
        if (this.observer) {
            this.observer.disconnect();
        }

        this.recommendUsers = []
        this.recommendUsersPage = 0
    }
}
</script>
