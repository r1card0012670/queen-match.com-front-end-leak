<template>
    <div class="app-content-box">
        <v-row justify="center">
            <v-dialog v-model="showNewUserDialog" :content-class="`d-dialog-show-fullscreen`" max-width="440" fullscreen
                      hide-overlay transition="dialog-bottom-transition"
                      scrollable>
                <v-card :class="`dialog-show-all-users`" :id="`dialog-show-all-users`">
                    <v-card-title class="p-0">
                        <div :class="`card-header-top`">
                            <button v-on:click="closeDialog">
                                <v-img contain src="../../images/chevron-left.svg"/>
                            </button>
                            <div class="d-title">{{ titleHeader }}</div>
                        </div>
                    </v-card-title>
                    <v-card-text :class="[`p-0`]">
                        <div class="card-body d-list-content">
                            <div class="d-inline-flex d-list-show-all-users box-1 p-0 d-box-new-card">
                                <CardUserComponent v-for="(item, index) in newUsers" :key="index"
                                                     :name="'home7'"
                                                     :itemData="item"
                                                     :type="'user-item'"
                                                     :imgAvatarDefault="item.image"/>
                                <div ref="infiniteScrollNewUsers"></div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
import {mapActions} from 'vuex';
import IconSvgComponent from "../common/IconSvgComponent";
import CardUserComponent from "../common/CardUserComponent";

export default {
    props: {
        titleHeader: {
            type: String,
            defaultValue: ""
        },
    },
    data: function () {
        return {
            payload: {},
            newUsers: [],
            newUsersPage: 0,
            showNewUserDialog: true,
            observer: null,
        }
    },
    components: {
        IconSvgComponent,
        CardUserComponent,
        // InfiniteLoading,
    },
    mounted() {
        let self = this;
        self.scrollTrigger();
    },
    methods: {
        ...mapActions({
            getNewUsers: 'getNewUsers',
        }),
        closeDialog() {
            this.showNewUserDialog = false;
            this.$emit('close-dialog');
        },
        fetchListData: function () {
            this.$store.dispatch('getNewUsers', {page: this.newUsersPage}).then(response => {
                if (_.has(response, "data.data") && _.isArray(response.data.data)) {
                    this.newUsers.push(...response.data.data);
                    // if (response.data.next_page_url) {
                    //     this.newUsersPage++;
                    // }
                }
            }).catch(error => {
                // console.log(error);
            });
        },
        scrollTrigger: function () {
            let self = this;
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0 || self.newUsersPage === 0) {
                        self.newUsersPage++;
                        self.fetchListData();
                    }
                });
            });

            if (!!self.$refs.infiniteScrollNewUsers) {
                this.observer.observe(self.$refs.infiniteScrollNewUsers);
            }
        },
        // Not use
        // infiniteHandler($state) {
        //     this.$store.dispatch('getNewUsers', {page: this.newUsersPage})
        //         .then(response => {
        //             this.newUsers.push(...response.data.data);
        //             if (response.data.next_page_url) {
        //                 $state.loaded();
        //                 this.newUsersPage++;
        //             } else {
        //                 $state.complete();
        //             }
        //         })
        //         .catch(error => {
        //             // console.log(error);
        //             $state.complete();
        //         });
        // },
    },
    destroyed() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.newUsersPage = 0
    }
}
</script>
