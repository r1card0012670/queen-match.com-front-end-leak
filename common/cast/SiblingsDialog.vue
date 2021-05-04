<template>
    <div :class="[`d-dialog-locate-cast p-0`]" v-if="isShowDialog">

        <v-bottom-sheet v-if="isShowDialog" v-model="showSiblingsDialog" persistent scrollable
                        :content-class="`d-dialog-show-not-fullscreen d-dialog-footer`" max-width="440">

            <v-card :class="[`d-locate-cast`, 'd-border-radius-top-15']" :id="`dialog-locate-cast`" height="50vh">
                <v-card-title :id="'d-card-title-locate-cast'"
                              :class="[`headline d-header-box-locate-cast p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <v-btn icon dark v-on:click="clickCallbackEventDataClose">
                            <v-icon class="mr-2 pt-1">close</v-icon>
                        </v-btn>
                        <v-card-title :class="`p-0`">兄弟姉妹</v-card-title>

                        <div class="info-bar d-title-local-cast pr-5 btn" v-if="titleName">
                            {{ titleName }}
                        </div>
                        <v-btn class="info-bar d-act-title-local-cast pr-0 button-choice" color="green darken-1" text @click="clickCallbackEventData">
                            設定
                        </v-btn>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-local-cast'">
                    <v-radio-group v-model="vModelDataRadio" :class="`mt-0 pt-0`">
                        <v-radio v-for="(item, index) in siblingsItems" :key="index" selected :class="`form-check`"
                                 :label="`${item.value}`"
                                 :value="item.id"></v-radio>
                    </v-radio-group>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>

    import {mapGetters, mapState} from 'vuex';
    import C from "../../utils/constants";

    export default {
        data: function () {
            return {
                vModelDataRadio: "",
            }
        },
        model: {
            event: 'change'
        },
        props: {
            btnTitle: {
                type: String,
                defaultValue: ""
            },
            titleName: {
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
            vModel: {
                type: Object,
                defaultValue: ""
            },
            siblingsItems: {
                type: Array,
                defaultValue: []
            },
            value: {
                type: Object,
                required: false
            }
        },
        mounted: function () {
            if (this.value && _.has(this.value, "id")) {
                this.vModelDataRadio = this.value.id
            }
        },
        computed: {
            ...mapState({
                // Format [stageName] => state.[modulesName].[stageName],
                user: state => state.user.user,
            }),
            ...mapGetters({
            }),
            constant: function () {
                return Object.assign({}, C)
            },
            showSiblingsDialog: function () {
                return !!this.isShowDialog
            },
        },
        methods: {
            clickCallbackEventDataClose: function () {
                this.funcCallbackEventData({isTypeAction: false})
            },
            clickCallbackEventData: function () {
                //this.funcEmitData();
                this.updateUser({user_id: this.user.id, siblings: this.vModelDataRadio});

                // Emit data before use method callback
                this.$nextTick(() => {
                    this.funcCallbackEventData({isTypeAction: true})
                });
            },
            updateUser: function (data) {
                this.$store.dispatch('updateCurrentUserDispatch', data);
            },
        },
        created() {
        }
    }
</script>
