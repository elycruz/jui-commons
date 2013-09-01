/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 12:24 AM
 * To change this template use File | Settings | File Templates.
 */
$(function () {
    var slideShow = $('.creative-slide-show'),
        prevItem = null,
        offset = 0;
//    $('.item', slideShow).each(function (i) {
//        var item = $(this), position = item.width() * i;
//        if (prevItem !== null) {
//            offset = prevItem.width() > item.width() ? prevItem.width() : 0;
//        }
//        item.css({left: item.width() * i + offset});
//        prevItem = item;
//    });

    slideShow.paginatorWithTextField();

});