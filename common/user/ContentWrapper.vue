<template>
    <div :class="className">
        <div v-if="!readMoreActivated" :class="`d-content-html-info`">{{ rawText.slice(0, 200) }}</div>

        <div :class="`read-more`">
            <a class="" v-if="!readMoreActivated" v-on:click="activateReadMore" href="#">
                {{ name }}
            </a>
        </div>
        <div :class="`d-content-html-info content-read-more`">
            <span v-if="readMoreActivated" v-html="rawText"></span>
        </div>
    </div>

</template>

<script>

export default {
    data: function () {
        return {
            name: "もっと見る",
        }
    },
    props: {
        rawText: {
            type: String,
            required: true
        },
        className: {
            type: String,
            defaultValue: ""
        },
        readMoreActivated: {
            type: Boolean,
            defaultValue: false
        },
        funcActivateReadMore: {
            type: Function,
            defaultValue: null
        },
    },
    methods: {
        activateReadMore: function (event) {
            event.preventDefault();

            if (typeof this.funcActivateReadMore === 'function') {
                this.funcActivateReadMore(true);
            }
        }
    }
}
</script>
