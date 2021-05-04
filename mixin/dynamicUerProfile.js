import {mapGetters, mapState} from "vuex";

export default {
    methods: {
        funcVisibility: function (userID, typeAction) {
            this.$store.dispatch('isVisibilityMyProfileDispatch', true)
        },
        funcBack: function (userID, typeAction) {
            this.$emit("eventCloseProfile", true)
        },
        funcOpen: function (userID) {
            let findIndex = this.itemDialogUserProfiles.findIndex(ele => _.has(ele, "id") && ele.id === userID);
            return findIndex !== -1
        },
        copyToClipboardByString: function (stringCopy) {
            let el = document.createElement('textarea');
            el.value = stringCopy;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
    },
    model: {
        event: ["eventCloseProfile"]
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            itemDialogUserProfiles: state => state.user.itemDialogUserProfiles,
        }),
        ...mapGetters({}),

    },
    created() {
        let self = this;
    }
}
