import axios from 'axios'
import {getAccessToken, methodLogout} from '../utils/auth'
import router from '../router';


export const api = axios.create({
    baseURL: `${window.location.origin}/api`,
    timeout: 30000,
});


api.interceptors.request.use(
    config => {
        const token = getAccessToken();
        if (token) {
            config.headers.common["Authorization"] = 'Bearer ' + token;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        if (response.status === 200 || response.status === 201) {
            return Promise.resolve(response.data);
        } else {
            return Promise.reject(response.data);
        }
    },
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                case 400: {
                    //do something
                    break;
                }
                case 401: {
                    methodLogout(false);
                    break;
                }
                case 403: {
                    router.replace({
                        path: "/login",
                        query: {redirect: router.currentRoute.fullPath}
                    });
                    break;
                }
                case 404: {
                    // alert('page not exist');
                    break;
                }
                case 502: {
                    setTimeout(() => {
                        router.replace({
                            path: "/login",
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    }, 1000);
                }
            }

            return Promise.reject(error.response.data);
        }
    }
);
