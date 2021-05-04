<template>
    <v-col class="p-0 d-calendar-content-wrapper">
        <v-sheet height="64" class="d-flex justify-content-between p-0 d-calendar-title">
            <v-btn text class="d-inline-flex btn p-0 ml-0" :disabled="dateItem.prev" @click="prev">
                <div class="d-inline-flex">
                    <IconSvgComponent :className="'d-inline-block btn p-0'" :type="'chevron-left'"/>
                </div>
                前の週
            </v-btn>

            <v-toolbar-title :class="'d-inline-flex p-0'">{{ currentYearMonth }}</v-toolbar-title>

            <v-btn text class="d-inline-flex btn p-0 mr-0" @click="next" :disabled="dateItem.next">
                次の週
                <div class="d-inline-flex mr-0 p-0">
                    <IconSvgComponent :className="'d-inline-block btn p-0'" :type="'chevron-right'"/>
                </div>
            </v-btn>

        </v-sheet>
        <v-spacer></v-spacer>
        <CalendarWeeklyContent :userId="userId" ref="calendar" :dateItem="dateItem" :dateWorkingTime="dateWorkingTime" v-if="reRenderCalendar"/>
    </v-col>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import C from "../../utils/constants";
import IconSvgComponent from "../../common/IconSvgComponent";
import CalendarWeeklyContent from "./CalendarWeeklyContent";
import appUtility from "../../utils/app-utility";

export default {
    data: function () {
        return {
            events: [],
            dateItem: {
                currentDay: new Date(),
                prev: true,
                next: false
            },
            countActiveNext: 1,
            reRenderCalendar: true,
        }
    },
    props: {
        userId: {
            type: String,
            required: true
        },
        dateWorkingTime: {
            type: Array,
            required: true
        },
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            // currentType: state => state.main.currentType
        }),
        ...mapGetters({}),
        constant: function () {
            return Object.assign({}, C)
        },
        currentYearMonth: function () {
            return appUtility.dateFormat(new Date(), "YYYY年MM月")
        }
    },
    components: {
        IconSvgComponent,
        CalendarWeeklyContent
    },
    methods: {
        prev() {
            let currentDay = appUtility.dateSubtract(this.dateItem.currentDay, 7, 'day');
            let isCheck = appUtility.isSameOrAfter(new Date(), currentDay.toString());
            if (isCheck) {
                this.countActiveNext = this.countActiveNext - 1;
            }
            if (!this.dateItem.prev) {
                this.dateItem = Object.assign({}, this.dateItem, {
                    prev: isCheck,
                    next: this.countActiveNext >= 2,
                    currentDay: appUtility.dateSubtract(this.dateItem.currentDay, 7, 'day')
                })
            }
            this.reRenderCalendar = false;
            this.$nextTick(()=>{
                this.reRenderCalendar = true;
            })
        },
        next() {
            let currentDay = appUtility.dateAdd(this.dateItem.currentDay, 7, 'day');
            let isCheck = appUtility.isSameOrAfter(new Date(), currentDay.toString());
            if (!isCheck) {
                this.countActiveNext = ++this.countActiveNext;
            }
            this.dateItem = Object.assign({}, this.dateItem, {
                prev: isCheck,
                next: this.countActiveNext >= 2,
                currentDay
            })
            this.reRenderCalendar = false;
            this.$nextTick(()=>{
                this.reRenderCalendar = true;
            })
        },
    },
    mounted: function () {
    }
}
</script>
