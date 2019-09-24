"use strict";
// 全局初始化
$(function() {

    // 查询数据初始化
    if(!queryLoad()) {
        window.location.href = "piiic.html"
        //pageLoad(true);
    }
});

function pageLoad(flag,loadObj) {
    // 解决浏览器兼容
    //compatibleLoad();
    if(flag){
        // 加载其他html文件
        new htmlLoad().syncHtml();
    }
    // 样式初始化
    cssLoad(loadObj)
    // 动画兼容
    requestAnimationFrameInit();
    // 动作初始化
    eventLoad();

}

// 查询数据初始化
function queryLoad() {
    var code = getQueryVariable("code");
    if(code) {
        code = $.trim(decodeURI(code,"utf-8"));
        if(code) {
            new reloadObj().reloadPiiic(code);
            return true;
        }
    }
    return false;
}

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
function cssLoad(loadObj){
    // 初始化图片
    imgOnload();
    // 初始化盒子间距
    distanceInit();
    // 初始化攻击范围文字大小
    attackScaleSizeInit();
    // 改变右侧文字距离
    rightFontdistince();
    // 判断浏览器类型
    typeOfAgent();
    // 将文件改为b64格式，便于下载
    imgB64();
    // 绑定聚焦
    searchInputFocus();
    // 初始化高亮
    highLightInit(loadObj.MainColor);
    // 渲染全局颜色
    mainColor(loadObj.MainColor);
    // 初始化反色
    differenceOnload();
    // 搜索框长度初始化
    searchInputLength();
}

// 加载其他html文件
function htmlLoad() {
    // 同步加载
    syncHtml();
}

// 改变右侧文字距离
function rightFontdistince() {
    var rightFont = $("#right-font");
    var rightFontWidth = Math.floor(rightFont.css("width").replace("px", "")) >> 1;
    // 因为旋转文字是以中心为支点，所以旋转后，顶部距离 = - (宽度 >> 1 + 适当调整)
    rightFont.css("margin-top", ((rightFontWidth >> 1) + 50)  + "px");

    // 因为旋转文字是以中心为支点，所以旋转后，右边距离 = - (宽度 >> 1 + 高度 >> 1)
    rightFont.css("margin-right", "-" + (rightFontWidth - (rightFont.css("height").replace("px", "") >> 1))  + "px")
    rightFont.css("opacity","1");
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

    // ToTop小动画
    var i = 4
    var toTopHover = setInterval(function () {
        if(i == 1) {
            clearInterval(toTopHover);
        }
        toTopHovFun();
        setTimeout(function (){
            toTopBluFun();
        },300);
        i -= 1;
    },500);
    // 小动画

    clickFlag.toTopHoverLock = true;
    $("#toTop").hover(function(){
        toTopHovFun();
    },function(){
        toTopBluFun();
    })
}

function toTopHovFun() {
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
}

function toTopBluFun() {
    for(var i = 7;i -- > 1;){
        $(".toTop-inner" + i).animate( { opacity : "0.7"},"normal");
        $(".move").each(function(index, value) {
            $(value).stop().remove();
        })
    }
}

// 攻击范围样式初始化
function attackScaleSizeInit() {
    var $attackScale = $(".attack-inner");
    var sizeArr = $attackScale.html().split("<br>");
    var sizeFlag = false;
    if(sizeArr.length == 1) {
        $attackScale.css({"width":"100%","margin-left":"0"})
        if($.trim(sizeArr[0]).length < 4){
            $attackScale.css("font-size", "17px");
        }
    } else if(sizeArr.length > 1) {
        // $attackScale.css({"width":"fit-content","margin-left":"auto","text-align":"left"})

        $attackScale.css({"width":"fit-content","margin-left":"auto","text-align":"left"})
    }
    if($("#AttackScope_E").html()) {
        $attackScale.css({"margin-left":"0"})
        var theWidth = parseInt($("#AttackScope_E").css("width").replace("px","")) + 3 + "px"
        $("#AttackList").css({"width":theWidth, "margin" : "0 auto"})
    }
}

function highLightInit(color) {
    $(".heightLight").css({"text-shadow": "0px 0px 20px " + color + ",0rem 0rem .5rem " + color + ",0rem 0rem 0rem " + color, "font-weight" : "600"});
}

function changeFont() {
    var baseInfo = $(".base-info");
    baseInfo.css("font-family","黑体");
    baseInfo.css("font-weight","400");
    $(".character-sign").css("font-family","黑体");
}

function distanceInit() {
    var baseInfoHeight = Math.floor($(".base-info").css("height").replace("px","")) + 175;

    // 去掉高度计算，并入制作者背景模块
    //$(".maker").css("top",baseInfoHeight + "px");
}

function imgOnload() {
    var $img = $("img");

    $img.lazyload({
        effect : "fadeIn"
    });
}

function mainColor(color){
    $(".back-curtain1").css("border-bottom","642px solid " + color);
    $(".back-curtain2").css("border-top","643px solid " + color);
    $(".back-curtain3").css("border-bottom","642px solid " + color);

    // 2019-09-20 第二模板
    $(".back-curtain1-top").css({"border-top" : "380px solid " + LightenDarkenColor(color, 20)});
    $(".back-curtain2-middle").css("border-bottom","595px solid " + color);
    $(".back-curtain3-line").css("background",color);
    $(".back-curtain4-bottom:first").css("border-top","170px solid " + color);
    // 2019-09-20 第二模板

    $(".difference").each(function(index, value) {
        $(value).css("background", color);
    })
    $(".skill-icon .icon-1").each(function(index, value) {
        $(value).css("border", "3px solid " + color);
    })
    $(".skill-icon .icon-2").each(function(index, value) {
        $(value).css("border", "3px solid " + color);
    })
    $(".test-icon").css("border" ,  "3px solid" + color);
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

function searchInputLength() {
    var value = $.trim($("#character-name").val());
    if (!value) {
        $("#character-name").val("");
        $("#character-name").css("width", "110");
        $("#top-navbar-botton ul li.searchli").css("width", "152");
    } else {
        $("#character-name").css("width", "210");
        $("#top-navbar-botton ul li.searchli").css("width", "252");
    }
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
            document.body.style.overflow='hidden ';
            if(agentType) {
                document.body.style.position='fixed ';
            }
            clickFlag.downloadStarFlag = true;
            setTimeout(getImg,1000);
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
            globalObj.urlType = 2;
            clickFlag.shareStarFlag = true;
            importHtml('share.html', false, function (res) {
                $("#share-curtain").html($(res));
                document.documentElement.style.overflow='hidden';
                document.body.style.overflow='hidden';
            })
        }
    })
}

// 通过遍历做缓存
function calculaHeight(){
    globalPiiicContentDivHeight = [];
    var divInitHeight = 1170;
    globalPiiicContentDivHeight.push(divInitHeight);
    for (var i = -1;i ++ < globalPiiicContentDiv.length - 1;){
        var $globalPiiicContentDiv = $(globalPiiicContentDiv[i]);
        if($globalPiiicContentDiv.css("display") == "none") {
            globalPiiicContentDiv.splice(i,1);
            continue;
        }
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
        importHtml(syncName.replace("#", "") + '.html', false, function (res) {
            $(syncName).html($(res));
        })
    }
    //htmlLazyLoad();
}

function containerInit() {
    $("#background-body").css("height", (parseInt($("#main-content").css("height").replace("px","")) + 160) + "px");
}

// 因为使用a标签下载b64太长，所以只能够转为blob文件进行下载
function getImg() {

    $("#main-content").children().each(function(index, value) {
        $(value).css("opacity","1");
    })
    if(clickFlag.toImg) {
        alertImgComplete("已经转为图片，长按保存即可");
        return;
    }
    html2canvas($('#piiic-container'), {
        onrendered: function(canvas) {
            /*let base64ImgSrc = canvas.toDataURL("image/png")
            let img = document.createElement("img")
            img.src = base64ImgSrc;
            document.body.appendChild(img);*/
            //let quality = $("#jpgQuality").getValue(),
             var url = canvas.toDataURL("image/jpeg");//, 0.5);//.replace("image/png", "image/octet-stream");
            var codeCh = $("#CodeNameCh").html();
            // 转为file并且下载
            if(agentType) {
                /*webview.getSettings().setJavaScriptEnabled(true);
                webview.getSettings().setSupportMultipleWindows(true);
                webview.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);*/
                //document.body.appendChild(canvas);
                clickFlag.toImg = true;
                var img = document.createElement("img");
                var $img = $(img);
                $img.attr("src", url).attr("name",codeCh);
                $img.css({"display":"block","margin":"auto"});
                document.body.appendChild(img);
                var container = document.getElementById("piiic-container");

                document.body.removeChild(container);
                alertImgComplete("finish");
            } else {
                //var img_data1 = Canvas2Image.saveAsPNG(canvas, true).getAttribute('src');
                //var _stars = new Stars({stars:100});


                callback(dataURIToBlob(url), codeCh);
                alertImgComplete("finish");
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
        let files = new window.File([blob], "download.jpg", {type: "jpeg"})
        return files;
    }
}
function callback(files,codeCh) {
    let blobdown = document.createElement('a');
    blobdown.download = codeCh + "测评.jpg";
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
        if(imgObj.length != 0) {
            var background = imgObj.css('backgroundImage');
            src = background.substring(background.indexOf('url("')).replace('url("', "").replace('url(', "").replace('")', "").replace(")","");
        } else {
            return;
        }
    }

    var request;
    if(window.XMLHttpRequest){
        request = new XMLHttpRequest();
    }else if(window.ActiveXObject){
        request = new window.ActiveXObject();
    }else{
        myAlert("浏览器版本不支持远程访问，请更换浏览器");
    }
    var dataUrl;
    request.open('GET', src, true);
    request.responseType = 'arraybuffer';

    request.onload = function(e) {
        if (request.status == 200) {
            var uInt8Array = new Uint8Array(request.response);
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

    request.onreadystatechange = function(){
        if (request.readyState === 4 && request.status === 404) {
            imgObj.remove()
        }
    }

    request.send();
}

function alertImgComplete(alertString) {
    myAlert(alertString)
    document.body.style.overflow='scroll';
    if(agentType)
        document.body.style.position='static'
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
