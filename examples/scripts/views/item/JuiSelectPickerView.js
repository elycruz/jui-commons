define([
    'backbone',
    'hbs!tmpl/item/jui-select-picker-view'
],
    // @todo select picker needs to close when you click outside of it
function (Backbone, tmpl) {
    'use strict';

    /* Return a ItemView class definition */
    return Backbone.Marionette.ItemView.extend({

        ui: {
            example1: '#categories',
            example2: '#other-options',
            example3: '#other-options-2'
        },

        template: tmpl,

        onShow: function () {

            // Expands on click
            var ui = this.ui,

            // Example 1 - expands on click
            $example1 = ui.example1.juiSelectPicker({
                useSelectedLabelPrefixAndSuffix: true,
                labelText: 'Select a Category:',
                skipFirstOptionItem: true,
                expandOn: 'click',
                collapseOn: 'click'
            }),

            // Example 2 - expands on hover
            $example2 = ui.example2.juiSelectPicker({
                wrapperElm: {
                    selector: '.jui-select-picker-example-1',
                    attribs: {
                        'class': 'jui-select-picker jui-select-picker-example-1'
                    }
                },
                useSelectedLabelPrefixAndSuffix: true,
                selectedLabelPrefix: '< "',
                selectedLabelSuffix: '" >',
                skipFirstOptionItem: true,
                labelText: '"Option":',
                expandOn: 'mouseenter',
                collapseOn: 'mouseleave'
            }),

            // Example 3 - expands on hover and has no value attributes in select element
            $example3 = ui.example3.juiSelectPicker({
                wrapperElm: {
                    selector: '.jui-select-picker-example-1',
                    attribs: {
                        'class': 'jui-select-picker jui-select-picker-example-1'
                    }
                },
                useSelectedLabelPrefixAndSuffix: true,
                selectedLabelPrefix: '< "',
                selectedLabelSuffix: '" >',
                skipFirstOptionItem: true,
                labelText: '"Option":',
                expandOn: 'mouseenter',
                collapseOn: 'mouseleave'
            });

            // Trigger tests
            $example1.juiSelectPicker('getUiElement', 'wrapperElm').on('expand',function (e) {
//                console.log('An "expand" event has occurred on example 1');
            }).on('collapse', function (e) {
//                console.log('A "collapse" event has occurred on example 2');
            });

            // Toggle the select element
            $('.toggle-select-element').click(function () {
                var selElm = $(this).parent().find('select');
                if (selElm.attr('hidden') === 'hidden') {
                    selElm.attr('hidden', false);
                    selElm.css('display', 'block');
                }
                else {
                    selElm.attr('hidden', 'hidden');
                    selElm.css('display', 'none');
                }
            });

            $('.add-items-to-select-element').click(function () {
                $example1.append('<option> Random element' + Math.random() + '</option>')
                $example1.juiSelectPicker('refreshOptions');
            });

            $('.btn.refresh', this.$el).click(function () {
                $example1.juiSelectPicker('refreshOptions');
            });

        },

        onClose: function () {
            var ui = this.ui;
            ui.example1.juiSelectPicker('destroy');
            ui.example2.juiSelectPicker('destroy');
            delete ui.example1;
            delete ui.example2;
        }
    });

});
