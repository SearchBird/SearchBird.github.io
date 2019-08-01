"use strict";

/**
 * 反色闭包对象
 * @param colorStr
 */
function reversalColor(colorStr){

    // let局部常量，无变量提升
    let sixNumReg = /^#[0-9a-fA-F]{6}$/ig,
        threeNumReg = /^#(\d{1})(\d{1})(\d{1})$/ig,
        rgbReg = /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/ig;
    var c1=0, c2=0, c3=0;

    var parseHexToInt = function(hex){
        return Math.floor(hex,16);
    };
    var parseIntToHex = function(int){
        return int.toString(16);
    };

    // 反色函数
    this.parse = function(follow){
        if(sixNumReg.test(colorStr)){
            sixNumReg.exec(colorStr);
            c1 = parseHexToInt(RegExp.$1);
            c2 = parseHexToInt(RegExp.$2);
            c3 = parseHexToInt(RegExp.$3);
        } else if(threeNumReg.test(colorStr)){
            threeNumReg.exec(colorStr);
            c1 = parseHexToInt(RegExp.$1+RegExp.$1);
            c2 = parseHexToInt(RegExp.$2+RegExp.$2);
            c3 = parseHexToInt(RegExp.$3+RegExp.$3);
        } else if(rgbReg.test(colorStr)){
            //rgb color 直接就是十进制，不用转换
            rgbReg.exec(colorStr);
            c1 = RegExp.$1;
            c2 = RegExp.$2;
            c3 = RegExp.$3;
        } else {
            throw new Error("Error color string format. eg.[rgb(0,0,0),#000000,#f00]");
        }

        c1 = 255 - c1;
        c2 = 255 - c2;
        c3 = 255 - c3;

        if(follow)
            return [c1, c2, c3];
        else
            return 'rgb(' + c1 + "," + c2 + "," + c3 + ')';
    };

    // 亮度函数
    this.highLight = function(arr) {
        for(var i = arr.length;i -- > 0;) {
            var temp = arr[i];
            var temp = Math.floor(temp * 1.2);
            arr[i] = temp > 255 ? 255 : temp;
        }
        return "rgb(" + arr.join(",") + ")";
    }
}

// 因为监听原因，而且某些鼠标信号会输入多次，导致方法会重复调用多次，所以animate绑定时候会出现多个animate绑定导致页面不断地闪烁，而且animate是异步，需要使用锁进行同步控制
function htmlLazyLoad() {
    var $window = $(window),
        scrollTop = $window.scrollTop(),
        windowHeight = $window.height(),
        scrollHeight = $(document).height();
    var currentHeight = scrollTop + windowHeight;

    // 顶部底部算法
    /*for(var i = globalDiv.length;i -- >0;) {
        $(globalDiv[i]).css("opacity" , "0");
    }
    for(var i = globalDiv.length;i -- >0;) {
        if(currentHeight > globalDivHeight[i])
            $(globalDiv[i]).css("opacity" , "1");
    }*/
    for(var i = globalPiiicContentDiv.length;i -- >0;) {
        var $obj = $(globalPiiicContentDiv[i]);
        if(scrollTop > globalPiiicContentDivHeight[i + 1] || currentHeight < globalPiiicContentDivHeight[i]){

            // 由于使用animate会让css失去控制，需要停止animate的动作
            $obj.stop().css("opacity" , "0");
            globalLock[i] = true;
            //$obj.animate({opacity: 0}, 100);
            continue;
        } else {
            //$obj.css("opacity" , "1");
            if(globalLock[i]) {
                $obj.animate({opacity: 1}, 200, function () {
                    globalLock[i] = true;
                });
                globalLock[i] = false;
            }
        }
    }
}

// 移除监听需要使用共函数，共函数不能带参，所以不适合绑定然后移除的操作，只能够用锁
function tranfromEndCss(domObj, $jq, endObjArr, otherCallback) {
    domObj.addEventListener("transitionend", function(){
        $jq.css(endObjArr[0]);
        otherCallbackFun(otherCallback, domObj);
    }.bind(this), false);
    domObj.addEventListener("mozTransitionEnd", function(){
        $jq.css(endObjArr[1]);
        otherCallbackFun(otherCallback, domObj);
    }.bind(this), false);
    domObj.addEventListener("webkitTransitionEnd", function(){
        $jq.css(endObjArr[2]);
        otherCallbackFun(otherCallback, domObj);
    }.bind(this), false);
    domObj.addEventListener("msTransitionEnd", function(){
        $jq.css(endObjArr[3]);
        otherCallbackFun(otherCallback, domObj);
    }.bind(this), false);
    domObj.addEventListener("oTransitionEnd", function(){
        $jq.css(endObjArr[4]);
        otherCallbackFun(otherCallback, domObj);
    }.bind(this), false);
}

function otherCallbackFun(otherCallback, domObj) {
    if(otherCallback) {
        var dom = domObj;
        otherCallback();
    }
}

// 动画兼容
function requestAnimationFrameInit() {
    window.requestAnimationFrame=window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function (callback, element) {
            var start,
                finish;

            window.setTimeout(function () {
                start = +new Date();
                callback(start);
                finish = +new Date();

                self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);
        };
    window.cancelNextRequestAnimationFrame = window.cancelRequestAnimationFrame
        || window.webkitCancelAnimationFrame
        || window.webkitCancelRequestAnimationFrame
        || window.mozCancelRequestAnimationFrame
        || window.oCancelRequestAnimationFrame
        || window.msCancelRequestAnimationFrame
        || clearTimeout;
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

// 页面重加载对象
function reloadObj(){

    var theCodeName = "";
    var codeEn = "";
    var dutyMap = {
        "先锋" : "scouts",
        "辅助" : "assist",
        "重装" : "heavyObj",
        "特种" : "Delta",
        "医疗" : "medic",
        "术师" : "magic",
        "近卫" : "Sworder",
        "狙击" : "sniper",
    }

    this.reloadPiiic = function(codeName) {
        if(codeName){
            theCodeName = codeName;
            sendURL("https://raw.githubusercontent.com/SearchBird/jsonUpload/master/characterJson/checkName.json", true);
        }
    }

    var reload = function(jsonObj) {

        // 先把页面元素加载
        new htmlLoad().syncHtml;
        $("#character-name").val(theCodeName);

        // 基础信息以及前言
        var characBase = jsonObj.Character_Base[0];
        $("#CodeNameEn").html(characBase.CodeNameEn);
        $("#CodeNameCh").html(characBase.CodeNameCh);
        $("#CodeNameCh2").html(characBase.CodeNameCh);
        $("#Features").html(characBase.Features);
        $("#Position").html(characBase.Position);

        // 攻击范围
        $("#AttackScope").html(characBase.AttackScope);
        $("#AttackScope_E1").html(characBase.AttackScope_E1);
        $("#AttackScope_E2").html(characBase.AttackScope_E2);
        $("#Duty").html(characBase.Duty);
        $("#DutyImg").attr("src","https://raw.githubusercontent.com/SearchBird/ImageIO/master/img/duty/" + dutyEnum(characBase.Duty) + ".png")
        $("#InShort").html(characBase.InShort);

        var prefaceReg = /\uff0c|\u3002|,|\./g;
        var prefaceValueArr = characBase.PrefaceValue.split(prefaceReg);
        var prefaceValue = "";
        for(var i = 0;i < prefaceValueArr.length;i ++){
            if(prefaceValueArr[i]) {
                prefaceValue += "<div></div>" + prefaceValueArr[i] + "<br>";
            }
        }
        var prefaceCompareArr = characBase.PrefaceCompare.split(prefaceReg);
        var prefaceCompare = "";
        for(var i = 0;i < prefaceCompareArr.length;i ++){
            if(prefaceCompareArr[i]) {
                prefaceCompare += "<div></div>" + prefaceCompareArr[i] + "<br>";
            }
        }
        $("#PrefaceValue").html(prefaceValue.replace("/(.*)<br>/",""));
        $("#PrefaceCompare").html(prefaceCompare.replace("/(.*)<br>/",""));

        $("#NationEn").html(characBase.NationEn);
        $("#head-logo").attr("src","https://raw.githubusercontent.com/SearchBird/ImageIO/master/img/formation/" + characBase.Logo + ".png");
        $("#skill-Logo").attr("src","https://raw.githubusercontent.com/SearchBird/ImageIO/master/img/formation/" + characBase.Logo + "_B-min.png");
        $("#noweapon").attr("src","https://raw.githubusercontent.com/SearchBird/ImageIO/master/img/character/" + codeEn + "/character-noweapon.png")
        $("#weapon").attr("src","https://raw.githubusercontent.com/SearchBird/ImageIO/master/img/character/" + codeEn + "/character-weapon.png")
        var range = "";
        for(var i = characBase.Range;i -- > 0 ;){
            range += "★";
        }
        $("#Range").html(range);

        // 制作人名单
        /*var Maker = jsonObj.Maker[0];
        $("#artCode").html(Maker.artCode);
        $("#wordCode").html(Maker.wordCode);
        $("#dataCode").html(Maker.dataCode);*/
        $("wordCode").html(characBase.workCode);

        // 调整制作人员高度
        var baseInfo = $("#base-info");
        var makerHeight = (parseInt(baseInfo.css("top").replace("px","")) + parseInt(baseInfo.css("height").replace("px","")) + 25) + "px";
        $("#maker").css("top",makerHeight);


        // 天赋
        var Gift = jsonObj.Gift[0];
        if(Gift.isExist == 1) {
            var GiftNum = Gift.GiftNum;
            var giftWord = $("#gift-word");
            $("#GiftOverall").html(splitObjStr(Gift.GiftOverall));
            for(var num = GiftNum;num > 0;num --) {
                var colName = "Gift" + num + "Name";
                var colDesc1 = "Gift" + num + "Desc1";
                var colDesc2 = "Gift" + num + "Desc2";
                var colDesc3 = "Gift" + num + "Desc3";
                giftWord.prepend('<div><div class="skill-desc">'
                    + (Gift[colDesc1] ? '<div class="skill-icon"><div class="icon-1"></div><div class="icon-2"></div></div>' + Gift[colDesc1] + "<br>" : "")
                    + (Gift[colDesc2] ? '<div class="skill-icon"><div class="icon-1"></div><div class="icon-2"></div></div>' + Gift[colDesc2] + "<br>" : "")
                    + (Gift[colDesc3] ? '<div class="skill-icon"><div class="icon-1"></div><div class="icon-2"></div></div>' + Gift[colDesc3] + "<br>" : "")
                    + '</div></div>');
                giftWord.prepend('<div class="skill-name heightLight">' + Gift[colName] + '</div>');
            }
        } else{
            $("#gift").remove();
        }

        // 技能
        var Skill = jsonObj.Skill[0];
        if(Skill.isExist == "1") {
            var LogNum = Skill.LogNum;
            var SkillNum = Skill.SkillNum;
            var logisticsList = $("#logisticsList");
            // 技能简评拼接
            for (var num = 1; num <= SkillNum; num++) {
                var skillName = "Skill" + num + "Name";
                var skillDesc = "Skill" + num + "Desc";
                var skill1Conclusion = "Skill" + num + "Conclusion";

                var skillHtml = '<div class="sk-box"><div><div class="sk-top-line"></div><div class="sk-desc">'
                    + '<img class="sk-img" src="'
                    + "https://raw.githubusercontent.com/SearchBird/ImageIO/master/img/character/" + characBase.CodeNameEn + "/skill-" + num + ".png"
                    + '"/><div class="sk-word"><div class="sk-word-name heightLight">'
                    + Skill[skillName]
                    + '</div><div class="sk-desc-line"></div><div class="sk-word-test">'
                    + Skill[skillDesc]
                    + '</div></div></div><div class="sk-bottom-line"></div></div><div><div class="sk-test-title"><div class="sk-test-title-img"></div><div class="sk-test-title-word">技能简评</div></div><div class="sk-test-content">'
                    + Skill[skill1Conclusion]
                    + '</div></div></div>';

                $("#sk-list").append(skillHtml)

            }

            // 后勤拼接
            for (var num = LogNum; num > 0; num--) {
                var logName = "Logistics" + num + "Name";
                var logDesc = "Logistics" + num + "Desc";
                logisticsList.prepend((Skill[logDesc] ? Skill[logDesc] : "") + '<br/>');
                logisticsList.prepend('<span class="heightLight">' + (Skill[logName] ? Skill[logName] : "") + '</span><br/>');
            }
            $("#LogisticsOverall").html(splitObjStr(Skill.LogisticsOverall));

            $("#SkillOverAll").html(splitObjStr(Skill.SkillOverAll));
        } else {
            $("#skill").remove();
        }

        // 要领
            var Gist = jsonObj.Gist[0];
        if(Gist.isExist == "1"){
            $("#Train").html(splitObjStr(Gist.Train));
            $("#Team").html(splitObjStr(Gist.Team));
            $("#Deploy").html(splitObjStr(Gist.Deploy));
            $("#Other").html(splitObjStr(Gist.Other));
        } else {
            $("#gist").remove();
        }


        pageLoad(false, characBase)

    }

    var splitObjStr = function(str) {
        var strArr = str.split("\r\n");
        var strArrLength = strArr.length;
        var concatStr = "";
        for(var i = 0;i < strArrLength;i ++) {
            concatStr += '<div class="text-indent-type">' + strArr[i] + "</div>";
        }
        return concatStr;
    }

    var dutyEnum = function(duty) {
        return dutyMap[duty];
    }

    var reloadURL = function(codeEn){
        if(codeEn){
            if(pageType === 0) {
                window.location.href = "html/piiic-main.html?code=" + codeEn;
                return;
            }
            else if(pageType == 1 ) {
                window.location.href = "piiic-main.html?code=" + codeEn;
                return;
            }
            var jsonURL = "https://raw.githubusercontent.com/SearchBird/jsonUpload/master/characterJson/" + codeEn + ".json";
            sendURL(jsonURL, false);
        } else {
            myAlert("该干员测评不存在")
            if(pageType === 0 || pageType == 1) {
                return;
            }
            else {
                window.location.href = "piiic.html"
            }
        }
    }

    var checkName = function(jsonObj,checkFlag){
        try{
            codeEn = jsonObj[theCodeName.toLowerCase()];
        } catch (e) {
            return null;
        }
        reloadURL(codeEn);
    }

    var sendURL = function(jsonURL,checkFlag){
        var request;
        if(window.XMLHttpRequest){
            request = new XMLHttpRequest();
        }else if(window.ActiveXObject){
            request = new window.ActiveXObject();
        }else{
            myAlert("浏览器版本不支持远程访问，请更换浏览器");
        }
        if(request !=null){
            request.open("GET",jsonURL,true);
            request.send(null);
            request.onreadystatechange=function(){
                if(request.readyState==4 && request.status==200){
                    var jsonObj = JSON.parse(request.responseText);
                    if(checkFlag)
                        checkName(jsonObj);
                    else
                        reload(jsonObj);
                }
            };
        }
    }
}

function htmlLoad(){

    var perString = ""
    if(pageType === 0) {
        perString = "html/"
    }
    this.syncHtml = function(synObj) {
        for(var i = globalDiv.length;i -- >0;) {
            var syncName = globalDiv[i];
            $.ajax({
                url: perString + syncName.replace("#", "") + '.html',
                type: 'get',
                async: false,
                success: function (res) {
                    $(syncName).html($(res));
                }
            });
        }
        //htmlLazyLoad();
    }

}

function myAlert(msg, time) {
    if(!time) time = 0;

    var appear = $("#alert");
    if(appear)
        appear.remove();
    var alertdiv = document.createElement("div");
    alertdiv.id = "alert";
    var $alert = $(alertdiv);
    document.body.appendChild(alertdiv);

    $.ajax({
        url: pageType === 0 ? "html/alert.html" : 'alert.html',
        type: 'get',
        async: false,
        success: function (res) {
            $alert.html($(res));
            $alert.css("opacity", "1");
            $(".alert-inner-word").html(msg)
            setTimeout(function(){
                $alert.css("opacity", "0");
            },800 + time)
        }
    });
}

function typeOfAgent() {
    var platform = navigator.platform,
        agent = navigator.userAgent;
    agentType = (agent.indexOf('Android') > -1 || agent.indexOf('Adr') > -1 || !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || platform.indexOf("Mac") > -1);
    if (agentType) {
        $("#getImg").find(".word").html("转图 IMG");
    }
}


function unicoEncode() {

    /**
     * unicode string to utf-8
     * @param text 字符串
     * @returns {*} utf-8编码
     */
    var toBytes = function(text) {
        var result = [], i = 0;
        text = encodeURI(text);
        while (i < text.length) {
            var c = text.charCodeAt(i++);

            // if it is a % sign, encode the following 2 bytes as a hex value
            if (c === 37) {
                result.push(parseInt(text.substr(i, 2), 16))
                i += 2;

                // otherwise, just the actual byte
            } else {
                result.push(c)
            }
        }

        return coerceArray(result);
    }


    /**
     * utf8 byte to unicode string
     * @param utf8Bytes
     * @returns {string}
     */
    var utf8ByteToUnicodeStr = function(utf8Bytes){
        var unicodeStr ="";
        for (var pos = 0; pos < utf8Bytes.length;){
            var flag= utf8Bytes[pos];
            var unicode = 0 ;
            if ((flag >>>7) === 0 ) {
                unicodeStr+= String.fromCharCode(utf8Bytes[pos]);
                pos += 1;

            } else if ((flag &0xFC) === 0xFC ){
                unicode = (utf8Bytes[pos] & 0x3) << 30;
                unicode |= (utf8Bytes[pos+1] & 0x3F) << 24;
                unicode |= (utf8Bytes[pos+2] & 0x3F) << 18;
                unicode |= (utf8Bytes[pos+3] & 0x3F) << 12;
                unicode |= (utf8Bytes[pos+4] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos+5] & 0x3F);
                unicodeStr+= String.fromCodePoint(unicode) ;
                pos += 6;

            }else if ((flag &0xF8) === 0xF8 ){
                unicode = (utf8Bytes[pos] & 0x7) << 24;
                unicode |= (utf8Bytes[pos+1] & 0x3F) << 18;
                unicode |= (utf8Bytes[pos+2] & 0x3F) << 12;
                unicode |= (utf8Bytes[pos+3] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos+4] & 0x3F);
                unicodeStr+= String.fromCodePoint(unicode) ;
                pos += 5;

            } else if ((flag &0xF0) === 0xF0 ){
                unicode = (utf8Bytes[pos] & 0xF) << 18;
                unicode |= (utf8Bytes[pos+1] & 0x3F) << 12;
                unicode |= (utf8Bytes[pos+2] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos+3] & 0x3F);
                unicodeStr+= String.fromCodePoint(unicode) ;
                pos += 4;

            } else if ((flag &0xE0) === 0xE0 ){
                unicode = (utf8Bytes[pos] & 0x1F) << 12;;
                unicode |= (utf8Bytes[pos+1] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos+2] & 0x3F);
                unicodeStr+= String.fromCharCode(unicode) ;
                pos += 3;

            } else if ((flag &0xC0) === 0xC0 ){ //110
                unicode = (utf8Bytes[pos] & 0x3F) << 6;
                unicode |= (utf8Bytes[pos+1] & 0x3F);
                unicodeStr+= String.fromCharCode(unicode) ;
                pos += 2;

            } else{
                unicodeStr+= String.fromCharCode(utf8Bytes[pos]);
                pos += 1;
            }
        }
        return unicodeStr;
    }



    function checkInt(value) {
        return (parseInt(value) === value);
    }

    function checkInts(arrayish) {
        if (!checkInt(arrayish.length)) { return false; }

        for (var i = 0; i < arrayish.length; i++) {
            if (!checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
                return false;
            }
        }

        return true;
    }

    function coerceArray(arg, copy) {

        // ArrayBuffer view
        if (arg.buffer && arg.name === 'Uint8Array') {

            if (copy) {
                if (arg.slice) {
                    arg = arg.slice();
                } else {
                    arg = Array.prototype.slice.call(arg);
                }
            }

            return arg;
        }

        // It's an array; check it is a valid representation of a byte
        if (Array.isArray(arg)) {
            if (!checkInts(arg)) {
                throw new Error('Array contains invalid value: ' + arg);
            }

            return new Uint8Array(arg);
        }

        // Something else, but behaves like an array (maybe a Buffer? Arguments?)
        if (checkInt(arg.length) && checkInts(arg)) {
            return new Uint8Array(arg);
        }

        throw new Error('unsupported array-like object');
    }

    return {
        toBytes: toBytes,
        fromBytes: utf8ByteToUnicodeStr
    }
}