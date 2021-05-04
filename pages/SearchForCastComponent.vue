<template>
    <div class="app-content-box">
        <div class="rows">
            <header-component :funcGotoBack="funcGotoBack" :typeComponent="constant.TYPE_COMPONENT.C_SEARCH_USER"
                             :placeholder="'検索するタイプ'"/>
            <cast-search-component :payload="payload" :styleOption="styleScroll"/>
        </div>
    </div>
</template>

<script>
import HeaderComponent from '../common/HeaderComponent.vue';
import CastSearchComponent from './../components/CastSearchComponent';
import {mapGetters, mapState} from 'vuex';
import C from '../utils/constants'
import {TYPE_ROLE_USER} from "../utils/constant";

export default {
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
        CastSearchComponent
    },
    methods: {},
    computed: {
        ...mapState({
            role: state => state.user.role,
            customScrollContentHeight: state => state.main.customScrollContentHeight,
        }),
        ...mapGetters({
            customScrollContentHeight: "customScrollContentHeight",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        styleScroll: function () {
            return `height: ${this.customScrollContentHeight}px`
        },
    }
}
</script>
