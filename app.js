/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import BootstrapVue from 'bootstrap-vue';
import vuetify from './plugins/vuetify' // path to vuetify export
import ScrollLoader from 'vue-scroll-loader' // path to vue-check-view export
import router from './router';
import store from './store/index.js'
import App from './App.vue';
import {isLoggedIn} from "./utils/auth";
// Setup fake backend
//import {configureFakeBackend} from './utils/fake-backend';
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import VueClipboard from 'v-clipboard'
import moment from 'moment'
import VCalendar from 'v-calendar';

require("./plugins/gmaps").gmaps();

Vue.use(BootstrapVue);
Vue.use(VueCookies)
Vue.use(ScrollLoader)
Vue.use(VueClipboard);
Vue.use({
    install(Vue) {
        Vue.prototype.$moment = moment
    }
})

Vue.use(VCalendar, {
    componentPrefix: 'vc',  // Use <vc-calendar /> instead of <v-calendar />
});

// Authentication before use
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (isLoggedIn()) {
            next()
            return
        }

        next('/login')
    } else {
        next()
    }
})

//configureFakeBackend();


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
const app = new Vue({
    vuetify,
    moment,
    store,
    router,
    el: '#app',
    components: {
        App
    },
    render: h => h(App)
});
