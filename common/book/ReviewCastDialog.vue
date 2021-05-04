<template>
    <div :class="[`d-dialog-review-book p-0`]">
        <v-bottom-sheet v-if="isShowDialog" v-model="showActionDialog" scrollable @click:outside="clickCloseData"
                        :loading="!hasData"
                        @keydown.esc="clickCloseData" :content-class="`d-dialog-show-not-fullscreen`" max-width="440">

            <v-card :id="`dialog-action-review-book`"
                    :class="[`d-action-review-book`, 'd-border-radius-top-15']">
                <v-card-title :id="'d-card-title-review-book'"
                              :class="[`headline d-header-box-action-review-book p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-start d-custom-header p-2 d-width-100">
                        <button class="d-flex pl-2 pr-3" v-on:click="clickCloseData">
                            <v-img src="../../images/times.svg"></v-img>
                        </button>
                        <v-card-title :class="`p-0`">キャストのレビュー</v-card-title>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-review-book'" class="p-2">
                    <template v-if="hasData">
                        <v-col class="p-0">
                            <v-list-item class="p-0">
                                <v-list-item-avatar :size="56" class="align-self-start">
                                    <v-img :src="userInfoAvatar"></v-img>
                                </v-list-item-avatar>
                                <v-list-item-content class="pt-0">
                                    <v-list-item-title class="pl-0">
                                        <div class="pr-2 chip label-chip lighten-4">{{ userInfoHashtag }}</div>
                                    </v-list-item-title>

                                    <v-list-item-subtitle :class="['']">
                                        <v-list-item-title class="">
                                            {{ userInfo.nickname }}
                                        </v-list-item-title>
                                        <div class="p-0">
                                            <v-icon class="p-0 pr-1" color="yellow darken-3">star</v-icon>
                                            <span>{{ rating }} ({{ totalRate }})</span>
                                        </div>
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>

                        <v-divider/>
                        <div class="text-center p-0 pt-5 pb-5">
                            <div class="">また会いたいですか？</div>
                            <v-rating v-model="vModelRating" color="yellow darken-3" background-color="grey darken-1"
                                      half-increments :length="maxRate" empty-icon="star" hover full-icon="star_rate"
                                      half-icon="star_half" size="30"></v-rating>
                        </div>

                        <v-divider/>
                        <div class="p-1">
                            <div class="d-flex justify-content-between">
                                <div>レビュー</div>
                                <div>{{ vModelReviewComment.length }}/{{ maxLengthComment }}</div>
                            </div>

                            <v-textarea v-model="vModelReviewComment" outlined name="input-7-4"
                                        :rules="[rules.max]"
                                        :value="value"></v-textarea>
                        </div>

                        <div class="d-flex justify-content-between">
                            <v-col cols-6>
                                <v-btn block outlined class="col-6" @click="clickCloseData"> スキップ</v-btn>
                            </v-col>
                            <v-col cols-6 class="pr-2">
                                <v-btn block outlined class="btn-base-bg color--white col-6"
                                       @click="submitReviewByUser">
                                    次へ
                                </v-btn>
                            </v-col>
                        </div>
                    </template>
                    <template v-else>
                        <div class="d-flex justify-content-center align-items-center" style="height: 100%">
                            <v-progress-circular :size="50" color="primary" indeterminate/>
                        </div>
                    </template>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>

import C from "../../utils/constants";
import {mapState} from "vuex";
import {TYPE_ROLE_USER} from "../../utils/constant";

export default {
    data: function () {
        return {
            vModelReviewComment: "",
            vModelRating: 0,
            maxLengthComment: 1000,
            maxRate: 5,
            rules: {
                max: v => !(v && v.length > this.maxLengthComment) || `${this.maxLengthComment}文字以下で入力してください`,
            },
        }
    },
    model: {
        event: 'changeLocal'
    },
    props: {
        classList: {
            type: String,
            default: ""
        },
        isShowDialog: {
            type: Boolean,
            required: true
        },
        funcCloseEventData: {
            type: Function,
            required: true
        },
        userId: {
            // cast_id
            type: String,
            required: true
        },
        value: {
            type: String,
            required: false
        },
    },
    components: {},
    mounted: function () {
        this.vModelRating = this.maxRate;
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            role: state => state.user.role,
            user: state => state.user.user,
            loadingBook: state => state.book.loadingBook,
            detailReviewOfCast: state => state.book.detailReviewOfCast,
            throwFetchData: state => state.book.throwFetchData,
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showActionDialog: function () {
            return !!this.isShowDialog;
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        rating: function () {
            return !_.isNumber(this.userInfo.star_avg) ? 0 : +this.userInfo.star_avg.toFixed(2);
        },
        totalRate: function () {
            return !_.isNumber(this.userInfo.reviews_cast_count) ? 0 : +this.userInfo.reviews_cast_count;
        },
        sessionUser: function () {
            return this.user
        },
        userInfo: function () {
            return this.detailReviewOfCast
        },
        hasData: function () {
            return !!Object.keys(this.detailReviewOfCast).length
        },
        userInfoAvatar: function () {
            let filter = this.userInfo.user_images.filter(ele => !!ele.set_as_avatar);
            let img = ""
            if (filter.length) {
                img = filter[0].image;
            } else {
                if (this.userInfo.user_images.length) {
                    img = this.userInfo.user_images[0].image;
                } else {
                    img = this.constant.AVATAR_DEFAULT
                }
            }

            return img;
        },
        userInfoHashtag: function () {
            let findIndex = this.constant.CAST_TYPE.findIndex(ele => `${ele.id}` === `${this.userInfo.cast_type}`);
            return findIndex !== -1 ? this.constant.CAST_TYPE[findIndex].name : ""
        },
        validate: function () {
            return this.vModelRating >= 0 || this.vModelReviewComment.length > 0
        }
    },
    methods: {
        clickCloseData: function () {
            this.funcCloseEventData();
        },
        submitReviewByUser: function (event) {
            event.preventDefault();
            if (this.vModelReviewComment.length > this.maxLengthComment || !this.sessionUser.id || !this.userId) {
                return;
            }

            this.$store.commit("loadingBookMutation", true);
            this.$store.dispatch("submitReviewOfCastDispatch", {
                data: {
                    user_review_id: +this.userId,
                    user_id: +this.sessionUser.id,
                    content: !_.isString(this.vModelReviewComment) ? "" : this.vModelReviewComment,
                    review_star: +this.vModelRating,
                }
            })
        },
    },
    created() {
        let self = this;
        if (self.userId) {
            self.$store.dispatch("fetchDetailReviewOfCastDispatch", {cast_id: self.userId})
        }
    },
    watch: {
        loadingBook: function (to, from) {
            if (!!to) {
                this.funcCloseEventData();
            }
        },
        throwFetchData: function (to, from) {
            let self = this;
            if (to === 'fetch_detail_review_cast') {
                self.$emit("fetch_detail_review_cast", {type: "fetch_detail_review_cast_throw"});
            }
        }
    },
    destroyed() {
        let self = this;
        self.vModelRating = self.maxRate
    }
}
</script>
