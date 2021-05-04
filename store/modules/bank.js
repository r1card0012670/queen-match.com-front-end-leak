"use strict";
import { api } from "../../_services";
import {getUser,setUser} from "../../utils/auth";

export default {
    actions: {
        getBankAccount: () => {
            const options = {
                method: 'GET',
                url: '/bank-accounts',
                headers: {'Content-Type': 'application/json'},
            }

            return api(options);
        },

        createBankAccount: ({}, payload) => {
            const options = {
                method: 'POST',
                url: '/bank-accounts',
                headers: {'Content-Type': 'application/json'},
                data: payload,
            }

            return api(options);
        },

        createPaymentRequest: ({}, payload) => {
            const options = {
                method: 'POST',
                url: '/payment-request/create',
                headers: {'Content-Type': 'application/json'},
                data: payload,
            }

            return api(options);
        },

        getPaymentHistory:({}, payload ) => {
            const options = {
                method: 'GET',
                url: '/payment-request/history',
                headers: {'Content-Type': 'application/json'},
                params: payload,
            }

            return api(options);
        }
    }
}
