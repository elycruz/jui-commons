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
$.widget('jui.juiScrollPane', {
    options: {
        // [vertical, horizontal, all]
        orientation: 'vertical',
        handle: {
            elm: null,
            selector: '.ui-scrollbar > .ui-handle',
            html: '<div class="ui-handle"></div>',
            appendToConfigSection: 'scrollbar',
            attribs: {
                'class': 'ui-handle'
            },
            create: true
        },
        scrollbar: {
            elm: null,
            selector: '.ui-scrollbar',
            html: '<div class="ui-scrollbar"></div>',
            attribs: {
                'class': 'ui-scrollbar'
            },
            create: true
        },
        contentHolder: {
            elm: null,
            selector: '.content',
            html: '<div class="content"></div>',
            attribs: {
                'class': 'content'
            }
        },
        scrollableDist: 0,
        debug: false
    },
    _create: function () {
        var ops = this.options,
            elm = this.element,
            scrollbar = this.getScrollbar(),
            contentHolder = this.getContentHolder(),
            contentScrollHeight = contentHolder.get(0).scrollHeight,
            handle = this.getScrollbarHandle(),
            plugin = this;

        // Conetnt Holder
        if (contentHolder.css('overflow') !== 'hidden') {
            contentHolder.css('overflow', 'hidden');
        }

        // Get scrollable distance
        ops.scrollableDist = scrollbar.height();

        // Init scrollbar
        plugin.initScrollbar();

        plugin.element.mousewheel(function (e, delta, deltaX, deltaY) {
            delta = delta !== undefined || delta !== null ? delta : deltaY;

            // If no delta bail
            if (delta === null || delta === undefined) {
                return;
            }

            // Prelims
            var incrementer = delta < 1 ? 10 : -10,
                scrollTo = contentHolder.scrollTop() + incrementer,
                handleOffsetTop = handle.position().top + incrementer;

            // Position Handle
            handle.css('top', handleOffsetTop);

            // Constrain Handle
            plugin.constrainHandle();

            // Scroll content holder
            plugin.scrollContentHolder();
        });

    },

    scrollContentHolder: function () {
        // Calculate percent of scroll action
        var handle = this.getScrollbarHandle(),
            contentHolder = this.getContentHolder(),
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
        var handle = this.getScrollbarHandle(),
            scrollbar = this.getScrollbar();

        // Limit handle position within scroll bar
        if (handle.position().top < 0) {
            handle.css('top', 0);
        }
        else if (handle.position().top + handle.height() > scrollbar.height()) {
            handle.css('top', scrollbar.height() - handle.height());
        }
    },

    initScrollbar: function () {
        var scrollbar = this.getScrollbar(),
            handle = this.getScrollbarHandle(),
            contentHolder = this.getContentHolder(),
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
        var contentHolder = this.getContentHolder(),
            scrollBar = this.getScrollbar(),
            handle = this.getScrollbarHandle(),
            sph = contentHolder.height(),
            sh = contentHolder.get(0).scrollHeight,
            sbh = scrollBar.height();
        handle.height((sph * sbh) / sh);
    },

    getContentHolder: function () {
        return this._getInternalElement(this.options.contentHolder);
    },
    getScrollbar: function () {
        return this._getInternalElement(this.options.scrollbar);
    },
    getScrollbarHandle: function () {
        return this._getInternalElement(this.options.handle);
    }
});
