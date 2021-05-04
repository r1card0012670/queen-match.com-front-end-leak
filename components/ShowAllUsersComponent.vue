<template>
    <div class="app-content-box">
        <v-row justify="center">
            <v-dialog v-model="dialogShowAllUser" :content-class="`d-dialog-show-fullscreen`" max-width="440" fullscreen
                      hide-overlay transition="dialog-bottom-transition"
                      scrollable>
                <v-card :class="`dialog-show-all-users`" :id="`dialog-show-all-users`">
                    <v-card-title class="p-0">
                        <div :class="`card-header-top`">
                            <button v-on:click="goBack()">
                                <v-img contain src="../../images/chevron-left.svg"/>
                            </button>
                            <div class="d-title">{{ titleHeader }}</div>
                        </div>
                    </v-card-title>
                    <v-card-text :class="[`p-0`]">
                        <div class="card-body d-list-content">
                            <div class="d-inline-flex d-list-show-all-users box-1 p-0 d-box-new-card">
                                <CardUserComponent v-for="(item, index) in threeDayCastList" :key="index"
                                                   :name="'home7'"
                                                   :itemData="item"
                                                   :type="'all-users'"
                                                   :imgAvatarDefault="item.avatar"/>
                                <div ref="infiniteScroll3DayCast"></div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import {mapActions} from 'vuex';
import C from '../utils/constants'
import IconSvgComponent from "../common/IconSvgComponent";
import CardUserComponent from "../common/CardUserComponent";

export default {
    props: {
        titleHeader: {
            type: String,
            defaultValue: ""
        },
        funcCloseShowAllUserDialog: {
            type: Function,
            defaultValue: null
        },
        dialogShowAllUser: Boolean
    },
    data: function () {
        return {
            payload: {},
            threeDayCastList: [],
            threeDayCastListPage: 0,
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
            getThreeDayCasts: 'getThreeDayCasts',
        }),
        goBack: function (event) {
            if (typeof this.funcCloseShowAllUserDialog === "function") {
                this.funcCloseShowAllUserDialog(false);
            }
        },
        fetchListData: function () {
            this.$store.dispatch('getThreeDayCasts', {page: this.threeDayCastListPage}).then(response => {
                if (_.has(response, "data.data") && _.isArray(response.data.data)) {
                    this.threeDayCastList.push(...response.data.data);
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
                    if (entry.intersectionRatio > 0 || self.threeDayCastListPage === 0) {
                        self.threeDayCastListPage++;
                        self.fetchListData();
                    }
                });
            });

            if (!!self.$refs.infiniteScroll3DayCast) {
                this.observer.observe(self.$refs.infiniteScroll3DayCast);
            }
        },
        // infiniteHandler($state) {
        //     this.$store.dispatch('getThreeDayCasts', {page: this.threeDayCastListPage})
        //         .then(response => {
        //             this.threeDayCastList.push(...response.data.data);
        //             if (response.data.next_page_url) {
        //                 $state.loaded();
        //                 this.threeDayCastListPage++;
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
            // this.threeDayCastList = [];
            // this.threeDayCastListPage = 1;
            // if (this.$refs.infiniteScrollerThreeDay) {
            //     this.$refs.infiniteScrollerThreeDay.stateChanger.reset();
            // }
        },
    },
    computed: {
        constant: function () {
            return Object.assign({}, C)
        },
    },
    destroyed() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.threeDayCastListPage = 0
        this.threeDayCastList = []
    }
}
</script>
