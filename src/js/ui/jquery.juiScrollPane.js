    /**
 * Makes a content area scrollable with custom
 * scrollbars whose elements are fetched or created depending on the
 * flags passed in/or not passed in by the user.
 *
 * @module $.jui.juiScrollPane
 * @requires jquery.mousewheel (for crossbrowser mousewheel functionality)
 * @requires jquery
 * @requires jquery.ui (jquery ui core)
 * @requires jquery.juiBase
 * @requires TweenMax
 * @returns jquery selection
 * @author ElyDeLaCruz
 * @created 09/28/2013
 */
$.widget('jui.juiScrollPane', $.jui.juiBase, {
    options: {
        ui: {
            contentHolder: {
                elm: null,
                selector: '.content',
                html: '<div></div>',
                attribs: {
                    'class': 'content'
                }
            },
            vertScrollbar: {
                elm: null,
                selector: '.vertical.scrollbar',
                html: '<div></div>',
                appendTo: 'this.element',
                attribs: {
                    'class': 'vertical scrollbar'
                },
                create: true
            },
            vertHandle: {
                elm: null,
                selector: '.handle',
                html: '<div></div>',
                appendTo: 'vertScrollbar',
                attribs: {
                    'class': 'handle'
                },
                create: true
            },
            horizScrollbar: {
                elm: null,
                selector: '.horizontal.scrollbar',
                html: '<div></div>',
                appendTo: 'this.element',
                attribs: {
                    'class': 'horizontal scrollbar'
                },
                create: true
            },
            horizHandle: {
                elm: null,
                selector: '.handle',
                html: '<div></div>',
                appendTo: 'horizScrollbar',
                attribs: {
                    'class': 'handle'
                },
                create: true
            }
        },

        scrollbarOriented: {
            VERTICALLY: 'vertical',
            HORIZONTALLY: 'horizontal'
        },

        autoHide: false,

        debug: false
    },

    _create: function () {
        this._populateUiElementsFromOptions();
        var ops = this.options,
            contentHolder = this.getUiElement('contentHolder'),
            contentScrollWidth = contentHolder.get(0).scrollWidth,
            contentScrollHeight = contentHolder.get(0).scrollHeight,
            handle = this.getUiElement('vertHandle'),
            plugin = this;

        // Conetnt Holder
        if (contentHolder.css('overflow') !== 'hidden') {
            contentHolder.css('overflow', 'hidden');
        }

        // Add plugin class
        plugin.element.addClass('jui-scroll-pane');

        // Determine whether we need a horizontal and/or vertical scrollbar.
        // Init vertical scrollbar
        if (contentScrollHeight > contentHolder.height()) {
            plugin.initScrollbar(ops.scrollbarOriented.VERTICALLY);
        }

        // Init horizontal scrollbar or hide it
        if (contentScrollWidth > contentHolder.width()) {
            plugin.initScrollbar(ops.scrollbarOriented.HORIZONTALLY);
        }
        else {
            this.getUiElement('horizScrollbar').css('display', 'none');
        }

        plugin.element.mousewheel(function (e, delta, deltaX, deltaY) {

            // Scroll this element individually
            e.stopPropagation();

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
            plugin.constrainHandle(ops.scrollbarOriented.VERTICALLY);
            plugin.constrainHandle(ops.scrollbarOriented.HORIZONTALLY);

            // Scroll content holder
            plugin.scrollContentHolder(ops.scrollbarOriented.VERTICALLY);
            plugin.scrollContentHolder(ops.scrollbarOriented.HORIZONTALLY);
        });

    },

    _scrollByOrientation: function (value, orientation) {
        var ops = this.options,
            contentHolder = this.getUiElement('contentHolder'),
            layout = orientation,
            vars = this.getScrollDirVars(layout),
            scrollTotal = vars.scrollAmountTotal,
            handle = this.getScrollbarHandleByOrientation(layout),
            scrollbar = this.getScrollbarByOrientation(layout),
            scrollPercent,
            dir = vars.cssCalcDir,
            dimProp = 'outer' + ucaseFirst(vars.scrollbarDimProp);

        // If not scrollable bail
        if (contentHolder[vars.scrollbarDimProp]() >= scrollTotal) {
            return;
        }

        if (value <= scrollTotal && value >= 0) {
            contentHolder.scrollTop(value);
            scrollPercent = value / scrollTotal;
            handle.css(dir, scrollbar[dimProp]() * scrollPercent);
        }
        else if (value > scrollTotal) {
            handle.css(dir, scrollbar[dimProp]() - handle[dimProp]());
        }
        else if (value < 0) {
            handle.css(dir, 0);
        }
        this.scrollContentHolder(layout);
        this.constrainHandle(layout);
    },

    scrollContentHolder: function (oriented) {
        // Calculate percent of scroll action
        var handle = this.getScrollbarHandleByOrientation(oriented),
            scrollbar = this.getScrollbarByOrientation(oriented),
            contentHolder = this.getUiElement('contentHolder'),

        // Scroll vars
            scrollVars = this.getScrollDirVars(oriented),
            scrollAmountTotal = scrollVars.scrollAmountTotal,
            dir = scrollVars.cssCalcDir,
            dimProp = scrollVars.scrollbarDimProp,

        // Math
            percentScroll = handle.position()[dir] / scrollbar[dimProp](),
            scrollPos = percentScroll * scrollAmountTotal,
            contentHolderScrollFunc = 'scroll' + ucaseFirst(dir);

        // Scroll only if limits haven't been reached
        if (scrollPos >= 0 && scrollPos <= scrollAmountTotal) {
            contentHolder[contentHolderScrollFunc]
                (percentScroll * scrollAmountTotal);
        }

        // Constrain scroll limits
        else if (scrollPos < 0) {
            contentHolder[contentHolderScrollFunc](0);
        }
        else if (scrollPos > scrollAmountTotal) {
            contentHolder[contentHolderScrollFunc]
                (scrollAmountTotal);
        }
    },

    constrainHandle: function (oriented) {
        var handle = this.getScrollbarHandleByOrientation(oriented),
            scrollbar = this.getScrollbarByOrientation(oriented),
            vars = this.getScrollDirVars(oriented),
            dimProp = vars.scrollbarDimProp,
            dir = vars.cssCalcDir;

        // Limit handle position within scroll bar
        if (handle.position()[dir] < 0) {
            handle.css(dir, 0);
        }
        else if (handle.position()[dir]
            + handle[dimProp]() > scrollbar[dimProp]()) {
            handle.css(dir, scrollbar[dimProp]() - handle[dimProp]());
        }
    },

    initScrollbar: function (oriented) {
        var scrollbar = this.getScrollbarByOrientation(oriented),
            handle = this.getScrollbarHandleByOrientation(oriented),
            contentHolder = this.getUiElement('contentHolder'),
            ops = this.options,
            plugin = this,

        // Resolve scrollbar direction variables
            scrollVars = plugin.getScrollDirVars(oriented),
            dragAxis = scrollVars.dragAxis,
            dir = scrollVars.cssCalcDir,
            dimProp = scrollVars.scrollbarDimProp;

        // Resize handle
        plugin.initScrollbarHandle(oriented);

        // Make draggable handle on scrollbar
        handle.draggable({
            containment: 'parent',
            cursor: 's-resize',
            axis: dragAxis,
            drag: function (e, ui) {
                var percentScroll =
                    ui.position[dir] / scrollbar[dimProp]();

                contentHolder['scroll' + ucaseFirst(dir)]
                    (percentScroll * scrollVars.scrollAmountTotal);

//                if (ops.debug) {
//                    console.log('top: ' +
//                        ui.position.top, 'left: ' + ui.position.left);
//                }
            }
        });

        // On Scroll bar click
        scrollbar.bind('click', function (e) {
            e.stopPropagation();
            handle.css(dir, e['offset' + dragAxis.toUpperCase()]
                - handle[dimProp]() / 2);

            plugin.constrainHandle(oriented);
            plugin.scrollContentHolder(oriented);
        });
    },

    initScrollbarHandle: function (oriented) {
        var contentHolder = this.getUiElement('contentHolder'),
            scrollBar = this.getScrollbarByOrientation(oriented),
            handle = this.getScrollbarHandleByOrientation(oriented),
            vars = this.getScrollDirVars(oriented),
            dimProp = vars.scrollbarDimProp,
            contentDimVal = contentHolder[dimProp](),
            scrollTotal = contentHolder.get(0)['scroll'
                + ucaseFirst(dimProp)],
            scrollbarDimVal = scrollBar[dimProp]();
        handle[dimProp]
            ((contentDimVal * scrollbarDimVal) / scrollTotal);
    },

    getScrollDirVars: function (oriented) {
        var plugin = this,
            ops = plugin.options,
            contentHolder = this.getUiElement('contentHolder'),
            retVal;

        // Resolve scrollbar direction variables
        if (oriented === plugin.options.scrollbarOriented.VERTICALLY) {
            retVal = {
                dragAxis: 'y',
                cssCalcDir: 'top',
                scrollbarDimProp: 'height',
                scrollAmountTotal: contentHolder.get(0).scrollHeight
            }
        }
        else {
            retVal = {
                dragAxis: 'x',
                cssCalcDir: 'left',
                scrollbarDimProp: 'width',
                scrollAmountTotal: contentHolder.get(0).scrollWidth
            }
        }

        return retVal;
    },

    getScrollbarByOrientation: function (oriented) {
        var ops = this.options;
        return oriented === ops.scrollbarOriented.VERTICALLY ?
            this.getUiElement('vertScrollbar') : this.getUiElement('horizScrollbar');
    },

    getScrollbarHandleByOrientation: function (oriented) {
        var ops = this.options;
        return oriented === ops.scrollbarOriented.VERTICALLY ?
            this.getUiElement('vertHandle') : this.getUiElement('horizHandle');
    },

    scrollVertically: function (value) {
        this._scrollByOrientation(value,
            this.options.scrollbarOriented.VERTICALLY);
    },

    scrollHorizontally: function (value) {
        this._scrollByOrientation(value,
            this.options.scrollbarOriented.HORIZONTALLY);
    }

});
