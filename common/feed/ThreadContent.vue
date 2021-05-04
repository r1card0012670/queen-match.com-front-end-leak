<template>
    <div :class="[`d-thread-content-feed p-0`, typeClass]">
        <v-col :class="[`d-box-content-feed mt-0 p-0`]">
            <ThreadDetail v-for="(item, index) in dataListFeed" :classList="classList" :key="index"
                          :isPreventDefault="isPreventDefault"
                          :dataContent="item" :objUser="objUserOverWrite(item)"/>
        </v-col>
    </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import ThreadDetail from "./../feed/ThreadDetail";
import processFeed from "../../mixin/processFeed";
import {LIMIT_NUMBER_FEED_IN_USER_PROFILE} from "../../utils/constant";

export default {
    mixins: [
        processFeed
    ],
    data: function () {
        return {}
    },
    model: [
        "eventClickThread"
    ],
    props: {
        userId: {
            type: String,
            required: true
        },
        classList: {
            type: String,
            defaultValue: ""
        },
        limitFetch: {
            type: Number,
            required: false
        },
        type: {
            type: String,
            defaultValue: ""
        },
        isPreventDefault: {
            type: Boolean,
            required: false
        },
        keyData: {
            type: String,
            required: false
        }
    },
    components: {
        ThreadDetail
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // itemUsers: state => state.user.itemUsers,
            feedDetail: state => state.feed.feedDetail
        }),
        ...mapGetters({
            feedDetail: "feedDetail",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        typeClass: function () {
            if (!this.type) {
                return ''
            }
            switch (this.type) {
                case "event-act-from-user-profile":
                    return `d-${this.type}`
            }
        },
        dataListFeed: function () {
            let self = this;
            let list = self.filterDataContentCurrentSession(+self.userId);

            let chuckData = _.chunk(list, LIMIT_NUMBER_FEED_IN_USER_PROFILE);

            return chuckData[0];
        }
    },
    methods: {}
}
</script>
