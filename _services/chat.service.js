"use strict";

import {api} from "./api";

export const chatService = {
    getListRoomChat,
    getListMessageChat,
    addMessages,
    fetchListGift,
    addMessagesWithImage,
    addMessagesWithGift,
    fetchNumUnreadMessage,
    markReadMessageById,
    readyRequestPaymentSendGift,
    fetchDataOrderOfCastNow,
};

function getListRoomChat(payload) {
    const requestOptions = {
        method: 'GET',
        url: `/rooms/list?page=${payload.page}&name=${_.has(payload, "nickname") ? payload.nickname : ""}`,
    };

    return api(requestOptions).then(result => {
        return result.data;
    }).catch(err => {
        return Promise.reject(err);
    });
}

function getListMessageChat(payload) {
    const requestOptions = {
        method: 'GET',
        url: `/message/list/${payload.roomId}?page=${payload.page}`,
    };

    return api(requestOptions).then(result => {
        return result.data;
    }).catch(err => {
        return Promise.reject(err);
    });
}

function addMessages(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/messages`,
        data: payload.data
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
 * @returns {Promise<T>}
 */
function addMessagesWithImage(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/message/image`,
        headers: {'Content-Type': 'multipart/form-data'},
        data: payload
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
 * @returns {Promise<T>}
 */
function addMessagesWithGift(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/message/gift`,
        data: payload.data
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
 * @returns {Promise<T>}
 */
function fetchListGift(payload) {
    const requestOptions = {
        method: 'GET',
        url: `/gift/list`,
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
 * @returns {Promise<T>}
 */
function fetchNumUnreadMessage(payload) {
    const requestOptions = {
        method: 'GET',
        url: `/message/unread-counted/${payload.userOrCastId}`,
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
 * @returns {Promise<T>}
 */
function markReadMessageById(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/message/update-read/${payload.roomId}`,
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
 * @returns {Promise<T>}
 */
function readyRequestPaymentSendGift(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/payment/gift`,
        data: payload.data
    };

    return api(requestOptions).then(result => {
        return result.data;
    }).catch(err => {
        return Promise.reject(err);
    });
}

/**
 *
 * @param payload
 * @returns {Promise<T>}
 */
function fetchDataOrderOfCastNow(payload) {
    if (!_.has(payload, "roomId")) {
        return Promise.reject("Not match room id");
    }
    const requestOptions = {
        method: 'GET',
        url: `/order-of-cast/${payload.roomId}`,
    };

    return api(requestOptions).then(result => {
        return result.data;
    }).catch(err => {
        return Promise.reject(err);
    });
}
