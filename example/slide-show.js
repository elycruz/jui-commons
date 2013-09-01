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
        itemsContainer = $('>.items', slideShow),
        items = $('.item', itemsContainer),
        itemWidth = items.eq(0).width() + 6; // + items.eq(0).css('border-width').match(/\d+/)[0] * 2;

    items.each(function (i) {
        var item = $(this),
            tl = new TimelineLite();

        item.data('timeline', tl);
        item
            .mouseup(function (e) {
                var target = $(this);
                if (!target.hasClass('selected')) {
                    tl.to(target, 0.16, {scaleX: 1.1, scaleY: 1.1});
                }
                else {
                    tl.to(target, 0.16, {scaleX: 1, scaleY: 1});
                }
            })
            .mouseover(function (e) {
                var target = $(this);
                if (!target.hasClass('selected')) {
                    tl.to(target, 0.3, {css: {scaleX: 1.1, scaleY: 1.1, boxShadow: '3px 3px 20px #000'}});
                }
            })
            .mousedown(function (e) {
                var target = $(this);
                if (!target.hasClass('selected')) {
                    tl.to(target, 0.16, {scaleX: 0.9, scaleY: 0.9});
                }
                items.removeClass('selected');
                target.toggleClass('selected');
            })
            .mouseout(function (e) {
                var target = $(this);
                tl.to(target, 0.16,
                     {css: {scaleX: 1, scaleY: 1, boxShadow: 'none'}});
            });

        $('> header > button.close-btn', item).click(function   (e) {
            items.removeClass('selected');
        });
    });

    // Resize items container
    // @todo offset width based on number of items on screen


    itemsContainer.width((items.length + 10) * itemWidth);

    // Accordian Slide Show
    slideShow.accordianSlideShow({
        items: {
            animation: {
                from: function (item, i) {
                    var width = 3 * 2 + item.width();
                    return {
                        duration: 0.0538,
                        options: {
                            opacity: 0,
//                            rotationX: 45 * (i % 2 ? -1 : 1),
                            left: width
                        },
                        easing: null
                    };
                }
            }
        }
    });

});