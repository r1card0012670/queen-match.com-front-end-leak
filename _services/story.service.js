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

export const storyService = {
    getAllStory,
    getStoryById,
    createStory,
    updateStory,
    deleteStory: _deleteStory,
    hiddenPost,
    fetchListStoryByUserIdOrCastId,
};

function getAllStory(role) {
    const requestOptions = {
        method: 'GET',
        url: '/story/getListStoryPostOfCastOrUser',
        params: role
    };

    return api(requestOptions)
    // return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}


function getStoryById(ojbId) {
    const requestOptions = {
        method: 'GET',
        url: `/story/getStoryById`,
        params: ojbId
    };

    return api(requestOptions)
}

function createStory(data) {
    const requestOptions = {
        method: 'POST',
        data: data,
        url: `story/create`,
        headers: {'Content-Type': 'multipart/form-data'},
    };

    return api(requestOptions)
}

function updateStory(params) {
    const requestOptions = {
        method: 'POST',
        url: `/story/update`,
        data: params
    };

    return api(requestOptions)
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _deleteStory(id) {
    const requestOptions = {
        method: 'DELETE',
        url: `story/delete/${id}`
    };

    return api(requestOptions)
}

function hiddenPost(params) {
    const requestOptions = {
        method: 'POST',
        url: `/user/block-story-post`,
        params: params
    };

    return api(requestOptions)
}

/**
 *
 * @param userIdOrCastId
 * @param payload
 * @returns {AxiosPromise}
 */
function fetchListStoryByUserIdOrCastId(userIdOrCastId, payload) {
    const requestOptions = {
        method: 'GET',
        url: `/list/story-by-user-or-cast/${userIdOrCastId}`,
        params: _.has(payload, "params") ? payload.params : {}
    };

    return api(requestOptions).then(res => res.data).catch(err => ([]))
}


