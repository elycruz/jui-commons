/**
 * Created by edelacruz on 11/15/13.
 */
// @todo use Tween Max for animation here
// @todo create alternate indicator creation method (list of selectors?)
$.widget('jui.juiFloatingScrollIndicators', $.jui.juiBase, {
    options: {
        'class': 'jui-floating-scroll-indicator',
        ui: {
            scrollableElm: {
                elm: $('body').eq(0)
            },
            wrapperElm: {
                elm: null,
                attribs: {
                    'class': 'indicator-wrapper'
                },
                append: false,
                prepend: true,
                appendTo: 'this.element',
                selector: '> .indicator-wrapper',
                html: '<div></div>',
                create: true
            },
            indicatorElms: {
                elm: null,
                attribs: {
                    'class': 'indicator'
                },
                appendTo: 'wrapperElm',
                selector: '> .indicator',
                html: '<div></div>',
                create: false
            },
            inidicatorsNeededElms: {
                elm: null,
                selector: 'h2'
            }
        }
    },

    _create: function () {
        var self = this,
            ops = self.options;

        // Add class name to this element
        self.element.addClass(ops['class']);

        // Populate initial ui elements
        self._populateUiElementsFromOptions();
        self._createInidicators();
        $(window).scroll(function (e) {

        })
    },

    _addScrollListeners: function () {
    },

    _createInidicators: function () {
        var self = this,
            ops = self.options,
            createOps = ops.ui.inidicatorsNeededElms,
            wrapper = self.getUiElement('wrapperElm'),
            indNeededElm,
            indElms;

//        if (createOps.hasOwnProperty('selectors')
//            && createOps.selectors.length > 0) {
//            createOps.selectors.forEach(function (x) {
//                wrapper.append('<a href="class="indicator"></div>');
//            });
//        }

        // By Selector
        // -------------------------------------------------------
        // -------------------------------------------------------
        // Get elements that need a floating scroll indicator
        indNeededElm = $(createOps.selector, this.element);

        // If no elements need floating scroll indicators, bail
        if (indNeededElm.length === 0) {
            return;
        }

        // Add indicators
        indNeededElm.each(function (index, elm) {
            elm = $(elm);
            wrapper.append('<div ' +
                'class="indicator" ' +
                'title="' + elm.text() + '"' +
                'data-index="' + index + '"></div>');
        });

        // Get indicators
        indElms = ops.ui.indicatorElms.elm =
            $(ops.ui.indicatorElms.selector, wrapper);

        // Add click listener to indicator
        indElms.click(function (e) {
            var elm = $(this),
            toElm = indNeededElm.eq(elm.attr('data-index'));
            self.ui.scrollableElm.animate({
                scrollTop: toElm.offset().top}, 300);
        });
    }

});