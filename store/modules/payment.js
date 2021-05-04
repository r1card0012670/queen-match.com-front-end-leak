"use strict";


import {paymentService} from "../../_services";

const state = {
    isShowPaymentInfoDialog: false,
    payment: {},
    addPaymentFailure: {},
    addPaymentSuccess: {},
    getPaymentListSuccess: {},
    getPaymentListFailed: {},
    getCardDetailSuccess: {},
    getCardDetailFailed: {},
    deleteSuccess: {},
    deleteFailed: {},
    loading: true,
}

const getters = {
    payment: state => state.payment,
    isShowPaymentInfoDialog: state => state.isShowPaymentInfoDialog,
    addPaymentFailure: state => state.addPaymentFailure,
    addPaymentSuccess: state => state.addPaymentSuccess,
    getPaymentListSuccess: state => state.getPaymentListSuccess,
    getPaymentListFailed: state => state.getPaymentListFailed,
    getCardDetailSuccess: state => state.getCardDetailSuccess,
    getCardDetailFailed: state => state.getCardDetailFailed,
    deleteSuccess: state => state.deleteSuccess,
    deleteFailed: state => state.deleteFailed,
    loading: state => state.loading,
}

const actions = {
    /**
     * Reset init data
     * @param commit
     * @param state
     * @param rootState
     * @param payload
     */
    initResetDataStoreDialogPaymentDispatch({commit, state, rootState}, payload) {
        // Call to mutations

        commit('userResetDataMutation', payload);
    },
    isShowPaymentInfoDispatch({commit, state, rootState}, payload) {
        commit('isShowPaymentInfoMutation', payload);
    },

    addPaymentDispatch({dispatch, commit}, payload) {
        let self = this;
        paymentService.addPayment(payload)
            .then(result => {
                commit('addPaymentSuccessMutation', (_.has(result, "data") ? result.data : result));
            })
            .catch(error => {
                commit('addPaymentFailedMutation', _.has(error, "err") ? error.err : error);
                // dispatch('alert/error', error, {root: true});
            });
    },
    loadingDispatch({dispatch, commit}, value) {
        commit('loadingMutation', value)
    },
    getListCardByUserDispatch({dispatch, commit}, payload) {
        paymentService.getCardInfos(payload.user_id)
            .then(async result => {
                await dispatch('loadingDispatch', false)
                await commit('getPaymentListSuccessMutation', (_.has(result, "data") ? result.data : result));
            })
            .catch(error => {
                dispatch('loadingDispatch', false)
                commit('getPaymentListFailedMutation', _.has(error, "err") ? error.err : error);

                // dispatch('alert/error', error, {root: true});
            });
    },

    getCardDetailDispatch({dispatch, commit}, payload) {
        paymentService.getCardDetail(payload.payment_info_id)
            .then(result => {
                commit('getCardDetailSuccessMutation', (_.has(result, "data") ? result.data : result));
            })
            .catch(error => {
                commit('getCardDetailFailedMutation', _.has(error, "err") ? error.err : error);
                // dispatch('alert/error', error, {root: true});
            });
    },

    deleteCardDispatch({dispatch, commit}, payload) {
        paymentService.deleteCard(payload.payment_info_id)
            .then(result => {
                commit('deleteSuccessMutation', {});
            })
            .catch(error => {
                commit('deleteFailedMutation', _.has(error, "err") ? error.err : error);
                // dispatch('alert/error', error, {root: true});
            });
    },

    setMainCardDispatch({dispatch, commit}, payload) {
        paymentService.setMainCard(payload)
            .then(result => {
                commit('getPaymentListSuccessMutation', (_.has(result, "data") ? result.data : result))
            })
            .catch(error => {
            });
    },

}

// Action of method
const mutations = {
    userResetDataMutation(state, payload) {
        state.isShowPaymentInfoDialog = false;
        state.addPaymentFailure = {};
        // TODO
    },
    isShowPaymentInfoMutation(state, isShowPaymentInfoDialog) {
        state.isShowPaymentInfoDialog = isShowPaymentInfoDialog;
    },
    addPaymentFailedMutation(state, payload) {
        state.addPaymentFailure = payload;
    },
    addPaymentSuccessMutation(state, payload) {
        state.addPaymentSuccess = payload;
    },
    getPaymentListSuccessMutation(state, payload) {
        state.getPaymentListSuccess = payload;
    },
    getPaymentListFailedMutation(state, payload) {
        state.getPaymentListFailed = payload;
    },
    getCardDetailSuccessMutation(state, payload) {
        state.getCardDetailSuccess = payload;
    },
    getCardDetailFailedMutation(state, payload) {
        state.getCardDetailFailed = payload;
    },
    deleteSuccessMutation(state, payload) {
        state.deleteSuccess = true;
    },
    deleteFailedMutation(state, payload) {
        state.deleteFailed = payload;
    },
    loadingMutation(state, isLoading) {
        state.loading = isLoading;
    },
}

// Format export
export default {
    state,
    getters,
    actions,
    mutations
}
