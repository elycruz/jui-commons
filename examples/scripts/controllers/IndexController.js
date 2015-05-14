define([
    'backbone.marionette',
    'communicator',
    'controllers/BaseController',
    'views/layout/MainLayout',
    'views/item/EffectsView',
    'views/item/JuiBasicPaginatorView',
    'views/item/JuiScrollableDropDownView',
    'views/item/JuiFloatingScrollIndicatorsView',
    'views/item/JuiScrollPaneView',
    'views/item/JuiSelectPickerView',
    'views/item/JuiAffixView',
    'views/item/JuiDialogView',
    'jquery-mousewheel'
],
    function (
        Marionette,
        communicator,
        BaseController,
        Layout,
        EffectsView,
        JuiBasicPaginatorView,
        JuiScrollableDropdownView,
        JuiFloatingScrollIndicatorsView,
        JuiScrollPaneView,
        JuiSelectPickerView,
        JuiAffixView,
        JuiDialogView
) {

        'use strict';

        return Marionette.Controller.extend({

            defaultRequestParams: {},
            requestParams: {},
            viewClassSuffix: 'View',

            initialize: function () {
                var self = this;
                self.layout = new Layout();
                communicator.mediator.on('routeTo:IndexController', function (data) {
                    if ($.isPlainObject(data) && !sjl.empty(data.requestParams)) {
                        self.mergeRequestParams(data.requestParams);
                    }
                    self.dispatch();
                });
            },
            
            setRequestParams: function(requestParams) {
                this.requestParams = requestParams;
                return this;
            },

            mergeRequestParams: function(requestParams) {
                $.extend(true, this.requestParams, requestParams);
                return this;
            },

            getRequestParams: function() {
                return this.requestParams;
            },

            getViewClassName: function () {
                return sjl.camelCase(this.requestParams.action
                    + this.viewClassSuffix, true);
            },
            
            showView: function () {
                var self = this,
                    viewConstructor = eval(this.getViewClassName()),
                    view = new viewConstructor();
                    self.layout.mainColRegion.show(view);
            },

            dispatch: function (actionName) {
                if (sjl.isset(this[actionName]) && typeof this[actionName] === 'function') {
                    this[actionName]();
                }
                if (sjl.isset(this.showView) && typeof this.showView === 'function') {
                    this.showView();
                }
            }

        });

    });
