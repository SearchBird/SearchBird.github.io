"use strict";
// 全局初始化
$(function() {
    new htmlLoad().syncHtml();
    initHeight();
    // 黑科技
    //document.body.contentEditable="true"
});

function initHeight() {
    var listBodyHeight = window.innerHeight - 50;
    $("#list-body").css("height", listBodyHeight);
    $("#background-img").css("height", listBodyHeight);
    $("#list-piiic-list").css("height", listBodyHeight - 180);
}

