// 动画加载要到eventLoad()进行注册
function piiic_toolist_bottom_eventInit() {
    $(".piiic-toolist-btn-move-left").each(function (index, value) {
        $(value).animate({left: "55px"}, 800);
    })
    $(".piiic-toolist-btn-move-right").each(function (index, value) {
        $(value).animate({right: "107px"}, 800);
    })
    $(".toolist-btn-middle").each(function (index, value) {
        $(value).animate({width: "10px", left: "101px"}, 800,
            function () {
                // 另外已经在css定好旋转中心，不能在这里定义，否则会和动画一起播放
                $(".piiic-toolist-btn-move-right").each(function (index, right) {
                    $(right).css({
                        'transition': 'all 1s',
                        '-webkit-transition': 'all 1s',
                        '-moz-transition': 'all 1s',
                        '-ms-transition': 'all 1s',
                        '-o-transition': 'all 1s',
                        "transform": "rotate(90deg)",
                        "-moz-transform": "rotate(90deg)",
                        "-webkit-transform": "rotate(90deg)",
                        "-ms-transform": "rotate(90deg)",
                        "-o-transform": "rotate(90deg)",
                    })
                });
                $(".piiic-toolist-btn-move-left").each(function (index, left) {
                    $(left).css({
                        'transition': 'all 1s',
                        '-webkit-transition': 'all 1s',
                        '-moz-transition': 'all 1s',
                        '-ms-transition': 'all 1s',
                        '-o-transition': 'all 1s',
                        "transform": "rotate(-90deg)",
                        "-moz-transform": "rotate(-90deg)",
                        "-webkit-transform": "rotate(-90deg)",
                        "-ms-transform": "rotate(-90deg)",
                        "-o-transform": "rotate(-90deg)",
                    })
                });
                $(".piiic-toolist-btn-function").each(function (index, word) {
                    $(word).animate({opacity: "1"}, 800);
                })
            }
        );

    })

    $(".piiic-toolist-btn").each(function (index, value) {
        var $this = $(value);
        var $thisId = $this.attr("id");

        // 设置悬浮动画
        setHoverAnimate($this);

        // 开策略
        $this.click(function() {
            if ($thisId == "getImg") {  // 下载图片或者转换图片，异步处理
                getImgClickAnimateFun($this);
            } else if ($thisId == "share") {  // 分享功能，异步处理
                shareClickAnimateFun($this);
            }
        })
    })
}

function setHoverAnimate($this) {
    $this.hover(function(){
        var $red = $this.find(".toolist-btn-light-red");
        if($red) {
            $red.removeClass("toolist-btn-light-red");
            $red.addClass("toolist-btn-light-green")
        }
    }, function(){
        var $green = $this.find(".toolist-btn-light-green");
        if($green) {
            $green.removeClass("toolist-btn-light-green")
            $green.addClass("toolist-btn-light-red");
        }
    })
}

function shareClickAnimateFun($this) {
    if (!clickFlag.shareStartAnimateFlag) {
        clickFlag.shareStartAnimateFlag = true;
        clickFlag.shareAnimateFlag = true;
        clickToolistAnimate($this, 1);
    }
}

function getImgClickAnimateFun($this) {
    if (!clickFlag.donloadStartAnimateFlag) {
        clickFlag.donloadStartAnimateFlag = true;
        clickFlag.downloadAnimateFlag = true;
        clickToolistAnimate($this, 2);
    }
}

function clickToolistAnimate($this, type) {
    var $word = $this.find(".piiic-toolist-btn-function");
    var $light = $this.find(".toolist-btn-light");
    $light.removeClass();
    $light.addClass("toolist-btn-light-blue");
    $word.animate({opacity: "0"}, 300,
        function () {
            var $right = $this.find(".piiic-toolist-btn-move-right");
            var $left = $this.find(".piiic-toolist-btn-move-left");
            var $middle = $this.find(".toolist-btn-middle");

            $right.css({
                "transform": "rotate(180deg)",
                "-moz-transform": "rotate(180deg)",
                "-webkit-transform": "rotate(180deg)",
                "-ms-transform": "rotate(180deg)",
                "-o-transform": "rotate(180deg)",
            })
            $left.css({
                "transform": "rotate(0deg)",
                "-moz-transform": "rotate(0deg)",
                "-webkit-transform": "rotate(0deg)",
                "-ms-transform": "rotate(0deg)",
                "-o-transform": "rotate(0deg)",
            })


            $(document.createElement("div")).animate({width:"10px"}, 1020, function () {
                $right.css({
                    'transition': 'none',
                    '-webkit-transition': 'none',
                    '-moz-transition': 'none',
                    '-ms-transition': 'none',
                    '-o-transition': 'none',
                })
                $left.css({
                    'transition': 'none',
                    '-webkit-transition': 'none',
                    '-moz-transition': 'none',
                    '-ms-transition': 'none',
                    '-o-transition': 'none',
                })
                $left.animate({left: "0px"}, 300);
                $right.animate({right: "53px"}, 300);

                // 延迟20ms防止多次点击
                $middle.animate({width: "150px", left: "30px"}, 320, function () {
                    // 动画完毕，然后作区别
                    if(type == 1) {
                        var shareObj = {};
                        shareObj.$left = $left;
                        shareObj.$right = $right;
                        shareObj.$middle = $middle;
                        shareObj.$word = $word;
                        shareObj.$light = $light;
                        globalObj.shareObj = shareObj;
                        clickFlag.shareAnimateFlag = false;
                        if(clickFlag.completeShareFlag){
                            callbackClickAnimate(type);
                        }
                    } else if(type == 2) {
                        var downloadObj = {};
                        downloadObj.$left = $left;
                        downloadObj.$right = $right;
                        downloadObj.$middle = $middle;
                        downloadObj.$word = $word;
                        downloadObj.$light = $light;
                        globalObj.downloadObj = downloadObj;
                        clickFlag.downloadAnimateFlag = false;
                        if(clickFlag.completeDownloadFlag) {
                            callbackClickAnimate(type);
                        }
                    }
                });
            });
        }
    )
}

function callbackClickAnimate(type) {
    var $left;
    var $right;
    var $middle;
    var $word;
    var $light;
    if(type == 1){
        $left = globalObj.shareObj.$left;
        $right = globalObj.shareObj.$right;
        $middle = globalObj.shareObj.$middle;
        $word = globalObj.shareObj.$word;
        $light = globalObj.shareObj.$light;
    } else if(type == 2) {
        $left = globalObj.downloadObj.$left;
        $right = globalObj.downloadObj.$right;
        $middle = globalObj.downloadObj.$middle;
        $word = globalObj.downloadObj.$word;
        $light = globalObj.downloadObj.$light
    }

    $left.animate({left: "55px"}, 800);
    $right.animate({right: "107px"}, 800);
    $middle.animate({width: "10px", left: "101px"}, 800,
        function () {
            $right.css({
                'transition': 'all 1s',
                '-webkit-transition': 'all 1s',
                '-moz-transition': 'all 1s',
                '-ms-transition': 'all 1s',
                '-o-transition': 'all 1s',
                "transform": "rotate(90deg)",
                "-moz-transform": "rotate(90deg)",
                "-webkit-transform": "rotate(90deg)",
                "-ms-transform": "rotate(90deg)",
                "-o-transform": "rotate(90deg)",
            })
            $left.css({
                'transition': 'all 1s',
                '-webkit-transition': 'all 1s',
                '-moz-transition': 'all 1s',
                '-ms-transition': 'all 1s',
                '-o-transition': 'all 1s',
                "transform": "rotate(-90deg)",
                "-moz-transform": "rotate(-90deg)",
                "-webkit-transform": "rotate(-90deg)",
                "-ms-transform": "rotate(-90deg)",
                "-o-transform": "rotate(-90deg)",
            })

            // 延迟20ms防止多次点击
            $word.animate({opacity: "1"}, 820, function () {
                // 去掉blue,然后加上red,green
                $light.removeClass().addClass("toolist-btn-light").addClass("toolist-btn-light-red");
                if(type == 1){
                    clickFlag.shareStartAnimateFlag = false;
                    clickFlag.completeShareFlag = false;
                    clickFlag.shareStarFlag = false;
                    globalObj.shareObj = null;
                }
                else if(type == 2) {
                    clickFlag.donloadStartAnimateFlag = false;
                    clickFlag.completeDownloadFlag = false;
                    clickFlag.downloadStarFlag = false;
                    globalObj.downloadObj = null;
                }
            })
        }
    );

}