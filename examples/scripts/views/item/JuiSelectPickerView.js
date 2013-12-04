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
                        ui: {
                            wrapperElm: {
                                selector: '.jui-select-picker-example-1',
                                attribs: {
                                    'class': 'jui-select-picker jui-select-picker-example-1'
                                }
                            }
                        },
                        labelText: 'Select an "Other Option":',
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

            }
        });

    });
