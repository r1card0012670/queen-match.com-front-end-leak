<template>
    <div :class="[`d-dialog-feed-hashtag p-0`]" v-if="showFeedHashTagDialog">
        <v-dialog v-model="showFeedHashTagDialog" :content-class="'d-dialog-show-fullscreen'"
                  max-width="440" fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <HashTagFeed v-model="vModelDataHashtag" :imageFile="imageFile" :content="content" :btnTitle="btnTitle" :titleName="titleName" :classList="classList"
                     :classBorderWidth="'d-header-border-width-3'" :classFullScreen="`d-dialog-show-fullscreen`"
                     :funcCallbackEventData="clickCallbackEventData" :groupTags="groupTags" v-on:submitCreateFeed="submitCreateFeed"
                     :dataHashTagChoose="[]" :checkShowSubTag="false"/>
        </v-dialog>
    </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import HashTagFeed from "./../../common/hashtag/HashTagFeed";

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
        funcCallbackEventData: {
            type: Function,
            required: true
        },
        groupTags: {
            type: Array,
            defaultValue: []
        },
        imageFile: {
            defaultValue: null
        },
        content: {
            type: String,
            defaultValue: ''
        }
    },
    components: {
        HashTagFeed
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            showFeedHashTagDialog: state => state.feed.showFeedHashTagDialog,
            feedCreateOrEdit: state => state.feed.feedCreateOrEdit,
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
            this.$store.dispatch("showListGroupTag",{type: 4})
        },
        submitCreateFeed() {
            this.$emit('submitCreateFeed')
        }
    },
    created() {
    }
}
</script>
