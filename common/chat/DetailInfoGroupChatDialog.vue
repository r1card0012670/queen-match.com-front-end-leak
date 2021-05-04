<template>
    <div>
        <v-dialog v-model="showLoginDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="`d-detail-info-group-wrap`" :id="`dialog-detail-info-group`">
                <v-card-title :id="'d-card-title-detail-info-group'"
                              :class="[`headline d-header-box-detail-info-group p-0`, 'd-border-bottom']">
                    <div class="card-header-top">
                        <button v-on:click="clickClose">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="d-title">グループメンバー</div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-detail-info-group'" class="d-card-text-detail-info-group p-0">
                    <v-layout class="col-12 d-flex justify-content-start p-0">
                        <div class="text-center">{{ allMemberInGroupLength }} メンバー</div>
                    </v-layout>
                    <v-list three-line class="p-0 mt-5">
                        <template v-for="(item, index) in allMemberInGroup">

                            <v-list-item :key="item.id" :class="['col-12 p-0']">
                                <v-list-item-avatar :size="48" @click="clickAvatarDetailGroupChat(item.id)"
                                                    role="button">
                                    <v-img :src="item.avatar"></v-img>
                                </v-list-item-avatar>

                                <v-list-item-content class="p-0">
                                    <v-list-item-title v-html="item.nickname" class="mb-0"></v-list-item-title>
                                    <v-list-item-subtitle class="text-wrap p-0">
                                        <LoginTimeMarkComponent :nameStatus="titleHeaderContentChat(item)"
                                                                :className="'d-inline-flex'" :type-status="onlineTypeStatus(item)"/>
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-if="isActiveDialog" v-model="isActiveDialog" :content-class="`d-dialog-show-fullscreen`"
                  max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
            <!-- Detail User -->
            <UserProfilesComponent v-if="isActiveDialog" :typeAction="'SHOW_PROFILE_OTHER'" :name="'chatGroup2show'"
                                   :userInfo="userInfo" @eventCloseProfile="funcCloseProfile"/>
        </v-dialog>
    </div>
</template>

<script>

import C from "../../utils/constants";
import LoginTimeMarkComponent from "../../common/LoginTimeMarkComponent";
import UserProfilesComponent from "../../components/UserProfilesComponent";
import {mapState} from "vuex";
import processDataUserProfile from "../../mixin/processDataUserProfile";
import appUtility from "../../utils/app-utility";

export default {
    name: "DetailInfoGroupChatDialog",
    mixins: [
        processDataUserProfile
    ],
    data: function () {
        return {
            isActiveDialog: false,
            userInfo: {},
        }
    },
    model: {
        event: 'change'
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
        isShowDialog: {
            type: Boolean,
            required: true
        },
        funcCallbackClose: {
            type: Function,
            required: true
        },
        listMemberInGroup: {
            type: Array,
            required: true,
            default: []
        },
    },
    components: {
        LoginTimeMarkComponent,
        UserProfilesComponent
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
            role: state => state.user.role,
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showLoginDialog: function () {
            return !!this.isShowDialog
        },
        allMemberInGroup: function () {
            let cl = _.cloneDeep(this.listMemberInGroup)

            cl.push(Object.assign({},
                _.pick(this.user, ["id", "cast_type", "nickname", "user_type", "last_active_time", "role", "avatar", "price_point"]),
                {
                    last_active_time: appUtility.momentTzNow(),
                    role: this.role
                }));

            return cl;
        },
        allMemberInGroupLength: function () {
            return this.allMemberInGroup.length
        }
    },
    methods: {
        titleHeaderContentChat: function (item) {
            return appUtility.renderOnlineStatus(item.last_active_time)
        },
        onlineTypeStatus: function (item) {
            return appUtility.renderOnlineTypeClass(item.last_active_time)
        },
        clickClose: function () {

            // Emit data before use method callback
            this.$nextTick(() => {
                this.funcCallbackClose(false)
            });
        },
        funcCloseProfile: function () {
            this.isActiveDialog = false
        },
        clickAvatarDetailGroupChat: async function (userOrCastId) {
            // Validate
            if (!userOrCastId || userOrCastId === this.user.id) {
                return;
            }

            let data = await this.initFetchUserORCastAsync(userOrCastId)
            if (!_.has(data, "user.id")) {
                return
            }
            this.userInfo = data.user;

            this.listUserOrCastData = data.suggestUserOrCast;
            // Init data for before use component UserProfilesComponent
            this.initProcessDataUserProfile({
                userOrCastId: data.user.id,
                fetchDataBeforeById: data.user,
                options: {role: {...data.dataRole}}
            });
            this.isActiveDialog = true

            // console.log("clickAvatar g >> chat")
        }
    },
    beforeCreate: function () {
        // Mount component for recursive
        this.$options.components.UserProfilesComponent = require('./../../components/UserProfilesComponent.vue').default;
    },
}
</script>
