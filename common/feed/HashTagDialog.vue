<template>
    <div :class="[`d-dialog-feed-hashtag p-0`]" v-if="showFeedHashTagDialog">

        <v-bottom-sheet v-if="!isDialogFull" v-model="showFeedHashTagDialog" persistent
                        :content-class="`d-dialog-show-not-fullscreen`" max-width="440">

            <Hashtag v-model="vModelDataHashtag" :btnTitle="btnTitle" :titleName="titleName" :classList="classList"
                     :funcCallbackEventData="clickCallbackEventData"/>
        </v-bottom-sheet>

        <v-dialog v-if="isDialogFull" v-model="showFeedHashTagDialog" :content-class="'d-dialog-show-fullscreen'"
                  max-width="440" fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <Hashtag v-model="vModelDataHashtag" :btnTitle="btnTitle" :titleName="titleName" :classList="classList"
                     :classBorderWidth="'d-header-border-width-3'"
                     :classFullScreen="`d-dialog-show-fullscreen`" :funcCallbackEventData="clickCallbackEventData" :listGroupTag="listGroupTag"/>

        </v-dialog>

    </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import Hashtag from "./../../common/hashtag/Hashtag";

export default {
    data: function () {
        return {
            vModelDataHashtag: []
        }
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
        isDialogFull: {
            type: Boolean,
            required: true
        },
        funcCallbackEventData: {
            type: Function,
            required: true
        },
    },
    components: {
        Hashtag
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            showFeedHashTagDialog: state => state.feed.showFeedHashTagDialog,
            feedCreateOrEdit: state => state.feed.feedCreateOrEdit,
            listGroupTag: state => state.tag.groupTagDetail
        }),
        ...mapGetters({
            showFeedHashTagDialog: "showFeedHashTagDialog",
            feedCreateOrEdit: "feedCreateOrEdit",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        checkHashTags: function () {
            return !!this.hashTags.length
        },
        hashTags: function () {
            return _.has(this.dataContent, "hashTags") && !!this.dataContent.hashTags.length ? this.dataContent.hashTags : []
        },
        renderDialogFullScreen: function () {
            return `d-dialog-show-${this.isDialogFull ? '' : 'not-'}fullscreen`
        },
    },
    mounted: function () {
        this.getListGroupTag()
    },
    methods: {
        clickCallbackEventData: function (payload) {
            this.$store.dispatch('showFeedHashTagDialogDispatch', {isShow: false});
            this.$nextTick(() => {
                this.funcCallbackEventData(Object.assign({}, payload, {modelHashtag: this.vModelDataHashtag}))
            })
        },

        getListGroupTag() {
            this.$store.dispatch("showListGroupTag",{})
        }
    }
}
</script>
