$(function() {

    // 解决edge兼容
    decideEdge();
    // 初始化动作
    onload();

});

// 解决edge兼容
function decideEdge() {
    var userAgent = navigator.userAgent;
    var isEdge = userAgent.indexOf("Edge") > -1;
    if (isEdge) {
        $("#right-font").css("margin-right","-332px");
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



