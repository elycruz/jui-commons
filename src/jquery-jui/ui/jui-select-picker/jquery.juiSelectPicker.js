/**
 * Created by ElyDeLaCruz on 10/1/13.
 * @todo use TweenMax/TweenLite for animations
 */
$.widget('jui.juiSelectPicker', $.jui.juiBase, {

    options: {
        ui: {
            wrapperElm: {
                elm: null,
                attribs: {
                    'class': 'jui-select-picker'
                },
                selector: '> .jui-select-picker',
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
                html: '<button></button>',
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
        var ops = this.options,
            wrapperElm = this.getElementFromOptions('ui.wrapperElm');

        // Hide this element and append new markup beside where it used
        // to be
        this.element
            .attr('hidden', 'hidden')
            .after(wrapperElm);

        // Add event class names
        wrapperElm.addClass(this._getExpandOnClassName())
            .addClass(this._getCollapseOnClassName());

        // Populate ui elements on this (this.ui[elmKeyAlias])
        this.populateUiElementsFromOptions();

        // Set button text/label
        this.setLabelText();

        // Draw select options from this element onto our element
        this._drawSelectOptions();

        // Add event listeners
        this._addEventListeners();

        // Set collapsed state
        ops.state = ops.states.COLLAPSED;
    },

    _drawSelectOptions: function () {
        var self = this,
            optionsElm = self.getUiElm('optionsElm'),
            options = self.element.find('option'),
            ul = $('<ul></ul>');

        // Loop through option elements and copy them over to our
        // options container
        options.each(function (i, option) {
            // From dom element to jquery element
            option = $(option);

            // If button label is using first option from options list
            // Don't redraw this first option
            if (i === 0 && empty(self.options.ui.buttonElm.text)) {
                return;
            }

            // Build list element
            var li = $('<li><a href="javascript: void(0);" data-value="'
                + option.attr('value') + '">' + option.text()
                + '</a></li>');

            // Add first class
            if (i === 0 && !empty(self.options.ui.buttonElm.text)) {
                li.addClass('first');
            }
            else if (i === 1 && empty(self.options.ui.buttonElm.text)) {
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
            expandOnMouseEvent = this._getExpandOnEventStringName();

        // Option/A-Tag click
        this.ui.wrapperElm.on('click', 'a[data-value]', function (e) {
            e.stopPropagation();
            var elm = $(e.currentTarget);
            self.clearSelected();
            self.setSelected(elm);
            self.timeline.reverse();
            self.options.state = states.COLLAPSED;
        });

        // If expand and collapse events are the same (use toggle pattern)
        if (expandOnMouseEvent === collapseOnMouseEvent) {
            this.ui.wrapperElm.on(expandOnMouseEvent, function (e) {
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
            this.ui.wrapperElm.on(expandOnMouseEvent, function (e) {
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
        this.ui.wrapperElm
            .off('click', 'a')
            .off(this._getCollapseOnEventStringName())
            .off(this._getExpandOnEventStringName());
    },

    _removeCreatedOptions: function () {
        this.getUiElm('optionsElm').find('ul').remove();
    },

    _initScrollbar: function () {
        this.ui.scrollbar = this.ui.wrapperElm.juiScrollPane({
            ui: {
                contentHolder: {
                    elm: this.getUiElm('optionsElm'),
                    selector: this.options.ui.optionsElm.selector + ''
                }
            }
        }).find('.scrollbar');
        this.ui.scrollbar.css('bottom', 0);
    },

    _initAnimationTimeline: function () {
        var self = this,
            dur = 0.30,
            timeline = this.timeline = new TimelineMax();
        TweenLite.to(this.ui.optionsElm, dur, {css: {opacity: 1}});
        timeline.from(this.ui.optionsElm, dur, {css: {height: 0}});
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
        this.element.val(0)
            .trigger('change');
    },

    setLabelText: function (label, textType) {
        textType = textType || 'text';
        label = label || (!empty(this.options.ui.buttonElm.text)
            ? this.options.ui.buttonElm.text
            : (!empty(this.options.labelText) ? this.options.labelText :
            this.element.find('option[value]').eq(0).text()));
        this.getUiElm('buttonElm')[textType](label);
    },

    setSelected: function (elm) {
        elm.parent().addClass(
            this.options.ui.optionsElm.optionSelectedClassName);
        this.element.val(elm.attr('data-value')).trigger('change');
        console.log(this.element.val());

    },

    clearSelected: function () {
        this.getUiElm('optionsElm')
            .find('> ul > li').removeClass(
                this.options.ui.optionsElm.optionSelectedClassName);
    }


});