import Vue from 'vue'
import Router from 'vue-router'
import {requireAuth} from '../utils/auth';
import HomePageComponent from '../pages/HomePageComponent'
import SearchForCastComponent from '../pages/SearchForCastComponent'
import ChatPageComponent from '../pages/ChatPageComponent'
import BookMergePageComponent from '../pages/BookMergePageComponent'
import FeedPageComponent from '../pages/FeedPageComponent'
import ProfilePageComponent from '../pages/ProfilePageComponent'
import ProfileAliasComponent from '../pages/ProfileAliasComponent'
import ResetPasswordComponent from '../pages/ResetPasswordComponent'
import LoginComponent from "../pages/LoginComponent";
import LineCallbackComponent from '../pages/LineCallbackComponent'
import C from "../utils/constants";

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        }, {
            path: '/home',
            name: 'Home',
            component: HomePageComponent,
            beforeEnter: requireAuth,
            meta: {
                title: 'Home',
                activeBottom: true,
                requiresAuth: true
            }
        }, {
            path: '/search-by-cast',
            name: 'SearchForCast',
            component: SearchForCastComponent,
            beforeEnter: requireAuth,
            meta: {
                title: 'Chat',
                activeBottom: true,
            }
        }, {
            path: '/chat',
            name: 'Chat',
            component: ChatPageComponent,
            beforeEnter: requireAuth,
            meta: {
                title: 'Chat',
                activeBottom: true,
            }
        }, {
            path: '/book-merge',
            name: 'BookMerge',
            component: BookMergePageComponent,
            beforeEnter: requireAuth,
            meta: {
                title: 'Book merge',
                activeBottom: true,
                requiresAuth: true
            }
        }, {
            path: '/feed',
            name: 'Feed',
            component: FeedPageComponent,
            beforeEnter: requireAuth,
            meta: {
                title: 'Feed',
                activeBottom: true,
                requiresAuth: true
            }
        }, {
            path: '/profile',
            name: 'Profile',
            component: ProfilePageComponent,
            meta: {
                title: 'profile',
                activeBottom: true,
                requiresAuth: true
            }
        }, {
            path: `/${C.PATH_PROFILE_VIEW}/:role/:alias`,
            name: 'ProfileAlias',
            component: ProfileAliasComponent,
            meta: {
                title: 'show profile by alias',
                activeBottom: false,
            }
        }, {
            path: '/line-callback',
            name: 'LineCallback',
            component: LineCallbackComponent,
            meta: {title: 'Line Callback',}
        }, {
            path: '/login',
            name: 'Login',
            component: LoginComponent,
            meta: {title: 'Login'}
        }, {
            path: '/pwd/reset/:token',
            name: 'ResetPassword',
            component: ResetPasswordComponent,
            meta: {title: 'reset password'}
        }, {
            path: '*',
            redirect: '/login'
        },
    ],
    mode: 'history'
})
