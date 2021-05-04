<template>
    <div class="text-center">
        <v-dialog v-model="createCardFailed" max-width="400">
            <v-card>
                <v-card-text style="padding-top: 50px">
                    ご利用出来ないカードをご入力にされたか、カード番号が誤っています。
                </v-card-text>
                <v-card-text class="text-center">
                    カード番号をもう一度お確かめください。
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="closeClick">
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    export default {
        data () {
            return {
            }
        },
        props: {
            createCardFailed: {
                type: Boolean,
                required: true
            },
        },
        methods: {
            closeClick: function () {
                this.$emit('closeAct', true);
            }
        }
    }
</script>
