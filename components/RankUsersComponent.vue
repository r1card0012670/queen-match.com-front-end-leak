<template>
    <div class="app-content-box">
        <v-row justify="center">
            <v-dialog v-model="dialogShowUserRank" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                      fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

                <v-card :class="`dialog-rank-all-user`" :id="`dialog-rank-all-user`">
                    <v-card-title class="p-2 d-title-rank-user">
                        <div :class="`card-header-top`">
                            <button v-on:click="goBack()">
                                <v-img contain src="../../images/times.svg"/>
                            </button>
                            <div :class="`d-inline-act-role d-flex justify-content-between flex-grow-1 pt-1`">
                                <div class="d-title">
                                    {{ titleHeader }}
                                </div>
                                <div class="d-box-infa">
                                    <button :class="[`cast-type-button`, {active: activeCastType ==='cast'}]"
                                            v-on:click="castTypeButtonCast">キャスト
                                    </button>
                                    <button :class="[`cast-type-button`, {active: activeCastType ==='guests'}]"
                                            v-on:click="castTypeButtonGuests">ゲスト
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!-- fixed bottom when in v-title -->
                        <div class="col-12 p-0 d-inline-flex d-location-rank d-font-size-14"
                             v-on:click="clickSelectLocation">
                            <v-col cols="auto" class="mr-auto d-flex flex-grow-1 d-select-country ">
                                <IconSvgComponent :className="`margin-top-sub3`" :type="'map-marker'"/>
                                <span class="d-name-location ml-2">
                                    {{ locationItem && locationItem.value || "全国" }}
                                </span>
                            </v-col>
                            <v-col cols="auto" :class="`pt-0 pb-0`">
                                <IconSvgComponent :className="`p-0 margin-top-sub3`" :type="`chevron-right`"/>
                            </v-col>
                        </div>
                        <div class="col-12 p-0">
                            <v-divider :class="`mt-1 mb-1`"/>
                        </div>

                        <v-tabs :class="`d-tabs-rank-user`" v-model="tab" background-color="white" color="back" dark
                                grow>
                            <v-tab :class="`d-item-tab`" v-for="item in items"
                                   :key="`key-${activeCastType}-${item.tab}`">
                                {{ item.content }}
                            </v-tab>
                        </v-tabs>
                    </v-card-title>

                    <v-card-text :class="`p-0`">
                        <v-tabs-items v-model="tab">
                            <v-tab-item v-for="item in items" :key="`key-${activeCastType}-${item.tab}`">
                                <v-card flat>
                                    <RankUserInfoComponent :selected-options="`${selected}`"
                                                           :func-change-time-rank="funcChangeTimeRank"
                                                           :active-tab="item"
                                                           :place="locationItem ? locationItem.id : null"
                                                           :active-cast-type="activeCastType"
                                    />
                                </v-card>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-dialog v-model="activeSelectLocation"
                      :content-class="`d-dialog-show-location full-width d-dialog-footer`" max-width="290"
                      transition="dialog-bottom-transition" persistent scrollable>
                <v-card>
                    <v-card-title>
                        <v-toolbar>
                            <v-btn icon dark @click="activeSelectLocation = false">
                                <v-icon class="mr-2 pt-1">close</v-icon>
                            </v-btn>
                            <v-card-title :class="`p-0`">居住地</v-card-title>
                            <v-btn color="green darken-1" text @click="clickSelectLocationOk"
                                   class="button-choice pr-0">
                                設定
                            </v-btn>
                        </v-toolbar>
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-card-text>
                        <v-toolbar-items>
                            <v-card-text>
                                <div class="form-check" v-for="(item, index) in residences" :key="index">
                                    <input class="form-check-input"
                                           type="radio"
                                           @change="onChangeLocation($event)"
                                           :value="item.id"
                                           name="flexRadioLocationRank"
                                           :id="`flexRadio${index}`"
                                           :checked="checkedItem(item)"
                                    />
                                    <span class="checkmark" :v-for="`flexRadio${index}`"></span>
                                    <label class="form-check-label" :for="`flexRadio${index}`">{{ item.value }}</label>
                                </div>
                            </v-card-text>
                        </v-toolbar-items>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import C from '../utils/constants'
import IconSvgComponent from "../common/IconSvgComponent";
import RankUserInfoComponent from "../common/RankUserInfoComponent";

export default {
    props: {
        titleHeader: {
            type: String,
            defaultValue: ""
        },
        funcCloseRankDialog: {
            type: Function,
            defaultValue: null
        },
        dialogShowUserRank: Boolean,
        activeTab: {
            type: String,
            defaultValue: 'cast',
        },
        tabType: {
            type: String,
            defaultValue: 'cast',
        }
    },
    data: function () {
        return {
            activeSelectLocation: false,
            activeCastType: "cast",
            locationItem: null,
            location: {},
            selected: "",
            tab: "",
            payload: {},
        }
    },
    components: {
        IconSvgComponent,
        RankUserInfoComponent
    },
    created() {
        this.activeCastType = this.tabType;
    },
    mounted() {
        let constItems = this.constant.TAB_RANK_USER;
        this.selected = constItems.segments[0].id;
    },
    methods: {
        goBack: function (event) {
            if (typeof this.funcCloseRankDialog === "function") {
                this.funcCloseRankDialog(false)
            }
        },
        castTypeButtonCast: function (event) {
            this.tab = '';
            this.activeCastType = "cast";
        },
        castTypeButtonGuests: function (event) {
            this.tab = '';
            this.activeCastType = "guests";
        },
        clickSelectLocation: function (event) {
            this.activeSelectLocation = true;
        },
        clickSelectLocationOk: function (event) {
            this.activeSelectLocation = false;
            this.locationItem = this.location
        },
        clickSelectLocationCancel: function (event) {
            this.activeSelectLocation = false;
        },
        checkedItem: function (item) {
            return this.locationItem && this.locationItem.id === item.id;
        },
        onChangeLocation: function (event) {
            let findIndex = this.residences.findIndex(ele => +ele.id === +event.target.value);
            this.location = findIndex !== -1 ? this.residences[findIndex] : null;
        },
        funcChangeTimeRank: function (value) {
            this.selected = value;
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // defineTabs: state => state.main.defineTabs,
        }),
        ...mapGetters({
            residences: 'residences',
        }),
        constant: function () {
            return Object.assign({}, C)
        }
        ,
        items: function () {
            return this.constant.TAB_RANK_USER.hasOwnProperty(this.activeCastType)
                ? this.constant.TAB_RANK_USER[this.activeCastType]
                : this.constant.TAB_RANK_USER['cast'];
        }
        ,
        activeType: function () {
            return this.constant.TAB_RANK_USER.hasOwnProperty(this.activeCastType)
                ? this.activeCastType
                : 'cast';
        }
        ,
        locationItems: function () {
            return this.constant.LOCATION_ITEMS;
        }
    },
}
</script>
