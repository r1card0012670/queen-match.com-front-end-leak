<template>
    <v-overlay :absolute="false" :value="isShowNotice" class="d-overlay-full">
        <v-card-text :class="[`p-5`, `d-box-show-info`, className]">
            <slot name="cbody"></slot>
            <slot name="cfoter"></slot>

            <v-btn v-if="isShowClose" color="success" @click="clickClose">
                {{ hideOverlay }}
            </v-btn>
        </v-card-text>
    </v-overlay>
</template>

<script>

export default {
    data() {
        return {}
    },
    model: {
        event: ["closeNotice"]
    },
    props: {
        absolute: {
            type: Boolean,
            default: false,
            require: false
        },
        isShowNotice: {
            type: Boolean,
            require: false
        },
        isShowClose: {
            type: Boolean,
            default: true,
            require: false
        },
        hideOverlay: {
            type: String,
            default: "Close",
            require: false
        },
        className: {
            type: String,
            default: "",
            require: false
        },
    },
    mounted() {
        // Keypresses on overlay:
        document.addEventListener('keydown', this.onKeydown)
    },
    created() {
    },
    methods: {
        clickClose() {
            this.$emit("closeNotice", true)
        },
        onKeydown(e) {
            if (this.isShowNotice) {
                if (e.keyCode == 27) {
                    this.clickClose()
                } else if (e.keyCode == 39) {
                    console.log('RIGHT')
                }
            }
        },
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.onKeydown)
    },
}
</script>
