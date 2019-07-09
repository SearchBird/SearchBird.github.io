$("#homePage").click(function(){
    window.location.href = "../index.html"
})

$("#character-name").keydown(function(e){
    if(e.keyCode==13) {
        var value = $("#character-name").val();
        if (value == "请输入干员名称,搜索长图" || !value) {
            return;
        }
        else {
            searchPiiicFun()
        }
    }
})

$(".search-piiic").click(function(){
    var value = $("#character-name").val();
    if(value == "请输入干员名称,搜索长图" || !value) {
        return;
    }
    else {
        searchPiiicFun()
    }
})

function searchPiiicFun() {
    var test;
    if(window.XMLHttpRequest){
        test = new XMLHttpRequest();
    }else if(window.ActiveXObject){
        test = new window.ActiveXObject();
    }else{
        alert("请升级至最新版本的浏览器");
    }
    if(test !=null){
        test.open("GET","https://raw.githubusercontent.com/SearchBird/SearchBird.github.io/master/json/myjson.json",true);
        test.send(null);
        test.onreadystatechange=function(){
            if(test.readyState==4&&test.status==200){
                console.log(test.responseText);
                //          var obj = JSON.parse(test.responseText);
                //          for (var name in obj){
                //              alert(obj[name].key);
                //          }
            }
        };

    }
}