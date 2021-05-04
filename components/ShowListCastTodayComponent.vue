<template>
    <div class="app-content-box">
        <v-row justify="center">
            <v-dialog v-model="dialogShowListCastToday" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                      fullscreen
                      hide-overlay transition="dialog-bottom-transition"
                      scrollable>
                <v-card :class="`dialog-show-list-cast-today`" :id="`dialog-show-list-cast-today`">
                    <v-card-title class="p-0">
                        <div :class="`card-header-top`">
                            <button v-on:click="goBack()">
                                <v-img contain src="../../images/chevron-left.svg"/>
                            </button>
                            <div class="d-title">{{ titleHeader }}</div>
                        </div>
                    </v-card-title>
                    <v-card-text :class="[`p-0`]">
                        <div class="card-body d-list-content pt-0">
                            <div class="d-inline-flex d-list-show-list-cast-today box-1 p-0 d-box-new-card">
                                <CardUserComponent v-for="(item, index) in todayCastList" :key="index" :itemData="item"
                                                   :name="'home8'"
                                                   :type="'list-cast-today'"
                                                   :imgAvatarDefault="item.avatar"/>

                                <div ref="infiniteScrollCastToDay"></div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import C from '../utils/constants'
import IconSvgComponent from "../common/IconSvgComponent";
import CardUserComponent from "../common/CardUserComponent";

export default {
    props: {
        titleHeader: {
            type: String,
            defaultValue: ""
        },
        funcCloseShowListCastTodayDialog: {
            type: Function,
            defaultValue: null
        },
        dialogShowListCastToday: Boolean
    },
    data: function () {
        return {
            payload: {},
            todayCastList: [],
            todayCastListPage: 0,
            observer: null,
        }
    },
    components: {
        IconSvgComponent,
        CardUserComponent,
    },
    mounted() {
        let self = this;
        this.todayCastList = [];
        self.scrollTrigger();
    },
    methods: {
        ...mapActions({
            getTodayInterviewCasts: 'getTodayInterviewCasts',
        }),
        goBack: function (event) {
            if (typeof this.funcCloseShowListCastTodayDialog === "function") {
                this.funcCloseShowListCastTodayDialog(false);
            }
        },
        fetchListData: function () {
            this.$store.dispatch('getTodayInterviewCasts', {page: this.todayCastListPage}).then(response => {
                if (_.has(response, "data.data") && _.isArray(response.data.data)) {
                    this.todayCastList.push(...response.data.data);
                    // if (response.data.next_page_url) {
                    //     this.todayCastListPage++;
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
                    if (entry.intersectionRatio > 0 || self.todayCastListPage === 0) {
                        self.todayCastListPage++;
                        self.fetchListData();
                    }
                });
            });

            if (!!self.$refs.infiniteScrollCastToDay) {
                this.observer.observe(self.$refs.infiniteScrollCastToDay);
            }
        },
        // infiniteHandler($state) {
        //     this.$store.dispatch('getTodayInterviewCasts', {page: this.todayCastListPage})
        //         .then(response => {
        //             this.todayCastList.push(...response.data.data);
        //             if (response.data.next_page_url) {
        //                 $state.loaded();
        //                 this.todayCastListPage++;
        //             } else {
        //                 $state.complete();
        //             }
        //         })
        //         .catch(error => {
        //             // console.log(error);
        //             $state.complete();
        //         });
        // },
        // Not use, so check before use
        resetInfiniteHandler() {
            // this.todayCastList = [];
            // this.todayCastListPage = 1;
            // if (this.$refs.infiniteScrollerToday) {
            //     this.$refs.infiniteScrollerToday.stateChanger.reset();
            // }
        },
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
        }),
        constant: function () {
            return Object.assign({}, C)
        },
    },
    destroyed() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.todayCastListPage = 0;
        this.todayCastList = []
    }
}
</script>
