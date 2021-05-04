import {api} from '../../_services';
import C from '../../utils/constants'

const state = {
    groupTags: [],
    residences: [],
    userGroupTags: [],
}

const getters = {
    groupTags: state => state.groupTags,
    residences: state => state.residences,
    userGroupTags: state => state.userGroupTags,
}

const actions = {
    getResidences: ({commit}) => {
        const options = {
            method: 'GET',
            url: `/master/list-residences`,
            headers: {'Content-Type': 'application/json'},
        };

        api(options)
            .then(response => {
                const residences = response.data;
                residences.unshift({id: null, value: '全国'});
                commit('setResidences', response.data);
            })
            .catch(error => {
                // console.log(error);
            });
    },

    getGroupTags: ({commit}, payload) => {
        const options = {
            method: 'GET',
            url: `/tag/getAllGroup`,
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, payload),
        };

        api(options)
            .then(response => {
                commit('setGroupTags', response.data);
            })
            .catch(error => {
                // console.log(error);
            });
    },

    getSearchCastResult: ({}, payload) => {
        const options = {
            method: 'GET',
            url: `/cast/search`,
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, payload),
        };

        return api(options);
    },

    getSearchUserResult: ({}, payload) => {
        const options = {
            method: 'GET',
            url: `/user/search`,
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, payload),
        };

        return api(options);
    },

    getUserGroupTags: ({commit}) => {
        const options = {
            method: 'GET',
            url: `/tag/getAllGroup`,
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, {type: C.TAG_TYPE.user}),
        };

        api(options)
            .then(response => {
                commit('setUserGroupTags', response.data);
            })
            .catch(error => {
                // console.log(error);
            });
    },
}

const mutations = {
    setGroupTags: (state, payload) => {
        state.groupTags = payload;
    },
    setUserGroupTags: (state, payload) => {
        state.userGroupTags = payload;
    },
    setResidences: (state, payload) => {
        state.residences = payload;
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
