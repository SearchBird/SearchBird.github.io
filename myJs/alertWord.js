var how2useClickFlag = false;
var firstStyel = "";
var useImgIndex = 1;
var imgLock = false;
var $clickImg;
var $afterClick;

function alertWord() {

    function init() {
        initClick();
    }

    function initClick() {


        // 怎样使用选项
        $(".img-container-outter").click(function () {
            how2useClickFlag = !how2useClickFlag;
            if(how2useClickFlag) {
                $(".index-use-title").css({
                    "height" : "20%",
                    "font-size" : "3rem",
                })
                $(".index-use-img-list").css({
                    "height" : "80%"
                })
                $(".img-container").css({"overflow" : "visible", "width" : "80%"})
                $(".img-content").remove();
                $("#img-prev2").css({"animation" : "prevAniLeft 1s 1 alternate forwards",});
                $(".img-next:not(#img-next2)").css({"animation" : "prevAniLeft2 1s 1 alternate forwards",});
                $("#img-next2").css({"animation" : "prevAniRight 1s 1 alternate forwards",});
                $(".img-prev:not(#img-prev2)").css({"animation" : "prevAniRight2 1s 1 alternate forwards",});

                var $removeStylr = $("#removeStyle");
                firstStyel = $removeStylr.html();

                $removeStylr.remove();
                $clickImg = $(".afterClick img");
                $afterClick = $(".afterClick");
                $afterClick.css({"animation" : "afterClickAni 0.5s 0.7s 1 alternate ease-in forwards"});

                $(".img-prev").each(function (index, value) {
                    $(value).click(function () {
                        if(!imgLock){
                            imgLock = true;
                            useImgIndex = ((useImgIndex + 4) % 3) + 1;
                            $clickImg.attr("src", "https://raw.githubusercontent.com/SearchBird/ImageIO/master/how2use/how2use-" + useImgIndex + ".png");
                            setTimeout(function () {
                                imgLock = false;
                            }, 300);
                        }
                    });
                });
                $(".img-next").each(function (index, value) {
                    $(value).click(function () {
                        if(!imgLock){
                            imgLock = true;
                            useImgIndex = (useImgIndex % 3) + 1;
                            $clickImg.attr("src", "https://raw.githubusercontent.com/SearchBird/ImageIO/master/how2use/how2use-" + useImgIndex + ".png");
                            setTimeout(function () {
                                imgLock = false;
                            }, 300);
                        }
                    })
                });

            }
        });


        // 关闭按钮
        $(".alertclose").click(function () {
            if(firstStyel) {
                var style = document.createElement("style");
                style.id = "removeStyle";
                document.head.appendChild(style);
                $(style).prepend(firstStyel);
                firstStyel = "";
            }

            how2useClickFlag = false;
            $("#alertWord").remove();
            $(".index-mask").parent().remove();
        })
    }

    return {
        init : init,
    }
}

setTimeout(function () {
    alertWord().init();
}, 500);