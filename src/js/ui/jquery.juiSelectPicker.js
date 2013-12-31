/**
 * Created by ElyDeLaCruz on 10/1/13.
 * @todo allow only scrolling on scrollable options elm
 */
$.widget('jui.juiSelectPicker', $.jui.juiBase, {

    options: {

        className: 'jui-select-picker',

        animation: {
            duration: 0.30
        },

        // Label text for select picker
        labelText: '',

        skipFirstOptionItem: false,

        selectedValue: null,

        ui: {
            wrapperElm: {
                elm: null,
                attribs: {
                    'class': 'jui-select-picker'
                },
                appendTo: "after this.element",
                selector: '.jui-select-picker',
                html: '<div></div>',
                create: true,
                timeline: new TimelineMax()
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
            bodyElm: {
                elm: null,
                attribs: {
                    'class': 'body'
                },
                selector: '> .body',
                html: '<div></div>',
                appendTo: 'wrapperElm',
                create: true
            },
            optionsElm: {
                elm: null,
                attribs: {
                    'class': 'options'
                },
                selector: '.options',
                html: '<div></div>',
                appendTo: 'bodyElm',
                create: true,
                optionSelectedClassName: 'selected'
            }
        }

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
        var self = this,
            ops = this.options,
            className = self.getValueFromHash('className', ops),
            currentClassName =
                self.getValueFromHash('ui.wrapperElm.attribs', ops)['class'];

        // Resolve class name
        if (!empty(className)) {
            if (!empty(currentClassName)
                && typeof currentClassName === 'string') {
                ops.ui.wrapperElm.attribs['class'] += ' ' + className;
            }
            else {
                ops.ui.wrapperElm.attribs['class'] = className;
            }
        }

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
            if (i === 0 && ops.skipFirstOptionItem) {
                return;
            }

            var value = option.attr('value'),
                dataValue = option.attr('data-value'),
                classValue = option.attr('class');

            // Preselect item if necessary
            if (ops.selectedValue === value || ops.selectedValue === dataValue) {
                if (isset(classValue)) {
                    if (classValue.length > 0) {
                        classValue += ' ';
                    }
                    classValue += ops.ui.optionsElm.optionSelectedClassName;
                }
                else {
                    classValue = ops.ui.optionsElm.optionSelectedClassName;
                }
            }

            // Resolve class attribute and data-value attribute
            classValue = !empty(classValue) ? 'class="' + classValue + '" ' : '';
            value = empty(value) ? (empty(dataValue) ?
                '' : 'data-value="' + dataValue + '" ') :
                ' data-value="' + value + '"';

            // Build list element
            var li = $('<li><a ' + classValue + 'href="javascript: void(0);"'
                + value + '>' + option.text() + '</a></li>');

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
        wrapperElm.on('mouseup', function () {
            var collapsed = wrapperElm
                .juiScrollableDropDown('getState')
                .indexOf('collapsed') > -1 ? true : false;
            if (collapsed) {
                self.playAnimation();
            }
            else {
                self.reverseAnimation();
            }
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
            var elm = $(this),
                val = elm.val();
            if (isset(val)) {
                self.setSelectedItemLabelText(val);
//                self.setSelected(self.getOptionElementByValue(val));
            }
        });
    },

    _removeCreatedOptions: function () {
        this.getUiElement('optionsElm').find('ul').remove();
    },

    _initScrollableDropDown: function () {
        var self = this,
            ops = self.options,
            wrapperElm = self.getUiElement('wrapperElm'),
            contentElm = self.getUiElement('optionsElm'),
            duration = ops.animation.duration,
            scrollbarElm,
            timeline,
            dropDown, dropDownOptions;

        // Scrollable drop down options
        dropDownOptions = {
            state: 'collapsed',
            ui: {
                contentElm: {
                    elm: this.getUiElement('optionsElm'),
                    attribs: ops.ui.optionsElm.attribs,
                    selector: ops.ui.optionsElm.selector + ''
                }
            }};

        // Set expands on event value
        if (isset(ops.expandOn)) {
            dropDownOptions.expandOn = ops.expandOn;
        }

        // Set collapses on event value
        if (isset(ops.collapseOn)) {
            dropDownOptions.collapseOn = ops.collapseOn;
        }

        // Apply scrollable drop down on wrapper element
        dropDown = wrapperElm.juiScrollableDropDown(dropDownOptions);

        // Get the dropdowns timeline
        timeline = dropDown.juiScrollableDropDown('getAnimationTimeline');
        timeline.seek(0);
        timeline.clear();
        timeline.pause();

        // Get scrollbar element
        scrollbarElm = $('.vertical.scrollbar', wrapperElm);

        // Supply new tweens
        [
            TweenLite.to(wrapperElm, duration, {height: wrapperElm.css('max-height')}),
            TweenLite.to(contentElm, duration, {height: contentElm.css('max-height'), autoAlpha: 1, delay: -0.30}),
            TweenLite.to(scrollbarElm, duration, {autoAlpha: 1, delay: -0.20})
        ]
            .forEach(function (tween) {
                timeline.add(tween);
            });
    },

    destroy: function () {
        this.element.removeAttr('hidden');
        this._removeCreatedOptions();
        this._super();
    },

    refreshOptions: function () {
        this.options.selectedValue = this.getSelectedOptionValue();
        this._removeCreatedOptions();
        this._drawSelectOptions();
        this.setLabelText();
        this.element.trigger('change');
    },

    setSelectedItemLabelText: function (text, textType, usePrefixAndSuffix) {
        text = text || '';
        textType = textType || 'text';
        usePrefixAndSuffix = isset(usePrefixAndSuffix)  ? usePrefixAndSuffix : true;
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
            this.element.find('option').eq(0).text()));
        this.getUiElement('labelElm').eq(0)[textType](text);
    },

    setSelected: function (elm) {
        if (elm.length === 0) {
            return;
        }
        elm.parent().addClass(
            this.options.ui.optionsElm.optionSelectedClassName);
        this.element.val(elm.attr('data-value')).trigger('change');
        this.options.selectedValue = elm.attr('data-value');
    },

    clearSelected: function () {
        this.getUiElement('optionsElm')
            .find('> ul > li').removeClass(
                this.options.ui.optionsElm.optionSelectedClassName);
        this.options.selectedValue = null;
    },

    playAnimation: function () {
        var self = this,
            ops = self.options;
        ops.timeline.play();
    },

    reverseAnimation: function () {
        var self = this,
            ops = self.options;
        ops.timeline.reverse();
    },

    getOptionElementByValue: function (value) {
        this.getUiElement('optionsElm')
            .find('[data-value="' + value +'"]');
    },

    getSelectedOptionValue: function () {
        return this.getUiElement('optionsElm')
            .find('.selected').find('a').attr('data-value');
    }

});
