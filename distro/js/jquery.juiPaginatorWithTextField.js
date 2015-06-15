/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 9/1/13
 * Time: 1:15 AM
 * To change this template use File | Settings | File Templates.
 */

$.widget('jui.juiPaginatorWithTextField', $.jui.juiBasicPaginator, {

    // Options
    options: {
        template:
            '<a href="#" class="first-btn btn">&#124;&lt; First</a>' +
            '<a href="#" class="prev-btn btn">&lt; Prev</a>' +
            '<input type="text" size="4" class="text-field btn" />' +
            '<a href="#" class="next-btn btn">Next &gt;</a>' +
            '<a href="#" class="last-btn btn">Last &gt;&#124;</a>',

        className: 'jui-paginator-with-text-field jui-basic-paginator',

        ui: {
            itemsContainer: {
                selector: '> .content-pane > .items'
            },
            items: {
                selector: '> .content-pane > .items > .item',
                perPage: 12,
                create: false
            },
            textField: {
                elm: null,
                selector: '> .text-field',
                enabled: true,
                create: false
            },
            firstBtn: {
                create: false
            },
            prevBtn: {
                create: false
            },
            nextBtn: {
                create: false
            },
            lastBtn: {
                create: false
            }
        }
    },

    // Creation
    _create: function () {
        var self = this;
        self.element.addClass(self.options.className);
        // Call parent class' _create method
        self._super();
    },

    // ========================================================
    // Private
    // ========================================================
    _addEventListeners: function () {
        var self = this,
            ops = self.options,
            textFieldElm = self.getUiElement('textField');

        // Listen to calls on gotoPageNum and set the text
        self.element.on('juiPaginatorWithTextField:gotoPageNum', function (e, data) {
            if (parseInt(textFieldElm.val(), 10)
                !== parseInt(data.pointer, 10) + 1) {
                    textFieldElm.val(data.pointer + 1);
            }
        });

        // Text Field Element
        self.getTextFieldElm().bind('keyup', function (e) {
            var outgoing = {};

            // If the enter key was not pressed bail
            if (parseInt(e.keyCode, 10) !== 13) {
                return;
            }

            // Prelims
            var field = $(this), value = field.val();

            if (/\d+/.test(value)) {
                // goto page number
                if ((value - 1) > ops.pages.length) {
//                    throw new Error ('Range Exception: Paginator value entered is ' +
//                        'out of range.  Value entered: ' + value + '\n\n' +
//                        'proceeding to last page.');

                    // Proceed to greates page number
                    self._gotoPageNum(ops.pages.length);
                }
                else if ((value - 1) < 0) {
//                    throw new Error ('Range Exception: Paginator value entered is ' +
//                        'out of range.  Value entered: ' + value + '\n\n' +
//                        'Proceeding to first page.');

                    // Proceed to first page
                    self._gotoPageNum(0);
                }

                // Proceed to passed in page number
                self._gotoPageNum(value - 1);
            }
            else {
                outgoing.messages = ['Only numbers are allowed in the ' +
                    'paginator textfield.'];
            }

            if (typeof ops.ui.textField.callback === 'function') {
                // Set up some outgoing data for callbacks
                outgoing.items = ops.ui.items;
                outgoing.pages = ops.pages;
                ops.ui.textField.callback(outgoing);
            }
        });

        // Call the super classes add event listener method
        self._super();
    },

    // ========================================================
    // Getters and Setters
    // ========================================================
    getTextFieldElm: function () {
        return this.getUiElement('textField');
    }

});
