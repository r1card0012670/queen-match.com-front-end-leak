<template>
    <v-bottom-navigation :input-value="showActiveItem" :class="[{'d-none': !activeNavBottom}, 'd-custom-bottom-nav']"
                         app color="primary"
                         grow :id="`d-nav-bottom`">
        <v-btn text plain :to="{ path: '/home'}" value="top" :class="[`footer-icon-home`, 'text-decoration-none']">
            <span v-if="!isCast">探す</span>
            <span v-if="!!isCast">ホーム</span>
            <v-img contain src="../../images/GR_Home.svg"></v-img>
            <v-img contain class="hidden" src="../../images/GR_Home_active.svg"></v-img>
        </v-btn>

        <v-btn text plain :to="{ name: 'SearchForCast'}" value="search" :class="[`footer-icon-search`, 'text-decoration-none']"
               v-if="!!isCast">
            <span>検索</span>
            <v-img contain src="../../images/RG-search.svg"></v-img>
            <v-img contain class="hidden" src="../../images/RG-search_active.svg"></v-img>
        </v-btn>

        <v-btn text plain :to="{ name: 'Chat'}" value="code" :class="[`footer-icon-chat`, 'text-decoration-none']">
            <span v-if="!isCast">メッセージ</span>
            <span v-if="!!isCast">メッセージ</span>
            <v-badge class="icon-notification" bordered overlap :content="numBadgeChat"
                     :class="[`color-black`, 'text-white', {'d-not-show-badge-chat': !numBadgeChat}]" color="red">
                <v-img contain src="../../images/GR_Chat.svg"></v-img>
                <v-img contain class="hidden" src="../../images/GR_Chat_active.svg"></v-img>
            </v-badge>
        </v-btn>

        <v-btn :to="{ name: 'BookMerge'}" value="book_merge" :class="[`footer-icon-touch`, 'text-decoration-none']"
               v-if="!!isUser">
            <span>コール</span>
            <v-img contain src="../../images/GR_Touch.svg"></v-img>
            <v-img contain class="hidden" src="../../images/GR_Touch.svg"></v-img>
        </v-btn>

        <v-btn color="black" text plain :to="{ name: 'Feed'}" value="feed"
               :class="[`footer-icon-time`, 'text-decoration-none']">
            <span>つぶやき</span>
            <v-img contain src="../../images/GR_Time.svg"></v-img>
            <v-img contain class="hidden" src="../../images/GR_Time_active.svg"></v-img>
        </v-btn>

        <v-btn color="black" text plain :to="{ name: 'Profile'}" value="profile"
               :class="[`footer-icon-user`, 'text-decoration-none']">
            <span>マイページ</span>
            <v-img contain src="../../images/GR_User.svg"></v-img>
            <v-img contain class="hidden" src="../../images/GR_User_active.svg"></v-img>
        </v-btn>
    </v-bottom-navigation>

</template>

<script>

import {mapGetters, mapState} from "vuex";
import IconSvgComponent from "../common/IconSvgComponent";
import {TYPE_ROLE_USER} from "../utils/constant";

export default {
    props: {
        typeComponent: {
            type: String,
            defaultValue: ""
        }
    },
    data: function () {
        return {
            // activeItem: 'top',
            // active: true
        }
    },
    components: {
        IconSvgComponent
    },
    computed: {
        ...mapState({
            // Format [stageName] => state.[modulesName].[stageName],
            activeNavBottom: state => state.main.activeNavBottom,
            activeItem: state => state.main.activeItem,
            numBadgeChat: state => state.main.numBadgeChat,
            role: state => state.user.role,
        }),
        ...mapGetters({
            activeNavBottom: "activeNavBottom",
            activeItem: "activeItem",
        }),
        isUser: function () {
            return this.role === TYPE_ROLE_USER.TYPE_USER
        },
        isCast: function () {
            return this.role === TYPE_ROLE_USER.TYPE_CAST
        },
        showActiveItem: function () {
            return !!this.activeNavBottom
        }
    },
    mounted() {
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.v-bottom-navigation {
    &::v-deep {
        .v-btn {
            &__content {
                justify-content: flex-end;
                padding-top: 10px;

                & > span {
                    padding: unset;

                    &:first-child {
                        position: absolute;
                        bottom: 10px;
                    }
                }
            }
        }

        .footer-icon-touch {
            .v-image {
                top: -30px;
            }

            .v-btn {
                &__content {
                    & > span {
                        top: unset;
                    }
                }
            }
        }
    }
}
</style>
