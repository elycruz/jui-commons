/**
 * Created by edelacruz on 11/15/13.
 */
// @todo refactor to use the position offset instead of offset.
// @todo create alternate indicator creation method (list of selectors?)
$.widget('jui.juiFloatingScrollIndicators', $.jui.juiBase, {
    options: {
        className: 'jui-floating-scroll-indicator',
        animation: {
            easing: Power3.easeOut,
            duration: 1
        },
        ui: {
            scrollableElm: 'html, body',
            wrapperElm: {
                elm: null,
                attribs: {
                    'class': 'indicator-wrapper'
                },
                appendTo: 'prepend to this.element',
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
        self.element.addClass(ops.className);

        // Populate initial ui elements
        self._autoPopulateUiElements(self, self.element, ops);

        self._createInidicators();

        // On resize reposition
        $(window).on('resize', function () {
            var indElms = self.getUiElement('inidicatorsNeededElms'),
                inds = self.getUiElement('indicatorElms');

            // Reposition indicator
            indElms.each(function (index, elm) {
                inds.eq(index).css('top', $(elm).offset().top);
            });
        });
    },

    _addEventListeners: function () {

    },

    _createInidicators: function () {
        var self = this,
            ops = self.options,
            createOps = ops.ui.inidicatorsNeededElms,
            wrapper = self.getUiElement('wrapperElm'),
            scrollableElm = self.getUiElement('scrollableElm'),
            indNeededElm,
            indElms;

        // Get elements that need a floating scroll indicator
        createOps.elm =
            indNeededElm =
                $(createOps.selector, this.element);

        // If no elements need floating scroll indicators, bail
        if (indNeededElm.length === 0) {
            return;
        }

        // Add indicators
        indNeededElm.each(function (index, elm) {
            elm = $(elm);

            // Inidicator template
            var nuIndElm = $('<div ' +
                'class="indicator" ' +
                'title="' + elm.text() + '"' +
                'data-index="' + index + '"></div>');

            // Append indicator
            wrapper.append(nuIndElm);

            // Position this indicator
            $('.indicator', wrapper).eq(index)
                    .css('top', elm.offset().top);

            nuIndElm.juiAffix({
                scrollableElm: scrollableElm,
                offset: {
                    top: (index + 1) * nuIndElm.height(),
                    bottom: ((indNeededElm.length - index)
                        * nuIndElm.height())
                }
            });
        });

        // Get indicators
        indElms =
            ops.ui.indicatorElms.elm =
                $(ops.ui.indicatorElms.selector, wrapper);

        // Add click listener to indicator
        indElms.click(function () {
            var elm = $(this),
                toElm = indNeededElm.eq(elm.attr('data-index')),
                val = parseInt(toElm.position().top + elm.height(), 10);
            TweenMax.to(scrollableElm, ops.animation.duration,
                {scrollTo: val});
        });
    }

});
