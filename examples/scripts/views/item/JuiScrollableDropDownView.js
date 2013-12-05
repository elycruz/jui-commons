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
                    .juiScrollableDropDown({
                        state: 'expanded',
                        animations: [
                            {
                                type: 'to',
                                duration: 0.3,
                                elmAlias: 'contentElm',
                                props: {css: {height:240}},
                                preInit: function () {
                                    this.getUiElement('contentElm')
                                        .height(0);
                                    console.log('hello')
                                }
                            },
                            {
                                type: 'to',
                                duration: 0.3,
                                elmAlias: 'scrollbar',
                                props: {opacity: 1, delay: -0.10}
                            }
                        ]
                    });

                $('.clipped-drop-down', this.$el)
                    .juiScrollableDropDown({
                        animations: [
                            {
                                type: 'to',
                                duration: 0.3,
                                elmAlias: 'contentElm',
                                props: {
                                    css: {
                                        clip: 'rect(-1px, 321px, 241px, -1px)'
                                    }
                                }
                            },
                            {
                                type: 'to',
                                duration: 0.16,
                                elmAlias: 'scrollbar',
                                props: {opacity: 1, delay: -0.10}
                            }
                        ]
                    });


            }
        });

    });
