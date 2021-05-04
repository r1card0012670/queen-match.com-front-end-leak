<template>
    <div class="d-flex">
        <div class="text-center">
            <v-chip v-for="(item, index) in dataHashTags" :key="index" class="ma-2" @click="clickTag(item)">
                #{{ item.tag_name }}
            </v-chip>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        dataHashTags: {
            type: Array,
            required: true
        },
        actionType: {
            type: String,
            required: false,
            defaultValue: ""
        }
    },
    computed: {},
    mounted() {
    },
    methods: {
        clickTag: function (item) {
            if (!this.actionType) {
                return;
            }
            // Search Feed
            if (this.actionType === "feed") {
                this.$store.dispatch('showFeedSearchDialogDispatch', {isShow: true, tags: [item]});
            }
        }
    }
}
</script>
