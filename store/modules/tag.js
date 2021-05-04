"use strict";
import {tagService} from '../../_services';

const state = {
    groupTagDetail: {},
    tagAllFilterGroupByType: {},
    tagAll: [],
}

const getters = {
    groupTagDetail: state => state.groupTagDetail,
    tagAllFilterGroupByType: state => state.tagAllFilterGroupByType,
    tagAll: state => state.tagAll,
}

const actions = {
    showListGroupTag({commit, state, rootState}, payload) {
        // Call to mutations
        tagService.getAllGroupTag(payload)
            .then(sessionStory => {
                commit("groupTagDetailMutations", sessionStory.data ?? [])
            })
            .catch(error => {
                // console.log(error)
                // dispatch('alert/error', error, {root: true});
            });
    },
    fetchAllTagByTypeDispatch({commit, state, rootState}, payload) {
        tagService.getAllGroupTagByType(payload)
            .then(async result => {
                let data = await filterGroupTagUseAll((result || []));

                commit("allTagByTypeMutation", data)
            })
            .catch(error => {
                // console.log(error)
            });
    }
}

// Action of method
const mutations = {
    /**
     * Reset init data
     * @param state
     * @param data
     */
    groupTagDetailMutations(state, data) {
        state.groupTagDetail = data
    },
    tagAllMutation(state, data) {
        state.tagAll = data
    },
    allTagByTypeMutation(state, data) {
        state.tagAllFilterGroupByType = data
    }
}

/**
 *
 * @param tagAll
 * @param type
 * @returns {{}}
 */
function filterGroupTagUseAll(tagAll, type = "") {
    return (tagAll || []).map(ele => {
        let tmp = (!_.has(ele, "tags") || !_.isArray(ele.tags)) ? [] : ele.tags;
        if (!type) {
            ele.tags = tmp
        } else {
            ele.tags = tmp.filter(item => _.has(item, "type") && `${item.type}` === `${type}`)
        }

        return ele;
    });
}

// Format export
export default {
    state,
    getters,
    actions,
    mutations
}
