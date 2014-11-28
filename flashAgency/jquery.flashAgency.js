/**
 * @fileoverview  #note
 * @author  #name
 * @date  11/26/2014
 */
(function ($) {
    if ($.flashAgency) {
        return;
    }
    var config = {
        swfSource: "",
        swfId: "flashAgency",//生成的object id
        loadSwfId: "flashWrap",//装载生成flash的容器id
        flashPlayerVersion: "9.0.0",//flash player版本最低限制
        swfName: "flashAgency",
        swfobjectPath: ".",
        onConnect: function () {
        }
    };
    var params = {
        allowFullscreen: "true",
        allowScriptAccess: "always"
    };

    var _loadSwf = function () {
            swfobject.embedSWF(config.swfSource + "FlashAgency.swf" + "?" + (+new Date()), config.loadSwfId, "1", "1", config.flashPlayerVersion, "expressInstall.swf", {connectName: "$.flashAgency.f_connectedByFlash"}, params, {id: config.swfId, name: config.swfName});
        },
        _getFlash = function () {
            return document.getElementById(config.swfId);
        };
    var _w = window;
    //生成随机数
    var createRandom = function () {
        return Math.random().toString(36).slice(2);
    };
    //判断该连接的id是否存在
    var isConnectId = function (str) {
        console.log(str, $.flashAgency.callbacks);
        if ($.flashAgency.callbacks && $.flashAgency.callbacks[str]) {
            return true;
        } else {
            return false;
        }
    };

    var flashAgency = $.flashAgency = {};
    flashAgency.callbacks = {};//保存回调集合

    flashAgency.initConfig = function (options) {
        options = options || {};
        config = $.extend(config, options);


        if (!_w.swfobject) {
            $.getScript("swfobject.js", function () {
                _loadSwf();
            });
        } else {
            _loadSwf();
        }
    };
    flashAgency.send = function (options) {
        var _id = createRandom();
        var url = options.url;
        var type = options.type || "GET";
        var param = options.param;
        var onComplete = options.onComplete || function () {
        };
        var onSuccess = options.onSuccess || function () {
        };
        var onError = options.onError || function () {
        };

        if (url && typeof url !== "string") {
            return;
        }

        $.flashAgency.callbacks[_id] =  {
            onComplete : onComplete,
            onSuccess: onSuccess,
            onError : onError
        };

        _getFlash().asSend(url, param, type, _id);
    };

    //初始化连接成功
    $.flashAgency.f_connectedByFlash =function () {
        _getFlash().asParam("$.flashAgency.f_responseByFlashSuccess", "$.flashAgency.f_responseByFlashFault", "$.flashAgency.f_responseByFlashComplete");
        config.onConnect();
    };

    //请求完成回调
    $.flashAgency.f_responseByFlashComplete= function(connectId){
        if (isConnectId(connectId)) {
            $.flashAgency.callbacks[connectId]["onComplete"]();
        }
    };

    $.flashAgency.f_responseByFlashSuccess  = function (data, connectId){
        console.log("------444--",connectId,isConnectId(connectId));
        if (isConnectId(connectId)) {
            console.log("------eee--");
            $.flashAgency.callbacks[connectId]["onSuccess"](data);
        }
    };

    //响应失败
    $.flashAgency.f_responseByFlashFault  = function (data, connectId){
        console.log("------222--");
        if (isConnectId(connectId)) {
            $.flashAgency.callbacks[connectId]["onError"](data);
        }
    };
})(jQuery);