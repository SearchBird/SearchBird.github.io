"use strict";
/**
 * 反色闭包对象
 * @param colorStr
 */
function reversalColor(colorStr){

    // let局部常量，无变量提升
    let sixNumReg = /^#(\d{2})(\d{2})(\d{2})$/ig,
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
        "术士" : "magic",
        "近卫" : "Sworder",
        "狙击" : "sniper",
    }

    this.reloadPiiic = function(codeName) {
        if(codeName){
            theCodeName = codeName;
            sendURL("https://raw.githubusercontent.com/SearchBird/SearchBird.github.io/master/json/checkName.json", true);
        }
    }

    var reload = function(jsonObj) {

        // 先把页面元素加载
        htmlLoad()
        $("#character-name").val(theCodeName);

        // 基础信息以及前言
        var characBase = jsonObj.Character_Base[0];
        $("#CodeNameEn").html(characBase.CodeNameEn);
        $("#CodeNameCh").html(characBase.CodeNameCh);
        $("#CodeNameCh2").html(characBase.CodeNameCh);
        $("#Features").html(characBase.Features);
        $("#Position").html(characBase.Position);
        $("#AttackScope").html(characBase.AttackScope);
        $("#Duty").html(characBase.Duty);
        $("#DutyImg").attr("src","https://raw.githubusercontent.com/SearchBird/ImageIO/master/img/duty/" + dutyEnum(characBase.Duty) + ".png")
        $("#InShort").html(characBase.InShort);
        $("#PrefaceValue").html(characBase.PrefaceValue);
        $("#PrefaceCompare").html(characBase.PrefaceCompare);
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
        var Maker = jsonObj.Maker[0];
        $("#artCode").html(Maker.artCode);
        $("#wordCode").html(Maker.wordCode);
        $("#dataCode").html(Maker.dataCode);

        // 调整制作人员高度
        var baseInfo = $("#base-info");
        var makerHeight = (parseInt(baseInfo.css("top").replace("px","")) + parseInt(baseInfo.css("height").replace("px","")) + 25) + "px";
        $("#maker").css("top",makerHeight);


        // 天赋
        var Gift = jsonObj.Gift[0];
        var GiftNum = Gift.GiftNum;
        var giftWord = $("#gift-word");
        $("#GiftOverall").html(Gift.GiftOverall);
        for(var num = GiftNum;num > 0;num --) {
            var colName = "Gift" + num + "Name";
            var colDesc1 = "Gift" + num + "Desc1";
            var colDesc2 = "Gift" + num + "Desc2";
            var colDesc3 = "Gift" + num + "Desc3";
            giftWord.prepend('<div class="skill-desc">' + (Gift[colDesc1] ? Gift[colDesc1] : "") + (Gift[colDesc2] ? Gift[colDesc2] : "") + (Gift[colDesc3] ? Gift[colDesc3] : "") + '</div>');
            giftWord.prepend('<div class="skill-name heightLight">' + Gift[colName] + '</div>');
        }

        // 技能
        var Skill = jsonObj.Skill[0];
        var LogNum = Skill.LogNum;
        var SkillNum = Skill.SkillNum;
        var logisticsList = $("#logisticsList");
        // 技能简评拼接
        for(var num = 1;num <= SkillNum;num ++){
            var skillName = "Skill"  + num +  "Name";
            var skillDesc = "Skill" + num + "Desc";
            var skill1Conclusion = "Skill" + num + "Conclusion";

            var skillHtml = '<div class="sk-box"><div><div class="sk-top-line"></div><div class="sk-desc"><img class="sk-img" src=""/><div class="sk-word"><div class="sk-word-name heightLight">'
                + Skill[skillName]
                + '</div><div class="sk-desc-line"></div><div class="sk-word-test">'
                + Skill[skillDesc]
                +'</div></div></div><div class="sk-bottom-line"></div></div><div><div class="sk-test-title"><div class="sk-test-title-img"></div><div class="sk-test-title-word">技能简评</div></div><div class="sk-test-content">'
                + Skill[skill1Conclusion]
                +'</div></div></div>';

            $("#sk-list").append(skillHtml)

        }

        // 后勤拼接
        for(var num = LogNum;num > 0;num --) {
            var logName = "Logistics" + num + "Name";
            var logDesc = "Logistics" + num + "Desc";
            logisticsList.prepend((Skill[logDesc] ? Skill[logDesc] : "") + '<br/>');
            logisticsList.prepend('<span class="heightLight">' + (Skill[logName] ? Skill[logName] : "") + '</span><br/>');
        }
        $("#LogisticsOverall").html(Skill.LogisticsOverall);
        $("#SkillOverAll").html(Skill.SkillOverAll);

        // 要领
        var Gist = jsonObj.Gist[0];
        $("#Train").html(Gist.Train);
        $("#Team").html(Gist.Team);
        $("#Deploy").html(Gist.Deploy);
        $("#Other").html(Gist.Other);

        pageLoad(false, characBase)

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
            var jsonURL = "https://raw.githubusercontent.com/SearchBird/SearchBird.github.io/master/json/" + codeEn + ".json";
            sendURL(jsonURL, false);
        } else {
            alert("该干员测评不存在")
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
            alert("浏览器版本不支持远程访问，请更换浏览器");
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