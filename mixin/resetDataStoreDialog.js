import {mapGetters, mapState} from "vuex";

export default {
    methods: {
        initResetDataStoreDialog: function () {
            this.$store.dispatch('initResetDataStoreDialogBookDispatch', {});
            this.$store.dispatch('initResetDataStoreDialogCastDispatch', {});
            this.$store.dispatch('initResetDataStoreDialogChatDispatch', {});
            this.$store.dispatch('initResetDataStoreDialogFeedDispatch', {});
            this.$store.dispatch('initResetDataStoreDialogMainDispatch', {});
            this.$store.dispatch('initResetDataStoreDialogPaymentDispatch', {});
            this.$store.dispatch('initResetDataStoreDialogUserDispatch', {});
            this.$store.dispatch('initResetDataStoreDialogNotifyDispatch', {});

            // TODO reset data in the store
        },
    },
    mounted() {
        let self = this;
        this.initResetDataStoreDialog();
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // customScrollContentHeight: state => state.main.customScrollContentHeight,
        }),
        ...mapGetters({
            // customScrollContentHeight: "customScrollContentHeight",
        })
    },
    created() {
        let self = this;
    }
}
