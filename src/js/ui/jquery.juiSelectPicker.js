/**
 * Created by ElyDeLaCruz on 10/1/13.
 *
 * Hides a Select Element and Replaces it with a scrollable Select Picker element
 * which is fully stylable.
 *
 * @class jquery.juiSelectPicker
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
         * Collapse on event
         * @type {String}
         */
        collapseOn: 'click',

        /**
         * Expand on event
         * @type {String}
         */
        expandOn: 'click',

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
                timeline: new TimelineLite(),
                suggestedExpandHeight: null
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
                optionSelectedClassName: 'selected',
                suggestedExpandHeight: null
            }
        }
    },

    /**
     * Sets flag if touch device (used for disable plugin if options.disableOnTouchDevice
     * is true).
     * @private
     */
    _create: function () {
        this._super();
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

        if (ops.disableOnTouchDevice && ops.isTouchDevice) {
            return;
        }

        // Resolve class name
        if (!sjl.empty(className)) {
            if (!sjl.empty(currentClassName)
                && typeof currentClassName === 'string') {
                ops.ui.wrapperElm.attribs['class'] += ' ' + className;
            }
            else {
                ops.ui.wrapperElm.attribs['class'] = className;
            }
        }

        // Timeline
        this.options.timeline = new TimelineLite({paused: true});

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
            ops = self.options,
            suggestedExpandHeight = 0;

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

            // Preselect item if necessary
            if (sjl.isset(ops.selectedValue) &&
                (ops.selectedValue === value)) {
                if (!sjl.empty(liClassValue)) {
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
            classValue = !sjl.empty(classValue) ? 'class="' + classValue + '" ' : '';
            value = ' data-value="' + value + '" ';

            // Build list element
            var li = $('<li' + liClassValue + '><a ' + classValue + 'href="javascript: void(0);"'
                + value + '>' + label + '</a></li>');

            // Add first class
            if (i === 0 && !sjl.empty(ops.ui.buttonElm.text)) {
                li.addClass('first');
            }
            else if (i === 1 && sjl.empty(ops.ui.buttonElm.text)) {
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

        // Get height of first ul > li element
        options = $('li', optionsElm);

        // Get suggested expand height
        options.each(function () {
            var elm = $(this),
            padding = parseInt(elm.css('padding'));
            padding = padding === 0 ? parseInt(elm.css('paddingTop'), 10) : 0;
            padding = padding === 0 ? parseInt(elm.css('paddingBottom'), 10) : 0;
            suggestedExpandHeight += elm.height() + (padding * 2);
        });

        // Set suggested expand height
        ops.ui.optionsElm.suggestedExpandHeight = suggestedExpandHeight;
    },

    /**
     * Adds event listeners for:
     * - wrapper - mouseup;
     * - wrapper - a[data-value] click;
     * @private
     */
    _addEventListeners: function () {
        var self = this,
            ops = self.options,
            wrapperElm = self.getUiElement('wrapperElm');

        // Option/A-Tag click
        wrapperElm.on('mouseup', 'a[data-value]', function (e) {
            var elm = $(e.currentTarget);
            self.clearSelected();
            self.setSelected(elm);
            // If mouseleave event force the select picker to collapse
            // via scrollable dropdown
            if (ops.collapseOn === 'mouseleave') {
                wrapperElm.trigger(ops.collapseOn);
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
            dropDown,
            dropDownOptions,
            tween,
            tweens;

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
        if (sjl.isset(ops.expandOn)) {
            dropDownOptions.expandOn = ops.expandOn;
        }

        // Set collapses on event value
        if (sjl.isset(ops.collapseOn)) {
            dropDownOptions.collapseOn = ops.collapseOn;
        }

        // Apply scrollable drop down on wrapper element
        dropDown = wrapperElm.juiScrollableDropDown(dropDownOptions);

        // If less than ie 9 bail
        if (ops.isLessThanIE9) {
            return;
        }

        // Get the dropdowns timeline
        timeline = dropDown.juiScrollableDropDown('getAnimationTimeline');
        timeline.seek(0);
        timeline.clear();
        timeline.pause();

        // Get scrollbar element
        scrollbarElm = $('.vertical.scrollbar', wrapperElm);

        // Add custom tweens for select picker animation
        tweens = [
            TweenLite.to(wrapperElm, duration, {height: self.getSuggestedWrapperExpandHeight()}),
            TweenLite.to(contentElm, duration, {height: self.getSuggestedContentExpandHeight(), autoAlpha: 1, delay: -0.34}),
            TweenLite.to(scrollbarElm, duration, {opacity: 1, delay: -0.21})
        ];

        // Supply new tweens
        for (tween = 0; tween < tweens.length; tween += 1) {
            timeline.add(tweens[tween]);
        }

        // Set drop down on self for access later
        self.options.dropDownElm = dropDown;
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
     * @returns {void}
     */
    refreshOptions: function () {
        this.options.selectedValue = this.getSelectedOwnOptionElmValue();
        this._removeCreatedOptions();
        this._drawSelectOptions();
        this.setLabelText();
        this.refreshScrollbar();
    },

    refresh: function () {
       this.refreshOptions();
    },

    /**
     * @todo remove this function and use external components refresh method instead
     */
    refreshScrollbar: function () {
        this.options.dropDownElm.juiScrollableDropDown('refresh');
    },

    getSuggestedWrapperExpandHeight: function () {
        var self = this,
            wrapperElm = self.getUiElement('wrapperElm'),
            maxHeight = self.getMaxHeightFromElm(wrapperElm) || 220,
            wrapperPaddingTopBottomSum = self.getWrapperElmPaddingTopBottomSum(),
            suggestedExpandHeight = self.getSuggestedContentExpandHeight()
            + (wrapperPaddingTopBottomSum <= -1 ? 0 : wrapperPaddingTopBottomSum);

        // Return suggested height
        return suggestedExpandHeight > maxHeight ? maxHeight : suggestedExpandHeight;
    },

    getSuggestedContentExpandHeight: function () {
        var self = this,
            optionsElm = self.getUiElement('optionsElm'),
            optionsMaxHeight = self.getMaxHeightFromElm(optionsElm),
            suggestedOptionsHeight = self.options.ui.optionsElm.suggestedExpandHeight;

        return suggestedOptionsHeight > optionsMaxHeight ? optionsMaxHeight : suggestedOptionsHeight;
    },

    getWrapperElmPaddingTopBottomSum: function () {
        var self = this,
            wrapperElm = self.getUiElement('wrapperElm'),
            optionsElm = self.getUiElement('optionsElm'),
            optionsElmMaxHeight = self.getMaxHeightFromElm(optionsElm) || 180,
            wrapperElmMaxHeight = self.getMaxHeightFromElm(wrapperElm) || 220;

        return wrapperElmMaxHeight - optionsElmMaxHeight;
    },

    getMaxHeightFromElm: function (elm) {
        var maxHeight = elm.css('max-height');
        return sjl.classOfIs(maxHeight, 'String') ?
            parseInt(maxHeight) : maxHeight;
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
        usePrefixAndSuffix = sjl.isset(usePrefixAndSuffix)
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
        text = text || (!sjl.empty(this.options.ui.buttonElm.text)
            ? this.options.ui.buttonElm.text
            : (!sjl.empty(this.options.labelText) ? this.options.labelText :
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
        elm.parent().addClass(this.options.ui.optionsElm.optionSelectedClassName);
        this.options.selectedValue = elm.attr('data-value');
        this.element.val(elm.attr('data-value')).trigger('change');
        this.setSelectedItemLabelText(this.options.selectedValue);
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
        if ((ops.disableOnTouchDevice && ops.isTouchDevice)
        || (ops.isLessThanIE9)) {
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
        if ((ops.disableOnTouchDevice && ops.isTouchDevice)
            || (ops.isLessThanIE9)) {
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
        if (sjl.empty(option)) {
            return null;
        }

        // If we have a value attribute name, get value by attribute name
        if (sjl.isset(ops.valueAttribName)) {
            value = option.attr(ops.valueAttribName);
        }

        // Else use the option elements text
        return !sjl.isset(value) ? option.text() : value;
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
        if (sjl.empty(option)) {
            return null;
        }

        // If we have a label attribute name, get label by attribute name
        if (sjl.isset(ops.labelAttribName)) {
            label = option.attr(ops.labelAttribName);
        }

        // Else use the option elements text
        return !sjl.isset(label) ? option.text() : label;
    }

});
