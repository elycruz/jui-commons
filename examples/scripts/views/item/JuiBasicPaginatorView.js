define([
    'backbone',
    'hbs!tmpl/item/jui-basic-paginator-view',
    'gsap-scrollto-plugin'
],
    function (Backbone, tmpl) {

        'use strict';

        /* Return a ItemView class definition */
        return Backbone.Marionette.ItemView.extend({

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
                    items = $('.items', contentPanes),
                    paginator1 = self.ui.example1.juiBasicPaginator({ ui: {items: { perPage: 9 }} }),
                    paginator2 = self.ui.example2.juiPaginatorWithTextField({ ui: {items: { perPage: 12 }} }),
                    contentPane1,
                    contentPane2;

                contentPane1 = items.eq(0);
                contentPane1.css('overflow', 'auto');
                contentPane2 = items.eq(1);
                contentPane2.css('overflow', 'hidden');

                paginator1.bind('juiBasicPaginator:gotoPageNum', function (e, data) {
                    TweenMax.to(contentPane1, 0.38,
                        {scrollTo: {y: data.pointer * contentPane1.height()}});
                });

                paginator2.bind('juiPaginatorWithTextField:gotoPageNum', function (e, data) {
                    TweenMax.to(contentPane2, 0.38,
                        {scrollTo: {y: data.pointer * contentPane2.height()}});
                });
            }

        });
    });

