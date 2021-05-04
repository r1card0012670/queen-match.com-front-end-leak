<template>
    <div :class="[`d--hashtag p-0`, classList]">
        <v-card :class="[classFullScreen, `d-hashtag d-dialog-footer`]" :id="`dialog-hashtag`" height="50vh">
            <v-card-title :id="'d-card-title-hashtag'" :class="[`headline d-header-box-hashtag p-1`, classBorderWidth]">
                <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                    <button @click="clickFeedHashTagDialogClose" class="pl-2" v-if="!showHeaderDialog">
                        <v-icon v-if="checkCustomIconCallback">{{ txtIcon }}</v-icon>
                        <v-img contain src="../../images/chevron-left.svg"/>
                        {{ btnTitle }}
                    </button>
                    <v-btn icon dark v-on:click="clickFeedHashTagDialogClose" v-if="showHeaderDialog">
                        <v-icon class="mr-2 pt-1" v-if="showHeaderDialog">close</v-icon>
                    </v-btn>
                    <v-card-title :class="`p-0`" v-if="showHeaderDialog">{{ btnTitle }}</v-card-title>
                    <div class="info-bar d-title-hashtag d-header-title-center pr-0 ml-9 btn" v-if="titleName">
                        {{ titleName }}
                    </div>
                    <div class="info-bar d-act-title-hashtag pr-0 btn ml-0" v-if="!showHeaderDialog">
                        <v-btn text @click="clickSubmitFeedHashTag" :class="`d-act-title-brown pr-0`">
                            投稿
                        </v-btn>
                    </div>
                    <v-btn class="info-bar d-act-title-local-cast pr-0 button-choice" color="green darken-1"
                           v-on:click="clickSubmitFeedHashTag" text v-if="showHeaderDialog">
                        設定
                    </v-btn>
                </div>
            </v-card-title>

            <v-card-text :id="'d-card-text-feed-detail'" :class="`mt-4`">
                <v-col :class="['p-0' , 'tag-wrapper']">
                    <template v-for="item in groupTags">
                        <div class="v-sheet font-weight-bold d-line-title" v-if="checkHasData(item)">{{ item.group_tag_name }}</div>
                        <div class="list-tag list-tag-v2 no-scroll">
                            <div class="d-flex">
                                <div class="text-center" v-model="vModelData">
                                    <template v-if="typeTag === 'cast-edit-profile'">
                                        <template v-for="tag in item.tags">
                                            <v-chip v-if="tag.type === 1" @click="clickHashData(tag)"
                                                    :class="{ active: getActiveTagAttribute(tag) }">
                                                {{ tag.tag_name }}
                                            </v-chip>
                                        </template>
                                    </template>
                                    <template v-else-if="typeTag === 'user-edit-profile'">
                                        <template v-for="tag in item.tags">
                                            <v-chip v-if="tag.type === 2" @click="clickHashData(tag)"
                                                    :class="{ active: getActiveTagAttribute(tag) }">
                                                {{ tag.tag_name }}
                                            </v-chip>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <v-chip v-for="tag in item.tags" :key="tag.id" @click="clickHashData(tag)"
                                                :class="{ active: getActiveTagAttribute(tag) }">
                                            {{ tag.tag_name }}
                                        </v-chip>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>
                </v-col>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>

import {mapGetters, mapState} from 'vuex';
import IconSvgComponent from "./../../common/IconSvgComponent";
import C from "../../utils/constants";

export default {
    data: function () {
        return {
            vModelData: []
        }
    },
    model: {
        event: 'changeHashtag'
    },
    props: {
        btnTitle: {
            type: String,
            defaultValue: "",
        },
        titleName: {
            type: String,
            defaultValue: "",
        },
        classList: {
            type: String,
            defaultValue: "",
        },
        classFullScreen: {
            type: String,
            defaultValue: "",
        },
        stringIconCallback: {
            type: String,
            defaultValue: ""
        },
        funcCallbackEventData: {
            type: Function,
            required: true,
        },
        typeTag: {
            type: String,
            defaultValue: "",
        },
        classBorderWidth: {
            type: String,
            defaultValue: "",
        },
        groupTags: {
            type: Array,
            defaultValue: [],
        },
        value: {
            type: Array,
            defaultValue: [],
        }
    },
    components: {
        IconSvgComponent
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
        }),
        ...mapGetters({
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        checkCustomIconCallback: function () {
            return !!this.txtIcon
        },
        txtIcon: function () {
            if (!this.stringIconCallback) {
                return ""
            }

            return this.stringIconCallback
        },
        showHeaderDialog: function () {
            if (!this.typeTag) {
                return false
            }

            if (this.typeTag === 'dialog-search' || this.typeTag === 'user-edit-profile' || this.typeTag === 'cast-edit-profile') {
                return true;
            }

            return false
        }
    },
    methods: {
        clickFeedHashTagDialogClose: function (event) {
            // Emit data before use method callback
            this.$nextTick(() => {
                this.funcCallbackEventData({isTypeAction: false});
            });
        },
        clickSubmitFeedHashTag: function () {
            this.funcEmitData();
            let tagsIdForUpdate = [];
            if (this.vModelData.length > 0) {
                this.vModelData.forEach( item => {
                    tagsIdForUpdate.push(item.id);
                });

            }
            this.updateUser({user_id: this.user.id, tag: tagsIdForUpdate});

            this.$nextTick(() => {
                this.funcCallbackEventData({isTypeAction: true})
            });
        },
        funcEmitData: function () {
            this.$emit('changeHashtag', this.vModelData);
        },
        clickHashData: function (tag) {
            let tmp = _.cloneDeep(this.vModelData);
            const index = _.findIndex(tmp, function (item) {
                return _.isEqual(item.id, tag.id);
            });
            if (index == -1) {
                tmp.push(tag);
            } else {
                tmp.splice(index, 1);
            }
            this.vModelData = tmp;
        },
        updateUser: function (data) {
            this.$store.dispatch('updateCurrentUserDispatch', data);
        },
        getActiveTagAttribute: function (tag) {
            const index = _.findIndex(this.vModelData, function (item) {
                return _.isEqual(item.id, tag.id);
            });
            return index > -1;
        },
        checkHasData: function (item) {
            return _.has(item, "tags") && !!item.tags.length
        }
    },
    created() {
        this.vModelData = this.value;
    }
}
</script>

<style lang="scss" scoped>
#d-card-text-feed-detail {
    height: calc(100% - 100px);
}
</style>
