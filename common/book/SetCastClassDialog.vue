<template>
    <div v-if="isShowDialog" :class="[`d-dialog-set-cast-class p-0`]">

        <v-bottom-sheet v-if="isShowDialog" v-model="showDataActionDialog"
                        :content-class="`d-dialog-show-not-fullscreen`" @keydown.esc="funcCallbackEventData"
                        max-width="440" persistent @click:outside="funcCallbackEventData">

            <v-card :id="`dialog-action-set-cast-class`"
                    :class="[`d-action-set-cast-class d-dialog-footer`, 'd-border-radius-top-15']">
                <v-card-title :id="'d-card-title-set-cast-class'"
                              :class="[`headline d-header-box-set-cast-class p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <button class="d-flex pl-2 pr-3" v-on:click="funcCallbackEventData">
                            <v-img src="../../images/times.svg"></v-img>
                        </button>
                        <v-card-title :class="`p-0`">{{ btnTitle }}</v-card-title>

                        <div v-if="titleName" class="info-bar d-title-set-cast-class pr-5 btn">
                            {{ titleName }}
                        </div>
                        <v-btn class="info-bar d-act-title-set-cast-class pr-0 button-choice text-brown"
                               color="green darken-1"
                               text @click="clickCallbackEventData">
                            保存
                        </v-btn>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-set-cast-class'" class="p-0 mt-0">
                    <v-col class="p-0">
                        <v-card
                            :class="['d-box-royal-vip d-card-text-set-cast-class-item p-0 m-0 mt-0', {'item-selected': checkSelected('royal_vip')}]"
                            role="button" @click="clickSelectMix('royal_vip')">
                            <div class="d-flex justify-content-between d-card-text-set-cast-class-title">
                                <div>{{ royalVip.name }}{{ royalVip.recommend || "" }}</div>
                                <div>{{ formatPriceToFixed(royalVipPrice) }}</div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="flex-wrap col-8 p-0"><small>キャストの中でも1%しかいない希少な最上級キャスト</small></div>
                                <div class="align-self-center p-0">/30分</div>
                            </div>
                        </v-card>

                        <v-card
                            :class="['d-box-vip d-card-text-set-cast-class-item p-0 m-0 mt-4', {'item-selected': checkSelected('vip')}]"
                            role="button" @click="clickSelectMix('vip')">
                            <div class="d-flex justify-content-between d-card-text-set-cast-class-title">
                                <div>{{ vip.name }}{{ vip.recommend || "" }}</div>
                                <div>{{ formatPriceToFixed(vipPrice) }}</div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="flex-wrap col-8 p-0"><small>厳選キャストの中でも10%しかいない特別なキャスト</small></div>
                                <div class="align-self-center p-0">/30分</div>
                            </div>
                        </v-card>

                        <v-card
                            :class="['d-box-mix-wrap d-card-text-set-cast-class-item p-0 m-0 mt-4', {'item-selected': checkSelected('mix')}]">
                            <v-expansion-panels focusable multiple :class="['d-box-mix p-0 m-0 mt-0']" v-model="panel">
                                <v-expansion-panel>
                                    <v-expansion-panel-header expand-icon="" @click="clickSelectMix('mix')"
                                                              :class="['d-flex flex-wrap', {'item-selected': checkSelected('mix')}]">

                                        <div class="d-flex justify-content-between d-card-text-set-cast-class-title">
                                            <div>{{ mix.name }} {{ sumTempNum() }}/{{ validateMaxNum }}人</div>
                                            <div>{{ formatPriceToFixed(mixPrice) }}</div>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="flex-wrap col-8 p-0"><small>お好みのクラスをご指定の人数で選択</small></div>
                                            <div class="align-self-center p-0">/30分</div>
                                        </div>
                                    </v-expansion-panel-header>

                                    <v-expansion-panel-content>
                                        <v-col
                                            class="d-mix-royal-vip d-flex justify-content-between pl-0 pr-0 align-items-center pt-3 pb-2">
                                            <div class="d-card-text-select-title">{{ royalVip.name }}</div>
                                            <div class="d-inline-flex d-card-text-select-person align-items-center">
                                                <v-btn outlined class="p-2 border" @click="changeNumRoyalVip(-1)">-
                                                </v-btn>
                                                <div>{{ mixNumRoyalVip }}</div>
                                                <v-btn outlined class="p-2 border" @click="changeNumRoyalVip(1)">+
                                                </v-btn>
                                            </div>
                                        </v-col>

                                        <v-col
                                            class="d-mix-vip d-flex justify-content-between pl-0 pr-0 align-items-center pt-2 pb-2">
                                            <div class="d-card-text-select-title">{{ vip.name }}</div>
                                            <div class="d-inline-flex d-card-text-select-person align-items-center">
                                                <v-btn outlined class="p-2 border" @click="changeNumVip(-1)">-</v-btn>
                                                <div>{{ mixNumVip }}</div>
                                                <v-btn outlined class="p-2 border" @click="changeNumVip(1)">+</v-btn>
                                            </div>
                                        </v-col>

                                        <v-col
                                            class="d-mix-standard d-flex justify-content-between pl-0 pr-0 align-items-center pt-2 pb-0">
                                            <div class="d-card-text-select-title">{{ standard.name }}</div>
                                            <div class="d-inline-flex d-card-text-select-person align-items-center">
                                                <v-btn outlined class="p-2 border" @click="changeNumStandard(-1)">-
                                                </v-btn>
                                                <div>{{ mixNumStandard }}</div>
                                                <v-btn outlined class="p-2 border" @click="changeNumStandard(1)">+
                                                </v-btn>
                                            </div>
                                        </v-col>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>

                        </v-card>

                        <v-card
                            :class="['d-box-standard d-card-text-set-cast-class-item p-0 m-0 mt-4', {'item-selected': checkSelected('standard')}]"
                            role="button" @click="clickSelectMix('standard')">
                            <div class="d-flex justify-content-between d-card-text-set-cast-class-title">
                                <div>{{ standard.name }}{{ standard.recommend || "" }}</div>
                                <div>{{ formatPriceToFixed(standardPrice) }}</div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="flex-wrap col-8 p-0"><small>合格率10%の面接を通過した厳選キャスト</small></div>
                                <div class="align-self-center p-0">/30分</div>
                            </div>
                        </v-card>
                    </v-col>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>

import C from "../../utils/constants";
import {mapState} from "vuex";
import appUtility from "../../utils/app-utility";

export default {
    data: function () {
        return {
            itemSelects: [],
            mixNumRoyalVip: 0,
            mixNumVip: 0,
            mixNumStandard: 0,
            objCastClassChosen: {},
            validateMaxNum: 0,
            tmpTotalNum: 0,
            totalPrice: 0,
            panel: [],
        }
    },
    model: {
        event: 'change'
    },
    props: {
        btnTitle: {
            type: String,
            defaultValue: ""
        },
        titleName: {
            type: String,
            defaultValue: ""
        },
        classList: {
            type: String,
            defaultValue: ""
        },
        isShowDialog: {
            type: Boolean,
            required: true
        },
        isDraft: {
            type: Boolean,
            required: true
        },
        funcCallbackEventData: {
            type: Function,
            required: true
        },
    },
    mounted: function () {
        //CAST_CLASS
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            step1: state => state.book.step1,
            tempStep1: state => state.book.tempStep1,
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        dataStep1: function () {
            if (this.isDraft) {
                return this.tempStep1;
            }
            return this.step1
        },
        listCastClass: function () {
            return this.constant.CAST_CLASS
        },
        showDataActionDialog: function () {
            return !!this.isShowDialog
        },
        keyCastClass: function () {
            return (this.listCastClass || []).map(ele => ele.id)
        },
        royalVip: function () {
            return this.listCastClass.find(ele => ele.id === 'royal_vip');
        },
        vip: function () {
            return this.listCastClass.find(ele => ele.id === 'vip');
        },
        mix: function () {
            return this.listCastClass.find(ele => ele.id === 'mix');
        },
        standard: function () {
            return this.listCastClass.find(ele => ele.id === 'standard');
        },
        royalVipPrice: function () {
            return this.royalVip.price * this.validateMaxNum;
        },
        vipPrice: function () {
            return this.vip.price * this.validateMaxNum;
        },
        mixPrice: function () {
            let prices = [this.royalVip.price * this.mixNumRoyalVip, this.vip.price * this.mixNumVip, this.standard.price * this.mixNumStandard];
            return prices.reduce((a, b) => a + b, 0)
        },
        standardPrice: function () {
            return this.standard.price * this.validateMaxNum;
        }
    },
    methods: {
        checkValidNumMix: function () {
            return [
                this.mixNumStandard,
                this.mixNumVip,
                this.mixNumRoyalVip,
            ].reduce((a, b) => a + b, 0) >= 1;
        },
        clickCallbackEventData: function () {
            // Validate
            let isMix = _.isObject(this.objCastClassChosen) && this.objCastClassChosen.id === "mix";
            if (isMix && !this.checkValidNumMix() || isMix && this.sumTempNum() < this.validateMaxNum) {
                return;
            }

            this.$store.dispatch("updateCastClassStep1Dispatch", {
                castClass: Object.assign({},
                    _.pick(this.objCastClassChosen, ['id', 'name', 'price', 'value']), {
                        id: this.objCastClassChosen.id, //Required
                        name: this.objCastClassChosen.name, // Required
                        ...isMix && {mixNumRoyalVip: this.mixNumRoyalVip},
                        ...isMix && {mixNumVip: this.mixNumVip},
                        ...isMix && {mixNumStandard: this.mixNumStandard},
                        totalPrice: this.totalPrice,
                    }),
                isDraft: this.isDraft
            });

            // Emit data before use method callback
            this.funcCallbackEventData({isTypeAction: true})
        },
        checkSelected: function (itemId) {
            return this.itemSelects.indexOf(itemId) !== -1
        },
        itemSelectMix: function () {
            if (this.mixNumRoyalVip > 0) {
                this.itemSelects.push("royal_vip")
            } else {
                this.itemSelects = this.itemSelects.filter(ele => ele !== 'royal_vip')
            }
            if (this.mixNumVip > 0) {
                this.itemSelects.push("vip")
            } else {
                this.itemSelects = this.itemSelects.filter(ele => ele !== 'vip')
            }
            if (this.mixNumStandard > 0) {
                this.itemSelects.push("standard")
            } else {
                this.itemSelects = this.itemSelects.filter(ele => ele !== 'standard')
            }
        },
        validMaxNumber: function (num, numChange) {
            return (num < 0 || this.validateMaxNum < (this.tmpTotalNum + numChange))
        },
        clickSelectMix: function (itemId) {
            let self = this;
            let findIndex = _.indexOf(this.keyCastClass, itemId)
            if (findIndex === -1) {
                return;
            }
            if (itemId !== 'mix') {
                this.panel = [] // Close expanded
            }

            let notSet = !(_.has(self.dataStep1, "castClass.mixNumRoyalVip") && self.dataStep1.castClass.mixNumRoyalVip
                || _.has(self.dataStep1, "castClass.mixNumVip") && self.dataStep1.castClass.mixNumVip
                || _.has(self.dataStep1, "castClass.mixNumStandard") && self.dataStep1.castClass.mixNumStandard);

            if (notSet && itemId === 'mix') {
                let divOn = Math.ceil(+this.dataStep1.numOfCastMember / 2);
                this.mixNumVip = divOn;
                this.mixNumStandard = +this.dataStep1.numOfCastMember - divOn;
            }
            this.sumTempNum();

            this.itemSelects = []
            this.itemSelects.push(itemId);
            this.objCastClassChosen = this.listCastClass.filter(ele => ele.id === itemId)[0];

            if (itemId === 'royal_vip') {
                this.totalPrice = this.royalVipPrice
            } else if (itemId === 'vip') {
                this.totalPrice = this.vipPrice
            } else if (itemId === 'mix') {
                this.totalPrice = this.mixPrice
            } else if (itemId === 'standard') {
                this.totalPrice = this.standardPrice
            }
        },
        changeNumRoyalVip: function (numChange) {
            let cloneNum = this.mixNumRoyalVip + numChange;
            if (this.validMaxNumber(cloneNum, numChange)) {
                return;
            }

            this.tmpTotalNum = this.tmpTotalNum + numChange;
            this.mixNumRoyalVip = cloneNum
            this.totalPrice = this.renderTotal()
        },
        changeNumVip: function (numChange) {
            let cloneNum = this.mixNumVip + numChange;
            if (this.validMaxNumber(cloneNum, numChange)) {
                return;
            }
            this.tmpTotalNum = this.tmpTotalNum + numChange;
            this.mixNumVip = cloneNum
            this.totalPrice = this.renderTotal()
        },
        changeNumStandard: function (numChange) {
            let cloneNum = this.mixNumStandard + numChange;
            if (this.validMaxNumber(cloneNum, numChange)) {
                return;
            }
            this.tmpTotalNum = this.tmpTotalNum + numChange;
            this.mixNumStandard = cloneNum
            this.totalPrice = this.renderTotal()
        },
        sumTempNum: function () {
            let self = this;
            let tmpTotalNum = [self.mixNumRoyalVip, self.mixNumVip, self.mixNumStandard].reduce((a, b) => a + b);
            self.tmpTotalNum = tmpTotalNum;

            return tmpTotalNum;
        },
        formatPriceToFixed: function (price) {
            return appUtility.formatPriceToFixed(price)
        },
        renderTotal: function () {
            return [this.royalVip.price * this.mixNumRoyalVip, this.vip.price * this.mixNumVip, this.standard.price * this.mixNumStandard]
                .reduce((a, b) => (a + b), 0);
        }
    },
    created() {
        let self = this;
        self.itemSelects = [];
        self.tmpTotalNum = 0;
        self.validateMaxNum = +self.dataStep1.numOfCastMember;
        let divOn = Math.ceil(+this.dataStep1.numOfCastMember / 2);
        // Reset

        if (_.has(self.dataStep1, "castClass.id")) {
            // Mix all type class
            if (self.dataStep1.castClass.id === 'mix') {

                self.mixNumRoyalVip = _.has(self.dataStep1, "castClass.mixNumRoyalVip") ? self.dataStep1.castClass.mixNumRoyalVip : 0
                self.mixNumVip = _.has(self.dataStep1, "castClass.mixNumVip") ? self.dataStep1.castClass.mixNumVip : 0
                self.mixNumStandard = _.has(self.dataStep1, "castClass.mixNumStandard") ? self.dataStep1.castClass.mixNumStandard : 0

                self.sumTempNum();

                if (self.tmpTotalNum > self.validateMaxNum) {
                    // let divOn = Math.ceil(+this.dataStep1.numOfCastMember / 2);
                    // // Reset
                    self.mixNumRoyalVip = 0;
                    self.mixNumVip = divOn;
                    self.mixNumStandard = (+self.dataStep1.numOfCastMember - divOn);

                    self.$store.dispatch("updateCastClassStep1Dispatch", {
                        castClass: {
                            id: self.dataStep1.castClass.id, //Required
                            name: self.dataStep1.castClass.name, // Required
                            mixNumRoyalVip: 0,
                            mixNumVip: self.mixNumVip,
                            mixNumStandard: self.mixNumStandard,
                            price: self.dataStep1.castClass.price,
                            value: self.dataStep1.castClass.value,
                            totalPrice: self.renderTotal()
                        },
                        isDraft: self.isDraft
                    });
                }

                self.panel.push(0); // Open expand
            } else {
                self.mixNumRoyalVip = 0;
                self.mixNumVip = divOn;
                self.mixNumStandard = (+self.dataStep1.numOfCastMember - divOn);
            }

            self.itemSelects.push(self.dataStep1.castClass.id)
            self.objCastClassChosen = self.dataStep1.castClass
        }
    },
    watch: {},
    destroyed() {
        this.itemSelects = []
        this.objCastClassChosen = {}
        this.tmpTotalNum = 0
        this.validateMaxNum = 0
    }
}
</script>
