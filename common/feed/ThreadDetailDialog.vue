<template>
    <div :class="[`d-thread-detail-feed p-0`]">
        <v-dialog v-model="showFeedDetailDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="`d-feed-detail`" :id="`dialog-feed-detail`">
                <v-card-title :id="'d-card-title-feed-detail'" :class="[`headline d-header-box-feed-detail d-header-border-width-3 p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <button v-on:click="showFeedDetailDialogClose" class="d-flex pl-3 align-items-center">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>

                        <div class="info-bar d-act-title-feed-detail pr-0 btn">
                            <v-btn icon @click="showActTitleMoreEditFeed = true">
                                <v-icon>more_horiz</v-icon>
                            </v-btn>
                        </div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-feed-detail'" class="p-0">
                    <ThreadDetail :classList="classList" :dataContent="dataContent" :objUser="objUser" :isPreventDefault="checkPreventDefault" :actPreventDefault="actPreventDefault"/>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-bottom-sheet v-model="showActTitleMoreEditFeed" persistent :content-class="`d-dialog-show-not-fullscreen d-dialog-show-more-action`"
                        max-width="440">

            <v-sheet :class="`text-left d-dialog-show-act-title-more-edit-feed d-rounded-top-1rem`"
                     :id="`dialog-show-act-title-more-edit-feed`" v-if="currUser.id !== dataContent.user_create_id">

                <div class="py-2">
                    <v-btn class="mt-0" text color="red" @click="hiddenPost">この投稿を非表示</v-btn>
                </div>

                <div class="py-2">
                    <v-btn class="mt-0" text @click="blockUser">{{shortName(dataContent.nickname)}}さんのつぶやきをミュート</v-btn>
                </div>

                <div class="py-2">
                    <v-btn class="mt-0" text @click="showActTitleMoreEditFeedCancel">キャンセル</v-btn>
                </div>

            </v-sheet>

            <v-sheet :class="`text-left d-dialog-show-act-title-more-edit-feed d-rounded-top-1rem`"
                     :id="`dialog-show-act-title-more-edit-feed`" v-if="currUser.id === dataContent.user_create_id">

                <div class="py-2">
                    <v-btn class="mt-0" text color="red" @click="showActTitleMoreEditFeedDelete">投稿を削除</v-btn>
                </div>
                <!--                <div class="py-2">-->
                <!--                    <v-btn class="mt-0" text @click="showActTitleMoreEditFeedEdit">Edit</v-btn>-->
                <!--                </div>-->
                <div class="py-2">
                    <v-btn class="mt-0" text @click="showActTitleMoreEditFeedCancel">キャンセル</v-btn>
                </div>

            </v-sheet>
        </v-bottom-sheet>

    </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import IconSvgComponent from "./../../common/IconSvgComponent";
import ThreadDetail from "./../../common/feed/ThreadDetail";
import processFeed from "../../mixin/processFeed";

export default {
    mixins:[
        processFeed
    ],
    data: function () {
        return {
            showActTitleMoreEditFeed: false,
            dataStory: {},
        }
    },
    props: {
        dataContent: {
            type: Object,
            required: true
        },
        objUser: {
            type: Object,
            required: true
        },
        classList: {
            type: String,
            defaultValue: ""
        },
        userList: {
            type: Array,
        },
        castList: {
            type: Array
        },
        actPreventDefault: {
            type: String,
            required: false,
            defaultValue: ""
        }
    },
    components: {
        IconSvgComponent,
        ThreadDetail
    },
    computed: {
         ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            showFeedDetailDialog: state => state.feed.showFeedDetailDialog,
            currUser: state => state.user.user,
            feedDetail: state => state.feed.feedDetail,

        }),
        ...mapGetters({
            showFeedDetailDialog: "showFeedDetailDialog",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        checkPreventDefault: function () {
             debugger
             if (!this.actPreventDefault) {
                 return false;
             }

             if (this.actPreventDefault === 'user-2-profile') {
                 return true;
             }

             return false;
        }
    },
    methods: {
        showFeedDetailDialogClose: function () {
            this.$store.dispatch('showFeedDetailDialogDispatch', {isShow: false, data: {}});
        },
        showActTitleMoreEditFeedDelete: async function () {
            // TODO
            this.showActTitleMoreEditFeed = false;
            // this.$store.dispatch('showFeedEditDialogDispatch', {isShow: false, data: {}});
            await this.$store.dispatch('deletePostStoryDispatch', this.dataContent.id);
            this.$store.dispatch('showFeedDetailDialogDispatch', {isShow: false, data: {}});
            this.showActTitleMoreEditFeed = false;
            await this.$emit('resetData',{})
        },
        showActTitleMoreEditFeedEdit: function () {
            // TODO
            this.showActTitleMoreEditFeed = false;
            // Show component edit
            this.$store.dispatch('showFeedEditDialogDispatch', {isShow: true, data: this.dataContent});
        },
        showActTitleMoreEditFeedCancel: function () {
            // TODO
            this.showActTitleMoreEditFeed = false;
        },
        blockUser: async  function () {
            await this.$store.dispatch('blockUserDispatch', this.dataContent.user_create_id);
            this.$store.dispatch('showFeedDetailDialogDispatch', {isShow: false, data: {}});
            this.showActTitleMoreEditFeed = false;
            await this.$emit('resetData',{})
        },
        hiddenPost: async function() {
            await this.$store.dispatch('hiddenPostDispatch', this.dataContent.id);
            this.$store.dispatch('showFeedDetailDialogDispatch', {isShow: false, data: {}});
            this.showActTitleMoreEditFeed = false;
            await this.$emit('resetData',{})
        },
        shortName: function (value) {
            let name = '';
            if (value && value.length > 15) {
                let shortName = value.substr(0, 14);
                name = shortName + '...'
            }
            return name;
        }
    }
}
</script>
