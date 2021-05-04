"use strict";
import C from './../../utils/constants'
import {chatService} from "../../_services";

const state = {
    // currentMonth: 5,
    // currentYear: 2019,
    // balanceCharges: 0,
    // balanceDeposits: 0,
    // currentType: C.TABS,
    // defineTabs: [],
    // tabActive: {},
    // infoShowDetail: {},
    windowHeight: 0,
    windowWidth: 0,
    customScrollContentHeight: 0,
    activeNavBottom: true,
    activeItem: "/",
    isShowListNotify: false,
    numBadgeChat: 0,
}

const getters = {
    // defineTabs: state => state.defineTabs,
    // currentType: state => state.currentType,
    // tabActive: state => state.tabActive,
    numBadgeChat: state => state.numBadgeChat,
    windowHeight: state => state.windowHeight,
    windowWidth: state => state.windowWidth,
    customScrollContentHeight: state => state.customScrollContentHeight,
    activeNavBottom: state => state.activeNavBottom,
    activeItem: state => state.activeItem,
    isShowListNotify: state => state.isShowListNotify,
}


const actions = {
    initResetDataStoreDialogMainDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        state.isShowListNotify = false;
        // TODO
    },
    activeItemDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('activeItemMutation', payload)
    },
    activeNavBottomDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('activeNavBottomMutation', payload)
    },
    windowHeightDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('windowHeightMutation', payload)
    },
    customScrollContentHeightDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('customScrollContentHeightMutation', payload)
    },
    windowWidthDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('windowWidthMutation', payload)
    },
    defineTabsDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('defineTabMutation', payload)
    },
    currentTypeDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('currentTypeMutation', payload)
    },
    tabActiveDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('tabActiveMutation', payload);

        if (payload.hasOwnProperty("type") && payload.type === C.TABS) {
            commit('currentTypeMutation', payload.type)
            commit('infoShowDetailMutation', {})
        }
    },
    infoShowDetailDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('infoShowDetailMutation', payload);

        if (payload && payload.hasOwnProperty("isShow") && !!payload.isShow) {
            commit('currentTypeMutation', C.DETAIL)
        }
    },
    isShowListNotifyDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('isShowListNotifyMutation', payload);
    },
    fetchNumUnreadMessageDispatch({commit, state, rootState}, payload) {
        chatService.fetchNumUnreadMessage(payload).then(res => {
            commit('numBadgeChatMutation', +res.data);
        }).catch(err => {
            commit('numBadgeChatMutation', 0);
        })
    },
}

// Action of method
const mutations = {
    activeItemMutation(state, stringActiveItem) {
        state.activeItem = stringActiveItem;
    },
    activeNavBottomMutation(state, activeNavBottom) {
        state.activeNavBottom = activeNavBottom;
    },
    windowHeightMutation(state, windowHeight) {
        state.windowHeight = windowHeight;
    },
    customScrollContentHeightMutation(state, customScrollContentHeight) {
        state.customScrollContentHeight = customScrollContentHeight;
    },
    windowWidthMutation(state, windowWidth) {
        state.windowWidth = windowWidth;
    },
    defineTabMutation(state, data) {
        state.defineTabs = data;
    },
    currentTypeMutation(state, data) {
        state.currentType = data;
    },
    tabActiveMutation(state, data) {
        state.tabActive = data;
    },
    infoShowDetailMutation(state, data) {
        state.infoShowDetail = data;
    },
    isShowListNotifyMutation(state, isShowListNotify) {
        state.isShowListNotify = isShowListNotify;
    },
    numBadgeChatMutation(state, num) {
        state.numBadgeChat = num;
    },
}


// Format export
export default {
    state,
    getters,
    actions,
    mutations
}
