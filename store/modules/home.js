import {api, paymentService} from '../../_services';

const state = {
    orderCastCanApply: [],
    getCoupon: {},
}

const getters = {
    getCoupon: state => state.getCoupon,
};

const actions = {
    getThreeDayCasts: ({}, payload) => {
        const options = {
            method: 'GET',
            url: `/cast/casting-three-day`,
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, _.pick(payload, ['page']))
        }

        return api(options);
    },

    getTodayInterviewCasts: ({}, payload) => {
        const options = {
            method: 'GET',
            url: `cast/list-cast-today`,
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, _.pick(payload, ['page'])),
        }

        return api(options);
    },

    getRankingCasts: ({}, payload) => {
        const options = {
            method: 'GET',
            url: `/ranking/cast-top-rating`,
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, payload),
        }

        return api(options);
    },

    getHighlySatisfiedCasts: ({}, payload) => {
        const options = {
            method: 'GET',
            url: `/cast/highly-satisfied-reviews`,
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, _.pick(payload, ['page']))
        }

        return api(options);
    },

    getRankingUsers: ({}, payload) => {
        const options = {
            method: 'GET',
            url: payload.api,
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, _.pick(payload, ['period', 'place',])),
        }

        return api(options);
    },

    getOrderCastCanApply: ({}, payload) => {
        const options = {
            method: 'GET',
            url: '/order/cast-can-apply',
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, _.pick(payload, ['date', 'place', 'page'])),
        }

        return api(options);
    },

    getCouponDispatch({dispatch, commit}, payload) {
        paymentService.getFirstOrderCoupon()
            .then(result => {
                commit('getCouponMutation', (_.has(result, "data") ? result.data : {}));
            })
            .catch(error => {
                // dispatch('alert/error', error, {root: true});
            });
    }
}

const mutations = {
    setOrderCastCanApply: (state, payload) => {
        state.orderCastCanApply = payload;
    },
    getCouponMutation: (state, payload) => {
        state.getCoupon = payload;
    }
}

export default {state, actions, getters, mutations};
