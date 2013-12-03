/**
 * Created by ElyDeLaCruz on 10/1/13.
 * @todo finish up the refactor.  Maybe use/extend scrollable drop down or use it from within...
 */
$.widget('jui.juiSelectPicker3', $.jui.juiScrollableDropDown, {

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
                text: '',
                selector: '> .button',
                html: '<button></button>',
                appendTo: 'wrapperElm',
                create: true
            },
            contentElm: {
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

        // @todo fix ie8 and below bug with scrollbar
        if ($('html').hasClass('lt-ie9')) {
            console.log('** Note ** -- jquery.juiSelectPicker.js ' +
                'doesn\'t support anything less than Ie9 at the moment.');
        }

        // Hide this element and append new markup beside where it used
        // to be
        this.element.attr('hidden', 'hidden').css('display', 'none');

        // Populate ui elements on this (this.options.ui[elmKeyAlias])
//        this._populateUiElementsFromOptions();

        // Set button text/label
//        this.setLabelText();

        // Draw select options from this element onto our element
//        this._drawSelectOptions();

        // Call drop downs create
        this._super();
    },

    _drawSelectOptions: function () {
        var self = this,
            contentElm = self.getUiElement('contentElm'),
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
        contentElm.append(ul);

    },

    _addEventListeners: function () {
        var self = this,
            states = self.options.states,
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

        this._super();
    },

    _removeCreatedOptions: function () {
        this.getUiElement('contentElm').find('ul').remove();
    },

    destroy: function () {
        this.element.removeAttr('hidden');
        this._removeCreatedOptions();
        this._destroy();
        this._super();
    },

    refreshOptions: function () {
        this._removeCreatedOptions();
        this._drawSelectOptions();
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
            this.options.ui.contentElm.optionSelectedClassName);
        this.element.val(elm.attr('data-value')).trigger('change');
        console.log(this.element.val());
    },

    clearSelected: function () {
        this.getUiElement('contentElm')
            .find('> ul > li').removeClass(
                this.options.ui.contentElm.optionSelectedClassName);
    }

});
