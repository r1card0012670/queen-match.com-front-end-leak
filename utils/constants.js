export default Object.freeze({
    TABS: "tabs",
    DETAIL: "detail",
    CONTENT: "content",
    MODAL_FULL: "modal-full",
    NOTIFICATION: "notify",

    _PREFIX_DEFINED_TAB: 'tab-',

    TYPE_COMPONENT: {
        C_HOME: "home",
        C_HOME_CAST: "home_cast",
        C_SEARCH_CAST: "search_cast",
        C_CHAT: "chat",
        C_BOOK_MERGE: "book_merge",
        C_FEED: "feed",
        C_PROFILE: "profile",
        C_SEARCH_USER: "search_user",
    },
    TAB_FEED: {
        tabFeeds: [
            {tab: 1, content: 'キャスト'},
            {tab: 2, content: 'ゲスト'},
        ]
    },
    TAB_RANK_USER: {
        cast: [
            {tab: 1, content: '総合', conditions: {},},
            {tab: 2, content: '新人', conditions: {is_new: true}},
        ],
        guests: [
            {tab: 1, content: '総合', api: '/ranking/user-top-spent'},
            {tab: 2, content: 'コール', api: '/ranking/user-top-ordered-group'},
            {tab: 3, content: '個別アポ', api: 'ranking/user-top-individual'},
            {tab: 4, content: 'ギフト', api: '/ranking/user-top-sending-gift'},
        ],
        segments: [
            {id: 1, content: "昨日"},
            {id: 7, content: "先週"},
            {id: 30, content: "先月"},
            {id: null, content: "全期間"},
        ],
    },
    LOCATION_ITEMS: [
        {id: null, name: '全国', items: []}, // none
        {
            id: 1,
            name: '東京',
            items: [
                {key: 1, place_id: 1, name: "恵比寿"},
                {key: 2, place_id: 1, name: "六本木"},
                {key: 3, place_id: 1, name: "西麻布"},
                {key: 4, place_id: 1, name: "渋谷"},
                {key: 5, place_id: 1, name: "赤坂"},
                {key: 6, place_id: 1, name: "銀座"},
                {key: 7, place_id: 1, name: "中目黒"},
                {key: 8, place_id: 1, name: "池袋"},
                {key: 9, place_id: 1, name: "新宿"},
                {key: 10, place_id: 1, other: true, name: "その他"},
            ]
        }, {
            id: 2,
            name: '福岡',
            items: [
                {key: 11, place_id: 2, name: "天神"},
                {key: 12, place_id: 2, name: "大名"},
                {key: 13, place_id: 2, name: "中洲"},
                {key: 14, place_id: 2, name: "今泉"},
                {key: 15, place_id: 2, name: "博多"},
                {key: 16, place_id: 2, name: "春吉"},
                {key: 17, place_id: 2, name: "北九州"},
                {key: 18, place_id: 2, other: true, name: "その他"},
            ]
        }, {
            id: 3,
            name: '名古屋',
            items: [
                {key: 19, place_id: 3, name: "栄"},
                {key: 20, place_id: 3, name: "名駅"},
                {key: 21, place_id: 3, name: "金山"},
                {key: 22, place_id: 3, name: "藤ヶ丘"},
                {key: 23, place_id: 3, other: true, name: "その他"},
            ]
        }, {
            id: 4,
            name: '大阪',
            items: [
                {key: 24, place_id: 4, name: "梅田"},
                {key: 25, place_id: 4, name: "北新地"},
                {key: 26, place_id: 4, name: "心斎橋・なんば"},
                {key: 27, place_id: 4, name: "京橋"},
                {key: 28, place_id: 4, name: "十三"},
                {key: 29, place_id: 4, name: "天満"},
                {key: 30, place_id: 4, name: "福島"},
                {key: 31, place_id: 4, name: "天王寺"},
                {key: 32, place_id: 4, other: true, name: "その他"},
            ]
        }, {
            id: 5,
            name: '仙台',
            items: [
                {key: 33, place_id: 5, name: "国分町"},
                {key: 34, place_id: 5, name: "仙台駅前"},
                {key: 35, place_id: 5, name: "仙台駅東口"},
                {key: 36, place_id: 5, name: "一番町"},
                {key: 37, place_id: 5, name: "長町"},
                {key: 38, place_id: 5, name: "泉中央"},
                {key: 39, place_id: 5, other: true, name: "その他"},
            ]
        }, {
            id: 6,
            name: '横浜',
            items: [
                {key: 40, place_id: 6, name: "横浜"},
                {key: 41, place_id: 6, name: "新横浜"},
                {key: 42, place_id: 6, name: "川崎"},
                {key: 43, place_id: 6, name: "みなとみらい"},
                {key: 44, place_id: 6, name: "関内"},
                {key: 45, place_id: 6, other: true, name: "その他"},
            ]
        }, {
            id: 7,
            name: '埼玉',
            items: [
                {key: 46, place_id: 7, name: "大宮"},
                {key: 47, place_id: 7, name: "浦和"},
                {key: 48, place_id: 7, name: "川越"},
                {key: 49, place_id: 7, name: "川口"},
                {key: 50, place_id: 7, other: true, name: "その他"},
            ]
        }, {
            id: 8,
            name: '沖縄',
            items: [
                {key: 51, place_id: 8, name: "松山"},
                {key: 52, place_id: 8, name: "国際通り"},
                {key: 53, place_id: 8, name: "若狭"},
                {key: 54, place_id: 8, other: true, name: "その他"},
            ]
        }, {
            id: 9,
            name: '札幌',
            items: [
                {key: 55, place_id: 9, name: "すすきの"},
                {key: 56, place_id: 9, name: "函館"},
                {key: 57, place_id: 9, name: "帯広"},
                {key: 58, place_id: 9, other: true, name: "その他"},
            ]
        }, {
            id: 10,
            name: '神戸',
            items: [
                {key: 59, place_id: 10, name: "三宮"},
                {key: 60, place_id: 10, name: "姫路"},
                {key: 61, place_id: 10, name: "尼崎"},
                {key: 62, place_id: 10, name: "西宮"},
                {key: 63, place_id: 10, name: "伊丹"},
                {key: 64, place_id: 10, other: true, name: "その他"},
            ]
        }, {
            id: 11,
            name: '熊本',
            items: [
                {key: 65, place_id: 11, name: "下通"},
                {key: 66, place_id: 11, name: "上通"},
                {key: 67, place_id: 11, name: "上の裏"},
                {key: 68, place_id: 11, name: "新市街"},
                {key: 69, place_id: 11, name: "水道町"},
                {key: 70, place_id: 11, other: true, name: "春日"},
            ]
        }, {
            id: 12,
            name: '広島',
            items: [
                {key: 72, place_id: 12, name: "流川町"},
                {key: 73, place_id: 12, name: "八丁堀"},
                {key: 74, place_id: 12, name: "紙屋町"},
                {key: 75, place_id: 12, other: true, name: "その他"},
            ]
        }, {
            id: 13,
            name: '京都',
            items: [
                {key: 76, place_id: 13, name: "京都駅"},
                {key: 77, place_id: 13, name: "三条駅"},
                {key: 78, place_id: 13, name: "祇園四条駅"},
                {key: 79, place_id: 13, name: "烏丸駅"},
                {key: 80, place_id: 13, other: true, name: "その他"},
            ]
        }, {
            id: 14,
            name: '静岡', items: [
                {key: 81, place_id: 14, name: "静岡駅南"},
                {key: 82, place_id: 14, name: "静岡駅北"},
                {key: 83, place_id: 14, name: "三島"},
                {key: 84, place_id: 14, name: "沼津"},
                {key: 85, place_id: 14, name: "熱海・伊豆"},
                {key: 86, place_id: 14, other: true, name: "その他"},
            ]
        }
    ],
    SCHEDULE_TO_JOIN_MINUTES: [
        {id: "m_30", value: 30, name: '30分後'},
        {id: "m_60", value: 60, name: '60分後'},
        {id: "m_90", value: 90, name: '90分後'},
        {id: "m_other", value: "OTHER", name: 'それ以外'},
    ],
    SET_TIME_HOURS_DEFAULT: 1,
    CAST_CLASS: [
        {id: "royal_vip", value: 4, name: 'ロイヤルVIP', price: 5500},
        {id: 'vip', value: 3, name: 'VIP', recommend: "(おすすめ)", price: 3000},
        {id: 'mix', value: 2, name: 'ミックス', price: 0},
        {id: "standard", value: 1, name: 'スタンダード', price: 1750},
    ],
    CAST_TYPE: [
        {id: "1", name: 'スタンダード'},
        {id: '2', name: 'VIP'},
        {id: '3', name: 'ロイヤルVIP'},
    ],
    USER_TYPE: [
        {id: 0, name: 'スタンダード'},
        {id: 1, name: '未利用'},
    ],

    ENUM_USE_FILE_MIMETYPE_TO_EXTENSION: [
        {
            extension: "gif",
            mimetype: "image/gif"
        },
        {
            extension: "jpeg",
            mimetype: "image/jpeg"
        },
        {
            extension: "jpg",
            mimetype: "image/jpeg"
        },
        {
            extension: "txt",
            mimetype: "text/plain"
        },
        {
            extension: "png",
            mimetype: "image/png"
        },
        {
            extension: "bmp",
            mimetype: "image/x-ms-bmp"
        },
        {
            extension: "svg",
            mimetype: "image/svg+xml"
        },
        // {
        //     extension: "doc",
        //     mimetype: "application/msword"
        // },
        // {
        //     extension: "pdf",
        //     mimetype: "application/pdf"
        // },
        // {
        //     extension: "eps",
        //     mimetype: "application/postscript"
        // },
        // {
        //     extension: "ai",
        //     mimetype: "application/postscript"
        // },
        // {
        //     extension: "rtf",
        //     mimetype: "application/rtf"
        // },
        // {
        //     extension: "xls",
        //     mimetype: "application/vnd.ms-excel"
        // },
        // {
        //     extension: "ppt",
        //     mimetype: "application/vnd.ms-powerpoint"
        // },
        // {
        //     extension: "zip",
        //     mimetype: "application/zip"
        // },
        // {
        //     extension: "img",
        //     mimetype: "application/octet-stream"
        // },
        // {
        //     extension: "docx",
        //     mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        // },
        // {
        //     extension: "xlsx",
        //     mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        // },
        // {
        //     extension: "pptx",
        //     mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        // },
        // {
        //     extension: "mp4",
        //     mimetype: "video/mp4"
        // },
        // {
        //     extension: "m4v",
        //     mimetype: "video/x-m4v"
        // },
        {
            extension: "psd",
            mimetype: "image/x-photoshop"
        }
    ],

    TAG_TYPE: {
        cast: 1,
        user: 2,
        order: 3,
        story: 4,
    },
    AVATAR_DEFAULT: '/images/avatar-default.png',

    PATH_PROFILE_VIEW: 'profile-view',

    STATUS_REQUEST_ORDER_PROCESS: {
        CREATE_ORDER_START: 'create_order_start',
        CREATE_ORDER_FAIL: 'create_order_fail',
        CREATE_ORDER_SUCCESS: 'create_order_success',
        PAYMENT_ORDER_SUCCESS: 'payment_order_success',
        PAYMENT_ORDER_THROW: 'payment_order_throw',
        FINISH_PROCESS_ORDER: 'finish_process_order',
    },
    STATUS_REQUEST_GIFT_PROCESS: {
        CREATE_GIFT_FINISH: 'create_gift_finish',
        CREATE_GIFT_FAIL: 'create_gift_fail',
        // CREATE_GIFT_SEND: 'create_gift_send',
        CREATE_GIFT_SUCCESS: 'create_gift_success',
        PAYMENT_GIFT_SUCCESS: 'payment_gift_success',
        PAYMENT_GIFT_CREATE: 'payment_gift_create',
        PAYMENT_GIFT_THROW: 'payment_gift_throw',
        FINISH_PROCESS_GIFT: 'finish_process_gift',
    },
    NOTIFICATION_EVENT: {
        EVENT_CANCEL_ORDER: 'cancel-order',
        EVENT_FINISH_ORDER: 'finish-order',
        EVENT_ORDER_MORE: 'order-more',
        EVENT_CREATE_ORDER: 'create-order',
        EVENT_RECRUITED_ENOUGH_CAST: 'order-recruited',
        EVENT_FOLLOW_CAST: 'follow-cast',
        EVENT_ORDER_ONE_ON_ONE: 'one-on-one',
        EVENT_ORDER_MATCHED: 'order-matched',
        EVENT_PAYMENT_REQUEST_ACCEPTED: 'payment-accepted',
        EVENT_PAYMENT_REQUEST_REJECTED: 'payment-rejected',
        EVENT_PRIOR_CAST: 'prior-cast',
    },
    PRICE:{
        ORDER_MORE_RATIO: 1.3,
        NIGHT_CHARGE: 5000,
        CAST_RECEIVE_RATIO: 0.82,
        NORMAL: 1750,
        VIP: 3000,
        ROYAL_VIP: 5500,
    },
    APP_NIGHT_CHARGE_TIME_START: "23:45:00", // 24hours
    APP_NIGHT_CHARGE_TIME_END: "06:00:00", // 24hours
    PERCENT_PRICE_EXTEND: 0.3, // 30%
    APP_PAYMENT_RATIO: 1,
    APP_PAYMENT_MIN: 10000,
    PAYMENT_REQUEST_STATUS: {
        pending: 0,
        accepted: 1,
        rejected: 2,
    }
});
