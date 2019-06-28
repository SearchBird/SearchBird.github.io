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
        this.$this = $(value);
        this.$thisId = this.$this.attr("id");

        // 设置悬浮动画
        setHoverAnimate(this.$this);

        // 开策略
        this.$this.click(function() {
            if (this.$thisId == "getImg") {  // 下载图片或者转换图片，异步处理
                getImgClickAnimateFun(this.$this);
            } else if (this.$thisId == "share") {  // 分享功能，异步处理
                shareClickAnimateFun(this.$this);
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

            setTimeout(function () {
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
                $middle.animate({width: "150px", left: "30px"}, 300);
                $left.animate({left: "0px"}, 300);
                $right.animate({right: "53px"}, 300, function () {
                    // 动画完毕
                    globalObj.$left = $left;
                    globalObj.$right = $right;
                    globalObj.$middle = $middle;
                    globalObj.$word = $word;
                    globalObj.$light = $light;
                    if(type == 1) {
                        clickFlag.shareAnimateFlag = false;
                        if(clickFlag.completeShareFlag){
                            clickFlag.shareCompleteAnimateFlag = true;
                            callbackClickAnimate(type);
                        }
                    } else if(type == 2) {
                        clickFlag.downloadAnimateFlag = false;
                        if(clickFlag.completeDownloadFlag) {
                            clickFlag.downloadCompleteAnimateFlag = true;
                            callbackClickAnimate(type);
                        }
                    }
                });
            }, 1000);
        }
    )
}

function callbackClickAnimate(type) {
    var $left = globalObj.$left;
    var $right = globalObj.$right;
    var $middle = globalObj.$middle;
    var $word = globalObj.$word;
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
            $word.animate({opacity: "1"}, 820, function () {
                if(type == 1){
                    clickFlag.shareStartAnimateFlag = false;
                    clickFlag.completeShareFlag = false;
                    clickFlag.shareStarFlag = false;
                }
                else if(type == 2) {
                    clickFlag.donloadStartAnimateFlag = false;
                    clickFlag.completeDownloadFlag = false;
                    clickFlag.downloadStarFlag = false;
                }
                globalObj.$light.removeClass().addClass("toolist-btn-light").addClass("toolist-btn-light-red");

                globalObj.$light = null;
                globalObj.$middle = null;
                globalObj.$left = null;
                globalObj.$right = null;
                globalObj.$word = null;
            })
        }
    );

}