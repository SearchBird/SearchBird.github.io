/**
 * 反色对象
 * @param colorStr
 */
function reversalColor(colorStr){
    var sixNumReg = /^#(\d{2})(\d{2})(\d{2})$/ig;
    var threeNumReg = /^#(\d{1})(\d{1})(\d{1})$/ig;
    var rgbReg = /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/ig;
    var c1=0, c2=0, c3=0;
    var parseHexToInt = function(hex){
        return parseInt(hex,16);
    };
    var parseIntToHex = function(int){
        return int.toString(16);
    };

    // 反色函数
    this.parse = function(){
        if(sixNumReg.test(colorStr)){
            sixNumReg.exec(colorStr);
            c1 = parseHexToInt(RegExp.$1);
            c2 = parseHexToInt(RegExp.$2);
            c3 = parseHexToInt(RegExp.$3);
        } else if(threeNumReg.test(colorStr)){
            threeNumReg.exec(colorStr);
            c1 = parseHexToInt(RegExp.$1+RegExp.$1);
            c2 = parseHexToInt(RegExp.$2+RegExp.$2);
            c3 = parseHexToInt(RegExp.$3+RegExp.$3);
        } else if(rgbReg.test(colorStr)){
            //rgb color 直接就是十进制，不用转换
            rgbReg.exec(colorStr);
            c1 = RegExp.$1;
            c2 = RegExp.$2;
            c3 = RegExp.$3;
        } else {
            throw new Error("Error color string format. eg.[rgb(0,0,0),#000000,#f00]");
        }
        c1 = parseIntToHex(255 - c1);
        c2 = parseIntToHex(255 - c2);
        c3 = parseIntToHex(255 - c3);
        return '#' + (c1<10?'0'+c1:c1) + (c2<10?'0'+c2:c2) + (c3<10?'0'+c3:c3);
    };
}