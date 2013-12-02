/**
 * Created by ElyDeLaCruz on 10/1/13.
 * @deprecated Currently working on a refactor of this item (I know should have been in it's own branch)
 */
$.widget('jui.juiSelectPicker', $.jui.juiBase, {

    options: {

        ui: {
            wrapperElm: {
                elm: null,
                attribs: {
                    'class': 'jui-select-picker jui-select-picker-example-1'
                },
                appendTo: "after this.element",
                selector: '.jui-select-picker',
                html: '<div></div>',
                create: true
            },
            buttonElm: {
                elm: null,
                attribs: {
                    'class': 'button'
                },
                text: '',
                selector: '> .button',
                html: '<div><div class="label"></div></div>',
                appendTo: 'wrapperElm',
                create: true
            },
            optionsElm: {
                elm: null,
                attribs: {
                    'class': 'options'
                },
                selector: '> .options',
                html: '<div></div>',
                appendTo: 'wrapperElm',
                create: true,
                optionSelectedClassName: 'selected'
            }
        },

        // Label text for select picker
        labelText: '',

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

        // If using modernizr and is touch enabled device use native
        // select picker/element
        if ($('html').hasClass('touch')) {
            return;
        }

        // @todo fix ie8 and below bug with scrollbar
        if ($('html').hasClass('lt-ie9')) {
            console.log('** Note ** -- jquery.juiSelectPicker.js ' +
                'doesn\'t support anything less than Ie9 at the moment.');
        }

        // Hide this element and append new markup beside where it used
        // to be
        this.element
            .attr('hidden', 'hidden')
            .css('display', 'none');

        // Populate ui elements on this (this.options.ui[elmKeyAlias])
        this._populateUiElementsFromOptions();

        // Add event class names
        ops.ui.wrapperElm.elm.addClass(this._getExpandOnClassName())
            .addClass(this._getCollapseOnClassName());

        // Set button text/label
        this.setLabelText();

        // Draw select options from this element onto our element
        this._drawSelectOptions();

        // Add event listeners
        this._addEventListeners();

        // Animate
        this.ensureAnimationFunctionality();

        // Set collapsed state
        ops.state = ops.states.COLLAPSED;
    },

    _drawSelectOptions: function () {
        var self = this,
            optionsElm = self.getUiElement('optionsElm'),
            options = self.element.find('option'),
            ul = $('<ul></ul>'),
            ops = self.options;

        // Loop through option elements and copy them over to our
        // options container
        options.each(function (i, option) {
            // From dom element to jquery element
            option = $(option);

            // If button label is using first option from options list
            // Don't redraw this first option
            if (i === 0 && empty(ops.ui.buttonElm.text)) {
                return;
            }

            // Build list element
            var li = $('<li><a href="javascript: void(0);" data-value="'
                + option.attr('value') + '">' + option.text()
                + '</a></li>');

            // Add first class
            if (i === 0 && !empty(ops.ui.buttonElm.text)) {
                li.addClass('first');
            }
            else if (i === 1 && empty(ops.ui.buttonElm.text)) {
                li.addClass('first');
            }

            // Add last class
            if (i === options.length - 1) {
                li.addClass('last');
            }

            // Append option to unoredered list element
            ul.append(li);
        });

        // Append unordered list element
        optionsElm.append(ul);
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
            expandOnMouseEvent = this._getExpandOnEventStringName()
            ops = this.options;

        // Option/A-Tag click
        ops.ui.wrapperElm.elm.on('click', 'a[data-value]', function (e) {
            e.stopPropagation();
            var elm = $(e.currentTarget);
            self.clearSelected();
            self.setSelected(elm);
            self.timeline.reverse();
            self.options.state = states.COLLAPSED;
        });

        // If expand and collapse events are the same (use toggle pattern)
        if (expandOnMouseEvent === collapseOnMouseEvent) {
            ops.ui.wrapperElm.elm.on(expandOnMouseEvent, function (e) {
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
            ops.ui.wrapperElm.elm.on(expandOnMouseEvent, function (e) {
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
        this.options.ui.wrapperElm.elm
            .off('click', 'a')
            .off(this._getCollapseOnEventStringName())
            .off(this._getExpandOnEventStringName());
    },

    _removeCreatedOptions: function () {
        this.getUiElement('optionsElm').find('ul').remove();
    },

    _initScrollbar: function () {
        var ops = this.options,
            scrollbar = this._namespace('ui.scrollbar', ops);

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

    _initAnimationTimeline: function () {
        var self = this,
            dur = 0.3,
            timeline = this.timeline = new TimelineMax(),
            initInterval;
        timeline.from(this.options.ui.optionsElm.elm, dur, {css: {height: 0}});
        timeline.from(this.options.ui.scrollbar, dur, {css: {opacity: 0}, delay: -0.10});
        initInterval = setInterval(function () {
            timeline.reverse();
            clearInterval(initInterval);
        }, 0.4 * 1000);
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
        this.element.removeAttr('hidden');
        this._removeCreatedElements();
        this._removeEventListeners();
        this._destroy();
    },

    refreshOptions: function () {
        this._removeEventListeners();
        this._removeCreatedOptions();
        this._drawSelectOptions();
        this._addEventListeners();
        this.setLabelText();
        this.element.val(null)
            .trigger('change');
    },

    setLabelText: function (label, textType) {
        textType = textType || 'text';
        label = label || (!empty(this.options.ui.buttonElm.text)
            ? this.options.ui.buttonElm.text
            : (!empty(this.options.labelText) ? this.options.labelText :
            this.element.find('option[value]').eq(0).text()));
        $('.label', this.getUiElement('buttonElm')).eq(0)[textType](label);
    },

    setSelected: function (elm) {
        elm.parent().addClass(
            this.options.ui.optionsElm.optionSelectedClassName);
        this.element.val(elm.attr('data-value')).trigger('change');
        console.log(this.element.val());

    },

    clearSelected: function () {
        this.getUiElement('optionsElm')
            .find('> ul > li').removeClass(
                this.options.ui.optionsElm.optionSelectedClassName);
    }


});