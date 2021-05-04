<template>
    <v-col class="p-0 d-range-slider-content-filter mt-4">
        <v-sheet id="d-box-range-slider" :class="'d-box-range-slider-filter-cast-wrapper'">
            <v-range-slider v-model="vModelDataRange" :max="maxRange" :min="minRange" hide-details class="align-center"
                            :color="trackColor" :thumb-color="txtThumbColorUseClass"
                            thumb-size="40"
                            step="500"
                            :track-color="trackColorOrClass"
                            @change="changeDataRangeSlider" @end="endDataRangeSlider">
            </v-range-slider>

            <template v-if="typeThumb2Icon">
                <v-icon v-if="typeThumb2Icon" :class="[`d-${typeThumb2Icon}`, 'd-none']" :id="typeThumb2Icon">
                    pause_circle_outline
                </v-icon>
            </template>

        </v-sheet>
    </v-col>
</template>

<script>

import C from "../../utils/constants";

/**
 * Interface: constructor
 */
let StructDataFormat = function (payload) {
    this.isChosenDay = _.has(payload, "isChosenDay") ? payload.isChosenDay : false
    this.dateKey = _.has(payload, "dateKey") ? payload.dateKey : null
}

/**
 *
 * @param payload, it's object
 * @returns {StructDataFormat}
 */
let dataFilter = function (payload) {
    return new StructDataFormat(payload)
}

let removeMany = function (element, classes = []) {
    if (element && _.isFunction(element.remove)) {
        (classes || []).forEach(item => {
            element.remove(item);
        });
    }
}
let addMany = function (element, classes = []) {
    if (element && _.isFunction(element.add)) {
        (classes || []).forEach(item => {
            element.add(item);
        });
    }
}
const listRemoves = ['v-future', 'v-present', 'v-pass', 'v-outside'];
const classTransparent = 'transparent';

export default {
    data: function () {
        return {
            vModelDataRange: [],
        }
    },
    model: {
        event: 'change'
    },
    props: {
        minRange: {
            type: Number,
            required: true
        },
        maxRange: {
            type: Number,
            required: true
        },
        trackColorOrClass: {
            type: String,
            required: ""
        },
        trackColor: {
            type: String,
            required: ""
        },
        typeThumbTrack2Icon: {
            type: String,
            required: ""
        },
        classThumbTrack: {
            type: String,
            required: ""
        },
    },
    computed: {
        constant: function () {
            return Object.assign({}, C)
        },
        classColor: function () {
            if (!this.colorActive) {
                return ""
            }
            return this.colorActive;
        },
        txtThumbColorUseClass: function () {
            return `d-thumb-color-by-class ${this.triggerConvertIcon} ${this.classThumbTrack}`
        },
        triggerConvertIcon: function () {
            if (this.typeThumb2Icon === "thumb-circle") {
                return `${this.typeThumb2Icon} rounded-circle d-convert-thumb-2-circle`
            }
            if (this.typeThumb2Icon === "thumb-icon") {
                return `${this.typeThumb2Icon} d-convert-thumb-2-icon`
            }

            return ""
        },
        typeThumb2Icon: function () {
            if (!this.typeThumbTrack2Icon) {
                return "";
            }

            switch (this.typeThumbTrack2Icon) {
                case "thumb-icon":
                case "thumb-circle":
                    return this.typeThumbTrack2Icon;
                default:
                    return ""
            }
        },
    },
    watch: {
        vModelDataRange: function (to, from) {
            this.funcEmitData();
        }
    },
    methods: {
        funcEmitData: function () {
            this.$emit('change', this.vModelDataRange);
        },
        changeDataRangeSlider: function (event) {
            this.funcEmitData();
        },
        endDataRangeSlider: function (event) {
            this.funcEmitData();
        },
        renderRangeModelLengthOne: function (rangeSlider) {
            let number = rangeSlider[0];
            if (number <= this.minRange || number >= this.maxRange) {
                return [this.minRange, this.maxRange]
            }

            if (this.minRange <= number && number <= this.maxRange) {
                return [number, this.maxRange]
            }
            return [this.minRange, this.maxRange]
        },
        renderRangeModel: function (rangeSlider) {
            let min = rangeSlider[0];
            let max = rangeSlider[1];
            if (min < this.minRange) {
                min = this.minRange
            }
            if (max > this.maxRange) {
                max = this.maxRange
            }
            return [min, max]
        },
        initDataRangeModel: function () {
            let self = this;
            let tmpModel = _.cloneDeep(this.vModelDataRange).sort();
            if (!tmpModel.length) {
                tmpModel.push(self.minRange)
                tmpModel.push(self.maxRange)
            } else if (tmpModel.length === 1) {

            } else if (tmpModel.length >= 2) {
                tmpModel = self.renderRangeModel(_.chunk(tmpModel, 2)[0].sort());
            } else {
                tmpModel.push(self.minRange)
                tmpModel.push(self.maxRange)
            }
            self.vModelDataRange = tmpModel.sort();
        },
        initConvertPlainThumb: function () {
            let self = this;
            let idBoxRangeSlider = document.getElementById('d-box-range-slider');
            let idTypeThumb2IconSource = document.getElementById(self.typeThumb2Icon);
            if (idBoxRangeSlider && idTypeThumb2IconSource) {
                [...idBoxRangeSlider.querySelectorAll(`.${self.typeThumb2Icon}`)].forEach(element => {
                    let clone = idTypeThumb2IconSource.cloneNode(true);
                    if (_.functions(clone.classList.remove)) {
                        clone.classList.remove("d-none", "d-custom-thumb")
                    }
                    element.appendChild(clone);
                });
            }
        }
    },
    mounted: function () {
        this.initDataRangeModel();
        this.initConvertPlainThumb()
    }
}
</script>
