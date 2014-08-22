/**
 * Created by ElyDeLaCruz on 10/1/13.
 * A scrollable drop down.
 *
 * @class $.jui.juiScrollableDropdown
 *
 * @requires jquery
 * @requires jquery.ui.core
 * @requires jquery.ui.widget
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
                duration: 0.34,
                elmAlias: 'contentElm',
                props: {css: {height: 0, autoAlpha: 0}}
            },
            {
                type: 'to',
                duration: 0.34,
                elmAlias: 'scrollbar',
                props: {css: {autoAlpha: 1},
                    delay: -0.13}
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

        self._super();

        // Add event class names
        self.element
            .addClass(ops.className)
            .addClass(self._getExpandOnClassName())
            .addClass(self._getCollapseOnClassName())
            .addClass('collapsed');

        // Populate ui elements on self (self.ui[elmKeyAlias])
        self._populateUiElementsFromOptions();

        // Get content element
        contentElm = self.getUiElement('contentElm');

        if (ops.isLessThanIE9) {
            contentElm.css('display', 'block');
        }

        // Save original css `display` and `visibility` values
        self._namespace('ui.contentElm.originalCss',
            ops, {
                display: contentElm.css('display'),
                visibility: contentElm.css('visibility')
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

        if (!ops.isTouchDevice) {
            // Start initial animation
            ops.state === ops.states.COLLAPSED ? this.reverseAnimation() :
                this.playAnimation();
        }
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
                    self.element.removeClass(ops.collapseClassName)
                        .addClass(ops.expandClassName)
                        .trigger('expand', e);
                    self.playAnimation();
                }
                else {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.COLLAPSED;
                    self.element
                        .removeClass(ops.expandClassName)
                        .addClass(ops.collapseClassName)
                        .trigger('collapse', e);
                    self.reverseAnimation();
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
                self.playAnimation();
            })
                // On collapse event
                .on(collapseOnMouseEvent, function (e) {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.COLLAPSED;
                    self.element.removeClass(ops.expandClassName);
                    self.element.addClass(ops.collapseClassName);
                    self.element.trigger('collapse', e);
                    self.reverseAnimation();
                });
        }

        // When clicking outside of drop down close it
        $(window).on('click', function (e) {
            if ($.contains(self.element.get(0), e.target) === false
                && ops.timeline.progress() === 1) {
                if (self.options.state === states.EXPANDED) {
                    self.ensureAnimationFunctionality();
                    self.options.state = states.COLLAPSED;
                    self.element.removeClass(ops.expandClassName);
                    self.element.addClass(ops.collapseClassName);
                    self.element.trigger('collapse', e);
                    self.reverseAnimation();
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

        this.options.juiScrollPaneElm = this.element.juiScrollPane({
            ui: {
                contentHolder: {
                    elm: this.getUiElement('contentElm'),
                    selector: ops.ui.contentElm.selector + ''
                }
            }
        });

        scrollbar.elm = $('.vertical.scrollbar', this.element);
    },

    initAnimationTimeline: function () {
        this._initAnimationTimeline();
    },

    _initTimeline: function () {
        if (sjl.empty(this.options.timeline)) {
            this.initAnimationTimeline()
        }
    },

    setStateTo: function (state) {
        this.options.state = typeof state !== 'undefined'
            && state === 'expanded' ? this.options.states.EXPANDED
            : this.options.states.COLLAPSED;
    },

    ensureAnimationFunctionality: function () {
        if (this.options.isLessThanIE9) {
            return;
        }
        this._initScrollbar();
        this._initTimeline();
    },

    /**
     * Plays animation timeline (if disableOnTouchDevice is true and isTouchDevice, does nothing).
     * @return {void}
     */
    playAnimation: function () {
        var self = this,
            ops = self.options;
        // Bail if device/browser not supported
        if ((ops.disableOnTouchDevice && ops.isTouchDevice) || (ops.isLessThanIE9)) {
            return;
        }
        ops.timeline.play();
    },

    /**
     * Reverses the animation timeline if not touch device.
     * @return {void}
     */
    reverseAnimation: function () {
        var self = this,
            ops = self.options;
        // Bail if device/browser not supported
        if ((ops.disableOnTouchDevice && ops.isTouchDevice) || (ops.isLessThanIE9)) {
            return;
        }
        ops.timeline.reverse();
    },

    destroy: function () {
        this._removeCreatedElements();
        this._removeEventListeners();
        this._super();
    },

    refresh: function () {
        this.element.juiScrollPane('refresh');
    },

    getState: function () {
        return this.options.state;
    }

});
