<template>
    <div :class="[`d-dialog-confirm-card p-0`]" v-if="showCreateCardDialog">

        <v-dialog v-if="isShowDialog" v-model="showCreateCardDialog"
                  :content-class="`d-confirm-card-wrapper`"
                  @keydown.esc=clickCallbackEventClose
                  max-width="440" transition="dialog-bottom-transition" scrollable
                  @click:outside="clickCallbackEventClose">

            <v-card :class="[`bg-grey`]" :id="`dialog-confirm-card`">
                <v-card-title :id="'d-card-title-confirm-card'"
                              :class="[`headline d-header-box-confirm-card`, 'd-flex justify-content-start', 'd-bottom-line']">
                    <button v-on:click="clickCallbackEventClose">
                        <v-img contain src="../../images/times.svg"/>
                    </button>
                    <div class="pl-2 d-title">{{ btnTitle }}</div>
                </v-card-title>

                <v-card-text :id="'d-card-text-confirm-card'" class="bg-grey mb-80">
                    <v-card-text class="p-0 p-0 pr-0 pl-0 mt-2">
                        <v-col cols="12" class="p-0 mt-9">
                            <div class="dialog-confirm-card-list-icon d-width-100">
                                <v-img contain src="../../images/GR-list-icon-card.svg"/>
                            </div>
                        </v-col>
                        <v-col cols="12" class="p-0 text-center mt-6">
                            <p class="p-0 m-0">この機能を利用出来るため、</p>
                            <p class="p-0 m-0">クレジットカードを連携してください</p>
                        </v-col>
                        <v-btn class="btn-base p-0 mt-6" block @click="confirmAddPayment">クレジットカードを連携する</v-btn>
                        <v-btn class="p-0 text-center mt-3" plain text block @click="clickCallbackEventClose">後で</v-btn>
                    </v-card-text>
                </v-card-text>

            </v-card>
        </v-dialog>
    </div>
</template>
<script>

// Import component
import 'vue-loading-overlay/dist/vue-loading.css';
import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";

export default {
    data: function () {
        return {
            canCancel: false,
            isCloseTimePlan: false,
            createCardFailed: false
        }
    },
    props: {
        isShowDialog: {
            type: Boolean,
            required: true
        },
        funcEventClose: {
            type: Function,
            required: true
        }
    },
    model: {
        event: 'confirmAddPayment'
    },
    components: {},
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            addPaymentFailure: state => state.payment.addPaymentFailure,
            user: state => state.user.user
        }),
        ...mapGetters({
            addPaymentFailure: "addPaymentFailure",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        btnTitle: function () {
            return "お支払い情報を登録する"
        },
        titleName: function () {
            return ""
        },
        showCreateCardDialog: function () {
            return !!this.isShowDialog
        },
    },
    methods: {
        clickCallbackEventClose: function () {
            this.funcEventClose(false);
        },
        confirmAddPayment: function () {
            this.$emit("confirmAddPayment", true);
        },
    },
    destroyed() {
    }
}
</script>

<style lang="scss">
.d-bottom-line {
    padding: 16px;
    font-weight: 500;
    font-size: 1rem;
    text-align: right;
    letter-spacing: 0.15px;
    color: #0D0906;
    border-bottom: 2px solid #e2e2e2;
}
</style>
