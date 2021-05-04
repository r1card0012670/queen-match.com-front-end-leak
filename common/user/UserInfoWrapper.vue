<template>
    <div :class="[`item p-0`, className]">
        <div class="item-inner">
            <div class="d-item p-1 pl-0 pr-0">
                <div class="label d-flex justify-content-between">
                    <span class="d-small d-fw400">{{ dataInfo.name }}</span>
                    <span class="d-fw400">
                        <div class="income-wrapper">
                            <div>{{ dataInfo.content }}</div>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

export default {
    data: function () {
        return {}
    },
    props: {
        dataInfo: {
            type: Object,
            required: true
        },
        className: {
            type: String,
            defaultValue: ""
        },
    },
    methods: {}
}
</script>
