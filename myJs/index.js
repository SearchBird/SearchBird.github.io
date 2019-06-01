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
    var isQQ = userAgent.indexOf('QQBrowser') > -1
    if (isEdge) {
        $("#right-font").css("margin-right","-332px");
        changeFont();
    }
    if (isQQ) {
        changeFont();
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
        $difference.css("background-color", new reversalColor($difference.css("background-color")).parse());
    })
}



