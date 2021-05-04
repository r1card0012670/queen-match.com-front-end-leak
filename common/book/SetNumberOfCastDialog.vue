<template>
    <div v-if="isShowDialog" :class="[`d-dialog-set-num-of-cast p-0`]">

        <v-bottom-sheet v-if="isShowDialog" v-model="showDataActionDialog"
                        :content-class="`d-dialog-show-not-fullscreen`" @keydown.esc=funcCloseEventData
                        max-width="440" persistent @click:outside="funcCloseEventData">

            <v-card :id="`dialog-action-set-num-of-cast`"
                    :class="[`d-action-set-num-of-cast d-dialog-footer`, 'd-border-radius-top-15']">
                <v-card-title :id="'d-card-title-set-num-of-cast'"
                              :class="[`headline d-header-box-set-num-of-cast p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <button class="d-flex pl-2 pr-3" v-on:click="funcCloseEventData">
                            <v-img src="../../images/times.svg"></v-img>
                        </button>
                        <v-card-title :class="`p-0`">{{ btnTitle }}</v-card-title>

                        <div v-if="titleName" class="info-bar d-title-set-num-of-cast pr-5 btn">
                            {{ titleName }}
                        </div>
                        <v-btn class="info-bar d-act-title-set-num-of-cast pr-0 button-choice text-brown" color="green darken-1"
                               text @click="clickCallbackEventData">
                            保存する
                        </v-btn>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-set-num-of-cast'">
                    <div class="d-action-set-num-of-cast-note d-flex align-items-start">
                        <v-img :width="15" class="mt-1" contain src="../../images/GR-info-circle.svg"/>
                        <span>ゲストの人数に対してキャストの数が2名以上少ないのはNGです。(例: ゲスト5名の場合、キャスト人数4名〜)※無申告で違反の場合、最低人数分の料金がかかります。</span>
                    </div>

                    <v-col class="d-flex justify-content-between pl-0 pr-0 align-items-center">
                        <div class="d-card-text-select-title">キャスト人数(人)</div>
                        <div class="d-inline-flex d-card-text-select-person align-items-center">
                            <v-btn outlined class="p-2 border" @click="changeMemberCast(-1)">-</v-btn>
                            <div>{{ valueCastMember }}</div>
                            <v-btn outlined class="p-2 border" @click="changeMemberCast(1)">+</v-btn>
                        </div>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>

import C from "../../utils/constants";
import {mapState} from "vuex";

export default {
    data: function () {
        return {
            valueCastMember: 0,
            numValidateMax: 99
        }
    },
    model: {
        event: 'change'
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
        if (_.has(this.dataStep1, "numOfCastMember")) {
            this.valueCastMember = this.dataStep1.numOfCastMember
        }
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
        showDataActionDialog: function () {
            return !!this.isShowDialog
        },
        dataStep1: function () {
            if (this.isDraft) {
                return this.tempStep1;
            }
            return this.step1
        },
    },
    methods: {
        validNumberCastMember: function (num) {
            return num >= 2 && num <= this.numValidateMax
        },
        clickCallbackEventData: function () {
            if (!this.validNumberCastMember(this.valueCastMember)) {
                return
            }
            // Emit data before use method callback
            this.$store.dispatch("updateNumCastMemberStep1Dispatch", {
                numOfCastMember: this.valueCastMember,
                isDraft: this.isDraft
            });

            this.funcCloseEventData({isTypeAction: true})
        },
        changeMemberCast: function (numChange) {
            let cloneNumber = this.valueCastMember + numChange;

            // Check validation
            if (!this.validNumberCastMember(cloneNumber)) {
                return;
            }

            this.valueCastMember = cloneNumber;
        }
    }
}
</script>
