<template>
    <div :class="`app-content-login-box`">
        <LineEmailRegisterDialog :isDialogFull="isRegisterEmailLine"/>
        <span v-if="error" style="color: #dc3545; font-size: 80%;">{{ error }}</span>
    </div>
</template>

<script>
import queryString from "querystring";
import LineEmailRegisterDialog from "./../common/user/LineEmailRegisterDialog";
import {mapGetters, mapState} from "vuex";


export default {
    props: {},
    data: function () {
        return {
            error: '',
            clientId: "",
            clientSecret: "",
            callbackUri: "",
            code: ""
        }
    },
    components: {LineEmailRegisterDialog},
    mounted() {
    },
    watch: {
        code: function (to, from) {
            this.$nextTick(() => {
                this.$store.dispatch('loginWithLineDispatch', {code: to});
            })
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            isRegisterEmailLine: state => state.user.isRegisterEmailLine,
        }),
        ...mapGetters({
            isRegisterEmailLine: "isRegisterEmailLine",
        }),
    },
    async created() {
        const {code} = queryString.parse(window.location.search.replace('?', ''))

        if (!code) {
            this.$router.push("/login");
            return;
        }

        this.code = code
    },
    methods: {}
}
</script>
