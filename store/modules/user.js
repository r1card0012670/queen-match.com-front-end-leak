"use strict";
import {api, userService} from '../../_services';
import router from '../../router';
import {decodeToken, getUser, setSocialLine, setUser} from "../../utils/auth"
import {LIMIT_NUMBER_FEED_IN_USER_PROFILE, TYPE_ROLE_USER} from "../../utils/constant";
import appUtility from './../../utils/app-utility.js';


const state = {
    isShowMyQRCodeDialog: false,
    isSettingProfile: false,
    isDetailSettingProfile: false,
    isRegisterEmailLine: false,
    itemDialogUserProfiles: [],
    user: {},
    role: "",
    loginLineInfo: {},
    status: {},
    itemUsers: [],  // Fake data
    isLoginWithLine: false,
    registerCheckEmailLine: {},
    isLoginWithEmail: false,
    isRegisterWithEmail: false,
    isUpdateProfile: false,
    isVisibilityMyProfile: false,
    errorLoginMessage: "",
    registerFailure: {},
    resetPwdByEmailSuccess: false,
    errorFailureAlert: {},
    getHistoriesPoint: {},
    getCurrentPoint: {},
    getCurrentUserInfo: {},
    showDialogFilterUser: false,
    loadingPoint: false,
    isFetchDataFinish: false,
    fetchDataViewProfile: {},
    // userInfoShow: {},
    listUserOrCastInfoShow: [],
    infoFollowUserOrCast: [],
    listUserOrCast: [],
    alert: "",
    detailThreadRoomChat: {},
    referrerCode: null,
}

const getters = {
    role: state => state.role,
    user: state => state.user,
    resultBlockUser: state => state.resultBlockUser,
    status: state => state.status,
    errorLoginMessage: state => state.errorLoginMessage,
    registerFailure: state => state.registerFailure,
    isShowMyQRCodeDialog: state => state.isShowMyQRCodeDialog,
    isSettingProfile: state => state.isSettingProfile,
    isDetailSettingProfile: state => state.isDetailSettingProfile,
    itemDialogUserProfiles: state => state.itemDialogUserProfiles,
    itemUsers: state => state.itemUsers,
    isLoginWithLine: state => state.isLoginWithLine,
    registerCheckEmailLine: state => state.registerCheckEmailLine,
    isLoginWithEmail: state => state.isLoginWithEmail,
    isRegisterWithEmail: state => state.isRegisterWithEmail,
    isRegisterEmailLine: state => state.isRegisterEmailLine,
    resetPwdByEmailSuccess: state => state.resetPwdByEmailSuccess,
    loginLineInfo: state => state.loginLineInfo,
    errorFailureAlert: state => state.errorFailureAlert,
    isUpdateProfile: state => state.isUpdateProfile,
    isVisibilityMyProfile: state => state.isVisibilityMyProfile,
    getHistoriesPoint: state => state.getHistoriesPoint,
    getCurrentPoint: state => state.getCurrentPoint,
    getCurrentUserInfo: state => state.getCurrentUserInfo,
    showDialogFilterUser: state => state.showDialogFilterUser,
    loadingPoint: state => state.loadingPoint,
    isFetchDataFinish: state => state.isFetchDataFinish,
    fetchDataViewProfile: state => state.fetchDataViewProfile,
    // userInfoShow: state => state.userInfoShow,
    listUserOrCastInfoShow: state => state.listUserOrCastInfoShow,
    infoFollowUserOrCast: state => state.infoFollowUserOrCast,
    listUserOrCast: state => state.listUserOrCast,
    alert: state => state.alert,
    detailThreadRoomChat: state => state.detailThreadRoomChat,
    referrerCode: state => state.referrerCode,
}

const actions = {
    /**
     * Reset init data
     * @param commit
     * @param state
     * @param rootState
     * @param payload
     */
    initResetDataStoreDialogUserDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        commit('isUpdateProfileMutation', false);
        commit('isVisibilityMyProfileMutation', false);
        commit('getListItemUserResetMutation', payload);
        commit('userResetDataMutation', payload);
    },
    userDispatch({commit, state, rootState}, payload) {
        commit('userMutation', appUtility.funcRenderDataItemUserClone(payload));
    },
    isUpdateProfileDispatch({commit, state, rootState}, payload) {
        commit('isUpdateProfileMutation', payload);
    },
    isVisibilityMyProfileDispatch({commit, state, rootState}, payload) {
        commit('isVisibilityMyProfileMutation', payload);
    },
    updateUserDispatch({commit, dispatch, state, rootState}, payload) {
        let user = getUser();

        dispatch('userDispatch', user);
    },
    roleDispatch({dispatch, commit, state, rootState}, payload = {}) {
        let keyDefined = Object.keys(TYPE_ROLE_USER).map(key => TYPE_ROLE_USER[key]);
        let getRole = decodeToken();

        if (getRole && _.has(getRole, "role") && _.indexOf(keyDefined, getRole.role) !== -1) {
            commit('roleMutation', getRole.role);
        }
    },
    isLoggedDispatch({commit, state, rootState}, payload) {
        commit('isLoggedInMutation', payload);
    },
    isLoginWithEmailDispatch({commit, state, rootState}, payload) {
        commit('isLoginWithEmailMutation', payload);
    },
    isLoginWithLineDispatch({commit, state, rootState}, payload) {
        commit('isLoginWithLineMutation', payload);
    },
    isRegisterWithEmailDispatch({commit, state, rootState}, payload) {
        commit('isRegisterWithEmailMutation', payload);
    },
    isSettingProfileDialogDispatch({commit, state, rootState}, payload) {
        commit('isSettingProfileDialogMutation', payload);
    },
    isDetailSettingProfileDialogDispatch({commit, state, rootState}, payload) {
        commit('isDetailSettingProfileDialogMutation', payload);
    },
    isShowMyQRCodeDialogDispatch({commit, state, rootState}, payload) {
        commit('isShowMyQRCodeDialogMutation', payload);
    },
    getHistoriesPointDispatch({dispatch, commit}, payload) {
        let userId = payload.user_id;
        commit('loadingPoint', true);
        userService.getPointHistories(userId).then(
            result => {
                commit('loadingPoint', false);
                commit("getHistoriesPointSuccessMutation", (_.has(result, "data") ? result.data : result));
            },
            error => {
                commit('loadingPoint', false);
                // console.log("getHistoriesPointDispatch ERR >", error)
                // dispatch('alert/error', error, {root: true});
            }
        );
    },
    getCurrentUserInfoDispatch({dispatch, commit, rootState}, payload) {
        let userId = payload.user_id;
        commit('loadingPoint', true);
        userService.getById(userId).then(
            result => {
                dispatch('getUserOrCastByIdDispatch', (_.has(result, "data") ? result.data : result));
                commit('loadingPoint', false);
                let cloneUserNew = appUtility.funcRenderDataItemUserClone(_.has(result, "data") ? result.data : result);
                commit("getCurrentUserInfoSuccessMutation", cloneUserNew);

                if (`${cloneUserNew.id}` === `${userId}`) {
                    setUser(cloneUserNew);
                    commit("userMutation", _.cloneDeep(cloneUserNew));
                }

                commit("listUserOrCastInfoShowMutation", cloneUserNew);
            },
            error => {
                commit('loadingPoint', false);
                // console.log("getCurrentUserInfoDispatch ERR >", error)
                // dispatch('alert/error', error, {root: true});
            }
        );
    },
    updateCurrentUserDispatch({dispatch, commit, state, rootState}, payload) {
        userService.update(payload).then(
            async result => {
                let cloneUserNew = appUtility.funcRenderDataItemUserClone(_.has(result, "data") ? result.data : result);

                // listUserOrCastInfoShow
                let clone = _.cloneDeep(rootState.user.user);
                let mergeData = Object.assign({}, clone, cloneUserNew);
                await commit("getCurrentUserInfoSuccessMutation", mergeData);
                // await commit("userInfoShowMutation", mergeData);
                await commit("listUserOrCastInfoShowMutation", mergeData);
            },
            error => {
                // console.log("updateCurrentUserDispatch ERR >", error)
                // dispatch('alert/error', error, {root: true});
            }
        );
    },
    updateBlockNotiCurrentUser({dispatch, commit, state, rootState}, payload) {
        userService.update(payload).then(res => {

        }).catch(err => {
            // console.log(err);
        })
    },
    getCurrentPointDispatch({dispatch, commit}, payload) {
        let userId = payload.user_id;
        commit('loadingPoint', true);
        userService.getCurrentPoint(userId).then(
            result => {
                commit('loadingPoint', false);
                commit("getCurrentPointSuccessMutation", (_.has(result, "data") ? result.data : result));
            },
            error => {
                commit('loadingPoint', false);
                // console.log("getCurrentPointDispatch ERR >", error)
                // dispatch('alert/error', error, {root: true});
            }
        );
    },
    itemDialogUserProfilesDispatch({commit, state, rootState}, payload) {
        // Call to mutations
        if (!_.has(payload, "act") || !_.has(payload, "data")) {
            return;
        }
        if (payload.act === "ADD") {
            commit('itemDialogUserProfileAddMutation', funcRenderDataItemDialog({...payload.data}))
        } else if (payload.act === "SUB") {
            commit('itemDialogUserProfileSubMutation', funcRenderDataItemDialog({...payload.data}))
        } else if (payload.act === "RESET") {
            commit('itemDialogUserProfileResetMutation', payload)
        }
    },
    loginDispatch({dispatch, commit}, payload) {
        let self = this;
        userService.login(payload).then(
            result => {
                dispatch("accessLoginAfterSuccessDispatch", (_.has(result, "data.user") ? result.data.user : result));
            },
            error => {
                commit('loginFailureMutation', error);
                // dispatch('alert/error', error, {root: true});
            }
        );
    },
    registerByEmailDispatch({dispatch, commit}, payload) {
        let self = this;
        userService.registerByEmail(payload)
            .then(sessionUser => {
                commit('registerFailureMutation', {});

                dispatch("accessLoginAfterSuccessDispatch", _.has(sessionUser, "data") ? sessionUser.data : sessionUser);
            })
            .catch(error => {
                commit('registerFailureMutation', _.has(error, "err") ? error.err : error);
                // dispatch('alert/error', error, {root: true});
            });
    },
    forgotPasswordSendEmailDispatch({dispatch, commit}, payload) {
        let self = this;
        userService.forgotPasswordSendEmail(payload).then(
            sessionUser => {
                // TODO Your use logic in here
            },
            error => {
                // console.log("forgotPasswordSendEmailDispatch ERR >", error)
                // dispatch('alert/error', error, {root: true});
            }
        );
    },
    async accessLoginAfterSuccessDispatch({dispatch, commit}, user, option = {}) {
        if (_.has(user, "roles")) {
            delete user.roles
        }
        if (_.has(user, "role")) {
            delete user.role
        }
        await setUser(user);
        await commit('loginSuccessMutation', user);

        await dispatch('activeNavBottomDispatch', true);
        await commit('isRegisterEmailLineMutation', false);
        await commit('errorFailureAlertMutation', {});
        // Set role
        await dispatch('roleDispatch');

        window.location.href = "/home"
    },
    checkAddRegisterEmailForLineDispatch({dispatch, commit}, payload) {
        let self = this;
        userService.loginWithLineCheckExist(Object.assign({}, payload)).then(result => {
            commit("registerCheckEmailLineMutation", {isExist: !!result});

            if (!!result) {
                return false;
            }

            return true
        }).then(result => {
            if (result) {
                dispatch("loginWithLineAddRegisterEmailDispatch", payload)
            }
        }).catch(err => {
            router.replace({name: 'Login', force: true});
        });
    },
    loginWithLineAddRegisterEmailDispatch({dispatch, commit}, payload) {
        let self = this;
        if (!_.has(state, "loginLineInfo.user.userId")) {
            router.replace({name: 'Login', force: true});
            return;
        }

        userService.addRegisterEmailForLoinLine(Object.assign({}, payload, {identifier: state.loginLineInfo.user.userId})).then(result => {
            commit("setLoginLineSuccessMutation", Object.assign({}, {
                socialLine: (_.has(state, "loginLineInfo")
                    ? Object.assign({}, {..._.pick(state.loginLineInfo, ["user", "accessToken", "idToken"])})
                    : {}),
                // user: (_.has(result, "data") ? result.data : result)
            }));

            return _.has(result, "data") ? result.data : result
        }).then(sessionUser => {
            dispatch("accessLoginAfterSuccessDispatch", sessionUser)
        }).catch(err => {
            commit("registerCheckEmailLineMutation", {loginFailure: err});
        });
    },
    async loginWithLineDispatch({dispatch, commit}, payload) {
        let self = this;
        let {code} = payload;
        let user = {};
        await userService.getTokenWithLine(code)
            .then(data => {
                if (data) {
                    return userService.getProfileWithLine(data.accessToken)
                        .then(sessionUser => {
                            user = sessionUser;
                            return userService.checkExistIdentifierOfLineOrLogin({identifier: user.userId}).catch(err => {
                                // Handle check err
                                if (_.has(err, "err.type") && err.err.type === 'ERROR_001') {
                                    return true;
                                } else {
                                    return Promise.reject(err);
                                }
                            });
                        })
                        .then(async result => {
                            await commit("loginLineInfoMutation", Object.assign({}, data, {user}));

                            if (_.isObject(result)) {
                                // Set login
                                await commit("setLoginLineSuccessMutation", Object.assign({}, data));

                                return _.has(user, "data") ? user.data : user;
                            }
                            if (_.has(user, "email") && user.email) {
                                // Not show Popup required email
                                await commit('isRegisterEmailLineMutation', false);

                                // console.log("TODO: isRegisterEmailLineMutation: >> false>> Auto", user)

                                await dispatch("loginWithLineAddRegisterEmailDispatch", {email: user.email})

                                return false
                            } else {
                                // Show Popup required email
                                await commit('isRegisterEmailLineMutation', true);

                                return false
                            }
                        })
                        .then(result => {
                            if (!!result && user) {
                                dispatch("accessLoginAfterSuccessDispatch", user)
                            }
                        })
                        .catch(err => {
                            return Promise.reject(err)
                        })
                }
            })
            .catch(error => {
                // console.log(error)
                // commit('loginFailureMutation', error);
                // dispatch('alert/error', error, {root: true});

                router.replace({name: 'Login', force: true});
            });
    },
    logoutDispatch({dispatch, commit}, payload) {
        userService.logout((_.has(payload, "isRedirect") ? payload.isRedirect : true));
        dispatch('activeNavBottomDispatch', false);

        dispatch('isLoggedDispatch');
        commit('logoutMutation');
    },
    resetPasswordViaEmailTokenDispatch({commit, state, rootState}, payload) {

        userService.resetPasswordViaEmailToken(payload).then(async data => {
            // Redirect to screen login
            commit("alertMutation", "パスワードを更新しました。");
            commit("resetPwdByEmailSuccessMutation", true);
        }).catch(err => {
            commit("errorFailureAlertMutation", (_.has(err, "err") ? err.err : err))
        })
    },
    // getListItemUserDispatch({commit, state, rootState}, payload) {
    //     // TODO
    //     // Vue.axios.get('/transaction/balance/' + state.currentYear + '/' + state.currentMonth,
    //     //     {headers: {'userId': rootState.user.userId}})
    //     //     .then(resp => {
    //     //         console.log('Get transaction/balance', resp)
    //     //         let data = resp.data
    //     //         if (data && data.length > 0) {
    //
    //     // TODO
    //     // Fake
    //     let fakeData = Array(40).fill(1).map((ele, index) => ({
    //         id: Math.random().toString(36).substring(7),
    //         value: ele
    //     }))
    //
    //     //
    //     fakeData.push({id: 'userId', value: "userId"})
    //     // Call to mutations
    //     let users = fakeData.map(ele => appUtility.funcRenderDataItemUserClone(fakeData))
    //     commit('getListItemUserAddMutation', users)
    //     //             commit('balanceDeposits', data[0].deposits)
    //     //         } else {
    //     //             // Call to mutations
    //     //             commit('balanceCharges', 0)
    //     //             commit('balanceDeposits', 0)
    //     //         }
    //     //     })
    //     //     .catch(err => {
    //     //         console.log('transaction js - transaction/balance: ' + err)
    //     //     })
    // },
    blockUserDispatch({commit, state, rootState}, block_user_id) {
        let data = {
            user_id: state.user.id,
            block_user_id: block_user_id
        }
        userService.blockUser(data).then(data => {
            if (data.status) {
                state.resultBlockUser = true;
                // console.log('block success!');
            }
        }).catch(err => {
            // console.log(err);
        })
    },
    getNewUsers: ({}, payload) => {
        const options = {
            method: 'GET',
            url: `/user/new-for-cast`,
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, _.pick(payload, ['page'])),
        };

        return api(options);
    },
    getRankedUsers: ({}, payload) => {
        const options = {
            method: 'GET',
            url: `/user/ranked-for-cast`,
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, _.pick(payload, [])),
        };

        return api(options);
    },
    getRecommendedUserForCast: ({}, payload) => {
        const options = {
            method: 'GET',
            url: `/user/recommended-for-cast`,
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, _.pick(payload, ['page'])),
        };

        return api(options);
    },
    showDialogFilterUser: ({commit}, payload) => {
        commit('showFilterUserDialogMutation', payload);
    },
    fetchUserInfoByAliasDispatch({dispatch, commit, state, rootState}, payload) {
        commit('isFetchDataFinishMutation', false);

        userService.fetchUserOrCastInfoByAlias(payload).then(async data => {
            let user = _.has(data, "data") ? data.data : data;
            await commit('fetchDataViewProfileMutation', user);
            return user;
        }).then(user => {
            return user
        }).then(async results => {
            commit('isFetchDataFinishMutation', true);
            // TODO
        }).catch(err => {
            // Error
            commit('fetchDataViewProfileMutation', Object.assign({}));
            commit('isFetchDataFinishMutation', true);

            // console.log(err);
        });
    },
    fetchDataUserOrCastByIdDispatch({dispatch, state, rootState, commit}, payload) {
        commit('isFetchDataFinishMutation', false);

        // INIT USER PROFILE
        Promise.resolve().then(() => {
            if (_.has(payload, "fetchDataBeforeById") && payload.fetchDataBeforeById) {
                return payload.fetchDataBeforeById
            }

            return userService.getById(payload.id).then(async res => {
                return res.data
            }).catch(error => {
                return Promise.reject(error);
            });
        }).then(async user => {
            if (!(_.has(payload, "fetchDataBeforeById") && payload.fetchDataBeforeById)) {
                await dispatch("getUserOrCastByIdDispatch", user);
            }

            return Promise.all([
                dispatch("fetchFollowedUserOrCastByIdDispatch", payload),
                dispatch("fetchListStoryByUserIdOrCastId", Object.assign({}, payload, {
                    userIdOrCastId: payload.id,
                    params: {
                        limit: LIMIT_NUMBER_FEED_IN_USER_PROFILE,
                        role: _.has(payload, "options.role.role") ? payload.options.role.role : null,
                    },
                    role: _.has(payload, "options.role.role") ? payload.options.role.role : null, // Required
                })),
                // userService.fetchListUserOrCast(payloadForFetch),
                Promise.resolve({}),
                {user: user}
            ]);
        }).then(async results => {
            let user = results[3].user;

            // let listUserOrCast = _.has(results[2], "data") ? results[2].data : results[2];
            // let convertListUserOrCast = appUtility.funcRenderDataItemUserClone(listUserOrCast);

            if (!(_.has(payload, "fetchDataBeforeById") && payload.fetchDataBeforeById)) {
                // await commit('listUserOrCastMutation', convertListUserOrCast);
            }

            let listImg = (user.user_images || []);
            let tmp = _.cloneDeep(rootState.image.getUserImages);

            tmp = tmp.concat(listImg);

            await commit("getUserImagesSuccessMutation", tmp)

        }).then(async results => {
            await commit('isFetchDataFinishMutation', true);
        }).catch(error => {
            commit('isFetchDataFinishMutation', true);

            // console.log("user::fetchDataUserOrCastByIdDispatch ERR >", error)
            // dispatch('alert/error', error, {root: true});
        });
    },
    async getUserOrCastByIdDispatch({dispatch, state, commit}, result) {
        // Convert data object to array
        let user = await appUtility.funcRenderDataItemUserClone(_.has(result, "data") ? result.data : result);

        if (`${user.id}` === `${state.user.id}`) {
            // setUser(user);
            commit("userMutation", user);
        }
        // Set image
        let listImage = _.has(user, "images") ? user.images : [];

        await commit('getUserImagesSuccessMutation', listImage);
        // await commit("userInfoShowMutation", user);
        await commit("listUserOrCastInfoShowMutation", user);
    },
    async fetchFollowedUserOrCastByIdDispatch({dispatch, state, commit}, payload) {
        return userService.fetchListTargetFollowed().then(async listTargetFollowed => {
            let clone = _.cloneDeep(state.infoFollowUserOrCast);

            // Array id target followed
            let convertData = await funcMapTargetFollowedId({listTargetFollowed, sessionUserOrCastId: state.user.id})

            await commit("infoFollowUserOrCastMutation", _.uniq(clone.concat(convertData)));
        }).catch(error => {
        });
    },
    userORCastFollowDispatch({dispatch, state, commit}, payload) {
        userService.mapUserORCastFollow(payload).then(async result => {
            // Convert data object to array
            let clone = _.cloneDeep(state.infoFollowUserOrCast);
            clone.push(payload.target); // Id session user login

            await commit("infoFollowUserOrCastMutation", _.uniq(clone));
        }).catch(error => {
            // dispatch('alert/error', error, {root: true});
        });
    },
    userRequestCreateRoomDispatch({dispatch, state, commit}, payload) {
        return userService.userRequestCreateRoom(payload).then(async result => {
            // Convert data object to array
            let data = _.has(result, "data") ? result.data : result

            let dataFormat = await appUtility.convertDataRoomListChat([data], state.user.id);

            await commit("detailThreadRoomChatMutation", dataFormat[0]);
        }).catch(error => {
            commit("detailThreadRoomChatMutation", {});
        });
    },
    detailThreadChatRoomDispatch({dispatch, state, commit}, payload) {
        return userService.detailThreadRoomChatBySingle(payload).then(async result => {
            let data = _.has(result, "data") ? result.data : result

            return await appUtility.convertDataRoomListChat([data], state.user.id)[0];
        }).catch(error => {
            return Promise.reject(error)
        });
    },
    updateStatusNotiDispatch({dispatch, state, commit}, data) {
        userService.updateStatusNoti(data).then(async result => {
            let user = await appUtility.funcRenderDataItemUserClone(_.has(result, "data") ? result.data : result);

            if (`${user.id}` === `${state.user.id}`) {
                // setUser(data);
                commit("userMutation", user);
            }
        }).catch(err => {
            // console.log(err);
        })
    },
    eventBlockUserChannelDispatch({dispatch, state, commit}, payload) {
        return userService.eventBlockUserChannel(payload).then(async res => {
            let statusData = +(_.isBoolean(res) ? res : false);

            if (statusData) {
                let isBlock = ""
                if (payload.data.act_block_channel_single === 'unblock') {
                    isBlock = 0
                } else if (payload.data.act_block_channel_single === 'block') {
                    isBlock = 1;
                } else {
                    return false
                }

                await dispatch("updateStoreListRoomByFieldIsBlockDispatch", {isBlock, roomId: payload.roomId});
            }

            return statusData
        }).catch(err => {
            return false
        })
    },
    fetchCheckBlockUserDispatch({dispatch, state, commit}, payload) {
        return userService.fetchCheckBlockUser(payload).then(res => {
            return  _.isBoolean(res) ? res : false
        }).catch(err => {
            // Not use via block
            return false
        })
    }
}

// Action of method
const mutations = {
    userResetDataMutation(state, payload) {
        state.isShowMyQRCodeDialog = false;
        state.isSettingProfile = false;
        state.isLoginWithLine = false;
        state.isLoginWithEmail = false;
        state.isRegisterWithEmail = false;
        state.isRegisterEmailLine = false;
        state.errorLoginMessage = "";
        state.registerFailure = {};
        state.registerCheckEmailLine = {};
        state.errorFailureAlert = {};
        state.resetPwdByEmailSuccess = false;
        state.isFetchDataFinish = false;
        state.fetchDataViewProfile = {};
        state.listUserOrCast = [];
        state.listUserOrCastInfoShow = [];
        state.alert = "";
        // TODO
    },
    /**
     *
     * @param state
     * @param items, it's array
     * not use
     */
    // getListItemUserAddMutation(state, items) {
    //     let tmpState = _.cloneDeep(state.itemUsers);
    //     (items || []).forEach(ele => {
    //         if (_.has(ele, "id")) {
    //             tmpState.push(ele);
    //         }
    //     });
    //
    //     state.itemUsers = _.uniqBy(tmpState, 'id');
    // },
    /**
     *
     * @param state
     * @param items, it's object
     * not use
     */
    // getListItemUserSubMutation(state, items) {
    //     if (!_.has(items, "id")) {
    //         return;
    //     }
    //     state.itemUsers = _.cloneDeep(state.itemUsers)
    //         .filter(ele => _.has(ele, "id") && ele.id !== items.id);
    // },
    /**
     * Reset data
     * @param state
     * @param payload
     */
    getListItemUserResetMutation(state, payload) {
        state.itemUsers = [];
    },
    userMutation(state, payload) {
        let clone = _.cloneDeep(state.user);
        state.user = Object.assign({}, clone, payload);
    },
    loginFailureMutation(state, payload) {
        state.status = {};
        state.user = null;
        state.errorLoginMessage = _.isString(payload)
            ? payload
            : _.isObject(payload) && _.has(payload, "err.message") && _.has(payload, "err.type") && payload.err.type === "ERROR_005" ? payload.err.message
                : _.isObject(payload) && _.has(payload, "statusText") ? payload.statusText : ""
    },
    registerFailureMutation(state, payload) {
        state.registerFailure = payload
    },
    loginSuccessMutation(state, user) {
        state.status = {loggedIn: true};
        state.user = user;
        state.errorLoginMessage = ""
        // state.isLoggedIn = true;
    },
    logoutMutation(state) {
        // state.isLoggedIn = false;
        state.user = {}
    },
    roleMutation(state, role) {
        state.role = role;
    },
    isLoggedInMutation(state, isLoggedIn) {
        // state.isLoggedIn = isLoggedIn;
    },
    isShowMyQRCodeDialogMutation(state, isShowMyQRCodeDialog) {
        state.isShowMyQRCodeDialog = isShowMyQRCodeDialog;
    },
    isSettingProfileDialogMutation(state, isSettingProfile) {
        state.isSettingProfile = isSettingProfile;
    },
    isDetailSettingProfileDialogMutation(state, isDetailSettingProfile) {
        state.isDetailSettingProfile = isDetailSettingProfile;
    },
    isLoginWithLineMutation(state, isLoginWithLine) {
        state.isLoginWithLine = isLoginWithLine;
    },
    isLoginWithEmailMutation(state, isLoginWithEmail) {
        state.isLoginWithEmail = isLoginWithEmail;
    },
    isRegisterWithEmailMutation(state, isRegisterWithEmail) {
        state.isRegisterWithEmail = isRegisterWithEmail;
    },
    isRegisterEmailLineMutation(state, isRegisterEmailLine) {
        state.isRegisterEmailLine = isRegisterEmailLine;
    },
    loginLineInfoMutation(state, loginLineInfo) {
        state.loginLineInfo = loginLineInfo;
    },
    registerCheckEmailLineMutation(state, registerCheckEmailLine) {
        state.registerCheckEmailLine = registerCheckEmailLine;
    },
    setLoginLineSuccessMutation(state, payload) {
        if (payload.hasOwnProperty("socialLine")) {
            if (_.has(payload, "socialLine.user.userId")) {
                delete payload.socialLine.user.userId;
            }
            setSocialLine(payload.socialLine);
        }
    },
    errorFailureAlertMutation(state, errorFailureAlert) {
        state.errorFailureAlert = errorFailureAlert
    },
    isUpdateProfileMutation(state, value) {
        state.isUpdateProfile = value
    },
    isVisibilityMyProfileMutation(state, value) {
        state.isVisibilityMyProfile = value
    },
    getHistoriesPointSuccessMutation(state, value) {
        state.getHistoriesPoint = value
    },
    getCurrentPointSuccessMutation(state, value) {
        state.getCurrentPoint = value
    },
    getCurrentUserInfoSuccessMutation(state, value) {
        state.getCurrentUserInfo = value
    },
    showFilterUserDialogMutation(state, payload) {
        state.showDialogFilterUser = payload
    },
    loadingPoint(state, value) {
        state.loadingPoint = value;
    },
    isFetchDataFinishMutation(state, value) {
        state.isFetchDataFinish = value;
    },
    fetchDataViewProfileMutation(state, value) {
        state.fetchDataViewProfile = value;
    },
    // userInfoShowMutation(state, data) {
    // state.userInfoShow = data;
    // },
    listUserOrCastInfoShowMutation(state, data) {
        // Pull to array not filter
        state.listUserOrCastInfoShow.push(data);
    },
    infoFollowUserOrCastMutation(state, data) {
        state.infoFollowUserOrCast = data;
    },
    listUserOrCastMutation(state, data) {
        state.listUserOrCast = data;
    },
    alertMutation(state, value) {
        state.alert = value;
    },
    resetPwdByEmailSuccessMutation(state, value) {
        state.resetPwdByEmailSuccess = value;
    },
    detailThreadRoomChatMutation(state, data) {
        state.detailThreadRoomChat = data;
    },
    setReferrerCode: (state, data) => {
        state.referrerCode = data;
    }
}
// ---------------------------------------------------------------------------------------------------------------------

/**
 *
 * @param payload, format is object
 * @constructor
 */
const FuncStructureDataItemDialog = function (payload) {
    this.id = payload.id;
    this.type = payload.type;

    if (_.has(payload, "oldType")) {
        this.oldType = payload.oldType
    }

    if (_.has(payload, "options")) {
        this.options = payload.options
    }
    // TODO
}

/**
 *
 * @param payload, format is object
 * @returns {FuncStructureDataItemDialog}
 */
const funcRenderDataItemDialog = (payload) => {
    return new FuncStructureDataItemDialog(_.pick(payload, ["id", "type", "oldType", "options"]));
}

/**
 *
 * @param payload
 * @returns {Array}
 */
const funcMapTargetFollowedId = (payload) => {
    let convertData = [];

    (payload.listTargetFollowed || []).forEach(ele => {
        if (_.has(ele, "user_id")) {
            convertData.push(ele.user_id)
        }
        if (_.has(ele, "cast_id")) {
            convertData.push(ele.cast_id)
        }
    })

    return _.uniq(convertData.filter(key => key !== payload.sessionUserOrCastId)); // Array id target followed
}

// /**
//  *
//  * @param payload
//  * @returns {{isNotFetch: (boolean|boolean), params: {[p: string]: *}}|*}
//  */
// const renderDataCast = (payload) => {
//     return {
//         params: {
//             ...Object.assign({}, _.pick(payload.user, ["height", "residence", "birth_place", "literacy", "annual_income",
//                 "job", "sake", "tobacco", "siblings", "cohabitant"]), {})
//
//             // suggest-list?height=1&residence=100&birth_place&literacy&annual_income&job&sake&tobacco&siblings&cohabitant
//         },
//     }
// }
//
// /**
//  *
//  * @param user
//  * @returns {{role: (string), roles: (Array|*[])}}
//  */
// const renderRole = (user) => {
//     let roles = user.roles
//         ? _.compact(user.roles.map(ele => (_.has(ele, "role_name") ? `${ele.role_name}` : null)))
//         : [];
//
//     let role = _.indexOf(roles, TYPE_ROLE_USER.TYPE_CAST) !== -1
//         ? TYPE_ROLE_USER.TYPE_CAST
//         : _.indexOf(roles, TYPE_ROLE_USER.TYPE_USER) !== -1
//             ? TYPE_ROLE_USER.TYPE_USER : null
//
//     return {
//         roles,
//         role
//     }
// }


// Format export
export default {
    state,
    getters,
    actions,
    mutations
}
