/**
 * Makes a content area scrollable with custom
 * scrollbars whose elements are fetched or created depending on the
 * flags passed in/or-not-passed in by the user.
 *
 * @module $.jui.juiScrollPane
 *
 * @requires jquery.mousewheel (for crossbrowser mousewheel functionality)
 * @requires jquery
 * @requires jquery.ui (jquery ui core)
 * @requires jquery.ui.widget
 * @requires jquery.juiBase
 * @requires TweenMax
 * @returns jquery selection
 *
 * @author ElyDeLaCruz
 * @created 09/28/2013
 * @todo move event listeners out of the create function (for consistency)
 * @todo use the listeners added to window and contentHolder in the unbind function (to ensure we don't remove anyone elses listeners)
 * @todo solve browser scrollbar mimicking
 */
$.widget('jui.juiScrollPane', $.jui.juiBase, {
    /**
     * Options Hash.
     * @type {Object}
     */
    options: {

        scrollSpeed: function () {
            var retVal = 0;
            retVal = this.getUiElement('contentHolder').height() / 3 / 3 * 2;
            return sjl.classOfIs(retVal, 'Number') ? retVal : 0;
        },

        // Left, up, right, down arrow keys and their direction values
        // to multiply the scrollspeed by
        keyPressHash: {
            '37': -1,
            '38': -1,
            '39': 1,
            '40': 1
        },

        // Continue scroll outer element after content holder has
        // reached it's scroll end (either directions)
        mimickBrowser: false,

        ui: {
            contentHolder: {
                elm: null,
                selector: '>.content',
                html: '<div></div>',
                attribs: {
                    'class': 'content'
                }
            },
            vertScrollbar: {
                elm: null,
                selector: '> .vertical.scrollbar',
                html: '<div></div>',
                appendTo: 'this.element',
                attribs: {
                    'class': 'vertical scrollbar'
                },
                create: true
            },
            vertHandle: {
                elm: null,
                selector: '> .handle',
                html: '<div></div>',
                appendTo: 'vertScrollbar',
                attribs: {
                    'class': 'handle'
                },
                create: true
            },
            horizScrollbar: {
                elm: null,
                selector: '> .horizontal.scrollbar',
                html: '<div></div>',
                appendTo: 'this.element',
                attribs: {
                    'class': 'horizontal scrollbar'
                },
                create: true
            },
            horizHandle: {
                elm: null,
                selector: '> .handle',
                html: '<div></div>',
                appendTo: 'horizScrollbar',
                attribs: {
                    'class': 'handle'
                },
                create: true
            }
        },

        pluginClassName: 'jui-scroll-pane',

        scrollbarOriented: {
            VERTICALLY: 'vertical',
            HORIZONTALLY: 'horizontal'
        },

        autoHide: false,

        originalOverflow: null,

        debug: false
    },

    _create: function () {
        this._populateUiElementsFromOptions();
        var ops = this.options,
            contentHolder = this.getUiElement('contentHolder'),
            self = this;

        // Conetnt Holder
        if (contentHolder.css('overflow') !== 'hidden') {
            ops.originalOverflow = contentHolder.css('overflow');
            contentHolder.css('overflow', 'hidden');
        }

        // Add plugin class
        self.element.addClass(ops.pluginClassName);

        // Determine whether we need a horizontal and/or vertical scrollbar.
        self.initScrollbars();

        // ----------------------------------------------------------
        // Move to an add event listener function (for consistency)
        // ----------------------------------------------------------
        // Bind mousewheel event
        contentHolder.bind('mousewheel', function (e, delta, deltaX, deltaY) {
//            console.log('delta: ', delta, 'x: ', deltaX, 'y: ', deltaY);

            var mimickBrowser = self.getValueFromOptions('mimickBrowser'),
                scrollSpeed, incrementer;

            // If not mimick browser scrollbars stop propagation and
            // prevent default behaviour
            if (!mimickBrowser) {
                // Scroll this element individually
                e.preventDefault();

                // Stop propagation for nested scroll panes
                e.stopPropagation();
            }

            delta = sjl.isset(delta) ? delta :
                (sjl.isset(deltaX)? deltaX : deltaY);

            // Prelims
            scrollSpeed = self.getValueFromOptions('scrollSpeed');
            incrementer = delta < 1 ?  scrollSpeed : -scrollSpeed;

            // Scroll horizontally
            if (deltaX !== 0 && deltaY === 0) {
                self.scrollHorizontally(contentHolder.scrollLeft() + incrementer);
                if (mimickBrowser
                    && contentHolder.scrollLeft() !== 0
                    && contentHolder.scrollLeft() !== contentHolder.get(0).scrollWidth) {
                    // Scroll this element individually
                    e.preventDefault();

                    // Stop propagation for nested scroll panes
                    e.stopPropagation();
                }
            }
            // Assume vertical scrolling action
            else if (deltaX === 0 && deltaY !== 0) {
                self.scrollVertically(contentHolder.scrollTop() + incrementer);
                if (mimickBrowser
                    &&contentHolder.scrollTop() !== 0
                    && contentHolder.scrollTop() !== contentHolder.get(0).scrollHeight - 1) {
                    // Scroll this element individually
                    e.preventDefault();
                    // Stop propagation for nested scroll panes
                    e.stopPropagation();
                }
            }
        });

        // Get mouse position tracker
        ops.mousePos = $(window).juiMouse();

        // Listen for arrow keys
        $(window).bind('keydown', function (e) {

            var incrementer,
                keyCode = e.keyCode + '';

            // If not arrow key pressed
            if (!ops.keyPressHash.hasOwnProperty(keyCode)) {
                return;
            }

            // If mouse not within scrollpane elm, bail
            if (!ops.mousePos.juiMouse('hitTest', contentHolder)) {
                return;
            }

            // Set focus on scrollpane
            contentHolder.focus();

            // Stop outer elemnt from scrolling
            e.preventDefault();

            incrementer = self.getValueFromOptions('scrollSpeed') *
                ops.keyPressHash[keyCode];

            // Get mouse position
            switch (keyCode) {
                // Left
                case '37':
                    self.scrollHorizontally(incrementer + contentHolder.scrollLeft());
                    break;
                case '38':
                    self.scrollVertically(incrementer + contentHolder.scrollTop());
                    break;
                case '39':
                    self.scrollHorizontally(incrementer + contentHolder.scrollLeft());
                    break;
                case '40':
                    self.scrollVertically(incrementer + contentHolder.scrollTop());
                break;
            }
        });
        // ----------------------------------------------------------
        // End of move to add event listener function
        // ----------------------------------------------------------
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
            dimProp = 'outer' + sjl.ucaseFirst(vars.scrollbarDimProp);

        // If not scrollable bail
        if (contentHolder[vars.scrollbarDimProp]() >= scrollTotal) {
            return;
        }

        if (value <= scrollTotal && value >= 0) {
            contentHolder['scroll' + sjl.ucaseFirst(dir)](value);
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
            contentHolderScrollFunc = 'scroll' + sjl.ucaseFirst(dir);

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

    initScrollbars: function () {
        var self = this,
            ops = self.options,
            contentHolder = self.getUiElement('contentHolder'),
            contentScrollWidth = contentHolder.get(0).scrollWidth,
            contentScrollHeight = contentHolder.get(0).scrollHeight;

        // Init vertical scrollbar
        if (contentScrollHeight > contentHolder.height()) {
            self.initScrollbar(ops.scrollbarOriented.VERTICALLY);
        }
        else {
            self.getUiElement('vertScrollbar').css('display', 'none');
        }

        // Init horizontal scrollbar or hide it
        if (contentScrollWidth > contentHolder.width()) {
            self.initScrollbar(ops.scrollbarOriented.HORIZONTALLY);
        }
        else {
            self.getUiElement('horizScrollbar').css('display', 'none');
        }
    },

    initScrollbar: function (oriented) {
        var self = this,
            scrollbar = self.getScrollbarByOrientation(oriented),
            handle = self.getScrollbarHandleByOrientation(oriented),
            contentHolder = self.getUiElement('contentHolder'),
            plugin = self,

        // Resolve scrollbar direction variables
            scrollVars = plugin.getScrollDirVars(oriented),
            dragAxis = scrollVars.dragAxis,
            dir = scrollVars.cssCalcDir,
            dimProp = scrollVars.scrollbarDimProp;

        // Resize handle
        plugin.initScrollbarHandle(oriented);

        // Make draggable handle on scrollbar
        handle = handle.draggable({
            containment: 'parent',
            cursor: 's-resize',
            axis: dragAxis,
            drag: function (e, ui) {
                var percentScroll =
                    ui.position[dir] / scrollbar[dimProp]();

                contentHolder['scroll' + sjl.ucaseFirst(dir)]
                    (percentScroll * scrollVars.scrollAmountTotal);
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

        // Save the draggable handle for later (for calling destroy on it for reinitialization
        self.saveDraggableHandleForLater(handle, oriented);
    },

    initScrollbarHandle: function (oriented) {
        var contentHolder = this.getUiElement('contentHolder'),
            scrollBar = this.getScrollbarByOrientation(oriented),
            handle = this.getScrollbarHandleByOrientation(oriented),
            vars = this.getScrollDirVars(oriented),
            dimProp = vars.scrollbarDimProp,
            contentDimVal = contentHolder[dimProp](),
            scrollTotal = contentHolder.get(0)['scroll'
                + sjl.ucaseFirst(dimProp)],
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
    },

    saveDraggableHandleForLater: function (handle, oriented) {
        var self = this,
            ops = self.options;
        if (oriented === ops.scrollbarOriented.VERTICALLY) {
            ops.draggableVertHandle = handle;
        }
        else {
            ops.draggableHorizHandle = handle;
        }
    },

    refresh: function () {
        var self = this,
            ops = self.options,
            vertHandle = ops.draggableVertHandle,
            horizHandle = ops.draggableHorizHandle;

        // Destroy draggable on handle
        if (!sjl.empty(vertHandle) && vertHandle instanceof $) {
            vertHandle.draggable('destroy');
        }

        // Destroy draggable on handle
        if (!sjl.empty(horizHandle) && horizHandle instanceof $) {
            horizHandle.draggable('destroy');
        }

        // Re-initialize scrollbars (recalc heights, widths,
        // and make draggable and constrainable etc.
        self.initScrollbars();
    },

    _destroy: function () {
        var self = this,
            ops = self.options;

        // Undo original element manipulations
        self.element.attr('overflow', ops.originalOverflow);

        // Unbind keydown event
        $(window).unbind('keydown');

        // Remove created elements
        self._removeCreatedElements();

        // Remove plugin class name
        self.element.removeClass(ops.pluginClassName);

        // Unbind mousewheel event and scroll (left, right) to position 0
        self.getUiElement('contentHolder').unbind('mousewheel')
            .scrollLeft(0).scrollTop(0);

        // Call jquery.ui.widget's _destroy method
        this._super();
    }

});
