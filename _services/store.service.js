"use strict";

import {api} from "./api";

export const storeService = {
    getAllStores,
    getListNewStores,
    getListNearestStores
};

function getAllStores(payload) {
    const options = {
        method: 'POST',
        url: `/store/list`,
        data: payload
    };

    return api(options).then(res => res.data).catch(err => []);
}

function getListNewStores(payload) {
    const options = {
        method: 'POST',
        url: `/store/list-new-store`,
        data: payload
    };

    return api(options).then(res => res.data).catch(err => []);
}

function getListNearestStores(payload) {
    const options = {
        method: 'POST',
        url: `/store/list-nearest-store`,
        data: payload
    };

    return api(options).then(res => res.data).catch(err => []);
}
