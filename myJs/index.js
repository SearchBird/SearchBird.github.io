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
    var isQQ = userAgent.indexOf('MQQBrowser') > -1
    if (isEdge) {
        $("#right-font").css("margin-right","-332px");
    }
    if (isQQ) {
        $(".base-info").css("font-family","黑体");
        $(".character-sign").css("font-family","黑体");
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



