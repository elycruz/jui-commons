/**
 * Created with JetBrains WebStorm.
 * User: ElyDeLaCruz
 * Date: 8/31/13
 * Time: 8:38 PM
 * To change this template use File | Settings | File Templates.
 */
// On window load
$(function () {

    // ===========================================================
    // Ticking Text Test
    // ===========================================================

    // Animate Header
    // /Animate Header
    $('.ticking-text').eq(0).tickingText({
        revertTextOnCompletion: true
    }) ;

//        .on('ticking-text:complete', function () {
//
//            // Animate Paragraph once Header is done
            $('.ticking-text.paragraph').tickingText({
                delayPerChar: 10,
                charChangeSpeeds: 10,
                charChangeReps: 10,
                fadeInSpeed: 1500
            });
//
//        });

    // ==============================================================
    // GSAP Test (@see greensock.com - Green Sock Animation Platform)
    // ==============================================================

    // Create a timeline
    var timeline = new TimelineMax({onComplete: function () {
        // Toggle Split Text to it's original text
        $gsapTest.splitText('toggleSplitText');
    }}),

    // Get GSAP Test Element
    $gsapTest = $('.gsap-test').splitText(),
    $section = $('section');

    // Animate split text parts
//    $section.each(function(i) {
//        var section = $(this);
////        timeline.from(section, 1.8, {left: - 300, opacity: 0, delay: -1});
//    });

    $('span', $gsapTest).each(function (i) {
        var span = $(this);
            span.css({position: 'relative', display: 'inline-block'});
            timeline.from(span, 0.16, {
                css: {
                    scale: 3,
                    rotation: -360,
                    opacity: 0,
                    top: - span.height() * 3,
                    left: - span.width()
                },
                delay: -0.08
            })
            .from(span, 0.08, {css: {scale: 3}})
            .to(span, 0.08, {css: {scale: 1}, delay: -0.04});
    });

});
// /On Window Load