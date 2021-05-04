"use strict";

import {bookService, chatService} from "../../_services";
import C from "../../utils/constants";
import appUtility from "../../utils/app-utility.js";
import {ACTIVE_STATUS_GIFT_DISABLE} from "../../utils/constant";


const state = {
    // showFeedCreateDialog: false,
    getRoomListSuccess: [],
    getRoomListFailed: {},
    getMessagesListFailed: {},
    getMessagesListSuccess: [],
    // addMessageFailure: {},
    // addMessageSuccess: {},
    listGift: [],
    listGiftGroup: [],
    giftStatusType: "",
    listOrderForCast: {},
    statusOrderMatching: "",
    filterChatRoom: {},
    fetchedDataListRoom: false
}

const getters = {
    // showFeedCreateDialog: state => state.showFeedCreateDialog,
    getRoomListSuccess: state => state.getRoomListSuccess,
    getRoomListFailed: state => state.getRoomListFailed,
    getMessagesListFailed: state => state.getMessagesListFailed,
    getMessagesListSuccess: state => state.getMessagesListSuccess,
    // addMessageFailure: state => state.addMessageFailure,
    // addMessageSuccess: state => state.addMessageSuccess,
    listGift: state => state.listGift,
    listGiftGroup: state => state.listGiftGroup,
    giftStatusType: state => state.giftStatusType,
    listOrderForCast: state => state.listOrderForCast,
    filterChatRoom: state => state.filterChatRoom,
    fetchedDataListRoom: state => state.fetchedDataListRoom,
}

const actions = {
    initResetDataStoreDialogChatDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('showFeedRestDialogMutation', payload)
    },
    listGiftDispatch({dispatch, commit}, payload) {
        chatService.fetchListGift(payload.user_id, payload.page).then(async res => {
            let data = _.has(res, "data") ? res.data : res;
            let gifts = {};
            let tmpGiftGroups = [];
            (data || []).forEach(ele => {
                if (_.has(ele, "status") && ele.status === ACTIVE_STATUS_GIFT_DISABLE) {
                    return
                }
                let tmp = _.pick(ele, ["group_gift"]);
                if (tmp && _.isObject(tmp.group_gift)) {
                    tmpGiftGroups.push(tmp.group_gift)
                }
                if (gifts[ele.group_gift_id]) {
                    gifts[ele.group_gift_id].push(ele)
                } else {
                    gifts[ele.group_gift_id] = [ele]
                }
            });
            let giftGroups = _.uniqBy(tmpGiftGroups, "id");

            await commit("listGiftMutation", Object.keys(gifts).map(key => gifts[key]));
            await commit("listGiftGroupMutation", giftGroups)
        }).catch(err => {

        })
    },
    getListRoomByUserDispatch({dispatch, commit, state, rootState}, payload) {
        let request = Object.assign({}, payload, {...state.filterChatRoom});
        commit('fetchedDataListRoomMutation', true);
        chatService.getListRoomChat(request)
            .then(async result => {
                let data = _.has(result, "data") ? result.data : result;

                let dataAfter = await appUtility.convertDataRoomListChat(data, rootState.user.user.id);

                let clone = _.cloneDeep(state.getRoomListSuccess);

                let mergeData = _.uniqBy(clone.concat(dataAfter), "roomId")

                await dispatch('loadingDispatch', false);
                await commit('getRoomListSuccessMutation', mergeData);
                await commit('fetchedDataListRoomMutation', false);
            })
            .catch(error => {
                // dispatch('loadingDispatch', false)
                commit('fetchedDataListRoomMutation', false);
                // commit('getRoomListFailedMutation', _.has(error, "err") ? error.err : error);

                // dispatch('alert/error', error, {root: true});
            });
    },
    async pushChannelToListRoomSuccessDispatch({dispatch, commit, rootState}, payloadEvent) {
        let {data} = payloadEvent;
        if (!data || !_.isArray(data)) {
            return;
        }

        let clone = _.cloneDeep(state.getRoomListSuccess);
        let dataAfter = await appUtility.convertDataRoomListChat(data, rootState.user.user.id);
        let mergeData = _.uniqBy(clone.concat(dataAfter), "roomId")

        await commit('getRoomListSuccessMutation', mergeData);
    },
    async updateStoreListRoomByFieldIsBlockDispatch({dispatch, commit, rootState}, payload) {
        if (!_.has(payload, "roomId")) {
            return;
        }
        let cloneListRoom = _.cloneDeep(state.getRoomListSuccess);
        let findIndex = cloneListRoom.findIndex(element => +element.roomId === +payload.roomId);

        if (findIndex !== -1) {
            let dataClone = _.cloneDeep(cloneListRoom[findIndex]);
            // Update file
            if (_.has(payload, "isBlock")) {
                dataClone.isBlock = +payload.isBlock
            }
            // Todo field

            cloneListRoom[findIndex] = dataClone;

            await commit('getRoomListSuccessMutation', cloneListRoom);
        }
    },
    getListMessageByRoomDispatch({dispatch, commit, rootState}, payload) {
        chatService.getListMessageChat({roomId: payload.room_id, page: payload.page})
            .then(async result => {
                let data = _.has(result, "data") ? result.data : result;

                let dataAfter = _.reverse(await appUtility.convertDataMessageListChat(data, rootState.user.user.id));
                let cloneMsg = _.cloneDeep(state.getMessagesListSuccess);

                // Filter data with remove key fake data
                cloneMsg = cloneMsg.filter(ele => ele.room_id === payload.room_id)
                    .filter(item => _.has(item, "keyFakeIdAndRemoveWhenApi") && !item.keyFakeIdAndRemoveWhenApi);

                let mergeData = _.uniqBy(dataAfter.concat(cloneMsg), "id");

                await commit('getMessagesListSuccessMutation', mergeData);
            })
            .catch(error => {
                // dispatch('loadingDispatch', false)
                commit('getMessagesListFailedMutation', _.has(error, "err") ? error.err : error);

                // dispatch('alert/error', error, {root: true});
            });
    },
    addMessageDispatch({dispatch, commit}, payload) {
        let self = this;
        chatService.addMessages(payload)
            .then(result => {
                // commit('addMessageSuccessMutation', (_.has(result, "data") ? result.data : result));
            })
            .catch(error => {
                // commit('addMessageFailedMutation', _.has(error, "err") ? error.err : error);
                // dispatch('alert/error', error, {root: true});
            });
    },
    createSendChatWithImageDispatch({dispatch, commit}, payload) {
        let self = this;
        chatService.addMessagesWithImage(payload)
            .then(result => result.data)
            .catch(error => {
                // dispatch('alert/error', error, {root: true});
            });
    },
    createSendChatWithGiftDispatch({dispatch, commit}, payload) {
        let self = this;
        chatService.addMessagesWithGift(payload)
            .then(async result => {
                await commit('giftStatusTypeMutation', C.STATUS_REQUEST_GIFT_PROCESS.CREATE_GIFT_FINISH);
                return result.data
            })
            .catch(error => {
                commit('giftStatusTypeMutation', C.STATUS_REQUEST_GIFT_PROCESS.CREATE_GIFT_FINISH);
                // dispatch('alert/error', error, {root: true});
            });
    },
    async addDetailInfoPaymentBeforeUseViaChatDispatch({commit, state, rootState}, payload) {
        await commit('detailInfoEditCardMutation', payload);
    },
    async addDetailInfoAndChangeTypeSendGiftDispatch({commit, state, rootState}, payload) {
        await commit('detailInfoEditCardMutation', payload);
        await commit('giftStatusTypeMutation', C.STATUS_REQUEST_GIFT_PROCESS.PAYMENT_GIFT_CREATE);
    },
    async readyRequestPaymentSendGiftDispatch({commit, state, rootState}, payload) {
        let self = this;
        if (!_.has(rootState.book, "detailInfoEditCard.id") || !rootState.book.detailInfoEditCard.id) {
            return
        }
        payload.data["id"] = rootState.book.detailInfoEditCard.id;

        chatService.readyRequestPaymentSendGift(payload)
            .then(async result => {
                await commit('giftStatusTypeMutation', C.STATUS_REQUEST_GIFT_PROCESS.PAYMENT_GIFT_SUCCESS);
            })
            .catch(async error => {
                await commit('giftStatusTypeMutation', C.STATUS_REQUEST_GIFT_PROCESS.PAYMENT_GIFT_THROW);
                // dispatch('alert/error', error, {root: true});
            });
    },
    markReadMessageByIdDispatch({commit, state, rootState}, payload) {
        chatService.markReadMessageById(payload)
            .then(async result => {
            })
            .catch(async error => {
                // dispatch('alert/error', error, {root: true});
            });
    },
    fetchDataOrderOfCastNowDispatch({commit, state, rootState}, payload) {
        chatService.fetchDataOrderOfCastNow({...payload, roomId: payload.roomId}).then(async res => {
            let roomId = payload.roomId
            let keyRoomUser = `${roomId}_${rootState.user.user.id}`;
            let clone = _.cloneDeep(state.listOrderForCast) // Object
            let data = _.has(res, "data") ? res.data : res;
            if (!data || _.isNull(data) || !_.has(data, "room_id") || !_.has(data, "user_id")) {
                if (_.has(clone, keyRoomUser) && clone[keyRoomUser]) {
                    clone[keyRoomUser] = {}
                    await commit("listOrderForCastMutation", clone);
                }
                return Promise.reject("Not data")
            }
            if (payload.roomId !== data.room_id) {
                return Promise.reject("Not match data by roomId")
            }

            let dataConvert = await appUtility.convertDataOrderOfCast(data);

            if (_.has(clone, keyRoomUser) && clone[keyRoomUser]) {
                let cl = _.cloneDeep(clone[keyRoomUser]);
                clone[keyRoomUser] = Object.assign({}, cl, dataConvert)
            } else {
                clone[keyRoomUser] = dataConvert
            }

            await commit("listOrderForCastMutation", clone);
        }).catch(error => {
            console.warn("chat::fetchDataOrderOfCastNowDispatch >> ", error)
        })
    },
    async updateRealTimeOrderMatchingDispatch({commit, state, rootState}, payloadEvent) {
        let {type, reqData, roomId} = payloadEvent
        let clone = _.cloneDeep(state.listOrderForCast) // Object

        let dataConvert = await appUtility.convertDataOrderOfCastRealtime(reqData);
        let keyRoomUser = `${roomId}_${rootState.user.user.id}`;

        if (clone && clone[keyRoomUser] && _.has(clone[keyRoomUser], "order_real_times")) {
            let cl = _.cloneDeep(clone[keyRoomUser].order_real_times);
            clone[keyRoomUser].order_real_times = Object.assign({}, cl, dataConvert)
            await commit("listOrderForCastMutation", clone);
            if (type === 'START') {
                await commit("statusOrderMatchingMutation", "START_TIME_MATCHING_SUCCESS")
            } else if (type === 'END') {
                await commit("statusOrderMatchingMutation", "END_TIME_MATCHING_SUCCESS")
            }
        }
    },
    startTimeOrderMatchingDispatch({commit, state, rootState, dispatch}, payload) {
        bookService.startTimeOrderMatching({orderId: payload.orderId, data: payload.data || {}}).then(async res => {
            // Update item info of order by key room + castid
            let roomId = payload.roomId
            let data = _.has(res, "data") ? res.data : res;
            if (!data || _.isNull(data) || !roomId) {
                return Promise.reject("Not data")
            }

            // Overwrite time from server
            data.real_start_time = appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss");
            await dispatch("updateRealTimeOrderMatchingDispatch", {type: 'START', roomId, reqData: data});
        }).catch(err => {
            commit("statusOrderMatchingMutation", "PROCESS_MATCHING_THROW")
        })
    },
    endTimeOrderMatchingDispatch({commit, state, rootState, dispatch}, payload) {
        bookService.endTimeOrderMatching({orderId: payload.orderId, data: payload.data || {}}).then(async res => {
            // Update item info of order by key room + castid
            let roomId = payload.roomId

            let clone = _.cloneDeep(state.listOrderForCast) // Object
            let keyRoomUser = `${roomId}_${rootState.user.user.id}`;
            if (clone && clone[keyRoomUser]) {
                let data = _.cloneDeep(clone[keyRoomUser].order_real_times);
                data.real_end_time = appUtility.momentTzNow("YYYY-MM-DD HH:mm:ss");

                await dispatch("updateRealTimeOrderMatchingDispatch", {type: 'END', roomId, reqData: data});
            }
        }).catch(err => {
            commit("statusOrderMatchingMutation", "PROCESS_MATCHING_THROW")
        })
    },
    filterChatRoomDispatch({commit, state, rootState}, payload) {
        commit("filterChatRoomMutation", payload)
    }
}

// Action of method
const mutations = {
    /**
     * Reset init data
     * @param state
     * @param payload
     */
    showFeedRestDialogMutation(state, payload) {
        state.giftStatusType = ""
        state.listOrderForCast = {}
        state.filterChatRoom = {}
        // TODO
    },
    getRoomListSuccessMutation(state, payload) {
        state.getRoomListSuccess = _.orderBy(payload, ["isReadRoom", 'latest_message_id'], ['asc', "desc"]);
    },
    getRoomListFailedMutation(state, payload) {
        state.getRoomListFailed = payload;
    },
    getMessagesListSuccessMutation(state, payload) {
        state.getMessagesListSuccess = _.orderBy(payload, ['created_at'], ['asc']);
    },
    getMessagesListFailedMutation(state, payload) {
        state.getMessagesListFailed = payload
    },
    // addMessageSuccessMutation(state, payload) {
    //     state.addMessageFailure = payload;
    // },
    // addMessageFailedMutation(state, payload) {
    //     state.addMessageSuccess = payload;
    // },
    listGiftMutation(state, data) {
        state.listGift = data;
    },
    listGiftGroupMutation(state, data) {
        state.listGiftGroup = data;
    },
    giftStatusTypeMutation(state, val) {
        state.giftStatusType = val;
    },
    listOrderForCastMutation(state, data) {
        state.listOrderForCast = data;
    },
    statusOrderMatchingMutation(state, val) {
        state.statusOrderMatching = val;
    },
    filterChatRoomMutation(state, data) {
        state.filterChatRoom = data;
    },
    fetchedDataListRoomMutation(state, val) {
        state.fetchedDataListRoom = val;
    },
}

// ---------------------------------------------------------------------------------------------------------------------


// Format export
export default {
    state,
    getters,
    actions,
    mutations
}
