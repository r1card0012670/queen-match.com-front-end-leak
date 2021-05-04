import {mapGetters, mapState} from "vuex";
import {
    CHAT_SUPPORT_USER_ID,
    CHAT_SUPPORT_USER_NAME,
    CHAT_TYPE_GROUP,
    CHAT_TYPE_MESSAGE,
    CHAT_TYPE_SINGLE,
    CHAT_TYPE_SUPPORT,
    TYPE_CHANNEL_ROOM_PRIVATE
} from "../utils/constant";


export default {
    methods: {
        updateDataListRoomForRead: function (payload, isReadRoom) {
            let self = this;
            let totalNumUnRead = _.has(payload, "totalUnReadChat") ? +payload.totalUnReadChat : null;
            if (!_.isNull(totalNumUnRead)) {
                self.$store.commit("numBadgeChatMutation", totalNumUnRead)
            }
            // Last message in chat room

            let cl = _.cloneDeep(self.getRoomListSuccess)
            let fi = cl.findIndex(ele => `${ele.roomId}` === `${payload.roomId}`);
            if (fi !== -1) {
                cl[fi].isReadRoom = +isReadRoom;
                if (_.has(payload, "type") && payload.type === "event_new_message_channel" && _.has(payload, "data.msg")) {
                    cl[fi].chat = Object.assign({},  cl[fi].chat, payload.data.msg);

                    cl[fi].latest_message_id = payload.data.msg.id
                }
                self.$store.commit('getRoomListSuccessMutation', cl);
            }
        },
    },
    mounted() {

    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            user: state => state.user.user,
            getRoomListSuccess: state => state.chat.getRoomListSuccess,
        }),
        ...mapGetters({}),
        sessionUserId: function () {
            return this.user.id
        },
        KEY_CHAT_SUPPORT_USER_ID: function () {
            return CHAT_SUPPORT_USER_ID
        },
        KEY_CHAT_SUPPORT_USER_NAME: function () {
            return CHAT_SUPPORT_USER_NAME
        },
        KEY_CHAT_TYPE_SINGLE: function () {
            return CHAT_TYPE_SINGLE
        },
        KEY_CHAT_TYPE_GROUP: function () {
            return CHAT_TYPE_GROUP
        },
        KEY_CHAT_TYPE_SUPPORT: function () {
            return CHAT_TYPE_SUPPORT
        },
        KEY_CHAT_TYPE_MESSAGE: function () {
            return CHAT_TYPE_MESSAGE
        },
        notAccountSupport: function () {
            return this.user.id !== this.KEY_CHAT_SUPPORT_USER_ID
        },
    },
    created() {
        let self = this;

        Echo.channel(`channel_room_${self.sessionUserId}`).listen('ChannelRoomPrivate', (data) => {
            let result = _.has(data, "data") ? data.data : data;

            if (_.has(result, "type")) {
                switch (result.type) {
                    case TYPE_CHANNEL_ROOM_PRIVATE.event_add_channel_room: {
                        // Add list chat room
                        // Format 3 data
                        let result = _.has(data, "data") ? data.data : data;
                        let newRoom = _.has(result, "data") ? result.data : result;
                        if (_.has(newRoom, "infoRoom")) {
                            self.$store.dispatch('pushChannelToListRoomSuccessDispatch', {data: (_.isArray(newRoom.infoRoom) ? newRoom.infoRoom : [newRoom.infoRoom])});
                        }
                        break;
                    }
                    case TYPE_CHANNEL_ROOM_PRIVATE.event_block_channel: {
                        // update block channel
                        let convertData = _.pick(result.data, ["id", "room_id", "is_read", "type", "is_block"]);
                        convertData.roomId = result.roomId;
                        if (_.has(convertData, 'is_block')) {
                            convertData.isBlock = convertData.is_block;
                        }
                        self.$nextTick(() => {
                            self.$store.dispatch("updateStoreListRoomByFieldIsBlockDispatch", convertData)
                        })
                        break
                    }
                    case TYPE_CHANNEL_ROOM_PRIVATE.event_new_message_channel: {
                        // update count message
                        self.updateDataListRoomForRead(result, false);
                        break
                    }
                    case TYPE_CHANNEL_ROOM_PRIVATE.event_reset_count_message_channel: {
                        // update count message
                        self.updateDataListRoomForRead(result, true);
                        break
                    }
                }
            }
        })
    }
}
