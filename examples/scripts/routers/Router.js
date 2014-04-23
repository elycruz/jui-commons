define([
    'application',
    'backbone.marionette',
    'communicator'
], function (app, Marionette, communicator) {

    'use strict';

    return Marionette.AppRouter.extend({

        objAliasRegex: /^[a-z]+[a-z0-9\-_]*$/i,
        toCamelCaseDirtyRegex: /[^a-z0-9\-_]*/i,
        controllerNameSuffix: 'Controller',
        actionNameSuffix: 'Action',
        controllersDirName: 'controllers',

        routes: {
            '/': 'dispatch',
            '/:controller': 'dispatch',
            '/:controller/:action': 'dispatch',
            ':controller/:action': 'dispatch'
        },

        dispatch: function (controller, action) {
            controller = controller || 'index';
            action = action || 'index';

            var controllerClassName = this.getControllerClassName(controller),
                actionName = this.getActionName(typeof action !== 'function' ? action : 'index'),
                requestParams = Array.prototype.slice.call(arguments, 3)[0],
                E,

            // Set controller to the controller path
                entrypoint = this.controllersDirName
                    + '/' + controllerClassName;

            // Different paradigm
            communicator.mediator.trigger('routeTo:' + controllerClassName, {
                requestParams: $.extend({
                    controller: controller,
                    action: action,
                    actionName: actionName }, requestParams)
                });
        },

        dispatchIndex: function () {
           this. dispatch('index', 'index');
        },

        getControllerClassName: function (controllerAlias) {
            return this.getAliasToClassName(controllerAlias)
                + this.controllerNameSuffix;
        },

        getActionName: function (action) {
            return sjl.camelCase(action)
                + this.actionNameSuffix;
        },

        getAliasToClassName: function (alias) {
            // If controller alias pattern is not matched
            if (!this.objAliasRegex.test(alias)) {
                return null;
            }
            return sjl.camelCase(alias, true);
        }

    });

});
