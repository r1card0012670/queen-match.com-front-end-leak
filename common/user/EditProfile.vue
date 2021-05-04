<template>
    <div :class="`app-content-box`" v-if="userId" :id="userId">
        <v-col justify="center" :id="`d-edit-profile-wrapper`" class="p-0">

            <v-card-text class="d-flex justify-content-between v-setting-item" data-action="actUserName"
                         @click="funcEventDataFiledDialog(`actUserName`)">
                <v-sheet class="d-inline-flex card-body p-0" role="button">
                    <v-list-item-content>
                        <v-list-item-title v-html="'ニックネーム'"></v-list-item-title>

                        <v-list-item-subtitle class="mt-2 is-data">
                            <span>{{ getCurrentUserInfo.nickname }}</span>
                        </v-list-item-subtitle>

                    </v-list-item-content>
                </v-sheet>
                <v-icon class="d-inline-flex p-0" role="button">keyboard_arrow_right</v-icon>
            </v-card-text>

            <v-card-text class="d-flex justify-content-between v-setting-item" data-action="actRow"
                         @click="funcEventDataFiledDialog(`actRow`)">
                <v-sheet class="d-inline-flex card-body p-0" role="button">
                    <v-list-item-content>
                        <v-list-item-title v-html="'今日のひとこと'"></v-list-item-title>

                        <v-list-item-subtitle :class="[`mt-2`, {'is-data': getCurrentUserInfo.word_of_the_day}]">
                            <span v-if="getCurrentUserInfo.word_of_the_day">{{
                                    getCurrentUserInfo.word_of_the_day
                                }}</span>
                            <span v-else>{{ actRow }}</span>
                        </v-list-item-subtitle>

                    </v-list-item-content>
                </v-sheet>
                <v-icon class="d-inline-flex p-0" role="button">keyboard_arrow_right</v-icon>
            </v-card-text>

            <v-card-text class="d-flex justify-content-between v-setting-item" @click="clickChosenHashtag">
                <v-sheet class="d-inline-flex card-body p-0" role="button">
                    <v-list-item-content>
                        <v-list-item-title v-html="'簡潔なプロフィール'"></v-list-item-title>

                        <v-list-item-subtitle
                            :class="[`mt-2`, {'is-data': getCurrentUserInfo.tags && getCurrentUserInfo.tags.length > 0}]">
                            <span>{{ txtHashTagDialog }}</span>
                        </v-list-item-subtitle>

                    </v-list-item-content>
                </v-sheet>
                <v-icon text plain class="d-inline-flex p-0" role="button">keyboard_arrow_right</v-icon>
            </v-card-text>

            <v-card-text class="d-flex justify-content-between v-setting-item actContentStatus"
                         data-action="actContentStatus"
                         @click="funcEventDataFiledDialog(`actContentStatus`)">
                <v-sheet class="d-inline-flex card-body p-0" role="button">
                    <v-list-item-content>
                        <v-list-item-title v-html="'自己紹介'"></v-list-item-title>

                        <v-list-item-subtitle :class="[`mt-2`, {'is-data': getCurrentUserInfo.self_introduction}]">
                            <span v-if="getCurrentUserInfo.self_introduction">{{
                                    getCurrentUserInfo.self_introduction
                                }}</span>
                            <span v-else>{{ actContentStatus }}</span>
                        </v-list-item-subtitle>

                    </v-list-item-content>
                </v-sheet>
                <v-icon class="d-inline-flex p-0" role="button">keyboard_arrow_right</v-icon>
            </v-card-text>

            <div class="col-12 p-0" v-if="!!isCast">
                <v-divider :class="`mt-0 mb-0 width-20`"/>
            </div>

            <v-card-text class="d-edit-plan-of-cast-wrap p-0 pt-4 pb-4" role="button" v-if="!!isCast">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="v-sheet font-weight-bold d-line-title"> スケジュール</div>
                    <div role="button" class="btn-show-plan">
                        <v-btn plain @click="showPlanForCast">活動予定カレンダー</v-btn>
                    </div>
                </div>

                <CalendarWeekly :userId="`userId`" :dateWorkingTime="dateWorkingTime"/>
            </v-card-text>


            <div class="col-12 v-setting-title-block">
                <span class="font-weight-bold">詳細プロフィール</span>
            </div>

            <v-col class="col-12 v-profile-detail-item" role="button" @click="isShowDialogHeight = true">
                <div class="d-flex justify-space-between">
                    <div class="v-sheet font-weight-bold">身長</div>

                    <div class="d-inline-flex is-data">
                        <div class="d-right-label ml-0" role="button">
                            <span>{{ heightShow }}</span>
                            <v-icon right color="pl-1">chevron_right</v-icon>
                        </div>
                    </div>
                </div>
            </v-col>

            <v-col class="col-12 v-profile-detail-item" role="button" @click="isShowDialogLocateCast = true">
                <div class="d-flex justify-space-between">
                    <div class="v-sheet font-weight-bold">居住地</div>

                    <div class="d-inline-flex is-data">
                        <div class="d-right-label ml-0" role="button">
                            <span>{{ txtLocation }}</span>
                            <v-icon right color="pl-1">chevron_right</v-icon>
                        </div>
                    </div>
                </div>
            </v-col>

            <v-col class="col-12 v-profile-detail-item" role="button" @click="isShowDialogBirthPlace = true">
                <div class="d-flex justify-space-between">
                    <div class="v-sheet font-weight-bold">出身地</div>

                    <div class="d-inline-flex is-data">
                        <div class="d-right-label ml-0" role="button">
                            <span>{{ birthPlaceShow }}</span>
                            <v-icon right color="pl-1">chevron_right</v-icon>
                        </div>
                    </div>
                </div>
            </v-col>

            <v-col class="col-12 v-profile-detail-item" role="button" @click="isShowDialogLiteracy = true">
                <div class="d-flex justify-space-between">
                    <div class="v-sheet font-weight-bold">学歴</div>

                    <div class="d-inline-flex is-data">
                        <div class="d-right-label ml-0" role="button">
                            <span>{{ literacyShow }}</span>
                            <v-icon right color="pl-1">chevron_right</v-icon>
                        </div>
                    </div>
                </div>
            </v-col>

            <v-col class="col-12 v-profile-detail-item" role="button" @click="isShowDialogIncome = true">
                <div class="d-flex justify-space-between">
                    <div class="v-sheet font-weight-bold">年収</div>

                    <div class="d-inline-flex is-data">
                        <div class="d-right-label ml-0" role="button">
                            <span>{{ incomeShow }}</span>
                            <v-icon right color="pl-1">chevron_right</v-icon>
                        </div>
                    </div>
                </div>
            </v-col>

            <v-col class="col-12 v-profile-detail-item" role="button" @click="isShowDialogJob = true">
                <div class="d-flex justify-space-between">
                    <div class="v-sheet font-weight-bold">お仕事</div>

                    <div class="d-inline-flex is-data">
                        <div class="d-right-label ml-0" role="button">
                            <span>{{ jobShow }}</span>
                            <v-icon right color="pl-1">chevron_right</v-icon>
                        </div>
                    </div>
                </div>
            </v-col>

            <v-col class="col-12 v-profile-detail-item" role="button" @click="isShowDialogSake = true">
                <div class="d-flex justify-space-between">
                    <div class="v-sheet font-weight-bold">お酒</div>

                    <div class="d-inline-flex is-data">
                        <div class="d-right-label ml-0" role="button">
                            <span>{{ sakeShow }}</span>
                            <v-icon right color="pl-1">chevron_right</v-icon>
                        </div>
                    </div>
                </div>
            </v-col>

            <v-col class="col-12 v-profile-detail-item" role="button" @click="isShowDialogTobacco = true">
                <div class="d-flex justify-space-between">
                    <div class="v-sheet font-weight-bold">タバコ</div>

                    <div class="d-inline-flex is-data">
                        <div class="d-right-label ml-0" role="button">
                            <span>{{ tobaccoShow }}</span>
                            <v-icon right color="pl-1">chevron_right</v-icon>
                        </div>
                    </div>
                </div>
            </v-col>

            <v-col class="col-12 v-profile-detail-item" role="button" @click="isShowDialogSiblings = true">
                <div class="d-flex justify-space-between">
                    <div class="v-sheet font-weight-bold">兄弟姉妹</div>

                    <div class="d-inline-flex is-data">
                        <div class="d-right-label ml-0" role="button">
                            <span>{{ siblingsShow }}</span>
                            <v-icon right color="pl-1">chevron_right</v-icon>
                        </div>
                    </div>
                </div>
            </v-col>

            <v-col class="col-12 v-profile-detail-item" role="button" @click="isShowDialogCohabitant = true">
                <div class="d-flex justify-space-between">
                    <div class="v-sheet font-weight-bold">同居人</div>

                    <div class="d-inline-flex is-data">
                        <div class="d-right-label ml-0" role="button">
                            <span>{{ cohabitantShow }}</span>
                            <v-icon right color="pl-1">chevron_right</v-icon>
                        </div>
                    </div>
                </div>
            </v-col>

            <!--<v-col class="col-12 v-profile-detail-item" role="button" data-action="actEducational"
                   @click="funcEventDataFiledDialog('actEducational')">
                <div class="d-flex justify-space-between">
                    <div class="v-sheet font-weight-bold">出身地</div>

                    <div class="d-inline-flex">
                        <div class="d-right-label ml-0" role="button">
                            <span>{{ txtEducational }}</span>
                            <v-icon right color="pl-1">chevron_right</v-icon>
                        </div>
                    </div>
                </div>
            </v-col>-->

            <p hidden style="display: none">{{ modifyDataMaster }}</p>

        </v-col>

        <v-bottom-sheet v-model="isShowChosenHashtag" persistent :content-class="`d-dialog-show-not-fullscreen`"
                        max-width="440">
            <Hashtag v-if="isShowChosenHashtag" v-model="getCurrentUserInfo.tags" :btnTitle="'タグ選択'"
                     @changeHashtag="eventChangeHashtag" :stringIconCallback="'close'" :typeTag="getTypeTag"
                     :groupTags="groupTagDetail"
                     :funcCallbackEventData="callbackEventDataHashtag"/>
        </v-bottom-sheet>

        <ResidenceDialog v-model="vModelDataLocateCast" v-if="isShowDialogLocateCast" :btnTitle="'居住地'"
                         :isShowDialog="isShowDialogLocateCast" :locationItems="locationItems"
                         :funcCallbackEventData="funcLocateCastCallback"/>

        <HeightDialog v-model="vModelDataHeight" v-if="isShowDialogHeight" :btnTitle="'身長'"
                      :isShowDialog="isShowDialogHeight" :heightItems="heightItems"
                      :funcCallbackEventData="funcHeightCallback"/>

        <BirthPlaceDialog v-model="vModelDataBirthPlace" v-if="isShowDialogBirthPlace" :btnTitle="'出身地'"
                          :isShowDialog="isShowDialogBirthPlace" :birthPlaceItems="birthPlaceItems"
                          :funcCallbackEventData="funcBirthPlaceCallback"/>

        <LiteracyDialog v-model="vModelDataLiteracy" v-if="isShowDialogLiteracy" :btnTitle="'学歴'"
                        :isShowDialog="isShowDialogLiteracy" :literacyItems="literacyItems"
                        :funcCallbackEventData="funcLiteracyCallback"/>
        <IncomeDialog v-model="vModelDataIncome" v-if="isShowDialogIncome" :btnTitle="'年収'"
                      :isShowDialog="isShowDialogIncome" :incomeItems="incomeItems"
                      :funcCallbackEventData="funcIncomeCallback"/>

        <JobDialog v-model="vModelDataJob" v-if="isShowDialogJob" :btnTitle="'お仕事'"
                   :isShowDialog="isShowDialogJob" :jobItems="jobItems"
                   :funcCallbackEventData="funcJobCallback"/>

        <SakeDialog v-model="vModelDataSake" v-if="isShowDialogSake" :btnTitle="'お酒'"
                    :isShowDialog="isShowDialogSake" :sakeItems="sakeItems"
                    :funcCallbackEventData="funcSakeCallback"/>

        <TobaccoDialog v-model="vModelDataTobacco" v-if="isShowDialogTobacco" :btnTitle="'タバコ'"
                       :isShowDialog="isShowDialogTobacco" :tobaccoItems="tobaccoItems"
                       :funcCallbackEventData="funcTobaccoCallback"/>

        <SiblingsDialog v-model="vModelDataSiblings" v-if="isShowDialogSiblings" :btnTitle="'兄弟姉妹'"
                        :isShowDialog="isShowDialogSiblings" :siblingsItems="siblingsItems"
                        :funcCallbackEventData="funcSiblingsCallback"/>

        <CohabitantDialog v-model="vModelDataCohabitant" v-if="isShowDialogCohabitant" :btnTitle="'同居人'"
                          :isShowDialog="isShowDialogCohabitant" :cohabitantItems="cohabitantItems"
                          :funcCallbackEventData="funcCohabitantCallback"/>

        <UserFormEditByFiledDialog v-model="vModelDataLocateCast" v-if="isShowFormEditByFiled" :btnTitle="btnTitleForm"
                                   :isShowDialog="isShowFormEditByFiled" :typeInputClick="typeInputClick"
                                   :funcCallbackEventData="funcDataByFiled" @change="eventDataFiled"
                                   :getCurrentUserInfo="getCurrentUserInfo"/>

        <SetupPlanForCastDialog v-if="!!isCast && !!isShowPlanForCast && resultCallListWorkingTime"
                                :isShowDialog="!!isCast && !!isShowPlanForCast"
                                :funcCallbackEventData="handleEventDataEditPlan"
                                @resetListWorkingTime="resetListWorkingTime"/>
    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import C from '../../utils/constants'
import Hashtag from '../../common/hashtag/Hashtag'
import UserFormEditByFiledDialog from '../../common/user/UserFormEditByFiledDialog'
import {TYPE_ROLE_USER} from "../../utils/constant";
import CalendarWeekly from "../../common/user/CalendarWeekly";
import SetupPlanForCastDialog from "../../common/cast/SetupPlanForCastDialog";
import HeightDialog from "../../common/cast/HeightDialog";
import BirthPlaceDialog from "../../common/cast/BirthPlaceDialog";
import LiteracyDialog from "../../common/cast/LiteracyDialog";
import IncomeDialog from "../../common/cast/IncomeDialog";
import JobDialog from "../../common/cast/JobDialog";
import SakeDialog from "../../common/cast/SakeDialog";
import TobaccoDialog from "../../common/cast/TobaccoDialog";
import SiblingsDialog from "../../common/cast/SiblingsDialog";
import CohabitantDialog from "../../common/cast/CohabitantDialog";
import appUtility from "../../utils/app-utility";
import ResidenceDialog from "../../common/cast/ResidenceDialog";


export default {
    props: {
        userId: {
            type: String,
            required: true
        },
        dateWorkingTime: {
            type: Array,
            required: true
        },
        getCurrentUserInfo: {
            type: Object,
            required: true
        },
        getInfoManagement: {
            type: Array,
            required: false
        }
    },
    data: function () {
        return {
            isShowChosenHashtag: false,
            showHashTagDialog: [],
            vModelDataLocateCast: {},
            locationItems: [],
            isShowPlanForCast: false,
            isShowDialogLocateCast: false,
            vModelDataHeight: {},
            isShowDialogHeight: false,
            heightItems: [],
            vModelDataBirthPlace: {},
            isShowDialogBirthPlace: false,
            birthPlaceItems: [],
            vModelDataLiteracy: {},
            isShowDialogLiteracy: false,
            literacyItems: [],
            vModelDataIncome: {},
            isShowDialogIncome: false,
            incomeItems: [],
            vModelDataJob: {},
            isShowDialogJob: false,
            jobItems: [],
            vModelDataSake: {},
            isShowDialogSake: false,
            sakeItems: [],
            vModelDataTobacco: {},
            isShowDialogTobacco: false,
            tobaccoItems: [],
            vModelDataSiblings: {},
            isShowDialogSiblings: false,
            siblingsItems: [],
            vModelDataCohabitant: {},
            isShowDialogCohabitant: false,
            cohabitantItems: [],
            isShowFormEditByFiled: false,
            vModelDataByFiled: {},
            typeInputClick: "",
            actRow: "今日のひとことをシェア ",
            actUserName: "Panda Kobe Osaka",
            actContentStatus: "自己紹介を入力",
            txtBirthplace: "選択する",
            txtEducational: "選択する",


            payload: {},
            currentUserID: "",
            objCurrentUser: {},
            objSlideShowImageUser: {},
            readMoreActivated: false,
            currentSlideShowImageUser: "",

            // dataItems: Array(Math.floor(Math.random() * 5)).fill(1).map((ele, index) => ({
            //     id: Math.random().toString(36).substring(7),
            //     value: ele
            // }))
            switch1: false,
            typeTag: '',
        }
    },
    components: {
        ResidenceDialog,
        CohabitantDialog,
        SiblingsDialog,
        TobaccoDialog,
        SakeDialog,
        JobDialog,
        IncomeDialog,
        LiteracyDialog,
        BirthPlaceDialog,
        HeightDialog,
        Hashtag,
        UserFormEditByFiledDialog,
        CalendarWeekly,
        SetupPlanForCastDialog
    },
    mounted() {
        this.getAllTagByGroup();
    },
    methods: {
        clickChosenHashtag: function () {
            this.isShowChosenHashtag = true
        },
        callbackEventDataHashtag: function () {
            this.isShowChosenHashtag = false
        },
        eventChangeHashtag: function (data) {
            this.showHashTagDialog = data
        },
        funcLocateCastCallback: function (data) {
            this.isShowDialogLocateCast = false;
        },
        funcHeightCallback: function (data) {
            this.isShowDialogHeight = false;
        },
        funcBirthPlaceCallback: function (data) {
            this.isShowDialogBirthPlace = false;
        },
        funcLiteracyCallback: function (data) {
            this.isShowDialogLiteracy = false;
        },
        funcIncomeCallback: function (data) {
            this.isShowDialogIncome = false;
        },
        funcJobCallback: function (data) {
            this.isShowDialogJob = false;
        },
        funcSakeCallback: function (data) {
            this.isShowDialogSake = false;
        },
        funcTobaccoCallback: function (data) {
            this.isShowDialogTobacco = false;
        },
        funcSiblingsCallback: function (data) {
            this.isShowDialogSiblings = false;
        },
        funcCohabitantCallback: function (data) {
            this.isShowDialogCohabitant = false;
        },
        funcDataByFiled: function (data) {
            this.isShowFormEditByFiled = false;
        },
        eventDataFiled: function (data) {
            this.vModelDataByFiled[this.typeInputClick] = data[this.typeInputClick]
        },
        funcEventDataFiledDialog: function (keyAction) {
            this.typeInputClick = keyAction;
            this.isShowFormEditByFiled = true;
        },
        convertDataByFiles: function (data) {
            [...document.querySelectorAll("[data-action]")].forEach(ele => {
                let key = ele.getAttribute("data-action");
                if (_.has(data, key)) {
                    this[key] = data[this.typeInputClick]
                }
            })
        },
        handleEventDataEditPlan: function (data) {
            // TODO

            // Set close dialog
            this.isShowPlanForCast = false
        },
        getAllTagByGroup: function () {
            const params = {
                type: this.isUser ? 2 : 1,
            }
            this.$store.dispatch('showListGroupTag', params);
        },
        showPlanForCast: function () {
            this.isShowPlanForCast = true
            let start_date = appUtility.dateFormat(new Date(), "YYYY-MM-DD");
            let end_date = appUtility.dateFormat(appUtility.dateAdd(start_date, 14, 'day'), "YYYY-MM-DD");
            let data = {
                start_date: start_date,
                end_date: end_date,
                cast_id: this.userId,
                input: 'working_times.date'
            }
            this.$store.dispatch('getListWorkingTimeDispatch', data)
        },
        resetListWorkingTime: function () {
            this.isShowPlanForCast = false
            this.$store.dispatch('getCurrentUserInfoDispatch', {user_id: this.user.id});
        },
    },
    watch: {
        vModelDataByFiled: {
            deep: true,
            handler(to, from) {
                this.convertDataByFiles(to)
            }
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            role: state => state.user.role,
            user: state => state.user.user,
            groupTagDetail: state => state.tag.groupTagDetail,
            resultCallListWorkingTime: state => state.cast.resultCallListWorkingTime,
        }),
        ...mapGetters({}),
        getTypeTag: function () {
            if (this.isUser) {
                this.typeTag = 'user-edit-profile';
            } else if (this.isCast) {
                this.typeTag = 'cast-edit-profile';
            }
            return this.typeTag;
        },
        modifyDataMaster: function () {
            if (this.getInfoManagement.length > 0) {
                let residence = [];
                let height = [];
                let birthPlace = [];
                let literacy = [];
                let annualIncome = [];
                let job = [];
                let sake = [];
                let tobacco = [];
                let siblings = [];
                let cohabitant = [];
                this.getInfoManagement.forEach(
                    item => {
                        switch (item.key) {
                            case 'height':
                                height.push(item);
                                break;
                            case 'residence':
                                residence.push(item);
                                break;
                            case 'birth_place':
                                birthPlace.push(item);
                                break;
                            case 'literacy':
                                literacy.push(item);
                                break;
                            case 'annual_income':
                                annualIncome.push(item);
                                break;
                            case 'job':
                                job.push(item);
                                break;
                            case 'sake':
                                sake.push(item);
                                break;
                            case 'tobacco':
                                tobacco.push(item);
                                break;
                            case 'siblings':
                                siblings.push(item);
                                break;
                            case 'cohabitant':
                                cohabitant.push(item);
                                break;
                        }
                    }
                );
                this.heightItems = height;
                this.locationItems = residence;
                this.birthPlaceItems = birthPlace;
                this.literacyItems = literacy;
                this.incomeItems = annualIncome;
                this.jobItems = job;
                this.sakeItems = sake;
                this.tobaccoItems = tobacco;
                this.siblingsItems = siblings;
                this.cohabitantItems = cohabitant;
            }
        },
        constant: function () {
            return Object.assign({}, C)
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        isCast: function () {
            return this.role === TYPE_ROLE_USER.TYPE_CAST
        },
        isMyPage: function () {
            // Check
            return this.userId === "userId";
        },
        btnTitleForm: function () {
            return "ニックネーム"
        },
        txtHashTagDialog: function () {
            let tagList = '';
            if (_.has(this.getCurrentUserInfo, "tags")) {
                this.getCurrentUserInfo.tags.forEach(item => {
                    if (tagList === '') {
                        tagList = item.tag_name;
                    } else {
                        tagList = tagList + ', ' + item.tag_name;
                    }
                })
            }
            return tagList === '' ? "簡潔なプロフィールを入力" : tagList;
        },
        txtLocation: function () {
            if (this.locationItems && _.has(this.getCurrentUserInfo, "residence")) {
                let locateName = '';
                this.locationItems.forEach(item => {
                    if (item.id === this.getCurrentUserInfo.residence) {
                        locateName = item.value;
                        this.vModelDataLocateCast = item
                    }
                });
                return locateName;
            } else {
                return "選択する"
            }
        },
        heightShow: function () {
            if (this.heightItems && _.has(this.getCurrentUserInfo, "height")) {
                let height = '';
                this.heightItems.forEach(item => {
                    if (item.id === this.getCurrentUserInfo.height) {
                        height = item.value;
                        this.vModelDataHeight = item
                    }
                });
                return height;
            } else {
                return "選択する"
            }
        },
        birthPlaceShow: function () {
            if (this.birthPlaceItems && _.has(this.getCurrentUserInfo, "birth_place")) {
                let birthPlace = '';
                this.birthPlaceItems.forEach(item => {
                    if (item.id === this.getCurrentUserInfo.birth_place) {
                        birthPlace = item.value;
                        this.vModelDataBirthPlace = item
                    }
                });
                return birthPlace;
            } else {
                return "選択する"
            }
        },
        literacyShow: function () {
            if (this.literacyItems && _.has(this.getCurrentUserInfo, "literacy")) {
                let literacy = '';
                this.literacyItems.forEach(item => {
                    if (item.id === this.getCurrentUserInfo.literacy) {
                        literacy = item.value;
                        this.vModelDataLiteracy = item
                    }
                });
                return literacy;
            } else {
                return "選択する"
            }
        },
        incomeShow: function () {
            if (this.incomeItems && _.has(this.getCurrentUserInfo, "annual_income")) {
                let income = '';
                this.incomeItems.forEach(item => {
                    if (item.id === this.getCurrentUserInfo.annual_income) {
                        income = item.value;
                        this.vModelDataIncome = item
                    }
                });
                return income;
            } else {
                return "選択する"
            }
        },
        jobShow: function () {
            if (this.jobItems && _.has(this.getCurrentUserInfo, "job")) {
                let job = '';
                this.jobItems.forEach(item => {
                    if (item.id === this.getCurrentUserInfo.job) {
                        job = item.value;
                        this.vModelDataJob = item
                    }
                });
                return job;
            } else {
                return "選択する"
            }
        },
        sakeShow: function () {
            if (this.sakeItems && _.has(this.getCurrentUserInfo, "sake")) {
                let sake = '';
                this.sakeItems.forEach(item => {
                    if (item.id === this.getCurrentUserInfo.sake) {
                        sake = item.value;
                        this.vModelDataSake = item
                    }
                });
                return sake;
            } else {
                return "選択する"
            }
        },
        tobaccoShow: function () {
            if (this.tobaccoItems && _.has(this.getCurrentUserInfo, "tobacco")) {
                let tobacco = '';
                this.tobaccoItems.forEach(item => {
                    if (item.id === this.getCurrentUserInfo.tobacco) {
                        tobacco = item.value;
                        this.vModelDataTobacco = item
                    }
                });
                return tobacco;
            } else {
                return "選択する"
            }
        },
        siblingsShow: function () {
            if (this.siblingsItems && _.has(this.getCurrentUserInfo, "siblings")) {
                let siblings = '';
                this.siblingsItems.forEach(item => {
                    if (item.id === this.getCurrentUserInfo.siblings) {
                        siblings = item.value;
                        this.vModelDataSiblings = item
                    }
                });
                return siblings;
            } else {
                return "選択する"
            }
        },
        cohabitantShow: function () {
            if (this.cohabitantItems && _.has(this.getCurrentUserInfo, "cohabitant")) {
                let cohabitant = '';
                this.cohabitantItems.forEach(item => {
                    if (item.id === this.getCurrentUserInfo.cohabitant) {
                        cohabitant = item.value;
                        this.vModelDataCohabitant = item
                    }
                });
                return cohabitant;
            } else {
                return "選択する"
            }
        },

    },
    created() {
        let self = this;
    },
    updated() {
        let elementWorking = document.querySelectorAll(".d-line-no-plan");
        [...elementWorking].forEach(ele => {
            let elementParent = ele.closest("div.v-calendar-weekly__day");
            if (!!elementParent) {
                elementParent.classList.add("d-has-working")
            }
        });

        let listTextWorking = document.querySelectorAll(".d-has-working");
        [...listTextWorking].forEach(ele => {
            let class_list = ele.lastChild.className
            let check = class_list.includes('d-line-no-plan')
            if (!check) {
                ele.classList.remove('d-has-working')
            }
        });
    },
}
</script>
<style lang="scss" scoped>
    @media (max-width: 376px) {
        .v-setting-item {
            .v-list-item__subtitle {
                max-width: 310px !important;
            }
        }
    }
    @media (min-width: 410px) {
        .v-setting-item {
            .v-list-item__subtitle {
                max-width: 340px !important;
            }
        }
    }
</style>
