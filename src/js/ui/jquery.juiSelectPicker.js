/**
 * Created by ElyDeLaCruz on 10/1/13.
 *
 * Hides a Select Element and Replaces it with a scrollable Select Picker element
 * which is fully stylable.
 *
 * @module jquery.juiSelectPicker
 *
 * @requires jquery
 * @requires jquery.ui (core)
 * @requires jquery.ui.widget
 * @requires jquery.juiScrollableDropdown
 *
 * @todo convert all inline option docs to options doclet using the @ property tag
 *
 */
$.widget('jui.juiSelectPicker', $.jui.juiBase, {

    /**
     * Options hash.
     * @type {Object}
     * @property className {String}
     * @property animation {Object}
     * @property labelText {String}
     */
    options: {

        /**
         * Class name added to wrapper element.
         * @param {String} default: 'jui-select-picker';
         */
        className: 'jui-select-picker',

        /**
         * Animation options.
         * @type {Object}
         */
        animation: {
            duration: 0.30
        },

        /**
         * Label text.
         * @type {String}
         */
        labelText: '',

        /**
         * Selected Value Label Prefix.
         * @type {String}
         */
        selectedLabelPrefix: '',

        /**
         * Selected Value Label Suffix.
         * @type {String}
         */
        selectedLabelSuffix: '',

        /**
         * Flag for using selected value label suffix and prefix.
         * @type {String}
         */
        useSelectedLabelPrefixAndSuffix: false,

        /**
         * Skip the first option from the select element in rendering to wrapper.
         * @type {Boolean}
         */
        skipFirstOptionItem: false,

        /**
         * Selected Value.
         * @type {mixed|null}
         */
        selectedValue: null,

        /**
         * Flag for disabling this plugin on touch devices (and using devices default).
         * @type {Boolean}
         */
        disableOnTouchDevice: true,

        /**
         * The attribute to get the value from on the select element's option element.
         * @type {String} - default 'value'
         */
        valueAttribName: 'value',

        /**
         * Where to get the label string for the option from (if 'html', or
         * 'text uses jquery to pull the 'html'/'text' from the select element's
         * option element).
         * @type {String} - default 'html'
         */
        labelAttribName: null,

        /**
         * Ui Hash.
         * @type {Object}
         */
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

    /**
     * Sets flag if touch device (used for disable plugin if options.disableOnTouchDevice
     * is true).
     * @private
     */
    _create: function () {
        var ops = this.options;
        // If using modernizr and is touch enabled device, set flag
        if ($('html').hasClass('touch') && ops.disableOnTouchDevice) {
            ops.isTouchDevice = true;
        }
    },

    /**
     * Initializes the select picker:
     * - Hides select element plugin was called on;
     * - Adds css classes for wrapper;
     * - Sets initial label text;
     * - Draws options within wrapper;
     * - Initializes scrollable drop down on wrapper;
     * - and Adds event listeners;
     * @private
     */
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

    /**
     * Draws select element's options into wrapper.
     * @private
     */
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

            var value = self.getValueFromOptionElm(option),
                label = self.getLabelFromOptionElm(option),
                classValue = option.attr('class'),
                liClassValue = '';

            console.log(value, label);

            // Preselect item if necessary
            if (isset(ops.selectedValue) &&
                (ops.selectedValue === value)) {
                if (!empty(liClassValue)) {
                    if (liClassValue.length > 0) {
                        liClassValue += ' ';
                    }
                    liClassValue += ops.ui.optionsElm.optionSelectedClassName;
                }
                else {
                    liClassValue = ops.ui.optionsElm.optionSelectedClassName;
                }

                liClassValue = ' class="' + liClassValue + '"';
            }

            // Resolve class attribute and data-value attribute
            classValue = !empty(classValue) ? 'class="' + classValue + '" ' : '';
            value = ' data-value="' + value + '" ';

            // Build list element
            var li = $('<li' + liClassValue + '><a ' + classValue + 'href="javascript: void(0);"'
                + value + '>' + label + '</a></li>');

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

    /**
     * Adds event listeners for:
     * - wrapper - mouseup;
     * - wrapper - a[data-value] click;
     * - select element - change;
     * @private
     */
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
//                self.setSelected(self.getOwnOptionElmByValue(val));
            }
        });
    },

    /**
     * Removes created options.
     * @private
     */
    _removeCreatedOptions: function () {
        this.getUiElement('optionsElm').find('ul').remove();
    },

    /**
     * Makes wrapper's content scrollable.
     * - Calls jui.scrollableDropDown on wrapper;
     * @private
     */
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

    /**
     * Destroys `this` instance.
     * - Shows hidden select element;
     * - Removes created options;
     * - and calls _super's destroy method (to finish up the cleaning process);
     * @returns {void}
     */
    destroy: function () {
        this.element.removeAttr('hidden');
        this._removeCreatedOptions();
        this._super();
    },

    /**
     * Refreshes the currently drawn options.
     * - Sets selected value;
     * - removes options;
     * - recreates options;
     * - sets label text;
     * - triggers `change` event on this (select element);
     * @returns {void}
     */
    refreshOptions: function () {
        this.options.selectedValue = this.getSelectedOwnOptionElmValue();
        this._removeCreatedOptions();
        this._drawSelectOptions();
        this.setLabelText();
        this.element.trigger('change');
    },

    /**
     * Sets the select picker's `selected item label`.
     * @param text {string} value to set to label; default ''
     * @param textType {string} (html|text) (proxy jquery's text() and/or html() methods to set text).  Default 'text'
     * @param usePrefixAndSuffix {boolean} Whether to use prefix and suffix for label text. Default false
     * @returns {void}
     */
    setSelectedItemLabelText: function (text, textType, usePrefixAndSuffix) {
        var ops = this.options,
            config = ops.ui.selectedItemLabelElm,
            elm = this.getUiElement('selectedItemLabelElm').eq(0),
            prefixText, suffixText;

        text = text || '';
        textType = textType || 'text';
        usePrefixAndSuffix = isset(usePrefixAndSuffix)
            ? usePrefixAndSuffix : ops.useSelectedLabelPrefixAndSuffix;

        if (usePrefixAndSuffix) {
            prefixText = ops.selectedLabelPrefix || config.prefixText || '';
            suffixText = ops.selectedLabelSuffix || config.suffixText || '';
            text = prefixText + text + suffixText;
        }

        // @todo move this declaration to the add event listeners
        // function and optimize it
        TweenMax.to(elm, 0.16, {
            autoAlpha: 0,
            onCompleteParams: [text, textType, elm],
            onComplete: function () {
                var args = arguments,
                    text = args[0],
                    textType = args[1],
                    elm = args[2];
                elm[textType](text);
                TweenMax.to(elm, 0.16, {autoAlpha: 1});
            }});
    },

    /**
     * Sets the select picker's label.
     * @param text {string} value to set on label;
     * @param textType {string} proxy key for jquery for setting text. Default 'text'
     * @return {void}
     */
    setLabelText: function (text, textType) {
        textType = textType || 'text';
        text = text || (!empty(this.options.ui.buttonElm.text)
            ? this.options.ui.buttonElm.text
            : (!empty(this.options.labelText) ? this.options.labelText :
            this.element.find('option').eq(0).text()));
        this.getUiElement('labelElm').eq(0)[textType](text);
    },

    /**
     * Sets the selected element in the wrapper's drawn options.
     * - Triggers a change event on this.element (select element);
     * @param elm {jquery} The actual element that should be selected.
     * @return {void}
     */
    setSelected: function (elm) {
        if (elm.length === 0) {
            return;
        }
        elm.parent().addClass(
            this.options.ui.optionsElm.optionSelectedClassName);
        this.element.val(elm.attr('data-value')).trigger('change');
        this.options.selectedValue = elm.attr('data-value');
    },

    /**
     * Clears the currently selected element.
     * @returns {void}
     */
    clearSelected: function () {
        this.getUiElement('optionsElm')
            .find('> ul > li').removeClass(
                this.options.ui.optionsElm.optionSelectedClassName);
        this.options.selectedValue = null;
    },

    /**
     * Plays animation timeline (if disableOnTouchDevice is true and isTouchDevice, does nothing).
     * @return {void}
     */
    playAnimation: function () {
        var self = this,
            ops = self.options;
        if (ops.disableOnTouchDevice && ops.isTouchDevice) {
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
        if (ops.disableOnTouchDevice && ops.isTouchDevice) {
            return;
        }
        ops.timeline.reverse();
    },

    /**
     * Gets a drawn option element (from within wrapper) by value.
     * @param value
     */
    getOwnOptionElmByValue: function (value) {
        this.getUiElement('optionsElm')
            .find('[data-value="' + value +'"]');
    },

    /**
     * Gets the selected option's value (from within wrapper).
     * @returns {*}
     */
    getSelectedOwnOptionElmValue: function () {
        return this.getUiElement('optionsElm')
            .find('.' + this.options.ui.optionsElm.optionSelectedClassName)
            .find('a').attr('data-value');
    },

    /**
     * Get's an option element's value.
     * @param option
     * @returns {*} - null or option's value
     */
    getValueFromOptionElm: function (option) {
        var ops = this.options,
            value;

        // If no selection
        if (empty(option)) {
            return null;
        }

        // If we have a value attribute name, get value by attribute name
        if (isset(ops.valueAttribName)) {
            value = option.attr(ops.valueAttribName);
            console.log(value);
        }

        // Else use the option elements text
        return !isset(value) ? option.text() : value;
    },
    
    /**
     * Get's an option element's label.
     * @param option
     * @returns {*} - null or option's label
     */
    getLabelFromOptionElm: function (option) {
        var ops = this.options,
            label;

        // If no selection
        if (empty(option)) {
            return null;
        }

        // If we have a label attribute name, get label by attribute name
        if (isset(ops.labelAttribName)) {
            label = option.attr(ops.labelAtribName);
        }

        // Else use the option elements text
        return !isset(label) ? option.text() : label;
    }

});
