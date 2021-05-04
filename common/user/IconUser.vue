<template>
    <v-avatar :size="size" :id="`d-avatar-user-id-${user.id}`">
        <v-img :src="`${ ORIGINAL_URL +'/'+ dataUser.avatar}`" @click="clickSettingEdit" v-if="!!dataUser.avatar"></v-img>
        <v-img :src="`${ ORIGINAL_URL +'/'+ 'images/avatar-default.png'}`" @click="clickSettingEdit" v-if="!dataUser.avatar"></v-img>
    </v-avatar>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";

export default {
    props: {
        userId: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            defaultValue: null
        },
        dataUser: {
            type: Object,
            defaultValue: {}
        },
        isPreventDefault: {
            type: Boolean,
            required: false
        },
    },

    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // itemUsers: state => state.user.itemUsers,
            user: state =>state.user.user,
            // currentType: state => state.main.currentType
        }),
        ...mapGetters({
            // itemUsers: "itemUsers",
        }),
        ORIGINAL_URL() {
            return window.location.origin
        },
        constant: function () {
            return Object.assign({}, C)
        },
        // itemUserByID: function () {
        //     let findIndex = this.itemUsers.findIndex(ele => ele.id === this.userId)
        //     return (findIndex !== -1) ? this.itemUsers[findIndex] : {}
        // },
        currentUserID: function () {
            return "userId"
        }
    },
    methods: {
        clickSettingEdit: function () {
            if (!!this.isPreventDefault) {
                return;
            }
            this.$store.dispatch('isUpdateProfileDispatch', true)
        },
    }
}
</script>
