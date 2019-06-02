$(function() {

    // 解决edge/ QQ浏览器兼容
    decideEdge();
    // 初始化动作
    onload();

});

// 解决edge兼容
function decideEdge() {
    var userAgent = navigator.userAgent;
    var isEdge = userAgent.indexOf("Edge") > -1;
    var isQQ = userAgent.indexOf('QQBrowser') > -1;
    var isFF = userAgent.indexOf("Firefox") > -1;
    if (isEdge) {
        $("#right-font").css("margin-right","-324px");
        changeFont();
    }
    if (isQQ) {
        changeFont();
        $("#right-font").css("margin-right", "-351px");
    }
    if(isFF) {
        $("#right-font").css("margin-right", "-347px;")
    }
}

// 初始化动作
function onload(){
    // 初始化图片
    imgOnload();
    // 初始化反色
    differenceOnload();
    // 初始化盒子间距
    distanceInit();
    // 初始化高亮
    highLightInit()
    // 初始化攻击范围文字大小
    attackScaleSizeInit();
}

function attackScaleSizeInit() {
    $attackScale = $(".attack-scale");
    var sizeFlag = $.trim($attackScale.html()).length < 4;
    if(sizeFlag) {
        $attackScale.css("font-size", "17px");
    }
}

function highLightInit() {
    $(".heightLight").css("text-shadow", "2px 0rem 2px #BB3441,0rem 0rem .5rem #BB3441,0rem 0rem 0rem #BB3441,0rem 0rem 3px #BB3441");
}

function changeFont() {
    var baseInfo = $(".base-info");
    baseInfo.css("font-family","黑体");
    baseInfo.css("font-weight","400");
    $(".character-sign").css("font-family","黑体");
}

function distanceInit() {
    var baseInfoHeight = parseInt($(".base-info").css("height").replace("px","")) + 155;
    $(".maker").css("top",baseInfoHeight + "px");
    debugger;
}

function imgOnload() {
    $img = $("img");

    $img.lazyload({
        effect : "fadeIn"
    });
}

function differenceOnload(){
    $(".difference").each(function(index, value) {
        var $difference = $(value);

        // 反色函数
        $difference.css("background-color", new reversalColor($difference.css("background-color")).parse());

        // 亮度函数
        var backgroundArr = $difference.css("background-color").replace(")","").replace("rgb(", "").split(", ");
        for(var i = backgroundArr.length;i -- > 0;) {
            var temp = backgroundArr[i];
            var temp = parseInt(temp * 1.2);
            backgroundArr[i] = temp > 255 ? 255 : temp;
        }
        $difference.css("background-color", "rgb(" + backgroundArr.join(",") + ")");
    })
}



