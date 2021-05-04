"use strict";

import {api} from "./api";

export const infoService = {
    getAll,
};

function getAll() {
    const options = {
        method: 'GET',
        url: `/info-management/all`,
        headers: {'Content-Type': 'application/json'},
    }

    return api(options);
}
