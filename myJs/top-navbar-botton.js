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

// 下载模板点击
$("#downloadTemp").click(function() {
    var downloadA = document.createElement("a");
    downloadA.setAttribute('download', '测评模板(命名和上传无关).doc');
    downloadA.setAttribute('href', 'https://github.com/SearchBird/jsonUpload/blob/master/word/%E6%B5%8B%E8%AF%84%E6%A8%A1%E6%9D%BF(%E5%91%BD%E5%90%8D%E5%92%8C%E4%B8%8A%E4%BC%A0%E6%97%A0%E5%85%B3).docx?raw=true');
    downloadA.setAttribute('filename', '测评模板(命名和上传无关).doc');
    downloadA.click();
})


$("#test").click(function() {
    $.ajax({
        url: "https://saikapiic.xyz/uploadGithub",//49.234.4.31
        type: 'get',
        async: true,
        success: function (res) {
            myAlert(res.dd)
        }
    });

})

// 搜索框动画 ============================
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
// 搜索框动画 ============================

// 回车和点击进行查询 ============================
$("#character-name").keydown(function(e){
    if(e.keyCode==13) {
        beginSearch();
    }
})
$(".search-piiic").click(function(){
    beginSearch();
})
// 回车和点击进行查询 ============================

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



// 上传测评点击 ============================
$("#uploadGithub").click(function() {
        var uploadInput = document.getElementById("FileUpload");
        uploadInput.click();
        globalLock.upLoadFlag = false;
    }
);

$("#FileUpload").change(function(e) {
    if(!globalLock.upLoadFlag) {
        globalLock.upLoadFlag = true;
        var fileObj = e.target.files;//document.getElementById('fileToUpload').files[0]

        // 判断xml文件
        if (!fileObj || fileObj.size <= 0) {
            myAlert("请提交测评xml文件", 500);
            globalLock.upLoadFlag = false;
            return;
        }

        var fileNameLen = fileObj[0].name.length;
        var type = fileObj[0].name.substring(fileNameLen - 4, fileNameLen);
        if(type != ".xml") {
            myAlert("请提交测评xml文件", 500);
            globalLock.upLoadFlag = false;
            return;
        }

        // 解析xml,并上传xml
        var fileReader = new FileReader();
        fileReader.onload = function (ev) {
            try {
                var data = ev.target.result;
                /*var ddddd = new unicoEncode();
                var ddd = ddddd.toBytes(data);
                var ccd = ddddd.fromBytes(ddd);*/
                //data = String.fromCharCode(data);
                // 切出所有内容
                var dataArr = data.split("<w:t>");
                dataArr.shift();

                // 去除提示
                dataArr.splice(0, 25);

                // 封装json
                var myData = buildObj().build(dataArr);
                // 清理掉大文件
                dataArr = undefined;
                debugger;

                $.ajax({
                    url: "https://saikapiic.xyz/uploadGithub",
                    data: JSON.stringify(myData),
                    type: "POST",
                    headers: {"Access-Control-Allow-Origin": "*"},
                    cache: false,//上传文件无需缓存
                    async: true,
                    dataType: "json",
                    contentType: "application/json; charset=UTF-8", //multipart/form-data
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
                console.log(e)
                myAlert('文件类型不正确');
            }
        }
        fileReader.readAsBinaryString(fileObj[0]);
        e.target.files = [];
    } else {
        myAlert("目前正在上传文件，请稍等")
    }
})

// 封装json
function buildObj() {

    function build(dataJson) {
        var myData = {};

        myData.Character_Base = {};
        myData.Skill = {};
        myData.Gift = {};
        myData.Gist = {};

        var fix = new fixProperty();
        var index = 0;

        // 匹配基础信息属性
        index = fix.build(myData, dataJson, "base", index);

        // 匹配技能属性
        index = fix.build(myData, dataJson, "gift", index);

        // 匹配天赋属性
        index = fix.build(myData, dataJson, "skill", index);

        // 匹配要领属性
        index = fix.build(myData, dataJson, "gist", index);

        return myData;
    }

    // 匹配基础信息属性
    function fixProperty() {

        function build(myData, dataJson, type, i) {
            var dataJsonLen = dataJson.length;
            var myEntity;
            var entity;
            if(type == "base") {
                myEntity = baseEntity;
                entity = myData.Character_Base;
            } else if(type == "skill") {
                myEntity = skillEntity;
                entity = myData.Skill;
            } else if(type == "gift") {
                myEntity = giftEntity;
                entity = myData.Gift;
            } else if(type == "gist") {
                myEntity = gistEntity;
                entity = myData.Gist;
            }

            // 添加key
            for(i;i < dataJsonLen;i ++){
                var str = dataJson[i];
                var property = myEntity(str);
                if(property != 0 && property != 1) {
                    // 找另外一个右括号
                    i = findTheRight(dataJson, i);
                    // 从该行开始匹配到下一个属性前都进行封装
                    i = getNext(dataJson, i, property, entity, myEntity);
                }
                if(property == 1) {
                    return i + 1;
                }
            }
        }

        // 填充value
        function getNext(dataJson, i, property, entity, myEntity) {
            var highFlag = false;
            var beginFlag = true;
            var content = "";
            for(;;i ++) {
                // 匹配是否到了下一个属性
                var properStr = myEntity(dataJson[i]);
                if(properStr != 0 || properStr == 1) {
                    entity[property] = content;
                    return i - 1;
                }

                var dataStrArr = dataJson[i].split("</w:t>");

                // 添加高亮
                if(highFlag) {
                    dataStrArr[0] = '<span class="heightLight">' + dataStrArr[0] + '</span>';
                    highFlag = false;
                }

                // 标记高亮
                var colorStr = dataStrArr[1].substring(dataStrArr[1].indexOf("w:color"), dataStrArr[1].indexOf("w:fill"));
                if(colorStr && colorStr.indexOf("auto") == -1) {
                    highFlag = true;
                }
                // 去掉第一行内容
                if(beginFlag) {
                    beginFlag = false;
                    continue;
                }
                content += dataStrArr[0];

            }
        }

        function findTheRight(dataJson, i) {
            for(;;i ++) {
                // 返回改行
                if(dataJson[i].indexOf(")") != -1) {
                    return i;
                }
            }

        }

        function baseEntity(str) {
            if(str.indexOf("CodeNameCh") != -1) {
                return "CodeNameCh";
            } else if(str.indexOf("CodeNameEn") != -1){
                return "CodeNameEn";
            } else if(str.indexOf("Logo") != -1){
                return "Logo";
            } else if(str.indexOf("Range") != -1){
                return "Range";
            } else if(str.indexOf("Features") != -1){
                return "Features";
            } else if(str.indexOf("Position") != -1){
                return "Position";
            } else if(str.indexOf("AttackScope") != -1){
                return "AttackScope";
            } else if(str.indexOf("AttackScope_E1") != -1){
                return "AttackScope_E1";
            } else if(str.indexOf("AttackScope_E2") != -1){
                return "AttackScope_E2";
            } else if(str.indexOf("NationEn") != -1){
                return "NationEn";
            } else if(str.indexOf("Duty") != -1){
                return "Duty";
            } else if(str.indexOf("InShort") != -1){
                return "InShort";
            } else if(str.indexOf("PrefaceValue") != -1){
                return "PrefaceValue";
            } else if(str.indexOf("PrefaceCompare") != -1){
                return "PrefaceCompare";
            } else if(str.indexOf("MainColor") != -1){
                return "MainColor";
            } else if(str.indexOf("wordCode") != -1){
                return "wordCode";
            } else if(str.indexOf("Gift") != -1) {
                return 1;
            } else {
                return 0;
            }
        }

        function giftEntity(str) {
            if(str.indexOf("Gift1Name") != -1) {
                return "Gift1Name";
            } else if(str.indexOf("Gift1Desc1") != -1){
                return "Gift1Desc1";
            } else if(str.indexOf("Gift1Desc2") != -1){
                return "Gift1Desc2";
            } else if(str.indexOf("Gift1Desc3") != -1){
                return "Gift1Desc3";
            } else if(str.indexOf("Gift2Name") != -1){
                return "Gift2Name";
            } else if(str.indexOf("Gift2Desc1") != -1){
                return "Gift2Desc1";
            } else if(str.indexOf("Gift2Desc2") != -1){
                return "Gift2Desc2";
            } else if(str.indexOf("Gift2Desc3") != -1){
                return "Gift2Desc3";
            } else if(str.indexOf("Gift3Name") != -1){
                return "Gift3Name";
            } else if(str.indexOf("Gift3Desc1") != -1){
                return "Gift3Desc1";
            } else if(str.indexOf("Gift3Desc2") != -1){
                return "Gift3Desc2";
            } else if(str.indexOf("Gift3Desc3") != -1){
                return "Gift3Desc3";
            } else if(str.indexOf("GiftOverall") != -1){
                return "GiftOverall";
            } else if(str.indexOf("GiftNum") != -1){
                return "GiftNum";
            } else if(str.indexOf("isExist") != -1){
                return "isExist";
            }  else if(str.indexOf("Skill") != -1) {
                return 1;
            } else {
                return 0;
            }
        }

        function skillEntity(str) {
            if(str.indexOf("isExist") != -1){
                return "isExist";
            } else if(str.indexOf("SkillNum") != -1){
                return "SkillNum";
            } else if(str.indexOf("Skill1Name") != -1) {
                return "Skill1Name";
            } else if(str.indexOf("Skill1Desc") != -1){
                return "Skill1Desc";
            } else if(str.indexOf("Skill1Conclusion") != -1){
                return "Skill1Conclusion";
            } else if(str.indexOf("Skill2Name") != -1){
                return "Skill2Name";
            } else if(str.indexOf("Skill2Desc") != -1){
                return "Skill2Desc";
            } else if(str.indexOf("Skill2Conclusion") != -1){
                return "Skill2Conclusion";
            } else if(str.indexOf("Skill3Name") != -1){
                return "Skill3Name";
            } else if(str.indexOf("Skill3Desc") != -1){
                return "Skill3Desc";
            } else if(str.indexOf("Skill3Conclusion") != -1){
                return "Skill3Conclusion";
            } else if(str.indexOf("SkillOverAll") != -1){
                return "SkillOverAll";
            } else if(str.indexOf("LogNum") != -1){
                return "LogNum";
            } else if(str.indexOf("Logistics1Name") != -1){
                return "Logistics1Name";
            } else if(str.indexOf("Logistics1Desc") != -1){
                return "Logistics1Desc";
            } else if(str.indexOf("Logistics2Name") != -1){
                return "Logistics1Name";
            } else if(str.indexOf("Logistics2Desc") != -1){
                return "Logistics1Desc";
            } else if(str.indexOf("Logistics3Name") != -1){
                return "Logistics1Name";
            } else if(str.indexOf("Logistics3Desc") != -1){
                return "Logistics1Desc";
            } else if(str.indexOf("LogisticsOverall") != -1){
                return "LogisticsOverall";
            }  else if(str.indexOf("Gist") != -1) {
                return 1;
            } else {
                return 0;
            }
        }

        function gistEntity(str) {
            console.log(str);
            if(str.indexOf("isExist") != -1){
                return "isExist";
            } else if(str.indexOf("Train") != -1){
                return "Train";
            } else if(str.indexOf("Team") != -1) {
                return "Team";
            } else if(str.indexOf("Deploy") != -1){
                return "Deploy";
            } else if(str.indexOf("Other") != -1){
                return "Other";
            } else if(str.indexOf("</w:body>") != -1) {
                return 1;
            } else {
                return 0;
            }
        }

        return{
            build : build
        }
    }

    return {
        build : build
    }
}
// 上传测评点击 ============================

