"use strict";
import {TYPE_ROLE_USER} from "../../utils/constant";
import {storyService} from '../../_services';

const state = {
    showFeedCreateDialog: false,
    showFeedDetailDialog: false,
    showFeedHashTagDialog: false,
    showFeedEditDialog: false,
    showFeedSearchDialog: {},
    feedDetail: {},
    listFeedDetail: [],
    feedCreateOrEdit: {},
    selectLocal: {},
    castList: [],
    userList: [],
    listFeedSearch: [],
    isVisibleCastLoadingIcon: true,
    isVisibleUserLoadingIcon: true,
    isVisibleSearchFeedLoadingIcon: true,
    totalDataSearch: 0,
    loadDataFeedSuccess: true,
    isSearchSuccess: false,
}

const getters = {
    showFeedCreateDialog: state => state.showFeedCreateDialog,
    showFeedDetailDialog: state => state.showFeedDetailDialog,
    showFeedHashTagDialog: state => state.showFeedHashTagDialog,
    showFeedEditDialog: state => state.showFeedEditDialog,
    feedCreateOrEdit: state => state.feedCreateOrEdit,
    selectLocal: state => state.selectLocal,
    showFeedSearchDialog: state => state.showFeedSearchDialog,
    feedDetail: state => state.feedDetail,
    listFeedDetail: state => state.listFeedDetail,
    isSearchSuccess: state => state.isSearchSuccess,
}

const actions = {
    initResetDataStoreDialogFeedDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('showFeedRestDialogMutation', payload)
    },
    showFeedSearchDialogDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('showFeedSearchDialogMutation', payload)
    },
    showFeedCreateDialogDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('showFeedCreateDialogMutation', payload)
    },
    showFeedEditDialogDispatch({commit, state, rootState}, payload) {
        // Call to mutations

        if (!_.has(payload, "isShow")) {
            return;
        }

        if (_.has(payload, "isShow")) {
            commit('showFeedEditDialogMutation', payload.isShow)
        }

        if (_.has(payload, "data")) {
            commit('showFeedDetailDialogMutation', {isShow: payload.isShow, data: payload.data})
        }
    },
    // showListFeed({commit, state, rootState}, payload) {
    //     // Call to mutations
    //     storyService.getAllStory(payload)
    //         .then(async sessionStory => {
    //             let clone = _.cloneDeep(state.feedDetail);
    //             let data = await convertDatafeedDetail({clone, sessionStory: sessionStory.data.data, role: payload.role});
    //
    //             // debugger
    //             // if (payload.role === TYPE_ROLE_USER.TYPE_CAST) {
    //             //     let castList = _.has(clone, "casts") ? clone.casts : [];
    //             //
    //             //     let dataUser = castList.concat(...sessionStory.data.data)
    //             //     clone.casts = dataUser
    //             //     commit("feedDetailMutations", clone)
    //             //
    //             // } else if (payload.role === TYPE_ROLE_USER.TYPE_USER) {
    //             //     let userList = _.has(clone, "users") ? clone.users : [];
    //             //
    //             //     let dataUser = userList.concat(...sessionStory.data.data)
    //             //     clone.users = dataUser
    //             //
    //             //     commit("feedDetailMutations", clone)
    //             // }
    //             await commit("feedDetailMutations", data)
    //         })
    //         .catch(error => {
    //             console.log(error)
    //             // dispatch('alert/error', error, {root: true});
    //         });
    // },
    showFeedDetailDialogDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        if (!_.has(payload, "isShow") || !_.has(payload, "data")) {
            return;
        }

        if (_.has(payload, "isShow") && _.has(payload, "data") && !!payload.isShow) {
            commit('showFeedDetailDialogMutation', Object.assign({}, payload, {isShow: true}))
        }

        if (_.has(payload, "isShow") && _.has(payload, "data") && !payload.isShow) {
            commit('showFeedDetailDialogMutation', Object.assign({}, payload, {isShow: false, data: {}}))
        }
    },
    showFeedHashTagDialogDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        if (!_.has(payload, "isShow")) {
            return;
        }

        commit('showFeedHashTagDialogMutation', payload.isShow);
        if (_.has(payload, "dataFeed") && _.isObject(payload.dataFeed)) {
            commit('feedCreateOrEditDialogMutation', payload.dataFeed);
        }
    },
    hiddenPostDispatch({commit, state, rootState}, payload) {
        let data = {
            story_post_id: payload
        }
        storyService.hiddenPost(data).then(data =>{
            if (data.status) {
                // console.log('hidden post success!');
            }
        }).catch(err => {
            // console.log(err);
        })
    },
    createFeedDispatch({commit, state, rootState}, payload) {
       return storyService.createStory(payload)
    },
    deletePostStoryDispatch({commit, state, rootState}, payload) {
        storyService.deleteStory(payload).then(data =>{
            if (data.status) {
                // console.log('hidden post success!');
            }
        }).catch(err => {
            // console.log(err);
        })
    },
    selectLocalDispatch({commit, state, rootState}, payload) {
        commit('selectLocalMutation', payload)
    },
    loadMoreFeedDataDispatch({commit, state, rootState}, payload) {
        storyService.getAllStory(payload).then(res => {
            if (res.data && res.data.data) {
                if (payload.role === TYPE_ROLE_USER.TYPE_CAST) {
                    let dataClone = _.cloneDeep(state.castList)
                    let listFeedCast = dataClone.concat(res.data.data);
                    commit('loadDataCastListFeedMutation', listFeedCast)
                    commit('resetCastLoadingIcon', res.data.data.length === 0)

                } else if (payload.role === TYPE_ROLE_USER.TYPE_USER) {
                    let dataClone = _.cloneDeep(state.userList)
                    let listFeedUser = dataClone.concat(res.data.data);
                    commit('loadDataUserListFeedMutation', listFeedUser)
                    commit('resetUserLoadingIcon', res.data.data.length === 0)
                } else {
                    let dataClone = _.cloneDeep(state.listFeedSearch)
                    let listFeedSearch = dataClone.concat(res.data.data);
                    commit('loadDataSearchFeedMutation', listFeedSearch)
                    commit('resetDataTotalSearchMutation', res.data.total)
                    commit('resetFeedSearchLoadingIcon', res.data.data.length === 0)
                    commit('setSearchSuccessMutation', true)
                }
            }
        })
    },
    async fetchListStoryByUserIdOrCastId({dispatch, state, commit}, payload) {
        return storyService.fetchListStoryByUserIdOrCastId(payload.userIdOrCastId, payload).then(async result => {
            // Array

            let clone = _.cloneDeep(state.listFeedDetail);
            let data = await convertDatafeedDetail({clone, sessionStory: result.data, role: payload.role});

            await commit("listFeedDetailMutations", data)
        }).catch(error => {

        });
    },
}

// Action of method
const mutations = {
    /**
     * Reset init data
     * @param state
     * @param payload
     */
    showFeedRestDialogMutation(state, payload) {
        state.feedDetail = {};
        state.showFeedCreateDialog = false;
        state.showFeedDetailDialog = false;
        state.showFeedHashTagDialog = false;
        state.showFeedEditDialog = false;
        state.showFeedSearchDialog = {};
        state.feedCreateOrEdit = {};
        // TODO
    },
    showFeedCreateDialogMutation(state, showFeedCreateDialog) {
        state.showFeedCreateDialog = showFeedCreateDialog
    },
    showFeedSearchDialogMutation(state, showFeedSearchDialog) {
        state.showFeedSearchDialog = showFeedSearchDialog
    },
    showFeedEditDialogMutation(state, showFeedEditDialog) {
        state.showFeedEditDialog = showFeedEditDialog
    },
    showFeedDetailDialogMutation(state, payload) {
        if (_.has(payload, "isShow")) {
            state.showFeedDetailDialog = payload.isShow
        }
        if (_.has(payload, "data")) {
            state.feedDetail = payload.data
        }
    },
    showFeedHashTagDialogMutation(state, showFeedHashTagDialog) {
        state.showFeedHashTagDialog = showFeedHashTagDialog
    },
    feedCreateOrEditDialogMutation(state, feedCreateOrEdit) {
        state.feedCreateOrEdit.user = feedCreateOrEdit
    },
    feedDetailMutations(state, data) {
        state.feedDetail = data
    },
    listFeedDetailMutations(state, data) {
        state.listFeedDetail = data
    },
    loadDataUserListFeedMutation(state, data){
        state.userList = data
    },
    loadDataCastListFeedMutation(state, data){
        state.castList = data
    },
    loadDataSearchFeedMutation(state, data){
        state.listFeedSearch = data
    },
    resetCastLoadingIcon(state, value) {
        state.isVisibleCastLoadingIcon = value
    },
    resetUserLoadingIcon(state, value) {
        state.isVisibleUserLoadingIcon = value
    },
    resetFeedSearchLoadingIcon(state, value) {
        state.isVisibleSearchFeedLoadingIcon = value
    },
    resetDataTotalSearchMutation(state, value) {
        state.totalDataSearch = value
    },
    selectLocalMutation(state, data) {
        if (data.id) {
            state.selectLocal = [data.id];
        } else {
            state.selectLocal = [];
        }
    },
    setDataFeedSuccessMutation(state, data) {
        state.loadDataFeedSuccess = data;
    },
    setSearchSuccessMutation(state, data) {
        state.isSearchSuccess = data;
    }
}

// ---------------------------------------------------------------------------------------------------------------------

/**
 *
 * @param payload
 * @returns {*}
 * @constructor
 */
const convertDatafeedDetail = (payload) => {
    let clone = payload.clone;

    if (_.isArray(clone)) {
        return clone.concat(...payload.sessionStory);
    }

    if (payload.role === TYPE_ROLE_USER.TYPE_CAST) {
        let castList = _.has(clone, "casts") ? clone.casts : [];

        clone.casts = castList.concat(...payload.sessionStory)

    } else if (payload.role === TYPE_ROLE_USER.TYPE_USER) {
        let userList = _.has(clone, "users") ? clone.users : [];

        clone.users = userList.concat(...payload.sessionStory)
    }

    return clone;
}


// Format export
export default {
    state,
    getters,
    actions,
    mutations
}
