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

$("#uploadGithub").click(function() {

    var uploadInput = document.getElementById("FileUpload");
    uploadInput.click();
    var $uploadInput = $("#FileUpload");
    globalLock.upLoadFlag = false;
    $uploadInput.change(function() {
        if(!globalLock.upLoadFlag) {
            globalLock.upLoadFlag = true;
            var fileObj = uploadInput.files[0]; // js 获取文件对象
            if (!fileObj || fileObj.size <= 0) {
                return;
            }
            var formData = new FormData();
            formData.append("file", fileObj);
            $.ajax({
                url: "https://49.234.4.31:8081/uploadGithub",
                data: formData,
                type: "POST",
                dataType: "json",
                headers:{"Access-Control-Allow-Origin" : "*"},
                cache: false,//上传文件无需缓存
                async: true,
                contentType: "multipart/form-data",
                processData: false,//用于对data参数进行序列化处理 这里必须false
                contentType: false, //必须
                success: function (result) {
                    if(result.msg == -1 || !result.msg) {
                        alert("上传失败了");
                    } else{
                        alert("上传成功");
                    }
                    globalLock.upLoadFlag = false;
                },
            })
        }
    })

})

$("#test").click(function() {
    $.ajax({
        url: "https://49.234.4.31:8081/uploadGithub",
        type: 'get',
        async: true,
        success: function (res) {
            alert(res.dd)
        }
    });

})

// 搜索框动画
$("#character-name").focus(function() {
    var value = $.trim($("#character-name").val());
    if (!value) {
        $("#character-name").val("");
        $("#character-name").css("width", "210");
        $("#top-navbar-botton ul li.searchli").css("width", "252");
        $("#top-navbar-botton ul li.searchli").attr("value", "请输入干员名称,搜索长图");
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
