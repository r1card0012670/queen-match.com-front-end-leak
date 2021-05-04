"use strict";

import {api} from "./api";

export const paymentService = {
    addPayment,
    getCardInfos,
    getCardDetail,
    deleteCard,
    setMainCard,
    getFirstOrderCoupon
};

/**
 * addPayment
 * @param payload
 * @returns {Promise<*>}
 */
function addPayment(payload) {
    const requestOptions = {
        method: 'POST',
        url: `/paymentinfo/create`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: Object.assign({}, _.pick(payload, ["number", "exp_month", "exp_year", "cvc", "name", "user_id"]))
    };

    return api(requestOptions).then(result => {
        return result;
    }).catch(err => {
        return Promise.reject(err);
    });
}

function getCardInfos(userId) {
    const requestOptions = {
        method: 'GET',
        url: `/paymentinfo/list/${userId}`,
    };

    return api(requestOptions).then(result => {
        return result;
    }).catch(err => {
        return Promise.reject(err);
    });
}

function getCardDetail(paymentInfoId) {
    const requestOptions = {
        method: 'GET',
        url: `/paymentinfo/detail/${paymentInfoId}`,
    };

    return api(requestOptions).then(result => {
        return result;
    }).catch(err => {
        return Promise.reject(err);
    });
}

function deleteCard(paymentInfoId) {
    const requestOptions = {
        method: 'DELETE',
        url: `/paymentinfo/delete/${paymentInfoId}`,
    };

    return api(requestOptions).then(result => {
        return result;
    }).catch(err => {
        return Promise.reject(err);
    });
}

function setMainCard(payload) {
    const requestOptions = {
        method: 'post',
        url: `/paymentinfo/update`,
        data: payload
    };

    return api(requestOptions).then(result => {
        return result;
    }).catch(err => {
        return Promise.reject(err);
    });
}

function getFirstOrderCoupon(){
    const options = {
        method: 'GET',
        url: '/notification/get-first-time-order-coupon',
        headers: {'Content-Type': 'application/json'},
    }

    return api(options).then(result => {
        return result;
    }).catch(err => {
        return Promise.reject(err);
    });
}
