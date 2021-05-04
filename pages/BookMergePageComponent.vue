<template>
    <div class="app-content-box">
        <div class="rows">
            <BookMergeComponent :payload="payload"/>
        </div>
    </div>
</template>

<script>
import BookMergeComponent from './../components/BookMergeComponent';
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
        BookMergeComponent,
        UserProfilesComponent
    },
    mounted() {
    },
    methods: {},
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
        }),
        ...mapGetters({
            // tabActive: "tabActive",
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
