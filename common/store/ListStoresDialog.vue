<template>
    <div :class="[`d-dialog-list-stores p-0`]" v-if="showStoresDialog">

        <v-dialog v-if="isShowDialog" v-model="showStoresDialog"
                  :content-class="`d-dialog-show-fullscreen d-payment-info-wrapper`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="[`d-list-stores`]" :id="`dialog-payment-info`">
                <v-card-title :id="'d-card-title-list-stores'"
                              :class="[`headline d-header-box-list-stores p-0`, 'd-border-bottom']">
                    <div class="card-header-top">
                        <button v-on:click="clickCallbackEventListClose">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">{{ btnTitle }}</div>
                    </div>
                </v-card-title>

                <v-card-text class="d-box-list-stores">
                    <v-col class="p-0 d-nav-stores">
                        <v-sheet>
                            <div class="d-custom-header p-0">
                                <v-btn text outlined :disabled="loadingStore"
                                       :class="[`d-nav-store-item`, {'d-nav-store-item-all': act === 'get-all'}]"
                                       @click="act = 'get-all'">全て
                                </v-btn>
                                <v-btn text outlined :disabled="loadingStore"
                                       :class="[`d-nav-store-item`, {'d-nav-store-item-all': act === 'get-nearest'}]"
                                       @click="act = 'get-nearest'">お近く
                                </v-btn>
                                <v-btn text outlined :disabled="loadingStore"
                                       :class="[`d-nav-store-item`, {'d-nav-store-item-all': act === 'get-suggest'}]"
                                       @click="act = 'get-suggest'">おすすめ
                                </v-btn>
                            </div>
                        </v-sheet>
                    </v-col>
                    <v-col class="p-0 d-list-stores">
                        <template v-if="checkData">
                            <v-card class="d-stores-item" max-width="440"
                                    v-for="(item, index) in checkAction"
                                    :key="item.id" @click="goToStoreDetail(item)">

                                <!--<template slot="progress">-->
                                <!--<v-progress-linear color="deep-purple" height="10"-->
                                <!--indeterminate></v-progress-linear>-->
                                <!--</template>-->

                                <v-img height="137" :src="item.avatar"></v-img>
                                <v-card-title>{{item.store_name}}</v-card-title>
                                <v-card-text class="d-stores-item-address">
                                    <!--                                <v-row align="center" class="mx-0">-->
                                    <!--                                    <v-rating :value="4.5" color="amber" dense half-increments readonly-->
                                    <!--                                              size="14"></v-rating>-->

                                    <!--                                    <div class="grey&#45;&#45;text ml-4">-->
                                    <!--                                        4.5 (413)-->
                                    <!--                                    </div>-->
                                    <!--                                </v-row>-->
                                    <div class="subtitle-1">
                                        <v-icon>location_on</v-icon>
                                        {{item.address}}
                                    </div>

                                    <!--                                <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats-->
                                    <!--                                    plus patio seating.-->
                                    <!--                                </div>-->
                                    <div class="range" v-if="act === 'get-nearest' && item.distance">
                                        ~{{(Math.round(item.distance * 100)/100).toFixed(1)}}km
                                    </div>
                                </v-card-text>
                            </v-card>
                        </template>
                        <template v-else>
                            <loading :active.sync="loadingStore"></loading>
                        </template>

                        <input type="text" hidden :value="forceUpdate">
                        <div ref="infiniteScrollAllStore" :id="`scroll-trigger-all-${act}`"></div>
                    </v-col>
                </v-card-text>

            </v-card>
        </v-dialog>

        <DetailStoreDialog v-if="checkDataLocation && isShowStoreDialog" :isShowDialog="isShowStoreDialog"
                           :funcStoreCallBackClose="clickCallbackEventDataClose" :storeDetailData="storeDetailData"/>
    </div>
</template>

<script>

    import {mapGetters, mapState} from "vuex";
    import C from "../../utils/constants";
    import DetailStoreDialog from "./DetailStoreDialog";
    import Loading from "vue-loading-overlay";
    import {KEY_DEFINE_COOKIES} from "../../utils/constant";
    import Vue from "vue";

    export default {
        data: function () {
            return {
                isShowStoreDialog: false,
                loading: false,
                currentPage: 0,
                currentNearestPage: 0,
                currentNewPage: 0,
                forceUpdate: 0,
                act: '',
                storeDetailData: {},
            }
        },
        props: {
            classList: {
                type: String,
                defaultValue: ""
            },
            isShowDialog: {
                type: Boolean,
                required: true
            },
            funcStoresCallBackClose: {
                type: Function,
                required: true
            },
            typeAct: {
                type: String,
                defaultValue: ""
            },
        },
        components: {
            DetailStoreDialog,
            Loading
        },
        computed: {
            ...mapState({
                // Format [stageName] => state.[modulesName].[stageName],
                user: state => state.user.user,
                getListStores: state => state.store.getListStores,
                getListNewStores: state => state.store.getListNewStores,
                stopLoadMore: state => state.store.stopLoadMore,
                loadingStore: state => state.store.loadingStore,
                getListNearestStores: state => state.store.getListNearestStores,
            }),
            ...mapGetters({}),
            constant: function () {
                return Object.assign({}, C)
            },
            btnTitle: function () {
                return "店舗一覧"
            },
            titleName: function () {
                return ""
            },
            showStoresDialog: function () {
                return !!this.isShowDialog
            },
            checkAction: function () {
                if (this.act === 'get-all') {
                    return this.getListStores;
                } else if (this.act === 'get-nearest') {
                    return this.getListNearestStores;
                } else if (this.act === 'get-suggest') {
                    return this.getListNewStores;
                }

                return []
            },
            checkData: function () {
                this.forceUpdate = this.forceUpdate + 1;

                return !!this.checkAction.length
            },
            checkDataLocation: function () {
                return !!Object.keys(this.storeDetailData).length
            },
        },
        mounted() {
            this.act = this.typeAct;
            let self = this;
            self.scrollTrigger();

            this.$store.commit('loadingStore', false);
        },
        methods: {
            goToStoreDetail: function (storeObj) {
                this.storeDetailData = storeObj;
                this.isShowStoreDialog = true;
            },
            clickCallbackEventDataClose: function () {
                this.isShowStoreDialog = false;
            },
            clickCallbackEventListClose: function () {
                this.funcStoresCallBackClose(false);
            },
            fetchData: function () {
                let self = this;

                if (self.act === 'get-all') {
                    self.$store.dispatch('getListStoresDispatch', {
                        page: self.currentPage,
                    });
                } else if (self.act === 'get-nearest') {
                    let locationCookie = Vue.$cookies.get(KEY_DEFINE_COOKIES.USER_LOCATION);
                    if (locationCookie) {
                        self.$store.dispatch('getListNearestStoresDispatch', {
                            page: self.currentNearestPage,
                            longitude: locationCookie.longitude,
                            latitude: locationCookie.latitude,
                        });
                    }
                } else if (self.act === 'get-suggest') {
                    self.$store.dispatch('getListNewStoresDispatch', {
                        page: self.currentNewPage
                    });
                }
            },
            scrollTrigger() {
                let self = this;
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.intersectionRatio > 0) {
                            if (self.act === 'get-all') {
                                self.currentPage += 1;
                            } else if (self.act === 'get-nearest') {
                                self.currentNearestPage += 1;
                            } else if (self.act === 'get-suggest') {
                                self.currentNewPage += 1;
                            }

                            self.fetchData();
                        }
                    });
                });

                if (!!self.$refs.infiniteScrollAllStore) {
                    this.observer.observe(self.$refs.infiniteScrollAllStore);
                }
            }
        },
        watch: {
            act: function (to, from) {
                let self = this;
                self.observer.disconnect(); // Fixed switch tab

                self.$nextTick(() => {
                    setTimeout(() => self.scrollTrigger(), 10)
                })
            }
        }
    }
</script>
