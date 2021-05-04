export const AUTH = {
    ID_TOKEN_KEY: 'id_token',
    ACCESS_TOKEN_KEY: 'access_token',
    SOCIAL_LINE: 'social_line',
    USER: 'user',
    CLIENT_REDIRECT: '/line-callback'
}

export const TYPE_ROLE_USER = {
    TYPE_USER: "user",
    TYPE_CAST: "cast",
    TYPE_ADMIN: "admin",
}

export const ROLE_CONFIRM_CAST = {
    CONFIRM: 1,
    APPROVED: 2
};

export const KEY_DEFINE_COOKIES = {
    SELECT_LOCAL_BOOK: "select_local_book",
    SELECT_FEELING_BOOK: "select_feeling_book",
    USER_LOCATION: "user_location"
    // TODO
}

export const NEW_USER_COUPON_KEY = '初回限定クーポン';

export const UNSELECT = '未選択';
export const LIMIT_NUMBER_FEED_IN_USER_PROFILE = 5;

export const CHAT_TYPE_SINGLE = "SINGLE";
export const CHAT_TYPE_GROUP = "GROUP";
export const CHAT_TYPE_SUPPORT = "SUPPORT";
export const CHAT_SUPPORT_USER_ID = 4;
export const CHAT_SUPPORT_USER_NAME = "Queen Support Center";

export const CHAT_TYPE_MESSAGE = {
    SYSTEM: 'system',
    GENERAL: 'general',
    CREATE_ORDER: 'create_order',
    CONFIRM_ORDER: 'confirm_order',
    ACCESS_ORDER: 'access_order',
    TEXT_DIV: 'text_div',
    GIFT: 'gift',
    IMAGE: 'image',
};

export const CHAT_TYPE_MESSAGE_ACCESS_USE_HTML = {
    SYSTEM: 'system',
    GENERAL: 'general',
    CREATE_ORDER: 'create_order',
    USER_CANCEL_ORDER: 'user_cancel_order',
    CONFIRM_ORDER: 'confirm_order',
    ACCESS_ORDER: 'access_order',
};
export const MAX_SIZE_IMAGE = 780

export const CHAT_MESSAGE_FORMAT_CREATE_ORDER_1_1 = "<p class='text-left p-0 m-0'>この日程と人数でどうですか？ </p>"
    +"<p class='text-left p-0 m-0'>日程：${txtDate}</p>"
    + "<p class='text-left p-0 m-0'>人数：${numPeople}</p>"
     +"<p class='text-left p-0 m-0'>時間：${txtTime}</p>"
    +"<p class='text-left p-0 m-0'>消費ポイント：${payPoint}</p>"
    +"<p class='text-left p-0 m-0'>（延長：${extension}/15分）</p>";

export const CHAT_MESSAGE_FORMAT_CONFIRM_ORDER_1vs1 = "<p class='text-left p-0 m-0'>個別コールが確定しました </p>"
    +"<p class='text-left p-0 m-0'>ーーーーーーーーーーーー</p>"
    + "<p class='text-left p-0 m-0'>◎合流時間をタイマー計測</p>"
     +"<p class='text-left p-0 m-0'>（位置情報で整合性確認）</p>"
    +"<p class='text-left p-0 m-0'>※自動延長となります。</p>"
    +"<p class='text-left p-0 m-0'>ーーーーーーーーーーーー</p>"
    +"<p class='text-left p-0 m-0'>マナーを守って素敵な時間を</p>"
    +"<p class='text-left p-0 m-0'>お過ごしください。</p>";

export const CHAT_MESSAGE_FORMAT_CANCEL_CONFIRM_ORDER_1vs1 = "<p class='text-center p-0 m-0'>${dateTime}</p><p class='text-center p-0 m-0'>${userName}が個別アポをキャンセルしました</p>"
export const CHAT_MESSAGE_FORMAT_USER_CANCEL_ORDER = "<p class='text-center p-0 m-0'>${dateTime}</p><p class='text-center p-0 m-0'>${userName}xxxxxxxxxxxxxxxxxxxxxxxx</p>"
export const CHAT_MESSAGE_CAST_JOINED_MEETING = "<p class='text-center p-0 m-0'>${dateTime}</p><p class='text-center p-0 m-0'>${userName}さんが合流しました</p>"
export const CHAT_MESSAGE_CAST_DISBANDED = "<p class='text-center p-0 m-0'>${dateTime}</p><p class='text-center p-0 m-0'>${userName}さんが解散しました</p>"
export const CHAT_MESSAGE_CAST_LAST_10_BEFORE_END_TIME = "<p class='text-center p-0 m-0'>${userName}さんの解散予定時刻まで残り10分です</p>"

export const TYPE_CHANNEL_ROOM_PRIVATE = {
    "event_add_channel_room": "event_add_channel_room",
    "event_new_message_channel": "event_new_message_channel",
    "event_reset_count_message_channel": "event_reset_count_message_channel",
    "event_block_channel": "event_block_channel",
}

export const TYPE_CHANNEL_ROOMS = {
    "thread_add_member_channel": "thread_add_member_channel",
    "thread_new_messages": "thread_new_messages",
    "thread_block_channel": "thread_block_channel",
    "thread_update_order_channel": "thread_update_order_channel",
};

export const ORDER_STATUS_HIRING_CAST = 1;
export const ORDER_STATUS_HAS_RECRUITED_ENOUGH_CAST = 2;
export const ORDER_STATUS_PAID = 3;
export const ORDER_STATUS_FINISH = 4;
export const ORDER_STATUS_CANCEL = 5;
export const ORDER_STATUS_USER_CANCEL = 6;

export const TIME_ZONE = 'Asia/Tokyo'

export const ACTIVE_STATUS_GIFT_ENABLE = 1
export const ACTIVE_STATUS_GIFT_DISABLE = 0

export const TYPE_USER_FOLLOW_CAST = 1
export const TYPE_CAST_FOLLOW_USER = 0
