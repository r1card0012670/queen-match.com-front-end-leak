"use strict";

import {infoService} from "../../_services";

const state = {
    getInfoManagement: [],
}

const getters = {
    getInfoManagement: state => state.getInfoManagement,

};

const actions = {
    getInfoManagementDispatch({dispatch, commit}, payload) {
        infoService.getAll()
            .then(result => {
                commit('getInfoManagementSuccessMutation', (_.has(result, "data") ? result.data : result));
            })
            .catch(error => {
                // dispatch('alert/error', error, {root: true});
            });
    },
};

// Action of method
const mutations = {
    getInfoManagementSuccessMutation(state, value) {
        state.getInfoManagement = value;
    },
};

// Format export
export default {
    state,
    getters,
    actions,
    mutations
}
