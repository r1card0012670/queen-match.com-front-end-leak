"use strict";

import {api} from "./api";

export const bookService = {
    fetchListCastMeetNow,
    requestOrderCastMeetNow,
    fetchCouponForNewOrder,
    fetchDetailReviewOfCast,
    submitReviewOfCast,
    requestPaymentAfterBook,
    requestDeleteOrder,
    startTimeOrderMatching,
    endTimeOrderMatching,
    confirmOrderByCast,
    fetchListOrderOfUser,
    cancelOrderOfUserByUser,
};

/**
 *
 * @param payload
 * @returns {Promise<* | {data: []}>}
 */
function fetchListCastMeetNow(payload) {
    const requestOptions = {
        method: 'POST',
        url: '/matching-cast',
        data: payload.data
    };

    return api(requestOptions).then(res => res.data).catch(err => ([]))
}

/**
 *
 * @param payload
 * @returns {Promise<* | {data: []}>}
 */
function requestOrderCastMeetNow(payload) {
    const requestOptions = {
        method: 'POST',
        url: '/create-order',
        data: payload.data
    };

    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err))
}

/**
 *
 * @param payload
 * @returns {Promise<* | {data: []}>}
 */
function fetchCouponForNewOrder(payload) {
    const requestOptions = {
        method: 'GET',
        url: `/setting/coupon-firstorder?user_id=${payload.user_id}&key=${payload.key}`,
    };

    return api(requestOptions).then(res => res.data).catch(err => ({}))
}

/**
 *
 * @param payload
 * @returns {Promise<* | {data: []}>}
 */
function fetchDetailReviewOfCast(payload) {
    const requestOptions = {
        method: 'GET',
        url: `/cast/cast-with-avg-rating?cast_id=${payload.cast_id}`,
    };

    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err))
}

/**
 *
 * @param payload
 * @returns {Promise<* | {data: []}>}
 */
function submitReviewOfCast(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/review/create`,
        data: payload.data
    };

    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err))
}

/**
 *
 * @param payload
 * @returns {Promise<* | {data: []}>}
 */
function requestPaymentAfterBook(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/payment/order`,
        data: payload.data
    };

    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err))
}

/**
 *
 * @param id
 * @returns {Promise<* | {}>}
 */
function requestDeleteOrder(id) {
    const requestOptions = {
        method: 'DELETE',
        url: `/order/${id}`,
    };

    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err))
}

/**
 *
 * @param payload
 * @returns {Promise<*>}
 */
function startTimeOrderMatching(payload) {
    if (!payload.orderId) {
        return Promise.reject("Not match orderId");
    }
    const requestOptions = {
        method: 'POST',
        url: `/create-order-realtime/${payload.orderId}`,
        data: _.has(payload, "data") ? payload.payload : {}
    };

    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err))
}

/**
 *
 * @param payload
 * @returns {Promise<*>}
 */
function endTimeOrderMatching(payload) {
    if (!payload.orderId) {
        return Promise.reject("Not match orderId");
    }
    const requestOptions = {
        method: 'PUT',
        url: `/edit-order-realtime/${payload.orderId}`,
        data: _.has(payload, "data") ? payload.payload : {}
    };

    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err))
}

/**
 *
 * @param payload
 * @returns {Promise<never>|Promise<*>}
 */
function confirmOrderByCast(payload) {
    if (!payload.data) {
        return Promise.reject("Not match data");
    }
    const requestOptions = {
        method: 'POST',
        url: `/order/cast-confirm`,
        data: _.has(payload, "data") ? payload.data : {}
    };

    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err))
}

/**
 *
 * @param payload
 * @returns {Promise<never>|Promise<* | []>}
 */
function fetchListOrderOfUser(payload) {
    if (!payload.roomId) {
        return Promise.reject("Not match roomId");
    }
    const requestOptions = {
        method: 'GET',
        url: `/order-active-user/${payload.roomId}`,
        data: _.has(payload, "data") ? payload.data : {}
    };

    return api(requestOptions).then(res => res.data).catch(err => ([]))
}

/**
 *
 * @param payload
 * @returns {Promise<never>|Promise<*>}
 */
function cancelOrderOfUserByUser(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/user-cancel-order`,
        data: _.has(payload, "data") ? payload.data : {}
    };

    return api(requestOptions).then(res => res.data).catch(err => Promise.reject(err))
}

