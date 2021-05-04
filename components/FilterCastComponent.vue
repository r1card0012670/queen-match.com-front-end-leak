<template>
    <div :class="`app-content-box`" v-if="showDialogFilterCast">
        <v-row justify="center" :id="`d-filter-cast-wrapper`">
            <v-dialog v-model="showDialogFilterCast" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                      fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>
                <v-card :class="`d-dialog-search-cast-for-guest`" :id="`dialog-search-cast-for-guest`">
                    <v-card-title :id="'d-card-title-filter-cast'"
                                  :class="[`headline d-header-box-filter-cast p-1 d-border-bottom box-shadow-no`]">
                        <div
                            class="d-flex align-items-center justify-content-between d-custom-header card-header-top not-full">
                            <button class="d-flex pl-0" @click="clickGoBack">
                                <v-img contain src="../../images/times.svg"/>
                            </button>
                            <div class="d-title">
                                絞り込み検索
                            </div>
                            <div class="info-bar pr-5 d-none">
                            </div>
                        </div>
                    </v-card-title>
                    <v-card-text :id="'d-card-text-filter-cast'" :class="`d-card-search`">
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-sheet class="mt-5">
                                <v-col class="d-flex p-0 justify-content-between">
                                    <div class="d-label font-weight-bold">居住地</div>
                                </v-col>
                                <v-sheet role="button" outlined @click="isShowDialogLocateCast = true"
                                         class="rounded mt-1 mb-3 d-custom-convert-btn-select-warp d-custom-align-text-btn">
                                    <v-btn class="d-btn-2-selcet" block left text large plain>
                                        {{ txtLocalCast }}
                                    </v-btn>
                                    <v-icon class="d-icon-position-right" right>keyboard_arrow_down</v-icon>
                                </v-sheet>
                            </v-sheet>

                            <v-sheet class="mt-3">
                                <v-col class="d-flex p-0 justify-content-between">
                                    <div class="d-label font-weight-bold">キャストクラス</div>
                                </v-col>
                                <v-sheet role="button" outlined @click="isShowDialogClassCast = true"
                                         class="rounded mt-1 mb-3 d-custom-convert-btn-select-warp d-custom-align-text-btn">
                                    <v-btn class="d-btn-2-selcet" block left text large plain>
                                        {{ txtClassCast }}
                                    </v-btn>
                                    <v-icon class="d-icon-position-right" right>keyboard_arrow_down</v-icon>
                                </v-sheet>
                            </v-sheet>

                            <v-sheet class="mt-7">
                                <v-col class="d-flex p-0 justify-content-between">
                                    <div class="d-label font-weight-bold"> タグ検索</div>
                                </v-col>
                                <v-sheet role="button" outlined @click="isShowHashTagDialog = true"
                                         class="rounded mt-1 mb-3 d-custom-convert-btn-select-warp d-custom-align-text-btn hashtag-selector">
                                    <v-btn class="d-btn-2-selcet" block left text large plain>
                                        {{ txtHashTagCast }}
                                    </v-btn>
                                    <v-icon class="d-icon-position-right" right>keyboard_arrow_down</v-icon>
                                </v-sheet>
                            </v-sheet>
                            <v-sheet class="mt-7">
                                <v-col class="d-flex p-0 justify-content-between">
                                    <div class="d-label font-weight-bold"> フリーワード</div>
                                    <div class="d-label font-weight-thin">*2文字以上10文字未満</div>
                                </v-col>
                                <v-sheet role="button" outlined
                                         class="rounded mt-1 mb-2 d-custom-align-text-btn">
                                    <input v-model="freeWord" type="text"
                                           class="v-btn--block v-btn--left v-btn--plain v-btn--text theme--light v-size--large text-input"
                                           placeholder="フリーワードを入力してください">
                                </v-sheet>
                                <span v-if="freeWordErrors" class="text-danger">{{ freeWordErrors }}</span>
                            </v-sheet>
                            <v-sheet class="mt-0">
                                <v-col class="p-0">
                                    <p>キャストのプロフィールをフリーワードで検索できます <br/>
                                        例：ゴルフ、海外旅行、お酒、学生など
                                    </p>
                                </v-col>
                            </v-sheet>
                            <v-sheet class="mt-7">
                                <v-col class="d-flex p-0 justify-content-between">
                                    <div class="d-label font-weight-bold">スケジュール ({{ currentMonth }})*</div>
                                </v-col>
                                <v-sheet class="d-box-calender-filter-wrap">
                                    <CalendarWeeklyForFilter v-model="vModelDataCalenderFilter"
                                                             :colorActive="'rgba(255, 0, 0, 0.5)'"
                                                             :currentDay="currentDay"/>
                                </v-sheet>
                            </v-sheet>
                            <v-sheet class="mt-10">
                                <v-col class="p-0">
                                    <p>30分あたりのポイント</p>
                                </v-col>
                            </v-sheet>
                            <v-sheet class="mt-7">
                                <v-col class="d-flex p-0 justify-content-between">
                                    <div class="d-label font-size-large font-weight-bold">{{ fakeRangeSlider }}</div>
                                </v-col>
                                <RangeSliderForFilter v-model="vModelDataRangeSliderFilter" :minRange="0"
                                                      :maxRange="15000"
                                                      :typeThumbTrack2Icon="'thumb-icon'"
                                                      :trackColorOrClass="'d-custom-track-by-class'"
                                                      :classThumbTrack="'d-icon-size-custom'"
                                                      :trackColor="'red'"/>
                                <v-sheet class="mt-14">
                                    <v-col class="d-flex p-0 justify-content-between d-select-content">
                                        <div class="d-label font-weight-bold">最近入会</div>
                                        <div class="d-label font-weight-bold">
                                            <v-switch class="m-0 p-0" v-model="switchRecentlyJoined"></v-switch>
                                        </div>
                                    </v-col>
                                </v-sheet>

                            </v-sheet>

                            <v-sheet class="mt-7">
                                <v-col class="d-flex p-0 justify-content-between">
                                    <div class="d-label font-weight-bold"> ニックネーム検索</div>
                                </v-col>
                                <v-sheet role="button" outlined class="rounded mt-1 mb-2 d-custom-align-text-btn">
                                    <input v-model="nickname" type="text"
                                           class="v-btn--block v-btn--left v-btn--plain v-btn--text theme--light v-size--large text-input"
                                           placeholder="ニックネームを入力してください">
                                </v-sheet>
                                <span v-if="nicknameErrors" class="text-danger">{{ nicknameErrors }}</span>
                            </v-sheet>
                            <v-col class="p-0 pt-2">
                                <p>キャストの名前を検索してみましょう</p>
                            </v-col>
                            <v-btn block large @click="funcProcessFilterCast" :class="`mt-11 btn-base`"
                                   :disabled="freeWordErrors || nicknameErrors">
                                この条件で検索する
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>

        <LocateCastDialog v-model="vModelDataLocateCast" v-if="isShowDialogLocateCast" :btnTitle="'居住地'"
                          :isShowDialog="isShowDialogLocateCast"
                          :funcCallbackEventData="funcLocateCastCallback"
                          :locationItems="locations"/>

        <ClassCastDialog v-model="vModelDataClassCastFilter" v-if="isShowDialogClassCast" :btnTitle="'キャストクラス'"
                         :isShowDialog="isShowDialogClassCast" :funcCallbackEventData="funcClassCastCallback"
                         @change="eventChangeClassHandler"/>

        <v-bottom-sheet v-if="isShowHashTagDialog" v-model="isShowHashTagDialog" persistent
                        :content-class="`d-dialog-show-not-fullscreen`" max-width="440">
            <Hashtag v-model="vModelDataHashtagFilter" :btnTitle="'タグ検索'" :typeTag="'dialog-search'"
                     :classBorderWidth="'d-header-border-width-1'"
                     :funcCallbackEventData="funcHashTagCallback" :stringIconCallback="'close'"
                     :groupTags="groupTags"/>
        </v-bottom-sheet>

        <FilterCastResults v-if="showDialogFilterCastResult"/>
    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import C from '../utils/constants'
import IconSvgComponent from "../common/IconSvgComponent";
import LocateCastDialog from "../common/cast/LocateCastDialog";
import ClassCastDialog from "../common/cast/ClassCastDialog";
import Hashtag from "../common/hashtag/Hashtag";
import CalendarWeeklyForFilter from "../common/cast/CalendarWeeklyForFilter";
import RangeSliderForFilter from "../common/cast/RangeSliderForFilter";
import FilterCastResults from "../common/cast/FilterCastResults";

export default {
    mixins: [],
    props: {},
    data: function () {
        return {
            isShowDialogLocateCast: false,
            isShowDialogClassCast: false,
            currentDay: new Date(),
            isShowHashTagDialog: false,
            switchRecentlyJoined: true,
            vModelDataLocateCast: null,
            vModelDataCalenderFilter: {},
            vModelDataClassCastFilter: [],
            vModelDataRangeSliderFilter: [],
            vModelDataHashtagFilter: [],

            // TODO
            valid: true,
            name: '',
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters',
            ],
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            select: null,
            checkbox: false,
            message: 'Hey!',
            loading: false,
            freeWord: '',
            nickname: '',
        }
    },
    components: {
        IconSvgComponent,
        LocateCastDialog,
        ClassCastDialog,
        Hashtag,
        CalendarWeeklyForFilter,
        RangeSliderForFilter,
        FilterCastResults
    },
    created() {
        if (!this.getInfoManagement.length) {
            this.$store.dispatch('getInfoManagementDispatch', {});
        }
    },
    methods: {
        clickGoBack: function (event) {
            this.$store.dispatch('showDialogFilterCastDispatch', {isShow: false, data: {}, reset: true});
        },
        validate() {
            this.$refs.form.validate()
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
        clickMe() {
            this.loading = true
            this.message = 'Wait for it...'
            setTimeout(() => {
                this.loading = false
                this.message = `You've clicked me!`
            }, 2000)
        },

        funcLocateCastCallback: function (data) {
            this.isShowDialogLocateCast = false;
        },
        funcClassCastCallback: function (data) {
            this.isShowDialogClassCast = false;
        },
        eventChangeClassHandler: function (data) {
            this.vModelDataClassCastFilter = data;
        },
        funcHashTagCallback: function (data) {
            this.isShowHashTagDialog = false;
        },
        funcProcessFilterCast: function () {
            const classes = this.vModelDataClassCastFilter.map(x => x.id);
            const hashTags = this.vModelDataHashtagFilter.map(x => x.id);
            const schedules = Object.values(this.vModelDataCalenderFilter).reduce((carry, item) => {
                if (item.isChosenDay) {
                    carry.push(item.dateKey);
                }

                return carry;
            }, []);
            const data = {
                place: this.vModelDataLocateCast ? this.vModelDataLocateCast.id : null,
                classes: classes,
                schedules: schedules,
                freeWord: this.freeWord,
                price: this.vModelDataRangeSliderFilter,
                recentlyJoined: this.switchRecentlyJoined ? 1 : 0,
                nickname: this.nickname,
                hashTags: hashTags,
            };

            this.$store.dispatch('showDialogFilterCastResultDispatch', {isShow: true, data: data});
        },
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            filterCast: state => state.cast.filterCast,
            showDialogFilterCast: state => state.cast.showDialogFilterCast,
            showFeedHashTagDialog: state => state.feed.showFeedHashTagDialog,
            getInfoManagement: state => state.info.getInfoManagement,
        }),
        ...mapGetters({
            showDialogFilterCast: "showDialogFilterCast",
            filterCast: "filterCast",
            showFeedHashTagDialog: "showFeedHashTagDialog",
            groupTags: 'groupTags',
            showDialogFilterCastResult: 'showDialogFilterCastResult',
        }),
        constant: function () {
            return Object.assign({}, C);
        },
        fakeRangeSlider: function () {
            return `${this.vModelDataRangeSliderFilter[0]}Ｐ-${this.vModelDataRangeSliderFilter[1]}Ｐ＋`;
        },
        txtLocalCast: function () {
            if (this.vModelDataLocateCast) {
                return this.vModelDataLocateCast.value;
            }

            return " 選択してください";
        },
        txtHashTagCast: function () {
            if (!this.vModelDataHashtagFilter.length) {
                return '選択してください'
            }

            return this.vModelDataHashtagFilter.map(e => e.tag_name).join(', ');
        },
        txtClassCast: function () {
            if (!this.vModelDataClassCastFilter.length) {
                return '選択してください'
            }

            return this.vModelDataClassCastFilter.map(e => e.name).join(', ');
        },
        currentMonth: function () {
            const currentDate = new Date();
            let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(currentDate);
            let month = new Intl.DateTimeFormat('en', {month: 'numeric'}).format(currentDate).padStart(2, '0');

            return `${year}年${month}月`;
        },
        freeWordErrors: function () {
            return this.freeWord.length > 0 && (this.freeWord.length < 2 || this.freeWord.length > 9) ? '2文字以上9文字以下で入力してください！' : null;
        },
        nicknameErrors: function () {
            return this.nickname.length > 0 && (this.nickname.length > 30) ? '30文字以下で入力してください！' : null;
        },
        locations: function () {
            return this.getInfoManagement.filter(x => x.key === 'residence');
        }
    },
}
</script>

<style lang="scss" scoped>
.hashtag-selector {
    .d-btn-2-select {
        width: 100%;
    }

    &::v-deep {
        .v-btn {
            &__content {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                display: block;
                width: 100%;
                flex: unset;
                text-align: initial;
                padding-right: 40px;
            }
        }
    }
}

#d-card-text-filter-cast {
    &::v-deep {
        .v-btn {
            text-transform: unset;
        }

        .v-slider--horizontal {
            margin-left: 28px;
            margin-right: 28px;
        }
    }
}

.text-input {
    height: 44px;
    padding: 0 12px;
    font-size: 16px;
}

.d-btn-2-selcet {
    max-width: 100%;
}
</style>
