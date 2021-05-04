<template>
    <div :class="[`d-thread-search-feed p-0`]" v-if="isShowFeedSearchDialog">
        <v-dialog v-model="isShowFeedSearchDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="`d-feed-search`" :id="`dialog-feed-search`">
                <v-card-title :id="'d-card-title-feed-search'" :class="[`headline d-header-box-feed-search p-1`, 'd-border-bottom']">
                    <v-col class="d-flex align-items-center justify-content-start d-custom-header p-2 d-width-100">
                        <button v-on:click="showFeedDetailDialogClose" class="pl-2">
                            <IconSvgComponent :className="'d-inline-block btn p-0'" :type="'chevron-left'"/>
                            {{ btnTitle }}
                        </button>

                        <div class="info-bar d-title-feed-search" v-if="titleName" style="margin: auto; font-size: 18px">
                            {{ titleName }}
                        </div>

                        <div class="info-bar d-act-title-feed-search pr-5">
                        </div>
                    </v-col>

                    <div :class="[`d-flex align-items-center d-custom-header`, 'd-width-100', 'd-font-size-14']">
                        <div class="d-flex input-wrap">
                            <v-sheet role="button" outlined
                                     class="rounded mt-1 mb-2 d-custom-convert-btn-select-warp d-custom-align-text-btn div-search-feed">
                                <v-btn icon @click="searchFeedDetail" class="m-0 justify-content-end icon-more_horiz">
                                    <v-icon>search</v-icon>
                                </v-btn>
                                <v-btn class="d-btn-2-select" block left text large plain @click="openShowSearchTag">
                                    {{ filterTagFeedInput.length == 0 ? '選択してください' :  filterTagFeedInput}}
                                </v-btn>
                                <v-icon class="d-icon-position-right icon_arrow_down" right>keyboard_arrow_down</v-icon>
                            </v-sheet>
                        </div>

                        <div class="info-bar">
                            <v-select :class="'d-select-filter-search'" solo :append-icon="'keyboard_arrow_down'" flat @change="funcClickSearchPref"
                                      item-text="name" class="option" :items="locationItems" v-model="selectLocal" return-object>
                            </v-select>
                        </div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-feed-search'" class="p-0">
                    <v-col left class="d-result-feed-of-local font-weight-bold p-2 ml-2" v-if="isSearchSuccess">
                        結果 {{ totalDataSearch }}件
                    </v-col>
                    <p v-if="totalDataSearch == 0 && isSearchSuccess" class="text-center">検索結果がありません</p>
                    <ThreadDetail
                        v-for="(item, key) in listFeedSearch"
                        :classList="classList"
                        :key="key"
                        :dataContent="item"
                        :objUser="objUserOverWrite(item)"
                        :preventEvent="true"
                    />
                    <scroll-loader :loader-method="onLoadMore" :loader-disable="isVisibleSearchFeedLoadingIcon">
                    </scroll-loader>
                </v-card-text>
            </v-card>

        </v-dialog>

        <v-bottom-sheet v-model="showSearchTag" persistent
                        :content-class="`d-dialog-show-not-fullscreen`" max-width="440">

            <HashTagFeed v-if="showSearchTag" v-model="vModelDataHashtagFilter" :btnTitle="btnTitle" :titleName="''" :classList="classList" :title-submit="'保存'"
                         :classBorderWidth="'d-header-border-width-3'" :classFullScreen="`d-dialog-show-fullscreen`"
                         :funcCallbackEventData="clickCallbackEventData" :groupTags="groupTags" @changeHashtag="changeTagSelected"
                         :checkShowSubTag="recruitment" :dataHashTagChoose="vModelDataHashtagFilter"
            />
        </v-bottom-sheet>
    </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import IconSvgComponent from "./../../common/IconSvgComponent";
import ThreadDetail from "./../../common/feed/ThreadDetail";
import HashTagFeed from "../hashtag/HashTagFeed";
import processFeed from "../../mixin/processFeed";

export default {
    mixins:[
        processFeed
    ],
    data: function () {
        return {
            selectLocal: '',
            locationItems: [],
            tags: [],
            listLocalSelect: [],
            filterTagFeedInput: "選択してください",
            vModelDataHashtagFilter: [],
            isShowHashTagDialog: false,
            showSearchTag: false,
            currentPage: 1,
            listDataFeedSearch: [],
            recruitment: false,
            showLoadMore: true,
        }
    },
    props: {
        btnTitle: {
            type: String,
            defaultValue: ""
        },
        titleName: {
            type: String,
            defaultValue: ""
        },
        classList: {
            type: String,
            defaultValue: ""
        },
        placeholder: {
            type: String,
            defaultValue: ""
        },
    },
    components: {
        HashTagFeed,
        IconSvgComponent,
        ThreadDetail
    },
    mounted() {
        let locationItems = this.constant.LOCATION_ITEMS;
        this.selectLocal = locationItems[0];
        this.locationItems = locationItems;
        this.tags = this.showFeedSearchDialog && _.has(this.showFeedSearchDialog, "tags") ? this.showFeedSearchDialog.tags : []

        // this.$store.commit('loadDataSearchFeedMutation', [])
        // this.$store.commit('resetDataTotalSearchMutation', 0)
        //  this.funcClickSearchPref();
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            showFeedSearchDialog: state => state.feed.showFeedSearchDialog,
            groupTags: state => state.search.groupTags,
            listFeedSearch: state => state.feed.listFeedSearch,
            isVisibleSearchFeedLoadingIcon: state => state.feed.isVisibleSearchFeedLoadingIcon,
            totalDataSearch: state => state.feed.totalDataSearch,
            isSearchSuccess: state => state.feed.isSearchSuccess,
        }),
        ...mapGetters({
            showFeedSearchDialog: "showFeedSearchDialog",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        isShowFeedSearchDialog: function () {
            return this.showFeedSearchDialog && !!this.showFeedSearchDialog.isShow
        },
    },
    watch: {
        showFeedSearchDialog: async function (to, from) {
            if (!to.isShow) {
                let locationItems = this.constant.LOCATION_ITEMS;
                this.selectLocal = locationItems[0];
                this.listLocalSelect = [];
                await this.$store.commit('loadDataSearchFeedMutation', [])
                await this.$store.commit('resetDataTotalSearchMutation', 0)
            } else {
                if (this.showFeedSearchDialog.tags && this.showFeedSearchDialog.tags.length > 0) {
                    this.vModelDataHashtagFilter = this.showFeedSearchDialog.tags;
                    if (!this.showFeedSearchDialog.tags.length || this.showFeedSearchDialog.tags.length == 0) {
                        return this.filterTagFeedInput = '選択してください';
                    }
                    this.filterTagFeedInput = '#' + this.showFeedSearchDialog.tags.map(e => e.tag_name).join(', #')
                    this.searchFeedDetail()
                }
            }
        }
    },
    methods: {
        showFeedDetailDialogClose: function () {
            this.isSearch = false;
            this.$store.commit('setSearchSuccessMutation', false);
            this.$store.dispatch('showFeedSearchDialogDispatch', {isShow: false});
            this.$store.commit('resetFeedSearchLoadingIcon',true)
            this.vModelDataHashtagFilter = [];
            this.filterTagFeedInput = '選択してください';
        },
        clickCallbackEventData: function (payload) {
            this.showSearchTag = false;
        },
        funcHashTagCallback: function (data) {
            this.isShowHashTagDialog = false;
        },
        openShowSearchTag(){
            this.$store.dispatch('getGroupTags', {type: this.constant.TAG_TYPE.story})

            this.showSearchTag = true;
        },
        changeTagSelected(listTags){
            this.vModelDataHashtagFilter = listTags.listTag
            this.$store.dispatch('showFeedSearchDialogDispatch', {isShow: true, tags: listTags.listTag});
            this.recruitment = listTags.recruitment;
            if (!this.showFeedSearchDialog.tags.length) {
                return this.filterTagFeedInput = '選択してください';
            }
            this.filterTagFeedInput = '#' + listTags.listTag.map(e => e.tag_name).join(', #');
            this.searchFeedDetail()
        },
        funcClickSearchPref: function () {
            if (this.selectLocal.id) {
                this.listLocalSelect = [this.selectLocal.id];
            } else {
                this.listLocalSelect = [];
            }
            this.searchFeedDetail()
        },
        searchFeedDetail: async function () {
            this.currentPage = 1;
            await this.onLoadMore(true)
            this.$store.commit('resetFeedSearchLoadingIcon', true);
            this.$store.commit('loadDataSearchFeedMutation', []);
        },
        onLoadMore: async function (firstLoad = false) {
            const params = {};
            const self = this;
            params.block_user = true;
            params.hidden_story = true;
            params.input = 'created_at';
            if (this.listLocalSelect.length > 0) params.list_place = JSON.stringify(this.listLocalSelect);
            if (this.vModelDataHashtagFilter.length > 0) params.list_tag = JSON.stringify(this.vModelDataHashtagFilter.map(item=>item.id));
            if (firstLoad) {
                this.currentPage = 1;
                params.page = this.currentPage;
                this.currentPage++
            } else {
                params.page = this.currentPage++;
            }
            this.$store.dispatch("loadMoreFeedDataDispatch", params);
        },
    }
}
</script>
