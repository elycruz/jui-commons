/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 12:24 AM
 * To change this template use File | Settings | File Templates.
 */
$(function () {
    var slideShow = $('.creative-slide-show'),
        offset = 0,
        items = $('.item', slideShow),
        itemWidth = items.eq(0).width();

    items.each(function (i) {
        var item = $(this),
            position =  itemWidth * i;
        item.css({left: position + offset});
        if (offset === 0) {
            offset = item.width() > itemWidth ? item.width() : 0;
        }
    });

//    slideShow.accordianSlideShow();

});