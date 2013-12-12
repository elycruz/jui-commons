define([
    'backbone',
    'hbs!tmpl/item/jui-select-picker-view',
    'juiSelectPicker'
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

        initialize: function () {
            console.log("initialize a Juiselectpickerview ItemView");
        },

        template: tmpl,

        onShow: function () {

            // Expands on click
            var ui = this.ui,

                $cats = ui.catSelectElm.juiSelectPicker({
                    labelText: 'Select a Category:',
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
                labelText: '"Other Option":',
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
