// 2019-09-20-修改颜色明暗函数
function LightenDarkenColor(col, amt) {
    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

// 2019-09-21-点击二维码放大或者直接解析二维码
$(function () {
    $(".QR").click(function () {

        qrcode.decode("../img/test.png");
        qrcode.callback = function (imgMsg) {
            alert("内容：" + utf82str(imgMsg));
            window.open(imgMsg);
        }

        // 放大
        /*var appendDiv = document.createElement("div");
        document.body.appendChild(appendDiv);
        importHtml("QR.html", false, function (res) {
            $(appendDiv).html($(res));
        })*/
    })
})
// 用于转字符集
function utf82str(utf)
{
    var str = "";
    var tmp;

    for(var i = 0; i < utf.length; i++)
    {
        // 英文字符集合
        if(utf.charCodeAt(i) >> 7 == 0x00)
        {
            str += utf.charAt(i);
            continue;
        }
        // 其他字符集
        else if(utf.charCodeAt(i) >> 5 == 0x06)
        {
            tmp = ((utf.charCodeAt(i + 0) & 0x1f) << 6) |
                ((utf.charCodeAt(i + 1) & 0x3f) << 0);
            str += String.fromCharCode(tmp);
            i++;
            continue;
        }
        // 中文字符集
        else if(utf.charCodeAt(i) >> 4 == 0x0e)
        {
            tmp = ((utf.charCodeAt(i + 0) & 0x0f) << 12) |
                ((utf.charCodeAt(i + 1) & 0x3f) <<  6) |
                ((utf.charCodeAt(i + 2) & 0x3f) <<  0);
            str += String.fromCharCode(tmp);
            i += 2;
            continue;
        }
        // 其他字符集
        else if(utf.charCodeAt(i) >> 3 == 0x1f)
        {
            tmp = ((utf.charCodeAt(i + 0) & 0x07) << 18) |
                ((utf.charCodeAt(i + 1) & 0x3f) << 12) |
                ((utf.charCodeAt(i + 2) & 0x3f) <<  6);
            ((utf.charCodeAt(i + 3) & 0x3f) <<  0);
            str += String.fromCharCode(tmp);
            i += 3;
            continue;
        }
        // 非法字符集
        else
        {
            throw "不是UTF-8字符集"
        }
    }

    return str;
}
