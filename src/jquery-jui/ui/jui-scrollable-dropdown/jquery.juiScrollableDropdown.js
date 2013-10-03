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
$.widget('jui.juiScrollableDropdown', $.jui.juiBase, {

    options: {
        className: 'jui-scrollable-drop-down',
        ui: {
            contentElm: {
                elm: null,
                attribs: {
                    'class': 'content'
                },
                selector: '> .content',
                html: '<div></div>',
                appendTo: 'this.element'
            }
        },

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
        var ops = this.options;

        // Add event class names
        this.element
            .addClass(ops.className)
            .addClass(this._getExpandOnClassName())
            .addClass(this._getCollapseOnClassName());

        // Populate ui elements on this (this.ui[elmKeyAlias])
        this.populateUiElementsFromOptions();

        // Add event listeners
        this._addEventListeners();

        // Set collapsed state
        ops.state = ops.states.COLLAPSED;
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
            collapseOnMouseEvent = this._getCollapseOnEventStringName(),
            expandOnMouseEvent = this._getExpandOnEventStringName();

        // If expand and collapse events are the same (use toggle pattern)
        if (expandOnMouseEvent === collapseOnMouseEvent) {
            this.element.on(expandOnMouseEvent, function (e) {
                if (self.options.state === states.COLLAPSED) {
                    self.ensureAnimationFunctionality();
                    self.timeline.play();
                    self.options.state = states.EXPANDED;
                }
                else {
                    self.ensureAnimationFunctionality();
                    self.timeline.reverse();
                    self.options.state = states.COLLAPSED;
                }
            });
        }
        else {
            // On expand event
            this.element.on(expandOnMouseEvent, function (e) {
                self.ensureAnimationFunctionality();
                self.timeline.play();
                self.options.state = states.EXPANDED;
            })
            // On collapse event
            .on(collapseOnMouseEvent, function (e) {
                self.ensureAnimationFunctionality();
                self.timeline.reverse();
                self.options.state = states.COLLAPSED;
            });
        }
    },

    _removeEventListeners: function () {
        this.element
            .off(this._getCollapseOnEventStringName())
            .off(this._getExpandOnEventStringName());
    },

    _removeCreatedOptions: function () {
        this.getUiElement('contentElm').find('ul').remove();
    },

    _initScrollbar: function () {
        this.ui.scrollbar = this.element.juiScrollPane({
            ui: {
                contentHolder: {
                    elm: this.getUiElement('contentElm'),
                    selector: this.options.ui.contentElm.selector + ''
                }
            }
        }).find('.scrollbar');
        this.ui.scrollbar.css('bottom', 0);
    },

    _initAnimationTimeline: function () {
        var self = this,
            dur = 0.30,
            timeline = this.timeline = new TimelineMax();
        TweenLite.to(this.ui.contentElm, dur, {css: {opacity: 1}});
        timeline.from(this.ui.contentElm, dur, {css: {height: 0}});
        timeline.from(this.ui.scrollbar, dur, {css: {opacity: 0}, delay: -0.10});
        timeline.reverse();
    },

    _initTimeline: function () {
        if (empty(this.timeline)) {
            this._initAnimationTimeline()
        }
    },

    ensureAnimationFunctionality: function () {
        this._initScrollbar();
        this._initTimeline();
    },

    destroy: function () {
        this._removeCreatedElements();
        this._removeEventListeners();
        this._destroy();
    },

    refreshOptions: function () {
        this._removeEventListeners();
        this._addEventListeners();
    }

});