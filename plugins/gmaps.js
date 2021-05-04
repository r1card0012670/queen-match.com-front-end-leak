import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'


export const gmaps = () => {
    Vue.use(VueGoogleMaps, {
        load: {
            key: process.env.MIX_GOOGLE_MAPS_API_KEY,
            libraries: "places"
        },
        installComponents: true
    })
}
