<template>
    <div :class="[`d--hashtag p-0`, classList]">
        <v-card :class="[classFullScreen, `d-hashtag d-dialog-footer`]" :id="`dialog-hashtag`">
            <v-card-title :id="'d-card-title-hashtag'" :class="[`headline d-header-box-hashtag p-1`, classBorderWidth]">
                <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                    <button v-on:click="clickFeedHashTagDialogClose" class="pl-2" v-if="!showHeaderDialog">
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
                    <div class="info-bar d-act-title-hashtag pr-0 btn ml-0">
                        <v-btn text @click="clickSubmitFeedHashTag" :class="`d-act-title-brown pr-0`">
                            {{!!titleSubmit? titleSubmit : '投稿'}}
                        </v-btn>
                    </div>
                </div>
            </v-card-title>

            <v-card-text :id="'d-card-text-feed-detail'" :class="`mt-4`">
                <v-col :class="['p-0' , 'tag-wrapper']" v-if="showFeedCreateDialog">
                    <template v-for="item in groupTags">
                        <div class="v-sheet font-weight-bold d-line-title" v-if="item.group_tag_name === '必須'">{{ item.group_tag_name }}</div>
                        <div class="list-tag list-tag-v2 no-scroll">
                            <div class="d-flex">
                                <div class="text-center">
                                    <template v-for="tag in item.tags">
                                        <v-chip @click="clickHashData(true, tag)" :class="{active: recruitment}" v-if="tag.tag_name == '募集'">
                                            {{tag.tag_name}}
                                        </v-chip>
                                        <v-chip @click="clickHashData(false, tag)" :class="{active: (!recruitment && vModelData.length != 0)}" v-if="tag.tag_name == 'その他'">
                                            {{tag.tag_name}}
                                        </v-chip>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="v-sheet font-weight-bold d-line-title" v-if="recruitment && item.group_tag_name === '任意'">{{ item.group_tag_name }}</div>
                        <div class="list-tag list-tag-v2 no-scroll" v-if="recruitment && item.group_tag_name === '任意'">
                            <div class="d-flex">
                                <div class="text-center">
                                    <v-chip @click="clickHashTagData(tag)" v-for="tag in item.tags" :key="tag.id" :class="{ active: getActiveTagAttribute(tag) }">
                                        {{ tag.tag_name }}
                                    </v-chip>
                                </div>
                            </div>
                        </div>
                    </template>
                </v-col>
                <v-col :class="['p-0' , 'tag-wrapper']" v-if="!showFeedCreateDialog">
                    <template v-for="item in groupTags">
                        <div class="v-sheet font-weight-bold d-line-title" v-if="item.group_tag_name === '必須'">{{ item.group_tag_name }}</div>
                        <div class="list-tag list-tag-v2 no-scroll">
                            <div class="d-flex">
                                <div class="text-center">
                                    <template v-for="tag in item.tags">
                                        <v-chip @click="clickHashTagData(tag)" :class="{active: getActiveTagAttribute(tag)}" v-if="tag.tag_name == '募集'">
                                            {{tag.tag_name}}
                                        </v-chip>
                                        <v-chip @click="clickHashTagData(tag)" :class="{active: getActiveTagAttribute(tag)}" v-if="tag.tag_name == 'その他'">
                                            {{tag.tag_name}}
                                        </v-chip>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="v-sheet font-weight-bold d-line-title" v-if="item.group_tag_name === '任意'">{{ item.group_tag_name }}</div>
                        <div class="list-tag list-tag-v2 no-scroll" v-if="item.group_tag_name === '任意'">
                            <div class="d-flex">
                                <div class="text-center">
                                    <v-chip @click="clickHashTagData(tag)" v-for="tag in item.tags" :key="tag.id" :class="{ active: getActiveTagAttribute(tag) }">
                                        {{ tag.tag_name }}
                                    </v-chip>
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
import image from "../../store/modules/image";

export default {
    data: function () {
        return {
            vModelData: [],
            listTag: [],
            recruitment: false,
            parentGroup: []
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
        checkShowSubTag: {
            type: Boolean,
            defaultValue: false,
        },
        dataHashTagChoose: {
            type: Array,
            defaultValue: []
        },
        imageFile: {
            // type: File,
            defaultValue: null
        },
        content: {
            type: String,
            defaultValue: ''
        },
        titleSubmit: {
            type: String,
            defaultValue: '投稿'
        }
    },
    components: {
        IconSvgComponent
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
            showFeedCreateDialog: state => state.feed.showFeedCreateDialog
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

            if (this.typeTag === 'dialog-search' || this.typeTag === 'user-edit-profile') {
                return true;
            }

            return false
        }
    },
    methods: {
        clickFeedHashTagDialogClose: function (event) {
            this.funcEmitData();

            // Emit data before use method callback
            this.$nextTick(() => {
                this.funcCallbackEventData({isTypeAction: false});
            });
        },
        clickSubmitFeedHashTag: async function () {
            // debugger
            this.listTag = this.vModelData.map(item=>item.id);
            if (this.showFeedCreateDialog) {
                let data = new FormData();
                data.append('image', this.imageFile)
                data.append('content', this.content)
                data.append('list_tag', this.listTag)

                await this.$store.dispatch('createFeedDispatch', data).then(res=>{
                    this.$emit('submitCreateFeed')

                    this.clickFeedHashTagDialogClose();
                })
            } else {
                this.clickFeedHashTagDialogClose();
            }
        },
        funcEmitData: function () {
            let data = {
                listTag: this.vModelData,
                recruitment: this.recruitment,
            }
            this.$emit('changeHashtag', data)
            // this.$emit('changeHashtag', this.vModelData);
        },
        clickHashData: function (recruitment, tag) {
            if (recruitment == false) {
                this.vModelData = [];
                let tmp = _.cloneDeep(this.vModelData);
                const index = _.findIndex(tmp, (item) => {
                    return item.id == tag.id;
                });
                if (index == -1) {
                    tmp.push(tag);
                }
                this.vModelData = tmp;
            } else {
                let tmp = _.cloneDeep(this.vModelData);
                const index = _.findIndex(tmp, (item) => {
                    return item.id == tag.id;
                });
                if (index == -1) {
                    tmp.push(tag);
                }
                let itemOther = _.findIndex(tmp, (item) => {
                    return item.tag_name === 'その他';
                })
                if (itemOther != -1) {
                    tmp.splice(itemOther, 1);
                }
                this.vModelData = tmp;
            }
            this.recruitment = recruitment;
        },
        clickHashTagData: function (tag) {
            let tmp = _.cloneDeep(this.vModelData);
            const index = _.findIndex(tmp, (item) => {
                return item.id == tag.id;
            });
            if (index == -1) {
                tmp.push(tag);
            } else {
                tmp.splice(index, 1);
            }
            this.vModelData = tmp;
        },
        updateUser: function (data) {
            this.$store.dispatch('turnOffOverlayDispatch', false);
            this.$store.dispatch('updateCurrentUserDispatch', data);
        },
        getActiveTagAttribute: function (tag) {
            const index = _.findIndex(this.vModelData, function (item) {
                return _.isEqual(item.id, tag.id);
            });
            return index > -1;
        },
    },
    mounted() {
        this.vModelData = this.dataHashTagChoose;
        this.recruitment = this.checkShowSubTag;
        if(this.showFeedCreateDialog === true) {
            this.recruitment = true;
        }
    },
    updated() {
        if (this.showFeedCreateDialog === true && this.recruitment == true && this.vModelData.length == 0) {
            let groupTag = this.groupTags.filter(ele=>ele.group_tag_name === '必須');
            if (groupTag.length > 0) {
                let tag = groupTag[0].tags.filter(ele=>ele.tag_name === '募集');
                if(tag.length > 0) {
                    this.vModelData.push(tag[0])
                }
            }
        }
    }
}
</script>
