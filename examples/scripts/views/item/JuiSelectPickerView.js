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
            catSelectElm: '#categories',
            otherSelectElm: '#other-options'
        },

        template: tmpl,

        onShow: function () {

            // Expands on click
            var ui = this.ui,

                $cats = ui.catSelectElm.juiSelectPicker({
                    useSelectedLabelPrefixAndSuffix: true,
                    labelText: 'Select a Category:',
                    skipFirstOptionItem: true,
                    expandOn: 'click',
                    collapseOn: 'click'
                }),

            // Expands on hover
            $otherOptions = ui.otherSelectElm.juiSelectPicker({
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
//                labelText: '"Other Option":',
                expandOn: 'mouseenter',
                collapseOn: 'mouseleave'
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
                $cats.append('<option> Random element' + Math.random() + '</option>')
                $cats.juiSelectPicker('refreshOptions');
            });
        },

        onClose: function () {
            var ui = this.ui;
            ui.catSelectElm.juiSelectPicker('destory');
            ui.otherSelectElm.juiSelectPicker('destory');
            delete ui.catSelectElm;
            delete ui.otherSelectElm;
        }
    });

});
