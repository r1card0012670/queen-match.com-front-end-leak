<template>
    <v-card-text :class="[`d-time-plan-cast p-0 no-bg d-step-book d-step-book-2 pb-15`]">
        <div :class="[`${classNameBox}d-book-wrapper`]">
            <div :class="[`${classNameBox}d-book-body`, 'p-2']">
                <v-col v-if="isShowIntro" class="col-12 p-0 font-weight-bold d-title-block-book">今日の気分は？</v-col>

                <v-col class="col-12 p-0 mt-5" v-if="isShowIntro">
                    <div class="p-0 flex-wrap">
                        <p>ご要望に近いキャストをマッチングします。</p>
                        <p>好みのタグをお選びください。 </p>
                    </div>
                </v-col>

                <template v-if="checkTagAllFilterGroup">
                    <v-card-text class="d-block-filter-1 d-block m-0 p-0 pt-4 tag-wrapper"
                                 v-for="(item, index) in showListAllFilterGroupByType" :key="index">
                        <v-col class=" span-label p-0 d-line-title pl-1">{{ groupTagName(item) }}</v-col>
                        <v-col v-if="true" class="d-flex col-12 justify-content-start flex-wrap p-0">
                            <div class="list-tag list-tag-v2 no-scroll">
                                <v-chip v-for="(element, i) in item.tags" :key="i"
                                        :class="['m-0', {'selected active': checkSelectedFilterType1(element.id)}]"
                                        role="button" @click="matchingType1(element)">
                                    {{ element.tag_name }}
                                </v-chip>
                            </div>
                        </v-col>
                    </v-card-text>
                </template>
                <template v-else>
                    <loading :active.sync="visible"></loading>
                </template>

                <!--forceUpdate-->
                <input type="text" hidden :value="forceUpdate">
            </div>

            <div :class="[`${classNameBox}d-book-footer`]" v-if="!isPreventForVisibility && isShowIntro">
                <v-btn outlined @click="clickStepTo3" class="btn-base"> 次に進む</v-btn>
            </div>
        </div>

    </v-card-text>
</template>

<script>


import {mapState} from "vuex";
import customScrollContent from "../../mixin/customScrollContent";
import Vue from "vue";
import {KEY_DEFINE_COOKIES} from "../../utils/constant";
import Loading from 'vue-loading-overlay';
import constantMain from "../../utils/constants";

export default {
    mixins: [
        customScrollContent
    ],
    data: function () {
        return {
            forceUpdate: 0,
            visible: false,
        }
    },
    props: {
        classList: {
            type: String,
            defaultValue: ""
        },
        modeType: {
            type: String,
            defaultValue: "",
            required: false
        },
        showIntro: {
            type: Boolean,
            default: true,
            required: false
        },
        isDraftData: {
            type: Boolean,
            default: false,
            required: false
        },
        classNameBox: {
            type: String,
            default: "",
            required: false
        }
    },
    components: {
        Loading
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            step2: state => state.book.step2,
            tempStep2: state => state.book.tempStep2,
            tagAllFilterGroupByType: state => state.tag.tagAllFilterGroupByType,
        }),
        constant: function () {
            return Object.assign({}, constantMain)
        },
        isShowIntro: function () {
            return !!this.showIntro
        },
        modeTypeAction: function () {
            if (!this.modeType) {
                return "DEFAULT"
            }
            if (this.modeType === "VISIBILITY") {
                return "VISIBILITY"
            }
        },
        isPreventForVisibility: function () {
            return this.modeTypeAction === "VISIBILITY"
        },
        isDraft: function () {
            return !!this.isDraftData
        },
        dataStep2: function () {
            if (this.isDraft) {
                return this.tempStep2;
            }
            return this.step2
        },
        checkTagAllFilterGroup: function () {
            this.visible = false;
            return !!Object.keys(this.tagAllFilterGroupByType).length
        },
        showListAllFilterGroupByType: function () {
            return this.isPreventForVisibility ? this.listItemsSelected : this.tagAllFilterGroupByType
        },
        listItemsSelected: function () {
            let results = [];
            let listTagsId = this.listIdChosen
            this.tagAllFilterGroupByType.forEach(ele => {
                let cl = _.has(ele, 'tags') ? ele.tags.filter(its => _.indexOf(listTagsId, its.id) !== -1) : []
                if (cl.length) {
                    results.push(Object.assign({}, ele, {tags: cl}))
                }
            });
            return results
        },

        listIdChosen: function () {
            let tags = [];
            Object.keys(this.step2).forEach(key => {
                let tmpId = this.step2[key].map(ele => ele.id);
                tags = tags.concat(tmpId);
            });

            return tags
        }
    },
    methods: {
        groupTagName: function (item) {
            return item && _.has(item, "group_tag_name") ? item.group_tag_name : ""
        },
        clickStepTo3: function () {
            this.$store.dispatch("stepDispatch", 3)
        },
        matchingType1: function (element) {
            // Mod is show visibility
            if (this.isPreventForVisibility) {
                return;
            }

            let isSelected = this.checkSelectedFilterType1(element.id);
            if (isSelected) {
                this.$store.dispatch("removeSituationForMergeDispatch", Object.assign({}, {
                    id: element.id,
                    type: "filter_1",
                    isDraft: this.isDraft
                }))
            } else {
                this.$store.dispatch("addSituationForMergeDispatch", Object.assign({}, {
                    data: {
                        id: element.id,
                        groupId: element.group_tag_id
                    },
                    type: "filter_1",
                    isDraft: this.isDraft
                }))
            }

            this.forceUpdate = ++this.forceUpdate
            this.setFeelingToCookie()
        },
        // TODO
        // matchingType2: function (id) {
        //     // Mod is show visibility
        //     if (this.isPreventForVisibility) {
        //         return;
        //     }
        //
        //     let isSelected2 = this.checkSelectedFilterType2(id);
        //     if (isSelected2) {
        //         this.$store.dispatch("removeSituationForMergeDispatch", Object.assign({}, {
        //             id,
        //             type: "filter_2",
        //             isDraft: this.isDraft
        //         }))
        //     } else {
        //         this.$store.dispatch("addSituationForMergeDispatch", Object.assign({}, {
        //             data: {id},
        //             type: "filter_2",
        //             isDraft: this.isDraft
        //         }))
        //     }
        //     this.forceUpdate = ++this.forceUpdate
        //     this.setFeelingToCookie()
        // },
        checkSelectedFilterType1: function (id) {
            return this.dataStep2 && this.dataStep2.filterType1.findIndex(ele => ele.id === id) !== -1;
        },
        // checkSelectedFilterType2: function (id) {
        //     return this.dataStep2 && this.dataStep2.filterType2.findIndex(ele => ele.id === id) !== -1;
        // },
        setFeelingToCookie: function () {
            Vue.$cookies.set(KEY_DEFINE_COOKIES.SELECT_FEELING_BOOK, JSON.stringify(this.step2), "3y")
        },
        checkSession: function () {
            let self = this;
            if (Vue.$cookies.isKey(KEY_DEFINE_COOKIES.SELECT_FEELING_BOOK)) {
                let step2SelectedCookie = Vue.$cookies.get(KEY_DEFINE_COOKIES.SELECT_FEELING_BOOK);

                if (_.has(self.step2, "filterType1") && !self.step2.filterType1.length && Object.keys(self.tagAllFilterGroupByType).length) {
                    this.$store.dispatch("updateDataToStep2Dispatch", step2SelectedCookie)
                }
            }
        }
    },
    mounted() {
        if (!Object.keys(this.tagAllFilterGroupByType).length) {
            this.visible = true;
            this.$store.dispatch("fetchAllTagByTypeDispatch", {type: this.constant.TAG_TYPE.order});
        }
    },
    watch: {
        tagAllFilterGroupByType: {
            handler: function (after, before) {
                this.checkSession();
            },
            deep: true
        }
    },
    created: function () {
        let self = this;
    }
}
</script>
