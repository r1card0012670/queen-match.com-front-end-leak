<template>
    <div :class="['login-time-mark-wrapper', className]">
        <div :class="[`login-time-mark`, typeStatus]"></div>
        <div :class="{'d-name-status': nameStatus === 'オフライン'}" v-if="nameStatus">{{nameStatus}}</div>
    </div>
</template>

<script>


export default {
    props: {
        typeStatus: {
            type: String,
            defaultValue: ''
        },
        nameStatus: {
            type: String,
            defaultValue: ''
        },
        className: {
            type: String,
            defaultValue: ''
        }
    },
}
</script>
<style lang="scss" scoped>
    .d-name-status{
        width: 75px !important;
    }
</style>
