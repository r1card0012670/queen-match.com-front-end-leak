<template>
    <div class="text-center">
        <v-dialog v-model="uploadFailed" max-width="400">
            <v-card>
                <v-card-text style="padding-top: 50px">
                    5MB以下のJPG、JPEG、またはPNGのファイルをアップロードしてください。
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
            uploadFailed: {
                type: Boolean,
                required: true
            },
        },
        methods: {
            closeClick: function () {
                this.$emit('closeErrorDialog', true);
            }
        }
    }
</script>
