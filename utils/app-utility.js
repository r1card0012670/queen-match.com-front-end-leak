'use strict'; // 厳格モード

const {CHAT_TYPE_GROUP, TYPE_ROLE_USER, CHAT_TYPE_SINGLE, TIME_ZONE, CHAT_TYPE_MESSAGE, CHAT_TYPE_MESSAGE_ACCESS_USE_HTML} = require("./constant")
const C = require("./constants")
// const moment = require("moment");

require('moment/locale/ja');
const moment = require('moment-timezone');
const isHtml = require('is-html');


const Utility = function () {
};

/**
 *
 * @param base
 * @returns {string}
 */
Utility.prototype.convertDate = function (base) {
    let date = new Date(base);
    return date.toLocaleDateString();
};

/**
 *
 * @param base
 * @returns {string}
 */
Utility.prototype.convertDateTime = function (base) {
    let date = new Date(base);

    return [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        ].join('/') + ' ' +
        ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
};

/**
 * 日付の書式変更関数
 * @param date
 * @param format
 * @returns {*}
 */
Utility.prototype.dateFormat = function (date, format) {
    return moment(date).locale('ja').format(format);
};

/**
 * 日付の加算
 * @param date ベースの日付
 * @param add 数値
 * @param unit 加算単位
 * @returns {*}
 */
Utility.prototype.dateAdd = function (date, add, unit) {
    return moment(date).add(add, unit);
};

/**
 * 日付の減算
 * @param date ベースの日付
 * @param subtract 数値
 * @param unit 減算単位
 * @returns {*}
 */
Utility.prototype.dateSubtract = function (date, subtract, unit) {
    return moment(date).subtract(subtract, unit);
};

/**
 * 曜日の取得
 * @param date ベースの日付
 * @param format
 * @returns {*}
 */
Utility.prototype.getWeekDay = function (date, format = 'ddd') {
    return moment(date).locale('ja').format(format);
};

/**
 * 月末の日付取得
 * @param date ベースの日付
 * @param ctl 0:ベースの日付月の末日、0以上:次月以降、0未満: 先月以前
 * @param format 出力形式
 * @returns {*}
 */
Utility.prototype.getEndOfDate = function (date, ctl, format) {
    if (ctl > 0) {
        return moment(date).add(ctl, 'month').endOf('month').locale('ja').format(format);
    } else if (ctl < 0) {
        return moment(date).subtract(ctl * -1, 'month').endOf('month').locale('ja').format(format);
    } else {
        return moment(date).endOf('month').locale('ja').format(format);
    }
};

/**
 * 特定の日かそれ以前かどうか
 * @param date 判定対象の日付
 * @param compare_date 比較の日付
 * @returns {*}
 */
Utility.prototype.isSameOrBefore = function (date, compare_date) {
    return moment(date).isSameOrBefore(compare_date);
};

/**
 * 特定の日かそれ以降かどうか
 * @param date 判定対象の日付
 * @param compare_date 比較の日付
 * @returns {*}
 */
Utility.prototype.isSameOrAfter = function (date, compare_date) {
    return moment(date).isSameOrAfter(compare_date);
};

/**
 * 特定の期間内かどうか
 * @param date 判定対象の日付
 * @param compare_start_date 判定期間の開始日付
 * @param compare_end_date 判定期間の終了日付
 * @returns {*}
 */
Utility.prototype.isBetween = function (date, compare_start_date, compare_end_date) {
    return moment(date).isBetween(compare_start_date, compare_end_date);
};

/**
 * 閏年かどうか
 * @param year_list 西暦年の配列
 * @returns {*}
 */
Utility.prototype.isLeapYear = function (year_list) {
    return moment(year_list).isLeapYear();
};

/**
 *
 * @param date
 * @returns {boolean}
 */
Utility.prototype.isValidDate = function (date) {
    return moment(date).isValid()
};
/**
 *
 * @param date1
 * @param date2
 * @param unit
 * @returns {number}
 */
Utility.prototype.dateDiff = function (date1, date2, unit = 'days') {
    return moment(date1).diff(date2, unit);
};

/**
 *
 * @param duration
 * @param unit
 * @param format
 * @returns {*}
 */
Utility.prototype.durationMoment = function (duration, unit = 'days', format = "YYYY-MM-DD HH:mm:ss") {
    return moment.utc(moment.duration(duration, unit).asMilliseconds()).format(format)
};

/**
 *
 * @param date
 * @param unit
 * @returns {moment.Moment}
 */
Utility.prototype.dateStartOf = function (date, unit = "day") {
    if (!date) {
        return moment().startOf(unit);
    }
    return moment(date).startOf(unit);
};

/**
 *
 * @param date
 * @param unit
 * @returns {moment.Moment}
 */
Utility.prototype.dateEndOf = function (date, unit = "day") {
    if (!date) {
        return moment().endOf(unit);
    }
    return moment(date).endOf(unit);
};

/**
 *
 * @param format
 * @returns {string}
 */
Utility.prototype.momentTzNow = function (format = "") {
    return moment().tz(TIME_ZONE).format(format);
};

/**
 *
 * @param lastActiveTime
 * @returns {any}
 */
Utility.prototype.renderDiffTime = function (lastActiveTime) {
    if (!this.isValidDate(lastActiveTime)) {
        return null
    }
    let diff = moment(lastActiveTime).diff(moment(this.momentTzNow("YYYY-MM-DD HH:mm:ss")));

    return Math.abs(moment.duration(diff).asMinutes());
}
//////
Utility.prototype.formatPriceToFixed = function (price, current = "P") {
    let regex = new RegExp(/(\d)(?=(\d{3})+(?!\d))/, "g");

    return price.toString().replace(regex, '$1,') + current;
}

/**
 *
 * @param payload, format is object
 * @constructor
 */
const FuncStructureDataItemUser = function (payload) {
    this.id = payload.id;
    if (_.has(payload, "role")) {
        this.role = payload.role
    }
    this.name = _.has(payload, "name") ? payload.name : _.has(payload, "nickname") ? payload.nickname : "";
    // this.nickname = _.has(payload, "nickname") ? payload.nickname : new Date().getTime(); // Fake
    this.nickname = _.has(payload, "nickname") ? payload.nickname : "";
    this.active_status = _.has(payload, "active_status") ? payload.active_status : 0;
    this.annual_income = _.has(payload, "annual_income") ? payload.annual_income : null;
    this.birth_place = _.has(payload, "birth_place") ? payload.birth_place : null;
    this.date_of_birth = _.has(payload, "date_of_birth") ? payload.date_of_birth : null;
    this.age = _.has(payload, "age") ? payload.age : "";
    this.gender = _.has(payload, "gender") ? payload.gender : null;
    this.height = _.has(payload, "height") ? payload.height : null;
    this.job = _.has(payload, "job") ? payload.job : null;
    this.join_date = _.has(payload, "join_date") ? payload.join_date : null;
    this.last_active_time = _.has(payload, "last_active_time") ? payload.last_active_time : null;
    this.numbers_sending_gift = _.has(payload, "numbers_sending_gift") ? payload.numbers_sending_gift : null;
    this.point = _.has(payload, "point") ? payload.point : null;
    this.self_introduction = _.has(payload, "point") ? payload.self_introduction : null;
    // this.word_of_the_day = _.has(payload, "word_of_the_day") ? payload.word_of_the_day : "身長高いです！！ "; // Fake
    this.word_of_the_day = _.has(payload, "word_of_the_day") ? payload.word_of_the_day : null;
    this.phone_number = _.has(payload, "phone_number") ? payload.phone_number : "";

    let avatarUrl = '';
    let images = [];

    if (_.has(payload, "user_images") && payload.user_images.length > 0) {
        let fi = payload.user_images.findIndex(ele => _.has(ele, "set_as_avatar") && ele.set_as_avatar === 1)
        if (fi === -1) {
            fi = 0
        }
        avatarUrl = payload.user_images[fi].image

        payload.user_images.map(ele => images.push(Object.assign({}, ele, {url: ele.image})))
    } else {
        if (_.has(payload, "avatar")) {
            avatarUrl = payload.avatar
        }
    }

    this.avatar = avatarUrl !== '' ? avatarUrl : C.default.AVATAR_DEFAULT;
    this.images = images;
    this.user_images = _.has(payload, "user_images") && payload.user_images.length ? payload.user_images : [];
    if (_.has(payload, "working_time") && payload.working_time.length > 0) {
        this.working_time = payload.working_time
    } else {
        this.working_time = [];
    }
    this.referer_code = _.has(payload, "referer_code") ? payload.referer_code : "";
    this.sake = payload.sake;
    this.tobacco = payload.tobacco;
    this.cast_type = payload.cast_type;
    this.cohabitant = payload.cohabitant;
    this.created_at = _.has(payload, "created_at") ? payload.created_at : null;
    this.updated_at = _.has(payload, "updated_at") ? payload.updated_at : null;
    this.email = _.has(payload, "email") ? payload.email : "";
    this.residence = _.has(payload, "residence") ? payload.residence : null;
    this.literacy = _.has(payload, "literacy") ? payload.literacy : null;
    this.roles = _.has(payload, "roles") && _.isArray(payload.roles) ? payload.roles : [];
    this.siblings = payload.siblings;
    this.tags = _.has(payload, "tags") && _.isArray(payload.tags) ? payload.tags : [];
    this.user_type = payload.user_type;
    this.block_noti = payload.block_noti;
    this.price_point = payload.price_point;
    this.is_agency = payload.is_agency;
    this.cast_confirm = _.has(payload, "cast_confirm") ? payload.cast_confirm : null;
    // TODO
}

/**
 *
 * @param payload, format is object
 * @constructor
 */

/**
 *
 * @param payload, format is [object]
 * @returns {FuncStructureDataItemUser[]}
 */
Utility.prototype.funcRenderDataItemUserClone = function (payload) {
    return new FuncStructureDataItemUser(_.pick(payload, [
        "id", "name", "nickname", "active_status", "annual_income", "avatar", "role", "birth_place", "tags", "cast_type", "cohabitant",
        "date_of_birth", "age", "gender", "height", "job", "join_date", "last_active_time", "numbers_sending_gift",
        "point", "self_introduction", "word_of_the_day", "phone_number", "user_images", "working_time", "referer_code", "sake", "tobacco",
        "created_at", "email", "residence", "roles", "siblings", "updated_at", "user_type", "literacy", "block_noti", "price_point", 'is_agency',
        "cast_confirm"

    ]));
}

/**
 *
 * @param payload
 * @returns {{isNotFetch: (boolean|boolean), params: {[p: string]: *}}|*}
 */
Utility.prototype.renderDataCast = function (payload) {
    return {
        params: {
            ...Object.assign({}, _.pick(payload.user, ["height", "residence", "birth_place", "literacy", "annual_income",
                "job", "sake", "tobacco", "siblings", "cohabitant"]), {})

            // suggest-list?height=1&residence=100&birth_place&literacy&annual_income&job&sake&tobacco&siblings&cohabitant
        },
    }
}

/**
 *
 * @param user
 * @returns {{role: (string), roles: (Array|*[])}}
 */
Utility.prototype.renderRole = function (user) {
    let roles = user.roles
        ? _.compact(user.roles.map(ele => (_.has(ele, "role_name") ? `${ele.role_name}` : null)))
        : [];

    let role = _.indexOf(roles, TYPE_ROLE_USER.TYPE_CAST) !== -1
        ? TYPE_ROLE_USER.TYPE_CAST
        : _.indexOf(roles, TYPE_ROLE_USER.TYPE_USER) !== -1
            ? TYPE_ROLE_USER.TYPE_USER : null

    return {
        roles,
        role
    }
}

/**
 *
 * @param payload
 * @returns {string|*|null}
 */
const getNameClass = (payload) => {
    if (!_.has(payload, "role") || !payload.role) {
        return ""
    }
    if (payload.role === TYPE_ROLE_USER.TYPE_CAST && _.has(payload, "cast_type")) {
        const castClass = C.default.CAST_TYPE.find(ele => +ele.id === +payload.cast_type);

        return castClass ? castClass.name : null;
    }

    if (payload.role === TYPE_ROLE_USER.TYPE_USER && _.has(payload, "user_type")) {
        const castClass = C.default.USER_TYPE.find(ele => +ele.id === +payload.user_type);

        return castClass ? castClass.name : null;
    }

    return '';
}

/**
 *
 * @param data
 * @param userCurrentId
 * @returns {[]}
 */
Utility.prototype.convertDataRoomListChat = function (data, userCurrentId) {
    let results = [];

    (data || []).forEach(ele => {
        if (ele.hasOwnProperty("room_chats")) {
            let tempMember = [];
            let isReadUserCurrent = true;
            ele.room_chats.forEach(item => {
                if (_.has(item, "user_rooms") && +item.user_id === +userCurrentId) {
                    isReadUserCurrent = item.is_read
                }
                if (_.has(item, "user_rooms") && +item.user_id !== +userCurrentId) {
                    let tempUser = item.user_rooms
                    let role = _.has(item, "user_rooms.roles") && item.user_rooms.roles && item.user_rooms.roles.length ? item.user_rooms.roles[0].role_name : null;
                    if (role) {
                        // Is default group
                        let avatar = C.default.AVATAR_DEFAULT;

                        if (_.has(item, "user_rooms.user_avatar")) {
                            avatar = _.isObject(item.user_rooms.user_avatar) && _.has(item, "user_rooms.user_avatar.image")
                            && item.user_rooms.user_avatar.image
                                ? item.user_rooms.user_avatar.image
                                : C.default.AVATAR_DEFAULT;
                        }

                        let tag = getNameClass({
                            role,
                            ...role === TYPE_ROLE_USER.TYPE_CAST && {cast_type: item.user_rooms.cast_type},
                            ...role === TYPE_ROLE_USER.TYPE_USER && {user_type: item.user_rooms.user_type},
                        });

                        tempMember.push(Object.assign({}, tempUser, {
                            role,
                            avatar,
                            tag,
                            price_point: item.user_rooms.price_point
                        }))
                    }
                }
            });
            let tempChat = {
                ..._.has(ele, "last_message") && {...ele.last_message}
            };

            // Apply block for type single
            let isBlock = _.has(ele, "is_block") && `${ele.type}`.toUpperCase() === CHAT_TYPE_SINGLE ? ele.is_block : false;
            let title = `${ele.type}`.toUpperCase() === CHAT_TYPE_GROUP && _.has(ele, "title") ? ele.title : "";
            let latest_message_id = _.has(ele, "latest_message_id") && ele.latest_message_id ? ele.latest_message_id : -1;

            if (tempMember.length) {
                results.push({
                    users: tempMember,
                    chat: tempChat,
                    type: `${ele.type}`.toUpperCase(),
                    typeLowerCase: ele.type,
                    roomId: ele.room_id,
                    id: ele.id,
                    isReadRoom: isReadUserCurrent,
                    isBlock: +isBlock,
                    title,
                    latest_message_id
                })
            }
        }
    });

    return results
}

/**
 *
 * @param payload
 * @constructor
 */
const FuncStructureDataOrder = function (payload) {
    let order_real_times = null;
    let order_real_time_alls = null;
    if (_.has(payload, "order_real_times") && payload.order_real_times) {
        if (_.isObject(payload.order_real_times)) {
            order_real_times = new FuncStructureDataOrderOfCastRealtime(payload.order_real_times)
        }
    }
    if (_.has(payload, "order_real_time_alls") && payload.order_real_time_alls) {
        if (_.isArray(payload.order_real_time_alls)) {
            order_real_time_alls = (payload.order_real_time_alls || []).map(ele => new FuncStructureDataOrderOfCastRealtime(ele));
        }
    }
    this.id = payload.id
    this.user_id = payload.user_id
    this.schedule_join = payload.schedule_join
    this.cast_package = _.has(payload, "cast_package") ? payload.cast_package : null
    this.meeting_time = _.has(payload, "meeting_time") ? payload.meeting_time : null
    this.number_cast = _.has(payload, "number_cast") ? payload.number_cast : null
    this.number_cast_royal_vip = _.has(payload, "number_cast_royal_vip") ? payload.number_cast_royal_vip : null
    this.number_cast_standard = _.has(payload, "number_cast_standard") ? payload.number_cast_standard : null
    this.number_cast_vip = _.has(payload, "number_cast_vip") ? payload.number_cast_vip : null
    this.order_real_times = order_real_times;
    this.order_real_time_alls = order_real_time_alls;
    this.other_place = _.has(payload, "other_place") ? payload.other_place : null
    this.place_id = _.has(payload, "place_id") ? payload.place_id : null
    this.status = _.has(payload, "status") ? payload.status : null
    this.tags = _.has(payload, "tags") ? payload.tags : null
    this.total_points = _.has(payload, "total_points") ? payload.total_points : null
    this.actual_point = _.has(payload, "actual_point") ? payload.actual_point : null
}

/**
 *
 * @param payload
 * @constructor
 */
const FuncStructureDataOrderOfCastRealtime = function (payload) {
    this.id = payload.id
    this.order_id = payload.order_id
    this.cast_id = _.has(payload, "cast_id") && payload.cast_id ? +payload.cast_id : null
    this.real_start_time = _.has(payload, "real_start_time") ? payload.real_start_time : null
    this.real_end_time = _.has(payload, "real_end_time") ? payload.real_end_time : null
    this.point_extra = _.has(payload, "point_extra") ? payload.point_extra : null
    this.divide_status = _.has(payload, "divide_status") ? payload.divide_status : null
}


/**
 *
 * @param data
 * @returns {FuncStructureDataOrder}
 */
Utility.prototype.convertDataOrderOfCast = function (data) {
    return new FuncStructureDataOrder(
        Object.assign({},
            _.pick(data, [
                "cast_package", "id", "meeting_time", "number_cast", "number_cast_royal_vip", "number_cast_standard",
                "number_cast_vip", "order_real_times", "other_place", "place_id", "schedule_join", "status",
                "tags", "total_points", "user_id", "room_id", 'created_at', 'updated_at', 'actual_point'
            ])
        ));
}

/**
 *
 * @param payload, it's array
 * @returns {FuncStructureDataOrder[]}
 */
Utility.prototype.convertDataOrderOfUser = function (payload = []) {
    return (payload || []).map(data => new FuncStructureDataOrder(
        Object.assign({},
            _.pick(data, [
                "cast_package", "id", "meeting_time", "number_cast", "number_cast_royal_vip", "number_cast_standard",
                "number_cast_vip", "order_real_times", "other_place", "place_id", "schedule_join", "status",
                "tags", "total_points", "user_id", "room_id", 'created_at', 'updated_at', 'actual_point', 'order_real_time_alls'
            ])
        )));
}
/**
 *
 * @param data
 * @returns {FuncStructureDataOrderOfCastRealtime}
 */
Utility.prototype.convertDataOrderOfCastRealtime = function (data) {
    return new FuncStructureDataOrderOfCastRealtime(
        Object.assign({},
            _.pick(data, [
                "id", "order_id", "real_start_time", "real_end_time", 'cast_id', 'divide_status', 'point_extra', 'created_at', 'updated_at',
            ])
        ));
}

/**
 *
 * @param data
 * @param userCurrentId
 * @returns {[]}
 */
Utility.prototype.convertDataMessageListChat = function (data, userCurrentId) {
    let results = [];
    let keyAccessUseHtml = Object.keys(CHAT_TYPE_MESSAGE_ACCESS_USE_HTML).map(key => `${CHAT_TYPE_MESSAGE_ACCESS_USE_HTML[key]}`.toLowerCase());
    (data || []).forEach(message => {
        let mess = message;

        mess.keyFakeIdAndRemoveWhenApi = _.has(message, "keyFakeIdAndRemoveWhenApi");

        mess.isOwner = userCurrentId === message.user_id;

        if (message.content) {
            if (isHtml(message.content)) {
                mess.typeShowMessage = 'HTML_CODE'

                // Access use html, when system instruction
                if (_.indexOf(keyAccessUseHtml, `${message.type}`.toLowerCase()) !== -1) {
                    mess.typeShowMessage = 'HTML'
                }
            } else {
                mess.typeShowMessage = 'TEXT_RAW'
            }
        } else if (message.image) {
            mess.typeShowMessage = 'IMAGE'
        } else if (message.gift) {
            mess.typeShowMessage = 'GIFT'
        }

        mess.actionTypeMessage = CHAT_TYPE_MESSAGE.TEXT_DIV
        if (!!message.type) {
            switch (message.type) {
                case CHAT_TYPE_MESSAGE.GENERAL:
                case CHAT_TYPE_MESSAGE.CONFIRM_ORDER:
                case CHAT_TYPE_MESSAGE.CREATE_ORDER:
                case CHAT_TYPE_MESSAGE.ACCESS_ORDER:
                case CHAT_TYPE_MESSAGE.SYSTEM:
                case CHAT_TYPE_MESSAGE.GIFT:
                case CHAT_TYPE_MESSAGE.IMAGE:
                    mess.actionTypeMessage = message.type
                    break
            }
        }

        mess.avatar = message.hasOwnProperty("avatar") && message.avatar ? message.avatar : C.default.AVATAR_DEFAULT;
        mess.title = '';
        mess.subtitle = message.content;

        results.push(mess);
    });

    return results
}

/**
 *
 * @param lastActiveTime
 * @returns {string}
 */
Utility.prototype.renderOnlineStatus = function (lastActiveTime) {
    const time = this.isValidDate(lastActiveTime) ? moment.duration(moment().diff(moment(lastActiveTime))).asMinutes() : null;
    if (_.isNull(time)) {
        return 'オフライン';
    }
    if (time < 5) {
        return 'オンライン中';
    }
    if (time < 60) {
        return '１時間前';
    }

    return 'オフライン';
}

/**
 *
 * @param lastActiveTime
 * @returns {string}
 */
Utility.prototype.renderOnlineTypeClass = function (lastActiveTime) {
    const time = this.isValidDate(lastActiveTime) ? moment.duration(moment().diff(moment(lastActiveTime))).asMinutes() : null;
    if (_.isNull(time)) {
        return 'offline';
    }
    if (time < 5) {
        return 'online';
    }
    if (time < 60) {
        return 'no-plan';
    }

    return 'offline';
}

/**
 *
 * @param str
 * @param obj
 * @returns {*}
 */
Utility.prototype.renderCodeSnippet = function (str, obj) {
    return str.replace(/\${(.*?)}/g, (x, g) => obj[g]);
}

module.exports = new Utility();
