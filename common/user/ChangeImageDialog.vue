<template>
    <div :class="[`d-dialog-class-cast p-0`]" v-if="isShowDialog">

        <v-bottom-sheet v-if="isShowDialog" v-model="showChangeImageDialog" persistent
                        :content-class="`d-dialog-show-not-fullscreen d-dialog-footer`" max-width="440">

            <v-card :class="[`d-class-cast`, 'd-border-radius-top-15']" :id="`dialog-class-cast`" v-click-outside="onClickOutside">
                <v-card-text v-if="isList()" :id="'d-card-text-feed-detail'" @click="deleteImage" style="color: red" role="button">
                    削除する
                </v-card-text>
                <v-card-text v-if="setAsAvatar === 0" :id="'d-card-text-feed-detail'" @click="setMain" role="button">
                    メイン写真にする
                </v-card-text>
                <v-card-text :id="'d-card-text-feed-detail'" role="button">
                    <!--<input type="file" id="change-image" ref="file" @change="handleFileUpload">-->
                    <label for="upload-photo">変更する</label>
                    <input type="file" ref="file" accept=".jpg, .jpeg, .png" name="photo" id="upload-photo" @change="changeFile" multiple/>
                </v-card-text>
                <v-divider :class="`mt-1 mb-1`"/>
                <v-card-text :id="'d-card-text-feed-detail'" @click="clickCallbackEventDataClose" role="button">
                    キャンセル
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>
<style lang="css">
    label {
        cursor: pointer;
        /* Style as you please, it will become the visible UI component. */
    }

    #upload-photo {
        opacity: 0;
        position: absolute;
        z-index: -1;
    }
</style>
<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
export default {
    data: function () {
        return {
        }
    },
    model: {
        event: 'change'
    },
    props: {
        isShowDialog: {
            type: Boolean,
            required: true
        },
        funcCallbackEventData: {
            type: Function,
            required: true
        },
        vModel: {
            type: Array,
            defaultValue: ""
        },
        imageId: {
            type: Number,
            required: false
        },
        setAsAvatar: {
            type: Number,
            required: false
        },
        isList: {
            type: Function,
            required: false
        }
    },
    components: {},
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
            reLoad: state => state.image.reLoad,
        }),
        ...mapGetters({
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showChangeImageDialog: function () {
            return !!this.isShowDialog
        },
    },
    methods: {
        onClickOutside () {
            this.funcCallbackEventData(false)
        },
        changeFile: function (){
            this.file = this.$refs.file.files[0];

            let formData = new FormData();

            formData.append('file', this.file);
            formData.append('image_id', this.imageId);
            /*
              Make the request to the POST /multiple-files URL
            */

            this.$store.dispatch('changeImageDispatch', {formData, imageId: this.imageId});
            this.funcCallbackEventData(false)
        },
        deleteImage: function () {
            this.$store.dispatch('deleteUserImageDispatch', {image_id: this.imageId, userId: this.user.id});
            this.funcCallbackEventData(false)
        },
        setMain: function () {
            this.$store.dispatch('setAsAvatarDispatch', {user_id: this.user.id, image_id: this.imageId});
            this.funcCallbackEventData(false)
        },
        clickCallbackEventDataClose: function () {
            this.funcCallbackEventData(false)
        },
    }
}
</script>
