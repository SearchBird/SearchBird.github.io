"use strict";
// 全局初始化
$(function() {

    // 解决浏览器兼容
    //compatibleLoad();
    // 加载其他html文件
    htmlLoad();
    // 样式初始化
    cssLoad();
    // 动画兼容
    requestAnimationFrameInit();
    // 动作初始化
    eventLoad();

});

// 动作初始化
function eventLoad() {
    // 滑动加载初始化
    scrollInit();
    // 点击初始化
    clickInit();
    // 悬浮初始化
    hoverInit();
    // 按钮动画、点击事件加载
    piiic_toolist_bottom_eventInit();
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
    // 改变右侧文字距离
    rightFontdistince();
    // 判断浏览器类型
    typeOfAgent();
    // 绑定聚焦
    searchInputFocus();
}

// 加载其他html文件
function htmlLoad() {
    // 同步加载
    syncHtml();
    // 初始化高亮
    highLightInit();
}

// 改变右侧文字距离
function rightFontdistince() {
    var rightFontWidth = Math.floor($("#right-font").css("width").replace("px", "")) >> 1;
    // 因为旋转文字是以中心为支点，所以旋转后，顶部距离 = - (宽度 >> 1 + 适当调整)
    $("#right-font").css("margin-top", ((rightFontWidth >> 1) + 50)  + "px");

    // 因为旋转文字是以中心为支点，所以旋转后，右边距离 = - (宽度 >> 1 + 高度 >> 1)
    $("#right-font").css("margin-right", "-" + (rightFontWidth - ($("#right-font").css("height").replace("px", "") >> 1))  + "px")
}

// 滑动加载初始化
function scrollInit() {
    // 计算盒子高度，并且缓存
    calculaHeight();
    // 初始化加载
    scrollData();
    // 初始化容器高度
    containerInit();
}

function hoverInit() {
    clickFlag.toTopHoverLock = true;
    $("#toTop").hover(function(){
        for(var i = 7;i -- > 1;){
            $(".toTop-inner" + i).animate( { opacity : "1"},"normal");
        }
        $("#toTop").append('<div class="toTop-inner1 move"></div>')
            .append('<div class="toTop-inner3 move"></div>')
            .append('<div class="toTop-inner5 move"></div>');
        $(".move").each(function(index, value){
            if(index == 0)
                $(value).animate({height:0},"fast")
            if(index == 1)
                $(value).animate({height:0,left:0,bottom:0},"fast")
            if(index == 2)
                $(value).animate({height:0,left:0,bottom:0},"fast")
        })
    },function(){
        for(var i = 7;i -- > 1;){
            $(".toTop-inner" + i).animate( { opacity : "0.7"},"normal");
            $(".move").each(function(index, value) {
                $(value).stop().remove();
            })
        }
    })
}

function attackScaleSizeInit() {
    var $attackScale = $(".attack-scale");
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
    var $img = $("img");

    $img.lazyload({
        effect : "fadeIn"
    });
}

function differenceOnload(){
    var highLightColor;
    $(".difference").each(function(index, value) {
        var $difference = $(value),
            reversor = new reversalColor($difference.css("background-color"));
        // 反色高亮
        highLightColor = reversor.highLight(reversor.parse(true));
        $difference.css("background-color", highLightColor);
    });
    document.styleSheets[0].addRule('::-webkit-scrollbar-thumb', 'background:' + highLightColor);
}

function searchInputFocus() {
    $(".searchbox input").focus(function(){
        clickFlag.searchFocus = true;
        var inputVal = $(".searchbox input").val();
        if(!inputVal || inputVal == "请输入干员名称,搜索长图")
            $(".searchbox input").val("");
    });
    $(".searchbox input").blur(function () {
        clickFlag.searchFocus = false;
        if(!$(".searchbox input").val())
            $(".searchbox input").val("请输入干员名称,搜索长图")
    })
}

function clickInit() {
    $("#getImg").click(function(){
        if(!clickFlag.downloadStarFlag) {
            clickFlag.downloadStarFlag = true;
            getImg();
        }

    })

    clickFlag.toTopFlag = true;
    $("#toTop").click(function() {
        //window.location.href = "#getImg";
        if(clickFlag.toTopFlag) {
            clickFlag.toTopFlag = false;
            $('html,body').animate({scrollTop: '0px'}, 300, function(){
                clickFlag.toTopFlag = true;
            });
            $(".move").each(function(index, value) {
                $(value).stop().remove();
            })
            $("#toTop").append('<div class="toTop-inner1 move"></div>')
                .append('<div class="toTop-inner3 move"></div>')
                .append('<div class="toTop-inner5 move"></div>');
            $(".move").each(function(index, value){
                if(index == 0)
                    $(value).animate({height:0},"fast")
                if(index == 1)
                    $(value).animate({height:0,left:0,bottom:0},"fast")
                if(index == 2)
                    $(value).animate({height:0,left:0,bottom:0},"fast")
            })
        }
    });

    // 点击旋转彩蛋
    clickFlag.bonusFlag = false;
    clickFlag.bonusListenerFlag = false;
    $("#toTop").mousedown(function(event){
        stopFun = setTimeout(function() {//down 1s，才运行。
            if(!clickFlag.bonusFlag) {
                clickFlag.bonusFlag = true;
                for (var i = 7; i-- > 1;) {
                    var $topInner = $(".toTop-inner" + i);
                    $topInner.css({
                        'transition': 'all 4s',
                        '-webkit-transition': 'all 4s', /* Safari */
                        '-moz-transition': 'all 4s', /* Firefox 4 */
                        '-ms-transition': 'all 4s',
                        '-o-transition': 'all 4s',
                        "border-left-color": "rgba(187,52,65,1)",
                        "color": "rgba(187,52,65,1)"
                    });
                }
                var $toTop = $("#toTop");
                $toTop.css({
                    'transition': 'all 4s',
                    '-webkit-transition': 'all 4s', /* Safari */
                    '-moz-transition': 'all 4s', /* Firefox 4 */
                    '-ms-transition': 'all 4s', /* ie10 */
                    '-o-transition': 'all 4s', /* Opera */
                    "transform": "rotate(360deg)",
                    "-moz-transform": "rotate(360deg)",
                    "-webkit-transform": "rotate(360deg)",
                    "-ms-transform": "rotate(360deg)",
                    "-o-transform": "rotate(360deg)",
                });

                // 使用锁，绑定只有一次监听
                if(!clickFlag.bonusListenerFlag) {
                    clickFlag.bonusListenerFlag = true;
                    for (var i = 7; i-- > 1;) {
                        var $topInner = $(".toTop-inner" + i);
                        tranfromEndCss(document.getElementsByClassName("toTop-inner" + i)[0], $topInner, [
                            {
                                'transition': 'all 1s',
                                "border-left-color": "rgba(255,255,255,0.7)",
                                "color": "rgba(255,255,255,0.7)"
                            }, {
                                '-moz-transition': 'all 1s', /* Firefox */
                                "border-left-color": "rgba(255,255,255,0.7)",
                                "color": "rgba(255,255,255,0.7)"
                            }, {
                                '-webkit-transition': 'all 1s', /* Safari Chrome */
                                "border-left-color": "rgba(255,255,255,0.7)",
                                "color": "rgba(255,255,255,0.7)"
                            }, {
                                '-ms-transition': 'all 1s', /* ie10 */
                                "border-left-color": "rgba(255,255,255,0.7)",
                                "color": "rgba(255,255,255,0.7)"
                            }, {
                                '-o-transition': 'all 1s', /* Opera */
                                "border-left-color": "rgba(255,255,255,0.7)",
                                "color": "rgba(255,255,255,0.7)"
                            }
                        ], i == 1?function () {
                            clickFlag.bonusFlag = false;
                        }: null)
                    }
                    tranfromEndCss(document.getElementById("toTop"), $toTop, [
                        {
                            'transition': 'all 0s', /* Firefox */
                            "transform": "rotate(0deg)",
                        }, {
                            '-moz-transition': 'all 0s', /* Safari Chrome */
                            "-moz-transform": "rotate(0deg)",
                        }, {
                            '-webkit-transition': 'all 0s', /* Safari */
                            "-webkit-transform": "rotate(0deg)",
                        }, {
                            '-ms-transition': 'all 0s', /* ie10 */
                            "-ms-transform": "rotate(0deg)",
                        }, {
                            '-o-transition': 'all 0s', /* Opera */
                            "-o-transform": "rotate(0deg)",
                        }
                    ])
                }
            }
        }, 1000);
        $("#toTop").mouseup(function() {//鼠标up时，判断down了多久，不足一秒，不执行down的代码。
            if (!clickFlag.bonusFlag) {
                clearTimeout(stopFun);
            }
        });
    })


    $("#share").click(function(){
        if(!clickFlag.shareStarFlag) {
            clickFlag.shareStarFlag = true;
            $.ajax({
                url: 'share.html',
                type: 'get',
                async: false,
                success: function (res) {
                    $("#share-curtain").html($(res));
                    document.documentElement.style.overflow='hidden';
                    document.body.style.overflow='hidden';
                }
            });
        }
    })
}

// 通过遍历做缓存
function calculaHeight(){
    var divInitHeight = 1000;
    globalPiiicContentDivHeight.push(divInitHeight);
    for (var i = -1;i ++ < globalPiiicContentDiv.length - 1;){
        var $globalPiiicContentDiv = $(globalPiiicContentDiv[i]);
        divInitHeight += $globalPiiicContentDiv.outerHeight(true);
        globalPiiicContentDivHeight.push(divInitHeight);
    }
}
// 利用缓存中数据做绑定
function scrollData(){
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
    $("#background-body").css("height", (globalPiiicContentDivHeight[globalPiiicContentDivHeight.length - 2] + Math.floor($(".gs-content-word").height()) - 630) + "px");
}

function typeOfAgent() {
    var platform = navigator.platform,
        agent = navigator.userAgent;
    agentType = (agent.indexOf('Android') > -1 || agent.indexOf('Adr') > -1 || !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || platform.indexOf("Mac") > -1);
    if (agentType) {
        $("#getImg").find(".word").html("转图 IMG");
    }
}

// 因为使用a标签下载b64太长，所以只能够转为blob文件进行下载
function getImg() {
    $("#main-content").children().each(function(index, value) {
        $(value).css("opacity","1");
    })
    html2canvas($('#piiic-container'), {
        onrendered: function(canvas) {
            /*let base64ImgSrc = canvas.toDataURL("image/png")
            let img = document.createElement("img")
            img.src = base64ImgSrc;
            document.body.appendChild(img);*/
            //let quality = $("#jpgQuality").getValue(),
             var url = canvas.toDataURL("image/jpeg");//, 0.5);//.replace("image/png", "image/octet-stream");

            // 转为file并且下载
            if(agentType) {
                /*webview.getSettings().setJavaScriptEnabled(true);
                webview.getSettings().setSupportMultipleWindows(true);
                webview.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);*/
                //document.body.appendChild(canvas);
                var img = document.createElement("img");
                var $img = $(img);
                $img.attr("src", url);
                $img.css("display","block").css("margin","auto");
                document.body.appendChild(img);
                var container = document.getElementById("piiic-container");

                document.body.removeChild(container);
                alertImgComplete();
            } else {
                //var img_data1 = Canvas2Image.saveAsPNG(canvas, true).getAttribute('src');
                //var _stars = new Stars({stars:100});
                callback(dataURIToBlob(url));
                alertImgComplete();
                /* var link = document.createElement('a');
                 link.download = 'my-image-name.jpg';
                 link.href = url;
                 link.click();*/
            }
        }
    });
}
function dataURIToBlob(dataURI) {
    var binStr = atob(dataURI.split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }

    // 判断版本的API
    var blob;
    try{
        blob = new Blob([arr], {type : "image/jpeg"});
    }
    catch(e){
        window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
        if(e.name == 'TypeError' && window.BlobBuilder){
            var bb = new BlobBuilder();
            bb.append([arr.buffer]);
            blob = bb.getBlob("image/jpeg");
        }
        else if(e.name == "InvalidStateError"){
            blob = new Blob( [arr.buffer], {type : "image/jpeg"});
        }
    } finally {
        let files = new window.File([blob], "test.jpg", {type: "jpeg"})
        return files;
    }
}
function callback(files) {
    let blobdown = document.createElement('a');
    blobdown.download = "test.jpg";
    blobdown.href = window.URL.createObjectURL(files);
    blobdown.style.display = 'none';
    blobdown.click();
};

// 因为受到CORS浏览器安全限制，所以使用arraybuffer形式下载图片
function imgB64() {
    $("#piiic-container img").each(function(index, value) {
        image2base64($(value), 1);
    });
    $(divBackgroundArr).each(function (index, value) {
        image2base64($(value));
    })
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
            dataUrl = "data:image/jpg;base64," + base64;
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

function alertImgComplete() {
    clickFlag.completeDownloadFlag = true;
    if(!clickFlag.downloadAnimateFlag) {
        callbackClickAnimate(2);
    }
}

// 解决浏览器兼容
/*function compatibleLoad() {
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
}*/

//递归将要转换的节点中的所有图片的src全部转为base64，递归太傻，为什么要吃栈
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
