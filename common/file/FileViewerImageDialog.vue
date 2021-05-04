<template>
    <div :class="[`d-thread-viewer-image p-0`]">
        <v-dialog v-model="showFileViewerImage" :content-class="[`d-dialog-show-fullscreen1`, renderClass].join(' ')"
                  max-width="400"
                  transition="dialog-bottom-transition" scrollable @keydown.esc="funcEscDialog"
                  @click:outside="funcEscDialog">

            <v-card :class="`d-viewer-image`" :id="`dialog-viewer-image`">
                <v-card-text :id="'d-card-text-viewer-image'" class="p-0" style="display: flex">
                    <v-img :class="[roundedSizeImage]" :max-width="maxWidth" contain :src="src"/>
                </v-card-text>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import IconSvgComponent from "../IconSvgComponent";

export default {
    data: function () {
        return {}
    },
    props: {
        src: {
            type: String,
            required: true
        },
        isShowDialog: {
            type: Boolean,
            required: true
        },
        funcCloseDialog: {
            type: Function,
            defaultValue: ""
        },
        classList: {
            type: String,
            default: ""
        },
        roundedSizeImage: {
            type: String,
            defaultValue: "rounded-lg"
        },
        maxWidth: {
            type: Number,
            defaultValue: 425
        },
    },
    components: {
        IconSvgComponent,
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // showFeedDetailDialog: state => state.feed.showFeedDetailDialog,
        }),
        ...mapGetters({
            // showFeedDetailDialog: "showFeedDetailDialog",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        renderClass: function () {
            return `${this.classList} d-show-dialog-image`
        }
    },
    methods: {
        showFileViewerImage: function () {
            return !!this.isShowDialog
        },
        funcEscDialog: function (event) {
            if (_.isFunction(this.funcCloseDialog)) {
                this.funcCloseDialog(event)
            }
        }
    }
}
</script>

<style type="text/scss">
.d-show-dialog-image {
    margin: 0;
    max-height: 50%;
}
</style>
