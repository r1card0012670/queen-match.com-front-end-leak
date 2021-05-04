<template>
    <div :class="[`d-box-labels p-0`]">
        <div class="d-flex justify-space-between">
            <div class="v-sheet font-weight-bold d-line-title"> {{ label }}</div>
            <div v-if="col2" class="v-sheet">justify-space-between</div>
            <div v-if="col3" class="d-inline-flex v-sheet d-line-no-plan">
                <LoginTimeMarkComponent :nameStatus="`予定なし`" :typeStatus="`no-plan`"/>
            </div>
        </div>
    </div>
</template>

<script>
import LoginTimeMarkComponent from "./LoginTimeMarkComponent";

export default {
    props: {
        className: {
            type: String,
            defaultValue: ""
        },
        label: {
            type: String,
            required: true
        },
        col2: {
            // TODO
            type: Boolean,
            defaultValue: false
        },
        col3: {
            // TODO
            type: Boolean,
            defaultValue: false
        },

    },
    computed: {},
    components: {
        LoginTimeMarkComponent,
    },
    mounted() {
    }
}
</script>
