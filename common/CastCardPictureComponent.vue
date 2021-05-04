<template>
    <div :class="[`d-cast-card-picture-wrapper`, className, classNameCustom]">
        <GradeNameComponent :classList="`text-center d-cast-card-standard ${classCursorMouse}`" :itemData="itemData"
                            v-if="!useGradeNameInCardInfo && itemData && isShowGradeName" />

        <div
            :class="[`d-box-view-image d-cast-card-picture-img-wrapper d-cast-card-picture-large`, classImageProfile, classCursorMouse]">
            <v-img :class="[`d-cast-card-picture-profile-image`, imgRounded]" :src="imgDefault"
                   :eager="true" max-height="100%" aspect-ratio="1"/>
        </div>
        <div v-if="typePicture === 'bgImgProfile'" class="d-width-max-sub d-bg-content d-cust-border-radius"></div>
    </div>

</template>

<script>
import GradeNameComponent from "./GradeNameComponent";
import C from "../utils/constants";

export default {
    data: function () {
        return {
            imgRounded: 'rounded-lg',
            classNameCustom: ''
        }
    },
    props: {
        itemData: {
            type: Object,
            required: true
        },
        className: {
            type: String,
            defaultValue: ""
        },
        typePicture: {
            type: String,
            defaultValue: ""
        },
        imgAvatarDefault: {
            type: String,
            defaultValue: ""
        },
        classCursorMouse: {
            type: String,
            default: "d-cursor-pointer"
        },
        useGradeNameInCardInfo: {
            type: Boolean,
            default: false
        },
        isThumbBg: {
            type: Boolean,
            required: false,
            default: false
        },
        isShowGradeName: {
            type: Boolean,
            required: false,
            default: true
        },
    },
    components: {
        GradeNameComponent,
    },
    computed: {
        constant: function () {
            return Object.assign({}, C)
        },
        imgDefault: function () {
            if (this.imgAvatarDefault) {
                return this.imgAvatarDefault;
            }

            // Set image default
            return this.constant.AVATAR_DEFAULT; // 'https://patofastlyprod.global.ssl.fastly.net/images%2Fprofile%2Fuser-105851%2F_thumb_1_19-1613127292136.jpeg'
        },
        classImageProfile: function () {
            if (!this.typePicture) {
                return ""
            }
            if (this.typePicture === 'bgImgProfile') {
                this.imgRounded = "";
                this.classNameCustom = "d-customs-position-bg-img";

                return 'd-width-max-sub d-ml-bg-img-profile-sub'
            }

            return ""
        }
    }
}
</script>
