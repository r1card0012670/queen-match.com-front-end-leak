import {mapGetters, mapState} from "vuex";
import {userService} from "../_services";
import appUtility from "../utils/app-utility.js";
import {TYPE_ROLE_USER} from "../utils/constant";

export default {
    data: function () {
        return {}
    },
    methods: {
        initProcessDataUserProfile: function (payload) {
            this.$store.commit('isFetchDataFinishMutation', false);
            this.$store.dispatch("fetchDataUserOrCastByIdDispatch", Object.assign({}, payload, {
                id: payload.userOrCastId
            }))
        },
        processDataProfile: function () {
            this.$store.dispatch("fetchDataUserOrCastByIdDispatch", Object.assign({}, {
                id: this.user.id
            }))
        },
        initFetchUserORCastAsync: async function (id) {
            return userService.getById(id).then(async res => {
                let covert = await appUtility.funcRenderDataItemUserClone(res.data);
                // TODO
                return covert;
            }).then(async user => {
                let renderData = await appUtility.renderRole(user)
                let payloadForFetch = await appUtility.renderDataCast({user, ...renderData});
                payloadForFetch.isNotFetch = this.isSessionCast && _.indexOf(renderData.roles, TYPE_ROLE_USER.TYPE_CAST) !== -1 || user.id === this.user.id;
                payloadForFetch.params.cast_id = user.id;

                let suggestUserOrCast = await userService.fetchListUserOrCast(payloadForFetch)

                return {user, suggestUserOrCast, dataRole: renderData}
            }).catch(err => ({}))
        },
    },
    mounted() {

    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
            role: state => state.user.role,
        }),
        ...mapGetters({
            // customScrollContentHeight: "customScrollContentHeight",
        }),
        isSessionCast: function () {
            return this.role === TYPE_ROLE_USER.TYPE_CAST
        },
    },
    created() {
        let self = this;
    }
}
