<template>
    <div :class="[`d-dialog-form-edit-user p-0`]" v-if="isShowDialog">

        <v-bottom-sheet v-if="isShowDialog" v-model="showDataFiledDialog" persistent
                        :content-class="`d-dialog-show-not-fullscreen d-dialog-footer`" max-width="440">

            <v-card :class="[`d-form-edit-user`, 'd-border-radius-top-15']" :id="`dialog-form-edit-user`"
                    lazy-validation ref="editUserInfo">
                <v-card-title :id="'d-card-title-form-edit-user'"
                              :class="[`headline d-header-box-form-edit-user p-1`, 'd-border-bottom']">
                    <div class="d-flex align-items-center justify-content-between d-custom-header p-2 d-width-100">
                        <v-btn icon dark v-on:click="clickCallbackEventDataClose">
                            <v-icon class="mr-2 pt-1">close</v-icon>
                        </v-btn>
                        <v-card-title :class="`p-0`" v-if="typeInputClick === 'actUserName'">{{
                                btnTitle
                            }}
                        </v-card-title>
                        <v-card-title :class="`p-0`" v-if="typeInputClick === 'actRow'">今日のひとこと</v-card-title>
                        <v-card-title :class="`p-0`" v-if="typeInputClick === 'actContentStatus'">自己紹介</v-card-title>

                        <div class="info-bar d-title-form-edit-user pr-5 btn" v-if="titleName">
                            {{ titleName }}
                        </div>
                        <div class="info-bar d-act-title-form-edit-user button-choice pr-0" role="button"
                             @click="clickCallbackEventData">
                            保存
                        </div>
                    </div>
                </v-card-title>

                <v-card-text :id="'d-card-text-form-edit-user'" v-if="typeInputClick === 'actUserName'"
                             :class="`v-box-setting-content`">
                    <div class="d-label font-weight-bold"> {{ btnTitle }}
                        <span>{{ lengthStringVModel }}/{{ numUserName }}</span></div>
                    <v-text-field
                        solo
                        v-model="vModelDataByFiled"
                        :rules="[nicknameRules.required, nicknameRules.max]"
                        required
                    ></v-text-field>
                </v-card-text>

                <v-card-text :id="'d-card-text-form-edit-user'" v-if="typeInputClick === 'actRow'"
                             :class="`v-box-setting-content`">
                    <div class="d-label font-weight-bold"> 今日のひとこと <span>{{ lengthStringVModel }}/{{ numRow }}</span>
                    </div>
                    <v-text-field
                        solo
                        v-model="vModelDataByFiled"
                        :rules="[wordRules.required, wordRules.max]"
                        required
                    ></v-text-field>
                </v-card-text>

                <v-card-text :id="'d-card-text-form-edit-user'" v-if="typeInputClick === 'actContentStatus'"
                             :class="`v-box-setting-content`">
                    <div class="d-label font-weight-bold"> 自己紹介
                        <span>{{ lengthStringVModel }}/{{ numContentStatus }}</span></div>
                    <v-textarea
                        solo
                        v-model="vModelDataByFiled"
                        :rules="[introRules.required, introRules.max]"
                        name="input-7-4"
                        class="m-0"
                        :value="value"></v-textarea>
                    <template v-if="getCurrentUserInfo.roles[0].role_name === 'user'">
                        <p>ゴルフ、カラオケ、出身都道府県など、 キャストがよく検索するキーワードを入れるようにしましょう。</p>
                        <p>フリーワード検索とは? キャストの探す画面でフリーワード検索ができます。 検索される事を意識して自己紹介文を作成しましょう</p>
                    </template>
                    <template v-else>
                        <p>ゴルフ、モデル、学生、カラオケ、出身都道府県など、ゲストがよく検索するキーワードを入れるようにしましょう。</p>
                        <p>フリーワード検索とは?ゲストの探す画面でフリーワード検索ができます。検索される事を意識して自己紹介文を作成しましょう</p>
                    </template>
                </v-card-text>

                <v-card-text :id="'d-card-text-form-edit-user'" v-if="typeInputClick === 'actBirthplace'">
                    <v-textarea v-model="vModelDataByFiled" outlined name="input-7-4" label="Outlined textarea"
                                :value="value"></v-textarea>
                </v-card-text>

                <v-card-text :id="'d-card-text-form-edit-user'" v-if="typeInputClick === 'actEducational'">
                    <v-textarea v-model="vModelDataByFiled" outlined name="input-7-4" label="Outlined textarea"
                                :value="value"></v-textarea>
                </v-card-text>
            </v-card>
        </v-bottom-sheet>
    </div>
</template>

<script>

import C from "../../utils/constants";

export default {
    data: function () {
        return {
            vModelDataByFiled: null,
            nicknameRules: {
                required: value => _.isString(value) && value.replace(/ /g, '').length > 0 || "この項目は必須です",
                max: v => (v && v.length <= this.numUserName) || `${this.numUserName}文字以下で入力してください`
            },
            wordRules: {
                required: value => _.isString(value) && value.replace(/ /g, '').length > 0 || "この項目は必須です",
                max: v => (v && v.length <= this.numRow) || `${this.numRow}文字以下で入力してください`,
            },
            introRules: {
                required: value => _.isString(value) && value.replace(/ /g, '').length > 0 || "この項目は必須です",
                max: v => (v && v.length <= this.numContentStatus) || `${this.numContentStatus}文字以下で入力してください`,
            },
            isValid: true,
            numUserName: 30,
            numRow: 30,
            numContentStatus: 1000,
        }
    },
    model: {
        event: 'change'
    },
    props: {
        btnTitle: {
            type: String,
            defaultValue: ""
        },
        titleName: {
            type: String,
            defaultValue: ""
        },
        classList: {
            type: String,
            defaultValue: ""
        },
        isShowDialog: {
            type: Boolean,
            required: true
        },
        funcCallbackEventData: {
            type: Function,
            required: true
        },
        typeInputClick: {
            type: String,
            required: true
        },
        vModel: {
            type: Object,
            defaultValue: ""
        },
        getCurrentUserInfo: {
            type: Object,
            required: true
        }
    },
    mounted: function () {
        if (this.vModel && _.has(this.vModel, "id")) {
            this.vModelDataRadio = this.vModel.id
        }
    },
    computed: {
        constant: function () {
            return Object.assign({}, C)
        },
        showDataFiledDialog: function () {
            return !!this.isShowDialog
        },
        value: function () {
            return this.vModelDataByFiled;
        },
        lengthStringVModel: function () {
            return _.isString(this.vModelDataByFiled)
                ? `${this.vModelDataByFiled}`.length
                : _.isObject(this.vModelDataByFiled)
                    ? Object.keys(this.vModelDataByFiled).length
                    : _.isArray(this.vModelDataByFiled)
                        ? this.vModelDataByFiled.length
                        : 0
        }
    },
    methods: {
        clickCallbackEventDataClose: function () {
            this.funcCallbackEventData({isTypeAction: false})
        },
        clickCallbackEventData: function () {
            let dataToUpdate = {};
            dataToUpdate.user_id = this.getCurrentUserInfo.id;
            if (this.typeInputClick === 'actUserName') {
                if (this.vModelDataByFiled.replace(/ /g, '').length < 1 || this.lengthStringVModel > this.numUserName) {
                    this.isValid = false;
                } else {
                    dataToUpdate.nickname = this.vModelDataByFiled;
                }
            } else if (this.typeInputClick === 'actRow') {
                if (this.vModelDataByFiled.replace(/ /g, '').length < 1 || this.lengthStringVModel > this.numRow) {
                    this.isValid = false;
                } else {
                    dataToUpdate.word_of_the_day = this.vModelDataByFiled;
                }
            } else if (this.typeInputClick === 'actContentStatus') {
                if (this.vModelDataByFiled.replace(/ /g, '').length < 1 || this.lengthStringVModel > this.numContentStatus) {
                    this.isValid = false;
                } else {
                    dataToUpdate.self_introduction = this.vModelDataByFiled;
                }
            }

            if (this.isValid) {
                //this.funcEmitData();
                this.updateUser(dataToUpdate);

                // Emit data before use method callback
                this.$nextTick(() => {
                    this.isValid = true;
                    this.funcCallbackEventData({isTypeAction: true})
                });
            }
        },
        updateUser: function (data) {
            this.$store.dispatch('updateCurrentUserDispatch', data);
        },
        funcEmitData: function () {
            if (!this.vModelDataByFiled) {
                return;
            }

            this.$emit('change', {[this.typeInputClick]: this.vModelDataByFiled});
        }
    },
    created() {
        let self = this;
        self.$nextTick(() => {
            if (self.typeInputClick === 'actUserName') {
                self.vModelDataByFiled = _.has(self.getCurrentUserInfo, "nickname") ? self.getCurrentUserInfo.nickname : "";
            }
            if (self.typeInputClick === 'actRow') {
                self.vModelDataByFiled = _.has(self.getCurrentUserInfo, "word_of_the_day") ? self.getCurrentUserInfo.word_of_the_day : "";
            }
            if (self.typeInputClick === 'actContentStatus') {
                self.vModelDataByFiled = _.has(self.getCurrentUserInfo, "self_introduction") ? self.getCurrentUserInfo.self_introduction : "";
            }
        });
    },
    destroyed() {
        this.vModelDataByFiled = null;
    }

}
</script>
