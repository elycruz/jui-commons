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
        contentElmTimelineConfig: {
            setterCall: 'from',
            elmAlias: 'contentElm',
            duration: 0.34,
            params: {
                css: {height: 0, autoAlpha: 0}
            }
        },
        scrollbarElmTimelineConfig: {
            setterCall: 'to',
            elmAlias: 'scrollbarElm',
            duration: 0.34,
            params: {
                css: {autoAlpha: 1}
            }
        },
        ui: {
            contentElm: {
                selector: '> .content'
            },
            scrollbarElm: {
                selector: '.vertical.scrollbar'
            }
        },

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

        // Set collapsed state
        ops.state = ops.state || ops.states.COLLAPSED;

        // Add event class names
        self.element
            .addClass([ops.className,
                ops.expandOnClassNamePrefix + ops.expandOn,
                    ops.collapseOnClassNamePrefix + ops.collapseOn,
                    ops.state === ops.states.COLLAPSED
                        ? ops.collapseClassName : ops.expandClassName
                ].join(' '));

        // Populate ui elements on self (self.ui[elmKeyAlias])
        self._autoPopulateUiElements(self, self.element, ops);

        // Get content element
        contentElm = self.getUiElement('contentElm');

        if (ops.isLessThanIE9) {
            contentElm.css('display', 'block');
        }

        // Save original css `display` and `visibility` values
        ops.ui.contentElm.originalCss = {
                display: contentElm.css('display'),
                visibility: contentElm.css('visibility')
            };
    },

    _init: function () {
        var self = this,
            ops = self.options;

        // Add event listeners
        self._addEventListeners(self, self.element, ops)

            // Ensure animation functionality
            .ensureAnimationFunctionality(self, ops);

        // Start initial animation if not a touch device
        if (!ops.isTouchDevice) {
            ops.state === ops.states.COLLAPSED ? self.reverseAnimation() : self.playAnimation();
        }
    },

    _defineAnimation: function (self, ops) {
        var timeline = self.gsapTimeline();
        $.each(['contentElmTimeline', 'scrollbarElmTimeline'], function (index, timelineName) {
            var item = ops[timelineName + 'Config'];
            timeline.add(
                    self[timelineName]()[item.setterCall](self.getUiElement(item.elmAlias), item.duration, item.params)
                );
        });
        return self;
    },

    _addEventListeners: function (self, $selfElm, ops) {
        var states = ops.states,
            collapseOnMouseEvent = ops.collapseOn,
            expandOnMouseEvent = ops.expandOn;

        // If expand and collapse events are the same (use toggle pattern)
        if (expandOnMouseEvent === collapseOnMouseEvent) {
            $selfElm.on(expandOnMouseEvent, function (e) {
                if (ops.state === states.COLLAPSED) {
                    //self.ensureAnimationFunctionality(self, ops);
                    ops.state = states.EXPANDED;
                    $selfElm.removeClass(ops.collapseClassName)
                        .addClass(ops.expandClassName)
                        .trigger('expand', e);
                    self.playAnimation();
                }
                else {
                    //self.ensureAnimationFunctionality(self, ops);
                    ops.state = states.COLLAPSED;
                    $selfElm
                        .removeClass(ops.expandClassName)
                        .addClass(ops.collapseClassName)
                        .trigger('collapse', e);
                    self.reverseAnimation();
                }
            });
        }
        else {
            // On expand event
            $selfElm.on(expandOnMouseEvent, function (e) {
                //self.ensureAnimationFunctionality(self, ops);
                ops.state = states.EXPANDED;
                $selfElm.removeClass(ops.collapseClassName);
                $selfElm.addClass(ops.expandClassName);
                $selfElm.trigger('expand', e);
                self.playAnimation();
            })
                // On collapse event
                .on(collapseOnMouseEvent, function (e) {
                    //self.ensureAnimationFunctionality(self, ops);
                    ops.state = states.COLLAPSED;
                    $selfElm.removeClass(ops.expandClassName);
                    $selfElm.addClass(ops.collapseClassName);
                    $selfElm.trigger('collapse', e);
                    self.reverseAnimation();
                });
        }

        // When clicking outside of drop down close it
        $(window).on('click', function (e) {
            if ($.contains($selfElm.get(0), e.target) === false
                && ops.gsapTimeline.progress() === 1) {
                if (ops.state === states.EXPANDED) {
                    //self.ensureAnimationFunctionality(self, ops);
                    ops.state = states.COLLAPSED;
                    $selfElm.removeClass(ops.expandClassName);
                    $selfElm.addClass(ops.collapseClassName);
                    $selfElm.trigger('collapse', e);
                    self.reverseAnimation();
                }
            }
        });

        return self;
    },

    _removeEventListeners: function (self) {
        self.element.off(self.options.collapseOn)
                    .off(self.options.expandOn);
        return self;
    },

    _initScrollbar: function (self, ops) {
        var $scrollbar = self.getUiElement('scrollbarElm');
        if (!sjl.empty($scrollbar) && $scrollbar.length > 0) {
            return self;
        }
        self.options.juiScrollPaneElm = self.element.juiScrollPane({ ui: {
                contentHolder: {
                    elm: self.getUiElement('contentElm'),
                    selector: ops.ui.contentElm.selector + ''
                }
            }});

        ops.ui.scrollbarElm.elm = $('.vertical.scrollbar', self.element);
        return self;
    },

    setStateTo: function (state) {
        this.options.state = typeof state !== 'undefined'
            && state === 'expanded' ? this.options.states.EXPANDED
            : this.options.states.COLLAPSED;
        return this;
    },

    ensureAnimationFunctionality: function (self, ops) {
        if (ops.isLessThanIE9) {
            return;
        }
        return self._initScrollbar(self, ops)
                    ._defineAnimation(self, ops);
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
        ops.gsapTimeline.play();
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
        ops.gsapTimeline.reverse();
    },

    destroy: function () {
        var self = this;
        self._removeCreatedElements(self);
        self._removeEventListeners(self);
        self._super();
    },

    refresh: function () {
        this.element.juiScrollPane('refresh');
    },

    getState: function () {
        return this.options.state;
    },

    scrollbarElmTimeline: function (timeline) {
        return this._timeline(timeline, 'scrollbarElmTimeline', this.options);
    },

    contentElmTimeline: function (timeline) {
        return this._timeline(timeline, 'contentElmTimeline', this.options);
    }

});
