<template>
    <div class="app-content-box">
        <v-row justify="center">
            <v-dialog v-model="isShowListCastMeetNow" :content-class="`d-dialog-show-fullscreen`" max-width="440"
                      fullscreen
                      hide-overlay transition="dialog-bottom-transition"
                      scrollable>
                <v-card :class="`dialog-show-list-cast-now`" :id="`dialog-show-list-cast-meet-now`">
                    <v-card-title class="p-0">
                        <div :class="`card-header-top`">
                            <button v-on:click="goBack()">
                                <v-img contain src="../../images/chevron-left.svg"/>
                            </button>
                            <div class="d-title">{{ titleHeader }}</div>
                        </div>
                    </v-card-title>
                    <v-card-text :class="[`p-0`]">
                        <template v-if="checkHasDataCastNow">
                            <div class="card-body d-list-content pt-0">
                                <div class="d-inline-flex d-list-show-list-cast-meet-now box-1 p-0 d-box-new-card">
                                    <CardUserComponent v-for="(item, index) in listCastMeetNow" :key="item.id"
                                                       :itemData="item"
                                                       :name="'home2meet-now'"
                                                       :type="'list-cast-today-booking'"
                                                       :imgAvatarDefault="item.avatar"/>

                                    <div ref="infiniteScrollAll" id="scroll-trigger-all-now"></div>
                                </div>
                            </div>
                        </template>
                    </v-card-text>
                </v-card>
            </v-dialog>

            <loading :active.sync="loadingBook"></loading>
        </v-row>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import C from '../../utils/constants'
import IconSvgComponent from "../../common/IconSvgComponent";
import CardUserComponent from "../../common/CardUserComponent";
import processBookForUser from "../../mixin/processBookForUser";
import Loading from "vue-loading-overlay";


export default {
    mixins: [
        processBookForUser
    ],
    props: {
        titleHeader: {
            type: String,
            defaultValue: ""
        },
        funcCloseListCastMeetNowDialog: {
            type: Function,
            defaultValue: null
        },
        isShowListCastMeetNow: {
            type: Boolean,
            required: true
        },
        selectLocal: {
            type: Object,
            required: true
        }
    },
    data: function () {
        return {
            payload: {},
            currentPage: 1,
        }
    },
    components: {
        IconSvgComponent,
        CardUserComponent,
        Loading
    },
    mounted() {
        let self = this;

        self.$nextTick(() => {
            if (Object.keys(this.step1).length) {
                self.fetchData()
            }
        });

        self.scrollTrigger();
    },
    methods: {
        goBack: function (event) {
            if (typeof this.funcCloseListCastMeetNowDialog === "function") {
                this.funcCloseListCastMeetNowDialog(false);
            }
        },
        fetchData: function () {
            let self = this;
            self.$store.dispatch("loadingBookDispatch", true);

            self.fetchCastMeetNow({
                place_id: self.selectLocal.id,
                cast_package: self.step1.castClass.value, // It's class cast
                // schedule_join: self.step1.scheduleToJoin.date,
                page: self.currentPage
            })
        },
        scrollTrigger() {
            let self = this;
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0 && !self.notData) {
                        self.currentPage += 1;
                        self.fetchData();
                    }
                });
            });

            if (!!self.$refs.infiniteScrollAll) {
                this.observer.observe(self.$refs.infiniteScrollAll);
            }
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            notData: state => state.book.notData,
            step1: state => state.book.step1,
            listCastMeetNow: state => state.book.listCastMeetNow,
            loadingBook: state => state.book.loadingBook,

        }),
        constant: function () {
            return Object.assign({}, C)
        },
        checkHasDataCastNow: function () {
            return !!this.listCastMeetNow.length
        }
    },
    destroyed() {
        this.$store.commit("listCastMeetNowMutation", []);  // Reset data
    }
}
</script>
