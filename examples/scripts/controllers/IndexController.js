define([
    'controllers/BaseController',
    'views/item/WelcomeItemView',
    'views/layout/MainLayout',
    'juiBase'
],
    function (BaseController, IndexView, Layout) {
        'use strict';

        return BaseController.extend({

            initialize: function (options) {
                this.layout = new Layout();
            },

            indexAction: function () {
                this.showView();
            },

            juiScrollPaneAction: function () {
                this.showView();
            },

            juiSelectPickerAction: function () {
                this.showView();
            },

            juiScrollableDropDownAction: function () {
                this.showView();
            },

            showView: function () {
                var self = this;
                require(['views/item/'
                    + this.getViewClassName()], function (View) {
                    var view = new View();
                    self.layout.mainColRegion.show(view);
                });
            },

            getViewClassName: function () {
                return strToCamelCase(this.options.requestParams.action)
                    + 'View';
            }

        });

    });
