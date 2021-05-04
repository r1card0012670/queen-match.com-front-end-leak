<template>
    <div :class="`app-content-box`">
        <div class="rows">
            <HeaderComponent :placeholder="'ニックネームで検索'" :funcGotoBack="funcGotoBack" :typeComponent="constant.TYPE_COMPONENT.C_CHAT"/>

            <ChatComponent :payload="payload" :styleOption="styleScroll" :className="`d-list-message`"/>
        </div>
    </div>
</template>

<script>
import HeaderComponent from '../common/HeaderComponent';
import ChatComponent from './../components/ChatComponent';
import UserProfilesComponent from './../components/UserProfilesComponent';
import {mapGetters, mapState} from 'vuex';
import C from '../utils/constants'
import activeNavBottom from "../mixin/activeNavBottom";

export default {
    mixins: [
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
        ChatComponent,
        UserProfilesComponent
    },
    mounted() {
    },
    methods: {},
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            customScrollContentHeight: state => state.main.customScrollContentHeight,
            user: state => state.user.user,
        }),
        ...mapGetters({
            // defineTabs: "defineTabs",
            customScrollContentHeight: "customScrollContentHeight",
        }),
        constant: function () {
            return Object.assign({}, C)
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
}
</script>
