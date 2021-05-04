"use strict";

import {imageService} from "../../_services";

const state = {
    getUserImages: [],
    isShowErrorDialog: false,
    userData: {}
}

const getters = {
    getUserImages: state => state.getUserImages,
};

const actions = {
    /**
     * Reset init data
     * @param commit
     * @param state
     * @param rootState
     * @param payload
     */
    uploadImageDispatch({dispatch, state, commit, rootState}, payload) {
        imageService.uploadImage(payload)
            .then(async result => {
                let tmp = _.cloneDeep(state.getUserImages);
                let data = (_.has(result, "data") ? result.data : result);
                tmp.push(data);

                commit("getUserImagesSuccessMutation", tmp);

                // Update data
                let userId = +data.user_id;
                let findIndex = _.findLastIndex(rootState.user.listUserOrCastInfoShow, (ele) => ele.id === userId);
                if (findIndex !== -1) {
                    let cloneDataUser = _.cloneDeep(rootState.user.listUserOrCastInfoShow[findIndex]);
                    cloneDataUser.images = tmp.length ? tmp : [];
                    cloneDataUser.user_images = tmp.length ? tmp : [];

                    rootState.user.listUserOrCastInfoShow[findIndex] = cloneDataUser
                }
            })
            .catch(error => {
                commit('isShowErrorDialog', true);
                // dispatch('alert/error', error, {root: true});
            });
    },
    isShowErrorDialogDispatch({dispatch, commit}, payload) {
        commit("isShowErrorDialog", payload)
    },
    deleteUserImageDispatch({dispatch, commit, rootState}, payload) {
        imageService.deleteUserImage(payload.image_id)
            .then(async result => {
                let tmp = _.cloneDeep(state.getUserImages);
                let listImg = tmp.filter(ele => ele.id !== payload.image_id);

                commit("getUserImagesSuccessMutation", listImg);

                // Update data
                let userId = _.has(payload, "user_id") ? +payload.user_id: "";
                let findIndex = _.findLastIndex(rootState.user.listUserOrCastInfoShow, (ele) => ele.id === userId);
                if (findIndex !== -1) {
                    let cloneDataUser = _.cloneDeep(rootState.user.listUserOrCastInfoShow[findIndex]);
                    cloneDataUser.images = tmp.length ? tmp : [];
                    cloneDataUser.user_images = tmp.length ? tmp : [];

                    rootState.user.listUserOrCastInfoShow[findIndex] = cloneDataUser
                }
            })
            .catch(error => {
                // dispatch('alert/error', error, {root: true});
            });
    },
    changeImageDispatch({dispatch, commit, rootState}, payload) {
        imageService.changeImage(payload.formData)
            .then(async result => {
                let tmp = _.cloneDeep(state.getUserImages);
                let data = (_.has(result, "data") ? result.data : result);
                let index = tmp.findIndex(ele => ele.id === payload.imageId);
                tmp[index] = data;

                commit("getUserImagesSuccessMutation", tmp);

                let userId = data.user_id;
                // Update data
                let findIndex = _.findLastIndex(rootState.user.listUserOrCastInfoShow, (ele) => ele.id === userId);
                if (findIndex !== -1) {
                    let cloneDataUser = _.cloneDeep(rootState.user.listUserOrCastInfoShow[findIndex]);
                    cloneDataUser.images = tmp.length ? tmp : [];
                    cloneDataUser.user_images = tmp.length ? tmp : [];

                    rootState.user.listUserOrCastInfoShow[findIndex] = cloneDataUser
                }
            })
            .catch(error => {
                // console.log(error);
                commit('isShowErrorDialog', true);
                // dispatch('alert/error', error, {root: true});
            });
    },
    setAsAvatarDispatch({commit, dispatch, state, rootState}, payload) {
        imageService.setAsAvatar(payload)
            .then(async result => {
                // listUserOrCastInfoShow
                let cloneUserNew = JSON.parse(JSON.stringify(_.cloneDeep(rootState.user.user)));

                let tmp = _.cloneDeep(state.getUserImages);
                let list = tmp.filter(ele => ele.id !== payload.image_id);
                let data = (_.has(result, "data") ? result.data : result);
                list.unshift(data);
                list[1].set_as_avatar = 0;
                await commit("getUserImagesSuccessMutation", list)

                cloneUserNew.images = list.length ? list : [];
                cloneUserNew.user_images = list.length ? list : [];

                await dispatch("updateEditProfileDispatch", cloneUserNew);
                commit('isFetchDataFinishMutation', true);
                // await commit("userMutation", cloneUserNew);
            })
            .catch(error => {
                // dispatch('alert/error', error, {root: true});
            });
    },
    async updateEditProfileDispatch({commit, dispatch, state, rootState}, userUpdate) {
        let cloneUser = JSON.parse(JSON.stringify(_.cloneDeep(rootState.user.user)));
        let cloneUserNew = Object.assign({}, _.cloneDeep(cloneUser), _.cloneDeep(userUpdate));

        await commit("getCurrentUserInfoSuccessMutation", cloneUserNew);
        await commit("listUserOrCastInfoShowMutation", cloneUserNew);
    },
};

// Action of method
const mutations = {
    getUserImagesSuccessMutation(state, value) {
        value.sort((a, b) => parseFloat(b.set_as_avatar) - parseFloat(a.set_as_avatar));
        state.getUserImages = value;
    },
    isShowErrorDialog(state, value) {
        state.isShowErrorDialog = value;
    },
    userDataMutation(state, value) {
        state.userData = value;
    },
};

// Format export
export default {
    state,
    getters,
    actions,
    mutations
}
