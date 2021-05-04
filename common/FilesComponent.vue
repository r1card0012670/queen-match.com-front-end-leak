<template>
    <div class="d-box-files">
        <div v-for="(item, index) in dataFiles" :key="index" :class="[`d-ma-2 d-file-item`]">
            <div class="d-box-view-image" v-if="checkMimeFile(item) === 'MIME_IMAGES'" role="button">
                <v-img :class="[roundedSizeImage]" :max-width="maxWidth" max-height="50%" contain :src="item.url"
                       @click="showFullImg(item.url)"/>
            </div>
        </div>

        <FileViewerImageDialog v-if="isShowFileViewerImage" :isShowDialog="isShowFileViewerImage" :src="url"
                               :roundedSizeImage="roundedSizeImage" :max-width="maxWidth"
                               :funcCloseDialog="clickCloseDialog"/>
    </div>
</template>

<script>
import C from "../utils/constants";
import FileViewerImageDialog from "./file/FileViewerImageDialog";

export default {
    data: function () {
        return {
            isShowFileViewerImage: false,
            url: 'https://coding.tools/image/20190308/cartoon_image_to_base64.png',
        }
    },
    props: {
        dataFiles: {
            type: Array,
            required: true
        },
        roundedSizeImage: {
            type: String,
            defaultValue: "rounded-lg"
        },
        maxWidth: {
            type: Number,
            defaultValue: 425
        }
    },
    components: {
        FileViewerImageDialog
    },
    computed: {
        constant: function () {
            return Object.assign({}, C)
        },
    },
    methods: {
        checkMimeFile: function (file) {
            let infoFile = this.getMimeByFileName(file);

            let mimeDoc = [
                "application/rtf", // .rtf
                "application/msword", // .doc, .dot, .rtf
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                "application/vnd.openxmlformats-officedocument.wordprocessingml.template", //.dotx
                "application/vnd.ms-word.document.macroEnabled.12", // .docm
                "application/vnd.ms-word.template.macroEnabled.12" // .dotm
            ];
            let mimeExcel = [
                "application/vnd.ms-excel", // .xla, .xls,.xlt,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                "application/vnd.openxmlformats-officedocument.spreadsheetml.template", // .xltx
                "application/vnd.ms-excel.sheet.macroEnabled.12",  // .xlsm
                "application/vnd.ms-excel.template.macroEnabled.12", // .xltm
                "application/vnd.ms-excel.addin.macroEnabled.12", // .xlam
                "application/vnd.ms-excel.sheet.binary.macroEnabled.12", // .xlsb
            ];
            let mimePowerPoint = [
                "application/vnd.ms-powerpoint", // .ppt, .pot,.pps, .ppa
                "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
                "application/vnd.openxmlformats-officedocument.presentationml.template", // .potx
                "application/vnd.openxmlformats-officedocument.presentationml.slideshow", // .ppsx
                "application/vnd.ms-powerpoint.addin.macroEnabled.12",  //.ppam
                "application/vnd.ms-powerpoint.presentation.macroEnabled.12", //.pptm
                "application/vnd.ms-powerpoint.template.macroEnabled.12", // .potm
                "application/vnd.ms-powerpoint.slideshow.macroEnabled.12", // .ppsm
            ]
            let mimeAccess = ["application/vnd.ms-access"];

            if (/image/.test(infoFile.type)) {
                return "MIME_IMAGES";
            } else if (/video/.test(infoFile.type)) {
                return "MIME_VIDEOS";
            } else if (/audio/.test(infoFile.type)) {
                return "MIME_AUDIOS";
            } else if (mimeDoc.indexOf(infoFile.type) !== -1) {
                return "MIME_DOCX";
            } else if (mimeExcel.indexOf(infoFile.type) !== -1) {
                return "MIME_XLS";
            } else if (mimePowerPoint.indexOf(infoFile.type) !== -1) {
                return "MIME_PPT";
            } else if (mimeAccess.indexOf(infoFile.type) !== -1) {
                return "MIME_ACCESS";
            }

            switch (("" + infoFile.type).toLowerCase()) {
                case "application/pdf":
                    return "MIME_PDF";
                case "text/html":
                    return "MIME_HTML";
                case "application/postscript": // .eps, .ai
                case "text/plain":
                    return "MIME_PLAIN"; // .txt
                case "text/xml":
                    return "MIME_XML";
                case "application/x-gzip":
                case "application/zip":
                case "application/x-rar-compressed":
                case "application/x-7z-compressed":
                case "application/x-zip-compressed":
                    return "MIME_RAR_OR_ZIP";
                default:
            }
            // Check mime option
            let objMimeAllow = {}
            this.constant.ENUM_USE_FILE_MIMETYPE_TO_EXTENSION.forEach(ele => {
                objMimeAllow[`${ele.extension}`.toLowerCase()] = ele
            });

            if (objMimeAllow[infoFile.extension]) {
                if (infoFile.type === "application/octet-stream") {
                    return "MIME_IMAGES";
                }
            }

            return "unknown"; // Or you can use the blob.type as fallback
        },
        getMimeByFileName: function (file) {
            let regex = new RegExp(/(.*)(?:\.([^.]+$))/);
            let fileName = `${_.has(file, "name") ? file.name : _.has(file, "url") ? file.url : ""}`;

            let myExtension = fileName.match(regex)[2] ? fileName.match(regex)[2].toLowerCase() : "";
            file.extension = myExtension;

            if (!file.type) {
                let found = this.constant.ENUM_USE_FILE_MIMETYPE_TO_EXTENSION.find(function (element) {
                    return `${element.extension}`.toLowerCase() === myExtension;
                });

                if (found) {
                    file.type = found.mimetype
                }
            }

            return file;
        },
        clickCloseDialog: function () {
            this.isShowFileViewerImage = false
        },
        showFullImg: function (url) {
            this.isShowFileViewerImage = true;
            this.url = url;
        }
    }
}
</script>
