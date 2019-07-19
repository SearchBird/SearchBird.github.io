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

// 上传测评点击
$("#uploadGithub").click(function() {
        var uploadInput = document.getElementById("FileUpload");
        uploadInput.click();
        globalLock.upLoadFlag = false;
    }
);

// 下载模板点击
$("#downloadTemp").click(function() {
    var downloadA = document.createElement("a");
    downloadA.setAttribute('download', '测评模板(命名和上传无关).doc');
    downloadA.setAttribute('href', 'https://github.com/SearchBird/jsonUpload/blob/master/word/%E6%B5%8B%E8%AF%84%E6%A8%A1%E6%9D%BF(%E5%91%BD%E5%90%8D%E5%92%8C%E4%B8%8A%E4%BC%A0%E6%97%A0%E5%85%B3).doc?raw=true');
    downloadA.setAttribute('filename', '测评模板(命名和上传无关).doc');
    downloadA.click();
})

$("#FileUpload").change(function(e) {
    if(!globalLock.upLoadFlag) {
        globalLock.upLoadFlag = true;
        var fileObj = e.target.files;//document.getElementById('fileToUpload').files[0]

        if (!fileObj || fileObj.size <= 0) {
            myAlert("请选择正确的测评文件")
            return;
        }

        var fileReader = new FileReader();
        fileReader.onload = function (ev) {
            try {
                var data = ev.target.result;
                var dataArr = data.split("<w:t>");
                dataArr.shift();
                var dataJson = [];
                for(var i = dataArr.length;i-- > 0;) {
                    dataJson.unshift(dataArr[i].split("</w:t>")[0]);
                }



                debugger;

                var formData = new FormData();
                formData.append("file", fileObj);


                $.ajax({
                    url: "https://127.0.0.1:8081/uploadGithub",
                    data: JSON.stringify(myData),
                    type: "POST",
                    headers: {"Access-Control-Allow-Origin": "*"},
                    cache: false,//上传文件无需缓存
                    async: true,
                    dataType: "json",
                    contentType: "application/json", //multipart/form-data
                    //processData: false,//用于对data参数进行序列化处理 这里必须false，如果是多媒体文件就加上，json文件就要序列化处理
                    success: function (result) {
                        if (result.msg == -1 || !result.msg) {
                            myAlert("上传失败了");
                        } else {
                            myAlert("上传成功");
                        }
                        globalLock.upLoadFlag = false;
                    },
                })
            } catch (e) {
                console.log('文件类型不正确');
            }
        }
        fileReader.readAsBinaryString(fileObj[0]);
    }
})

$("#test").click(function() {
    $.ajax({
        url: "https://127.0.0.1:8081/uploadGithub",//49.234.4.31
        type: 'get',
        async: true,
        success: function (res) {
            myAlert(res.dd)
        }
    });

})

// 搜索框动画
$("#character-name").focus(function() {
    var value = $.trim($("#character-name").val());
    if (!value) {
        $("#character-name").css("width", "210");
        $("#top-navbar-botton ul li.searchli").css("width", "252");
    }
});
$("#character-name").blur(function(){
    var value = $.trim($("#character-name").val());
    if (value === "请输入干员名称,搜索长图" || !value) {
        $("#character-name").val("");
        $("#character-name").css("width", "110");
        $("#top-navbar-botton ul li.searchli").css("width", "152");
    }
})
// 搜索框动画

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
