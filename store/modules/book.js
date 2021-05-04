"use strict";
import C from "../../utils/constants";
import appUtility from "../../utils/app-utility.js";
import {bookService, paymentService} from "../../_services";


// ---------------------------------------------------------------------------------------------------------------------

/**
 *
 * @param key
 * @param isResultObj
 * @param numOfCastMember
 * @returns {{name: string, id: string}}
 */
const funcGetCastClass = (key = "", isResultObj = true, numOfCastMember = 0) => {
    let findIndex;
    findIndex = C.CAST_CLASS.findIndex(ele => ele.id === key);
    if (findIndex === -1) {
        findIndex = 0
    }

    if (isResultObj) {
        return Object.assign({}, C.CAST_CLASS[findIndex], _.pick(C.CAST_CLASS[findIndex], ["price", "value"]), {totalPrice: C.CAST_CLASS[findIndex].price * numOfCastMember})
    }

    return C.CAST_CLASS[findIndex].id
}

/**
 * FuncStructureDataStep1
 * @param payload, format is object
 * @constructor
 */
const FuncStructureDataStep1 = function (payload) {
    let numOfCastMember = _.has(payload, "numOfCastMember") ? payload.numOfCastMember : 2; /// Number
    // Object
    let scheduleToJoin = {}
    if (_.has(payload, "scheduleToJoin")) {
        scheduleToJoin = payload.scheduleToJoin
    } else {
        let tmp = C.SCHEDULE_TO_JOIN_MINUTES[0];
        scheduleToJoin = Object.assign({}, tmp);

        if (tmp.id === 'm_30') {
            scheduleToJoin.date = appUtility.dateFormat(appUtility.dateAdd(new Date(), tmp.value, 'm'), "YYYY-MM-DD HH:mm:00");
            scheduleToJoin.name = `今すぐ(${tmp.name})`
        }
    }

    this.scheduleToJoin = scheduleToJoin;
    this.setTimeHours = _.has(payload, "setTimeHours") ? payload.setTimeHours : C.SET_TIME_HOURS_DEFAULT; // Number
    this.numOfCastMember = numOfCastMember;
    this.castClass = _.has(payload, "castClass") ? payload.castClass : funcGetCastClass('vip', true, numOfCastMember); // Object
    this.location = _.has(payload, "location") ? payload.location : {}; // String
}

/**
 * funcRenderDataStep1
 * @param payload, format is [object]
 * @returns {FuncStructureDataStep1}
 */
const funcRenderDataStep1 = (payload = {}) => {
    return new FuncStructureDataStep1(_.pick(payload, ["scheduleToJoin", "castClass", "numOfCastMember", "setTimeHours", "location"]));
}

/**
 * FuncStructureDataStep3
 * @param payload
 * @constructor
 */
const FuncStructureDataStep2 = function (payload) {
    this.filterType1 = _.has(payload, "filterType1") ? payload.filterType1 : [];  // Format [{}]
    this.filterType2 = _.has(payload, "filterType2") ? payload.filterType2 : []; // Format [{}]
}

/**
 * funcRenderDataStep3
 * @param payload, format is [object]
 * @returns {FuncStructureDataStep2}
 */
const funcRenderDataStep2 = (payload = {}) => {
    return new FuncStructureDataStep2(_.pick(payload, ["filterType1", "filterType2"]));
}

/**
 * FuncStructureDataStep3
 * @param payload
 * @constructor
 */
const FuncStructureDataStep3 = function (payload) {
    this.userIds = _.has(payload, "userIds") ? payload.userIds : [];  // Format [{}]
}

/**
 * funcRenderDataStep3
 * @param payload, format is [object]
 * @returns {FuncStructureDataStep3}
 */
const funcRenderDataStep3 = (payload = {}) => {
    return new FuncStructureDataStep3(_.pick(payload, ["userIds"]));
}

/**
 *
 * @param payload
 * @returns {*}
 */
const convertDataGetCCMain = (payload) => {
    let result = {}
    let findIndex = payload.findIndex(ele => ele.is_main_card === 1);
    return findIndex !== -1 ? payload[findIndex] : result;
}

const state = {
    step: 1,
    stepTotal: 5,
    step1: {},
    tempStep1: {},
    step2: {},
    tempStep2: {},
    step3: {},
    castShortcutForMerge: {},
    listCastMeetNow: [],
    loadingBook: false,
    notData: false,
    orderCastStatusType: "",
    discount: 0,
    isFetchCouponForOrder: false,
    detailReviewOfCast: {},
    detailInfoEditCard: {},
    detailInfoOrder: {},
    throwFetchData: "",
    declinedProcessWithPayment: false,
    listOrderOfUser: {},
}

const getters = {
    step: state => state.step,
    stepTotal: state => state.stepTotal,
    step1: state => state.step1,
    tempStep1: state => state.tempStep1,
    step2: state => state.step2,
    tmpStep2: state => state.tmpStep2,
    step3: state => state.step3,
    castShortcutForMerge: state => state.castShortcutForMerge,
    listCastMeetNow: state => state.listCastMeetNow,
    loadingBook: state => state.loadingBook,
    notData: state => state.notData,
    orderCastStatusType: state => state.orderCastStatusType,
    discount: state => state.discount,
    isFetchCouponForOrder: state => state.isFetchCouponForOrder,
    detailReviewOfCast: state => state.detailReviewOfCast,
    detailInfoOrder: state => state.detailInfoOrder,
    throwFetchData: state => state.throwFetchData,
    declinedProcessWithPayment: state => state.declinedProcessWithPayment,
    listOrderOfUser: state => state.listOrderOfUser,
}

const actions = {
    /**
     * Reset init data
     * @param commit
     * @param state
     * @param rootState
     * @param payload
     */
    initResetDataStoreDialogBookDispatch({commit, state, rootState}, payload) {
        // Call to mutations

        commit('bookResetDataMutation', payload);
        commit('notDataMutation', false);
        commit('orderCastStatusTypeMutation', "");
    },
    loadingBookDispatch({commit, state, rootState}, payload) {
        commit('loadingBookMutation', payload);
    },
    castShortcutForMergeDispatch({commit, state, rootState}, payload) {
        commit('castShortcutForMergeMutation', payload);
    },
    stepDispatch({commit, state, rootState}, step) {
        commit('stepMutation', +step);
    },
    copyStep1Dispatch({commit, state, rootState}, payload) {
        commit('updateTempStep1Mutation', funcRenderDataStep1(_.cloneDeep(state.step1)));
    },
    copyStep2Dispatch({commit, state, rootState}, payload) {
        commit('updateDataToTempStep2Mutation', funcRenderDataStep2(_.cloneDeep(state.step2)));
    },
    mergeDraftStep1ToStep1Dispatch({commit, state, rootState}) {
        commit('updateStep1Mutation', funcRenderDataStep1(_.cloneDeep(state.tempStep1)));
    },
    updateDataToStep2Dispatch({commit, state, rootState}, payload) {
        commit('updateDataToStep2Mutation', funcRenderDataStep2(payload));
    },
    resetTempStep1Dispatch({commit, state, rootState}, payload = {}) {
        commit('updateTempStep1Mutation', funcRenderDataStep1(payload));
    },
    resetTempStep2Dispatch({commit, state, rootState}, payload = {}) {
        commit('updateDataToTempStep2Mutation', funcRenderDataStep2(payload));
    },
    updateScheduleToJoinStep1Dispatch({commit, state, rootState}, payload) {
        let tmpStep1 = funcRenderDataStep1(payload);
        let isDraft = _.has(payload, "isDraft") && !!payload.isDraft;
        let cloneStep1 = isDraft ? _.cloneDeep(state.tempStep1) : _.cloneDeep(state.step1);
        // It's object
        let mergeScheduleToJoin = Object.assign({}, {...cloneStep1.scheduleToJoin, ...tmpStep1.scheduleToJoin});
        cloneStep1.scheduleToJoin = mergeScheduleToJoin;

        // Action change data
        if (isDraft) {
            commit('updateTempStep1Mutation', cloneStep1);
        } else {
            commit('updateStep1Mutation', Object.assign({}, tmpStep1, cloneStep1));
        }
    },
    updateNumCastMemberStep1Dispatch({commit, state, rootState}, payload) {
        let tmpStep1 = funcRenderDataStep1(payload);
        let isDraft = _.has(payload, "isDraft") && !!payload.isDraft;
        let cloneStep1 = isDraft ? _.cloneDeep(state.tempStep1) : _.cloneDeep(state.step1);
        // It's number
        cloneStep1.numOfCastMember = tmpStep1.numOfCastMember;

        // Action change data
        if (isDraft) {
            commit('updateTempStep1Mutation', cloneStep1);
        } else {
            commit('updateStep1Mutation', Object.assign({}, tmpStep1, cloneStep1));
        }
    },
    updateTimeHoursStep1Dispatch({commit, state, rootState}, payload) {
        let tmpStep1 = funcRenderDataStep1(payload);
        let isDraft = _.has(payload, "isDraft") && !!payload.isDraft;
        let cloneStep1 = isDraft ? _.cloneDeep(state.tempStep1) : _.cloneDeep(state.step1);
        // It's number
        cloneStep1.setTimeHours = tmpStep1.setTimeHours;

        // Action change data
        if (isDraft) {
            commit('updateTempStep1Mutation', cloneStep1);
        } else {
            commit('updateStep1Mutation', Object.assign({}, tmpStep1, cloneStep1));
        }
    },
    updateLocaleStep1Dispatch({commit, state, rootState}, payload) {
        let tmpStep1 = funcRenderDataStep1(payload);
        let isDraft = _.has(payload, "isDraft") && !!payload.isDraft;
        let cloneStep1 = isDraft ? _.cloneDeep(state.tempStep1) : _.cloneDeep(state.step1);
        // It's Object
        let mergeDataLocal = Object.assign({}, {...cloneStep1.location, ...tmpStep1.location});
        cloneStep1.location = mergeDataLocal;

        // Action change data
        if (isDraft) {
            commit('updateTempStep1Mutation', cloneStep1);
        } else {
            commit('updateStep1Mutation', Object.assign({}, tmpStep1, cloneStep1));
        }
    },
    updateCastClassStep1Dispatch({commit, state, rootState}, payload) {
        let tmpStep1 = funcRenderDataStep1(payload);
        let isDraft = _.has(payload, "isDraft") && !!payload.isDraft;
        let cloneStep1 = isDraft ? _.cloneDeep(state.tempStep1) : _.cloneDeep(state.step1);
        // It's Object
        let mergeCastClass = Object.assign({}, {...cloneStep1.castClass, ...tmpStep1.castClass});
        cloneStep1.castClass = mergeCastClass;

        // Action change data
        if (isDraft) {
            commit('updateTempStep1Mutation', cloneStep1);
        } else {
            commit('updateStep1Mutation', Object.assign({}, tmpStep1, cloneStep1));
        }
    },
    mergeDraftStep2ToStep2Dispatch({commit, state, rootState}) {
        commit('updateDataToStep2Mutation', funcRenderDataStep2(_.cloneDeep(state.tempStep2)));
    },
    addSituationForMergeDispatch({commit, state, rootState}, payload) {
        let {type, data} = payload
        if (!type || ["filter_1", "filter_2"].indexOf(type) === -1) {
            return;
        }
        let isDraft = _.has(payload, "isDraft") && !!payload.isDraft;
        let cloneStep2 = isDraft ? _.cloneDeep(state.tempStep2) : _.cloneDeep(state.step2);
        switch (type) {
            case "filter_1": {
                let formatData = funcRenderDataStep2({filterType1: [data]});
                cloneStep2.filterType1 = _.uniqBy([...cloneStep2.filterType1, ...formatData.filterType1], "id");

                // Action change data
                if (isDraft) {
                    commit('updateDataToTempStep2Mutation', cloneStep2);
                } else {
                    commit('updateDataToStep2Mutation', cloneStep2);
                }
                return;
            }
            case "filter_2": {
                let formatData2 = funcRenderDataStep2({filterType2: [data]});
                cloneStep2.filterType2 = _.uniqBy([...cloneStep2.filterType2, ...formatData2.filterType2], "id");

                // Action change data
                if (isDraft) {
                    commit('updateDataToTempStep2Mutation', cloneStep2);
                } else {
                    commit('updateDataToStep2Mutation', cloneStep2);
                }
                return;
            }
        }
    },
    removeSituationForMergeDispatch({commit, state, rootState}, payload) {
        let {type, id} = payload;
        if (!id || !type) {
            return;
        }
        let isDraft = _.has(payload, "isDraft") && !!payload.isDraft;
        let cloneStep2 = isDraft ? _.cloneDeep(state.tempStep2) : _.cloneDeep(state.step2);
        switch (type) {
            case "filter_1": {
                cloneStep2.filterType1 = _.cloneDeep(cloneStep2.filterType1 || []).filter(ele => ele.id !== id);

                // Action change data
                if (isDraft) {
                    commit('updateDataToTempStep2Mutation', cloneStep2);
                } else {
                    commit('updateDataToStep2Mutation', cloneStep2);
                }

                return;
            }
            case "filter_2": {
                cloneStep2.filterType2 = _.cloneDeep(cloneStep2.filterType2 || []).filter(ele => ele.id !== id);

                // Action change data
                if (isDraft) {
                    commit('updateDataToTempStep2Mutation', cloneStep2);
                } else {
                    commit('updateDataToStep2Mutation', cloneStep2);
                }

                return;
            }
        }
    },
    addCastForMergeDispatch({commit, state, rootState}, user) {
        if (!user || !_.has(user, "id")) {
            return;
        }
        let cloneStep3 = _.cloneDeep(state.step3);
        let formatData = funcRenderDataStep3({userIds: [user]});
        cloneStep3.userIds = _.uniqBy([...cloneStep3.userIds, ...formatData.userIds], "id");

        commit('updateDataToStep3Mutation', cloneStep3);
    },
    removeCastForMergeDispatch({commit, state, rootState}, payload) {
        let {userId} = payload;
        if (!userId) {
            return;
        }
        let cloneStep3 = _.cloneDeep(state.step3);
        cloneStep3.userIds = _.cloneDeep(cloneStep3.userIds || []).filter(ele => `${ele.id}` !== `${userId}`);

        commit('updateDataToStep3Mutation', cloneStep3);
    },
    resetCastForMergeDispatch({commit, state, rootState}, payload) {
        commit('updateDataToStep3Mutation', funcRenderDataStep3({}));
    },
    fetchCastMeetNowDispatch({commit, state, rootState}, payload) {
        bookService.fetchListCastMeetNow(payload)
            .then(result => {
                commit('loadingBookMutation', false);
                let tmp = _.cloneDeep(state.listCastMeetNow);
                if (payload.overwrite) {
                    tmp = [];
                }

                tmp = _.uniqBy(tmp.concat(result), "id");
                if (!result.length) {
                    commit('notDataMutation', true);
                }
                commit('listCastMeetNowMutation', tmp);
            })
            .catch(err => {
                commit('loadingBookMutation', false);
            })
    },
    fetchCouponForNewOrderDispatch({commit, state, rootState}, payload) {
        commit('isFetchCouponForOrderMutation', false);
        let priceDiscount = 0;
        bookService.fetchCouponForNewOrder(payload)
            .then(result => {
                commit('isFetchCouponForOrderMutation', true);

                if (_.isArray(result)) {
                    if (result.length) {
                        priceDiscount = result.map(ele => _.has(ele, "value") ? +ele.value : 0).reduce(function (accumulator, currentValue, currentIndex, array) {
                            return accumulator + currentValue;
                        });
                    }
                } else if (_.isObject(result) && _.has(result, "value")) {
                    priceDiscount = +result.value
                }

                commit('priceDiscountMutation', priceDiscount);
            })
            .catch(err => {
                commit('priceDiscountMutation', 0);
            })
    },
    requestOrderCastMeetNowDispatch({commit, state, rootState}, payload) {
        bookService.requestOrderCastMeetNow(payload)
            .then(async result => {
                await commit("detailInfoOrderMutation", result)
                await commit('loadingBookMutation', false);
                await commit('orderCastStatusTypeMutation', C.STATUS_REQUEST_ORDER_PROCESS.CREATE_ORDER_SUCCESS);
            })
            .catch(err => {
                // console.log("requestOrderCastMeetNowDispatch >> FAIL", err)
                commit('orderCastStatusTypeMutation', C.STATUS_REQUEST_ORDER_PROCESS.CREATE_ORDER_FAIL);
                commit('loadingBookMutation', false);
            })
    },
    async addDetailInfoEditCardDispatch({commit, state, rootState}, payload) {
        await commit('detailInfoEditCardMutation', payload);
        await commit('orderCastStatusTypeMutation', C.STATUS_REQUEST_ORDER_PROCESS.CREATE_ORDER_START);
    },
    requestPaymentAfterBookDispatch({commit, state, rootState}, payload) {
        let request = Object.assign({}, {
            data: {
                ..._.pick(payload, ["amount"]),
                order_id: state.detailInfoOrder.id,
                id: state.detailInfoEditCard.id
            }
        });

        bookService.requestPaymentAfterBook(request).then(async result => {
            await commit('loadingBookMutation', false);
            await commit('orderCastStatusTypeMutation', C.STATUS_REQUEST_ORDER_PROCESS.PAYMENT_ORDER_SUCCESS);
        }).catch(err => {
            // console.log("requestPaymentAfterBookDispatch >> FAIL", err)
            commit('loadingBookMutation', false);
            commit('orderCastStatusTypeMutation', C.STATUS_REQUEST_ORDER_PROCESS.PAYMENT_ORDER_THROW);
        })
    },
    requestThrowAfterBookDispatch({commit, state, rootState}, payload) {
        let idOrder = state.detailInfoOrder.id
        bookService.requestDeleteOrder(idOrder).then(async result => {
            await commit('loadingBookMutation', false);
            await commit('orderCastStatusTypeMutation', C.STATUS_REQUEST_ORDER_PROCESS.FINISH_PROCESS_ORDER);
        }).catch(err => {
            // console.log("requestThrowAfterBookDispatch >> FAIL", err)
            commit('loadingBookMutation', false);
            commit('orderCastStatusTypeMutation', C.STATUS_REQUEST_ORDER_PROCESS.FINISH_PROCESS_ORDER);
        })
    },
    fetchDetailReviewOfCastDispatch({commit, state, rootState}, payload) {
        bookService.fetchDetailReviewOfCast(payload)
            .then(async result => {
                let data = (_.isArray(result) && result.length ? result[0] : {});

                if (!Object.keys(data).length) {
                    commit('throwFetchDataMutation', "fetch_detail_review_cast");
                    return;
                }
                await commit('detailReviewOfCastMutation', data);
            })
            .catch(err => {
                commit('throwFetchDataMutation', "fetch_detail_review_cast");
                commit('loadingBookMutation', false);
            })
    },
    submitReviewOfCastDispatch({commit, state, rootState}, payload) {
        commit('loadingBookMutation', true);
        bookService.submitReviewOfCast(payload)
            .then(result => {
                commit('loadingBookMutation', false);
            })
            .catch(err => {
                commit('loadingBookMutation', false);
            })
    },
    getListCardByUserBeforeOrderDispatch({dispatch, commit}, payload) {
        paymentService.getCardInfos(payload.user_id).then(async result => {
            let data = _.has(result, "data") ? result.data : result
            if (_.isNull(data)) {
                await commit("declinedProcessWithPaymentMutation", true);
                return Promise.reject("Not data info payment")
            }
            let dataGetCCMain = await convertDataGetCCMain(data);

            await commit("declinedProcessWithPaymentMutation", false);
            await commit('detailInfoEditCardMutation', dataGetCCMain);
        }).catch(error => {
            // console.log(error)
            commit('detailInfoEditCardMutation', {});
        });
    },
    async changeStatusOrderByCastDispatch({dispatch, commit, rootState}, payloadEvent) {
        let {data, request} = payloadEvent
        if (request.roomId !== data.room_id) {
            console.warn("Not match data by roomId");
            return
        }
        let roomId = request.roomId
        let clone = _.cloneDeep(rootState.chat.listOrderForCast) // Object

        let keyRoomUser = `${roomId}_${rootState.user.user.id}`;

        if (clone[keyRoomUser] && _.has(clone[keyRoomUser], "status") && _.has(data, "status")) {
            clone[keyRoomUser].status = request.data.status
            await commit("listOrderForCastMutation", clone);
        }
    },
    confirmOrderByCastDispatch({dispatch, commit, rootState}, payload) {
        bookService.confirmOrderByCast(payload).then(async res => {
            let data = _.has(res, "data") ? res.data : res;

            if (!data || _.isNull(data)) {
                return Promise.reject("Not data")
            }
            if (payload.roomId !== data.room_id) {
                console.warn("Not match data by roomId");
                return Promise.reject("Not match for confirm")
            }

            await dispatch("changeStatusOrderByCastDispatch", {data: data, request: payload});
            await commit("statusOrderMatchingMutation", "CONFIRM_TIME_MATCHING_SUCCESS")
        }).catch(err => {
            console.warn(err)
            commit("statusOrderMatchingMutation", "PROCESS_MATCHING_THROW")
        })
    },
    cancelOrderByCastDispatch({dispatch, commit}, payload) {
        bookService.confirmOrderByCast(payload).then(async res => {
            let data = _.has(res, "data") ? res.data : res;

            if (!data || _.isNull(data)) {
                return Promise.reject("Not data")
            }

            if (payload.roomId !== data.room_id) {
                console.warn("Not match data by roomId");
                return Promise.reject("Not match for confirm")
            }

            await dispatch("changeStatusOrderByCastDispatch", {data: data, request: payload});
            await commit("statusOrderMatchingMutation", "CANCEL_TIME_MATCHING_SUCCESS")
        }).catch(err => {
            console.warn(err)
            commit("statusOrderMatchingMutation", "PROCESS_MATCHING_THROW")
        })
    },
    listOrderOfUserDispatch({dispatch, commit, rootState}, payload) {
        bookService.fetchListOrderOfUser(payload).then(async res => {
            let roomId = payload.roomId
            let keyRoomUser = `${roomId}_${rootState.user.user.id}`
            let data = _.has(res, "data") ? res.data : res;

            if (!data || _.isNull(data)) {
                return Promise.reject("Not data")
            }
            let clone = _.cloneDeep(state.listOrderOfUser) // Object
            let dataConvert = await appUtility.convertDataOrderOfUser(_.isArray(data) ? data : [data]);
            if (_.has(clone, keyRoomUser) && clone[keyRoomUser]) {
                let data = _.cloneDeep(clone[keyRoomUser].concat(dataConvert));
                clone[keyRoomUser] = _.orderBy(_.uniqBy(data, "id"), ["id"], ["desc"]);
            } else {
                clone[keyRoomUser] = _.orderBy(_.uniqBy(dataConvert, "id"), ["id"], ["desc"]);
            }

            await commit("listOrderOfUserMutation", clone);
        }).catch(err => {
            console.warn(err)
        })
    },
    cancelOrderOfUserByUserDispatch({dispatch, commit, rootState}, payload) {
        return bookService.cancelOrderOfUserByUser(payload).then(async res => {
            let roomId = payload.roomId
            let orderId = payload.orderId

            let keyRoomUser = `${roomId}_${rootState.user.user.id}`
            let clone = _.cloneDeep(state.listOrderOfUser) // Object

            if (_.has(clone, keyRoomUser) && clone[keyRoomUser]) {
                let data = _.cloneDeep(clone[keyRoomUser]);
                clone[keyRoomUser] = _.filter(data, element => +element.id !== +orderId)
                await commit("listOrderOfUserMutation", clone);
            }
            return res;
        }).catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
    }
}

// Action of method
const mutations = {
    bookResetDataMutation(state, payload) {
        state.step = 1
        state.step1 = funcRenderDataStep1(_.cloneDeep(state.step1));
        state.tempStep1 = funcRenderDataStep1({})
        state.step2 = funcRenderDataStep2({})
        state.tempStep2 = funcRenderDataStep2({})
        state.step3 = funcRenderDataStep3({})
        state.isShowCastShortcutForMerge = {}
        state.detailInfoEditCard = {}
        state.detailInfoOrder = {}
        state.throwFetchData = ""
        state.declinedProcessWithPayment = false

        // TODO
    },
    stepMutation(state, step) {
        state.step = JSON.parse(JSON.stringify(step));
    },
    updateStep1Mutation(state, step1) {
        state.step1 = JSON.parse(JSON.stringify(step1));
    },
    updateTempStep1Mutation(state, tempStep1) {
        state.tempStep1 = JSON.parse(JSON.stringify(tempStep1));
    },
    updateDataToStep2Mutation(state, step2) {
        state.step2 = JSON.parse(JSON.stringify(step2));
    },
    updateDataToTempStep2Mutation(state, tempStep2) {
        state.tempStep2 = JSON.parse(JSON.stringify(tempStep2));
    },
    updateDataToStep3Mutation(state, step3) {
        state.step3 = JSON.parse(JSON.stringify(step3));
    },
    castShortcutForMergeMutation(state, payload) {
        state.castShortcutForMerge = payload;
    },
    loadingBookMutation(state, value) {
        state.loadingBook = value;
    },
    listCastMeetNowMutation(state, data) {
        state.listCastMeetNow = data;
    },
    notDataMutation(state, value) {
        state.notData = value;
    },
    orderCastStatusTypeMutation(state, value) {
        state.orderCastStatusType = value;
    },
    priceDiscountMutation(state, value) {
        state.discount = value;
    },
    isFetchCouponForOrderMutation(state, value) {
        state.isFetchCouponForOrder = value;
    },
    detailReviewOfCastMutation(state, data) {
        state.detailReviewOfCast = data;
    },
    detailInfoEditCardMutation(state, data) {
        state.detailInfoEditCard = data;
    },
    detailInfoOrderMutation(state, data) {
        state.detailInfoOrder = data;
    },
    throwFetchDataMutation(state, value) {
        state.throwFetchData = value;
    },
    declinedProcessWithPaymentMutation(state, value) {
        state.declinedProcessWithPayment = value;
    },
    listOrderOfUserMutation(state, data) {
        state.listOrderOfUser = data;
    },
}

// Format export
export default {
    state,
    getters,
    actions,
    mutations
}
