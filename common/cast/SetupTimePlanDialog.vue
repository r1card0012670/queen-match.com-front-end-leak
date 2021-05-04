<template>
    <div :class="[`d-dialog-time-plan-cast p-0`]" v-if="isShowDialog">

        <v-bottom-sheet v-if="isShowDialog" v-model="showSetTimePlanCastDialog" persistent
                        :content-class="`d-dialog-show-not-fullscreen d-dialog-footer`" max-width="440">

            <v-card :class="[`d-time-plan-cast`, 'd-border-radius-top-15']" :id="`dialog-time-plan-cast`">
                <v-card-title :id="'d-card-title-time-plan-cast'"
                              :class="[`headline d-header-box-time-plan-cast p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <v-btn icon dark v-on:click="clickCallbackEventDataClose">
                            <v-icon class="mr-2 pt-1">close</v-icon>
                        </v-btn>
                        <v-card-title :class="`p-0`">{{ btnTitle }}</v-card-title>

                        <div class="info-bar d-title-time-plan-cast pr-5 btn" v-if="titleName">
                            {{ titleName }}
                        </div>

                        <v-btn class="info-bar d-act-title-time-plan-cast pr-0 button-choice text-brown" color="green darken-1"
                               text @click="clickCallbackEventData">
                            保存
                        </v-btn>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-time-plan'">
                    <v-sheet class="d-flex justify-content-between">
                        <v-col class="col-5 box-from-time p-0">
                            <TimePlanSwiperSlide v-model="vModelDataFrom" @change="changeEventDataFrom"
                                                 :vModelCurrent="valueDateFrom" :type="'from'"
                                                 v-if="isShowDialog"/>
                        </v-col>
                        <v-col class="d-flex d-box-2 text-center justify-content-center align-self-center p-0">~</v-col>

                        <v-col class="col-5 box-to-time p-0">
                            <TimePlanSwiperSlide v-model="vModelDataTo" @change="changeEventDataTo"
                                                 :vModelCurrent="valueDateTo" :type="'to'"
                                                 v-if="isShowDialog"/>
                        </v-col>
                    </v-sheet>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>

import C from "../../utils/constants";
import TimePlanSwiperSlide from './TimePlanSwiperSlide';


export default {
    data: function () {
        return {
            vModelDataFrom: "",
            vModelDataTo: "",
        }
    },
    model: {
        event: 'changeTime'
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
        stringDate: {
            type: String,
            required: true
        },
        vModel: {
            type: Array,
            defaultValue: [],
            required: false
        }
    },
    components: {
        TimePlanSwiperSlide
    },
    computed: {
        constant: function () {
            return Object.assign({}, C)
        },
        showSetTimePlanCastDialog: function () {
            return !!this.isShowDialog
        },
        valueDateFrom: function () {
            let dataDate = this.checkModel;

            return dataDate.length ? dataDate[0] : ""
        },
        valueDateTo: function () {
            let dataDate = this.checkModel;

            return dataDate.length ? dataDate[1] : ""
        },
        checkModel: function () {
            if (this.vModel.length === 2) {
                let tmp = (this.vModel || []).sort();

                let dateFrom = _.has(this.renderTimePlan(), tmp[0]) ? tmp[0] : ""
                let dateTo = _.has(this.renderTimePlan(), tmp[1]) ? tmp[1] : ""

                if (dateFrom && dateTo) {
                    return tmp;
                }
            }

            return []
        },
    },
    mounted() {
    },
    methods: {
        renderTimePlan: function () {
            let results = {};
            let distanceTime = '30';

            Array(24).fill(1).forEach((ele, index) => {
                let txtIndex = index < 10 ? '0' + index : index;

                results[`${txtIndex}00`] = `${txtIndex}:00`
                results[`${txtIndex}${distanceTime}`] = `${txtIndex}:${distanceTime}`
            })

            return results;
        },

        clickCallbackEventDataClose: function () {
            this.funcEmitData(false);
        },
        clickCallbackEventData: function () {
            // Validate ....
            if (!this.vModelDataTo || !this.vModelDataFrom || this.vModelDataTo === this.vModelDataFrom) {
                return
            }

            this.funcEmitData(true);
        },
        funcEmitData: function (isAction) {
            this.$emit('changeTime', {
                isAction,
                stringDate: this.stringDate,
                date: [this.vModelDataFrom, this.vModelDataTo]
            });
        },
        changeEventDataFrom: function (data) {
            this.vModelDataFrom = data
        },
        changeEventDataTo: function (data) {
            this.vModelDataTo = data
        },
    },
    destroyed() {
        this.timePlans = []
    }
}
</script>
