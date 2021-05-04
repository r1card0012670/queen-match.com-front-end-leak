<template>
    <div class="app-content-box">
        <div class="rows" v-if="!!isUser">
            <HeaderComponent :funcGotoBack="funcGotoBack" :typeComponent="constant.TYPE_COMPONENT.C_HOME"
                              :placeholder="`検索するタイプ`"/>

            <HomeComponent :payload="payload" :styleOption="styleScroll"/>

        </div>
        <div class="rows" v-if="!!isCast">

            <HomeCastComponent :payload="payload" :styleOption="styleScroll"/>
        </div>
    </div>
</template>

<script>
import HeaderComponent from '../common/HeaderComponent';
import HomeComponent from './../components/HomeComponent';
import HomeCastComponent from './../components/HomeCastComponent';
import UserProfilesComponent from './../components/UserProfilesComponent';
import {mapGetters, mapState} from 'vuex';
import C from '../utils/constants'
import {TYPE_ROLE_USER} from "../utils/constant";
import customScrollContent from "../mixin/customScrollContent";
import activeNavBottom from "../mixin/activeNavBottom";

export default {
    mixins: [
        customScrollContent,
        activeNavBottom,
    ],
    props: {
        typeHeader: String,
        funcGotoBack: {
            type: Function,
            defaultValue: null
        }
    },
    data: function () {
        return {
            payload: {}
        }
    },
    components: {
        HeaderComponent,
        HomeComponent,
        UserProfilesComponent,
        HomeCastComponent
    },
    mounted() {
    },
    methods: {},
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            customScrollContentHeight: state => state.main.customScrollContentHeight,
            role: state => state.user.role
        }),
        ...mapGetters({
            // defineTabs: "defineTabs",
            customScrollContentHeight: "customScrollContentHeight",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        isCast: function () {
            return this.role === TYPE_ROLE_USER.TYPE_CAST
        },
        styleScroll: function () {
            return `height: ${this.customScrollContentHeight}px`
        },
    },
    beforeRouteLeave(to, from, next) {
        this.checkActionNavBottom();
        next();
        // called when the route that renders this component is about to
        // be navigated away from.
        // has access to `this` component instance.
    },
    destroyed() {
    }
}
</script>
