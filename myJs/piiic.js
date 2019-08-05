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
        // 初始化高度
        initHeight();
        // 初始化点击动作
        initClick();
        // 初始化标签颜色
        initTagColor();
    }

    function initTagColor() {
        var rangeId = getQueryVariable("rangeId");
        var dutyId = getQueryVariable("dutyId");
        if(rangeId) {
            $("#search-tap-range div:not(.first)").each(function(index, value) {
                var $value = $(value);
                if(tagMap[$value.html()] == rangeId) $value.addClass("search-tag-selected");
            })
        }

        if(dutyId) {
            $("#search-tap-duty div:not(.first)").each(function(index, value) {
                var $value = $(value);
                if(tagMap[$value.html()] == dutyId) $value.addClass("search-tag-selected");
            })
        }
    }

    function initClick() {
        $("#search-tap-range div:not(.first)").each(function(index, value) {
            var $value = $(value);
            $value.click(function () {
                if($value.hasClass("search-tag-selected")) {
                    $value.removeClass("search-tag-selected");
                    return;
                }
                var dutyHtml = $("#search-tap-duty div.search-tag-selected").html();
                window.location.href = "piiic.html?rangeId=" + tagMap[$value.html()] + (dutyHtml ? ("&dutyId=" + tagMap[dutyHtml]) : "");
            })
        })
        $("#search-tap-duty div:not(.first)").each(function(index, value) {
            var $value = $(value);
            $value.click(function () {
                if($value.hasClass("search-tag-selected")) {
                    $value.removeClass("search-tag-selected");
                    return;
                }
                var rangeHtml = $("#search-tap-range div.search-tag-selected").html();
                window.location.href = "piiic.html?dutyId=" + tagMap[$value.html()] + (rangeHtml ? ("&rangeId=" + tagMap[rangeHtml]) : "");
            })
        })
    }

    function initHeight() {
        var listBodyHeight = window.outerHeight - 50;
        $("#list-body").css("height", listBodyHeight);
        $("#background-img").css("height", listBodyHeight);
        $("#list-piiic-list").css("height", listBodyHeight - 180);
    }


    return {
        init : init
    }
}



