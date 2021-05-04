<template>
    <div class="book-merge">
        <template v-if="step === 1">
            <v-card-text class="p-0 m-0">
                <BookStep1 :ref="'elementStep1'" :classNameBox="renderClassStep"/>
            </v-card-text>
        </template>
        <template v-else-if="step === 2">
            <v-card-text class="p-0 m-0 pt-4">
                <BookStep2 ref="elementStep2" :classNameBox="renderClassStep"/>
            </v-card-text>
        </template>
        <template v-else-if="step === 3">
            <v-card-text class="p-0 m-0 pt-4">
                <BookStep3 ref="elementStep3" :classNameBox="renderClassStep"/>
            </v-card-text>
        </template>
        <template v-else-if="step === 4">
            <v-card-text class="p-0 m-0 pt-4">
                <BookStep4 ref="elementStep4" :classNameBox="renderClassStep"/>
            </v-card-text>
        </template>
        <template v-else-if="step === 5">
            <v-card-text class="p-0 m-0 pt-4">
                <BookStep5 ref="elementStep5" :classNameBox="renderClassStep"/>
            </v-card-text>
        </template>

    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import constantMain from "../../utils/constants";
import CardUserComponent from "./../../common/CardUserComponent";
import IconSvgComponent from "./../../common/IconSvgComponent";
import BookStep1 from "./../../common/book/BookStep1";
import BookStep2 from "./../../common/book/BookStep2";
import BookStep3 from "./../../common/book/BookStep3";
import BookStep4 from "./../../common/book/BookStep4";
import BookStep5 from "./../../common/book/BookStep5";
import ShowListCastTodayComponent from "./../../components/ShowListCastTodayComponent";
import {TYPE_ROLE_USER} from "../../utils/constant";

const localDecline = [0] // Id decline


export default {
    props: {
        payload: {
            type: Object,
            defaultValue: {}
        },
        className: {
            type: String,
            default: ""
        },
    },
    data: function () {
        return {
            dialogShowListCastToday: false,
            dialogShowAllUser: false,
            valid: true,
            selectLocal: ""
        }
    },
    components: {
        CardUserComponent,
        IconSvgComponent,
        ShowListCastTodayComponent,
        BookStep1,
        BookStep2,
        BookStep3,
        BookStep4,
        BookStep5,
    },
    mounted() {
        this.selectLocal = this.allowItemLocal[0];
    },
    methods: {
        showDataActionDialog: function () {
            return !!this.isShowDialog
        },
        clickPrev: function (numStep) {
            let valStep = +numStep;
            if (valStep <= 1 || valStep > 5) {
                return;
            }
            this.$store.dispatch("stepDispatch", --numStep)
        },
        funcCloseShowListCastTodayDialog: function (val) {
            this.dialogShowListCastToday = val;
        },
        funcHandleShowNavBottom: function (step) {
            if (step && step === 1) {
                this.$store.dispatch('activeNavBottomDispatch', true);
            } else {
                this.$store.dispatch('activeNavBottomDispatch', false);
            }
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // itemUsers: state => state.user.itemUsers,
            role: state => state.user.role,
            step1: state => state.book.step1,
            step: state => state.book.step,
            stepTotal: state => state.book.stepTotal,
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
        stepByStep: function () {
            return `${this.step}/${this.stepTotal}`
        },
        // dataItemsFake: function () {
        //     // TODO
        //     return this.itemUsers;
        // },
        locationItems: function () {
            return this.constant.LOCATION_ITEMS;
        },
        allowItemLocal: function () {
            return (this.locationItems || []).filter(element => localDecline.indexOf(element.id) === -1)
        },
        renderClassStep: function () {
            return !!this.className && this.step === 1 ? this.className : ""
        }
    },
    watch: {
        step: function (after, before) {
            this.funcHandleShowNavBottom(after)
        }
    },
    destroyed() {
        this.$store.dispatch("stepDispatch", 1)
        this.valid = true

    }
}
</script>
