<template>
    <div :class="`app-content-box`">
        <v-row justify="center" :id="`d-filter-cast-wrapper`">
            <v-dialog v-model="showDialogFilterUser" :content-class="`d-dialog-show-fullscreen`" max-width="440"
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
                        <v-form ref="form">
                            <v-sheet class="mt-5">
                                <v-col class="d-flex p-0 justify-content-between">
                                    <div class="d-label font-weight-bold">居住地</div>
                                </v-col>
                                <v-sheet role="button" outlined @click="showLocateUserDialog = true"
                                         class="rounded mt-1 mb-3 d-custom-convert-btn-select-warp d-custom-align-text-btn">
                                    <v-btn class="d-btn-2-selcet" block left text large plain>
                                        {{ locateUser.value || '選択してください' }}
                                    </v-btn>
                                    <v-icon class="d-icon-position-right" right>keyboard_arrow_down</v-icon>
                                </v-sheet>
                            </v-sheet>

                            <v-sheet class="mt-3">
                                <v-col class="d-flex p-0 justify-content-between">
                                    <div class="d-label font-weight-bold">ユーザークラス</div>
                                </v-col>
                                <v-sheet role="button" outlined @click="showClassUserDialog = true"
                                         class="rounded mt-1 mb-3 d-custom-convert-btn-select-warp d-custom-align-text-btn">
                                    <v-btn class="d-btn-2-selcet" block left text large plain>
                                        {{ userClass }}
                                    </v-btn>
                                    <v-icon class="d-icon-position-right" right>keyboard_arrow_down</v-icon>
                                </v-sheet>
                            </v-sheet>

                            <v-sheet class="mt-7">
                                <v-col class="d-flex p-0 justify-content-between">
                                    <div class="d-label font-weight-bold"> タグ検索</div>
                                </v-col>
                                <v-sheet role="button" outlined @click="showHashTagDialog = true"
                                         class="rounded mt-1 mb-2 d-custom-convert-btn-select-warp d-custom-align-text-btn hashtag-selector">
                                    <v-btn class="d-btn-2-selcet" block left text large plain>
                                        {{ userHashtag }}
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
                                    <p class="text-dark">ユーザーのプロフィールをフリーワードで検索できます <br/>
                                        例：ゴルフ、海外旅行、お酒、学生など
                                    </p>
                                </v-col>
                            </v-sheet>

                            <v-sheet class="mt-7">
                                <v-col class="d-flex p-0 justify-content-between d-select-content">
                                    <div class="d-label font-weight-bold">最近入会</div>
                                    <div class="d-label font-weight-bold">
                                        <v-switch class="m-0 p-0" v-model="recentlyJoined"></v-switch>
                                    </div>
                                </v-col>
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
                                <p class="text-dark">ユーザーの名前を検索してみましょう</p>
                            </v-col>
                            <v-btn block large @click="searchUser" :class="`mt-11 btn-base`"
                                   :disabled="freeWordErrors || nicknameErrors">
                                この条件で検索する
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>

        <locate-user-dialog v-if="showLocateUserDialog" :btn-title="'居住地'" :selected="locateUser"
                            @close-dialog="showLocateUserDialog = false" @change="locateUserChanged"/>

        <class-user-dialog v-if="showClassUserDialog" :btn-title="'キャストクラス'" :selected="classUser"
                           @close-dialog="showClassUserDialog = false"
                           @change="classUserChanged"/>

        <v-bottom-sheet v-if="showHashTagDialog" v-model="showHashTagDialog" persistent
                        :content-class="`d-dialog-show-not-fullscreen`" max-width="440">
            <hashtag v-model="hashTags" :btn-title="'タグ検索'" :type-tag="'dialog-search'"
                     :class-border-width="'d-header-border-width-1'"
                     :func-callback-event-data="funcHashTagCallback"
                     :group-tags="userGroupTags"/>
        </v-bottom-sheet>

        <filter-user-result v-if="showSearchResult" :free-word="freeWord" :hash-tags="hashTags" :nickname="nickname"
                            :locate-user="locateUser" :class-user="classUser" :recently-joined="recentlyJoined"
                            @tag-changed="changeTags" @close-dialog="closeSearchResult"/>
    </div>
</template>

<script>
import {mapGetters, mapState, mapActions} from 'vuex';
import C from '../utils/constants'
import IconSvgComponent from "../common/IconSvgComponent";
import LocateUserDialog from "../common/user/LocateUserDialog";
import ClassCastDialog from "../common/cast/ClassCastDialog";
import Hashtag from "../common/hashtag/Hashtag";
import FilterUserResult from "../common/user/FilterUserResult";
import ClassUserDialog from "../common/user/ClassUserDialog";

export default {
    mixins: [],
    props: {},
    data: function () {
        return {
            freeWord: '',
            nickname: '',
            showSearchResult: false,
            showLocateUserDialog: false,
            locateUser: {},
            showClassUserDialog: false,
            classUser: [],
            showHashTagDialog: false,
            hashTags: [],
            recentlyJoined: false,
        }
    },
    components: {
        ClassUserDialog,
        FilterUserResult,
        IconSvgComponent,
        LocateUserDialog,
        ClassCastDialog,
        Hashtag,
    },
    methods: {
        ...mapActions({
            getUserGroupTags: 'getUserGroupTags',
        }),
        clickGoBack: function (event) {
            this.$store.dispatch('showDialogFilterUser', false);
        },
        searchUser: function () {
            this.showSearchResult = true;
        },
        locateUserChanged: function (data) {
            this.showLocateUserDialog = false;
            this.locateUser = data;
        },
        classUserChanged: function (data) {
            this.showClassUserDialog = false;
            this.classUser = data;
        },
        funcHashTagCallback: function (data) {
            this.showHashTagDialog = false;
        },
        changeTags(data) {
            this.hashTags = data
        },
        closeSearchResult() {
            this.showSearchResult = false;
        }
    },
    computed: {
        ...mapState({
            getInfoManagement: state => state.info.getInfoManagement,
        }),
        ...mapGetters({
            userGroupTags: 'userGroupTags',
            showDialogFilterUser: 'showDialogFilterUser',
        }),
        constant: function () {
            return Object.assign({}, C);
        },
        userClass: function () {
            return this.classUser.map(item => item.name).join() || '選択してください';
        },
        userHashtag: function () {
            return this.hashTags.map(item => item.tag_name).join() || '選択してください';
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
    created() {
        if (!this.userGroupTags.length) {
            this.$store.dispatch('getUserGroupTags');
        }

        if (!this.getInfoManagement.length) {
            this.$store.dispatch('getInfoManagementDispatch', {});
        }
    }
}
</script>

<style lang="scss" scoped>
.hashtag-selector {
    &::v-deep {
        .d-btn-2-select {
            width: 100%;
            text-align: initial;
        }
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
