import {mapGetters, mapState} from "vuex";

export default {
    methods: {
        routerDefined: function () {
            return this.$router.options.routes;
        },
        routerDefinedActive: function () {
            return this.routerDefined().filter(ele => ele.hasOwnProperty('meta') && ele.meta.hasOwnProperty("activeBottom") && ele.meta.activeBottom)
                .map(item => `${item.path}`.toLowerCase());
        },
        checkActionNavBottom: function () {
            let self = this;
            let currentRoute = self.$router.currentRoute;
            let itemsActives = self.routerDefinedActive();

            let bootActive = currentRoute && itemsActives.indexOf(currentRoute.path.toLowerCase()) !== -1;
            this.$store.dispatch('activeNavBottomDispatch', bootActive);
        }
    },
    mounted() {

    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => user.user
        }),
        ...mapGetters({}),
        sessionUserId: function () {
            return this.user.id
        }
    },
    created() {
        let self = this;
    }
}
