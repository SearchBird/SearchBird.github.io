$(".piiic-toolist-btn-move-left").each(function(index, value) {
    $(value).animate({left:"55px"}, 800);
})
$(".piiic-toolist-btn-move-right").each(function(index, value) {
    $(value).animate({right:"107px"}, 800);
})
$(".toolist-btn-middle").each(function(index, value) {
    $(value).animate({width:"10px",left:"101px"}, 800,
        function(){
        // 另外已经在css定好旋转中心，不能在这里定义，否则会和动画一起播放
            $(".piiic-toolist-btn-move-right").each(function(index, value) {
                $(value).css({
                    'transition': 'all 1s',
                    '-webkit-transition': 'all 1s',
                    '-moz-transition': 'all 1s',
                    '-ms-transition': 'all 1s',
                    '-o-transition': 'all 1s',
                    "transform": "rotate(90deg)",
                    "-moz-transform": "rotate(90deg)",
                    "-webkit-transform": "rotate(90deg)",
                    "-ms-transform": "rotate(90deg)",
                    "-o-transform": "rotate(90deg)",
                })
             });
            $(".piiic-toolist-btn-move-left").each(function(index, value) {
                $(value).css({
                    'transition': 'all 1s',
                    '-webkit-transition': 'all 1s',
                    '-moz-transition': 'all 1s',
                    '-ms-transition': 'all 1s',
                    '-o-transition': 'all 1s',
                    "transform": "rotate(-90deg)",
                    "-moz-transform": "rotate(-90deg)",
                    "-webkit-transform": "rotate(-90deg)",
                    "-ms-transform": "rotate(-90deg)",
                    "-o-transform": "rotate(-90deg)",
                })
            });
            $(".piiic-toolist-btn-function").each(function(index, value){
                $(value).animate({opacity:"1"}, 800);
            })
         }

    );
})