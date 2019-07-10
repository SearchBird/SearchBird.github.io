$("#homePage").click(function(){
    window.location.href = "../index.html"
})

$("#character-name").focus(function() {
    var value = $.trim($("#character-name").val());
    if (value == "请输入干员名称,搜索长图" || !value) {
        $("#character-name").val("");
    }
});

// 回车和点击进行查询
$("#character-name").keydown(function(e){
    if(e.keyCode==13) {
        beginSearch();
    }
})
$(".search-piiic").click(function(){
    beginSearch();
})
// 回车和点击进行查询

function beginSearch() {
    var value = $.trim($("#character-name").val());
    if (value == "请输入干员名称,搜索长图" || !value) {
        return;
    }
    else {
        if(pageType){
            if(pageType == 1) {
                new reloadObj().reloadPiiic(value);
            }
        } else{
            window.location.href = "piiic-main.html?code=" + value;
        }
    }
}
