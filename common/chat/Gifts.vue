<template>
    <v-col :class="[`d-box-list-gifts`, `p-0`]">
        <swiper class="swiper" :options="swiperOption" v-if="showDataCarousel">
            <swiper-slide class="card-container m-2" v-for="(obj, idx) in dataCarouselSlider"
                          :data-item-key="obj.id" :key="idx">

                <div @click="clickGiftItemClick(obj)" class="'test'" role="button">
<!--                    <v-img :src="srcImage(obj)" size="30" onerror="this.onerror=null;this.src='http://example.com/existent-image.jpg';"/>-->
                    <img :src="srcImage(obj)" size="30" onerror="this.onerror=null;this.src='http://example.com/existent-image.jpg';"/>
                    <div class="" style="font-size: 11px">{{ obj.point }}P</div>
                </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </v-col>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import {Swiper, SwiperSlide, directive} from 'vue-awesome-swiper'
import 'swiper/css/swiper.min.css'


export default {
    data: function () {
        return {
            swiperOption: {
                slidesPerView: 3,
                slidesPerColumn: 2,
                spaceBetween: 0,
                pagination: {
                    el: '.swiper-pagination',
                    type: "bullets",
                    clickable: true
                }
            },
        }
    },
    props: {
        classList: {
            type: String,
            defaultValue: ""
        },
        dataCarouselSlider: {
            type: Array,
            default: [],
            required: true
        },
        funcEventClickSlider: {
            type: Function,
            default: null
        },
        isPreventFuncEventClickSlider: {
            type: Boolean,
            default: false
        },
    },
    directives: {
        swiper: directive,
    },
    components: {
        Swiper,
        SwiperSlide
    },
    mounted() {
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // errorLoginMessage: state => state.user.errorLoginMessage,
        }),
        ...mapGetters({
            // errorLoginMessage: "errorLoginMessage",
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        showDataCarousel: function () {
            return !!this.dataCarouselSlider.length
        },

    },
    methods: {
        clickGiftItemClick: function (data) {
            if (!!this.isPreventFuncEventClickSlider) {
                return;
            }

            if (_.isFunction(this.funcEventClickSlider)) {
                this.funcEventClickSlider(data)
            }
        },
        srcImage: function (item) {
            return `${item.image}`
        }
    },
    destroyed() {
    }
}
</script>
