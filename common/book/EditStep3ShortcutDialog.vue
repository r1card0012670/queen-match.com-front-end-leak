<template>
    <div v-if="isShowDialog" :class="[`d-dialog-edit-step3-shortcut p-0`]">

        <v-dialog v-if="isShowDialog" v-model="showDataActionDialog" :content-class="`d-dialog-show-fullscreen`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :id="`dialog-action-edit-step3-shortcut`"
                    :class="[`d-action-edit-step3-shortcut`, 'body-request-book']">
                <v-card-title :id="'d-card-title-edit-step3-shortcut'"
                              :class="[`headline d-header-box-action-edit-step3-shortcut p-2`, 'd-border-bottom']">
                    <div
                        class="d-flex align-items-center justify-content-between d-custom-header p-2 pt-5 pb-5 d-width-100">
                        <button class="d-flex pl-2 pr-3" v-on:click="clickEventEditData">
                            <v-img src="../../images/times.svg"></v-img>
                        </button>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-edit-step3-shortcut'" class="d-edit-step3-shortcut p-0">
                    <div class="p-0 m-0">
                        <BookStep3 ref="elementStep3Shortcut" :actShort="actShort" :classNameBox="'shortcutstep3'"/>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import C from "../../utils/constants";
import {mapState} from "vuex";
import BookStep3 from "./BookStep3";


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
        actShort: {
            type: String,
            required: true
        }
    },
    mounted: function () {
        let self = this
        // Call api
    },
    components: {
        BookStep3
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            step3: state => state.book.step3,
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
                // this.$store.dispatch("mergeDraftStep1ToStep1Dispatch")
                // this.$store.dispatch("mergeDraftStep2ToStep2Dispatch")
            }).then(() => {
                // Action merge data draft to data
                this.funcCloseEventData(event)
            })
        },
        // clickCloseEventData: function (event) {
        //     event.preventDefault()
        //     // this.resetDataInTempStepShortcut()
        //     this.funcCloseEventData()
        // },
        resetDataInTempStepShortcut: function () {
            // this.$store.dispatch("resetTempStep1Dispatch", {})
            // this.$store.dispatch("resetTempStep2Dispatch", {})
        }
    },
    created() {
        let self = this;
        // Copy data
        // self.$store.dispatch("copyStep1Dispatch")
        // self.$store.dispatch("copyStep2Dispatch")
    },
    destroyed() {
        // this.resetDataInTempStepShortcut()
    }
}
</script>
