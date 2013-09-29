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
        itemsContainer = $('> .items-container > .items', slideShow),
        items = $('.item', itemsContainer),
        itemWidth = items.eq(0).width() + 4;

    items.each(function (i) {
        var item = $(this),
            tl = new TimelineLite();

        // Add data index to element
        item.attr('data-index', i);

        // Mouse events
        item.mouseup(function (e) {
                var target = $(this);
                if (!target.hasClass('selected')) {
                    tl.to(target, 0.16, {scaleX: 1.038, scaleY: 1.038});
                }
                else {
                    tl.to(target, 0.16, {scaleX: 1, scaleY: 1});
                }
                target.addClass('selected');
            })
            .mouseenter(function (e) {
                var target = $(this);
                if (!target.hasClass('selected')) {
                    tl.to(target, 0.3,
                        {css: {
                            scaleX: 1.02, scaleY: 1.02,
                            boxShadow: '3px 3px 20px #000'}});
                }
            })
            .mousedown(function (e) {
                var target = $(this);
                if (!target.hasClass('selected')) {
                    tl.to(target, 0.16, {scaleX: 0.9, scaleY: 0.9});
                }
            })
            .mouseleave(function (e) {
                var target = $(this);
                tl.to(target, 0.16,
                     {css: {scaleX: 1, scaleY: 1, boxShadow: 'none'}});
            });

        // On Close Button
        $('> header > button.close-btn', item).click(function   (e) {
            e.stopPropagation();
            items.removeClass('selected');
            slideShow.accordianSlideShow('option', 'items.item.isSelected', false);
        });

    });
    // items . each

    // Accordian Slide Show
    slideShow.accordianSlideShow({
        items: { selector: '.items-container > .items > .item'}
    });

});