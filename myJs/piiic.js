// 全局初始化
$(function() {

    // 解决浏览器兼容
    compatibleLoad();
    // 加载其他html文件
    htmlLoad();
    // 样式初始化
    cssLoad();
    // 动作初始化
    eventLoad();

});

// 动作初始化
function eventLoad() {
    // 滑动加载初始化
    scrollInit();

    $("#getImg").click(function(){
        getImg();
    })
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

// 样式初始化
function cssLoad(){
    // 初始化图片
    imgOnload();
    // 初始化反色
    differenceOnload();
    // 初始化盒子间距
    distanceInit();
    // 初始化攻击范围文字大小
    attackScaleSizeInit();
    // 将文件改为b64格式，便于下载
    imgB64();
}

// 加载其他html文件
function htmlLoad() {
    // 同步加载
    syncHtml();
    // 初始化高亮
    highLightInit();
}

// 滑动加载初始化
function scrollInit() {
    // 计算盒子高度，并且缓存
    calculaHeight();
    // 初始化加载
    scrollInit();
    // 初始化容器高度
    containerInit();
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

// 因为使用a标签下载b64太长，所以只能够转为blob文件进行下载
function getImg() {
    html2canvas($('#piiic-container'), {
        onrendered: function(canvas) {
            var url = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            dataURIToBlob(url, callback);
           /* var link = document.createElement('a');
            link.download = 'my-image-name.jpg';
            link.href = url;
            link.click();*/
        },
    });
}
// edited from https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#Polyfill
function dataURIToBlob(dataURI, callback) {
    var binStr = atob(dataURI.split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }

    callback(new Blob([arr]));
}
var callback = function(blob) {
    var a = document.createElement('a');
    a.download = "test.png";
    // the string representation of the object URL will be small enough to workaround the browser's limitations
    a.href = URL.createObjectURL(blob);
    // you must revoke the object URL,
    //   but since we can't know when the download occured, we have to attach it on the click handler..
    a.click();
};



// 因为受到CORS浏览器安全限制，所以使用arraybuffer形式下载图片
function imgchange() {
    //image2base64($("#background-header"));
    //image2base64($("#background-body"));
    var imgList = $("#piiic-container img").each(function(index, value) {
        image2base64($(value), 1);
    });
}

// 传入一个jq对象
function image2base64(imgObj, type) {
    var src = "";
    if(type == 1) {
        src = imgObj.attr("src")
    } else {
        var background = imgObj.css('backgroundImage');
        src = background.substring(background.indexOf('url("')).replace('url("', "").replace('url(', "").replace('")', "").replace(")","");
    }

    var xhr = new XMLHttpRequest();
    var dataUrl;
    xhr.open('GET', src, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
        if (xhr.status == 200) {
            var uInt8Array = new Uint8Array(xhr.response);
            var i = uInt8Array.length;
            var binaryString = new Array(i);
            while (i--) {
                binaryString[i] = String.fromCharCode(uInt8Array[i]);
            }
            var data = binaryString.join('');
            var base64 = window.btoa(data);
            dataUrl = "data:image/png;base64," + base64;
            //dataUrl = "data:" + (outputFormat || "image/png") + ";base64," + base64;
            if(type == 1) {
                imgObj.attr('src', dataUrl);
            } else {
                imgObj.css('backgroundImage', "url(" + dataUrl + ")");
            }

        }
    };

    xhr.send();
}

//递归将要转换的节点中的所有图片的src全部转为base64
/*function image2base64(s) {
    src = $("#piiic-container img").eq(s).attr('src');
    var base64 = getBase64ByUrl(src);//getBase64Image(image);
    $("#piiic-container img").eq(s).attr('src', base64);
    s++;
    if (s < $("#piiic-container img").length) {
        image2base64(s);
    }
}

//将图片转为 base64
function getBase64Image(img) {
    img.crossorigin = "anonymous";
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;

}*/
