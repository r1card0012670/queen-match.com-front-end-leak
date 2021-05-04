"use strict";
import {api} from "../../_services";

const actions = {
    initResetDataStoreDialogNotifyDispatch({commit, state, rootState}, payload) {
    },
    fetchNotification: ({}, payload) => {
        const options = {
            method: 'GET',
            url: 'notifications',
            headers: {'Content-Type': 'application/json'},
            params: Object.assign({}, _.pick(payload, ['last_id'])),
        }

        return api(options);
    },

    countNotification: () => {
        const options = {
            method: 'GET',
            url: 'notifications/count',
            headers: {'Content-Type': 'application/json'},
        }

        return api(options);
    },

    markNotificationAsRead: ({}, payload) => {
        const options = {
            method: 'POST',
            url: `notifications/read/${payload.id}`,
            headers: {'Content-Type': 'application/json'},
        }

        return api(options);
    }
}

export default {
    actions,
}
