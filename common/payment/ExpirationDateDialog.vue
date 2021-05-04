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
                            <MonthSelectionBox v-model="vModelDataMonth" @change="changeEventDataFrom"
                                                 :vModelMonthCurrent="valueMonth"
                                                 v-if="isShowDialog"/>
                        </v-col>
                        <v-col class="d-flex d-box-2 text-center justify-content-center align-self-center p-0">/</v-col>

                        <v-col class="col-5 box-to-time p-0">
                            <YearSelectionBox v-model="vModelDataYear" @change="changeEventDataTo"
                                                 :vModelYearCurrent="valueYear"
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
    import MonthSelectionBox from './MonthSelectionBox';
    import YearSelectionBox from "./YearSelectionBox";


    export default {
        data: function () {
            return {
                vModelDataMonth: "",
                vModelDataYear: "",
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
            vModel: {
                type: Array,
                defaultValue: [],
                required: false
            },
        },
        components: {
            YearSelectionBox,
            MonthSelectionBox
        },
        computed: {
            constant: function () {
                return Object.assign({}, C)
            },
            showSetTimePlanCastDialog: function () {
                return !!this.isShowDialog
            },
            valueMonth: function () {
                let dataDate = this.renderMonth();
                return dataDate.length ? dataDate[0].value : ""
            },
            valueYear: function () {
                let dataDate = this.renderYear();
                return dataDate.length ? dataDate[0].value : ""
            },
        },
        mounted() {
        },
        methods: {
            renderMonth: function () {
                let results = [];
                const month = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
                month.forEach((ele) => {
                    let txtIndex = ele < 10 ? '0' + ele : ele;

                    results.push({id: `${txtIndex}`, value: `${txtIndex}`})
                })

                return results;
            },
            renderYear: function () {
                let results = [];
                let year = [];
                let d = new Date();
                let currentYear = d.getFullYear();
                for (let i = currentYear; i <= (currentYear + 20); i++) {
                    year.push(i);
                }
                year.forEach((ele) => {
                    results.push({id: `${ele}`, value: `${ele}`})
                })

                return results;
            },

            clickCallbackEventDataClose: function () {
                this.funcEmitData(false);
            },
            clickCallbackEventData: function () {
                // Validate ....
                if (!this.vModelDataYear || !this.vModelDataMonth) {
                    return
                }

                this.funcEmitData(true);
            },
            funcEmitData: function (isAction) {
                this.$emit('changeTime', {
                    isAction,
                    date: [this.vModelDataMonth, this.vModelDataYear]
                });
            },
            changeEventDataFrom: function (data) {
                this.vModelDataMonth = data
            },
            changeEventDataTo: function (data) {
                this.vModelDataYear = data
            },
        },
        destroyed() {
        }
    }
</script>
