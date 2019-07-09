$("#homePage").click(function(){
    window.location.href = "../index.html"
})

$("#character-name").focus(function() {
    var value = $.trim($("#character-name").val());
    if (value == "请输入干员名称,搜索长图" || !value) {
        $("#character-name").val("");
    }
});

$("#character-name").keydown(function(e){
    if(e.keyCode==13) {
        var value = $.trim($("#character-name").val());
        if (value == "请输入干员名称,搜索长图" || !value) {
            return;
        }
        else {
            new reloadObj().reloadPiiic(value);
        }
    }
})

$(".search-piiic").click(function(){
    var value = $.trim($("#character-name").val());
    if(value == "请输入干员名称,搜索长图" || !value) {
        return;
    }
    else {
        window.location.href = "piiic-main.html?code=" + value;
    }
})
