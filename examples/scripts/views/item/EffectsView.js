define([
    'backbone',
    'hbs!tmpl/item/effects-view'
],
    function (Backbone, Effectsview) {
        'use strict';

        /* Return a ItemView class definition */
        return Backbone.Marionette.ItemView.extend({

            initialize: function () {
                console.log("initialize a Effectsview ItemView");
            },

            template: Effectsview,

            /* ui selector cache */
            ui: {},

            /* Ui events hash */
            events: {},

            /* on render callback */
            onShow: function () {
                // ===========================================================
                // Ticking Text Test
                // ===========================================================

                // Animate Header
                var timeline0 = new TimelineMax(),
                    span,
                    spans = $('.ticking-text').splitText().find('span');

                spans.each(function (i) {
                    span = $(this);
                    span.css({position: 'relative', display: 'inline-block'});
                });

                timeline0.to(spans, 9, {
                        css: {
                            scale: 100
                        },
                        delay: -0.08
                    });

                // ==============================================================
                // GSAP Test (@see greensock.com - Green Sock Animation Platform)
                // ==============================================================

//                // Create a timeline
//                var timeline = new TimelineMax({onComplete: function () {
//                        // Toggle Split Text to it's original text
//                        $gsapTest.splitText('toggleSplitText');
//                    }}),
//
//                // Get GSAP Test Element
//                    $gsapTest = $('.gsap-test').splitText(),
//                    $section = $('section');
//
//                // Animate split text parts
////                $section.each(function (i) {
////                    var section = $(this);
////                    timeline.from(section, 1.8, {left: -300, opacity: 0, delay: -1});
////                });
//
//                $('span', $gsapTest).each(function (i) {
//                    var span = $(this);
//                    span.css({position: 'relative', display: 'inline-block'});
//                    timeline.from(span, 0.16, {
//                        css: {
//                            scale: 3,
//                            rotation: -360,
//                            opacity: 0,
//                            top: -span.height() * 3,
//                            left: -span.width()
//                        },
//                        delay: -0.08
//                    })
//                        .from(span, 0.08, {css: {scale: 3}})
//                        .to(span, 0.08, {css: {scale: 1}, delay: -0.04});
//                });
            }
        });
    });
