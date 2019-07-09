function sendURL(jsonURL){
    var request;
    if(window.XMLHttpRequest){
        request = new XMLHttpRequest();
    }else if(window.ActiveXObject){
        request = new window.ActiveXObject();
    }else{
        alert("浏览器版本不支持远程访问，请更换浏览器");
    }
    if(request !=null){
        request.open("GET",jsonURL,true); // "https://raw.githubusercontent.com/SearchBird/SearchBird.github.io/master/json/hello.json"
        request.send(null);
        request.onreadystatechange=function(){
            if(request.readyState==4 && request.status==200){
                var jsonObj = JSON.parse(request.responseText);
                return jsonObj;
            }
        };
    }
}

function reloadPiiic(codeName) {
    codeName = checkName(codeName);
    if(codeName){
        var jsonURL = "https://raw.githubusercontent.com/SearchBird/SearchBird.github.io/master/json/" + codeName + ".json";
        var jsonObj = sendURL(jsonURL);
        debugger;
    }
}

function checkName(codeName){
    var jsonObj = sendURL("https://raw.githubusercontent.com/SearchBird/SearchBird.github.io/master/json/checkName.json");
    try{
        var codeEn = jsonObj[codeName.toLowerCase()];
    } catch (e) {
        return null;
    }
    return codeEn;
}