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
                props: {css: {opacity: 1},
                    delay: -0.10}
        }],

        // Expand select-picker on event
        expandOn: 'click',
        expandOnClassNamePrefix: 'expands-on',

        // Collapse select-picker on event
        collapseOn: 'click',
        collapseOnClassNamePrefix: 'collapses-on',

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
            ops = self.options;

        // Add event class names
        this.element
            .addClass(ops.className)
            .addClass(this._getExpandOnClassName())
            .addClass(this._getCollapseOnClassName());

        // Populate ui elements on this (this.ui[elmKeyAlias])
        this._populateUiElementsFromOptions();

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

        // Save original css `display` value
        this._namespace('ui.contentElm.originalCss.display',
            ops, this.getUiElement('contentElm').css('display'));

        // Setup timeline object
        this.timeline = new TimelineMax({
            onReverseComplete: executeTimelineCompleteFunc,
            onComplete: executeTimelineCompleteFunc
        });
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
            ops = this.options,
            collapseOnMouseEvent = this._getCollapseOnEventStringName(),
            expandOnMouseEvent = this._getExpandOnEventStringName();

        // If expand and collapse events are the same (use toggle pattern)
        if (expandOnMouseEvent === collapseOnMouseEvent) {
            this.element.on(expandOnMouseEvent, function (e) {
                if (self.options.state === states.COLLAPSED) {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.EXPANDED;
                    ops.timeline.play();
                }
                else {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.COLLAPSED;
                    ops.timeline.reverse();
                }
            });
        }
        else {
            // On expand event
            this.element.on(expandOnMouseEvent, function (e) {
                self.ensureAnimationFunctionality();
                self.options.state = states.EXPANDED;
                ops.timeline.play();
            })
                // On collapse event
                .on(collapseOnMouseEvent, function (e) {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.COLLAPSED;
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

        if (!empty(scrollbar.elm) && scrollbar.elm.length > 0) {
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
        if (empty(this.options.timeline)) {
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