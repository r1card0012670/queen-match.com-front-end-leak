<template>
    <div :class="[`d-dialog-class-cast p-0`]" v-if="isShowDialog">

        <v-bottom-sheet v-if="isShowDialog" v-model="showClassCastDialog" persistent
                        :content-class="`d-dialog-show-not-fullscreen d-dialog-footer`" max-width="440">

            <v-card :class="[`d-class-cast`, 'd-border-radius-top-15']" :id="`dialog-class-cast`">
                <v-card-title :id="'d-card-title-class-cast'"
                              :class="[`headline d-header-box-class-cast p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <v-btn icon dark v-on:click="clickCallbackEventDataClose">
                            <v-icon class="mr-2 pt-1">close</v-icon>
                        </v-btn>
                        <v-card-title :class="`p-0`">{{ btnTitle }}</v-card-title>

                        <div class="info-bar d-title-class-cast pr-5 btn" v-if="titleName">
                            {{ titleName }}
                        </div>
                        <v-btn class="info-bar d-act-title-class-cast pr-0 button-choice" color="green darken-1" text
                               @click="clickCallbackEventData">
                            設定
                        </v-btn>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-class-detail'">
                    <v-checkbox v-for="item in constant.CAST_TYPE" :key="item.id" v-model="vModelData"
                                :label="item.name" :value="item" :class="`form-check`"></v-checkbox>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>
import C from "../../utils/constants";

export default {
    data: function () {
        return {
            vModelData: [],
        }
    },
    model: {
        event: 'change',
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
            type: Array,
            defaultValue: ""
        },
        value: {
            type: Array,
            defaultValue: [],
        }
    },
    components: {},
    computed: {
        constant: function () {
            return Object.assign({}, C)
        },
        showClassCastDialog: function () {
            return !!this.isShowDialog
        },
    },
    methods: {
        clickCallbackEventDataClose: function () {
            this.funcCallbackEventData(false)
        },
        clickCallbackEventData: function () {
            this.funcCallbackEventData(false);
            this.funcEmitData();
        },
        funcEmitData: function () {
            this.$emit('change', this.vModelData);
        }
    },
    created() {
        this.vModelData = this.value;
    }
}
</script>
