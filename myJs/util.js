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
    let $window = $(window),
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
                $obj.animate({opacity: 1}, 1000, function () {
                    globalLock[i] = true;
                });
                globalLock[i] = false;
            }
        }
    }
}

function close(objectId, closeId, closeType) {
    var $id = $(closeId);
    $id.click(function() {
        if(closeType == 0) {
            $(objectId).empty();
        } else if(closeType == 1) {
            $(object).remove();
        }
    })
}

// 移除监听需要使用共函数，共函数不能带参，所以不适合绑定然后移除的操作，只能够用锁
function tranfromEndCss(domObj, $jq, endObjArr, otherCallback) {
    domObj.addEventListener("transitionend", function(){
        $jq.css(endObjArr[0]);
        otherCallbackFun(otherCallback, domObj);
    }, false);
    domObj.addEventListener("mozTransitionEnd", function(){
        $jq.css(endObjArr[1]);
        otherCallbackFun(otherCallback, domObj);
    }, false);
    domObj.addEventListener("webkitTransitionEnd", function(){
        $jq.css(endObjArr[2]);
        otherCallbackFun(otherCallback, domObj);
    }, false);
    domObj.addEventListener("msTransitionEnd", function(){
        $jq.css(endObjArr[3]);
        otherCallbackFun(otherCallback, domObj);
    }, false);
    domObj.addEventListener("oTransitionEnd", function(){
        $jq.css(endObjArr[4]);
        otherCallbackFun(otherCallback, domObj);
    }, false);
}

function otherCallbackFun(otherCallback, domObj) {
    if(otherCallback) {
        var dom = domObj;
        otherCallback();
    }
}