$(function() {

    // 解决浏览器兼容
    compatibleLoad();
    // 加载其他html文件
    htmlLoad();
    // 初始化样式
    cssLoad();
    // 滑动加载初始化
    scrollLoad();


});

// 滑动加载初始化
function scrollLoad() {
    // 计算盒子高度，并且缓存
    calculaHeight();
    // 初始化加载
    scrollInit();
    // 初始化容器高度
    containerInit();
}

// 解决浏览器兼容
function compatibleLoad() {
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
        $("#right-font").css("margin-right", "-343px");
    }
    if(isFF) {
        $("#right-font").css("margin-right", "-347px;")
    }
}

// 初始化动作
function cssLoad(){
    // 初始化图片
    imgOnload();
    // 初始化反色
    differenceOnload();
    // 初始化盒子间距
    distanceInit();
    // 初始化攻击范围文字大小
    attackScaleSizeInit();
}

// 加载其他html文件
function htmlLoad() {
    // 同步加载
    syncHtml();
    // 初始化高亮
    highLightInit();
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
    var baseInfoHeight = Math.floor($(".base-info").css("height").replace("px","")) + 155;
    $(".maker").css("top",baseInfoHeight + "px");
}

function imgOnload() {
    $img = $("img");

    $img.lazyload({
        effect : "fadeIn"
    });
}

function differenceOnload(){
    $(".difference").each(function(index, value) {
        var $difference = $(value),
            reversor = new reversalColor($difference.css("background-color"));
        // 反色高亮
        $difference.css("background-color", reversor.highLight(reversor.parse(true)));
    });
}

// 通过遍历做缓存
function calculaHeight(){
    var divInitHeight = 1000;
    globalDivHeight.push(divInitHeight);
    for (var i = -1;i ++ < globalDiv.length - 1;){
        var $globalDiv = $(globalDiv[i]);
        divInitHeight += $globalDiv.outerHeight(true);
        globalDivHeight.push(divInitHeight);
    }
}
// 利用缓存中数据做绑定
function scrollInit(){
    $(window).scroll(function () {
            htmlLazyLoad();
    });
}

function syncHtml(synObj) {
    for(var i = globalDiv.length;i -- >0;) {
        var syncName = globalDiv[i];
        $.ajax({
            url: syncName.replace("#", "") + '.html',
            type: 'get',
            async: false,
            success: function (res) {
                $(syncName).html($(res));
            }
        });
    }
    //htmlLazyLoad();
}

function containerInit() {
    $("#background-body").css("height", (globalDivHeight[globalDivHeight.length - 2] + Math.floor($(".gs-content-word").height()) - 630) + "px");
}

