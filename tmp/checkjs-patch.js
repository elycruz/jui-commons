/**
 * Defines argsToArray, classOfIs, classOf, empty, and isset on the passed in context.
 * @param {Object} context
 * @returns void
 * @todo make all functions ecmascript < 5 compatible
 */
(function (context) {

    var slice = Array.prototype.slice;

    if (typeof context.argsToArray !== 'function') {
        context.argsToArray = function (args) {
            return slice.call(args, 0, args.length);
        };
    }

    if (typeof context.isset !== 'function') {

        /**
         * Checks to see if value is set (not null and not undefined).
         * @param value
         * @returns {boolean}
         */
        function isSet(value) {
            return (value !== undefined && value !== null);
        }

        /**
         * Checks to see if any of the arguments passed in are
         * set (not undefined and not null).
         * Returns false on the first argument encountered that
         * is null or undefined.
         * @returns {boolean}
         */
        context.isset = function () {
            var retVal = false,
                check;

            if (arguments.length > 1) {
                for (var i in  arguments) {
                    i = arguments[i];
                    check = isSet(i);
                    if (!check) {
                        retVal = check;
                        break;
                    }
                }
            }
            else if (arguments.length === 1) {
                retVal = isSet(arguments[0]);
            }

            return retVal;
        };
    }

    if (typeof context.classOf !== 'function') {
        /**
         * Returns the class name of an object from it's class string.
         * @param val {mixed}
         * @returns {string} - Returns "Null or Undefined" for ie lt 8 on null and undefined
         */
        context.classOf = function (val) {
            var rslt = (Object.prototype.toString.call(val)).split(/\[object\s/);
            var splitThis = (rslt.length === 1 ? rslt[0] : (rslt.length > 1 ? rslt[1] : 0));
            return splitThis === 0 ? 'Null  or Undefined' : splitThis.split(']')[0];
        };
    }

    if (typeof context.classOfIs !== 'function') {

        /**
         * Checks to see if an object is of type humanString (class name) .
         * @param humanString {string} (class string; I.e., "Number", "Object", etc.)
         * @param obj {mixed}
         * @returns {boolean}
         */
        context.classOfIs = function (obj, humanString) {
            return classOf(obj) === humanString;
        };
    }

    if (typeof context.empty !== 'function') {
        /**
         * Checks object's own properties to see if it is empty.
         * @param obj object to be checked
         * @returns {boolean}
         */
        function isEmptyObj(obj) {
            var retVal = obj === true ? false : true;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    retVal = false;
                    break;
                }
            }
            return retVal;
        }

        /**
         * Checks to see if value is empty (objects, arrays,
         * strings etc.).
         * @param value
         * @returns {boolean}
         */
        function isEmptyValue(value) {
            var retVal;

            // If value is an array or a string
            if (classOfIs(value, 'Array') || classOfIs(value, 'String')) {
                retVal = value.length === 0;
            }

            // If value is a number and is not 0
            else if (classOfIs(value, 'Number') && value !== 0) {
                retVal = false;
            }

            // Else
            else {
                retVal = (value === 0 || value === false
                    || value === undefined || value === null
                    || isEmptyObj(value));
            }

            return retVal;
        }

        /**
         * Checks to see if any of the arguments passed in are empty.
         * @returns {boolean}
         */
        context.empty = function () {
            var retVal, check,
                i, item,
                args = context.argsToArray(arguments);

            // If multiple arguments
            if (args.length > 1) {

                // No empties empties until proven otherwise
                retVal = false;

                // Loop through args and check their values
                for (i = 0; i < args.length - 1; i += 1) {
                    item = args[i];
                    check = isEmptyValue(item);
                    if (check) {
                        retVal = true;
                        break;
                    }
                }
            }

            // If one argument
            else if (args.length === 1) {
                retVal = isEmptyValue(args[0]);
            }

            // If no arguments
            else {
                retVal = true;
            }

            return retVal;
        };
    }

})(typeof window !== "undefined" ? window : global);/**
 * Created by edelacruz on 4/10/2014.
 */
