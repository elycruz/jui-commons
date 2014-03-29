/**
 * Created by edelacruz on 11/19/13.
 */
$.widget('jui.juiAffix', $.jui.juiBase, {
    options: {
        className: 'jui-affix',
        scrollableElm: $(window),
        affixVertically: true,
        affixHorizontally: false,
        offset: {
            top: null,
            right: null,
            bottom: null,
            left: null
        },
        realtime: false,
        _isPositionFixedSupported: false
    },
    _create: function () {

        var self = this,
            ops = self.options,
            elm = self.element,
            affixVertically = ops.affixVertically,
            affixHorizontally = ops.affixHorizontally,

        // @todo put the t r b l into an offset object
            original = {
                position: elm.css('position'),
                top: elm.offset().top,
                right: elm.css('right'),
                bottom: elm.css('bottom'),
                left: elm.offset().left
            },
            scrollableElm = ops.scrollableElm,
            affixOffset;

        // If not realtime option calculations
        if (!ops.realtime) {
            affixOffset = self._getUserDefinedOffset();
        }

        // Add plugin class
        elm.addClass(ops.className);

        // On scrollable elm scroll
        scrollableElm.bind('scroll resize orientationchange load', function (e) {
            var oElm = $(this),
                scrollTop = oElm.scrollTop(),
                scrollLeft = oElm.scrollLeft(),
                affixBottom = isset(affixOffset.bottom) ? affixOffset.bottom : 0,
                affixRight = isset(affixOffset.right) ? affixOffset.right : 0,
                bottomLimit = scrollableElm.height() - affixBottom - elm.outerHeight(),
                rightLimit = scrollableElm.width() - affixRight;

            // If realtime option calcs
            if (ops.realtime) {
                affixOffset = self._getUserDefinedOffset();
            }

            if (affixVertically) {
                if (isset(affixOffset.top)) {
                    if (scrollTop > original.top + affixOffset.top &&
                        elm.offset().top + elm.outerHeight() - scrollTop + affixOffset.top < bottomLimit) {
                        elm.css({
                            position: 'fixed',
                            top: affixOffset.top,
                            bottom: 'auto'
                        });
                    }
                    else if (scrollTop <= original.top) {
                        elm.css('position', original.position);
                        elm.css('top', original.top);
                        elm.css('bottom', 'auto');
                    }
                }


                if (isset(affixOffset.bottom)) {
                    if (original.top - bottomLimit <= scrollTop) {
                        elm.css({
                            position: original.position,
                            top: original.top,
                            bottom: original.bottom
                        });
                    }
                    else {
                        elm.css({
                            position: 'fixed',
                            top: 'auto',
                            bottom: affixOffset.bottom
                        });
                    }
                }

            }

//            if (affixHorizontally) {
//                if (scrollLeft > original.left - affixOffset.left &&
//                    elm.offset().left - scrollLeft < rightLimit) {
//                    elm.css({
//                        position: 'fixed',
//                        left: affixOffset.left,
//                        right: 'auto'
//                    });
//                }
//                else if (scrollLeft <= original.left) {
//                    elm.css('position', original.position);
//                    elm.css('left', original.left);
//                    elm.css('right', 'auto');
//                }
//
//                if (original.left - scrollLeft >= rightLimit) {
//                    elm.css({
//                        position: 'fixed',
//                        left: 'auto',
//                        right: -affixOffset.right
//                    });
//                }
//            }
        });

        scrollableElm.scroll();
    },

    _getUserDefinedOffset: function () {
        var self = this,
            ops = self.options,
            offsets = self.getValueFromOptions('offset');
        $.each(['top', 'right', 'bottom', 'left'], function (index, key) {
            if (!isset(offsets[key])) {
                ops.offset[key] = self.element.attr('data-offset-' + offsets[key]) || null;
            }
        });
        return offsets;
    }

});