<template>
    <div v-if="isShowDialog" :class="[`d-dialog-locale-book p-0`]">

        <v-bottom-sheet v-if="isShowDialog" v-model="showDataActionDialog" scrollable @keydown.esc=funcCloseEventData
                        :content-class="`d-dialog-show-not-fullscreen`" max-width="440" persistent @click:outside="funcCloseEventData">

            <v-card :id="`dialog-action-locale-book`"
                    :class="[`d-action-locale-book d-dialog-footer`, 'd-border-radius-top-15']">
                <v-card-title :id="'d-card-title-locale-book'"
                              :class="[`headline d-header-box-action-locale-book p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <button class="d-flex pl-2 pr-3" v-on:click="clickCloseEventData">
                            <v-img src="../../images/times.svg"></v-img>
                        </button>
                        <v-card-title :class="`p-0`">{{ btnTitle }}</v-card-title>

                        <div v-if="titleName" class="info-bar d-title-locale-book pr-5 btn">
                            {{ titleName }}
                        </div>
                        <v-btn class="info-bar d-act-title-locale-book pr-0 button-choice text-brown"
                               color="green darken-1" text
                               @click="clickCallbackEventData">
                            保存する
                        </v-btn>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-locale-book'" class="p-0">
                    <div class="d-list-content-location">
                        <v-tabs show-arrows v-model="tab">
                            <v-tabs-slider></v-tabs-slider>

                            <v-tab v-for="(item, k) in allowItemLocal" :key="k">
                                {{ item.name }}
                            </v-tab>
                        </v-tabs>
                        <div class="d-content-item d-box-list-items">
                            <v-item-group v-if="listItemAllowLocal.length" class="tag-wrapper  p-0">
                                <div class="list-tag list-tag-v2 no-scroll m-0">
                                    <div v-for="(item, i) in listItemAllowLocal" :key="i">
                                        <v-chip v-if="!isOther(item)" @click="clickActive(item)"
                                                :color="checkColor(item.name)">
                                            {{ item.name }}
                                        </v-chip>

                                        <v-chip v-else-if="checkShowOther(tab) && isOther(item)"
                                                @click="clickActive(Object.assign({}, item, {key: otherKey, name: otherKey, key_constant: item.key}))"
                                                :color="checkColor(otherKey)">その他
                                        </v-chip>
                                    </div>
                                </div>
                            </v-item-group>
                            <div v-if="itemSelect === otherKey" class="tag-other">
                                <v-col>
                                    <v-text-field v-model="valueItemSelect" solo clearable></v-text-field>
                                </v-col>
                            </div>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>

import C from "../../utils/constants";
import {KEY_DEFINE_COOKIES} from "../../utils/constant";
import {mapState} from "vuex";
import Vue from "vue";

const localDecline = [null] // Id decline
const localDeclineLocalExternal = [14] // Id decline
const _other = 'other'

export default {
    data: function () {
        return {
            tab: 0,
            color: "",
            colorActive: "selected active",
            itemSelect: "",
            itemSelectKey: "",
            isSelectedOther: false,
            valueItemSelect: "",
            itemSelectOther: ""
        }
    },
    model: {
        event: 'changeLocal'
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
        isShowDialog: {
            type: Boolean,
            required: true
        },
        isDraft: {
            type: Boolean,
            required: true
        },
        funcCloseEventData: {
            type: Function,
            required: true
        },
    },
    mounted: function () {
        this.bindingDataSelect()
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            step1: state => state.book.step1,
            tempStep1: state => state.book.tempStep1,
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        dataStep1: function () {
            if (this.isDraft) {
                return this.tempStep1;
            }
            return this.step1
        },
        otherKey: function () {
            return `${_other}_${this.tab}`
        },
        selected: function () {
            return this.dataStep1.location
        },
        showDataActionDialog: function () {
            return !!this.isShowDialog
        },
        locationItems: function () {
            return this.constant.LOCATION_ITEMS;
        },
        allowItemLocal: function () {
            return (this.locationItems || []).filter(element => localDecline.indexOf(element.id) === -1)
        },
        listItemAllowLocal: function () {
            return this.allowItemLocal && this.allowItemLocal[this.tab].items.length ? this.allowItemLocal[this.tab].items : []
        },

    },
    watch: {
        itemSelect: function (after, before) {
            this.isSelectedOther = after === this.otherKey
        }
    },
    methods: {
        clickCallbackEventData: function () {
            if (this.isSelectedOther && !this.valueItemSelect || !this.itemSelect && !this.isSelectedOther) {
                return;
            }
            let keyChosen = (this.isSelectedOther ? this.otherKey : this.itemSelectKey);
            let valueChosen = (this.isSelectedOther ? this.valueItemSelect : this.itemSelect);

            // Emit data before use method callback
            this.$store.dispatch("updateLocaleStep1Dispatch", {
                location: {
                    valueChosen, // Required
                    keyChosen, // Required
                    idLocale: this.allowItemLocal[this.tab].id, // Required
                    ...(this.isSelectedOther) && {options: this.itemSelectOther}, // Optional
                },
                isDraft: this.isDraft,
            });

            this.funcCloseEventData({isTypeAction: false})
        },
        clickCloseEventData: function () {
            this.funcCloseEventData({isTypeAction: true})
        },
        clickActive: function (item) {
            this.itemSelect = item.name
            this.itemSelectKey = item.key
            if (_.has(item, "other")) {
                this.itemSelectOther = item
            }

            if (item.key !== this.otherKey && !this.isDraft) {
                Vue.$cookies.set(KEY_DEFINE_COOKIES.SELECT_LOCAL_BOOK, Object.assign({}, item, {idLocation: this.allowItemLocal[this.tab].id}), "3y")
            }
        },
        checkColor: function (item) {
            return item === this.itemSelect ? this.colorActive : this.color
        },
        checkShowOther: function (tab) {
            let tmpIdSelect = this.allowItemLocal[tab].id;

            return localDeclineLocalExternal.indexOf(tmpIdSelect) === -1;
        },
        bindingDataSelect: function () {
            let cloneData = _.cloneDeep(this.allowItemLocal);

            let objLocal = _.has(this.dataStep1, "location") && _.isObject(this.dataStep1.location) ? this.dataStep1.location : {};

            if (!Object.keys(objLocal).length || !_.has(objLocal, "idLocale")) {
                return;
            }
            let findIndex = (cloneData || []).findIndex(item => {
                return item.id === objLocal.idLocale
            });

            if (findIndex !== -1 && _.has(objLocal, "keyChosen")) {
                this.tab = findIndex;

                if (objLocal.keyChosen === this.otherKey) {
                    this.isSelectedOther = true
                    this.itemSelectKey = this.otherKey
                    this.itemSelect = this.otherKey
                    this.valueItemSelect = objLocal.valueChosen
                    return;
                }

                let findItem = (cloneData[findIndex].items || []).findIndex(ele => ele.key && _.has(objLocal, "keyChosen") && ele.key === objLocal.keyChosen);

                if (findItem !== -1) {
                    this.isSelectedOther = false
                    this.itemSelectKey = cloneData[findIndex].items[findItem].id
                    this.itemSelect = cloneData[findIndex].items[findItem].name
                }
            }
        },
        isOther: function (item) {
            return !!_.has(item, "other") && item.other
        }
    },
    created() {
        let self = this;
    },
    destroyed() {
        this.tab = 0;
        this.itemSelect = ""
        this.itemSelectKey = ""
        this.valueItemSelect = ""
    }
}
</script>
