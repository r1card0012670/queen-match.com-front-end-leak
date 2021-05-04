import decode from 'jwt-decode';
import Router from 'vue-router';
import {AUTH, TYPE_ROLE_USER} from './constant';
import appUtility from "./app-utility";
import Vue from "vue";


//You may inject environment variables into Mix by prefixing a key in your .env file with MIX_:
export const CLIENT_ID = process.env.MIX_VUE_APP_LINE_CLIENT_ID
export const CLIENT_DOMAIN_SECRET = process.env.MIX_VUE_APP_LINE_CLIENT_SECRET
export const CLIENT_REDIRECT = `${window.location.origin}${AUTH.CLIENT_REDIRECT}` // YOUR_CALLBACK_URL

var router = new Router({
    mode: 'history',
});

export function methodLogout(isRedirect = true) {
    clearIdToken();
    clearAccessToken();
    clearSocialLine();
    clearUser();
    clearCookie();
    localStorage.clear();

    if (!!isRedirect) {
        router.go('/login');
    }
}

export function requireAuth(to, from, next) {
    if (!isLoggedIn()) {
        next({
            path: '/home',
            query: {redirect: to.fullPath}
        });
    } else {
        next();
    }
}

export function getIdToken() {
    return localStorage.getItem(AUTH.ID_TOKEN_KEY);
}

export function getAccessToken() {
    return localStorage.getItem(AUTH.ACCESS_TOKEN_KEY);
}

export function getUser() {
    let data = localStorage.getItem(AUTH.USER);
    if (!data) {
        return {}
    }

    return JSON.parse(data)
}

export function getSocialLine() {
    let data = localStorage.getItem(AUTH.SOCIAL_LINE);
    if (!data) {
        return {}
    }
    return JSON.parse(data);
}

function clearIdToken() {
    localStorage.removeItem(AUTH.ID_TOKEN_KEY);
}

function clearAccessToken() {
    localStorage.removeItem(AUTH.ACCESS_TOKEN_KEY);
}

function clearUser() {
    localStorage.removeItem(AUTH.USER);
}

function clearCookie() {
    Vue.$cookies.keys().forEach(cookie => Vue.$cookies.remove(cookie))
}

function clearSocialLine() {
    localStorage.removeItem(AUTH.SOCIAL_LINE);
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName(name) {
    debugger
    // TODO

    let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);

    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Get and store access_token in local storage
export function setAccessToken(accessToken) {
    // let accessToken = getParameterByName('access_token');

    localStorage.setItem(AUTH.ACCESS_TOKEN_KEY, accessToken);
}

// Get and store id_token in local storage
export function setIdToken(idToken) {
    // let idToken = getParameterByName('id_token');
    localStorage.setItem(AUTH.ID_TOKEN_KEY, idToken);
}

// Get and store info line in local storage
export function setSocialLine(infoLine) {
    // let idToken = getParameterByName('id_token');
    localStorage.setItem(AUTH.SOCIAL_LINE, JSON.stringify(infoLine));
}

export function setUser(user) {
    localStorage.setItem(AUTH.USER, JSON.stringify(user));
}

export function isLoggedIn() {
    const idToken = getIdToken();

    return !!idToken && !isTokenExpired(idToken);
}

export function decodeToken(encodedToken = "") {
    let idToken = !encodedToken ? getIdToken() : encodedToken;
    if (!!idToken) {
        return decode(idToken);
    }
    return;
}

function getTokenExpirationDate(encodedToken) {
    const token = decodeToken(encodedToken);
    let keyRole = Object.keys(TYPE_ROLE_USER).map(key => TYPE_ROLE_USER[key]);

    if (!token.exp || !token.role || token.role && _.indexOf(keyRole, token.role) === -1) {
        return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(token.exp);

    return date;
}

export function isTokenExpired(token) {
    const expirationDate = getTokenExpirationDate(token);

    return !expirationDate || appUtility.isValidDate(expirationDate) && appUtility.isSameOrBefore(expirationDate, new Date());
}
