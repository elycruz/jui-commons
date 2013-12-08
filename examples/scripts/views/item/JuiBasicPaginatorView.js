define([
    'backbone',
    'hbs!tmpl/item/jui-basic-paginator-view',
    'juiScrollPane',
    'juiBasicPaginator',
    'juiPaginatorWithTextField'
],
    function (Backbone, tmpl) {
        'use strict';

        /* Return a ItemView class definition */
        return Backbone.Marionette.ItemView.extend({

            initialize: function () {
                console.log("initialize a JuiBasicPaginator ItemView");
            },

            className: 'grid-100 jui-paginators-example',

            template: tmpl,

            /* ui selector cache */
            ui: {
                example1: '.basic-paginator-controls-example',
                content1: '.basic-paginator-controls-example .content-pane',
                example2: '.paginator-with-textfield-example',
                content2: '.paginator-with-textfield-example .content-pane'
            },

            /* on render callback */
            onShow: function () {
                var self = this,
                    contentPanes = $('.content-pane', this.$el),
                    contentPane1,
                    contentPane2,
                    items = $('.items', contentPanes),
                    paginator1 = null, //self.ui.example1.juiBasicPaginator(),
                    paginator2 = self.ui.example2.juiPaginatorWithTextField({
                        skipPagesCalculation: true,
                        pages: {length: 9},
                        ui: {
                            items: {
                                elm: items.eq(1),
                                perPage: 12
                            }
                        }
                    });

                contentPane2 = contentPanes.eq(1).juiScrollPane({ ui: {
                    contentHolder: {
                        selector: ' .items'
                    }
                } });
//
//                paginator1.bind('juiBasicPaginator:gotoPageNum', function (e, data) {
//                    console.log('result', data);
//                });

                paginator2.bind('juiPaginatorWithTextField:gotoPageNum', function (e, data) {
                    contentPane2.juiScrollPane('scrollVertically',
                        data.pointer * contentPane2.height());
                });

            }
        });

    });
