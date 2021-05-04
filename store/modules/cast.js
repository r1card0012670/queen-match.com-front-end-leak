"use strict";


import {api, castService} from "../../_services";

const state = {
    showDialogFilterCast: false,
    showDialogFilterCastResult: false,
    filterCast: {},
    filterCastResults: {},
    searchCastCondition: {},
    prices: {},
    listWorkingTime: [],
    resultCallListWorkingTime: false,
}

const getters = {
    showDialogFilterCast: state => state.showDialogFilterCast,
    showDialogFilterCastResult: state => state.showDialogFilterCastResult,
    filterCast: state => state.filterCast,
    filterCastResults: state => state.filterCastResults,
    searchCastCondition: state => state.searchCastCondition,
    resultCallListWorkingTime: state => state.resultCallListWorkingTime,
    listWorkingTime: state => state.listWorkingTime,
    prices: state => state.prices
}

const actions = {
    initResetDataStoreDialogCastDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('showFilterCastRestDialogMutation', payload)
    },
    showDialogFilterCastDispatch({commit, dispatch, state, rootState}, payload) {
        // Call to mutations
        if (!_.has(payload, "isShow")) {
            return;
        }

        if (_.has(payload, "isShow")) {
            commit('showFilterCastDialogMutation', payload.isShow)
        }

        if (_.has(payload, "reset") && !!payload.reset) {

            commit('showDialogFilterCastDataResetMutation', {})
            return;
        }

        if (_.has(payload, "data")) {
            dispatch('showDialogFilterCastDataDispatch', {data: payload.data})
        }
    },
    showDialogFilterCastResultDispatch({commit, dispatch, state, rootState}, payload) {
        if (_.has(payload, "isShow")) {
            commit('setSearchCastConditions', payload.data);
            commit('showDialogFilterCastResultMutation', payload.isShow);
        }
    },
    showDialogFilterCastDataDispatch({commit, dispatch, state, rootState}, payload) {
        // Call to mutations
        if (!_.has(payload, "data")) {
            return;
        }

        if (_.has(payload, "data")) {
            commit('showFilterCastDataMutation', funcRenderDataItemFilterCast(payload.data));
        }
    },
    getPrices: ({commit}, payload) => {
        const options = {
            method: 'GET',
            url: '/cast/price',
            headers: {'Content-Type': 'application/json'},
        }

        api(options).then(response => {
            commit('setPrices', response.data);
        }).catch(error => {
            // console.log(error);
        })
    },
    applyOrder: ({}, payload) => {
        const options = {
            method: 'POST',
            url: `/order/${payload.orderId}/cast-apply`,
            headers: {'Content-Type': 'application/json'},
            data: Object.assign({}, _.pick(payload, ['note'])),
        }

        return api(options);
    },
    cancelOrder: ({}, payload) => {
        const options = {
            method: 'POST',
            url: `/order/${payload.orderId}/cast-cancel`,
            headers: {'Content-Type': 'application/json'},
        }

        return api(options);
    },
    getListWorkingTimeDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('setResultListWorkingTimeMutations', false);
        castService.getListWorkingTime(payload).then(res => {
            commit('setListWorkingTimeMutations', res.data.data);
            commit('setResultListWorkingTimeMutations', true);
        }).catch(err => {
            // console.log(err);
            commit('setResultListWorkingTimeMutations', true);
        })
    },

    updateListWorkingTimeDispatch({commit,state,rootState}, payload) {
        castService.updateWorkingTime(payload).then(res=>{
        }).catch(err=>{
            // console.log(err);
        })
    },
    getWorkingDays: ({}, payload) => {
        const options = {
            method: 'GET',
            url: '/working-time/get-working-day',
            params: Object.assign({}, _.pick(payload, ['startTime', 'endTime'])),
        }

        return api(options);
    },

    registerCast: ({}, payload) => {
        const options = {
            method: 'POST',
            url: '/auth/cast/register',
            headers: { "Content-Type": "multipart/form-data" },
            data: payload,
        }

        return api(options);
    }
}

// Action of method
const mutations = {
    /**
     * Reset init data
     * @param state
     * @param payload
     */
    showFilterCastRestDialogMutation(state, payload) {
        state.showDialogFilterCast = false;
        state.showDialogFilterCastResult = false;
        state.filterCast = {};
        state.filterCastResults = {};
        // TODO
    },
    showDialogFilterCastResultMutation(state, showDialogFilterCastResult) {
        state.showDialogFilterCastResult = showDialogFilterCastResult
    },
    showFilterCastDialogMutation(state, showDialogFilterCast) {
        state.showDialogFilterCast = showDialogFilterCast
    },
    showDialogFilterCastDataResetMutation(state, payload) {
        state.showDialogFilterCast = false
        state.filterCast = {}
    },
    showFilterCastDataMutation(state, data) {
        let tmp = _.cloneDeep(state.filterCast)

        state.filterCast = Object.assign({}, tmp, data)
    },
    setSearchCastConditions(state, data) {
        state.searchCastCondition = data;
    },
    setPrices(state, data) {
        state.prices = data;
    },
    setListWorkingTimeMutations(state, data) {
        state.listWorkingTime = data
    },
    setResultListWorkingTimeMutations(state, data) {
        state.resultCallListWorkingTime = data;

    },
}

// ---------------------------------------------------------------------------------------------------------------------
/**
 *
 * @param payload, format is object
 * @constructor
 */
const StructureDataItemFilterCast = function (payload) {
    this.inputCastName = _.has(payload, "inputCastName") ? payload.inputCastName : "";

    this.locationCast = _.has(payload, "locationCast") ? payload.locationCast : "";
    this.listClassCast = _.has(payload, "listClassCast") ? payload.listClassCast : [];
    this.listHashtagCast = _.has(payload, "listHashtagCast") ? payload.listHashtagCast : [];
    this.scheduleCast = _.has(payload, "scheduleCast") ? payload.scheduleCast : {};
    this.zonePriceCast = _.has(payload, "zonePriceCast") ? payload.zonePriceCast : null;
    this.isPostLatestByCast = _.has(payload, "isPostLatestByCast") ? payload.isPostLatestByCast : false;
    this.isBirthdayMonthOfCast = _.has(payload, "isBirthdayMonthOfCast") ? payload.isBirthdayMonthOfCast : false;
    this.txtNickNameOfCast = _.has(payload, "txtNickNameOfCast") ? payload.txtNickNameOfCast : "";
}

/**
 *
 * @param payload, It's format object
 * @returns {StructureDataItemFilterCast}
 */
const funcRenderDataItemFilterCast = (payload) => {
    return new StructureDataItemFilterCast(_.pick(payload, ["inputCastName", "age", "sex", "phone", "avatar"]));
}


// Format export
export default {
    state,
    getters,
    actions,
    mutations
}
