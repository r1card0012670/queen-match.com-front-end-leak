<template>
    <div :class="[`display-rank standard display-rank-extra-small`, classList, className]">
        <div v-if="getNameClass">{{ getNameClass }}</div>
    </div>
</template>

<script>

import C from "../utils/constants";

export default {
    props: {
        funcShowDetail: {
            type: Function,
            defaultValue: null
        },
        classList: {
            type: String,
            defaultValue: ""
        },
        itemData: Object,
    },
    components: {
        C
    },
    computed: {
        constant: function () {
            return Object.assign({}, C)
        },
        getNameClass: function () {
            if (this.itemData && this.itemData.cast_type) {
                const castClass = this.listCastClass.find(ele => ele.id === `${this.itemData.cast_type}`);

                return castClass ? castClass.name : null;
            }
            if (this.itemData && this.itemData.user_type !== null) {
                const castClass = this.listUserClass.find(ele => ele.id === this.itemData.user_type);

                return castClass ? castClass.name : null;
            }

            return '';
        },
        className: function () {
          let class_name = '';
            if (this.itemData && this.itemData.cast_type) {
              if (this.itemData.cast_type === parseInt(this.constant.CAST_TYPE[1]['id'])) {
                class_name = "vip";
              } else if (this.itemData.cast_type === parseInt(this.constant.CAST_TYPE[2]['id'])) {
                class_name = "royal-vip";
              }
            }

            return class_name;
        },
        listCastClass: function () {
            return this.constant.CAST_TYPE;
        },
        listUserClass: function () {
            return this.constant.USER_TYPE;
        }
    },
    methods: {
        clickShowDetail: function (event) {
            if (typeof this.funcShowDetail === "function") {
                this.funcShowDetail(event)
            }
        },
    },
}
</script>

<style>
    .display-rank.vip div {
        background: linear-gradient(270deg, #FDC943 -8.11%, #D19F1F 71.62%) !important;
        color: white !important;
        padding: 5px 10px !important;
        border-radius: 4px;
    }
    .display-rank.royal-vip div {
        background: linear-gradient(270deg, #BA2222 -8.11%, #D85D65 71.62%) !important;
        color: white !important;
        padding: 5px 10px !important;
        border-radius: 4px;
    }
</style>
