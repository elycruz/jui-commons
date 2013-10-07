/**
 * Created by ElyDeLaCruz on 9/28/13.
 */
/**
 * jquery.jui.scrollPane.js
 * Makes a content area scrollable with a custom scrollbar who's element is fetched
 * or created depending on the flags passed in by the user.
 * ** Note **
 * Positioning styling and markup for the scrollbar, content holder,
 * and container element are all up to the user.
 * ** --------------------------------------------------------------------- **
 * @requires jquery.mousewheel (for crossbrowser mousewheel functionality)
 * @returns jquery selection
 */
$.widget('jui.juiScrollPane', $.jui.juiBase, {
    options: {
        // [vertical, horizontal, all]
        orientation: 'vertical',
        ui: {
            contentHolder: {
                elm: null,
                selector: '.content',
                html: '<div></div>',
                attribs: {
                    'class': 'content'
                }
            },
            scrollbar: {
                elm: null,
                selector: '.scrollbar',
                html: '<div></div>',
                appendTo: 'this.element',
                attribs: {
                    'class': 'scrollbar'
                },
                create: true
            },
            handle: {
                elm: null,
                selector: '.handle',
                html: '<div></div>',
                appendTo: 'scrollbar',
                attribs: {
                    'class': 'handle'
                },
                create: true
            }
        },

        scrollableDist: 0,
        debug: false
    },
    _create: function () {
        this._populateUiElementsFromOptions();
        var ops = this.options,
            elm = this.element,
            scrollbar = this.ui.scrollbar,
            contentHolder = this.ui.contentHolder,
            contentScrollHeight = contentHolder.get(0).scrollHeight,
            handle = this.ui.handle,
            plugin = this;

        // Conetnt Holder
        if (contentHolder.css('overflow') !== 'hidden') {
            contentHolder.css('overflow', 'hidden');
        }

        // Add plugin class
        plugin.element.addClass('jui-scrollpane');

        // Get scrollable distance
        ops.scrollableDist = scrollbar.height();

        // Init scrollbar
        plugin.initScrollbar();

//        plugin.element.mousewheel(function (e, delta, deltaX, deltaY) {
//            delta = delta !== undefined || delta !== null ? delta : deltaY;
//
//            // If no delta bail
//            if (delta === null || delta === undefined) {
//                return;
//            }
//
//            // Prelims
//            var incrementer = delta < 1 ? 10 : -10,
//                scrollTo = contentHolder.scrollTop() + incrementer,
//                handleOffsetTop = handle.position().top + incrementer;
//
//            // Position Handle
//            handle.css('top', handleOffsetTop);
//
//            // Constrain Handle
//            plugin.constrainHandle();
//
//            // Scroll content holder
//            plugin.scrollContentHolder();
//        });

    },

    scrollContentHolder: function () {
        // Calculate percent of scroll action
        var handle = this.ui.handle,
            contentHolder = this.ui.contentHolder,
            contentScrollHeight = contentHolder.get(0).scrollHeight,
            percentScroll = handle.position().top / this.options.scrollableDist,
            scrollTopPos = percentScroll * contentScrollHeight;

        // Scroll only if limits haven't been reached
        if (scrollTopPos >= 0 && scrollTopPos <= contentScrollHeight) {
            contentHolder.scrollTop(percentScroll * contentScrollHeight);
        }
        else if (scrollTopPos < 0) {
            contentHolder.scrollTop(0);
        }
        else if (scrollTopPos > contentScrollHeight) {
            contentHolder.scrollTop(contentScrollHeight);
        }
    },

    constrainHandle: function () {
        var handle = this.ui.handle,
            scrollbar = this.ui.scrollbar;

        // Limit handle position within scroll bar
        if (handle.position().top < 0) {
            handle.css('top', 0);
        }
        else if (handle.position().top + handle.height() > scrollbar.height()) {
            handle.css('top', scrollbar.height() - handle.height());
        }
    },

    initScrollbar: function () {
        var scrollbar = this.ui.scrollbar,
            handle = this.ui.handle,
            contentHolder = this.ui.contentHolder,
            contentScrollHeight = contentHolder.get(0).scrollHeight,
            ops = this.options,
            plugin = this;

        // Resize handle
        plugin.initScrollbarHandle();

        // Make draggable handle on scrollbar
        handle.draggable({
            containment: 'parent',
            cursor: 's-resize',
            axis: 'y',
            drag: function (e, ui) {
                var percentScroll = ui.position.top / ops.scrollableDist;
                contentHolder.scrollTop(percentScroll * contentScrollHeight);
                if (ops.debug) {
                    console.log('top: ' +
                        ui.position.top, 'left: ' + ui.position.left);
                }
            }
        });

        // On Scroll bar click
        scrollbar.bind('click', function (e) {
            handle.css({top: e.offsetY - handle.height() / 2});
            plugin.constrainHandle();
            plugin.scrollContentHolder();
        });
    },

    initScrollbarHandle: function () {
        var contentHolder = this.ui.contentHolder,
            scrollBar = this.ui.scrollbar,
            handle = this.ui.handle,
            sph = contentHolder.height(),
            sh = contentHolder.get(0).scrollHeight,
            sbh = scrollBar.height();
        handle.height((sph * sbh) / sh);
    }

});
