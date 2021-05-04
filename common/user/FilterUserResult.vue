<template>
    <div :class="`app-content-box`">
        <v-row justify="center" :id="`d-filter-cast-results-wrapper`">
            <v-dialog v-model="showResult" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                      fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

                <v-card :class="`d-dialog-search-cast-for-guest-results`" :id="`dialog-search-casts-for-guest-results`">
                    <v-card-title :id="'d-card-title-filter-cast-results'"
                                  :class="[`headline d-header-box-filter-cast-results p-1`, 'd-border-bottom']">
                        <div :class="`card-header-top`">
                            <button @click="closeDialog">
                                <v-img contain src="../../images/chevron-left.svg"/>
                            </button>
                            <div class="d-title">検索結果</div>
                        </div>
                    </v-card-title>

                    <v-card-text :id="'d-card-text-filter-cast-results'" :class="`mb-60`">
                        <v-col :class="['p-0' , 'tag-wrapper']">
                            <div class="list-tag list-tag-v3 no-scroll">
                                <div class="d-flex">
                                    <div class="text-center">
                                        <v-chip v-for="tag in hashTags" :key="tag.id" close
                                                @click:close="removeTag(tag)">
                                            {{ tag.tag_name }}
                                        </v-chip>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                        <div class="card-body d-list-content">
                            <div class="d-inline-flex d-list-show-all-users box-1 p-0 d-box-new-card">
                                <card-user-component v-for="(item, index) in searchResult" :key="index"
                                                     :itemData="item"
                                                     :type="'user-item'"
                                                     :imgAvatarDefault="item.avatar"/>

                                <div ref="infiniteScrollFilterUser"></div>
                            </div>
                            <div v-if="noResult"
                                 class="d-flex align-items-center justify-content-center mt-13 flex-column d-result-content">
                                <svg width="158" height="146" viewBox="0 0 158 146" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="71.9432" cy="71.9271" r="71.7747" fill="#F1F1F1"/>
                                    <circle cx="71.356" cy="72.0497" r="41.9195" fill="#F1F1F1" stroke="#C4C4C4"
                                            stroke-width="2"/>
                                    <circle cx="71.356" cy="72.0497" r="29.6568" fill="#FFFEFF" stroke="#C4C4C4"
                                            stroke-width="2"/>
                                    <path
                                        d="M71.3561 49.5112C71.3561 49.0611 70.9909 48.6946 70.541 48.7103C64.9084 48.9069 59.5259 51.1354 55.3976 54.9992C51.2694 58.8631 48.69 64.0865 48.1216 69.6938C48.0762 70.1417 48.4177 70.5303 48.8669 70.5601C49.3161 70.5898 49.7028 70.2494 49.7493 69.8017C50.2897 64.6073 52.6855 59.7706 56.5117 56.1895C60.3378 52.6084 65.3223 50.5375 70.541 50.3417C70.9909 50.3248 71.3561 49.9614 71.3561 49.5112Z"
                                        fill="#C4C4C4"/>
                                    <rect x="104.033" y="117.563" width="14" height="42" rx="7"
                                          transform="rotate(-45 104.033 117.563)" fill="#F1F1F1"
                                          stroke="#C4C4C4" stroke-width="2"/>
                                    <rect x="102.611" y="107.656" width="2" height="8"
                                          transform="rotate(-45 102.611 107.656)" fill="#C4C4C4"/>
                                    <rect x="123.831" y="67.0135" width="20" height="2" rx="1" fill="#C4C4C4"/>
                                    <rect x="0.168457" y="83.5583" width="20" height="2" rx="1" fill="#C4C4C4"/>
                                    <rect x="147.831" y="67.0135" width="10" height="2" rx="1" fill="#C4C4C4"/>
                                    <rect x="128.831" y="74.3515" width="10" height="2" rx="1" fill="#C4C4C4"/>
                                    <rect x="5.16846" y="90.8963" width="10" height="2" rx="1" fill="#C4C4C4"/>
                                </svg>
                                <span class="mt-7"> 検索条件に合うユーザーがいません  </span>
                            </div>
                        </div>
                        <v-sheet ref="form" class="box-position-footer">
                            <v-btn block large @click="closeDialog" :class="`mt-7 btn-base`">
                                検索条件を再設定する
                            </v-btn>
                        </v-sheet>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import {mapActions} from 'vuex';
import IconSvgComponent from "../../common/IconSvgComponent";
import CardUserComponent from "../../common/CardUserComponent";

export default {
    props: {
        locateUser: {
            type: Object,
            defaultValue: {},
        },
        classUser: {
            type: Array,
            defaultValue: [],
        },
        hashTags: {
            type: Array,
            defaultValue: [],
        },
        freeWord: {
            type: String,
            defaultValue: '',
        },
        nickname: {
            type: String,
            defaultValue: '',
        },
        recentlyJoined: {
            type: Boolean,
            defaultValue: false,
        },
    },
    data: function () {
        return {
            page: 0,
            searchResult: [],
            firstLoad: true,
            noResult: false,
            showResult: true,
            observer: null,
        }
    },
    components: {
        IconSvgComponent,
        CardUserComponent,
    },
    mounted() {
        let self = this;
        self.scrollTrigger();
    },
    methods: {
        ...mapActions({
            getSearchUserResult: 'getSearchUserResult'
        }),
        fetchListData: function () {
            this.$store.dispatch('getSearchUserResult', {...this.conditions, ...{page: this.page}}).then(response => {
                if (_.has(response, "data.data") && _.isArray(response.data.data)) {
                    this.searchResult.push(...response.data.data);
                    if (!this.searchResult.length && this.firstLoad) {
                        this.noResult = true;
                    }
                    this.firstLoad = false;
                }
            }).catch(error => {
                // console.log(error);
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

            if (!!self.$refs.infiniteScrollFilterUser) {
                this.observer.observe(self.$refs.infiniteScrollFilterUser);
            }
        },
        // infiniteHandler($state) {
        //     this.$store.dispatch('getSearchUserResult', {...this.conditions, ...{page: this.page}})
        //         .then(response => {
        //             this.searchResult.push(...response.data.data);
        //             if (!this.searchResult.length && this.firstLoad) {
        //                 this.noResult = true;
        //             }
        //             this.firstLoad = false;
        //             if (response.data.next_page_url) {
        //                 $state.loaded();
        //                 this.page++;
        //             } else {
        //                 $state.complete();
        //             }
        //         })
        //         .catch(error => {
        //             // console.log(error);
        //             $state.complete();
        //         });
        // },
        resetInfinityScroll() {
            this.searchResult = [];
            this.page = 1;
            this.firstLoad = true;
            this.noResult = false;
            this.fetchListData()
            // if (this.$refs.infiniteScroll) {
            //     this.$refs.infiniteScroll.stateChanger.reset();
            // }
        },
        removeTag(tag) {
            const tags = [...this.hashTags];
            const newTags = tags.filter(item => item.id !== tag.id);
            this.$emit('tag-changed', newTags);

            this.resetInfinityScroll();
        },
        closeDialog() {
            this.showClassDialog = false;
            this.$emit('close-dialog');
        },
    },
    computed: {
        conditions: function () {
            const classes = this.classUser.map(x => x.id);
            const hashTags = this.hashTags.map(x => x.id);

            return {
                place: this.locateUser.id,
                classes: classes,
                freeWord: this.freeWord,
                recentlyJoined: this.recentlyJoined ? 1 : 0,
                nickname: this.nickname,
                hashTags: hashTags,
            };
        },
    },
    destroyed() {
        if (this.observer) {
            this.observer.disconnect();
        }

        this.searchResult = [];
        this.page = 0;
        this.firstLoad = true;
        this.noResult = false;
    }
}
</script>
