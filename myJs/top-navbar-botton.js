$("#homePage").click(function(){
    if(pageType === 0) {}
    else{
        window.location.href = "../index.html"
    }
})

$("#piiic").click(function() {
    if(pageType === 0) {
        window.location.href = "html/piiic.html"
    } else if(pageType == 1) {}
    else{
        window.location.href = "piiic.html"
    }
})

$("#shareStation").click(function(){
    var url =  'share.html';
    if(pageType === 0) {
        url = "html/share.html"
    }
    if(!clickFlag.shareStarFlag) {
        globalObj.urlType = 1;
        clickFlag.shareStarFlag = true;
        $.ajax({
            url: url,
            type: 'get',
            async: false,
            success: function (res) {
                $("#share-curtain").html($(res));
                document.documentElement.style.overflow='hidden';
                document.body.style.overflow='hidden';
            }
        });
    }
})

$("#test").click(function() {
    $.ajax({
        url: "https://49.234.4.31:8081/uploadGithub",
        type: 'get',
        async: false,
        success: function (res) {
            alert(res.dd)
        }
    });

})

$("#character-name").focus(function() {
    var value = $.trim($("#character-name").val());
    if (value == "请输入干员名称,搜索长图" || !value) {
        $("#character-name").val("");
    }
});
$("#character-name").blur(function(){
    var value = $.trim($("#character-name").val());
    if (value === "" || !value) {
        $("#character-name").val("请输入干员名称,搜索长图");
    }
})

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
        if(pageType !== ""){
            if(pageType == 1 || pageType == 0) {
                new reloadObj().reloadPiiic(value);
            }
        } else{
            window.location.href = "piiic-main.html?code=" + value;
        }
    }
}
