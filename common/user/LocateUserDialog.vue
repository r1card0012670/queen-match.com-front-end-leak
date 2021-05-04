<template>
    <div :class="[`d-dialog-locate-cast p-0`]">
        <v-bottom-sheet v-model="showLocateDialog" persistent scrollable
                        :content-class="`d-dialog-show-not-fullscreen d-dialog-footer`" max-width="440">
            <v-card :class="[`d-locate-cast`, 'd-border-radius-top-15']" :id="`dialog-locate-cast`" height="50vh">
                <v-card-title :id="'d-card-title-locate-cast'"
                              :class="[`headline d-header-box-locate-cast p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <v-btn icon dark @click="closeDialog">
                            <v-icon class="mr-2 pt-1">close</v-icon>
                        </v-btn>
                        <v-card-title :class="`p-0`">{{ btnTitle }}</v-card-title>
                        <div class="info-bar d-title-local-cast pr-5 btn" v-if="titleName">
                            {{ titleName }}
                        </div>
                        <v-btn class="info-bar d-act-title-local-cast pr-0 button-choice" color="green darken-1" text
                               @click="emitData">
                            設定
                        </v-btn>
                    </div>
                </v-card-title>
                <v-card-text :id="'d-card-text-local-cast'" class="d-card-text-local-cast">
                    <v-radio-group v-model="location" :class="`mt-0 pt-0`">
                        <v-radio v-for="item in locations" :key="item.id"
                                 :class="`form-check`"
                                 :label="`${item.value}`"
                                 :value="item"></v-radio>
                    </v-radio-group>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>
import C from "../../utils/constants";
import {mapState} from 'vuex';

export default {
    data: function () {
        return {
            location: {},
            showLocateDialog: true,
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
        selected: {
            type: Object,
            defaultValue: {},
        }
    },
    mounted: function () {
        if (this.value && _.has(this.value, "id")) {
            this.location = this.value.id
        }
    },
    computed: {
        ...mapState({
            getInfoManagement: state => state.info.getInfoManagement,
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        locations: function () {
            return this.getInfoManagement.filter(x => x.key === 'residence');
        }
    },
    methods: {
        closeDialog() {
            this.showLocateDialog = false;
            this.$emit('close-dialog');
        },
        emitData() {
            this.showLocateDialog = false;
            this.$emit('change', this.location);
        }
    },
    created() {
        this.location = this.selected;
        if (!this.getInfoManagement.length) {
            this.$store.dispatch('getInfoManagementDispatch', {});
        }
    }
}
</script>

<style lang="scss" scoped>
.d-card-text-local-cast {
    max-height: calc(100vh - 100px);
    overflow: auto;
}
</style>
