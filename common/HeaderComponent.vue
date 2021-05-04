<template>
    <div id="d-card-header" :class="`ion-header header-${typeComponent}`">

        <template v-if="typeComponent === constant.TYPE_COMPONENT.C_SEARCH_CAST && !!isCast" class="box-header">
            <div
                :class="[`d-flex align-items-center justify-content-between d-custom-header d-custom-header-search`, renderBoxClassWarp]">
                <div class="input-wrap" role="button" @click="clickFilterCastInput">
                    <div :class="'d-flex-inline p-0 '" role="button">
                        <IconSvgComponent :className="'d-icon-search'" :type="'search'"/>
                    </div>
                    <input disabled role="button" type="text" v-model="filterCastInput" :placeholder="placeholder"/>
                </div>
            </div>
        </template>

        <template v-if="typeComponent === constant.TYPE_COMPONENT.C_PROFILE" class="box-header">
            <div
                :class="[`d-flex align-items-center d-custom-header justify-content-between`, renderBoxClassWarp]">
                <div class="d-create-input-wrap btn p-0" @click="clickSettingProfile">
                    <v-icon>settings</v-icon>
                </div>

                <div class="d-inline-flex info-bar">
                    <v-icon class="btn line-height-qr-code" @click="clickSettingQR">qr_code</v-icon>
                    <button v-if="!!isUser" @click="clickSettingEdit">
                        <IconSvgComponent :class-name="'d-inline-block'" :type="'user-edit'"/>
                    </button>
                    <button v-if="!!isCast" @click="clickSettingEdit">
                        <IconSvgComponent :class-name="'d-inline-block'" :type="'user-edit'"/>
                    </button>
                </div>
            </div>
        </template>

        <template v-if="typeComponent === constant.TYPE_COMPONENT.C_FEED" class="box-header">
            <div
                :class="[`d-flex align-items-center d-custom-header d-custom-header-feed justify-content-between`, renderBoxClassWarp]">
                <div class="d-create-input-wrap btn p-0" @click="funcClickCreteFeed">
                    <IconSvgComponent :type="'post-add'"/>
                </div>
                <div class="d-selected-tag-wrap">
                    <v-select :class="'d-select-filter-feed'" solo :append-icon="'arrow_drop_down'" flat
                              item-text="name" class="option" :items="locationItems" v-model="selectLocal" @change="funcClickSearchPref"
                              return-object>
                    </v-select>
                </div>
                <div class="d-inline-flex info-bar ml-0" >
                    <div role="button" @click="clickSearchFeed">
                    <IconSvgComponent class="btn color-black" :className="'d-icon-search'"
                                      :type="'search'"/>
                    </div>

                    <div v-if="!notificationCount" class="d-inline-block" role="button" @click="clickShowListNotify"
                         style="margin-left: 19px;">
                        <IconSvgComponent :type="'bell'"/>
                    </div>
                    <v-badge v-else bordered overlap content="6">
                        <div class="d-inline-block" role="button" @click="clickShowListNotify">
                            <IconSvgComponent :type="'bell'" :className="isShowBadgeNotifyNew ? 'd-icon-active': ''"/>
                        </div>
                    </v-badge>
                </div>

                <v-dialog fullscreen persistent v-model="isShowNotice"
                          max-width="440"
                          :content-class="`d-dialog-show-fullscreen`"
                          transition="dialog-center-transition">

                    <NoticeComponent :isShowNotice="true" @closeNotice="false"
                                     :isShowClose="false">
                        <template v-slot:cbody>
                            <v-alert type="warning">
                                現在審査中です。Queenからのご連絡をお待ちください。
                            </v-alert>
                        </template>
                    </NoticeComponent>
                </v-dialog>

            </div>
        </template>

        <template v-if="typeComponent === constant.TYPE_COMPONENT.C_CHAT" class="box-header">
            <div
                :class="[`d-flex align-items-center justify-content-between d-custom-header d-custom-header-search d-header-border-width-3`, renderBoxClassWarp]">
                <div class="input-wrap d-inline-flex" role="button">
                    <div :class="'d-flex-inline p-0'" role="button" @click="clickFilterChatInput">
                        <IconSvgComponent :className="'d-icon-search'" :type="'search'"/>
                    </div>
                    <input v-model="vModelFilterChatRoom" id="filterChatRoom" :class="[{'d-color-active': vModelFilterChatRoom.length}]" @change="clickFilterChatInput" role="button" type="search" :placeholder="placeholder"/>
                    <div :class="'d-flex-inline p-0'" style="position: absolute; right: 5px; top: 10px" @click="removeFilterChatInput" v-if="vModelFilterChatRoom.length">
                        <v-icon role="button">close</v-icon>
                    </div>
                </div>

                <div class="info-bar ml-0">
                    <div v-if="!notificationCount" class="d-inline-block" role="button" @click="clickShowListNotify"
                         style="margin-left: 19px;">
                        <IconSvgComponent :type="'bell'"/>
                    </div>
                    <v-badge v-else bordered overlap content="6">
                        <div class="d-inline-block" role="button" @click="clickShowListNotify">
                            <IconSvgComponent :type="'bell'" :className="isShowBadgeNotifyNew ? 'd-icon-active': ''"/>
                        </div>
                    </v-badge>
                </div>
            </div>
        </template>

        <template v-if="typeComponent === constant.TYPE_COMPONENT.C_HOME" class="box-header">
            <div
                :class="[`d-flex align-items-center justify-content-between d-custom-header d-custom-header-search`, renderBoxClassWarp]">
                <div class="input-wrap" role="button" @click="clickFilterCastInput">
                    <div :class="'d-flex-inline p-0 '" role="button">
                        <IconSvgComponent :className="'d-icon-search'" :type="'search'"/>
                    </div>
                    <input disabled role="button" type="text" v-model="filterCastInput" :placeholder="placeholder"/>
                </div>

                <div class="info-bar ml-0">
                    <div v-if="!notificationCount" class="d-inline-block" role="button" @click="clickShowListNotify"
                         style="margin-left: 19px;">
                        <IconSvgComponent :type="'bell'"/>
                    </div>
                    <v-badge v-else bordered overlap content="6">
                        <div class="d-inline-block" role="button" @click="clickShowListNotify">
                            <IconSvgComponent :type="'bell'"/>
                        </div>
                    </v-badge>
                </div>
            </div>
        </template>

        <template v-if="typeComponent === constant.TYPE_COMPONENT.C_SEARCH_USER" class="box-header">
            <div
                :class="[`d-flex align-items-center justify-content-between d-custom-header d-custom-header-search`, renderBoxClassWarp]">
                <div class="input-wrap" role="button" @click="showFilterUserForm">
                    <div :class="'d-flex-inline p-0 '" role="button">
                        <icon-svg-component :className="'d-icon-search'" :type="'search'"/>
                    </div>
                    <input disabled role="button" type="text" :placeholder="placeholder"/>
                </div>
            </div>
        </template>
    </div>

</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import IconSvgComponent from "./IconSvgComponent";
import C from '../utils/constants'
import {TYPE_ROLE_USER} from "../utils/constant";
import {ROLE_CONFIRM_CAST} from "../utils/constant";
import NoticeComponent from "../components/NoticeComponent";

export default {
    data: function () {
        return {
            selectLocal: '',
            locationItems: [],
            filterCastInput: "",
            vModelFilterChatRoom: "",
            notificationCount: 0,
            isShowNotice: false,
        }
    },
    props: {
        funcGotoBack: {
            type: Function,
            defaultValue: null
        },
        typeComponent: String,
        titleComponent: {
            type: String,
            defaultValue: ""
        },
        placeholder: {
            type: String,
            defaultValue: ""
        }
    },
    components: {
        IconSvgComponent,
        NoticeComponent
    },
    mounted() {
        let locationItems = this.constant.LOCATION_ITEMS;
        this.selectLocal = locationItems[0];
        this.locationItems = locationItems;
        if (this.typeComponent === C.TYPE_COMPONENT.C_CHAT) {
            this.triggerEventEnter();
        }
    },
    methods: {
        ...mapActions({
            getGroupTags: 'getGroupTags',
            getResidences: 'getResidences',
            showDialogFilterUser: 'showDialogFilterUser',
            countNotification: 'countNotification',
        }),
        clickBack: function (event) {
            if (typeof this.funcGotoBack === "function") {
                this.funcGotoBack(event)
            }
        },
        setTimeoutAlertNotice: function () {
            this.isShowNotice = true;

            setTimeout(() => {
                this.isShowNotice = false;
            }, 1000)
        },
        funcClickCreteFeed: function () {
            if (this.user.cast_confirm && +this.user.cast_confirm === ROLE_CONFIRM_CAST.CONFIRM && this.isCast) {
                this.setTimeoutAlertNotice()
                return;
            }
            this.$store.dispatch('showFeedCreateDialogDispatch', true);
        },
        clickSearchFeed: function () {
            this.$store.dispatch('showFeedSearchDialogDispatch', {isShow: true, tags:[]});
        },
        clickFilterCastInput: function () {
            this.$store.dispatch('showDialogFilterCastDispatch', {
                isShow: true,
                data: {
                    inputCastName: this.filterCastInput
                }
            });
        },

        removeFilterChatInput: function () {
            this.$store.dispatch('filterChatRoomDispatch', {nickname: ""});
            this.vModelFilterChatRoom = ""
        },
        clickFilterChatInput: function () {
            let self = this;
            self.$nextTick(() => {
                if (self.vModelFilterChatRoom && self.vModelFilterChatRoom.trim().length) {
                    self.$store.dispatch('filterChatRoomDispatch', {nickname: self.vModelFilterChatRoom});
                } else {
                    self.removeFilterChatInput();
                }
            })
        },
        showFilterUserForm: function () {
            this.$store.dispatch('showDialogFilterUser', true);
        },
        clickSettingQR: function () {
            this.$store.dispatch('isShowMyQRCodeDialogDispatch', true)
        },
        clickSettingProfile: function () {
            this.$store.dispatch('isSettingProfileDialogDispatch', true)
        },
        clickSettingEdit: function () {
            this.$store.dispatch('isUpdateProfileDispatch', true)
        },
        clickShowListNotify: function () {
            this.$store.dispatch('isShowListNotifyDispatch', true);
        },
        funcClickSearchPref: function () {
            this.$store.dispatch('selectLocalDispatch', this.selectLocal);
        },
        triggerEventEnter: function () {
            let self = this;
            let inputFilterChatRoom = document.getElementById("filterChatRoom");
            self.$nextTick(() => {
                if (inputFilterChatRoom) {
                    inputFilterChatRoom.addEventListener("keyup", function (event) {
                        // Number 13 is the "Enter" key on the keyboard
                        if (event.keyCode === 13) {
                            // Cancel the default action, if needed
                            event.preventDefault();
                            // Trigger
                            self.clickFilterChatInput()
                        }
                    });
                }
            });
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
            role: state => state.user.role,
            isShowBadgeNotifyNew: state => state.notify.isShowBadgeNotifyNew,
        }),
        ...mapGetters({
            role: 'role',
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        isCast: function () {
            return this.role === TYPE_ROLE_USER.TYPE_CAST
        },
        renderBoxClassWarp: function () {
            return `d-box-${this.typeComponent}-wrap`.toLowerCase()
        },
        currentUserID: function () {
            return "userId"
        }
    },
    created() {
        let groupTagPayload = {};
        if (this.isCast) {
            groupTagPayload = {type: this.constant.TAG_TYPE.user};
        } else {
            groupTagPayload = {type: this.constant.TAG_TYPE.cast};
        }
        this.$store.dispatch('getGroupTags', groupTagPayload);
        // Optimize
        // this.$store.dispatch('getResidences');
        this.$store.dispatch('countNotification')
            .then(response => {
                this.notificationCount = response.data;
            })
            .catch(error => {
                // console.log(error);
            });
        Echo.channel(`read-notification.${this.user.id}`).listen('.notification_channel', (data) => {
            if (data) {
                this.notificationCount = data.data.count;
            }
        });
        Echo.channel(`content-notification.${this.user.id}`).listen('.notification_channel', () => {
            this.notificationCount++;
        });
    }
}
</script>
<style lang="scss">
.d-custom-header {
    .input-wrap {
        input.d-color-active {
            color: #1d1b18;
        }
    }
}
.line-height-qr-code {
    line-height: 0px !important;
}
</style>
