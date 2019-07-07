$("#homePage").click(function(){
    window.location.href = "../index.html"
})

$("#character-name").keydown(function(){
    var value = $("#character-name").val();
    if(value == "请输入干员名称,搜索长图" || !value) return;
    else alert(value)
})
$(".search-piiic").click(function(){
    var value = $("#character-name").val();
    if(value == "请输入干员名称,搜索长图" || !value) return;
    else alert(value)
})