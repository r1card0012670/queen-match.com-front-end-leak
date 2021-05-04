"use strict";

import {api} from "./api";

export const imageService = {
    uploadImage,
    getUserImages,
    deleteUserImage,
    setAsAvatar,
    changeImage
};

/**
 * uploadImage
 * @param formData
 * @param userId
 */
function uploadImage(formData) {
    const options = {
        method: 'POST',
        url: `/user-image/upload`,
        headers: {'Content-Type': 'application/json'},
        data: formData,
    }

    return api(options);
}

function getUserImages(userId) {
    const options = {
        method: 'GET',
        url: `/user-image/get-images/${userId}`,
        headers: {'Content-Type': 'application/json'},
    }

    return api(options);
}

function deleteUserImage(imageId) {
    const options = {
        method: 'DELETE',
        url: `/user-image/delete/${imageId}`,
        headers: {'Content-Type': 'application/json'},
    }

    return api(options);
}

function setAsAvatar(payload) {
    const options = {
        method: 'PUT',
        url: `/user-image/set-as-main`,
        headers: {'Content-Type': 'application/json'},
        data: payload,
    };

    return api(options);
}

function changeImage(payload) {
    const options = {
        method: 'POST',
        url: `/user-image/change`,
        headers: {'Content-Type': 'application/json'},
        data: payload,
    };

    return api(options);
}
