<template>
    <v-card-text :class="[`d-time-plan-cast p-0 no-bg d-step-book d-step-book-4 pb-15 mb-4`]">
        <div :class="[`${classNameBox}d-book-wrapper`]">
            <div :class="[`${classNameBox}d-book-body`, 'p-2']">
                <v-col class="col-12 p-0 font-weight-bold d-title-block-book">初回利用の方へ</v-col>

                <v-col class="col-12 p-0 mt-1">
                    <div class="p-0 flex-wrap">
                        <span class="mb-2"> <small> キャストを呼ぶ際の注意事項をご確認ください</small> </span>
                    </div>
                </v-col>

                <v-card class="d-flex m-0 mt-5 justify-content-between m-0 d-step-book-note" role="button">
                    <v-list-item-avatar class="p-0 pr-1 m-0 mr-1">
                        <IconSvgComponent :type="'booking-clock'"/>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-subtitle>
                            <div>拡散するまでは自動延長</div>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-card>
                <p>キャストと合流している時間は、設定時間が過ぎても自動的に延長となります。延長料金は1名当たり15分毎に発生します。また延長はご本人様、ご友人様等がキャストと解 散するまで適用されます。</p>

                <v-card class="d-flex m-0 mt-6 justify-content-between m-0 d-step-book-note" role="button">
                    <v-list-item-avatar class="p-0 pr-1 m-0 mr-1">
                        <IconSvgComponent :type="'booking-text'"/>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-subtitle>
                            <div>キャンセルは有償</div>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-card>

                <p>予約後のキャンセルは、100％の優勝キャンセルとなりますので予めご了承ください。</p>

                <v-card class="d-flex m-0 mt-6 justify-content-between m-0 d-step-book-note" role="button">
                    <v-list-item-avatar class="p-0 pr-1 m-0 mr-1">
                        <IconSvgComponent :type="'booking-time'"/>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-subtitle>
                            <div>{{ renderTimeNightStart }}～{{ renderTimeNightEnd }}は深夜手当が発生</div>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-card>
                <p>ご利用時間が深夜{{ renderTimeNightStart }}～{{ renderTimeNightEnd }}を含む場合、キャスト1名当たり別途{{ renderPricePaymentNightEnd }}の深夜手当が発生します。タクシー代をキャストに渡す必要がございません。また、現金でのやり取りは禁止となっております。</p>

                <v-card class="d-flex m-0 mt-6 justify-content-between m-0 d-step-book-note" role="button">
                    <v-list-item-avatar class="p-0 pr-1 m-0 mr-1">
                        <IconSvgComponent :type="'booking-card'"/>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-subtitle>
                            <div>決済は3,000P毎にオートチャージ</div>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-card>
                <p>お支払いは、登録いただいたクレジットカードから自動的に3,000P（１P＝1.1円）単位でオートチャージされます。</p>

            </div>

            <div :class="[`${classNameBox}d-book-footer`]">
                <v-btn block outlined @click="clickStepTo5" class="btn-base"> 次に進む</v-btn>
            </div>
        </div>
    </v-card-text>
</template>

<script>

import IconSvgComponent from "../../common/IconSvgComponent";
import constantMain from "../../utils/constants";
import appUtility from "../../utils/app-utility";
import bookProcess from "../../mixin/bookProcess";
import {NEW_USER_COUPON_KEY} from "../../utils/constant";

export default {
    mixins: [
        bookProcess
    ],
    data: function () {
        return {}
    },
    props: {
        classList: {
            type: String,
            defaultValue: ""
        },
        classNameBox: {
            type: String,
            default: "",
            required: false
        }
    },
    components: {
        IconSvgComponent
    },
    computed: {
        constant: function () {
            return Object.assign({}, constantMain)
        },
        renderTimeNightStart: function () {
            return appUtility.dateFormat(`2021-02-15 ${this.constant.APP_NIGHT_CHARGE_TIME_START}`, "HH時mm分")
        },
        renderTimeNightEnd: function () {
            return appUtility.dateFormat(`2021-02-15 ${this.constant.APP_NIGHT_CHARGE_TIME_END}`, "HH時")
        },
    },
    methods: {
        clickStepTo5: function () {
            this.$store.dispatch("stepDispatch", 5)
        },
    },
    mounted() {
    },
    created: function () {
        let self = this;
    }
}
</script>
