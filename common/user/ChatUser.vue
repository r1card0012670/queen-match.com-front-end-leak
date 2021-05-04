<template>
    <div v-if="objUserById">
        <v-list-item :class="[`d-list-ranking-item p-0 d-thread-feed-avatar-cast`, classList]">
            <v-list-item-avatar :size="58" @click="clickAvatar" :class="[`d-cursor-pointer`]">
                <IconUser :dataUser="objUserClone" :size="58" :userId="`${objUserById.id}`"
                          :isPreventDefault="isPreventDefault"/>
            </v-list-item-avatar>

            <v-list-item-content>
                <v-list-item-title v-html="name" @click="clickAvatar" :class="[`d-cursor-pointer`]"></v-list-item-title>

                <v-list-item-subtitle v-if="checkTypeSubTitle === 'datePosting'" role="button"
                                      @click="clickTitlePosted">
                    <PostingTimeComponent v-if="objUserClone.created_at" :date="objUserClone.created_at"/>
                </v-list-item-subtitle>

                <v-list-item-subtitle v-if="checkTypeSubTitle === 'lastMessage'">
                    <v-row class="d-inline-flex p-0">
                        <span class="d-last-message">{{ lastMessage }}</span>
                        <PostingTimeComponent v-if="date" :date="date" :stringFormatDate="'HH:MM'"/>
                    </v-row>
                </v-list-item-subtitle>

                <v-list-item-subtitle v-if="checkTypeSubTitle === 'statusLogin'">
                    <LoginTimeMarkComponent :nameStatus="'fake name'"/>
                </v-list-item-subtitle>

            </v-list-item-content>


        </v-list-item>

        <v-dialog v-model="isActiveDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
            <!-- Detail User -->
            <UserProfilesComponent :typeAction="typeAction" :name="'user2show' + objUserClone.id"
                                   :userInfo="objUserClone" :listUserOrCastData="listUserOrCastData"
                                   @eventCloseProfile="funcCloseProfile"/>
        </v-dialog>
    </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import PostingTimeComponent from "../PostingTimeComponent";
import IconUser from "./../user/IconUser"
import LoginTimeMarkComponent from "./../LoginTimeMarkComponent"
import UserProfilesComponent from "./../../components/UserProfilesComponent"
import processDataUserProfile from "../../mixin/processDataUserProfile";

export default {
    name: "ChatUser",
    mixins: [
        processDataUserProfile
    ],
    data() {
        return {
            isActiveDialog: false,
            listUserOrCastData: [],
            objUserClone: {},
        }
    },
    props: {
        objUser: {
            type: Object,
            required: true
        },
        isPreventDefault: {
            type: Boolean,
            required: false
        },
        actPreventDefault: {
            type: String,
            defaultValue: "",
            required: false
        },
        classList: {
            type: String,
            defaultValue: ""
        },
        typeSubTitle: {
            type: String,
            defaultValue: ""
        },
        lastMessage: {
            type: String,
            defaultValue: ""
        },
        date: {
            type: String,
            defaultValue: ""
        },
        funcClickTitlePosted: {
            type: Function,
            defaultValue: null
        },
        name: {
            type: String
        },
    },
    mounted() {
        this.objUserClone = this.objUser
    },
    components: {
        PostingTimeComponent,
        IconUser,
        LoginTimeMarkComponent,
        UserProfilesComponent
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // itemUsers: state => state.user.itemUsers,
            role: state => state.user.role,
            user: state => state.user.user,
            // userInfoShow: state => state.user.userInfoShow,
            listUserOrCastInfoShow: state => state.user.listUserOrCastInfoShow,
        }),
        ...mapGetters({
            // itemUsers: "itemUsers",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        objUserById: function () {
            return this.objUser
        },
        isMe: function () {
            return (this.user.id === this.objUser.id)
        },
        typeAction: function () {
            if (!!this.isMe) {
                return "SHOW_PROFILE_ME"
            }
            return "SHOW_PROFILE_OTHER"
        },
        checkTypeSubTitle: function () {
            if (!this.typeSubTitle) {
                return ""
            }

            switch (this.typeSubTitle) {
                case "datePosting":
                    return "datePosting";
                case "lastMessage":
                    return "lastMessage";
                case "statusLogin":
                    return "statusLogin";

                default:
                    return ""
            }
        },
    },
    methods: {
        clickAvatar: async function (event) {
            event.preventDefault();

            if (!!this.isPreventDefault) {
                return;
            }

            let data = await this.initFetchUserORCastAsync(this.objUserById.id)

            // Validate user or cast
            if (!_.has(data, "user.id")) {
                return
            }
            this.objUserClone = data.user;
            this.listUserOrCastData = data.suggestUserOrCast;
            // Init data for before use component UserProfilesComponent
            this.initProcessDataUserProfile({userOrCastId: data.user.id, fetchDataBeforeById: data.user, options: {role: {...data.dataRole}}})
            if (this.objUserById) {
                this.isActiveDialog = true;
            }
        },
        clickTitlePosted: function (event) {
            if (_.isFunction(this.funcClickTitlePosted)) {
                this.funcClickTitlePosted(event);
            }
        },
        funcCloseProfile: function (data) {
            //this.$store.commit("userInfoShowMutation", {})
            this.isActiveDialog = false;
        },
    },
    watch: {
        isActiveDialog: function (t, f) {
            // console.log("ChatUser::isActiveDialog", t, f)
        }
    },
    beforeCreate: function () {
        // Mount component for recursive
        this.$options.components.UserProfilesComponent = require('./../../components/UserProfilesComponent.vue').default
    },
    destroyed() {
    }
}
</script>
