/**
 * Created by edelacruz on 2/3/14.
 */
/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 1:15 AM
 * To change this template use File | Settings | File Templates.
 */
$.widget('jui.juiMouse', {

    options: {
        mouseX: null,
        mouseY: null,
        relMouseX: null,
        relMouseY: null
    },

    mouseX: function () {
        return this.options.mouseX;
    },

    mouseY: function () {
        return this.options.mouseY;
    },

    relMouseX: function () {
        return this.options.relMouseX;
    },

    relMouseY: function () {
        return this.options.relMouseY;
    },

    hitTest: function (elm) {
        var self = this,
            offset = self.getBoundingBox(elm),
            retVal = false,
            ops = self.options;

        // Check if mouse is within bounds
        return (ops.mouseX >= offset.left
            && ops.mouseX <= offset.right) ||
            (ops.mouseY >= offset.top
                && ops.mouseY <= offset.bottom)
    },

    getRelativeMouse: function (elm) {
        var self = this,
            offset = self.getBoundingBox(elm),
            ops = self.options;

        return {
            mouseX: ops.mouseX - offset.left,
            mouseY: ops.mouseY - offset.top
        };
    },

    getBoundingBox: function (elm) {
        var offset = elm.offset();

        offset = offset ? offset : {top: 0, left: 0};

        return {
            top: offset.top,
            right: offset.left + elm.outerWidth(),
            bottom: offset.top + elm.outerHeight(),
            left: offset.left
        };
    },

    _create: function () {},

    _init: function () {
        var self = this,
            ops = self.options;

        self.element.mousemove(function (e) {
            var relMouse = self.getRelativeMouse(self.element);
            ops.mouseX = e.clientX;
            ops.mouseY = e.clientY;
            ops.relMouseX = relMouse.mouseX;
            ops.relMouseY = relMouse.mouseY;
        });
    }

});