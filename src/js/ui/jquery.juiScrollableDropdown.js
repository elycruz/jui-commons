/**
 * Created by ElyDeLaCruz on 10/1/13.
 * A scrollable drop down.
 *
 * @module $.jui.juiScrollableDropdown
 *
 * @requires es5-shim
 * @requires es5-sham
 * @requires phpjs-shim
 * @requires jquery
 * @requires jquery.ui.core
 * @requires jquery.ui.widget
 * @requires jquery.ui.mouse
 * @requires jquery.ui.draggable
 * @requires TweenMax
 * @requires jquery.juiBase
 * @requires jquery.juiScrollPane
 *
 * @triggers expand
 * @triggers collapse
 */
$.widget('jui.juiScrollableDropDown', $.jui.juiBase, {

    options: {
        className: 'jui-scrollable-drop-down',


        ui: {
            contentElm: {
                elm: null,
                selector: '> .content'
            }
        },

        // Example animations hash
        defaultAnimations: [{
                type: 'from',
                duration: 0.30,
                elmAlias: 'contentElm',
                props: {css: {height: 0, autoAlpha: 0}}
            },
            {
                type: 'to',
                duration: 0.30,
                elmAlias: 'scrollbar',
                props: {css: {autoAlpha: 1},
                    delay: -0.10}
        }],

        // Expand select-picker on event
        expandOn: 'click',
        expandOnClassNamePrefix: 'expands-on',
        expandClassName: 'expanded',

        // Collapse select-picker on event
        collapseOn: 'click',
        collapseOnClassNamePrefix: 'collapses-on',
        collapseClassName: 'collapsed',

        // States
        states: {
            COLLAPSED: 'collapsed',
            EXPANDED: 'expanded'
        },

        // State
        state: null
    },

    _create: function () {
        var self = this,
            ops = self.options,
            contentElm;

        // Add event class names
        self.element
            .addClass(ops.className)
            .addClass(self._getExpandOnClassName())
            .addClass(self._getCollapseOnClassName())
            .addClass('collapsed');

        // Populate ui elements on self (self.ui[elmKeyAlias])
        self._populateUiElementsFromOptions();

        // Function for executing css: display (original | none)
        function executeTimelineCompleteFunc () {
            var contentElm = self.getUiElement('contentElm');
            if (ops.state === ops.states.COLLAPSED) {
                contentElm.css('display', 'none');
            }
            else if (ops.state === ops.states.EXPANDED) {
                contentElm.css('display', ops.ui.contentElm.originalCss.display);
            }
        }

        // Get content element
        contentElm = self.getUiElement('contentElm');

        // Save original css `display` value
        self._namespace('ui.contentElm.originalCss',
            ops, {
                display: contentElm.css('display'),
                visibility: contentElm.css('visibility')
            });

        // Set content element's visibility
        contentElm.css('visibility', 'hidden');

        try {
            // Setup timeline object
            self.timeline = new TimelineLite({
                onReverseComplete: executeTimelineCompleteFunc,
                onComplete: executeTimelineCompleteFunc
            });
        }
        catch (e) {
            throw new Error('Could not create a new "' + ops.defaultTimelineClass + '"' +
                'when trying to create a timeline object.');
        }

    },

    _init: function () {
        var ops = this.options;

        // Add event listeners
        this._addEventListeners();

        // Set collapsed state
        ops.state = ops.state || ops.states.COLLAPSED;

        // Ensure animation functionality
        this.ensureAnimationFunctionality();

        // Start initial animation
        ops.state === ops.states.COLLAPSED ? ops.timeline.reverse() :
            ops.timeline.play();
    },

    _getExpandOnClassName: function () {
        var ops = this.options;
        return ops.expandOnClassNamePrefix
            + ops.expandOn;
    },

    _getExpandOnEventStringName: function () {
        return this.options.expandOn;
    },

    _getCollapseOnClassName: function () {
        var ops = this.options;
        return ops.collapseOnClassNamePrefix
            + ops.collapseOn;
    },

    _getCollapseOnEventStringName: function () {
        return this.options.collapseOn;
    },

    _addEventListeners: function () {
        var self = this,
            states = self.options.states,
            ops = self.options,
            collapseOnMouseEvent = self._getCollapseOnEventStringName(),
            expandOnMouseEvent = self._getExpandOnEventStringName();

        // If expand and collapse events are the same (use toggle pattern)
        if (expandOnMouseEvent === collapseOnMouseEvent) {
            self.element.on(expandOnMouseEvent, function (e) {
                if (self.options.state === states.COLLAPSED) {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.EXPANDED;
                    self.element.removeClass(ops.collapseClassName);
                    self.element.addClass(ops.expandClassName);
                    self.element.trigger('expand', e);
                    ops.timeline.play();
                }
                else {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.COLLAPSED;
                    self.element.removeClass(ops.expandClassName);
                    self.element.addClass(ops.collapseClassName);
                    self.element.trigger('collapse', e);
                    ops.timeline.reverse();
                }
            });
        }
        else {
            // On expand event
            self.element.on(expandOnMouseEvent, function (e) {
                self.ensureAnimationFunctionality();
                self.options.state = states.EXPANDED;
                self.element.removeClass(ops.collapseClassName);
                self.element.addClass(ops.expandClassName);
                self.element.trigger('expand', e);
                ops.timeline.play();
            })
                // On collapse event
                .on(collapseOnMouseEvent, function (e) {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.COLLAPSED;
                    self.element.removeClass(ops.expandClassName);
                    self.element.addClass(ops.collapseClassName);
                    self.element.trigger('collapse', e);
                    ops.timeline.reverse();
                });
        }

        // When clicking outside of drop down close it
        $(window).on('click', function (e) {
            if ($.contains(self.element, $(e.target)) === false
                && ops.timeline.progress() === 1) {
                if (self.options.state === states.EXPANDED) {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.COLLAPSED;
                    self.element.removeClass(ops.expandClassName);
                    self.element.addClass(ops.collapseClassName);
                    self.element.trigger('collapse', e);
                    ops.timeline.reverse();
                }
            }
        });

    },

    _removeEventListeners: function () {
        this.element
            .off(this._getCollapseOnEventStringName())
            .off(this._getExpandOnEventStringName());
    },

    _initScrollbar: function () {
        var ops = this.options,
            scrollbar = this._namespace('ui.scrollbar');

        if (!sjl.empty(scrollbar.elm) && scrollbar.elm.length > 0) {
            return;
        }

        this.element.juiScrollPane({
            ui: {
                contentHolder: {
                    elm: this.getUiElement('contentElm'),
                    selector: ops.ui.contentElm.selector + ''
                }
            }
        });

        scrollbar.elm = $('.scrollbar', this.element);
    },

    initAnimationTimeline: function () {
        this._initAnimationTimeline();
    },

    _initTimeline: function () {
        if (sjl.empty(this.options.timeline)) {
            this.initAnimationTimeline()
        }
    },

    ensureAnimationFunctionality: function () {
        this._initScrollbar();
        this._initTimeline();
    },

    destroy: function () {
        this._removeCreatedElements();
        this._removeEventListeners();
        this._super();
    },

    refreshOptions: function () {
        this._removeEventListeners();
        this._addEventListeners();
    },

    getState: function () {
        return this.options.state;
    }

});