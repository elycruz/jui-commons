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

            ui: {
                test1Elm: '.test-scrollable-dropdown',
                test2Elm: '.clipped-drop-down'
            },

            initialize: function () {
                console.log("initialize a Juiscrollabledropdownview ItemView");
            },

            template: tmpl,

            onShow: function () {
                var ui = this.ui;

                // Example drop down using the height element property
                ui.test1Elm
                    .juiScrollableDropDown({
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

                ui.test2Elm
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


            },

            onClose: function () {
                var ui = this.ui;
                ui.test1Elm.juiSelectPicker('destory');
                ui.test2Elm.juiSelectPicker('destory');
                delete ui.test2Elm;
                delete ui.test1Elm;
            }
        });

    });
