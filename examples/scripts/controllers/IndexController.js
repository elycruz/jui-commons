define([
    'backbone.marionette',
    'communicator',
    'controllers/BaseController',
    'views/layout/MainLayout',
//    'hbs!tmpl/item/effects-view',
//    'hbs!tmpl/item/jui-basic-paginator-view',
//    'hbs!tmpl/item/jui-floating-scroll-indicators-view',
//    'hbs!tmpl/item/jui-scroll-pane-view',
//    'hbs!tmpl/item/jui-scrollable-drop-down-view',
//    'hbs!tmpl/item/jui-select-picker-view',
    'views/item/EffectsView',
    'views/item/JuiBasicPaginatorView',
    'views/item/JuiScrollableDropDownView',
    'views/item/JuiFloatingScrollIndicatorsView',
    'views/item/JuiScrollPaneView',
    'views/item/JuiSelectPickerView',
    'juiBase',
    'jquery-mousewheel'
],
    function (
        Marionette,
        communicator,
        BaseController,
        Layout,
        EffectsView,
        JuiBasicPaginatorView,
        JuiScrollableDropDownView,
        JuiFloatingScrollIndicatorsView,
        JuiScrollPaneView,
        JuiSelectPickerView) {

        'use strict';

        return Marionette.Controller.extend({

            defaultRequestParams: {},
            requestParams: {},
            viewClassSuffix: 'View',
            initialize: function () {
                var self = this;
                self.layout = new Layout();
                communicator.mediator.on('routeTo:IndexController', function (data) {
                    if ($.isPlainObject(data) && !empty(data)) {
                        self.mergeRequestParams(data);
                    }
                    self.dispatch();
                });
            },
            
            setRequestParams: function(requestParams) {
                this.options.requestParams = requestParams;
                return this;
            },
            mergeRequestParams: function(requestParams) {
                $.extend(true, this.options.requestParams, requestParams);
                return this;
            },
            getRequestParams: function() {
                return this.options.requestParams;
            },
            getViewClassName: function () {
                return strToCamelCase(this.options.requestParams.action
                    + this.viewClassSuffix);
            },
            
            showView: function () {
                var self = this,
                    view = new this.getViewClassName();
                self.layout.mainColRegion.show(view);
            },

            dispatch: function (actionName) {
                if (isset(this[actionName]) && typeof this[actionName] === 'function') {
                    this[actionName]();
                }
                if (isset(this.showView) && typeof this.showView === 'function') {
                    this.showView();
                }
            }
//
//            getViewClassName: function () {
//                return strToCamelCase(
//                    this.options.requestParams.action)
//                    + 'View';
//            }

        });

    });
