import {mapGetters, mapState} from "vuex";

export default {
    methods: {
        fetchCastMeetNow: function (payload) {
            let place_id = _.has(payload, "place_id") ? payload.place_id : null
            let cast_package = _.has(payload, "cast_package") ? payload.cast_package : null
            let schedule_join = _.has(payload, "schedule_join") ? payload.schedule_join : null
            let page = _.has(payload, "page") ? payload.page : 1
            let tags = _.has(payload, "tags") ? payload.tags : null;
            let number_cast = _.has(payload, "number_cast") ? payload.number_cast : null;
            let overwrite = _.has(payload, "overwrite") ? payload.overwrite : false;

            let data = Object.assign({}, {
                ...place_id && {place_id},
                ...cast_package && {cast_package},
                ...schedule_join && {schedule_join},
                ...tags && _.isArray(tags) && tags.length && {tags},
                ...number_cast && _.isObject(number_cast) && {number_cast},
                page
            })

            this.$store.dispatch("fetchCastMeetNowDispatch", Object.assign({}, {data, overwrite}));
        },
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            listCastMeetNow: state => state.book.listCastMeetNow,
            loadingBook: state => state.book.loadingBook,
        }),
        ...mapGetters({}),
    },
    created() {
        let self = this;
    }
}
