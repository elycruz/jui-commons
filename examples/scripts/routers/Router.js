define(['application', 'backbone.marionette'], function (app, Marionette) {

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
                actionName = this.getActionName(action || 'index'),
                requestParams = Array.prototype.slice.call(arguments, 3)[0],
                E,

            // Set controller to the controller path
                entrypoint = this.controllersDirName
                    + '/' + controllerClassName;

            require([entrypoint], function (Entrypoint) {
                
                E = new Entrypoint({
                    requestParams: $.extend({
                        controller: controller,
                        action: action}, requestParams)
                });

                //                E.mergeRequestParams();

                if (typeof E[actionName] === 'function') {
                    E[actionName]();
                }
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
            return strToCamelCase(action, true)
                + this.actionNameSuffix;
        },

        getAliasToClassName: function (alias) {
            // If controller alias pattern is not matched
            if (!this.objAliasRegex.test(alias)) {
                return null;
            }
            return strToCamelCase(alias);
        }

    });
});