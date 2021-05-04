"use strict";

import {api} from "./api";

export const tagService = {
    getAllGroupTag,
    fetchAllTag,
    getAllGroupTagByType,
};

function getAllGroupTag(params={}) {
    const requestOptions = {
        method: 'GET',
        url: 'tag/getAllGroup',
        params: params
    };

    return api(requestOptions)
    // return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

/**
 *
 * @param payload
 * @returns {Promise<* | {data: []}>}
 */
function fetchAllTag(payload) {
    const requestOptions = {
        method: 'GET',
        url: `/tag/all?type=${payload.type}`,
    };

    return api(requestOptions).then(res => res.data).catch(err => ([]))
}

/**
 *
 * @param payload
 * @returns {Promise<* | []>}
 */
function getAllGroupTagByType(payload) {
    const requestOptions = {
        method: 'GET',
        url: `/tag/getAllGroup?type=${payload.type}`,
        params: _.has(payload, "params") ? payload.params : {}
    };

    return api(requestOptions).then(res => res.data).catch(err => ([]))
}


