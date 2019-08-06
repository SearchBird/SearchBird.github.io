var how2useClickFlag = false;

function how2use() {

    function init() {
        initClick();
    }

    function initClick() {
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
                $(".img-content").css("display","none");
                $("#img-prev2").css({"animation" : "prevAniLeft 1s 1 alternate forwards",});
                $(".img-next:not(#img-next2)").css({"animation" : "prevAniLeft2 1s 1 alternate forwards",});
                $("#img-next2").css({"animation" : "prevAniRight 1s 1 alternate forwards",});
                $(".img-prev:not(#img-prev2)").css({"animation" : "prevAniRight2 1s 1 alternate forwards",});
                document.styleSheets[0].deleteRule(0);
                document.styleSheets[0].deleteRule(0);
            }
        });
        $(".h2uclose").click(function () {
            $(".index-mask").parent().remove();
        })
    }

    return {
        init : init,
    }
}

setTimeout(function () {
    how2use().init();
}, 500);