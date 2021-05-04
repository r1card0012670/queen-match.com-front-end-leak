"use strict";

const {TYPE_ROLE_USER} = require("./../utils/constant")

import {
    CLIENT_DOMAIN_SECRET,
    CLIENT_ID,
    CLIENT_REDIRECT,
    isTokenExpired,
    methodLogout,
    setAccessToken,
    setIdToken,
    setUser,
} from "../utils/auth"
import axios from "axios";
import queryString from "querystring";
import {api} from "./api";

export const userService = {
    login,
    logout: methodLogout,
    registerByEmail,
    getAll,
    getById,
    update,
    updateStatusNoti,
    delete: _delete,
    getTokenWithLine,
    getProfileWithLine,
    checkFriendWithLine,
    addRegisterEmailForLoinLine,
    loginWithLineCheckExist,
    forgotPasswordSendEmail,
    checkExistIdentifierOfLineOrLogin,
    resetPasswordViaEmailToken,
    blockUser,
    getPointHistories,
    getCurrentPoint,
    fetchUserOrCastInfoByAlias,
    mapUserORCastFollow,
    fetchListTargetFollowed,
    fetchListUserOrCast,
    userRequestCreateRoom,
    detailThreadRoomChatBySingle,
    eventBlockUserChannel,
    fetchCheckBlockUser,
};

function OAuthRequest(payload) {
    this.grant_type = 'authorization_code'
    this.client_id = payload.clientId
    this.client_secret = payload.clientSecret
    this.redirect_uri = payload.redirectUri
    this.code = payload.code
}

function OAuthResult(payload) {
    this.accessToken = payload.access_token
    this.expiresIn = payload.expires_in
    this.refreshToken = payload.refresh_token
    this.idToken = payload.id_token
    this.scope = payload.scope
    this.tokenType = 'Bearer'

    this.data = payload
}

/**
 * login
 * @param payload
 * @returns {Promise<*>}
 */
function login(payload) {
    let requestOptions = {
        method: 'POST',
        url: '/auth/login',
        data: Object.assign({}, _.pick(payload, ["email", "password"]))
    };

    return api(requestOptions)
        .then(result => {
            // login successful if there's a jwt token in the response
            // Has key data
            if (_.has(result, "data.access_token")) {
                if (isTokenExpired(result.data.access_token)) {
                    return Promise.reject("Token expired")
                }

                // store user details and jwt token in local storage to keep user logged in between page refreshes
                setAccessToken(result.data.access_token);
                setIdToken(result.data.access_token);
            }
            if (_.has(result, "data.user")) {
                setUser(result.data.user)
            }

            return result;
        }).catch(error => {
            // console.log(error)

            return Promise.reject(error);
        });
}

/**
 * registerByEmail
 * @param payload
 * @returns {Promise<*>}
 */
function registerByEmail(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/auth/register`,
        headers: {'Content-Type': 'application/json'},
        data: Object.assign({}, _.pick(payload, ["email", "password_confirmation", "password", 'ref']), {
            type: TYPE_ROLE_USER.TYPE_CAST
        })
    };

    return api(requestOptions).then(async result => {
        if (_.has(result, "access_token") && !isTokenExpired(result.access_token)) {

            setAccessToken(result.access_token);
            setIdToken(result.access_token);
            // if (_.has(result, "data")) {
            //     setUser(result.data)
            // }

            return result;
        }

        return Promise.reject("Token miss match")
    }).catch(err => {
        setAccessToken("");
        setIdToken("");
        return Promise.reject(err);
    });
}

/**
 * Forgot Password by Send Email
 * @param payload
 * @returns {Promise<*>}
 */
function forgotPasswordSendEmail(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/auth/forgot`,
        headers: {'Content-Type': 'application/json'},
        data: Object.assign({}, _.pick(payload, ["email"]))
    };

    return api(requestOptions).then(result => {
        return result;
    }).catch(err => {
        return Promise.reject(err);
    });
}

/**
 *
 * @param payload
 * @returns {Promise<*>}
 */
function resetPasswordViaEmailToken(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/auth/password/reset`,
        headers: {'Content-Type': 'application/json'},
        data: Object.assign({}, _.pick(payload, ["email", "token", "password", "password_confirmation"]))
    };

    return api(requestOptions).then(result => {
        return result;
    }).catch(err => {
        return Promise.reject(err);
    });
}

/**
 *
 * @param userId
 * @returns {AxiosPromise}
 */
function getPointHistories(userId) {
    const requestOptions = {
        method: 'GET',
        url: `/point/point-history/${userId}`
    };

    return api(requestOptions)
}

/**
 *
 * @param userId
 * @returns {AxiosPromise}
 */
function getCurrentPoint(userId) {
    const requestOptions = {
        method: 'GET',
        url: `/point/current-point/${userId}`
    };

    return api(requestOptions)
}

/**
 *
 * @returns {AxiosPromise}
 * Not use
 */
function getAll() {
    const requestOptions = {
        method: 'GET',
        url: '/users'
    };

    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err));
}

/**
 *
 * @param id
 * @returns {AxiosPromise}
 */
function getById(id) {
    const requestOptions = {
        method: 'GET',
        url: `/user/detail/${id}`,
    };

    return api(requestOptions);
}

/**
 * fetchUserOrCastInfoByAlias
 * @param payload, it's format {alias, accessRole}
 * @returns {AxiosPromise}
 */
function fetchUserOrCastInfoByAlias(payload) {
    const requestOptions = {
        method: 'GET',
        url: `/${payload.accessRole}-detail-alias/${payload.alias}`,
    };

    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err));
}

/**
 *
 * @param user
 * @returns {AxiosPromise}
 */
function update(user) {
    const requestOptions = {
        method: 'PUT',
        data: user,
        url: `/user/update`
    };

    return api(requestOptions)
}

/**
 *
 * @param user
 * @returns {AxiosPromise}
 */
function updateStatusNoti(user) {
    const requestOptions = {
        method: 'PUT',
        data: user,
        url: `/user/updateStatusNoti`
    };
    return api(requestOptions)
}
/**
 *
 * @param id
 * @returns {AxiosPromise}
 * @private
 * prefixed function name with underscore because delete is a reserved word in javascript
 * Not use
 */
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        url: `/users/${id}`
    };

    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err));
}

/**
 * block user or cast
 * @param payload
 * @return object
 */
function blockUser(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/user/block-user`,
        headers: {'Content-Type': 'application/json'},
        data: payload
    };

    // not key data
    return api(requestOptions);
}

/**
 * addRegisterEmailForLoinLine
 * @param payload
 * @returns {Promise<*>}
 */
function addRegisterEmailForLoinLine(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/auth/register/social`,
        headers: {'Content-Type': 'application/json'},
        data: _.pick(payload, ["identifier", "email"])
    };

    // not key data
    return api(requestOptions).then(async result => {
        if (_.has(result, "access_token") && !isTokenExpired(result.access_token)) {

            await setAccessToken(result.access_token);
            await setIdToken(result.access_token);

            // set user
            // if (_.has(result, "data")) {
            //     setUser(result.data)
            // }

            return result;
        }

        return Promise.reject("Token miss match")
    }).catch(err => {
        setAccessToken("");
        setIdToken("");

        return Promise.reject(err);
    });
}

/**
 *
 * @param payload
 * @returns {boolean|Promise<AxiosResponse<any>>}
 */
function loginWithLineCheckExist(payload = {}) {
    if (!Object.keys(payload).length || !_.has(payload, "email")) {
        return true;
    }

    const requestOptions = {
        method: 'POST',
        url: `/auth/check/email`,
        headers: {'Content-Type': 'application/json'},
        data: _.pick(payload, "email")
    };

    return api(requestOptions).then(result => {
        if (_.isObject(result.data) && _.has(result, "data.check_email")) {
            return !!result.data.check_email
        }

        return true;
    }).catch(err => Promise.reject(true));
}

/**
 *
 * @param payload
 * @returns {boolean|Promise<boolean>}
 */
function checkExistIdentifierOfLineOrLogin(payload = {}) {
    if (!Object.keys(payload).length || !_.has(payload, "identifier")) {
        return true;
    }

    const requestOptions = {
        method: 'POST',
        url: `/auth/social/identifier`,
        headers: {'Content-Type': 'application/json'},
        data: _.pick(payload, "identifier")
    };

    return api(requestOptions).then(result => {
        if (_.isObject(result.data) && _.has(result, "data.check_identifier")) {
            if (!!result.data.check_identifier && _.has(result, "data.access_token")) {

                if (isTokenExpired(result.data.access_token)) {
                    return Promise.reject("Token miss match")
                }

                setAccessToken(result.data.access_token);
                setIdToken(result.data.access_token);

                // // Has user
                // if (_.has(result, "data.user")) {
                //     setUser(result.data.user)
                // }

                return result
            }
        }

        return true;
    }).catch(err => {
        return Promise.reject(err)
    });
}

/**
 *
 * @param code
 * @returns {Promise<OAuthResult>}
 */
function getTokenWithLine(code) {
    let self = this;
    const result = new OAuthRequest({
        code: code,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_DOMAIN_SECRET,
        redirectUri: CLIENT_REDIRECT
    })

    return axios.post('https://api.line.me/oauth2/v2.1/token', queryString.stringify(result), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(result => {
        return new OAuthResult(result.data);
    }).catch(error => {
        console.log("getTokenWithLine >> ERR", error)

        return Promise.reject(error);
    })
}

/**
 *
 * @param token
 * @returns {Promise<*>}
 */
function getProfileWithLine(token) {
    return axios.get('https://api.line.me/v2/profile', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(result => {

        return result.data
    }).catch(error => {
        console.log("getProfileWithLine >> ERR", error)
        return Promise.reject(error);
    })
}

/**
 *
 * @param token
 * @returns {Promise<*>}
 */
function checkFriendWithLine(token) {
    return axios.get('https://api.line.me/friendship/v1/status', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(result => result.data)
}

/**
 *
 * @param token
 * @returns {Promise<*>}
 */
function mapUserORCastFollow(payload) {
    let requestOptions = {
        method: 'POST',
        url: `/user/follow-cast`,
        data:  payload.data
    };

    return api(requestOptions).then(result => result).catch(err => Promise.reject(err));
}

/**
 *
 * @returns {Promise<T | *[]>}
 */
function fetchListTargetFollowed() {
    let requestOptions = {
        method: 'GET',
        url: `/user/list-target-followed`,
    };

    return api(requestOptions).then(res => res.data).catch(err => ([]));
}

/**
 *
 * @returns {Promise<T | *[]>}
 */
function fetchListUserOrCast(payload) {
    let requestOptions = {
        method: 'POST',
        url: `/cast/suggest-list`,
        params: payload.params
    };

    if(_.has(payload, "isNotFetch") && payload.isNotFetch) {
        return Promise.resolve([]);
    }

    return api(requestOptions).then(res => res.data).catch(err => ([]));
}

/**
 *
 * @param payload
 * @returns {Promise<*[]>|Promise<T | *[]>}
 */
function userRequestCreateRoom(payload) {
    let requestOptions = {
        method: 'POST',
        url: `/create-room/${payload.castId}`,
    };


    return api(requestOptions).then(res => res.data).catch(err => ({}));
}

/**
 *
 * @param payload
 * @returns {Promise<T | {}>}
 */
function detailThreadRoomChatBySingle(payload) {
    let requestOptions = {
        method: 'POST',
        url: `/detail-room-by-filter-single`,
        data: payload.data
    };


    return api(requestOptions).then(res => res.data).catch(err => ({}));
}

/**
 *
 * @param payload
 * @returns {Promise<T | {}>}
 */
function eventBlockUserChannel(payload) {
    let requestOptions = {
        method: 'POST',
        url: `/user/event-block-user-vs-channel-single`,
        data: payload.data
    };


    return api(requestOptions).then(res => res.data).catch(err => ({}));
}

/**
 *
 * @param payload
 * @returns {Promise<T>}
 */
function fetchCheckBlockUser(payload) {
    let requestOptions = {
        method: 'GET',
        url: `/user/user-blocked/${payload.userId}`,
    };


    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err));
}
