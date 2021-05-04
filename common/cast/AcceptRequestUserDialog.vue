<template>
    <div :class="[`d-dialog-accept-request-user p-0`, classList]" v-if="isShowDialog">

        <v-bottom-sheet v-if="isShowDialog" v-model="showAcceptRequestUserDialog" persistent
                        :content-class="`d-dialog-show-not-fullscreen d-dialog-footer`" max-width="375">

            <v-card :class="[`d-accept-request-user d-dialog-footer`, 'd-border-radius-top-15']"
                    :id="`dialog-accept-request-user`">
                <v-card-title :id="'d-card-title-accept-request-user'"
                              :class="[`headline d-header-box-accept-request-user p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-start d-custom-header p-2 d-width-100">
                        <button class="d-flex pl-0 pr-3" @click="clickCallbackEventDataClose">
                            <v-img contain src="../../images/times.svg"/>
                        </button>
                        <v-card-title :class="`p-0`">{{ btnTitle }}</v-card-title>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-local-cast'" class="d-card-apply">
                    <v-col class="p-0">
                        <div class="text-left">
                            {{ itemRequestUser.timeAndAddress }}
                        </div>
                        <p class="text-left pt-1">{{ itemRequestUser.tags }}</p>
                    </v-col>
                    <v-col class="p-0 m-0 mt-3 mb-3">
                        <div class="d-inline-flex justify-content-between col-12 p-0">
                            <div class="d-flex flex-column justify-center align-items-center flex-grow-1 border-right">
                                <label class="mb-0">{{ itemRequestUser.totalTime }}</label>
                                <p class="mb-0">合計時間</p>
                            </div>
                            <div class="d-flex flex-column justify-center align-items-center flex-grow-1 border-right">
                                <label class="mb-0">{{ itemRequestUser.midnightChargeIncluded }}</label>
                                <p class="mb-0">獲得ポイント</p>
                            </div>
                            <div class="d-flex flex-column justify-center align-items-center flex-grow-1">
                                <label clas="mb-0">{{ itemRequestUser.numPerson }}</label>
                                <p class="mb-0">募集人数</p>
                            </div>
                        </div>
                    </v-col>

                    <v-card class="text-left mt-8">
                        <!--                        <p>例）10分くらい遅れちゃうんですが、参加したいです！（自由記述）</p>-->
                        <v-textarea v-model="note"></v-textarea>
                    </v-card>
                    <div class="text-danger font-weight-bold">
                        {{ errors }}
                    </div>

                    <div class="d-act-accept-request-user mt-4">
                        <v-btn outlined block @click="clickEventData" class="btn-base">応募する</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
        <loading :active.sync="visible"></loading>
    </div>
</template>

<script>
import {mapActions} from 'vuex';
import Loading from 'vue-loading-overlay';

export default {
    data: function () {
        return {
            isCallAcceptRequest: true, // Todo call check api
            note: '',
            visible: false,
            errors: '',
        }
    },
    props: {
        btnTitle: {
            type: String,
            defaultValue: ""
        },
        classList: {
            type: String,
            defaultValue: ""
        },
        isShowDialog: {
            type: Boolean,
            required: true
        },
        funcCallbackEventData: {
            type: Function,
            required: true
        },
        itemRequestUser: {
            type: Object,
            defaultValue: {},
            required: true
        },
    },
    components: {
        Loading,
    },
    computed: {
        showAcceptRequestUserDialog: function () {
            return !!this.isShowDialog
        },
    },
    methods: {
        ...mapActions({
            applyOrder: 'applyOrder',
        }),
        clickCallbackEventDataClose: function () {
            this.funcCallbackEventData({isTypeAction: false})
        },
        clickEventData: async function () {
            // TODO
            // Accept request merge
            // Call api to server
            this.visible = true;
            const payload = {
                orderId: this.itemRequestUser.id,
                note: this.note,
            };

            await this.$store.dispatch('applyOrder', payload)
                .then(response => {
                    this.visible = false;
                    this.$emit('applied');
                    this.$nextTick(() => {
                        if (this.isCallAcceptRequest) {
                            this.funcCallbackEventData({isTypeAction: true});
                        }
                    });
                })
                .catch(error => {
                    this.visible = false;
                    this.errors = error.err.message;
                    // console.log(error);
                });
        },
    }
}
</script>
