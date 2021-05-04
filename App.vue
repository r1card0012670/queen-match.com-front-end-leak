<template>
    <v-app :id="`main-root`" :class="`main-root-${currentRouteName}`.toLowerCase()">
        <!-- TopToolbar></TopToolbar -->

        <v-main :class="`main-${currentRouteName}`.toLowerCase()">
            <router-view :funcGotoBack="funcGotoBack"></router-view>
        </v-main>

        <BottomNavigationComponent v-if="activeNavBottom"/>
    </v-app>
</template>

<script>

import {mapGetters, mapState} from 'vuex'
import BottomNavigationComponent from './layouts/BottomNavigationComponent.vue';
import customScrollContent from "./mixin/customScrollContent";
import resetDataStoreDialog from "./mixin/resetDataStoreDialog";
import {KEY_DEFINE_COOKIES, NEW_USER_COUPON_KEY, TYPE_ROLE_USER} from "./utils/constant";
import Vue from "vue";
import channelRoom from "./mixin/channelRoom";
import activeNavBottom from "./mixin/activeNavBottom";

export default {
    mixins: [
        resetDataStoreDialog,
        customScrollContent,
        channelRoom,
        activeNavBottom
    ],
    data() {
        return {
            fromRoute: ''
            // defineTab: Object.keys(constantMain.DEFINED_TAB).map(key => constantMain.DEFINED_TAB[key]),
        }
    },
    components: {
        BottomNavigationComponent,
    },
    methods: {
        routerDefined: function () {
            return this.$router.options.routes;
        },
        routerDefinedActive: function () {
            return this.routerDefined().filter(ele => ele.hasOwnProperty('meta') && ele.meta.hasOwnProperty("activeBottom") && ele.meta.activeBottom)
                .map(item => `${item.path}`.toLowerCase());
        },
        funcGotoBack: function (fallback) {
            let self = this;
            if (self.fromRoute && !self.fromRoute.name) {
                self.$router.push(fallback);
            } else {
                self.$router.back();
            }

            self.$nextTick(() => {
                let itemsActives = self.routerDefinedActive();

                this.$router.afterEach((to, from) => {
                    if (to && to.path && to.path && itemsActives.indexOf(to.path.toLowerCase()) !== -1) {
                        this.$store.dispatch('activeNavBottomDispatch', true);
                    }
                });
            })

            return false;
        },
        isMobile() {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true
            } else {
                return false
            }
        },
        locatorAsking: function () {
            navigator.geolocation.getCurrentPosition(
                position => {
                    if (!Vue.$cookies.get(KEY_DEFINE_COOKIES.USER_LOCATION)) {
                        Vue.$cookies.set(KEY_DEFINE_COOKIES.USER_LOCATION, {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }, "1y");
                    }
                },
                error => {
                    console.log(error.message);
                },
            )
        },
    },
    mounted() {
        let self = this;
        let currentRoute = self.$router.currentRoute;
        // Init first data
        let itemsActives = self.routerDefinedActive();

        let bootActive = currentRoute && itemsActives.indexOf(currentRoute.path.toLowerCase()) !== -1;
        this.$store.dispatch('activeNavBottomDispatch', bootActive);

        if (this.user && _.has(this.user, "id") && this.user.id) {
            this.locatorAsking();
        }

        // Init data for all module use via api
        if (this.user && this.user.id) {
            // Optimize fetch api
            // Call number read message, so data not change, and it's check exist before use that
            this.$store.dispatch("getListCardByUserBeforeOrderDispatch", {user_id: this.user.id});
            // First api + use via socket
            this.$store.dispatch("fetchNumUnreadMessageDispatch", {userOrCastId: this.user.id});
            this.$store.dispatch("fetchCouponForNewOrderDispatch", {user_id: this.user.id, key: NEW_USER_COUPON_KEY})
            this.$store.dispatch('getResidences');
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            activeNavBottom: state => state.main.activeNavBottom,
            user: state => state.user.user,
            role: state => state.user.role,
        }),
        ...mapGetters({}),
        currentRouteName() {
            return this.$route.name;
        },
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fromRoute = from
        })
    },
    beforeRouteUpdate(to, from, next) {
        // called when the route that renders this component has changed.
        // This component being reused (by using an explicit `key`) in the new route or not doesn't change anything.
        // For example, for a route with dynamic params `/foo/:id`, when we
        // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
        // will be reused (unless you provided a `key` to `<router-view>`), and this hook will be called when that happens.
        // has access to `this` component instance.
    },
    beforeRouteLeave(to, from, next) {
        next()
        // called when the route that renders this component is about to
        // be navigated away from.
        // has access to `this` component instance.
    },
    beforeCreate() {
        let self = this;
        self.$store.dispatch('roleDispatch');
        self.$store.dispatch('updateUserDispatch');
    }
}
</script>
