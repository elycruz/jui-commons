/**
 * Created by ElyDeLaCruz on 10/1/13.
 */
$.widget('jui.juiSelectPicker', $.jui.juiBase, {

    options: {

        ui: {
            wrapperElm: {
                elm: null,
                attribs: {
                    'class': 'jui-select-picker'
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
                selector: '> .button',
                html: '<div></div>',
                appendTo: 'wrapperElm',
                create: true
            },
            buttonArrowElm: {
                elm: null,
                attribs: {
                    'class': 'arrow'
                },
                selector: '> .arrow',
                html: '<div></div>',
                appendTo: 'buttonElm',
                create: true
            },
            labelElm: {
                elm: null,
                attribs: {
                    'class': 'label'
                },
                text: '',
                selector: '> .label',
                html: '<span></span>',
                appendTo: 'buttonElm',
                create: true
            },
            selectedItemLabelElm: {
                elm: null,
                attribs: {
                    'class': 'selected-item-label selected'
                },
                prefixText: 'You\'ve chosen "',
                suffixText: '"',
                selector: '> .selected-item-label',
                html: '<span></span>',
                appendTo: 'buttonElm',
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
        labelText: ''
    },

    _create: function () {
        var ops = this.options;

        // If using modernizr and is touch enabled device use native
        // select picker/element
        if ($('html').hasClass('touch')) {
            return;
        }
    },

    _init: function () {

        // Timeline
        this.options.timeline = new TimelineMax({paused: true});

        // Hide this element and append new markup beside where it used
        // to be
        this.element.attr('hidden', 'hidden').css('display', 'none');

        // Populate ui elements on this (this.options.ui[elmKeyAlias])
        this._populateUiElementsFromOptions();

        // Set button text/label
        this.setLabelText();

        // Draw select options from this element onto our element
        this._drawSelectOptions();

        // Init Arrow Animation
//        this._initArrowAnimation();

        // Scrollable Drop Down
        this._initScrollableDropDown();

        // Listeners
        this._addEventListeners();
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

    _addEventListeners: function () {
        var self = this,
        ops = this.options,
        wrapperElm = self.getUiElement('wrapperElm');

        // Option/A-Tag click
        wrapperElm.on('click', function () {
            ops.timeline.play();
        });

        wrapperElm.on('click', 'a[data-value]', function (e) {
//            e.stopPropagation();
            var elm = $(e.currentTarget);
            self.clearSelected();
            self.setSelected(elm);
            ops.timeline.reverse();
        });

        // On select element change set it's selected item label text
        this.element.on('change', function (e) {
            var elm = $(this);
            if (isset(elm.val())) {
                self.setSelectedItemLabelText(elm.val());
            }
        });
    },

    _removeCreatedOptions: function () {
        this.getUiElement('optionsElm').find('ul').remove();
    },

    _initScrollableDropDown: function () {
        var ops = this.options,
            scrollbar = this._namespace('ui.scrollbar'),
            wrapperElm = this.getUiElement('wrapperElm'),
            dropDown,
            dropDownOptions;

        if (!empty(scrollbar.elm) && scrollbar.elm.length > 0) {
            return;
        }

        dropDownOptions = {
//            timeline: new TimelineMax(),
            state: 'collapsed',
            ui: {
                contentElm: {
                    elm: this.getUiElement('optionsElm'),
                    attribs: ops.ui.optionsElm.attribs,
                    selector: ops.ui.optionsElm.selector + ''
                }
            }};

        if (isset(ops.expandOn)) {
            dropDownOptions.expandOn = ops.expandOn;
        }

        if (isset(ops.collapseOn)) {
            dropDownOptions.collapseOn = ops.collapseOn;
        }

        dropDown = wrapperElm.juiScrollableDropDown(dropDownOptions);
        dropDown.juiScrollableDropDown('getAnimationTimeline').seek(0);

        scrollbar.elm = $('.scrollbar', this.element);
    },

    _initArrowAnimation: function () {
        var self = this,
            ops = self.options,
            timeline = ops.timeline,
            elm = self.getUiElement('buttonArrowElm'),
            duration = 0.38;
        timeline.to(elm, duration, {rotation: -180, top: - elm.height() / 2 + 'px'});
    },

    destroy: function () {
        this.element.removeAttr('hidden');
        this._removeCreatedOptions();
        this._super();
    },

    refreshOptions: function () {
        this._removeCreatedOptions();
        this._drawSelectOptions();
        this.setLabelText();
        this.element.val(null)
            .trigger('change');
    },

    setSelectedItemLabelText: function (text, textType, usePrefixAndSuffix) {
        text = text || '';
        textType = textType || 'text';
        usePrefixAndSuffix = usePrefixAndSuffix || true;
        var config = this.options.ui.selectedItemLabelElm,
            elm = this.getUiElement('selectedItemLabelElm').eq(0);
        if (usePrefixAndSuffix) {
            text = config.prefixText + text + config.suffixText;
        }

        // @todo move this declaration to the add event listeners
        // function and optimize it
        TweenMax.to(elm, 0.16, {
            opacity: 0,
            onCompleteParams: [text, textType, elm],
            onComplete: function () {
                var args = arguments,
                    text = args[0],
                    textType = args[1],
                    elm = args[2];
                elm[textType](text);
                TweenMax.to(elm, 0.16, {opacity: 1});
            }});
    },

    setLabelText: function (text, textType) {
        textType = textType || 'text';
        text = text || (!empty(this.options.ui.buttonElm.text)
            ? this.options.ui.buttonElm.text
            : (!empty(this.options.labelText) ? this.options.labelText :
            this.element.find('option[value]').eq(0).text()));
        this.getUiElement('labelElm').eq(0)[textType](text);
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
