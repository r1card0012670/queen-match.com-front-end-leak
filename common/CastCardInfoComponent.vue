<template>
    <div :class="['d-cast-card-frame-point-info-wrapper', classCursorMouse]">
        <div class="d-cast-card-frame-point-info-biz-wrapper">
            <div class="type-with-age">
                <div :class="['wrapper', {'d-thumb-box': isThumbBg, 'wrap-text-bg': isThumbBg && checkNameLength}]">
                    <LoginTimeMarkComponent :nameStatus="statusText" :type-status="onlineStatus"/>
                    <span class="business-type-with-age">
                        <span class="business-type u-mr4" hidden="">  </span>
                        <span class="business-type u-mr4">{{ itemData.nickname }}</span>
                    </span>
                </div>
            </div>
        </div>
        <div class="c-cast-card-frame-point-info-one-word" v-if="isShowInfoOneWord">
            {{ itemData.word_of_the_day }}
        </div>
        <div :class="['c-cast-card-frame-point-info-time-work', 'clean-text']" v-if="itemData.job && !isShowInfoOneWord">
            {{ getTextJobAndWord() }}
        </div>
        <div class="c-cast-card-frame-point-info-age" v-if="isShowInfoAge && itemData.date_of_birth">
            {{ calcAge(itemData.date_of_birth) }}歳
        </div>
        <div class="d-cast-card-frame-point-info-price-wrapper" v-if="isShowInfoPrice">
            <div class="price">{{ numberWithFormat(itemData.price_point) }}</div>
            <div class="price-suffix">
                <span class="slash">/</span>
                <span class="minutes-num">30</span>
                <span class="minutes-str">分</span>
            </div>
        </div>

        <GradeNameComponent :classList="`text-center d-cast-card-standard`" :itemData="itemData"
                            v-if="useGradeNameInCardInfo && isShowGradeName"/>
    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import LoginTimeMarkComponent from "./LoginTimeMarkComponent.vue";
import GradeNameComponent from "./GradeNameComponent";
import moment from "moment";
import {TYPE_ROLE_USER, UNSELECT} from "../utils/constant";
import appUtility from "../utils/app-utility";

export default {
    data() {
        return {
            jobName: '',
            statusText: '',
        }
    },
    props: {
        funcShowDetail: {
            type: Function,
            defaultValue: null
        },
        nameStatus: {
            type: String,
            defaultValue: ""
        },
        typePage: {
            type: String,
            defaultValue: ""
        },
        itemData: Object,
        classCursorMouse: {
            type: String,
            default: "d-cursor-pointer"
        },
        useGradeNameInCardInfo: {
            type: Boolean,
            default: false
        },
        getInfoManagement: {
            type: Array,
            required: false
        },
        typeAct: {
            type: String,
            required: false
        },
        isThumbBg: {
            type: Boolean,
            required: false,
            default: false
        },
        isShowGradeName: {
            type: Boolean,
            required: false,
            default: true
        },
    },
    components: {
        LoginTimeMarkComponent,
        GradeNameComponent,
    },
    methods: {
        clickShowDetail: function (event) {
            if (typeof this.funcShowDetail === "function") {
                this.funcShowDetail(event)
            }
        },
        numberWithFormat: function(value) {
            return value ? appUtility.formatPriceToFixed(value) : (0 + "P");
        },
        getTextJobAndWord: function () {
            let job = '';
            let word = '';
            if (_.has(this.itemData, 'job') && this.getInfoManagement && !!this.getInfoManagement.length) {
                let jobName = (this.getInfoManagement || []).find(element => element.id === this.itemData.job).value;
                if (jobName && jobName !== UNSELECT) {
                    job = jobName;
                }
            }
            if (_.has(this.itemData, 'word_of_the_day') && this.itemData.word_of_the_day !== null && this.itemData.word_of_the_day !== '') {
                word = this.itemData.word_of_the_day;
            }

            if (job && !word) {
                return job;
            } else if (!job && word) {
                return word;
            } else if (job && word) {
                return job + ' / ' + word;
            } else {
                return '';
            }
        },
        calcAge: function (date) {
            if (date) {
                const today = new Date().toISOString().slice(0, 10)
                const dob = moment(date);
                return moment(today).diff(dob, 'years');
            }
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
        }),
        ...mapGetters({}),
        roles: function () {
            return this.itemData && this.itemData.roles
                ? _.compact(this.itemData.roles.map(ele => (_.has(ele, "role_name") ? `${ele.role_name}` : null)))
                : [];
        },
        isCast: function () {
            return _.indexOf(this.roles, TYPE_ROLE_USER.TYPE_CAST) !== -1;
        },
        isShowInfoOneWord: function () {
            if (!this.typePage)
                return true;

            return !(this.typePage === 'user-profile' || this.typePage === 'user-favorite');
        },
        isShowInfoJob: function () {
            if (!this.itemData)
                return false;

            return this.typePage === 'user-profile';
        },
        isShowInfoAge: function () {
            if (!this.typePage)
                return false;

            return this.typePage === 'user-favorite' || this.typePage === 'user-profile';
        },
        isShowInfoPrice: function () {
            if (!this.typePage)
                return true;

            return !(this.typePage === 'user-favorite' || this.typePage === 'user-profile' || this.typePage === 'user-item');
        },
        isShowStandard: function () {
            if (!this.typePage)
                return false;

            return this.typePage === 'user-profile';
        },
        onlineStatus: function () {
            let time = appUtility.renderDiffTime(this.itemData.last_active_time);
            if (!this.itemData.last_active_time) {
                return 'offline';
            }
            if (this.typePage && this.typePage === 'user-profile') {
                this.statusText = 'オフライン';
            }
            if (time < 5) {
                if (this.typePage && this.typePage === 'user-profile') {
                    this.statusText = 'オンライン中';
                }
                return 'online';
            }
            if (time < 60) {
                if (this.typePage && this.typePage === 'user-profile') {
                    this.statusText = Math.round(time) + '分前';
                }
                return 'no-plan';
            }
            if (time === 60) {
                if (this.typePage && this.typePage === 'user-profile') {
                    this.statusText = '１時間前';
                }
                return 'no-plan';
            }

            return 'offline';
        },
        checkNameLength: function () {
            return _.has(this.itemData, "nickname") && this.itemData.nickname ? this.itemData.nickname.length > 20 : false
        }
    },
}
</script>
<style lang="scss">
    .clean-text {
        flex: 1 1 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .wrap-text-bg {
        display: grid !important;
    }

    .business-type-with-age {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 90%;
    }
</style>
