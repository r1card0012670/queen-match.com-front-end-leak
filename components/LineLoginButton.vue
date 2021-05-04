<template>
    <div>
        <v-btn outlined block class="justify-start mt-3 d-bg-login-line" large v-on:click="clickLoginWithLine">
            <div class="left pr-3">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.7188 10.2363C15.7188 10.123 15.6055 10.0098 15.4922 10.0664H14.8691C14.7559 10.0664 14.6992 10.123 14.6992 10.2363V12.6152L12.8301 10.123C12.8301 10.0664 12.7734 10.0664 12.7168 10.0664H12.0371C11.9238 10.0664 11.8672 10.123 11.8672 10.2363V14.2578C11.8672 14.3711 11.9238 14.4277 12.0371 14.4277H12.7168C12.7734 14.4277 12.8867 14.3711 12.8867 14.2578V11.8789L14.6992 14.3711C14.7559 14.3711 14.8125 14.4277 14.8691 14.4277H15.4922C15.6055 14.4277 15.7188 14.3711 15.7188 14.2578V10.2363ZM11.0742 10.0098H10.3945C10.2812 10.0098 10.2246 10.123 10.2246 10.2363V14.2578C10.2246 14.3711 10.2812 14.4277 10.3945 14.4277H11.0742C11.1309 14.4277 11.2441 14.3711 11.2441 14.2578V10.2363C11.2441 10.123 11.1309 10.0098 11.0742 10.0098ZM9.48828 13.4082H7.73242V10.2363C7.73242 10.123 7.67578 10.0098 7.5625 10.0098H6.88281C6.82617 10.0098 6.71289 10.123 6.71289 10.2363V14.2578C6.71289 14.3145 6.76953 14.3145 6.76953 14.3711C6.82617 14.3711 6.82617 14.4277 6.88281 14.4277H9.48828C9.60156 14.4277 9.6582 14.3145 9.6582 14.2578V13.5781C9.6582 13.5215 9.60156 13.4082 9.48828 13.4082ZM19.1172 10.0098H16.5117C16.3984 10.0098 16.3418 10.123 16.3418 10.2363V14.2578C16.3418 14.3145 16.3984 14.4277 16.5117 14.4277H19.1172C19.1738 14.4277 19.2871 14.3711 19.2871 14.2578V13.5781C19.2871 13.5215 19.1738 13.4082 19.1172 13.4082H17.3613V12.7285H19.1172C19.1738 12.7285 19.2871 12.6719 19.2871 12.5586V11.8789C19.2871 11.8223 19.1738 11.709 19.1172 11.709H17.3613V11.0293H19.1172C19.1738 11.0293 19.2871 10.9727 19.2871 10.8594V10.2363C19.2871 10.123 19.1738 10.0098 19.1172 10.0098ZM25.6875 5.08203C25.6875 2.5332 23.5918 0.494141 21.0996 0.4375H4.90039C2.35156 0.4375 0.3125 2.5332 0.3125 5.02539V21.2246C0.255859 23.7734 2.35156 25.8125 4.90039 25.8125H21.043C23.5918 25.8691 25.6309 23.7734 25.6875 21.2246V5.08203ZM22.1758 12.0488C22.1758 13.6914 21.5527 15.1641 20.1934 16.6367C18.2676 18.9023 13.9062 21.6211 12.9434 22.0176C11.9238 22.4141 12.0938 21.7344 12.1504 21.5078C12.377 20.0352 12.4902 19.6387 11.4141 19.4121C6.99609 18.8457 3.71094 15.7305 3.71094 12.0488C3.71094 7.91406 7.8457 4.51562 12.9434 4.51562C18.041 4.51562 22.1758 7.91406 22.1758 12.0488Z"
                        fill="white"/>
                </svg>
            </div>
            <span v-html="loginText"></span>
        </v-btn>

        <!--        <span v-if="error" style="color: #dc3545; font-size: 80%;">{{ error }}</span>-->
    </div>
</template>

<script>
import queryString from 'querystring'

// import linq from 'linq'

export default {

    data() {
        return {
            // error: ''
        }
    },
    props: {
        clientId: {
            type: String,
            require: true
        },
        clientSecret: {
            type: String,
            require: true
        },
        callbackUri: {
            type: String,
            require: true
        },
        addFriend: {
            type: Boolean,
            require: false
        },
        friendRequired: {
            type: Boolean,
            require: false
        },
        friendErrorTest: {
            type: String,
            require: false,
            default: '友達に追加してください。'
        },
        loginText: {
            type: String,
            require: false,
            default: 'LINEでログイン'
        },
        error: {
            type: String,
            require: false,
        }
    },

    async created() {
    },

    methods: {
        clickLoginWithLine() {
            const url = 'https://access.line.me/oauth2/v2.1/authorize'
            let params = {
                response_type: 'code',
                client_id: this.clientId,
                redirect_uri: this.callbackUri,
                state: Math.random().toString(32).substring(2),
                scope: 'openid profile profile%20openid profile%20openid%20email openid%20email',
            }

            if (this.addFriend) {
                params = Object.assign(params, {
                    prompt: 'consent',
                    bot_prompt: 'aggressive'
                })
            }

            window.location.href = `${url}?${queryString.stringify(params)}`
        },
    }
}
</script>
