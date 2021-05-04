<template>
    <div v-if="isShowDialog" :class="[`d-dialog-set-time-book p-0`]">

        <v-bottom-sheet v-if="isShowDialog" v-model="showDataActionDialog"
                        :content-class="`d-dialog-show-not-fullscreen`" @keydown.esc=funcCloseEventData
                        max-width="440" persistent @click:outside="funcCloseEventData">

            <v-card :id="`dialog-action-set-time-book`" :class="[`d-action-set-time-book d-dialog-footer`, 'd-border-radius-top-15']">
                <v-card-title :id="'d-card-title-set-time-book'"
                              :class="[`headline d-header-box-action-set-time-book p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <button class="d-flex pl-2 pr-3" v-on:click="funcCloseEventData">
                            <v-img src="../../images/times.svg"></v-img>
                        </button>
                        <v-card-title :class="`p-0`">{{ btnTitle }}</v-card-title>

                        <div v-if="titleName" class="info-bar d-title-set-time-book pr-5 btn">
                            {{ titleName }}
                        </div>
                        <v-btn class="info-bar d-act-title-set-time-book pr-0 button-choice text-brown" color="green darken-1" text
                               @click="clickCallbackEventData">
                            保存
                        </v-btn>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-set-time-book'">
                    <v-col class="d-flex justify-content-between p-0 align-items-center">
                        <div class="d-card-text-select-title">時間</div>
                        <div class="d-inline-flex d-card-text-select-person align-items-center">
                            <v-btn outlined class="p-2 border" @click="changeTimeHours(-1)">-</v-btn>
                            <div>{{ valueTimeHours }}</div>
                            <v-btn outlined class="p-2 border" @click="changeTimeHours(1)">+</v-btn>
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
            valueTimeHours: 0,
            maxAllow: 10,
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
        if (_.has(this.dataStep1, "setTimeHours")) {
            this.valueTimeHours = this.dataStep1.setTimeHours
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
        clickCallbackEventData: function () {
            if (!this.validNumberTimeHours(this.valueTimeHours)) {
                return
            }
            // Emit data before use method callback
            this.$store.dispatch("updateTimeHoursStep1Dispatch", {
                setTimeHours: this.valueTimeHours,
                isDraft: this.isDraft
            });

            this.funcCloseEventData({isTypeAction: true})
        },
        changeTimeHours: function (numChange) {
            let cloneNumber = this.valueTimeHours + numChange;

            // Check validation
            if (!this.validNumberTimeHours(cloneNumber)) {
                return;
            }

            this.valueTimeHours = cloneNumber;
        },
        validNumberTimeHours: function (num) {
            return num >= 1 && num <= this.maxAllow
        },
    }
}
</script>
