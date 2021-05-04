<template>
    <div class="app-content-box">
        <div class="rows">
            <HeaderComponent :funcGotoBack="funcGotoBack" :typeComponent="constant.TYPE_COMPONENT.C_FEED"/>

            <div class="d-element-fixed-for-sub col-12 p-0">
                <v-divider :class="`mt-1 mb-1`"/>
            </div>

            <FeedComponent :payload="payload"/>
        </div>
    </div>
</template>

<script>
import HeaderComponent from '../common/HeaderComponent';
import FeedComponent from './../components/FeedComponent';
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
        },
    },
    data: function () {
        return {
            payload: {}
        }
    },
    components: {
        HeaderComponent,
        FeedComponent,
        UserProfilesComponent,
    },
    mounted() {
    },
    methods: {
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
        }),
        ...mapGetters({
            // defineTabs: "defineTabs",
        }),
        constant: function () {
            return Object.assign({}, C)
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
