<template>
    <v-btn :id="`d-follow-user-id-${userId} p-0`" :class="[`btn-base`, className]" @click="callBack">
        <v-icon v-if="!isFollowed" :class="[{'p-0': !isShowText}]">favorite</v-icon>
        <v-icon v-else :class="[{'p-0': !isShowText}]">message</v-icon>

        <div v-if="isShowText">
            {{ renderText }}
        </div>
    </v-btn>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";

export default {
    props: {
        className: {
            type: String,
            default: ""
        },
        userId: {
            type: String,
            required: true
        },
        isShowText: {
            type: Boolean,
            default: true
        },
        callBack: {
            type: Function,
            default: null,
            required: true
        },
        isFollowed: {
            type: Boolean,
            default: true,
            required: true
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // currentType: state => state.main.currentType
        }),
        ...mapGetters({}),
        constant: function () {
            return Object.assign({}, C)
        },
        renderText: function () {
            return !!this.isFollowed ? "メッセージを送る" : "いいね"
        }
    },
}
</script>
