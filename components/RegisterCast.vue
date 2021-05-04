<template>
    <v-dialog v-model="show" :content-class="`d-dialog-show-fullscreen`" max-width="440"
              fullscreen persistent hide-overlay transition="dialog-bottom-transition"
              scrollable
    >
        <v-card :id="`dialog-action-detach-invoice`"
                :class="[`d-action-detach-invoice`, 'd-border-radius-top-15']">
            <v-card-title :id="'d-card-title-detach-invoice'"
                          :class="[`headline d-header-box-action-detach-invoice p-1`, 'd-border-bottom']">
                <div class="d-flex align-items-center d-custom-header p-2 d-width-100">
                    <button class="d-flex pl-2 pr-3" v-on:click="closeDialog">
                        <v-img src="../../images/times.svg"></v-img>
                    </button>
                </div>
            </v-card-title>

            <v-card-text :id="'d-card-text-form-register'" class="d-card-text-form-register p-0">
                <v-col class="px-4 d-card-form-register p-0">
                    <v-card-text class="p-0">
                        <v-form ref="registerForm" class="register-form" lazy-validation>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" class="p-0">
                                        <div class="d-label d-title-form-register font-weight-bold pb-1">名前
                                        </div>
                                        <v-text-field solo v-model="name" :rules="nameRules" type="text"
                                                      :error-messages="nameErrors"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="p-0">
                                        <div class="d-label d-title-form-register font-weight-bold pb-1">電話番号
                                        </div>
                                        <v-text-field solo v-model="phoneNumber" :rules="phoneNumberRules"
                                                      :error-messages="phoneNumberError"
                                                      type="text"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="p-0">
                                        <div class="d-label d-title-form-register font-weight-bold pb-1">メールアドレス
                                        </div>
                                        <v-text-field solo v-model="email" :rules="emailRules" type="email"
                                                      label="メールアドレスを入力"
                                                      :error-messages="emailErrors"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="p-0">
                                        <div class="d-flex d-title-form-register justify-content-between pb-1">
                                            <span class="d-label d-inline-flex font-weight-bold">パスワード</span>
                                        </div>
                                        <v-text-field solo v-model="password"
                                                      :append-icon="showPassword ? 'remove_red_eye' : 'fa-eye-slash d-font-size-19 d-color-eye'"
                                                      :rules="passwordRules"
                                                      :type="showPassword ? 'text' : 'password'"
                                                      label="パスワードを入力"
                                                      hint="8文字以上16文字以内(文字と数字)で入力してください。"
                                                      @click:append="showPassword = !showPassword"
                                                      :error-messages="passwordErrors"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="p-0">
                                        <div class="d-flex d-title-form-register justify-content-between pb-1">
                                            <span class="d-label d-inline-flex font-weight-bold">確認パスワード</span>
                                        </div>
                                        <v-text-field solo v-model="passwordConfirmation"
                                                      :append-icon="showPasswordConfirm ? 'remove_red_eye' : 'fa-eye-slash d-font-size-19 d-color-eye'"
                                                      :rules="passwordConfirmationRules"
                                                      :type="showPasswordConfirm ? 'text' : 'password'"
                                                      label="確認パスワードを入力"
                                                      @click:append="showPasswordConfirm = !showPasswordConfirm"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="p-0">
                                        <div class="d-label d-title-form-register font-weight-bold pb-1">ニックネーム
                                        </div>
                                        <v-text-field solo v-model="nickname" :rules="nicknameRules"
                                                      :error-messages="nicknameErrors"
                                                      type="text"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="p-0">
                                        <div class="d-label d-title-form-register font-weight-bold pb-1">居住地
                                        </div>
                                        <v-select
                                            :items="locations"
                                            dense
                                            item-text="value"
                                            item-value="id"
                                            solo v-model="residence"
                                            :error-messages="residenceErrors"
                                            :rules="residenceRules"
                                            label="未選択"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="12" class="p-0">
                                        <div class="d-label d-title-form-register font-weight-bold pb-1">身分証明写真
                                        </div>
                                        <div class="image-preview">
                                            <div v-for="(item,index) in files" :key="index"
                                                 class="image-preview__item">
                                                <span class="image-preview__item__remove"
                                                      @click="removeInfoImage(index)">&times;</span>
                                                <div class="image-preview__item__wrapper">
                                                    <img alt="" class="image-preview__item__image"
                                                         :src="readFileAsDataUrl(item)">
                                                </div>
                                            </div>
                                        </div>
                                        <v-file-input
                                            truncate-length="15"
                                            dense
                                            :rules="imagesRules"
                                            accept="image/png, image/jpeg, image/bmp"
                                            @change="fileInputChange"
                                            label="免許証・パスポート・マイナンバーカード"
                                            :error-messages="filesErrors"
                                        >

                                        </v-file-input>
                                    </v-col>
                                    <v-col cols="12" class="p-0 mt-3">
                                        <div class="d-label d-title-form-register font-weight-bold pb-1">プロフィール写真
                                        </div>
                                        <div class="image-preview">
                                            <div v-for="(item,index) in publicFiles" :key="index"
                                                 class="image-preview__item">
                                                <span class="image-preview__item__remove"
                                                      @click="removePublicImage(index)">&times;</span>
                                                <div class="image-preview__item__wrapper">
                                                    <img alt="" class="image-preview__item__image"
                                                         :src="readFileAsDataUrl(item)">
                                                </div>
                                            </div>
                                        </div>
                                        <v-file-input
                                            truncate-length="15"
                                            dense
                                            :rules="imagesPublicRules"
                                            accept="image/png, image/jpeg, image/bmp"
                                            @change="publicImageFileInputChange"
                                            :error-messages="publicFilesErrors"
                                        ></v-file-input>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col class="d-flex" cols="12" align-end>
                                        <v-btn type="submit" x-large block
                                               class="d-action-register"
                                               @click="registerCast">
                                            登録
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-card-text>
                </v-col>
            </v-card-text>
        </v-card>

        <v-dialog v-if="overlay" v-model="overlay" fullscreen persistent max-width="440"
                  :content-class="`d-dialog-show-fullscreen`"
                  transition="dialog-center-transition">

            <notice-component :is-show-notice="overlay" :is-show-close="false" :class-name="'d-flex flex-column align-items-center'">
                <template v-slot:cbody>
                    <svg width="63" height="48" viewBox="0 0 63 48" fill="none"
                         class="ml-5"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M58.0781 0.9375L18.7031 40.3125L4.78125 26.3906C4.07812 25.8281 3.09375 25.8281 2.39062 26.3906L0.84375 28.0781C0.140625 28.6406 0.140625 29.7656 0.84375 30.4688L17.5781 47.2031C18.1406 47.7656 19.2656 47.7656 19.8281 47.2031L62.0156 5.01562C62.7188 4.3125 62.7188 3.1875 62.0156 2.625L60.4688 0.9375C59.7656 0.375 58.7812 0.375 58.0781 0.9375Z"
                            fill="white"/>
                    </svg>
                    <div class="pt-3 text-center color--white">
                        登録しました
                    </div>
                </template>
            </notice-component>
        </v-dialog>
    </v-dialog>
</template>

<script>
import {mapActions, mapState, mapGetters} from 'vuex'
import NoticeComponent from "./NoticeComponent";
import C from '../utils/constants'

export default {
    components: {
        NoticeComponent
    },
    data() {
        return {
            show: true,
            name: '',
            phoneNumber: '',
            email: '',
            nickname: '',
            residence: null,
            password: '',
            passwordConfirmation: '',
            showPassword: false,
            showPasswordConfirm: false,
            files: [],
            publicFiles: [],
            errors: {},
            previewInfoImages: [],
            overlay: false,
            uploadTooMuchImage: false,
            uploadTooMuchInfoImage: false,
        }
    },
    computed: {
        ...mapState({
            getInfoManagement: state => state.info.getInfoManagement,
        }),
        ...mapGetters({
            referrerCode: 'referrerCode',
        }),
        constant: function () {
            return Object.assign({}, C)
        },
        nameRules: function () {
            return [
                v => !!v || "必須項目に入力してください。",
                v => !!v && v.length <= 255 || "255文字以ないで入力してください。",
            ]
        },
        phoneNumberRules: function () {
            return [
                v => !!v || "必須項目に入力してください。",
                v => /^\d{10,11}$/.test(v) || "ハイフンなし、10数字以上11数字以内で入力してください。",
            ]
        },
        emailRules: function () {
            return [
                v => !!v || "必須項目に入力してください。",
                v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'メールアドレスの形式が正しくありません。',
            ]
        },
        nicknameRules: function () {
            return [
                v => !!v || "必須項目に入力してください。",
                v => !!v && v.length <= 255 || "255文字以ないで入力してください。",
            ]
        },
        passwordRules: function () {
            return [
                v => !!v || "必須項目に入力してください。",
                v => (v && v.length >= 8) || "8文字以上16文字以内(文字と数字)で入力してください。",
                v => (v && v.length <= 16) || "8文字以上16文字以内(文字と数字)で入力してください。",
            ]
        },
        passwordConfirmationRules: function () {
            return [
                v => v === this.password || "新パスワードと再入力パスワードが一致しません。",
            ]
        },
        residenceRules: function () {
            return [
                v => !!v || "必須項目に入力してください。",
            ]
        },
        imagesRules: function () {
            return [
                () => this.files.length > 0 || '必須項目に入力してください。',
                () => !this.uploadTooMuchImage || '2枚以下の写真をアップロードしてください',
                () => !this.files || !this.files.some(file => file.size > 5_000_000) || '5MB以下の写真をアップローダしてください。',
            ]
        },
        imagesPublicRules: function () {
            return [
                () => this.publicFiles.length > 0 || '必須項目に入力してください。',
                () => !this.uploadTooMuchInfoImage || '3枚以下の写真をアップロードしてください',
                () => !this.publicFiles || !this.publicFiles.some(file => file.size > 5_000_000) || '5MB以下の写真をアップローダしてください。',
            ]
        },
        nameErrors: function () {
            return _.has(this.errors, "full_name") ? this.errors.full_name[0] : null;
        },
        phoneNumberError: function () {
            return _.has(this.errors, "phone_number") ? this.errors.phone_number[0] : null;
        },
        emailErrors: function () {
            return _.has(this.errors, "email") ? this.errors.email[0] : null;
        },
        nicknameErrors: function () {
            return _.has(this.errors, "nickname") ? this.errors.nickname[0] : null;
        },
        residenceErrors: function () {
            return _.has(this.errors, "residence") ? this.errors.residence[0] : null;
        },
        passwordErrors: function () {
            return _.has(this.errors, "password") ? this.errors.password[0] : null;
        },
        filesErrors: function () {
            return _.has(this.errors, "images") ? this.errors.images[0] : null;
        },
        publicFilesErrors: function () {
            return _.has(this.errors, "images_public") ? this.errors.images_public[0] : null;
        },
        locations: function () {
            return this.getInfoManagement.filter(x => x.key === 'residence' && x.value !== '未選択');
        }
    },
    methods: {
        ...mapActions({
            register: 'registerCast',
        }),
        closeDialog: function () {
            this.$emit('close');
        },
        fileInputChange: function (file) {
            if (file && this.files.length < 2) {
                this.files.push(file);
            } else {
                this.uploadTooMuchImage = true;
            }
        },
        publicImageFileInputChange: function (file) {
            if (file && this.publicFiles.length < 3) {
                this.publicFiles.push(file);
            } else {
                this.uploadTooMuchInfoImage = true;
            }
        },
        registerCast: function (event) {
            event.preventDefault();
            this.uploadTooMuchImage = false;
            this.uploadTooMuchInfoImage = false;
            if (this.$refs.registerForm && this.$refs.registerForm.validate()) {
                const formData = new FormData();
                for (let i = 0; i < this.files.length; i++) {
                    formData.append('images[]', this.files[i]);
                }
                for (let i = 0; i < this.publicFiles.length; i++) {
                    formData.append('images_public[]', this.publicFiles[i]);
                }
                formData.append('full_name', this.name);
                formData.append('phone_number', this.phoneNumber);
                formData.append('email', this.email);
                formData.append('nickname', this.nickname);
                formData.append('residence', this.residence);
                formData.append('password', this.password);
                formData.append('password_confirmation', this.passwordConfirmation);
                formData.append('ref', this.referrerCode);

                this.register(formData).then(() => {
                    this.overlay = true;
                    setTimeout(() => {
                        this.closeDialog();
                    },1000);
                }).catch(({errors}) => {
                    console.log(errors)
                    this.errors = errors
                })
            }
        },
        readFileAsDataUrl: function (file) {
            return URL.createObjectURL(file);
        },
        removeInfoImage: function (index) {
            this.files.splice(index, 1);
            this.uploadTooMuchImage = false;
        },
        removePublicImage: function (index) {
            this.publicFiles.splice(index, 1);
            this.uploadTooMuchInfoImage = false;
        }
    },
    created() {
        if (!this.getInfoManagement.length) {
            this.$store.dispatch('getInfoManagementDispatch', {});
        }
    }
}
</script>

<style lang="scss" scoped>
.image-preview {
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;

    .image-preview__item {
        box-sizing: border-box;
        width: 50%;
        position: relative;
        padding-bottom: 50%;

        &__wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 10px;
        }

        &__image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            box-shadow: 0 0 7px 1px rgb(0 0 0 / 75%);
            -webkit-box-shadow: 0 0 7px 1px rgb(0 0 0 / 75%);
            -moz-box-shadow: 0 0 7px 1px rgb(0 0 0 / 75%);
        }

        &__remove {
            position: absolute;
            top: 15px;
            right: 15px;
            cursor: pointer;
            z-index: 2;
        }
    }
}

.register-form {
    &::v-deep {
        .v-file-input__text {
            display: none;
        }

        .v-input__append-inner {
            display: none;
        }

        .v-text-field .v-label--active {
            transform: unset;
        }

        .v-select.v-input--dense .v-select__selection--comma {
            padding-left: 12px;
        }
    }
}
</style>
