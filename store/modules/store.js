"use strict";

import {storeService} from "../../_services";

const state = {
    getListStores: [],
    getListNewStores: [],
    stopLoadMore: false,
    loadingStore: false,
    getListNearestStores: [],
}

const getters = {
    getListStores: state => state.getListStores,
    getListNewStores: state => state.getListNewStores,
    stopLoadMore: state => state.stopLoadMore,
    loadingStore: state => state.loadingStore,
    getListNearestStores: state => state.getListNearestStores,
};

const actions = {
    getListStoresDispatch({dispatch, commit, state}, payload) {
        commit('loadingStore', true);
        storeService.getAllStores(payload)
            .then(result => {
                commit('loadingStore', false);
                let tmp = _.cloneDeep(state.getListStores);
                tmp = _.uniqBy(tmp.concat(result), "id");
                if (!result.length) {
                    commit('stopLoadMutation', true);
                }
                commit('getListStoresSuccessMutation', tmp);
            })
            .catch(error => {
                commit('loadingStore', false);
                // console.log(error);
            });
    },

    getListNewStoresDispatch({dispatch, commit}, payload) {
        commit('loadingStore', true);
        storeService.getListNewStores(payload)
            .then(result => {
                commit('loadingStore', false);
                let tmp = _.cloneDeep(state.getListNewStores);
                tmp = _.uniqBy(tmp.concat(result), "id");
                if (!result.length) {
                    commit('stopLoadMutation', true);
                }
                commit('getListNewStoresSuccessMutation', tmp);
            })
            .catch(error => {
                commit('loadingStore', false);
                // console.log(error);
            });
    },

    getListNearestStoresDispatch({dispatch, commit}, payload) {
        commit('loadingStore', true);
        storeService.getListNearestStores(payload)
            .then(result => {
                commit('loadingStore', false);
                let tmp = _.cloneDeep(state.getListNearestStores);
                tmp = _.uniqBy(tmp.concat(result), "id");
                if (!result.length) {
                    commit('stopLoadMutation', true);
                }
                commit('getListNearestStoresSuccessMutation', tmp);
            })
            .catch(error => {
                // console.log(error);
                commit('loadingStore', false);
            });
    },
};

// Action of method
const mutations = {
    getListStoresSuccessMutation(state, value) {
        state.getListStores = value;
    },
    getListNewStoresSuccessMutation(state, value) {
        state.getListNewStores = value;
    },
    stopLoadMutation(state, value) {
        state.stopLoadMore = value;
    },
    loadingStore(state, value) {
        state.loadingStore = value;
    },
    getListNearestStoresSuccessMutation(state, value) {
        state.getListNearestStores = value;
    },
};

// Format export
export default {
    state,
    getters,
    actions,
    mutations
}
