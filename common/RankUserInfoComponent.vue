<template>
    <div class="app-content-box">
        <v-card class="mx-auto d-box-ranking-first" outlined>
            <div class="mb-0 d-box-ranking-first-1">
                <div class="d-flex d-box-ranking-first__period">
                    <div class="ml-auto d-inline-flex d-select-rank-time mr-0">
                        <select class="form-control" :required="true" @change="changeTimeRank">
                            <option v-for="option in optionTimeItems" :selected="+selectedOptions === +option.id"
                                    v-bind:value="option.id">{{ option.content }}
                            </option>
                        </select>
                        <IconSvgComponent :className="`p-0`" :type="`chevron-down`"/>
                    </div>
                </div>
                <v-row no-gutters justify="center" :class="`d-ranking-first`">
                    <v-col :class="`col-4 text-center d-ranking-first-item`" v-on:click="clickAvatarRank(topThreeItems[2])" role="button">
                        <v-card class="d-block">
                            <div class="d-cast-avatar" :class="{'no-data': !topThreeItems[2]}">
                                <v-badge v-if="topThreeItems[2]" bordered bottom overlap content="3" offset-x="25"
                                         offset-y="25">
                                    <v-avatar size="85">
                                        <v-img :src="getUserAvatar(topThreeItems[2])"></v-img>
                                    </v-avatar>
                                </v-badge>
                                <v-avatar v-else size="85">
                                    <span class="d-cast-avatar__unset">3</span>
                                </v-avatar>
                            </div>
                            <div class="d-content-info-user-rank">
                                <div class="name">{{ topThreeItems[2] ? topThreeItems[2].nickname : null }}&nbsp;</div>
                                <div class="rating" v-if="activeCastType === 'cast'">&nbsp;
                                    <IconSvgComponent v-if="topThreeItems[2]" :className="'d-inline-block'"
                                                      :type="'star-fill'"/>
                                    <span v-if="topThreeItems[2]">
                                        {{ getCastAvgStar(topThreeItems[2]) }}
                                    </span>
                                </div>
                            </div>
                        </v-card>
                    </v-col>

                    <v-col :class="`col-4 text-center d-ranking-first-item`" v-on:click="clickAvatarRank(topThreeItems[0])" role="button">
                        <v-card class="d-block">
                            <div class="d-cast-avatar" :class="{'no-data': !topThreeItems[0]}">
                                <v-badge v-if="topThreeItems[0]" bordered bottom overlap content="1" offset-x="25"
                                         offset-y="25">
                                    <v-avatar size="85">
                                        <v-img :src="getUserAvatar(topThreeItems[0])"></v-img>
                                    </v-avatar>
                                </v-badge>
                                <v-avatar v-else size="85">
                                    <span class="d-cast-avatar__unset">1</span>
                                </v-avatar>
                            </div>
                            <div class="d-content-info-user-rank">
                                <div class="name">{{ topThreeItems[0] ? topThreeItems[0].nickname : null }}&nbsp;</div>
                                <div class="rating" v-if="activeCastType === 'cast'">&nbsp;
                                    <IconSvgComponent v-if="topThreeItems[0]" :className="'d-inline-block'"
                                                      :type="'star-fill'"/>
                                    <span v-if="topThreeItems[0]">
                                        {{ getCastAvgStar(topThreeItems[0]) }}
                                    </span>
                                </div>
                            </div>
                        </v-card>
                    </v-col>

                    <v-col :class="`col-4 text-center d-ranking-first-item`" v-on:click="clickAvatarRank(topThreeItems[1])" role="button">
                        <v-card class="d-block">
                            <div class="d-cast-avatar" :class="{'no-data': !topThreeItems[1]}">
                                <v-badge v-if="topThreeItems[1]" bordered bottom overlap content="2" offset-x="25"
                                         offset-y="25">
                                    <v-avatar size="85">
                                        <v-img :src="getUserAvatar(topThreeItems[1])"></v-img>
                                    </v-avatar>
                                </v-badge>
                                <v-avatar v-else size="85">
                                    <span class="d-cast-avatar__unset">2</span>
                                </v-avatar>
                            </div>
                            <div class="d-content-info-user-rank">
                                <div class="name">{{ topThreeItems[1] ? topThreeItems[1].nickname : null }}&nbsp;</div>
                                <div class="rating" v-if="activeCastType === 'cast'">&nbsp;
                                    <IconSvgComponent v-if="topThreeItems[1]" :className="'d-inline-block'"
                                                      :type="'star-fill'"/>
                                    <span v-if="topThreeItems[1]">
                                        {{ getCastAvgStar(topThreeItems[1]) }}
                                    </span>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </v-card>

        <v-list :class="`d-list-ranking`">
            <template v-if="otherRankItems.length">
                <template v-for="(item, index) in otherRankItems">
                    <v-list-item :key="index" :class="`d-list-ranking-item`">
                        <div class="d-list-ranking-item-no">{{ index + 4 }}</div>
                        <v-list-item-avatar v-on:click="clickAvatarRank(item)" role="button">
                            <v-img :src="getUserAvatar(item)"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title>{{ item.nickname }}</v-list-item-title>
                            <v-list-item-subtitle :class="[`d-flex`]" v-if="activeCastType === 'cast'">
                                <IconSvgComponent :className="'d-inline-block'" :type="'star-fill'"/>
                                <span>{{ getCastAvgStar(item) }}</span>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </template>
            <template v-if="noData">
                <div class="mt-5 pt-5 text-center">データがありません</div>
            </template>
        </v-list>

        <v-dialog v-if="isActiveDialog" v-model="isActiveDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
            <!-- Detail User -->
            <UserProfilesComponent v-if="isActiveDialog" :typeAction="'SHOW_PROFILE_OTHER'" :name="'user2show'" :userInfo="userInfo" :listUserOrCastData="listUserOrCastData"
                                   @eventCloseProfile="() => isActiveDialog = false"/>
        </v-dialog>
        <loading :active.sync="visible"></loading>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex';
import C from '../utils/constants'
import IconSvgComponent from "../common/IconSvgComponent";
import UserProfilesComponent from "../components/UserProfilesComponent";
import Loading from 'vue-loading-overlay';
import processDataUserProfile from "../mixin/processDataUserProfile";

export default {
    mixins:[
        processDataUserProfile
    ],
    props: {
        funcCloseRank: {
            type: Function,
            defaultValue: null
        },
        funcChangeTimeRank: {
            type: Function,
            defaultValue: null
        },
        selectedOptions: {
            type: String,
            defaultValue: null
        },
        activeTab: {
            type: Object,
            defaultValue: {}
        },
        place: {
            type: Number,
            defaultValue: null,
        },
        activeCastType: {
            type: String,
            defaultValue: 'cast',
        },
        dialogShowUserRank: Boolean
    },
    data: function () {
        return {
            payload: {},
            isActiveDialog: false,
            userInfo: {},
            dataItems: Array(Math.floor(Math.random() * 15)).fill(1).map((ele, index) => ({
                id: Math.random().toString(36).substring(7),
                value: ele
            })),
            tab: "One",
            items: [],
            noData: false,
            visible: true,
            listUserOrCastData: null,
        }
    },
    components: {
        IconSvgComponent,
        UserProfilesComponent,
        Loading,
    },
    methods: {
        ...mapActions({
            getRankingCasts: 'getRankingCasts',
            getRankingUsers: 'getRankingUsers',
        }),
        goBack: function (event) {
            if (typeof this.funcCloseRank === "function") {
                this.funcCloseRank(false)
            }
        },
        changeTimeRank: function (event) {
            this.payload = {...this.payload, period: event.target.value};
            this.fetchData();
            if (typeof this.funcChangeTimeRank === "function") {
                this.funcChangeTimeRank(event.target.value)
            }
        },
        clickAvatarRank: async function (dataCastInfo) {
            // Validate
            if (!dataCastInfo || !_.has(dataCastInfo, "id") || !dataCastInfo.id) {
                return;
            }

            let data = await this.initFetchUserORCastAsync(dataCastInfo.id)
            // Validate user or cast
            if (!_.has(data, "user.id")) {
                return
            }
            this.userInfo = data.user;
            this.listUserOrCastData = data.suggestUserOrCast;
            // Init data for before use component UserProfilesComponent
            this.initProcessDataUserProfile({userOrCastId: data.user.id, fetchDataBeforeById: data.user, options: {role: {...data.dataRole}}});
            this.isActiveDialog = true
        },
        getUserAvatar(item) {
            return item && item.avatar ? item.avatar : C.AVATAR_DEFAULT;
        },
        getCastAvgStar(item) {
            return item && item.star_avg ? item.star_avg.toFixed(1) : 0
        },
        async fetchData() {
            this.visible = true;
            if (this.activeCastType === 'cast') {
                await this.$store.dispatch('getRankingCasts', this.payload)
                    .then(response => {
                        this.items = response.data;
                        this.noData = response.data.length === 0;
                    })
                    .catch(error => {
                        // console.log(error);
                    });
            } else {
                await this.$store.dispatch('getRankingUsers', this.payload)
                    .then(response => {
                        this.items = response.data;
                        this.noData = response.data.length === 0;
                    })
                    .catch(error => {
                        // console.log(error);
                    });
            }

            this.visible = false;
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // itemUsers: state => state.user.itemUsers,
        }),
        ...mapGetters({
            // defineTabs: "defineTabs",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        optionTimeItems: function () {
            return this.constant.TAB_RANK_USER.segments;
        },
        topThreeItems: function () {
            return this.items.slice(0, 3);
        },
        otherRankItems: function () {
            return this.items.slice(3);
        },
    },
    watch: {
        place: function (newPlace, oldPlace) {
            this.payload = {...this.payload, place: newPlace};
            this.fetchData();
        },
        isActiveDialog: function (t, f) {
            // console.log("RankUserInfoComponent::isActiveDialog", t, f)
        },
    },
    mounted() {
        if (this.activeCastType === 'cast') {
            this.payload = {...this.payload, place: this.place, ...this.activeTab.conditions, period: 1};
        } else {
            this.payload = {...this.payload, place: this.place, api: this.activeTab.api, period: 1};
        }

        this.fetchData();
    }
}
</script>
