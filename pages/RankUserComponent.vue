<template>
    <div class="app-content-box">
        <div class="rows">
            <button v-on:click="goBack()">
                <icon-svg-component :class="'d-inline-block btn'" :type="'chevron-left'"></icon-svg-component>
            </button>
            user profile ....
            <div>
                content
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import C from '../utils/constants'
import IconSvgComponent from "../common/IconSvgComponent";
import activeNavBottom from "../mixin/activeNavBottom";

export default {
    mixins: [
        activeNavBottom
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
    components: {IconSvgComponent},
    mounted() {
    },
    methods: {
        goBack: function (event) {
            if (typeof this.funcGotoBack === "function") {
                this.funcGotoBack(event)
            }
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // defineTabs: state => state.main.defineTabs,
            // tabActive: state => state.main.tabActive,
            // currentType: state => state.main.currentType
        }),
        ...mapGetters({
            // defineTabs: "defineTabs",
            // currentType: "currentType",
            // tabActive: "tabActive",
        }),
        constant: function () {
            return Object.assign({}, C)
        }
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
