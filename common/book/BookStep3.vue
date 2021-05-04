<template>
    <v-card-text :class="[`d-time-plan-cast p-0 no-bg d-step-book d-step-book-3 pb-15`]">
        <div :class="[`${classNameBox}d-book-wrapper`]">
            <div :class="[`${classNameBox}d-book-body`, 'p-2']">
                <v-col class="col-12 p-0 font-weight-bold d-title-block-book">優先マッチング希望をしたいキャストはいますか？</v-col>
                <v-col class="col-12 p-0 mt-3">
                    <div class="p-0 flex-wrap">
                        <p class="mb-2">ご要望に近いキャストをマッチングします。 </p>
                        <p class="mb-2">好みのタグをお選びください。 </p>
                    </div>
                </v-col>

                <div class="col-12 p-0 m-0 d-list-content pt-3">
                    <div class="d-flex d-title-content">
                        <span class="label-text-left"> 今日会えるキャストから選ぶ</span>
                    </div>
                    <template v-if="checkHasData">
                        <div class="d-inline-flex box-1 p-0 d-box-new-card pt-3" id="list-item-cast-meeting-now">
                            <CardUserComponent v-for="(item1, index) in dataItemsMap" :key="index" :itemData="item1"
                                               :name="'bookstep3'"
                                               @emitDataClick="funcHandleAddCastForMerge"
                                               :action="'act-cast-for-request-merge'"
                                               :type="'list-cast-today-booking'"
                                               :preventClickDetail="funcCheckPreventClickProfile(item1.id)"/>

                            <div ref="infiniteScrollTrigger" id="scoll-trigger"></div>
                        </div>
                    </template>
                </div>
            </div>
            <div v-if="showBtnStep3" :class="[`${classNameBox}d-book-footer`]">
                <v-btn outlined @click="clickStepTo4" class="btn-base"> 次に進む</v-btn>
            </div>

            <loading :active.sync="loadingBook"></loading>
        </div>
    </v-card-text>
</template>

<script>

import CardUserComponent from "./../../common/CardUserComponent"
// import UserProfilesComponent from "./../../components/UserProfilesComponent"
import {mapState} from "vuex";
import processBookForUser from "../../mixin/processBookForUser";
import Loading from "vue-loading-overlay";

export default {
    mixins: [
        processBookForUser
    ],
    data: function () {
        return {
            observer: null,
            currentPage: 1
        }
    },
    props: {
        classList: {
            type: String,
            defaultValue: ""
        },
        classNameBox: {
            type: String,
            default: "",
            required: false
        },
        actShort: {
            type: String,
            default: "",
            required: false
        }
    },
    components: {
        CardUserComponent,
        // UserProfilesComponent,
        Loading
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            step3: state => state.book.step3,
            step2: state => state.book.step2,
            step1: state => state.book.step1,
            notData: state => state.book.notData,
        }),
        dataItemsMap: function () {
            return this.listCastMeetNow;
        },
        checkHasData: function () {
            return !!this.dataItemsMap.length
        },
        showBtnStep3: function () {
            if (!!this.actShort && this.actShort === 'not-show-btn') {
                return false
            }

            return true;
        }
    },
    methods: {
        funcCheckPreventClickProfile: function (castId) {
            return (this.step3 && this.step3.userIds)
                ? this.step3.userIds.findIndex(ele => ele.id === castId) !== -1
                : false
        },
        clickStepTo4: function () {
            this.$store.dispatch("stepDispatch", 4)
        },
        funcHandleAddCastForMerge: function (eventData) {
            if (_.has(eventData, "data.id") && _.has(eventData, "action")) {
                if (eventData.action === "add") {
                    this.$store.dispatch("addCastForMergeDispatch", eventData.data)
                }
                if (eventData.action === "remove") {
                    this.$store.dispatch("removeCastForMergeDispatch", {
                        userId: eventData.data.id,
                        data: eventData.data
                    })
                }
            }
        },
        fetchData: function () {
            let self = this;
            self.$store.dispatch("loadingBookDispatch", true);

            let tags = [];
            if (self.step2) {
                Object.keys(self.step2).forEach(key => {
                    let tmp = self.step2[key].length ? self.step2[key].map(item => item.id) : [];
                    tags = tags.concat(tmp);
                })
            }

            self.fetchCastMeetNow({
                place_id: self.step1.location.idLocale,
                cast_package: self.step1.castClass.value, // It's class cast
                // schedule_join: self.step1.scheduleToJoin.date,
                ...(tags.length) && {tags},
                page: self.currentPage
            })
        },
        scrollTrigger() {
            let self = this;
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0 && !self.notData) {
                        self.currentPage += 1;
                        self.fetchData()
                    }
                });
            });

            if (!!self.$refs.infiniteScrollTrigger) {
                this.observer.observe(self.$refs.infiniteScrollTrigger);
            }
        }
    },
    mounted() {
        let self = this;

        self.$nextTick(() => {
            if (Object.keys(this.step1).length) {
                self.fetchData()
            }
        });

        self.scrollTrigger();
    },
    created: function () {
        let self = this;
    },
    destroyed() {
        if (this.observer) {
            this.observer.disconnect();
        }
    },
}
</script>
