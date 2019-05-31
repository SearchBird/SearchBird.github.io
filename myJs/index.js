$(function() {
    onload();

});

function onload(){
    imgOnload();
    differenceOnload();
}

function imgOnload() {
    $img = $("img");

    $img.lazyload({
        effect : "fadeIn"
    });
}

function differenceOnload(){
    $(".difference").each(function(index, value) {
        var $difference = $(value);
        $difference.css("background-color", new reversalColor($difference.css("background-color")).parse());
    })
}



