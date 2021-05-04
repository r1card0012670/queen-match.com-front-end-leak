<template>
    <div v-if="isShowDialog" :class="[`d-dialog-edit-step5-shortcut p-0`]">

        <v-dialog v-if="isShowDialog" v-model="showDataActionDialog" :content-class="`d-dialog-show-fullscreen`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :id="`dialog-action-edit-step5-shortcut`" :class="[`d-action-edit-step5-shortcut d-dialog-footer`]">
                <v-card-title :id="'d-card-title-edit-step5-shortcut'"
                              :class="[`headline d-header-box-action-edit-step5-shortcut p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <button class="d-flex pl-2 pr-3" v-on:click="clickCloseEventData">
                            <v-img src="../../images/times.svg"></v-img>
                        </button>

                        <v-btn class="info-bar d-act-title-edit-step5-shortcut pr-2 button-choice text-brown"
                               text @click="clickEventEditData">
                            編集
                        </v-btn>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-edit-step5-shortcut'" class="d-edit-step5-shortcut ">
                    <v-col class="col-12 p-0 font-weight-bold d-title-block-book">項目を編集する</v-col>
                    <v-card-text class="p-0 m-0 pt-4">
                        <BookStep1 :isDraftData="true" :showIntro="false" ref="elementStep1Shortcut"
                                   :classNameBox="'shortcutstep5'"/>
                    </v-card-text>
                    <div class="col-12 p-0">
                        <v-divider :class="`mt-1 mb-1 width-4`"/>
                    </div>
                    <v-card-text class="p-0 m-0 pt-4">
                        <BookStep2 :isDraftData="true" ref="elementStep2Shortcut" :showIntro="false"
                                   :classNameBox="'shortcutstep5'"/>
                    </v-card-text>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import C from "../../utils/constants";
import {mapState} from "vuex";
import BookStep1 from "./BookStep1";
import BookStep2 from "./BookStep2";


export default {
    data: function () {
        return {}
    },
    props: {
        btnTitle: {
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
        funcCloseEventData: {
            type: Function,
            required: true
        },
    },
    mounted: function () {
        let self = this
    },
    components: {
        BookStep1,
        BookStep2
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            step1: state => state.book.step1,
            step2: state => state.book.step2,
            tempStep1: state => state.book.tempStep1,
            tempStep2: state => state.book.tempStep2,
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showDataActionDialog: function () {
            return !!this.isShowDialog
        },
    },
    methods: {
        clickEventEditData: async function (event) {
            event.preventDefault()
            Promise.resolve().then(() => {
                this.$store.dispatch("mergeDraftStep1ToStep1Dispatch")
                this.$store.dispatch("mergeDraftStep2ToStep2Dispatch")
            }).then(() => {
                // Action merge data draft to data
                this.clickCloseEventData(event)
            })
        },
        clickCloseEventData: function (event) {
            event.preventDefault()
            this.resetDataInTempStepShortcut()
            this.funcCloseEventData()
        },
        resetDataInTempStepShortcut: function () {
            this.$store.dispatch("resetTempStep1Dispatch", {})
            this.$store.dispatch("resetTempStep2Dispatch", {})
        }
    },
    created() {
        let self = this;
        // Copy data
        self.$store.dispatch("copyStep1Dispatch")
        self.$store.dispatch("copyStep2Dispatch")
    },
    destroyed() {
        this.resetDataInTempStepShortcut()
    }
}
</script>
