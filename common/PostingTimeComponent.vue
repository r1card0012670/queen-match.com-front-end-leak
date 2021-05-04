<template>
    <div v-if="formatDate" :class="[`d-posting-time`]">
        {{ formatDate }}
    </div>
</template>

<script>
import appUtility from './../utils/app-utility.js';

export default {
    props: {
        date: {
            type: String,
            required: true
        },
        stringFormatDate: {
            type: String,
            defaultValue: "YYYY-MM-DD"
        }
    },
    computed: {
        formatDate: function () {
            if(this.date) {
                let date = '';
                let hour = '';
                let time = '';
                const dateMinute = this.$moment().diff(this.date, 'minutes', true)
                const dateHour = this.$moment().diff(this.date, 'hours', true)
                const dateDay = this.$moment().diff(this.date, 'days', true)
                const dateMonth = this.$moment().diff(this.date, 'months', true)
                const dateYear = this.$moment().diff(this.date, 'years', true)
                const dayInWeek = this.$moment(this.date).day();
                let day = '';

                // console.log(dateDay, dateHour, dateMinute);
                switch(dayInWeek) {
                    case 1:
                        day = '月';
                        break;
                    case 2:
                        day = '火';
                        break;
                    case 3:
                        day = '水';
                        break;
                    case 4:
                        day = '木';
                        break;
                    case 5:
                        day = '金';
                        break;
                    case 6:
                        day = '土';
                        break;
                    case 7:
                        day = '日';
                        break;
                }

                if (dateDay <= 1){
                    if (Math.floor(dateMinute) == 0){
                        time = '数秒前';
                    }
                    else if(dateMinute > 0 && dateMinute < 60) {
                        time = Math.floor(dateMinute)+ '分前'
                    }
                    else if(dateHour > 1 && dateHour <= 24) {
                        time = Math.floor(dateHour) + '時間前'
                    }
                } else if(dateDay > 1 && Math.floor(dateDay) <= 31) {
                    //TODO check with day in month
                    date = this.$moment(this.date).format('M/D')
                    hour = this.$moment(this.date).format('H:m')
                    time = `${date} (${day}) ${hour}`
                    // time = Math.floor(dateDay)+ '日前'
                }
                if(Math.floor(dateMonth) > 1 && Math.floor(dateMonth) < 12 ) {
                    // time = Math.floor(dateMonth)+ '月前'
                    date = this.$moment(this.date).format('M/D')
                    hour = this.$moment(this.date).format('H:m')
                    time = `${date} (${day}) ${hour}`
                }
                else if(dateYear > 1) {
                    date = this.$moment(this.date).format('Y/M/D')
                    hour = this.$moment(this.date).format('H:m')
                    time = `${date} (${day}) ${hour}`
                }

                return time
            }

            return null;
        }
    },
}
</script>
