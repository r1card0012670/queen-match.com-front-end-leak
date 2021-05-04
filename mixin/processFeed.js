import {mapGetters, mapState} from "vuex";

export default {
    methods: {
        objUserOverWrite: function (objUser) {
            // Overwrite id by page feed
            return Object.assign({}, objUser, { ..._.has(objUser, "user_create_id") && {id: objUser.user_create_id}})
        },
        filterDataContentCurrentSession: function (userId) {
            let self = this;
            let list = [];

            if (_.isObject(self.listFeedDetail)) {
                if (_.has(self.listFeedDetail, "casts")) {
                    list = list.concat(self.feedDetail["casts"]);
                }
                if (_.has(self.listFeedDetail, "users")) {
                    list = list.concat(self.feedDetail["users"]);
                }
                // Object.keys(self.feedDetail).forEach(key => {
                //     list = list.concat(self.feedDetail[key]);
                // });
            }
            if (_.isArray(self.listFeedDetail)) {
                list = self.listFeedDetail
            }
            list = list.filter(ele => {
                return _.has(ele, "user_create_id") && ele.user_create_id === +userId
            })

            return _.uniqBy(list, "id");
        }
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            feedDetail: state => state.feed.feedDetail,
            listFeedDetail: state => state.feed.listFeedDetail
        }),
        ...mapGetters({}),
    },
    created() {
        let self = this;
    }
}
