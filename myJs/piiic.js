"use strict";
// 全局初始化
$(function() {

    new piiicInit().init();

    // 黑科技
    //document.body.contentEditable="true"
});

function piiicInit() {
    var rangeId = "",
        dutyId = "",
        code = "",
        codeMap = {},
        dutyList = [],
        rangeList = [],
        codeMapDutyLock = false,
        codeMapRangeLock = false,
        mapLength = 0,
        urlGetLength = 0,
        cellJsonList = [],
        hrefStr = ""

    function init() {
        new htmlLoad().syncHtml();
        // 初始化高度
        initHeight();
        // 初始化点击动作
        initClick();
        // 初始化标签颜色
        initTagColor();
        // 初始化标签搜索
        initTagSearch();
    }

    function initTagColor() {
        rangeId = getQueryVariable("rangeId");
        dutyId = getQueryVariable("dutyId");
        code = getQueryVariable("code");
        if(rangeId) {
            $("#search-tap-range div:not(.first)").each(function(index, value) {
                var $value = $(value);
                if(tagMap[$value.html()] == rangeId) $value.addClass("search-tag-selected");
            })
        }

        if(dutyId) {
            $("#search-tap-duty div:not(.first)").each(function(index, value) {
                var $value = $(value);
                if(tagMap[$value.html()] == dutyId) $value.addClass("search-tag-selected");
            })
        }
    }

    function initClick() {
        // 绑定标签点击事件
        $("#search-tap-range div:not(.first)").each(function(index, value) {
            var $value = $(value);
            $value.click(function () {
                if($value.hasClass("search-tag-selected")) {
                    $value.removeClass("search-tag-selected");
                    return;
                }
                var dutyHtml = $("#search-tap-duty div.search-tag-selected").html();
                window.location.href = "piiic.html?rangeId=" + tagMap[$value.html()] + (dutyHtml ? ("&dutyId=" + tagMap[dutyHtml]) : "");
            })
        })
        $("#search-tap-duty div:not(.first)").each(function(index, value) {
            var $value = $(value);
            $value.click(function () {
                if($value.hasClass("search-tag-selected")) {
                    $value.removeClass("search-tag-selected");
                    return;
                }
                var rangeHtml = $("#search-tap-range div.search-tag-selected").html();
                window.location.href = "piiic.html?dutyId=" + tagMap[$value.html()] + (rangeHtml ? ("&rangeId=" + tagMap[rangeHtml]) : "");
            })
        })
    }

    function initHeight() {
        var listBodyHeight = window.innerHeight - 50;
        $("#list-body").css("height", listBodyHeight);
        $("#background-img").css("height", listBodyHeight);
        $("#list-piiic-list").css("height", listBodyHeight - 200);
    }


    // 搜索初始化
    function initTagSearch() {
        if(rangeId || dutyId) {
            if(rangeId) {
                codeMapRangeLock = true;
                piiicSendUrl(rangeId, "https://raw.githubusercontent.com/SearchBird/jsonUpload/master/searchJson/range-check.json", 0);
            }
            if(dutyId) {
                codeMapDutyLock = true;
                piiicSendUrl(dutyId, "https://raw.githubusercontent.com/SearchBird/jsonUpload/master/searchJson/duty-check.json", 0);
            }

        } else if(code) {
            $("#character-name").val(decodeURI(code));
            checkName(code);
        } else {

        }
    }

    function checkName(code) {
        piiicSendUrl(code, "https://raw.githubusercontent.com/SearchBird/jsonUpload/master/searchJson/en-check.json", 2)
    }

    function piiicSendUrl(str, jsonURL, type) {
        var request;
        if(window.XMLHttpRequest){
            request = new XMLHttpRequest();
        }else if(window.ActiveXObject){
            request = new window.ActiveXObject();
        }else{
            myAlert("浏览器版本不支持远程访问，请更换浏览器");
        }
        if(request !=null){
            request.open("GET",jsonURL,true);
            request.send(null);
            request.onreadystatechange=function(){
                if(request.readyState==4 && request.status==200){
                    var jsonObj = JSON.parse(request.responseText);
                    if(type === 0)
                        releaseLock(jsonObj, str);
                    else if(type === 1)
                        urlGetCell(jsonObj);
                    else if(type === 2)
                        getCodeEn(jsonObj, str);
                }
            };
        }
    }

    function getCodeEn(jsonObj, str) {
        code = jsonObj[decodeURI(str,"utf-8")];
        if(!code) {
            myAlert("该干员测评不存在");
            return;
        }
        piiicSendUrl(code, "https://raw.githubusercontent.com/SearchBird/jsonUpload/master/searchJson/cell-version-list.json", 0);
    }

    function releaseLock(jsonObj, str) {
        if(str.indexOf("duty") != -1) {
            dutyList = jsonObj[str];
            codeMapDutyLock = false;
        } else if(/^[0-9]*$/.test(str)){
            rangeList = jsonObj[str];
            codeMapRangeLock = false;
        } else { // 不然就是搜索干员名称，直接获取名称对应的列表
            fixMap(jsonObj[str]);
        }
        mergeMap();
    }

    function mergeMap() {
        if(!codeMapRangeLock && !codeMapDutyLock) {
            if(dutyList.length != 0) {
                fixMap(dutyList);
            }
            if(rangeList.length != 0) {
                fixMap(rangeList);
            }
            getAllCodeUrl(codeMap);
        }
    }

    function fixMap(codeList) {
        for(var index = codeList.length;index -- > 0;) {
            var codeName = codeList[index];
            codeMap[codeName] = codeName;
        }
    }

    // 根据请求的json内容逐个进行URL发送
    function getAllCodeUrl(codeMap) {
        for(var key in codeMap) {
            ++ mapLength;
        }
        for(var key in codeMap) {
            piiicSendUrl(undefined, "https://raw.githubusercontent.com/SearchBird/jsonUpload/master/characterCellListJson/" + key + ".json", 1);
        }
    }

    // 将请求的json缓存
    function urlGetCell(jsonObj) {
        ++ urlGetLength;
        cellJsonList.push(jsonObj);
        if(urlGetLength == mapLength) {
            appendCell(cellJsonList);
        }
    }

    // 拼接各自内容，并且绑定点击事件
    function appendCell(cellJsonList) {
        var cellInnerHtml = "";
        // 先进行排序
        cellJsonList = sortJsonList(cellJsonList);
        for(var index = cellJsonList.length;index -- > 0;) {
            var cellJson = cellJsonList[index];
            cellInnerHtml = cellInnerHtml
                + '<div class="cell" id="'
                + cellJson.CodeNameEnVer
                + '"><div class="cell-img"><img src="'
                + cellJson.CodeImg
                + '"></div><div class="cell-word"><div class="header"><div class="main-color"></div><div class="time">'
                + cellJson.commitDate
                + '</div></div><div class="name">'
                + cellJson.CodeNameCh
                + '</div><div class="type"><div class="duty"><div class="en">'
                + cellJson.CodeNameEn
                + '</div><div class="ch">'
                + cellJson.DutyCh
                + '</div></div><div class="logo"><img src="https://raw.githubusercontent.com/SearchBird/ImageIO/master/img/duty/'
                + cellJson.DutyEn.replace("duty-","")
                + '_back.png"></div></div><div class="footer"><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/7Q5EUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAACccAVoAAxslRxwBWgADGyVHHAFaAAMbJUccAVoAAxslRxwCAAACAAAAOEJJTQQlAAAAAAAQmomtXShtuiECyMupZwU/2zhCSU0EOgAAAAAA1wAAABAAAAABAAAAAAALcHJpbnRPdXRwdXQAAAAFAAAAAFBzdFNib29sAQAAAABJbnRlZW51bQAAAABJbnRlAAAAAEltZyAAAAAPcHJpbnRTaXh0ZWVuQml0Ym9vbAAAAAALcHJpbnRlck5hbWVURVhUAAAAAQAAAAAAD3ByaW50UHJvb2ZTZXR1cE9iamMAAAAFaCFoN4u+f24AAAAAAApwcm9vZlNldHVwAAAAAQAAAABCbHRuZW51bQAAAAxidWlsdGluUHJvb2YAAAAJcHJvb2ZDTVlLADhCSU0EOwAAAAACLQAAABAAAAABAAAAAAAScHJpbnRPdXRwdXRPcHRpb25zAAAAFwAAAABDcHRuYm9vbAAAAAAAQ2xicmJvb2wAAAAAAFJnc01ib29sAAAAAABDcm5DYm9vbAAAAAAAQ250Q2Jvb2wAAAAAAExibHNib29sAAAAAABOZ3R2Ym9vbAAAAAAARW1sRGJvb2wAAAAAAEludHJib29sAAAAAABCY2tnT2JqYwAAAAEAAAAAAABSR0JDAAAAAwAAAABSZCAgZG91YkBv4AAAAAAAAAAAAEdybiBkb3ViQG/gAAAAAAAAAAAAQmwgIGRvdWJAb+AAAAAAAAAAAABCcmRUVW50RiNSbHQAAAAAAAAAAAAAAABCbGQgVW50RiNSbHQAAAAAAAAAAAAAAABSc2x0VW50RiNQeGxAUgAAAAAAAAAAAAp2ZWN0b3JEYXRhYm9vbAEAAAAAUGdQc2VudW0AAAAAUGdQcwAAAABQZ1BDAAAAAExlZnRVbnRGI1JsdAAAAAAAAAAAAAAAAFRvcCBVbnRGI1JsdAAAAAAAAAAAAAAAAFNjbCBVbnRGI1ByY0BZAAAAAAAAAAAAEGNyb3BXaGVuUHJpbnRpbmdib29sAAAAAA5jcm9wUmVjdEJvdHRvbWxvbmcAAAAAAAAADGNyb3BSZWN0TGVmdGxvbmcAAAAAAAAADWNyb3BSZWN0UmlnaHRsb25nAAAAAAAAAAtjcm9wUmVjdFRvcGxvbmcAAAAAADhCSU0D7QAAAAAAEABIAAAAAQACAEgAAAABAAI4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0D8gAAAAAACgAA////////AAA4QklNBA0AAAAAAAQAAAC0OEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAABOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0EAAAAAAAAAgCjOEJJTQQCAAAAAAFOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADhCSU0EMAAAAAAApwEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB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AAwDAQACEQMRAD8AKktT7Nl/+Uv/AEMn/wBLJfZsv/yl/wChk/8ApZdL78f5Sx/9+8X92n3/AOZl/wDVblpKVoIteHM9IhxBr1G0z9D37n+z+WoqUMBFGlJJJJKUkkkkpSSSSSlJJJJKUkkkkpSSSSSlJJJJKf/Qv+n0v/uRf/2wz/3qS9Ppf/ci/wD7YZ/71Kqkun4T+/L/AJn/AHrxHHH/ADcftyf9+u8NDiGElknaSIJHaWy7b/nJkkk9jUkkkkpSSSSSlJJJJKUkkkkpSSSSSlJJJJKUkkkkp//Z/+ER/Wh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA2LTE5VDIwOjQzOjU4KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA4LTAzVDExOjA0OjEzKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wOC0wM1QxMTowNDoxMyswODowMCIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVGRjdGNzUxOUJCNUU5MTFCMTIxRjREMDUwM0ZENzFDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOmM4Nzk2YzllLWY5YWQtMWY0MS05YWFlLTY1Y2NjZGRmMzlhNiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmM4Nzk2YzllLWY5YWQtMWY0MS05YWFlLTY1Y2NjZGRmMzlhNiI+IDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDxyZGY6QmFnPiA8cmRmOmxpPjY0MjEwOEI0QUE4RTU1NDQzRThFREVERTYxRDRDOEM1PC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDo5Nzg2ZmVjMS1kNDgwLTYyNDItOGI3Yi1mMjQ0MjMxOGY0YzY8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjODc5NmM5ZS1mOWFkLTFmNDEtOWFhZS02NWNjY2RkZjM5YTYiIHN0RXZ0OndoZW49IjIwMTktMDYtMTlUMjA6NDM6NTgrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg4NzgxOGMwLWRkYjYtYmI0YS04ODRjLTJmNjA5Mjk3NzgwYSIgc3RFdnQ6d2hlbj0iMjAxOS0wNi0xOVQyMDo0NDoyNyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6RUVGN0Y3NTE5QkI1RTkxMUIxMjFGNEQwNTAzRkQ3MUMiIHN0RXZ0OndoZW49IjIwMTktMDgtMDNUMTE6MDQ6MTMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9qcGVnIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL2pwZWciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOkVGRjdGNzUxOUJCNUU5MTFCMTIxRjREMDUwM0ZENzFDIiBzdEV2dDp3aGVuPSIyMDE5LTA4LTAzVDExOjA0OjEzKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUVGN0Y3NTE5QkI1RTkxMUIxMjFGNEQwNTAzRkQ3MUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Yzg3OTZjOWUtZjlhZC0xZjQxLTlhYWUtNjVjY2NkZGYzOWE2IiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Yzg3OTZjOWUtZjlhZC0xZjQxLTlhYWUtNjVjY2NkZGYzOWE2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAeAIUDASIAAhEBAxEB/8QAGQABAQADAQAAAAAAAAAAAAAAAAECBAUD/8QAJhABAAEBBgUFAAAAAAAAAAAAAAECAwQREiHSEzFUVaJBYXGTlP/EABoBAQACAwEAAAAAAAAAAAAAAAADBAECBgf/xAAeEQEBAAEEAwEAAAAAAAAAAAAAAdERExShAlFS8P/aAAwDAQACEQMRAD8A9h0eBeOxeFruOBeOxeFrudXyfH9Zl57xb76uHPRlXExa1RVRkmKpiaNYyzjy11090WZdVWzS6IA2YAAAAAAAAAAAAbGS4dRb/np3mS49TePop3tcQ7V+r1hY3J8zvK1xTFUxRMzRjOEzGEzHx6ICRAANmAAAAAAAAAAAAH//2Q==">'
                + '<div class="author">'
                + cellJson.wordCode
                + '</div></div></div></div>';
        }
        $("#list-piiic-list").append(cellInnerHtml);
        initCellClick();
    }

    function sortJsonList(cellJsonList) {
        cellJsonList.sort(function(a,b){
            return parseInt(a.CodeNameEnVer.split("[")[1].replace("]")) - parseInt(b.CodeNameEnVer.split("[")[1].replace("]"));
        })
        return cellJsonList;
    }

    // 初始化格子点击事件
    function initCellClick() {
        var localUrl = window.location.href.split("?")[0];
        hrefStr = localUrl.substring(0, localUrl.lastIndexOf("\/")) + "/piiic-main.html?code=";
        $(".cell").click(function () {
            window.open(hrefStr + this.id);
        })
    }

    return {
        init : init
    }
}



