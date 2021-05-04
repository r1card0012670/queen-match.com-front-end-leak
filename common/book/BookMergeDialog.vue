<template>
    <v-dialog v-if="isShowDialog" v-model="showBookMergeDialog" :content-class="`d-dialog-show-fullscreen`"
              max-width="440"
              fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

        <v-card v-if="!!isUser" :id="`dialog-action-short-book`"
                :class="[`d-action-short-book`]">
            <v-card-title :id="'d-card-title-short-book'"
                          :class="[`headline d-header-box-action-short-book p-1`, 'd-border-bottom']">

                <div v-if="step === 1"
                     class="d-flex align-items-center justify-content-start d-custom-header p-2 d-width-100">
                    <button @click="clickCloseShortcutChosenCast">
                        <v-img src="../../images/times.svg"></v-img>
                    </button>
                    <div :class="`p-0`"> 希望条件を教えて下さい</div>
                </div>

                <v-col v-else class="d-flex justify-content-between col-12 flex-grow p-0 align-items-center">
                    <div class="d-flex d-inline-flex d-custom-header">
                        <button @click="clickPrev(step)"
                                :class="[{'d-no-cursor-pointer': step === 1}]">
                            <v-img v-if="step !== 1" contain src="../../images/chevron-left.svg"/>
                        </button>
                    </div>

                    <div class="d-flex d-inline-flex pr-2">
                        {{ stepByStep }}
                    </div>
                </v-col>
            </v-card-title>

            <v-card-text :id="'d-card-text-short-book'" class="body-request-book">
                <BookMerge v-if="checkHasShortCast"/>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import constantMain from "../../utils/constants";
import BookMerge from "./BookMerge";
import {TYPE_ROLE_USER} from "../../utils/constant";


export default {
    props: {
        payload: {
            type: Object,
            defaultValue: {}
        },
        isShowDialog: {
            type: Boolean,
            defaultValue: false,
            required: true
        },
    },
    data: function () {
        return {}
    },
    components: {
        BookMerge,
    },
    mounted() {
        if (this.step === 1) {
            this.$store.dispatch("resetCastForMergeDispatch");
            // Add 1 cast from list
            this.$store.dispatch("addCastForMergeDispatch", Object.assign({},
                this.castShortcutForMerge,
                {
                    id: this.castShortcutForMerge.castId,
                    avatar: this.castShortcutForMerge.avatar,
                }))
        }
    },
    methods: {
        clickCloseShortcutChosenCast: function (event) {
            this.$store.dispatch("castShortcutForMergeDispatch", {})
        },
        showBookMergeDialog: function () {
            return !!this.isShowDialog
        },
        clickPrev: function (numStep) {
            let valStep = +numStep;
            if (valStep <= 1 || valStep > 5) {
                return;
            }
            this.$store.dispatch("stepDispatch", --numStep)
        },
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // itemUsers: state => state.user.itemUsers,
            role: state => state.user.role,
            step: state => state.user.step,
            castShortcutForMerge: state => state.book.castShortcutForMerge,
        }),
        ...mapGetters({
            step: "step",
            stepTotal: "stepTotal",
        }),
        constant: function () {
            return Object.assign({}, constantMain)
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        isCast: function () {
            return this.role === TYPE_ROLE_USER.TYPE_CAST
        },
        checkHasShortCast: function () {
            if (_.has(this.castShortcutForMerge, "castId") && _.has(this.castShortcutForMerge, "isShow")) {
                return !!this.castShortcutForMerge.isShow
            }
            return false
        },
        stepByStep: function () {
            return `${this.step}/${this.stepTotal}`
        },
    },
    watch: {
        step: function (after, before) {
            if (after === 1) {
                // It's step
                this.$store.dispatch("resetCastForMergeDispatch")
            }
        }
    },
    destroyed() {
        this.$store.dispatch("castShortcutForMergeDispatch", {})
    }
}
</script>
