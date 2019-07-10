"use strict";
// 全局初始化
$(function() {
    htmlLoad();
});


// 加载其他html文件
function htmlLoad() {
    // 同步加载
    syncHtml();
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