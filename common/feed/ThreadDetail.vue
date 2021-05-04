<template>
    <div :class="[`d-thread-detail-feed d-thread-feed p-0`]">
        <div class="d-box-feed-content">
            <v-col :class="[`d-chat-user p-0`]">
                <ChatUser :objUser="objUser" :typeSubTitle="'datePosting'" :isPreventDefault="isPreventDefault"
                          :funcClickTitlePosted="clickTitlePosted" :name="dataContent.nickname" :actPreventDefault="actPreventDefault"/>
            </v-col>
            <v-col :class="[`d-box-content-detail-feed mb-1 p-0`]">
                <v-list-item-content :class="[`pb-0 d-thread-feed-content`]" v-html="dataContent.content"
                                     @click="funcShowFeedDetailOfUser" role="button"/>

                <v-list-item-content :class="[`pb-0 pl-0 d-thread-feed-content hash-tags`]" v-if="checkHashTags">
                    <HashTagComponent :dataHashTags="hashTags" :actionType="actionType"/>
                </v-list-item-content>

                <v-list-item-content :class="[`pb-0 d-thread-feed-content`]" v-if="checkHasFiles">
                    <FilesComponent :dataFiles="files"/>
                </v-list-item-content>
            </v-col>
        </div>
    </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import ChatUser from "./../user/ChatUser";
import HashTagComponent from "./../HashTagComponent";
import FilesComponent from "./../FilesComponent";

export default {
    name: "ThreadDetail",
    data: function () {
        return {
            showFeedOfUser: false
        }
    },
    props: {
        dataContent: {
            type: Object,
            required: true,
        },
        objUser: {
            type: Object,
            required: true
        },
        classList: {
            type: String,
            defaultValue: ""
        },
        preventEvent: {
            type: Boolean,
            defaultValue: false
        },
        isPreventDefault: {
            type: Boolean,
            defaultValue: false
        },
        actPreventDefault: {
            type: String,
            defaultValue: "",
            required: false
        },
        name: {
            type: String,
        },
    },
    created() {
    },
    components: {
        ChatUser,
        HashTagComponent,
        FilesComponent,
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // itemUsers: state => state.user.itemUsers,
        }),
        ...mapGetters({
            // itemUsers: "itemUsers",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        checkHashTags: function () {
            return !!this.hashTags.length
        },
        hashTags: function () {
            return _.has(this.dataContent, "tags") && !!this.dataContent.tags.length ? this.dataContent.tags : []
        },
        checkHasFiles: function () {
            return !!this.files.length
        },
        files: function () {
            return _.has(this.dataContent, "image") && !!!!this.dataContent.image ? [
                {
                    name: new Date().getTime() + ".jpeg",
                    type: "image/jpeg",
                    id: Math.random().toString(36).substring(7),
                    url: `${window.location.origin}/${this.dataContent.image}`
                }] : ''
        },
        actionType: function () {
            if(!!this.preventEvent) {
              return ""
            }

          return "feed"
        }
    },
    methods: {
        funcShowFeedDetailOfUser: function (event) {
            this.$store.dispatch('showFeedDetailDialogDispatch', {isShow: true, data: this.dataContent});
        },
        clickTitlePosted: function (event) {
            this.$store.dispatch('showFeedDetailDialogDispatch', {isShow: true, data: this.dataContent});
        },
    },
    beforeCreate: function () {
        // Mount component for recursive
        this.$options.components.ThreadDetail = require('./../user/ChatUser.vue').default
    },
}
</script>
