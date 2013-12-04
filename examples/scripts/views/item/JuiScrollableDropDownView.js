define([
    'backbone',
    'hbs!tmpl/item/jui-scrollable-drop-down-view',
    'juiScrollableDropDown',
    'TweenMax'
],
    function (Backbone, tmpl) {
        'use strict';

        /* Return a ItemView class definition */
        return Backbone.Marionette.ItemView.extend({

            initialize: function () {
                console.log("initialize a Juiscrollabledropdownview ItemView");
            },

            template: tmpl,

            onShow: function () {
                // Example drop down using the height element property
                $('.test-scrollable-dropdown', this.$el)
                    .juiScrollableDropDown();

                $('.clipped-drop-down', this.$el)
                    .juiScrollableDropDown({
                        animations: [
                            {
                                type: 'to',
                                duration: 1,
                                elmAlias: 'contentElm',
                                props: {
                                    css: {
                                        clip: 'rect(-1px, 321px, 241px, -1px)'
                                    },
                                    ease: Bounce.easeOut
                                }
                            },
                            {
                                type: 'from',
                                duration: 0.3,
                                elmAlias: 'scrollbar',
                                props: {css: {opacity: 0}, delay: -0.10}
                            }
                        ]
                    });


            }
        });

    });
