import {mapGetters, mapState} from "vuex";
import constantMain from "../utils/constants";
import appUtility from "../utils/app-utility";


export default {
    mounted() {

    },
    methods: {
        hasPriceNight: function (scheduleJoin, timeMeeting, key = '') {
            if (!scheduleJoin || scheduleJoin && !appUtility.isValidDate(scheduleJoin) || !timeMeeting) {
                return false;
            }

            let keyDate = 'HHmmss';
            let now = appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss");
            let nowJoin = appUtility.dateFormat(appUtility.dateAdd(now, timeMeeting, "m"), keyDate);
            if (key === "m_other") {
                nowJoin = appUtility.dateFormat(scheduleJoin, keyDate);
            }
            let timeEndJoin = appUtility.dateFormat(appUtility.dateAdd(appUtility.dateFormat(scheduleJoin, "YYYY-MM-DD HH:mm:ss"), timeMeeting, "h"), keyDate);

            let nowStartNight = appUtility.dateFormat(appUtility.momentTzNow(`YYYY-MM-DD ${this.constant.APP_NIGHT_CHARGE_TIME_START}`), keyDate);
            let nowEndNight59 = appUtility.dateFormat(appUtility.momentTzNow(`YYYY-MM-DD 23:59:59`), keyDate);
            let nowStartNight00 = appUtility.dateFormat(appUtility.momentTzNow(`YYYY-MM-DD 00:00:01`), keyDate);
            let nowEndNight = appUtility.dateFormat(appUtility.momentTzNow(`YYYY-MM-DD ${this.constant.APP_NIGHT_CHARGE_TIME_END}`), keyDate);

            let scheduleJoinCheck = (nowStartNight <= nowJoin && nowJoin <= nowEndNight59 || nowStartNight00 <= nowJoin && nowJoin <= nowEndNight);
            let scheduleEndJoinCheck = (nowStartNight <= timeEndJoin && timeEndJoin <= nowEndNight59 || nowStartNight00 <= timeEndJoin && timeEndJoin <= nowEndNight);

            return (scheduleJoinCheck || scheduleEndJoinCheck)
        },
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
        }),
        ...mapGetters({}),
        constant: function () {
            return Object.assign({}, constantMain)
        },
        renderTimeNightStart: function () {
            return appUtility.dateFormat(`2021-02-15 ${this.constant.APP_NIGHT_CHARGE_TIME_START}`, "HH時mm分")
        },
        renderTimeNightEnd: function () {
            return appUtility.dateFormat(`2021-02-15 ${this.constant.APP_NIGHT_CHARGE_TIME_END}`, "HH時")
        },
        renderPricePaymentNightEnd: function () {
            return appUtility.formatPriceToFixed(this.constant.PRICE.NIGHT_CHARGE);
        },
        percentPrice: function () {
            return this.constant.PERCENT_PRICE_EXTEND
        },

    },
    created() {
        let self = this;
        // Call number read message

    }
}
