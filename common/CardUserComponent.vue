<template>
    <div :class="[ `d-new-card`, renderClassNameWrapper]">
        <div :class="[`d-cast-card-wrapper`, {'selected': !!checkChosenCast(itemData.id) }]">
            <div :class="classCursorMouse" v-on:click="showDetailUserProfile(itemData)">
                <div class="d-box-cast-time" v-if="type === 'list-cast-today-booking'">
                    <span role="menu">{{ workingTimeOfCast(itemData) }}</span>
                </div>
                <CastCardPictureComponent :classCursorMouse="classCursorMouse" :itemData="itemData"
                                          :isThumbBg="isThumbBg"
                                          :isShowGradeName="isShowGradeName"
                                          :imgAvatarDefault="imgAvatarDefault"
                                          :useGradeNameInCardInfo="useGradeNameInCardInfo"
                                          :typePicture="typePicture" :preventClickDetail="preventClickDetail"
                                          :className="renderClassName" :typePage="type"/>

                <CastCardInfoComponent :classCursorMouse="classCursorMouse" :nameStatus="nameStatus" :typePage="type"
                                       :isThumbBg="isThumbBg"
                                       :isShowGradeName="isShowGradeName"
                                       :itemData="itemData" :useGradeNameInCardInfo="useGradeNameInCardInfo"
                                       :getInfoManagement="getInfoManagement" :typeAct="typeAct"/>
            </div>
            <div v-if="typeAction === 'add-cast-for-merge'">
                <template v-if="!checkChosenCast(itemData.id)">
                    <v-btn @click="clickActChosenCast(itemData)" class="btn-yellow mt-2">優先希望する</v-btn>
                </template>
                <template v-else>
                    <v-btn @click="clickCancelChosenCast(itemData)" class="btn-yellow mt-2">取り消す</v-btn>
                </template>
            </div>

            <div :class="['d-cast-card-selected', classCursorMouse]" v-if="typeAction === 'add-cast-for-merge'">
                <v-img :width="24" src="../../images/GR_icon_check.svg"></v-img>
                <p class="mt-1">選択しました</p>
            </div>

            <v-dialog v-model="isActiveDialog" :content-class="`d-dialog-show-fullscreen`"
                      max-width="440"
                      fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
                <!-- Detail User -->
                <UserProfilesComponent :actType="type" :actShort="typeAction"
                                       :typeAction="'SHOW_PROFILE_OTHER'"
                                       :name="'cast2user' + userInfo.id" :listUserOrCastData="listUserOrCastData"
                                       :userInfo="userInfo" @eventCloseProfile="funcCloseProfile"/>
            </v-dialog>
        </div>
    </div>
</template>

<script>
import CastCardInfoComponent from "./CastCardInfoComponent";
import CastCardPictureComponent from "./CastCardPictureComponent";
import UserProfilesComponent from "./../components/UserProfilesComponent";
import {mapState} from "vuex";
import processDataUserProfile from "../mixin/processDataUserProfile";


export default {
    mixins: [
        processDataUserProfile
    ],
    name: "CardUserComponent",
    components: {
        CastCardInfoComponent,
        CastCardPictureComponent,
        UserProfilesComponent
    },
    data() {
        return {
            isActiveDialog: false,
            userInfo: {},
            listUserOrCastData: [],
            forceUpdate: 0
        }
    },
    props: {
        itemData: Object,
        type: {
            type: String,
            defaultValue: "",
            required: true
        },
        imgAvatarDefault: {
            type: String,
            defaultValue: ""
        },
        typeShowPicture: {
            type: String,
            defaultValue: ""
        },
        preventClickDetail: {
            type: Boolean,
            defaultValue: false
        },
        nameStatus: {
            type: String,
            defaultValue: ""
        },
        action: {
            type: String,
            defaultValue: ""
        },
        name: {
            type: String, // Fixed
        },
        useGradeNameInCardInfo: {
            type: Boolean,
            defaultValue: false
        },
        getInfoManagement: {
            type: Array,
            required: false
        },
        typeAct: {
            type: String,
            required: false
        },
        addData: {
            type: Object,
            required: false
        },
        isThumbBg: {
            type: Boolean,
            required: false,
            default: false
        },
        isShowGradeName: {
            type: Boolean,
            required: false,
            default: true
        },
    },
    model: {
        event: ["emitDataClick", "emitDataClickProfile", "emitCloseDialogClick"]
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            step3: state => state.book.step3,
            listUserOrCastInfoShow: state => state.user.listUserOrCastInfoShow,
            isFetchDataFinish: state => state.user.isFetchDataFinish,
        }),
        renderClassNameWrapper: function () {
            return this.renderClassName + "-wrapper"
        },
        renderClassName: function () {
            if (!this.type) {
                return ""
            }
            switch (this.type) {
                case "all-users":
                    return "d-class-all-users"
                case "user-profile":
                    return "d-class-user-profile"
                case "list-cast-today":
                    return "d-class-list-cast-today"
                case "user-rank":
                    return "d-class-user-rank"
                case "user-satisfied":
                    return "d-class-user-satisfied"
                case "user-favorite":
                    return "d-class-user-favorite"
                case "list-cast-request-merge":
                    return "d-list-cast-request-merge"
                case "list-cast-today-booking":
                    return "d-list-cast-today-booking"
            }

            return ""
        },
        renderType: function () {
            if (!this.type) {
                return ""
            }
            return this.type
        },
        typePicture: function () {
            if (!this.typeShowPicture) {
                return ""
            }
            if (this.typeShowPicture === 'bgImgProfile') {
                return "bgImgProfile"
            }

            return ""
        },
        typeAction: function () {
            if (this.action) {
                switch (this.action) {
                    case "act-cast-for-request-merge":
                        return "add-cast-for-merge"
                }
            }

            return ""
        },
        classCursorMouse: function () {
            return !!this.preventClickDetail ? "d-context-menu" : "d-cursor-pointer"
        },
        isChosenCast: function () {

        },
    },
    methods: {
        clickActChosenCast: function (item) {
            this.$emit("emitDataClick", Object.assign({}, {data: item, action: "add"}))
        },
        clickCancelChosenCast: function (item) {
            this.$emit("emitDataClick", Object.assign({}, {data: item, action: "remove"}))
        },
        funcEmitData: function (payload) {
            this.$emit("emitDataClick", payload)
        },
        funcCloseProfile: function (payload) {
            this.$emit("emitCloseDialogClick", true)
            this.isActiveDialog = false
        },
        checkChosenCast: function (id) {
            return this.step3 && this.step3.userIds.findIndex(ele => `${ele.id}` === `${id}`) !== -1;
        },
        showDetailUserProfile: async function (itemData) {
            if (!!this.preventClickDetail) {
                return;
            }

            let data = await this.initFetchUserORCastAsync(itemData.id)
            // Validate user or cast
            if (!_.has(data, "user.id")) {
                return
            }

            this.userInfo = data.user;
            this.listUserOrCastData = data.suggestUserOrCast;

            // Init data for before use component UserProfilesComponent
            this.initProcessDataUserProfile({userOrCastId: itemData.id, fetchDataBeforeById: data.user, options: {role: {...data.dataRole}}})
            this.isActiveDialog = true;
        },
        workingTimeOfCast: function (item) {
            if (_.has(item, "working_time_of_cast.start_time") && _.has(item, "working_time_of_cast.end_time")) {
                let startTime = item.working_time_of_cast.start_time.split(":");
                // let endTime = item.working_time_of_cast.end_time.split(":");
                startTime.pop();
                // endTime.pop();

                return [startTime.join(":"), "~"].join("")
                // return [startTime.join(":"), "~", endTime.join(":")].join("")
            }

            return ""
        }
    },
    watch: {
        isActiveDialog: function (f, t) {
            // console.log("CardUserComponent::isActiveDialog", f, t)
        },
        isFetchDataFinish: function (f, t) {
        }
    },
    mounted() {
    }
}
</script>
