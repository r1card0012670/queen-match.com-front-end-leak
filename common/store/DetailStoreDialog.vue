<template>
    <div :class="[`d-dialog-list-stores p-0`]" v-if="showStoreDialog">

        <v-dialog v-if="isShowDialog" v-model="showStoreDialog"
                  :content-class="`d-dialog-show-fullscreen d-payment-info-wrapper`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="[`d-my-qrcode`]" :id="`dialog-payment-info`">
                <v-card-title :id="'d-card-title-list-stores'"
                              :class="[`headline d-header-box-list-stores p-0 d-header-box-absolute`]">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <button v-on:click="clickCallbackEventDataClose" class="d-flex p-0">
                            <v-badge bordered overlap class="ml-0">
                                <IconSvgComponent :type="'arrow-left-short'"/>
                            </v-badge>
                        </button>
                    </div>
                </v-card-title>

                <v-card-text class="p-0 m-0 bg-white">
                    <v-card :loading="loading" class="mx-auto d-border-radius-0 no-shadow" max-width="440">
                        <template slot="progress">
                            <v-progress-linear color="deep-purple" height="10" indeterminate></v-progress-linear>
                        </template>

                        <div class="d-stores-detail-card-wrapper">
                            <v-img
                                height="265"
                                :src="imgDefault"></v-img>

                            <div class="d-stores-detail-title">
                                <v-card-title class="no-shadow">{{storeDetailData.store_name}}</v-card-title>
                                <div class="range" v-if="storeDetailData.distance">
                                    <v-icon>location_on</v-icon>
                                    {{(Math.round(storeDetailData.distance * 100)/100).toFixed(1)}}km
                                </div>
                            </div>
                        </div>
<!--                        <v-card-text class="d-stores-item-address">-->
<!--                            <v-row align="center" class="mx-0">-->
<!--                                <v-rating :value="4.5" color="amber" dense half-increments readonly-->
<!--                                          size="14"></v-rating>-->

<!--                                <div class="grey&#45;&#45;text ml-4">-->
<!--                                    4.5 (413)-->
<!--                                </div>-->
<!--                            </v-row>-->

<!--                            <div class="subtitle-1">-->
<!--                                <v-icon>location_on</v-icon>-->
<!--                                Tokyo, Minato City, Shinbashi-->
<!--                            </div>-->

<!--                            <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio-->
<!--                                seating.-->
<!--                            </div>-->
<!--                        </v-card-text>-->

                        <v-card-text class="d-stores-detail-image-card" v-if="storeDetailData.store_image && storeDetailData.store_image.length > 0">
                            <v-col :class="`d-stores-detail-image-wrapper p-0 scroll-y`">
                                <v-avatar size="59" v-for="(item, index) in getStoreImages" :key="index" @click="viewMain(item)"
                                          v-if="item.image">
                                    <v-img :src="item.image"/>
                                </v-avatar>
                            </v-col>
                        </v-card-text>

                        <div class="col-12 p-0">
                            <v-divider :class="`mt-1 mb-1`"/>
                        </div>

                        <v-card-text class="d-stores-detail-box-maps">
                            <div class="d-stores-detail-maps">
                                <gmap-map
                                    :center="center"
                                    :zoom="12"
                                    style="width:100%;  height: 200px;">
                                    <gmap-marker
                                        :key="index"
                                        v-for="(m, index) in markers"
                                        :position="m.position"
                                        @click="center=m.position"
                                        :label="m.label"
                                    ></gmap-marker>
                                </gmap-map>
                                <!--<v-img height="159" src="../../images/GR-img-map.png"></v-img>-->
                            </div>
                            <div class="d-stores-detail-address mt-4">
                                <p class="d-stores-detail-location"><v-icon>location_on</v-icon>{{storeDetailData.address}}</p>
                                <p class="d-stores-detail-time mb-0"><v-icon>watch_later</v-icon>{{timeOpening(storeDetailData)}}</p>
                            </div>
                        </v-card-text>

                        <div class="col-12 p-0">
                            <v-divider :class="`mt-1 mb-1`"/>
                        </div>

                        <v-card-text :class="`d-detail-stores-info-content-wrapper bg-white no-shadow`" v-if="storeDetailData.description">
                            <LabelsComponent :label="'紹介'"/>
                            <div class="d-content-html">
                                <ContentWrapper :readMoreActivated="readMoreActivated"
                                                :raw-text="storeDetailData.description"
                                                :funcActivateReadMore="changeActivateReadMore"/>
                            </div>
                        </v-card-text>

<!--                        <v-card-title>Tonight's availability</v-card-title>-->

<!--                        <v-card-text>-->
<!--                            <v-chip-group-->
<!--                                v-model="selection"-->
<!--                                active-class="deep-purple accent-4 white&#45;&#45;text"-->
<!--                                column-->
<!--                            >-->
<!--                                <v-chip>5:30PM</v-chip>-->

<!--                                <v-chip>7:30PM</v-chip>-->

<!--                                <v-chip>8:00PM</v-chip>-->

<!--                                <v-chip>9:00PM</v-chip>-->
<!--                            </v-chip-group>-->
<!--                        </v-card-text>-->
                    </v-card>
                </v-card-text>

            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import C from "../../utils/constants";
import IconSvgComponent from "../../common/IconSvgComponent";
import LabelsComponent from "../../common/LabelsComponent";
import ContentWrapper from "../../common/user/ContentWrapper";

export default {
    data: function () {
        return {
            loading: false,
            selection: 1,
            readMoreActivated: false,
            fakeContentwrapper: "当店大人気商品のチリビーフナチョスや揚げ物・ペンネ含むボリューム満点のコース。\n" +
              "飲み放題メニューは直輸入樽生ビール＆サイダーを含む30種以上です。\n" +
              "＊こちらのコースは10名様以上で承ります。",
            center: {lat: 45.508, lng: -73.587},
            markers: [],
            places: [],
            currentPlace: null,
            imgDefault: ''
        }
    },
    props: {
        isShowDialog: {
            type: Boolean,
            required: true
        },
        funcStoreCallBackClose: {
            type: Function,
            required: true
        },
        storeDetailData: {
            type: Object,
            required: false
        }
    },
    components: {
        IconSvgComponent,
        ContentWrapper,
        LabelsComponent,
    },
    computed: {
        constant: function () {
            return Object.assign({}, C)
        },
        btnTitle: function () {
            return "ポイント履歴・領収書"
        },
        titleName: function () {
            return ""
        },
        showStoreDialog: function () {
            return !!this.isShowDialog
        },
        hasDataStore: function () {
            //TODO
            return !!this.fakeData.length
        },
        getStoreImages: function () {
            return this.storeDetailData.store_image;
        },
    },
    mounted: function() {
        this.geolocate();
        this.imgDefault = this.storeDetailData.avatar;
    },
    methods: {
        clickCallbackEventDataClose: function () {
            this.funcStoreCallBackClose(false);
        },
        changeActivateReadMore: function (val) {
            this.readMoreActivated = val;
        },
        geolocate: function() {
            if (this.storeDetailData.latitude) {
                this.center.lat = +this.storeDetailData.latitude
            }
            if (this.storeDetailData.longitude) {
                this.center.lng = +this.storeDetailData.longitude
            }

            navigator.geolocation.getCurrentPosition(position => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            });

            this.markers.push({ position: this.center, label: this.storeDetailData.store_name});
        },
        timeOpening: function (item) {
            if (_.has(item, "time_open") && _.has(item, "time_close")) {
                let startTime = item.time_open.split(":");
                let endTime = item.time_close.split(":");
                startTime.pop();
                endTime.pop();

                return [startTime.join(":"), " ~ ", endTime.join(":")].join("")
            }

            return ""
        },
        viewMain: function (item) {
            if (item && _.has(item, 'image')) {
                this.imgDefault = item.image;
            }
        }
    },
}
</script>
<style lang="scss" scoped>
    .no-shadow {
        box-shadow: none
    }

    .scroll-y {
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 200px;
    }
</style>
