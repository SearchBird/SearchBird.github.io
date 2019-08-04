"use strict";
// 全局初始化
$(function() {

    new piiicInit().init();

    // 黑科技
    //document.body.contentEditable="true"
});

function piiicInit() {

    function init() {
        new htmlLoad().syncHtml();
        initHeight();
        initClick();
    }

    function initClick() {
        $("#search-tap-range div:not(.first),#search-tap-duty div:not(.first)").each(function(index, value) {
            var $value = $(value);
            $value.click(function () {
                alert(tagMap[$value.html()]);
            })
        })
    }

    function initHeight() {
        var listBodyHeight = window.innerHeight - 50;
        $("#list-body").css("height", listBodyHeight);
        $("#background-img").css("height", listBodyHeight);
        $("#list-piiic-list").css("height", listBodyHeight - 180);
    }


    return {
        init : init
    }
}



