"use strict";

import {api} from "./api";

export const castService = {
    getListWorkingTime,
    updateWorkingTime,
};

function getListWorkingTime(data = {}) {
    const options = {
        method: 'GET',
        url: `/working-time/getWorkingTimeOfUserByDate`,
        headers: {'Content-Type': 'application/json'},
        params: data
    }

    return api(options);
}

function updateWorkingTime(data = {}) {
    const options = {
        method: 'POST',
        url: `/working-time/updateListWorkingTime`,
        headers: {'Content-Type': 'application/json'},
        params: data
    }

    return api(options);
}
