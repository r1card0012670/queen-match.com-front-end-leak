<template>
    <div v-if="!!isUser">
        <div id="d-card-header" :class="`header-request-book`">
            <v-col class="d-flex justify-content-between col-12 flex-grow p-0 align-items-center">
                <div class="d-flex d-inline-flex d-custom-header p-0">
                    <button @click="clickPrev(step)"
                            :class="[{'d-no-cursor-pointer': step === 1}]">
                        <v-img v-if="step !== 1" contain src="../../images/chevron-left.svg"/>
                    </button>
                    <v-col v-if="step === 1" class="col-12 p-0 font-weight-bold d-title-block-book">キャストを呼ぶ</v-col>
                </div>

                <div class="d-flex d-inline-flex">
                    <template v-if="step === 1">
                        <v-select :class="['d-select-filter-feed', 'option']" solo flat :append-icon="''" @change="changeLocal"
                                  item-text="name" :items="allowItemLocal" v-model="selectLocal"
                                  return-object>
                            <template v-slot:prepend-inner>
                                <IconSvgComponent :className="`margin-top-sub3`" :type="'map-marker'"/>
                            </template>
                        </v-select>
                    </template>
                    <template v-else> {{ stepByStep }}</template>
                </div>
            </v-col>
        </div>

        <v-card id="body-content-scroll" :class="`container body-request-book`">
            <BookMerge v-if="isUser && !checkHasShortCast" :className="'home'"/>

            <div class="card-body d-list-content d-list-content-scroll d-booking-list-content" v-show="step === 1">
                <div class="d-flex d-title-content">
                    <span class="label-text-left">今すぐ会えるキャスト </span>
                    <span class="d-flex action-more-user action-more-rank-user" role="button"
                          v-on:click="isShowListCastMeetNow = true">
                        すべて見る
                        <IconSvgComponent :className="'d-inline-block'" :type="'chevron-right'"/>
                    </span>
                </div>
                <div class="d-inline-flex box-1 p-0 d-box-new-card d-box-new-card-scroll">
                    <template v-if="checkDataCastMeetNow">
                        <CardUserComponent v-for="(item, index) in dataItems" :key="index" :itemData="item"
                                           @emitCloseDialogClick="handleCloseClick"
                                           :name="'bookshowcast'" :type="'list-cast-today-booking'"/>
                    </template>
                    <template v-else>
                        <v-progress-linear v-if="loadingBook" color="red lighten-2" buffer-value="0" stream/>
                    </template>
                </div>
            </div>
        </v-card>

        <ShowListCastMeetNow v-if="isShowListCastMeetNow" :isShowListCastMeetNow="isShowListCastMeetNow"
                                    :title-header="`今すぐ会えるキャスト`" :selectLocal="selectLocal"
                                    :funcCloseListCastMeetNowDialog="handleCloseShowListCastMeetNow"/>

        <BookMergeDialog :isShowDialog="checkHasShortCast" v-if="checkHasShortCast"/>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import constantMain from "../utils/constants";
import CardUserComponent from "./../common/CardUserComponent";
import IconSvgComponent from "./../common/IconSvgComponent";
import BookStep1 from "./../common/book/BookStep1";
import BookStep2 from "./../common/book/BookStep2";
import BookStep3 from "./../common/book/BookStep3";
import BookStep4 from "./../common/book/BookStep4";
import BookStep5 from "./../common/book/BookStep5";
import BookMerge from "./../common/book/BookMerge";
import BookMergeDialog from "./../common/book/BookMergeDialog";
import ShowListCastMeetNow from "./../common/book/ShowListCastMeetNow";
import UserProfilesComponent from "./../components/UserProfilesComponent";
import {TYPE_ROLE_USER} from "../utils/constant";
import processBookForUser from "../mixin/processBookForUser";

const localDecline = [null] // Id decline


export default {
    mixins: [
        processBookForUser
    ],
    props: {
        payload: {
            type: Object,
            defaultValue: {}
        },
    },
    data: function () {
        return {
            isShowListCastMeetNow: false,
            dialogShowAllUser: false,
            selectLocal: {}
        }
    },
    components: {
        CardUserComponent,
        IconSvgComponent,
        ShowListCastMeetNow,
        BookStep1,
        BookStep2,
        BookStep3,
        BookStep4,
        BookStep5,
        BookMerge,
        BookMergeDialog,
        UserProfilesComponent,
    },
    mounted() {
        this.selectLocal = this.allowItemLocal[0];
        this.$store.dispatch("getListCardByUserBeforeOrderDispatch", {user_id: this.user.id})

        if (this.step === 1) {
            this.$store.dispatch("resetCastForMergeDispatch")
        }

        this.$nextTick(() => {
            if (Object.keys(this.step1).length) {
                this.$store.dispatch("loadingBookDispatch", true);
                this.fetchCastMeetNow({
                    place_id: this.selectLocal.id,
                    cast_package: this.step1.castClass.value, // It's class cast
                    // schedule_join: this.step1.scheduleToJoin.date,
                    page: 1
                })
            }
        })
    },
    methods: {
        clickPrev: function (numStep) {
            let valStep = +numStep;
            if (valStep <= 1 || valStep > 5) {
                return;
            }
            this.$store.dispatch("stepDispatch", --numStep)
        },
        handleCloseShowListCastMeetNow: function (val) {
            this.isShowListCastMeetNow = val;
            this.fetchData({overwrite: true});
        },
        funcHandleShowNavBottom: function (step) {
            if (step && step === 1) {
                this.$store.dispatch('activeNavBottomDispatch', true);
                // Reset chosen cast
                this.$store.dispatch("resetCastForMergeDispatch");
                this.fetchData();
            } else {
                this.$store.dispatch('activeNavBottomDispatch', false);
            }
        },
        changeLocal() {
            this.fetchData({overwrite: true});
        },
        fetchData(payload) {
            this.$store.dispatch("loadingBookDispatch", true);
            this.fetchCastMeetNow({
                place_id: this.selectLocal.id,
                cast_package: this.step1.castClass.value, // It's class cast
                // schedule_join: this.step1.scheduleToJoin.date,
                page: 1,
                overwrite: _.has(payload, "overwrite") ? payload.overwrite : true
            })
        },
        handleCloseClick: function () {
            this.fetchData({overwrite: true});
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
            role: state => state.user.role,
            step1: state => state.book.step1,
            step: state => state.book.step,
            stepTotal: state => state.book.stepTotal,
            castShortcutForMerge: state => state.book.castShortcutForMerge,
        }),
        ...mapGetters({
            step: "step",
            stepTotal: "stepTotal",
        }),
        constant: function () {
            return Object.assign({}, constantMain)
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        isCast: function () {
            return this.role === TYPE_ROLE_USER.TYPE_CAST
        },
        stepByStep: function () {
            return `${this.step}/${this.stepTotal}`
        },
        dataItems: function () {
            return this.listCastMeetNow;
        },
        locationItems: function () {
            return this.constant.LOCATION_ITEMS;
        },
        allowItemLocal: function () {
            return (this.locationItems || []).filter(element => localDecline.indexOf(element.id) === -1)
        },
        checkHasShortCast: function () {
            if (_.has(this.castShortcutForMerge, "castId") && _.has(this.castShortcutForMerge, "isShow")) {
                return !!this.castShortcutForMerge.isShow
            }
            return false
        },
        checkDataCastMeetNow: function () {
            return !!this.listCastMeetNow.length
        }
    },
    watch: {
        step: function (after, before) {
            this.funcHandleShowNavBottom(after)
        }
    },
    destroyed() {
        this.$store.dispatch("stepDispatch", 1)
        this.$store.commit("listCastMeetNowMutation", [])
    }
}
</script>

<style lang="scss" scoped>
    .v-menu__content.theme--light.menuable__content__active {
        overflow-y: scroll;

        &::-webkit-scrollbar {
         display: none !important;
     }
    }
</style>
