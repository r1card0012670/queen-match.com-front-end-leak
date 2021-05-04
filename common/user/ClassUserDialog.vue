<template>
    <div :class="[`d-dialog-class-cast p-0`]" v-if="">
        <v-bottom-sheet v-model="showClassDialog" persistent
                        :content-class="`d-dialog-show-not-fullscreen d-dialog-footer`" max-width="440">
            <v-card :class="[`d-class-cast`, 'd-border-radius-top-15']" :id="`dialog-class-cast`">
                <v-card-title :id="'d-card-title-class-cast'"
                              :class="[`headline d-header-box-class-cast p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <v-btn icon dark v-on:click="closeDialog">
                            <v-icon class="mr-2 pt-1">close</v-icon>
                        </v-btn>
                        <v-card-title :class="`p-0`">{{ btnTitle }}</v-card-title>

                        <div class="info-bar d-title-class-cast pr-5 btn" v-if="titleName">
                            {{ titleName }}
                        </div>
                        <v-btn class="info-bar d-act-title-class-cast pr-0 button-choice" color="green darken-1" text
                               @click="emitData">
                            設定
                        </v-btn>
                    </div>
                </v-card-title>
                <v-card-text :id="'d-card-text-class-detail'">
                    <v-checkbox v-for="item in constant.USER_TYPE" :key="item.id" v-model="classes"
                                :label="item.name" :value="item" :class="`form-check`"></v-checkbox>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>
import C from "../../utils/constants";
import {mapGetters, mapActions} from 'vuex';

export default {
    props: {
        btnTitle: {
            type: String,
            defaultValue: ""
        },
        selected: {
            type: Array,
            defaultValue: [],
        },
        titleName: {
            type: String,
            defaultValue: ""
        },
    },
    data: function () {
        return {
            classes: [],
            showClassDialog: true,
        }
    },
    computed: {
        ...mapGetters({
            groupTags: 'groupTags',
        }),
        constant: function () {
            return Object.assign({}, C)
        },
    },
    methods: {
        ...mapActions({
            getGroupTags: 'getGroupTags',
        }),
        closeDialog() {
            this.showClassDialog = false;
            this.$emit('close-dialog');
        },
        emitData: function () {
            this.showClassDialog = false;
            this.$emit('change', this.classes);
        }
    },
    created() {
        this.classes = this.selected;
        if (!this.groupTags.length) {
            this.$store.dispatch('getGroupTags', {type: this.constant.TAG_TYPE.user});
        }
    }
}
</script>
