<template>
    <div class="app-content-box">
        <template v-if="checkActionShowProfile">
            <v-dialog v-if="isShowProfileAlias" v-model="isShowProfileAlias" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                      fullscreen persistent hide-overlay transition="dialog-bottom-transition" scrollable :loading="initFetchDataById">

                <UserProfilesComponent v-if="isShowProfileAlias && initFetchDataById" name="profileAlis" :typeAction="typeAction"
                                       :userInfo="userInfo" :isFetchData="false" :listUserOrCastData="listUserOrCastData"
                                       @eventCloseProfile="eventCloseProfileView"/>

            </v-dialog>
        </template>
        <template v-else>
            <v-progress-linear indeterminate color="cyan"/>
        </template>
    </div>
</template>

<script>
import HeaderComponent from '../common/HeaderComponent';
import ProfileComponent from './../components/ProfileComponent';
import UserProfilesComponent from './../components/UserProfilesComponent';
import {mapState, mapMutations} from 'vuex';
import C from '../utils/constants'
import {TYPE_ROLE_USER} from '../utils/constant'
import processDataUserProfile from "../mixin/processDataUserProfile";
import activeNavBottom from "../mixin/activeNavBottom";

export default {
    mixins: [
        processDataUserProfile,
        activeNavBottom
    ],
    props: {
        typeHeader: String,
        funcGotoBack: {
            type: Function,
            defaultValue: null,
        }
    },
    data: function () {
        return {
            initFetchDataById: false,
            isShowProfileAlias: false,
            payload: {},
            fromRoute: '',
            userInfo: {},
            userInfoAlias: {},
            listUserOrCastData: []
        }
    },
    components: {
        HeaderComponent,
        ProfileComponent,
        UserProfilesComponent
    },
    mounted() {
        this.replaceStateBrowser();
    },
    methods: {
        ...mapMutations({
            setReferrerCode: 'setReferrerCode',
        }),
        replaceStateBrowser: function () {
            window.history.pushState("null", "user-profile", "/user-profile");
            document.title = "user-profile";
            return "";
        },
        redirectToByName: function (name) {
            if (name === "Home") {
                this.$store.dispatch('activeNavBottomDispatch', true);
            }

            this.$router.push({name});
        },
        eventCloseProfileView: function (name) {
            this.isShowProfileAlias = false
            this.redirectToByName("Home");
        },
        eventAsyncDataUserOrCast: async function () {
            if (!!this.initFetchDataById) {
                return;
            }

            let self = this;
            if (!Object.keys(self.userInfoAlias).length) {
                self.redirectToByName("Home");
                return;
            }

            let data = await self.initFetchUserORCastAsync(self.userInfoAlias.id);
            // Validate user or cast
            if (!_.has(data, "user.id")) {
                self.redirectToByName("Home");
            }

            self.userInfo = data.user;
            self.listUserOrCastData = data.suggestUserOrCast;
            // Init data for before use component UserProfilesComponent
            self.initProcessDataUserProfile({userOrCastId: data.user.id, fetchDataBeforeById: data.user, options: {role: {...data.dataRole}}})
            self.initFetchDataById = true // Ready
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
            isFetchDataFinish: state => state.user.isFetchDataFinish,
            fetchDataViewProfile: state => state.user.fetchDataViewProfile,
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        typeAction: function () {
            if (this.isSessionUserLogin) {
                return "SHOW_PROFILE_ME";
            } else {
                return "SHOW_PROFILE_OTHER"
            }
        },
        isSessionUserLogin: function () {
            return this.user && !!this.user.referer_code && `${this.user.referer_code}` === `${this.$route.params.alias}`
        },
        checkSessionLoginNotExist: function () {
            return !this.user || !this.user.id
        },
        checkActionShowProfile: function () {
            return this.isShowProfileAlias && !!Object.keys(this.fetchDataViewProfile).length
        },
        checkHasData: function () {
            return !!Object.keys(this.fetchDataViewProfile).length
        },
    },
    watch: {
        isFetchDataFinish: function (after, before) {
            if (!!after && !Object.keys(this.fetchDataViewProfile).length) {
                // Not found data for view profile
                this.redirectToByName("Home");
            } else {
                this.isShowProfileAlias= true
                this.eventAsyncDataUserOrCast()
            }
        },
        fetchDataViewProfile: function (after, before) {
            if (Object.keys(after).length) {
                this.userInfoAlias = after
            }
        }
    },
    beforeMount() {
        let paramsRole = this.$route.params.role.toLowerCase();
        let accessRole = ""
        if (paramsRole === TYPE_ROLE_USER.TYPE_USER) {
            accessRole = TYPE_ROLE_USER.TYPE_USER
        }
        if (paramsRole === TYPE_ROLE_USER.TYPE_CAST) {
            accessRole = TYPE_ROLE_USER.TYPE_CAST
        }

        // Validate session
        if (this.checkSessionLoginNotExist) {
            this.redirectToByName("Login");
            return;
        }

        // Validate url
        if (!this.$route.params.alias || !paramsRole.length) {
            this.redirectToByName("Home");
            return;
        }

        this.$store.dispatch("fetchUserInfoByAliasDispatch", {
            alias: this.$route.params.alias,
            accessRole: paramsRole.toLowerCase()
        });

        this.$store.dispatch("fetchFollowedUserOrCastByIdDispatch", {})
    },
    beforeCreate() {
        this.$store.commit("isFetchDataFinishMutation", false)
        this.$store.commit("fetchDataViewProfileMutation", {});
    },
    created() {
        const referrerCode = this.$route.query.ref;
        if(referrerCode) {
            this.setReferrerCode(referrerCode);
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fromRoute = from
        })
    },
    beforeRouteLeave(to, from, next) {
        this.checkActionNavBottom();
        next();
    },
    destroyed() {
        this.isShowProfileAlias = false;
        this.userInfo = {}
        this.userInfoAlias = {}
        this.listUserOrCastData = {}
        this.$store.commit("isFetchDataFinishMutation", false)
        this.$store.commit("fetchDataViewProfileMutation", {});
        this.$store.commit("feedDetailMutations", {})
    }
}
</script>
