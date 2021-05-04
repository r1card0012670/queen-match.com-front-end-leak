<template>
    <div :class="[`d-time-plan-cast p-0`]">
        <v-col class="d-box-change-time p-0">
            <swiper :options="swiperOption" ref="swiperSlider" :id="'swiper-slider-year'">
                <swiper-slide v-for="(item, index) of renderYear" :key="index" :data-id="item.id">
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
    import appUtility from './../../utils/app-utility.js';


    export default {
        data: function () {
            return {
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
                    }
                },

                vModelData: "",
                keyDefault: "",
            }
        },
        model: {
            event: 'change'
        },
        props: {
            classList: {
                type: String,
                defaultValue: ""
            },
            vModelYearCurrent: {
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
            renderYear: function () {
                let results = [];
                let year = [];
                let d = new Date();
                let currentYear = d.getFullYear();
                for (let i = currentYear; i <= (currentYear + 20); i++) {
                    year.push(i);
                }
                year.forEach((ele) => {
                    results.push({id: `${ele}`, value: `${ele}`})
                })

                return results;
            },
            swiperSlider: function () {
                return this.$refs.swiperSlider.$swiper
            },
        },
        methods: {
            funcEmitData: function (id) {
                this.$nextTick(() => {
                    this.$emit('change', id);
                });
            },
            onSwipeSlider(varuable) {
                let activeIndex = varuable.swiperSlider.activeIndex;
                if (varuable.swiperSlider.slides[activeIndex]) {
                    this.funcEmitData(varuable.swiperSlider.slides[activeIndex].dataset.id);
                }
            },
            getIndexElement: function (elementId, key) {
                let elementById = document.getElementById(elementId);
                this.keyDefault = key;

                if (!!elementById) {
                    return [...elementById.querySelectorAll("div[data-id]")].findIndex(element => {
                        let tmpId = element.getAttribute("data-id")
                        return tmpId && tmpId === key;
                    });
                }

                return -1;
            }
        },
        mounted() {
            let self = this;
            let key = (!self.vModelYearCurrent) ? null : self.vModelYearCurrent
            let getIndex = self.getIndexElement("swiper-slider-year", key);

            if (getIndex !== -1) {
                this.swiperSlider.activeIndex = getIndex;
                self.funcEmitData(self.keyDefault)
            }

            self.swiperSlider.on('slideChange', () => {
                self.onSwipeSlider(self)
            });

            setTimeout(async () => {
                self.swiperSlider.update();
            }, 500)
        },
        created: function () {
            let self = this;
        }
    }
</script>
