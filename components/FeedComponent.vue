<template>
    <div id="d-body-content-wrap" :class="`d-mt-12 body-content-feed`">
        <div class="d-element-fixed-for-sub row justify-content-center p-0">
            <v-tabs
                :class="`d-tabs-rank-user`"
                v-model="tab"
                background-color="white"
                color="back"
                dark
                grow
            >
                <v-tab
                    :class="`d-item-tab`"
                    v-for="item in itemTabs"
                    :key="`key-${item.tab}`"
                    @click="setCurrentTab(item.tab)"
                >{{ item.content }}
                </v-tab>
            </v-tabs>
        </div>
        <div id="body-content-scroll" class="container d-mt-12">
            <v-row>
                <v-tabs-items class="default-width" v-model="tab">
                    <v-tab-item v-for="itemTab in itemTabs" :key="`key-${itemTab.tab}`">
                        <v-card flat v-if="itemTab.tab == 1">
                            <template v-if="!!castList.length">
                                <ThreadDetail
                                    v-for="(item, key) in castList"
                                    :classList="classList"
                                    :key="'cast-' +key"
                                    :dataContent="item"
                                    :objUser="objUserOverWrite(item)"
                                />
                                <scroll-loader :loader-method="onLoadMore" :loader-disable="isVisibleCastLoadingIcon">
                                </scroll-loader>
                            </template>
                            <template v-else>
                                <p class="text-center mt-4 d-font-size-14">つぶやきがありません</p>
                            </template>

                        </v-card>
                        <v-card flat v-if="itemTab.tab == 2 ">
                            <template v-if="!!userList.length">
                                <ThreadDetail
                                    v-for="(item, key) in userList"
                                    :classList="classList"
                                    :key="'user-' + key"
                                    :dataContent="item"
                                    :objUser="objUserOverWrite(item)"
                                />
                                <scroll-loader :loader-method="onLoadMore" :loader-disable="isVisibleUserLoadingIcon">
                                </scroll-loader>
                            </template>
                            <template v-else>
                                <p class="text-center mt-4 d-font-size-14">つぶやきがありません</p>
                            </template>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-row>
        </div>

        <ThreadCreateOrEditDialog v-if="checkTypeSFeedCreateOrEditDialog"
                                  :typeCreatOrEdit="typeFeedCreateOrEditDialog"
                                  :labelPlaceholder="'今なにしてる？'" v-on:resetData="resetData"/>

        <ThreadDetailDialog v-if="hasDataContent" :objUser="objUserOverWrite(dataContent)" :dataContent="dataContent" :userList="userList"
                            :castList="castList" v-on:resetData="resetData"/>

        <ListNotifyDialog v-if="isShowListNotify" :isShowDialog="isShowListNotify" :btnTitle="'お知らせ'"
                          :funcCloseDialog="funcEventCloseListNotify"/>

        <ThreadSearchDialog
            v-if="showFeedSearchDialog"
            :titleName="'検索'"
            :placeholder="'タグを入力'"
        />
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import constantMain from "../utils/constants";
import ThreadDetail from "./../common/feed/ThreadDetail";
import IconSvgComponent from "./../common/IconSvgComponent";
import HashTagDialog from "./../common/feed/HashTagDialog";
import ThreadCreateOrEditDialog from "./../common/feed/ThreadCreateOrEditDialog";
import ThreadDetailDialog from "./../common/feed/ThreadDetailDialog";
import ThreadSearchDialog from "./../common/feed/ThreadSearchDialog";
import ListNotifyDialog from "../common/notify/ListNotifyDialog";
import processFeed from "../mixin/processFeed";

export default {
    mixins:[
        processFeed
    ],
    data: function () {
        return {
            tab: "",
            classList: "",
            dataStory: {},
            castCurPage: 1,
            userCurPage: 1,
            currentTab: 1,
        };
    },
    props: {
        payload: {
            type: Object,
            defaultValue: {},
        },
        listLocalSelected: {
            type: Array,
            defaultValue: []
        }
    },

    components: {
        ThreadDetail,
        IconSvgComponent,
        HashTagDialog,
        ThreadCreateOrEditDialog,
        ThreadDetailDialog,
        ThreadSearchDialog,
        ListNotifyDialog
    },

    mounted: function () {
        this.$store.commit('loadDataCastListFeedMutation', [])
        this.$store.commit('loadDataUserListFeedMutation', [])
        this.onLoadMore(true, 'cast')
        this.onLoadMore(true, 'user')
    },

    watch: {
        /**
         * Watching feedDetail has data.
         */
        userList(val) {
            const self = this;
            if (Array.isArray(val) && val.length) {
                // self.isVisibleUserLoadingIcon = true
            }
        },
        /**
         * Watching feedDetail has data.
         */
        castList(val) {
            const self = this;
            if (Array.isArray(val) && val.length) {
                // self.isVisibleCastLoadingIcon = !self.isVisibleCastLoadingIcon
            }
        },
        selectLocal: function (to, from) {
            this.resetData()
        }
    },

    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            showFeedCreateDialog: (state) => state.feed.showFeedCreateDialog,
            showFeedEditDialog: (state) => state.feed.showFeedEditDialog,
            showFeedSearchDialog: (state) => state.feed.showFeedSearchDialog,
            feedDetail: (state) => state.feed.feedDetail,
            user: (state) => state.user.user,
            castList: (state) => state.feed.castList,
            userList: (state) => state.feed.userList,
            isVisibleCastLoadingIcon: (state) => state.feed.isVisibleCastLoadingIcon,
            isVisibleUserLoadingIcon: (state) => state.feed.isVisibleUserLoadingIcon,
            selectLocal: state => state.feed.selectLocal,
            isShowListNotify: state => state.main.isShowListNotify,
            loadDataFeedSuccess: state => state.feed.loadDataFeedSuccess,
        }),
        ...mapGetters({
            showFeedCreateDialog: "showFeedCreateDialog",
            showFeedEditDialog: "showFeedEditDialog",
            showFeedSearchDialog: "showFeedSearchDialog",
            feedDetail: "feedDetail",
            isShowListNotify: "isShowListNotify",
        }),
        constant: function () {
            return Object.assign({}, constantMain);
        },
        itemTabs: function () {
            return this.constant.TAB_FEED["tabFeeds"];
        },
        userId: function () {
            // todo
            // userId login
            return "userId";
        },
        hasDataContent: function () {
            let self = this;
            return !!Object.keys(self.dataContent).length;
        },
        dataContent: function () {
            let self = this;
            return self.feedDetail;
        },
        checkTypeSFeedCreateOrEditDialog: function () {
            return !!this.typeFeedCreateOrEditDialog.length;
        },
        typeFeedCreateOrEditDialog: function () {
            if (!!this.showFeedCreateDialog) {
                return "feed-create";
            }
            if (!!this.showFeedEditDialog) {
                return "feed-edit";
            }

            // Default
            return "";
        },
    },
    methods: {
        setCurrentTab(tab) {
            document.getElementById('body-content-scroll').scrollTo(0, 0)
            this.currentTab = tab
        },
        getAllListStory(role) {
            var params = {
                role: role,
            };
            this.$store.dispatch("getNewFeedList", params);
        },

        /**
         * Load more
         */
        onLoadMore: async function (firstLoad = false, role = '') {
            const params = {};
            const self = this;
            params.block_user = true;
            params.hidden_story = true;
            params.input = 'created_at';
            if (this.selectLocal.length > 0) params.list_place = JSON.stringify(this.selectLocal);
            if (firstLoad) {
                params.role = role;
                params.page = role === 'cast' ? this.castCurPage++ : this.userCurPage++;
            } else {
                params.page = self.currentTab === 1 ? this.castCurPage++ : this.userCurPage++;
                params.role = self.currentTab === 1 ? 'cast' : 'user';
            }
            await this.$store.dispatch("loadMoreFeedDataDispatch", params);
        },

        resetData: async function () {
            this.userCurPage = 1;
            this.castCurPage = 1;
            await this.$store.commit('loadDataCastListFeedMutation', [])
            await this.$store.commit('loadDataUserListFeedMutation', [])
            await this.$store.commit('feedDetailMutations', {});
            await this.onLoadMore(true, 'cast')
            await this.onLoadMore(true, 'user')
        },
        funcEventCloseListNotify: function () {
            this.$store.dispatch('isShowListNotifyDispatch', false);
        },
    },
};
</script>
