<template>
    <v-col :class="[`d-box-cast-price p-0`]">
        <div class="d-box-price label d-flex justify-content-between">
            <span class="d-small d-fw400"> 30分あたりの料金 </span>
            <span class="d-fw400">
                <div class="income-wrapper">
                    <div> {{ numberWithFormat(userInfo.price_point) }} </div>
                </div>
            </span>
        </div>
    </v-col>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import appUtility from "../../utils/app-utility";

export default {
    props: {
        userId: {
            type: String,
            required: true
        },
        userInfo: {
            type: Object,
            required: true
        },
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // itemUsers: state => state.user.itemUsers,
            getCoupon: state => state.home.getCoupon,
            discount: state => state.book.discount,
            // currentType: state => state.main.currentType
        }),
        ...mapGetters({
            // itemUsers: "itemUsers",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
    },
    methods: {
        getPrice: function () {
            let price = this.userInfo.price_point;
            if (this.getCoupon && this.discount) {
                price = price - this.discount;
            }

            return price > 0 ? price : 0;
        },
        numberWithFormat: function(value) {
            return value ? appUtility.formatPriceToFixed(value) : 0 + "P";
        },
    }
}
</script>
