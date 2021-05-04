<template>
    <div :class="[`d-time-wrap p-0`]">
        <v-col class="d-box-change-time p-0">
            <swiper :options="swiperOption" ref="swiperSlider" :id="renderKeyId">
                <swiper-slide v-for="(item, index) of renderTimePlans" :key="index" :data-id="item.id">
                    <div class="swiper-item text-center" role="button">
                        {{ item.value }}
                    </div>
                </swiper-slide>
            </swiper>
        </v-col>
    </div>
</template>

<script>

import C from "../../utils/constants";
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import 'swiper/css/swiper.min.css'


export default {
    data: function () {
        return {
            numDuplicateSlides: 0,
            swiperOption: {
                loop: true,
                direction: 'vertical',
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 3,
                coverflowEffect: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false
                },
                pagination: {
                    el: '.swiper-pagination'
                },
            },

            vModelData: "",
        }
    },
    model: {
        event: 'changeSlider'
    },
    props: {
        classList: {
            type: String,
            defaultValue: ""
        },
        vModelCurrent: {
            type: String,
            defaultValue: "",
            required: true
        },
        idElement: {
            type: String,
            required: true
        },
        renderTimePlan: {
            type: Array,
            defaultValue: "",
            required: true
        },
        keyDefault: {
            type: String,
            defaultValue: "",
            required: true
        }
    },
    components: {
        Swiper,
        SwiperSlide
    },
    computed: {
        constant: function () {
            return Object.assign({}, C)
        },
        swiperSlider: function () {
            return this.$refs.swiperSlider.$swiper
        },
        renderKeyId: function () {
            return `swiper-slider-${this.idElement}`
        },
        renderTimePlans: function () {
            return this.renderTimePlan && this.renderTimePlan.length ? this.renderTimePlan : []
        }
    },
    methods: {
        funcEmitData: function (id) {
            this.$nextTick(() => {
                this.$emit('changeTime', id);
            });
        },
        onSwipeSlider(varuable) {
            let activeIndex = varuable.swiperSlider.activeIndex;
            if (varuable.swiperSlider.slides[activeIndex]) {
                this.funcEmitData(varuable.swiperSlider.slides[activeIndex].dataset.id);
            }
        },
        getIndexElement: function (elementId, key) {
            let keyDefault = key || this.keyDefault;
            let elementById = document.getElementById(elementId);

            if (!!elementById) {
                return [...elementById.querySelectorAll("div[data-id]")].findIndex(element => {
                    let tmpId = element.getAttribute("data-id")
                    return tmpId && tmpId === keyDefault;
                });
            }

            return -1;
        },
        clickSelectData: function (varuable, event) {
            // Not check _.has or hasOwnProperty, so check item
            if (varuable && !!varuable.swiperSlider && !!varuable.swiperSlider.clickedSlide
                && !!varuable.swiperSlider.clickedSlide.dataset && !!varuable.swiperSlider.clickedSlide.dataset.id) {

                let slideIndex = varuable.swiperSlider.clickedSlide.dataset.id;

                let getIndex = this.getIndexElement(this.renderKeyId, slideIndex);
                if (getIndex !== -1) {
                    this.swiperSlider.activeIndex = getIndex;
                    this.funcEmitData(varuable.swiperSlider.clickedSlide.dataset.id);
                    varuable.swiperSlider.update();
                }
            }
        }
    },
    mounted() {
        let self = this;
        let key = (!self.vModelCurrent) ? null : self.vModelCurrent
        let getIndex = self.getIndexElement(this.renderKeyId, key);

        if (getIndex !== -1) {
            this.swiperSlider.activeIndex = getIndex;
            self.funcEmitData(self.keyDefault)
        }

        self.swiperSlider.on('slideChange', () => {
            self.onSwipeSlider(self)
        });

        self.swiperSlider.on('click', (e) => {
            self.numDuplicateSlides = self.numDuplicateSlides + 1;
            // Fixed
            if (self.numDuplicateSlides % 2) {
                self.clickSelectData(self, e)
            }
        });

        setTimeout(async () => {
            self.swiperSlider.update();
        }, 500)
    },
    created: function () {
        let self = this;
    },
    destroyed() {
        this.numDuplicateSlides = 0
    }
}
</script>
