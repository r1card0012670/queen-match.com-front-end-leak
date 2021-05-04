<template>
    <div :class="`app-content-user-profile-wrapper`" :id="userId">
        <div :id="`d-user-profile-${userId}-wrapper`">
            <v-card :class="[`d-dialog-user-profile`, 'd-width-100', 'd-header-box-relative']" :loading="loading"
                    :id="`dialog-user-profile`">
                <div :class="[`${classNameBox}d-user-profile-wrapper`]">
                    <div class="d-user-profile-header">
                        <v-card-title :id="'d-card-title-user-profile'"
                                      :class="[`headline d-header-box-user-profile d-header-box-absolute p-1`, classEditUserProfile]">
                            <div
                                :class="[`d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100`, classCardHeaderTop]">
                                <button v-on:click="funcBack" class="d-flex p-0">
                                    <v-badge bordered overlap class="ml-0" v-if="typeAction !== 'EDIT_PROFILE'">
                                        <IconSvgComponent :type="'arrow-left-short'"/>
                                    </v-badge>
                                    <v-img v-if="typeAction === 'EDIT_PROFILE'" contain
                                           src="../../images/chevron-left.svg"/>
                                </button>
                                <div v-if="typeAction === 'EDIT_PROFILE'"
                                     :class="`d-inline-act-role d-flex justify-content-between flex-grow-1 pt-1`">
                                    <div class="d-title">プロフィールを編集</div>

                                    <div class="d-box-infa">
                                        <v-btn plain text v-on:click="funcVisibility(userId, typeAction)"
                                               class="d-flex pl-0 pr-0">
                                            <v-icon>visibility</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                                <div v-if="typeAction === 'SHOW_PROFILE_OTHER'" class="d-flex info-bar">
                                    <v-badge bordered overlap>
                                        <div class="d-inline-block" role="button" @click="clickShareUserHereView">
                                            <IconSvgComponent :type="'share'"/>
                                        </div>
                                    </v-badge>
                                </div>
                            </div>
                        </v-card-title>
                    </div>
                    <div
                        :class="[`${classNameBox}d-user-profile-body`, 'p-0', {'d-user-profile-mb': checkUShowBoxFooter} ]">
                        <v-card-text :id="'d-card-text-user-profile'">
                            <CardUserComponent v-if="itemUser && isFetchDataFinish"
                                               :itemData="mixDataUserInfo(itemUser, userInfo)" type="user-profile"
                                               :name="'test12' + userInfo.id"
                                               :typeShowPicture="'bgImgProfile'"
                                               :preventClickDetail="true"
                                               :nameStatus="`オンライン中`"
                                               :useGradeNameInCardInfo="true"
                                               :imgAvatarDefault="currentSlideShowImageUser"
                                               :getInfoManagement="getInfoManagement"
                                               :addData="itemUser"
                                               :isThumbBg="true"
                                               :typeAct="typeAction"/>

                            <v-col
                                :class="[`d-user-image-wrapper p-0`, typeAction === 'EDIT_PROFILE' ? 'break-line' : 'scroll-bar' ]">
                                <v-avatar size="59" v-for="(item, index) in filterUserImages" :key="index"
                                          v-if="item.image"
                                          @click="clickPictureThumbImage(item, typeAction)" class="custom-margin">
                                    <v-img :src="item.image"/>
                                </v-avatar>
                                <v-avatar size="59" v-if="typeAction === 'EDIT_PROFILE'" class="custom-margin">
                                    <label for="file">
                                        <v-img contain src="../../images/GR-add-img.svg"/>
                                    </label>
                                    <input type="file" accept=".jpg, .jpeg, .png" multiple ref="file" id="file"
                                           @change="handleFileUpload"/>
                                </v-avatar>
                            </v-col>

                            <template v-if="typeAction === 'EDIT_PROFILE'">
                                <EditProfile :userId="userId" name="editprofile" :dateWorkingTime="dateWorkingTime"
                                             :getCurrentUserInfo="getCurrentUserInfo"
                                             :getInfoManagement="getInfoManagement"/>
                            </template>

                            <template v-else>
                                <div class="col-12 p-0">
                                    <v-divider :class="`mt-1 mb-1`"/>
                                </div>

                                <v-col :class="[`d-user-hashtag-wrapper`, 'p-0' , 'tag-wrapper']" v-if="itemUser.tags">
                                    <div class="list-tag list-tag-v2 no-scroll">
                                        <div class="d-flex wrap-tag">
                                            <div class="text-center" v-for="(item, index) in itemUser.tags"
                                                 :key="index">
                                                <v-chip>{{ item.tag_name }}</v-chip>
                                            </div>
                                        </div>
                                    </div>
                                </v-col>

                                <div
                                    v-if="hasDataDateWorkingTime && (typeAction === 'SHOW_PROFILE_OTHER' || typeAction === 'SHOW_PROFILE_ME') && !!isCastOfComponent">
                                    <div class="col-12 p-0">
                                        <v-divider :class="`mt-1 mb-1 width-4`"/>
                                    </div>
                                    <v-col :class="`d-user-calendar-wrapper p-0`">
                                        <LabelsComponent :label="'スケジュール'" :col3="true"/>
                                        <CalendarWeekly :userId="userId" :dateWorkingTime="dateWorkingTime"/>
                                    </v-col>
                                </div>

                                <div class="col-12 p-0">
                                    <v-divider :class="`mt-1 mb-1 width-4`"/>
                                </div>
                                <v-col :class="`d-user-content-wrapper p-0`" v-if="itemUser.self_introduction">
                                    <LabelsComponent :label="'自己紹介'"/>
                                    <div class="d-content-html">
                                        <ContentWrapper :readMoreActivated="readMoreActivated"
                                                        :raw-text="itemUser.self_introduction"
                                                        :funcActivateReadMore="changeActivateReadMore"/>
                                    </div>
                                </v-col>

                                <v-col :class="`d-user-info-wrapper p-0`">
                                    <LabelsComponent :label="' 基本情報  '"/>
                                    <UserInfoWrapper v-for="(item, index) in itemUserInfo" :key="index"
                                                     :dataInfo="item"/>
                                    <v-btn :class="[`v-btn-share${typeAction === 'SHOW_PROFILE_OTHER' ? '-' : ''}`]"
                                           @click="clickShareUserHereView">
                                        プロフィールをシェアしよう
                                    </v-btn>
                                </v-col>

                                <div v-if="typeAction === 'SHOW_PROFILE_OTHER'">
                                    <div class="col-12 p-0" v-if="isUserOfComponent && isSessionUser">
                                        <v-divider :class="`mt-1 mb-1 width-4`"/>
                                    </div>

                                    <v-col :class="`d-user-favorite-wrapper-label p-0 m-0`"
                                           v-if="isCastOfComponent">
                                        <LabelsComponent :label="'このキャストを見た人におすすめのキャスト'"/>
                                    </v-col>
                                    <v-col :class="`d-user-favorite-wrapper p-0`" v-if="isCastOfComponent && !isSessionCast">
                                        <div class="d-inline-flex box-1 p-0 d-box-new-card d-user-favorite">
                                            <CardUserComponent v-for="(item, index) in fetchListUser" :key="index"
                                                               type="user-favorite" v-if="item"
                                                               :name="'test123' + index"
                                                               :itemData="item"
                                                               :useGradeNameInCardInfo="false"
                                                               :imgAvatarDefault="item.avatar"
                                                               :isShowGradeName="false"/>
                                        </div>
                                    </v-col>

                                    <div class="col-12 p-0">
                                        <v-divider :class="`mt-1 mb-1 width-4`"/>
                                    </div>

                                    <v-col :class="[`d-thread-feed-wrapper`, 'p-0']">
                                        <ThreadContent :userId="userId" v-if="hasDataContent" :isPreventDefault="true"
                                                       :type="`event-act-from-user-profile`"/>
                                        <ThreadDetailDialog v-if="isHasDataContentDetail" :objUser="activeUser" :actPreventDefault="'user-2-profile'"
                                                            :dataContent="dataContentDetail"/>
                                    </v-col>

                                    <v-col :class="[`d-cast-price-wrapper`, 'p-0']"
                                           v-if="isCastOfComponent && isSessionUser">
                                        <v-list-item-content :class="[`pb-0`]" v-if="checkHasPrice">
                                            <CastPrice :userId="userId" :userInfo="itemUser"/>
                                        </v-list-item-content>
                                    </v-col>
                                </div>

                            </template>
                        </v-card-text>
                    </div>

                    <div v-if="checkUShowBoxFooter"
                         :class="[`${classNameBox}d-user-profile-footer`, 'fixed-bottom']">
                        <div :class="[`d-follow-user-wrapper-1`, 'p-0', 'd-flex', 'justify-content-between']">
                            <v-btn v-if="isShowText" outlined class="btn-base max-width-pre-80 width-unset"
                                   @click="clickOrderBooking">
                                優先マッチング希望して続ける
                            </v-btn>
                            <FollowUser :isShowText="!isShowText" :callBack="userORCastFollow"
                                        :className="isShowText ? `max-width-pre-18 width-unset not-show-text p-0`: ``"
                                        v-if="checkUseFollow" :userId="userId" :isFollowed="isFollowed"/>
                        </div>
                    </div>
                </div>
            </v-card>
        </div>

        <div v-if="typeAction === 'EDIT_PROFILE'">
            <v-dialog v-if="isVisibilityMyProfile" v-model="isVisibilityMyProfile"
                      :content-class="`d-dialog-show-fullscreen`" max-width="440"
                      fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
                <UserProfilesComponent v-if="isVisibilityMyProfile && isFetchDataFinish" name="isMeProfile"
                                       :typeAction="'SHOW_PROFILE_ME'" :userInfo="getCurrentUserInfo"
                                       @eventCloseProfile="funcCloseProfileVisibility"/>

            </v-dialog>
        </div>

        <ChangeImageDialog v-if="isShowChangeImageDialog && typeAction === 'EDIT_PROFILE'"
                           :isShowDialog="isShowChangeImageDialog"
                           :imageId="imageId"
                           :setAsAvatar="setAsAvatar"
                           :funcCallbackEventData="funcImageCallBackClose" :isList="isList"/>

        <UploadImageFailedDialog v-if="isShowErrorDialog" :uploadFailed="isShowErrorDialog"
                                 @closeErrorDialog="closeUploadFailedDialog"/>

        <input type="text" :value="forceUpdate" hidden>

        <ThreadChatDialog :isShowDialog="isShowDialogThreadChatInUser" :objThreadChat="objThreadChatUserProfile" name="threadChatInUserProfile"
                          v-if="isShowDialogThreadChatInUser"
                          :typeChat="typeChat" :funcCloseDialog="eventCloseDialogThreadChat"/>

        <v-overlay v-if="overlay" :value="overlay" :absolute="absolute">
            <v-btn color="success lighten-2">
                <p style="color: white; padding-top: 15px">コピーしました</p>
            </v-btn>
        </v-overlay>
    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import C from '../utils/constants'
import dynamicUerProfile from "../mixin/dynamicUerProfile";
import IconSvgComponent from "../common/IconSvgComponent";
import CardUserComponent from "../common/CardUserComponent";
import LabelsComponent from "../common/LabelsComponent";
import ThreadContent from "../common/feed/ThreadContent";
import ThreadDetailDialog from "../common/feed/ThreadDetailDialog";
import ContentWrapper from "../common/user/ContentWrapper";
import UserInfoWrapper from "../common/user/UserInfoWrapper";
import FollowUser from "../common/user/FollowUser";
import CastPrice from "../common/user/CastPrice";
import CalendarWeekly from "../common/user/CalendarWeekly";
import ThreadCreateOrEditDialog from "./../common/feed/ThreadCreateOrEditDialog";
import EditProfile from "./../common/user/EditProfile";
import {TYPE_CAST_FOLLOW_USER, TYPE_ROLE_USER, TYPE_USER_FOLLOW_CAST, UNSELECT} from "../utils/constant";
import ChangeImageDialog from "../common/user/ChangeImageDialog";
import UploadImageFailedDialog from "../common/user/UploadImageFailedDialog";
import processDataUserProfile from "../mixin/processDataUserProfile";
import ThreadChatDialog from "../common/chat/ThreadChatDialog";

export default {
        name: "UserProfilesComponent",
        mixins: [
            dynamicUerProfile,
            processDataUserProfile
        ],
        props: {
            userInfo: {
                type: Object,
                required: true
            },
            name: {
                type: String,
            },
            typeAction: {
                type: String,
                required: true
            },
            actType: {
                type: String,
                required: false,
                default: ""
            },
            actShort: {
                type: String,
                required: false,
                default: ""
            },
            classNameBox: {
                type: String,
                default: "",
                required: false
            },
            isFetchData: {
                type: Boolean,
                default: true,
                required: false
            },
            listUserOrCastData: {
                // Fetch before render component, so loop component
                type: Array,
                defaultValue: [],
                required: false
            }
        },
        data: function () {
            return {
                typeChat: "",
                isShowDialogThreadChatInUser: false,
                objThreadChatUserProfile: {},
                isActiveDialogNext: false,
                userInfoNext: {},
                listUserOrCast: [],
                absolute: true,
                overlay: false,
                visible: false,
                canCancel: false,
                payload: {},
                currentUserID: "",
                objCurrentUser: {},
                objSlideShowImageUser: {},
                readMoreActivated: false,
                currentSlideShowImageUser: "",
                itemUser: {},
                loading: false,

                switch1: false,
                forceUpdate: 0,
                file: '',
                uploadResults: {},
                imageId: '',
                isShowChangeImageDialog: false,
                setAsAvatar: '',
            }
        },
        components: {
            ChangeImageDialog,
            IconSvgComponent,
            CardUserComponent,
            ContentWrapper,
            UserInfoWrapper,
            ThreadContent,
            FollowUser,
            CastPrice,
            LabelsComponent,
            CalendarWeekly,
            ThreadDetailDialog,
            ThreadCreateOrEditDialog,
            EditProfile,
            UploadImageFailedDialog,
            ThreadChatDialog
        },
        mounted: function () {
            let self = this
            // listUserOrCastInfoShow
            let findIndex = _.findLastIndex(self.listUserOrCastInfoShow, (ele) => ele.id === self.userInfo.id);

            if (findIndex !== -1) {
                self.itemUser = _.cloneDeep(self.listUserOrCastInfoShow[findIndex]);
                // self.itemUser = JSON.parse(JSON.stringify(itemLast));
                // self.itemUser = this.userInfoShow;
                self.$store.commit("isFetchDataFinishMutation", true)
                // self.initSelectUser();
            } else {
                if (self.typeAction === "SHOW_PROFILE_ME" || this.typeAction === "EDIT_PROFILE") {
                    self.itemUser = JSON.parse(JSON.stringify(self.user))
                    self.$store.commit("isFetchDataFinishMutation", true)
                } else {
                    //
                    console.warn(" Not user or cast", self.userInfo.id, self.itemUser.id)
                    self.loading = false;
                    self.itemUser = self.userInfo
                    // self.initSelectUser(); // Set image
                }
            }

            self.listUserOrCast = _.has(self.listUserOrCastData) ? self.listUserOrCastData : []
            this.initSelectUser(); // Set image
            this.getInfoMaster();
        },
        methods: {
            closeUploadFailedDialog: function (data) {
                if (data === true) {
                    this.$store.dispatch('isShowErrorDialogDispatch', false);
                }
            },
            getInfoMaster: function () {
                if (!this.getInfoManagement.length) {
                    this.$store.dispatch('getInfoManagementDispatch', {});
                }
            },
            mixDataUserInfo: function (itemUser, userInfo) {
                return Object.assign({}, _.cloneDeep(itemUser), _.cloneDeep(userInfo));
            },
            funcImageCallBackClose: function () {
                this.isShowChangeImageDialog = false
            },
            goBack: function (event) {
                if (typeof this.funcGotoBack === "function") {
                    this.funcGotoBack(event)
                }
            },
            changeActivateReadMore: function (val) {
                this.readMoreActivated = val;
            },
            funcCloseProfileVisibility: function (event) {
                this.$store.dispatch('isVisibilityMyProfileDispatch', false)
            },
            initOnscrollContentText: function () {
                let cardTextUserProfile = document.getElementById("d-card-text-user-profile");
                if (!!cardTextUserProfile) {
                    cardTextUserProfile.addEventListener('scroll', this.funcOnscrollContentText, false)
                }
            },
            funcOnscrollContentText: function () {
                let self = this;
                let cardTitleUserProfile = document.getElementById("d-card-title-user-profile");
                let cardTextUserProfile = document.getElementById("d-card-text-user-profile");
                if (!cardTextUserProfile || !cardTitleUserProfile) {
                    return;
                }
                let offsetHeightTitle = +cardTitleUserProfile.offsetHeight;
                let offsetTopText = +cardTextUserProfile.scrollTop;
                let classNameScrollFixedTop = 'd-fixed-top';
                if (offsetTopText < offsetHeightTitle) {
                    cardTitleUserProfile.classList.remove(classNameScrollFixedTop);

                } else {
                    cardTitleUserProfile.classList.add(classNameScrollFixedTop);
                }
            },
            clickPictureThumbImage: function (val, typeAction) {
                if (val.image) {
                    this.objSlideShowImageUser[this.userId] = val.image;
                    let tmp = _.defaultsDeep(this.objCurrentUser[this.userId]);
                    tmp.currentSlideShowImageUser = val.image;
                    this.objCurrentUser[this.userId] = tmp;
                    if (typeAction !== 'EDIT_PROFILE') {
                        this.currentSlideShowImageUser = val.image;
                    }
                }
                this.imageId = val.id;
                this.setAsAvatar = val.set_as_avatar;
                this.isShowChangeImageDialog = true;
            },
            slideShowImageUser: function (userId) {
                this.currentSlideShowImageUser = this.objCurrentUser[userId] && _.has(this.objCurrentUser[userId], "currentSlideShowImageUser")
                    ? this.objCurrentUser[userId].currentSlideShowImageUser : "";
            },
            initSelectUser: function () {
                let userId = this.itemUser.id;
                let filter = (this.itemUser.user_images || []).filter(ele => !!ele.set_as_avatar);
                let data = {}
                if (filter.length) {
                    // Array
                    data = _.cloneDeep(filter[0]);
                    data.currentSlideShowImageUser = filter[0].image;
                } else {
                    if (this.itemUser.user_images && this.itemUser.user_images.length) {
                        // Object
                        data = this.itemUser.user_images[0];
                        data.currentSlideShowImageUser = this.itemUser.user_images[0].image;
                    } else {
                        // this.getUserImages
                        data.currentSlideShowImageUser = C.AVATAR_DEFAULT;
                    }
                }

                this.objCurrentUser[userId] = data;
                this.slideShowImageUser(userId)
            },
            notFoundUser: function () {
                debugger
                // TODO
                this.$nextTick(() => {
                    const path = `/home`
                    if (this.$route.path !== path) {
                        this.$router.replace(path);
                    }

                    this.$store.dispatch('activeNavBottomDispatch', true);
                })
            },
            clickOrderBooking: function () {
                if (this.actShort === "add-cast-for-merge") {
                    // Add short cast in step 3
                    if (_.has(this.activeUser, "id")) {
                        this.$store.dispatch("addCastForMergeDispatch", this.activeUser)
                    }

                    this.funcBack()
                    return;
                }

                this.$store.dispatch("castShortcutForMergeDispatch", Object.assign({}, this.activeUser, {
                    castId: this.userId,
                    isShow: true
                }))

            },
            handleFileUpload: function () {
                Promise.resolve().then(() => {
                    this.file = this.$refs.file.files[0];

                    let formData = new FormData();

                    formData.append('file', this.file);
                    formData.append('user_id', this.user.id);
                    /*
                      Make the request to the POST /multiple-files URL
                    */

                    return formData
                }).then(formData => {
                    this.$store.dispatch('uploadImageDispatch', formData);
                })
            },
            isList: function () {
                if (this.itemUser.user_images.length > 1) {
                    return true;
                }
                return false;
            },
            clickShareUserHereView: function () {
                let self = this;
                let timer = setInterval(() => {
                    this.overlay = true
                }, 1000);

                Promise.resolve().then(() => {
                    self.overlay = true;
                    let roleUserOrCastHere = this.roles.length ? this.roles[0] : null;
                    let refererCodeUserOrCastHere = this.itemUser.hasOwnProperty("referer_code") ? this.itemUser.referer_code : null;
                    // Validate
                    if (!refererCodeUserOrCastHere || !roleUserOrCastHere) {
                        return Promise.reject("Not match data")
                    }
                    return {
                        profileUrl: `${window.location.origin}/${this.constant.PATH_PROFILE_VIEW}/${roleUserOrCastHere}/${refererCodeUserOrCastHere}`.toLowerCase()
                    }
                }).then(async res => {
                    if (navigator.clipboard !== undefined) { //Chrome
                        return await navigator.clipboard.writeText(res.profileUrl).then(function () {
                            // console.log('Async: Copying to clipboard was successful!');
                        }).catch(function (err) {
                            // console.error('Async: Could not copy text: ', err);
                        });
                    }

                    return this.copyToClipboardByString(res.profileUrl);
                }).then(() => {
                    self.clearTimer(timer);
                }).catch(err => {
                    self.clearTimer(timer);
                    console.warn("Not match data to share.")
                })
            },
            clearTimer: function (timer) {
                let self = this;
                setTimeout(() => {
                    self.overlay = false
                    clearInterval(timer)
                }, 1200)
            },
            userORCastFollow: async function () {
                if (this.isMe) {
                    return;
                }

                if (this.isFollowed) {
                    if (!Object.keys(this.detailThreadRoomChat).length) {
                        await this.$store.dispatch('detailThreadChatRoomDispatch',
                            {
                                data: {
                                    type: "single",
                                    user_ids: [this.user.id, this.itemUser.id],
                                    isFollowed: 1 // Create room with single
                                }
                            }).then(result => {

                            // Show chat messages
                            this.isShowDialogThreadChatInUser = true;
                            this.objThreadChatUserProfile = result
                            this.typeChat = `${result.type}`.toUpperCase();
                            this.$store.commit("detailThreadRoomChatMutation", result)
                        }).catch(err => {
                            this.isShowDialogThreadChatInUser = false;
                        })
                    } else {
                        this.isShowDialogThreadChatInUser = true;
                        this.objThreadChatUserProfile = this.detailThreadRoomChat
                        this.typeChat = `${this.detailThreadRoomChat.type}`.toUpperCase();
                    }

                    return;
                }

                // Call dispatch follow
                this.$store.dispatch("userORCastFollowDispatch", {
                    data: {
                        user_id: this.isSessionUser ? this.user.id : this.itemUser.id,
                        cast_id: this.isSessionCast ? this.user.id : this.itemUser.id,
                        ...this.isSessionUser && this.isCastOfComponent && {follow_type: TYPE_USER_FOLLOW_CAST},
                        ...this.isSessionCast && this.isUserOfComponent && {follow_type: TYPE_CAST_FOLLOW_USER}
                    },
                    target: this.itemUser.id
                });
                // Create room with single
                this.$store.dispatch("userRequestCreateRoomDispatch", {castId: this.itemUser.id});
            },
            eventCloseDialogThreadChat: function (data) {
                this.isShowDialogThreadChatInUser = false;
                this.typeChat = "";
            }
        },
        computed: {
            ...mapState({
                // Format [stageName] => state.[modulesName].[stageName],
                isVisibilityMyProfile: state => state.user.isVisibilityMyProfile,
                // itemUsers: state => state.user.itemUsers, // Fake
                role: state => state.user.role,
                user: state => state.user.user,
                feedDetail: state => state.feed.feedDetail,
                listFeedDetail: state => state.feed.listFeedDetail,
                showFeedCreateDialog: state => state.feed.showFeedCreateDialog,
                showFeedEditDialog: state => state.feed.showFeedEditDialog,
                uploadImage: state => state.image.uploadImage,
                getUserImages: state => state.image.getUserImages,
                getCurrentUserInfo: state => state.user.getCurrentUserInfo,
                getInfoManagement: state => state.info.getInfoManagement,
                isShowErrorDialog: state => state.image.isShowErrorDialog,
                userData: state => state.image.userData,
                isFetchDataFinish: state => state.user.isFetchDataFinish,
                // userInfoShow: state => state.user.userInfoShow,
                infoFollowUserOrCast: state => state.user.infoFollowUserOrCast,
                // listUserOrCast: state => state.user.listUserOrCast,
                listUserOrCastInfoShow: state => state.user.listUserOrCastInfoShow,
                detailThreadRoomChat: state => state.user.detailThreadRoomChat,

            }),
            ...mapGetters({
                // itemUsers: "itemUsers",
                feedDetail: "feedDetail",
                showFeedCreateDialog: "showFeedCreateDialog",
                showFeedEditDialog: "showFeedEditDialog",
            }),
            constant: function () {
                return Object.assign({}, C)
            },
            roles: function () {
                // role of user or cast of component
                return this.itemUser && this.itemUser.roles
                    ? _.compact(this.itemUser.roles.map(ele => (_.has(ele, "role_name") ? `${ele.role_name}` : null)))
                    : [];
            },
            isCastOfComponent: function () {
                return _.indexOf(this.roles, TYPE_ROLE_USER.TYPE_CAST) !== -1;
            },
            isUserOfComponent: function () {
                return _.indexOf(this.roles, TYPE_ROLE_USER.TYPE_USER) !== -1;
            },
            isSessionUser: function () {
                return this.role === TYPE_ROLE_USER.TYPE_USER;
            },
            accessRole: function () {
                if (!!this.isCastOfComponent) {
                    return TYPE_ROLE_USER.TYPE_CAST
                }
                if (!!this.isUserOfComponent) {
                    return TYPE_ROLE_USER.TYPE_USER
                }
            },
            isMe: function () {
                return (this.user.id === this.itemUser.id)
            },
            keyDataFeed: function () {
                // TODO
                if (this.isUserOfComponent) {
                    return "users"
                }
                if (this.isCastOfComponent) {
                    return "casts"
                }
            },
            activeUser: function () {
                let self = this;

                return self.itemUser;
            },
            hasDataNext: function () {
                // Because recursive, so get last item
                let fi = _.findLastIndex(this.listUserOrCastInfoShow, (ele) => ele.id === this.userInfo.id);

                return fi !== -1
            },

            hasDataContent: function () {
                let self = this;
                return !!Object.keys(self.dataContent).length
            },
            userId: function () {
                return `${this.activeUser.id}`;
            },
            dataContent: function () {
                let self = this;
                // fixed
                // Store in active modal in feed, show need data when event active, when return true
                return _.has(self.listFeedDetail, "user_create_id") ? true : self.listFeedDetail
            },
            dataContentDetail: function () {
                let self = this;
                // fixed
                // Store in active modal in feed, show need data when event active, when return true
                return self.feedDetail;
            },
            isHasDataContentDetail: function () {
                return !!Object.keys(this.feedDetail).length
            },
            typeSFeedCreateOrEditDialog: function () {
                if (!!this.showFeedCreateDialog) {
                    return "feed-create"
                }
                if (!!this.showFeedEditDialog) {
                    return "feed-edit"
                }

                // Default
                return ""
            },
            itemUserImages: function () {
                return _.has(this.itemUser, "images") && _.isArray(this.itemUser.images) ? this.itemUser.images : []
            },
            itemUserInfo: function () {
                let height = '';
                let residence = '';
                let birth_place = '';
                let literacy = '';
                let annual_income = '';
                let job = '';
                let sake = '';
                let tobacco = '';
                let siblings = '';
                let cohabitant = '';
                if (_.has(this.itemUser, "height")) {
                    let tmpHeight = this.getInfoManagement.find(element => element.id === this.itemUser.height);
                    height = tmpHeight && tmpHeight.value !== UNSELECT ? tmpHeight.value : null
                }
                if (_.has(this.itemUser, "residence")) {
                    let tmpResidence = this.getInfoManagement.find(element => element.id === this.itemUser.residence);
                    residence = tmpResidence && tmpResidence.value !== UNSELECT ? tmpResidence.value : null
                }
                if (_.has(this.itemUser, "birth_place")) {
                    let tmpBirthPlace = this.getInfoManagement.find(element => element.id === this.itemUser.birth_place);
                    birth_place = tmpBirthPlace && tmpBirthPlace.value !== UNSELECT ? tmpBirthPlace.value : null
                }
                if (_.has(this.itemUser, "literacy")) {
                    let tmpLiteracy = this.getInfoManagement.find(element => element.id === this.itemUser.literacy);
                    literacy = tmpLiteracy && tmpLiteracy.value !== UNSELECT ? tmpLiteracy.value : null
                }
                if (_.has(this.itemUser, "annual_income")) {
                    let tmpIncome = this.getInfoManagement.find(element => element.id === this.itemUser.annual_income);
                    annual_income = tmpIncome && tmpIncome.value !== UNSELECT ? tmpIncome.value : null
                }
                if (_.has(this.itemUser, "job")) {
                    let tmpJob = this.getInfoManagement.find(element => element.id === this.itemUser.job);
                    job = tmpJob && tmpJob.value !== UNSELECT ? tmpJob.value : null
                }
                if (_.has(this.itemUser, "sake")) {
                    let tmpSake = this.getInfoManagement.find(element => element.id === this.itemUser.sake);
                    sake = tmpSake && tmpSake.value !== UNSELECT ? tmpSake.value : null
                }
                if (_.has(this.itemUser, "tobacco")) {
                    let tmpTobacco = this.getInfoManagement.find(element => element.id === this.itemUser.tobacco);
                    tobacco = tmpTobacco && tmpTobacco.value !== UNSELECT ? tmpTobacco.value : null
                }
                if (_.has(this.itemUser, "siblings")) {
                    let tmpSiblings = this.getInfoManagement.find(element => element.id === this.itemUser.siblings);
                    siblings = tmpSiblings && tmpSiblings.value !== UNSELECT ? tmpSiblings.value : null
                }
                if (_.has(this.itemUser, "cohabitant")) {
                    let tmpCohabitant = this.getInfoManagement.find(element => element.id === this.itemUser.cohabitant);
                    cohabitant = tmpCohabitant && tmpCohabitant.value !== UNSELECT ? tmpCohabitant.value : null
                }

                return _.compact([
                    !!height && {name: "身長", content: height},
                    !!residence && {name: "居住地", content: residence},
                    !!birth_place && {name: "出身地", content: birth_place},
                    !!literacy && {name: "学歴", content: literacy},
                    !!annual_income && {name: "年収", content: annual_income},
                    !!job && {name: "お仕事", content: job},
                    !!sake && {name: "お酒", content: sake},
                    !!tobacco && {name: "タバコ", content: tobacco},
                    !!siblings && {name: "兄弟姉妹", content: siblings},
                    !!cohabitant && {name: "同居人", content: cohabitant},
                ]);
            },
            fetchListUser: function () {
                if (!this.listUserOrCastData || !this.listUserOrCastData.length) {
                    return [];
                }

                return (this.listUserOrCastData || []).filter(ele => +ele.id !== +this.userId);
            },
            checkHasPrice: function () {
                return true
            },
            infoPrice: function () {
                // TODO
                return {}
            },
            checkUseFollow: function () {
                return true
            },
            classEditUserProfile: function () {
                if (this.typeAction === 'EDIT_PROFILE') {
                    return 'd-header-edit-user-profile';
                }
                return '';
            },
            classCardHeaderTop: function () {
                if (this.typeAction === 'EDIT_PROFILE') {
                    return 'card-header-top';
                }
                return '';
            },
            isShowText: function () {
                return !!this.actType && this.actType === "list-cast-today-booking";
            },
            dateWorkingTime: function () {
                return _.has(this.itemUser, "working_time") ? this.itemUser.working_time : []
            },
            hasDataDateWorkingTime: function () {
                return _.isObject(this.dateWorkingTime)
                    ? !!Object.keys(this.dateWorkingTime).length
                    : _.isArray(this.dateWorkingTime)
                        ? !!this.dateWorkingTime.length : false
            },
            isFollowed: function () {
                return _.indexOf(this.infoFollowUserOrCast, this.itemUser.id) !== -1;
            },
            checkUShowBoxFooter: function () {
                // Cast - Cast
                if (this.isSessionCast && this.isCastOfComponent) {
                    return false
                }
                // User - User
                if (this.isSessionUser && this.isUserOfComponent) {
                    return false
                }

                return this.typeAction === 'SHOW_PROFILE_OTHER' && !this.isMe// && !!this.isCastOfComponent && this.isSessionUser;
            },
            filterUserImages: function () {
                return _.uniqBy(this.getUserImages.filter(ele => +ele.user_id === +this.itemUser.id), "id")
            }
        },
        watch: {
            // userInfoShow: {
            //     handler: function (newData, old) {
            //         // this.itemUser = newData
            //         // this.initSelectUser();
            //     },
            //     deep: true
            // },
            listUserOrCastInfoShow: function (newData) {
                this.$nextTick(() => {
                    this.itemUser = JSON.parse(JSON.stringify(newData[newData.length - 1]));
                    this.initSelectUser();
                })
            },
            getUserImages: function (t, f) {
                if (!!t.length && t[0].user_id === this.itemUser.id) {
                    this.currentSlideShowImageUser = t[0].image
                }
            },
            isFetchDataFinish: function (t, f) {
                if (!!t) {
                    this.loading = false
                }
            }
        },
        created() {
            let self = this;
            this.cloneUserInfo = this.userInfo;
            self.initOnscrollContentText();

            // this.$store.commit('isFetchDataFinishMutation', false);
            /// Check Fetch data
            if (!!self.isFetchData) {
                // this.$store.dispatch("fetchDataUserOrCastByIdDispatch", Object.assign({}, this.userInfo, {
                //     id: this.userInfo.id
                // }))
            }
        },
        beforeCreate: function () {
            // Mount component for recursive
            this.$options.components.CardUserComponent = require('./../common/CardUserComponent.vue').default;
            this.$options.components.ThreadChatDialog = require('./../common/chat/ThreadChatDialog.vue').default;
        },
        destroyed() {
            // Remove all user in dialog show user profile
            // this.$store.commit("feedDetailMutations", {});
            this.isShowDialogThreadChatInUser = false;
            this.typeChat = "";
        }
    }
</script>
<style lang="scss" scoped>
    label {
        cursor: pointer;
        padding-top: 10px;
        /* Style as you please, it will become the visible UI component. */
    }

    #file {
        opacity: 0;
        position: absolute;
        z-index: -1;
    }

    .break-line {
        display: flex;
        flex-wrap: wrap;
    }

    .scroll-bar {
        overflow-x: auto;
    }

    .d-user-image-wrapper .custom-margin {
        margin: 8px 4px 4px;
    }
    .wrap-tag {
        flex-wrap: wrap;
    }
</style>
