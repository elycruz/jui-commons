define([
    'backbone',
    'hbs!tmpl/item/jui-select-picker-view',
    'juiSelectPicker'
],
function (Backbone, tmpl) {
    'use strict';

    /* Return a ItemView class definition */
    return Backbone.Marionette.ItemView.extend({

        initialize: function () {
            console.log("initialize a Juiselectpickerview ItemView");
        },

        template: tmpl,

        onShow: function () {

            // Expands on click
            var $cats = $('#categories', this.$el).juiSelectPicker({
                    labelText: 'Select a Category:',

                    // Uses only one callback if both are set
                    // to the same mouse event
                    expandOn: 'click',
                    collapseOn: 'click'
                }),

            // Expands on hover
                $otherOptions = $('#other-options').juiSelectPicker({
                    labelText: 'Select an "Other Option":',
                    expandOn: 'mouseenter',
                    collapseOn: 'mouseleave'
                }),

            // Expands on hover
                $otherOptions3 = $('#example-3').juiSelectPicker({
                    ui: {
                        optionsElm: {
                            elm: $('#example-3 .options').eq(0)
                        },
                        buttonElm: {
                            elm: $('#example-3 button').eq(0)
                        }
                    },
                    skipDrawFromSelect: true,
                    labelText: 'Select an "Other Option":',
                    expandOn: 'mouseenter',
                    collapseOn: 'mouseleave'
                });

            $cats.on('change', function (e) {
                if (isset($cats.val())) {
                    $cats.juiSelectPicker('setLabelText',
                        'Select a Category: <span style="color:' +
                            ' #ff0000;">You\'ve chosen "' +
                            $cats.val() + '"<\span>.', 'html');
                }
            });

            // Toggle the select element
            $('.toggle-select-element').click(function () {
                var selElm = $(this).parent().find('select');
                if (selElm.attr('hidden') === 'hidden') {
                    selElm.attr('hidden', false);
                }
                else {
                    selElm.attr('hidden', 'hidden');
                }
            });

        }
    });

});
