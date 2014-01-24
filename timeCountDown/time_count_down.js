/**
 * @fileoverview  #倒计时方法
 * @author  #Fhuan
 * @date  14-1-10
 */
(function ($) {
    var team = $.IC || ($.IC = {}),
        config = {
            textHighlight: "text_highlight"
        },
        countDown = {
            cacheDate: null,
            timer: null,
            init: function (o) {
                var self = this,
                    leftsecond,
                    millisecond,
                    startDate = o.startDate,
                    endDate = o.endDate,
                    cacheDate = self.cacheDate = {};

                if (startDate > endDate) return false;

                leftsecond = (endDate - startDate) / 1000;
                cacheDate.days = parseInt(leftsecond / 3600 / 24);
                cacheDate.hours = parseInt((leftsecond / 3600) % 24);
                cacheDate.minute = parseInt((leftsecond / 60) % 60);
                cacheDate.seconds = parseInt(leftsecond % 60);
                cacheDate.leftsecond = millisecond = leftsecond;

                self.count(o);

                self.timer = o.timer = setTimeout(function () {
                    cacheDate.leftsecond -= 1;
                    self.count(o);
                    if (cacheDate.leftsecond == 0) {
                        self.done(o);
                        return;
                    }
                    console.log(1)
                    setTimeout(arguments.callee, 1000);
                }, 1000);
            },
            count: function (o) {
                var self = this,
                    cacheDate = self.cacheDate,
                    millisecond = cacheDate.leftsecond,
                    target = o.target,
                    oDays = cacheDate.days,
                    oHours = cacheDate.hours,
                    oMinute = cacheDate.minute,
                    oSeconds = cacheDate.seconds,
                    days = parseInt(millisecond / 3600 / 24),
                    hours = parseInt((millisecond / 3600) % 24),
                    minute = parseInt((millisecond / 60) % 60),
                    seconds = parseInt(millisecond % 60);

                days = days < 100 ? "0" + days : days;
                hours = hours < 10 ? "0" + hours : hours;
                minute = minute < 10 ? "0" + minute : minute;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                if ($.trim(target.html()) !== "") {
                    if (oDays != days) {
                        if (target.find(".days").length) {
                            cacheDate.days = days;
                            target.find(".days")[0].innerHTML = days;
                        }
                    }
                    if (oHours != hours) {
                        if (target.find(".hours").length) {
                            cacheDate.hours = hours;
                            target.find(".hours")[0].innerHTML = hours;
                        }
                    }
                    if (oMinute != minute) {
                        if (target.find(".minute").length) {
                            cacheDate.minute = minute;
                            target.find(".minute")[0].innerHTML = minute;
                        }
                    }
                    if (oSeconds != seconds) {
                        if (target.find(".seconds").length) {
                            cacheDate.seconds = seconds;
                            target.find(".seconds")[0].innerHTML = seconds;
                        }
                    }
                } else {
                    var html = " <i class=\"" + o.textHighlight + " " + "days" + "\">" + days + "</i> 天 " +
                        "<i class=\"" + o.textHighlight + " " + "hours" + "\">" + hours + "</i> 时 " +
                        "<i class=\"" + o.textHighlight + " " + "minute" + "\">" + minute + "</i> 分 " +
                        "<i class=\"" + o.textHighlight + " " + "seconds" + "\">" + seconds + "</i> 秒";

                    target.html(html);
                }
            },
            done: function (o) {
                var doneFn = typeof o.done === "function" && o.done;
                if (o.timer) {
                    clearTimeout(o.timer);
                    o.timer = null;
                    doneFn();
                }
            }
        },
        isDate = function (str) {
            var reg = /^(\d{4})(\/(\d{2}))\2(\s|((,|\s)(\d{2}):(\d{1,2}):(\d{1,2})))$/;
        };


    var TimeCountDown = function (target, options) {

        var startDate = new Date(options.startDate),
            endDate = new Date(options.endDate),
            OBJECT = Object.prototype.toString,
            target = $(target).eq(0);
        if (!target)  return;

        console.log(OBJECT.call(startDate))
        if (OBJECT.call(startDate) !== "[object Date]" || OBJECT.call(endDate) !== "[object Date]") return;

        startDate = +new Date(startDate);
        endDate = +new Date(endDate);

        if (startDate > endDate) return;

        //合并默认配置
        var o = $.extend({}, config, options);
        o.target = target;
        o.startDate = startDate;
        o.endDate = endDate;
        countDown.init(o);
        this._o = o;
    };
    TimeCountDown.prototype = {
        done: function () {
            countDown.done(this._o);
            this._o = null;
            delete this._o;
        },
        enable: function () {
            var o = this._o;
            if (!o) return;
            countDown.init(o);
        }
    };

    team.TimeCountDown = TimeCountDown;
})(jQuery);

 