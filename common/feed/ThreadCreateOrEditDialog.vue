<template>
    <div :class="[`d-thread-create-feed p-0`]" v-if="showFeedCreateOrEditDialog">
        <v-dialog v-model="showFeedCreateOrEditDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                  fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable>

            <v-card :class="`d-feed-create-or-edit-wrapper`" :id="`dialog-feed-create-or-edit`">
                <v-card-title :id="'d-card-title-feed-create-or-edit'"
                              :class="[`headline d-header-box-feed-create-or-edit d-header-border-width-3 d-border-bottom p-1`]">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <button @click="showFeedCreateOrEditDialogClose" class="pl-2">
                            <v-img contain src="../../images/chevron-left.svg"/>
                        </button>
                        <div class="info-bar d-act-title-feed-create-or-edit d-act-title-brown pr-2 btn"
                             @click="funcClickOpenHashTagFeed">
                            次へ
                        </div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-feed-create-or-edit'" :class="[`p-0`]">
                    <v-sheet :class="`p-2 d-posting-for-feed-wrapper`">

                        <div :class="'d-box-create-feed'">
                            <v-col :class="[`d-chat-user p-0`]">
                                <ChatUser :objUser="curUser" :name="curUser.nickname"/>
                            </v-col>

                            <v-textarea :rows="7" v-model="post" name="input-posting" :placeholder="labelPlaceholder"/>
                            <div class="error--text pb-5" style="margin-top: -10px" v-if="showErrorContent">{{errorContent}}</div>
                            <div class="d-view-image-posting">
                                <FilesComponent :dataFiles="files" :roundedSizeImage="'rounded-lg'"/>

                                <v-btn fab icon class="d-act-close-image" @click="clickRemoveFilePost"
                                       v-if="files.length">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </div>
                            <div class="error--text pb-5 mt-2" v-if="showErrorImages">{{errorImages}}</div>
                        </div>
                    </v-sheet>
                </v-card-text>
                <div :class="`d-box-act-posting-feed d-border-top d-flex align-items-center`">
                    <v-btn icon @click='pickFile'>
                        <v-img :class="`icon-image`" contain src="../../images/GR-icon-image.svg"/>
                    </v-btn>
                </div>

                <v-flex xs12 class="d-none">
                    <input type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked">
                </v-flex>
            </v-card>
        </v-dialog>

        <HashTagFeedDialog :imageFile="imageFile" :content="post" :funcCallbackEventData="funcCallbackEventDataHashtag"
                       :title-name="`タグ追加`" :groupTags="groupTags" v-on:submitCreateFeed="submitCreateFeed"/>
    </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import ChatUser from "./../user/ChatUser";
import FilesComponent from "./../FilesComponent";
import IconSvgComponent from "./../../common/IconSvgComponent";
import HashTagFeedDialog from "./../../common/feed/HashTagFeedDialog";
import {storyService} from "../../../js/_services";

export default {
    data: function () {
        return {
            post: "",
            files: [],
            imageName: '',
            imageUrl: '',
            imageFile: '',
            dataHashtagFeed: [],
            errorImages: '',
            errorContent: '1000文字以下で入力してください',
            showErrorContent: false,
            showErrorImages: false,
        }
    },
    props: {
        classList: {
            type: String,
            defaultValue: ""
        },
        labelPlaceholder: {
            type: String,
            defaultValue: ""
        },
        typeCreatOrEdit: {
            type: String,
            required: true
        }
    },
    components: {
        ChatUser,
        FilesComponent,
        IconSvgComponent,
        HashTagFeedDialog
    },
    watch: {
        files: function(t,f){
            if (t.length > 0 && t[0].size > 5000000) {
                this.showErrorImages = true
                this.errorImages = '5MB以下の写真ファイルをアップロードしてください';
            } else if (t.length > 0 && !('jpg,png,jpeg'.includes(t[0].type.replace('image/','')))) {
                this.showErrorImages = true;
                this.errorImages = 'JPG、JPEG、またはPNGの形式でアップロードしてください'
            } else {
                this.showErrorImages = false;
            }
        },
        post: function (t,f) {
            if (t.length > 1000) {
                this.showErrorContent = true;
            } else {
                this.showErrorContent = false;
            }
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            showFeedCreateDialog: state => state.feed.showFeedCreateDialog,
            showFeedEditDialog: state => state.feed.showFeedEditDialog,
            feedDetail: state => state.feed.feedDetail,
            curUser: state => state.user.user,
            groupTags: state => state.search.groupTags,
        }),
        ...mapGetters({
            showFeedCreateDialog: "showFeedCreateDialog",
            showFeedEditDialog: "showFeedEditDialog",
            feedDetail: "feedDetail",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        userId: function () {
            // TODO
            return "userId"
        },
        isCreate: function () {
            let isCreate = this.typeCreatOrEdit === 'feed-create'
            if (isCreate) {
                this.initDataCreatOrEdit(true)
            }
            return isCreate
        },
        isEdit: function () {
            let isEdit = this.typeCreatOrEdit === 'feed-edit';
            if (isEdit) {
                this.initDataCreatOrEdit(false)
            }
            return isEdit
        },
        showFeedCreateOrEditDialog: function () {
            return !!this.isCreate || !!this.isEdit
        }
    },
    methods: {
        initDataCreatOrEdit: function (isCreatOrEdit) {
            if (isCreatOrEdit) {
                // Is create
                this.post = "";
                this.files = [];
                this.imageUrl = [];

            } else {
                // Is edit
                this.post = this.feedDetail && _.has(this.feedDetail, "content") ? this.feedDetail.content : "";
                this.files = this.feedDetail && _.has(this.feedDetail, "files") && _.isArray(this.feedDetail.files) ? this.feedDetail.files : [];
            }
        },
        showFeedCreateOrEditDialogClose: function () {
            if (this.isCreate) {
                this.$store.dispatch('showFeedCreateDialogDispatch', false);
            }
            if (this.isEdit) {
                this.$store.dispatch('showFeedEditDialogDispatch', {isShow: false, data: {}});
            }
            this.post = "";
            this.files = [];
            this.imageName = '';
            this.imageUrl = '';
            this.imageFile = ''
        },
        funcClickOpenHashTagFeed: function () {
            if ((!this.post && this.files.length == 0) || this.showErrorImages || this.showErrorContent) {
                return;
            }
            this.$store.dispatch('getGroupTags', {type: this.constant.TAG_TYPE.story})
            this.$store.dispatch('showFeedHashTagDialogDispatch', {
                isShow: true,
                dataFeed: Object.assign({}, {
                    post: this.post,
                    files: this.files,
                    imageUrl: this.imageUrl,
                })
            });
        },
        pickFile() {
            this.$refs.image.click()
        },
        onFilePicked(e) {
            // TODO
            // Check size
            // Check logic upload
            const files = e.target.files

            if (files[0] !== undefined) {
                this.imageName = files[0].name
                if (this.imageName.lastIndexOf('.') <= 0) {
                    return
                }
                const fr = new FileReader()

                fr.readAsDataURL(files[0])
                fr.addEventListener('load', () => {
                    this.imageUrl = fr.result;
                    let tmpFiles = []
                    Array.from(files).forEach(file => {
                        tmpFiles.push(Object.assign({}, _.pick(file, ["lastModified", "lastModifiedDate", "name", "size", "type", "webkitRelativePath"]), {url: fr.result}))
                    })
                    this.imageFile = files[0]; // this is an image file that can be sent to server...
                    this.files = tmpFiles;
                })
            } else {
                this.imageName = ''
                this.imageFile = ''
                this.imageUrl = ''
            }
        },
        clickRemoveFilePost: function () {
            this.files = []
            this.imageUrl = ""
        },
        funcCallbackEventDataHashtag: function (payload) {
            // console.log("ThreadCreateOrEditDialog.vue >>", payload)
            if (!_.has(payload, "isTypeAction")) {
                return;
            }
            this.dataHashtagFeed = payload.modelHashtag;

            // Check that before use
            // if (payload.isTypeAction) {
            //     // Submit data to server
            //     // console.log("Submit data to server")
            //     let self = this;
            //     storyService.getAllStory(role)
            //         .then(sessionUser => {
            //             commit('registerFailureMutation', {});
            //             // dispatch("accessLoginAfterSuccessDispatch", sessionUser)
            //         })
            //         .catch(error => {
            //             commit('registerFailureMutation', _.has(error, "err") ? error.err : error);
            //             // dispatch('alert/error', error, {root: true});
            //         });
            // }
        },
        submitCreateFeed: async function (tag) {
            this.$emit('resetData');
            this.showFeedCreateOrEditDialogClose();

        }
    },
    destroyed() {
        this.post = ""
        this.imageUrl = ""
        this.files = []
    }
}
</script>
