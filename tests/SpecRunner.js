require.config({
    baseUrl: '../scripts',
    urlArgs: 'cb=' + Math.random(),
    deps: [
        'es5shim', 'es5sham',
        'jquery',
        'modernizr',
        'phpjs',
        'saks.core',
        'saks.mediator',
        'TweenMax'
    ],
    shim: {
        main: {
            deps: ['phpjs', 'stache']
        },
        'jui-commons': {
            deps: ['jquery', 'jquery-ui']
        },
        'jquery-ui': {
            deps: ['jquery']
        },
        'jquery.mousewheel': {
            deps: ['jquery-ui']
        },
        'jquery.saksScrollPane': {
            deps: ['jquery.mousewheel']
        },
        'jquery.saksSimpleTabs': {
            deps: ['jquery-ui']
        },
        'jquery.debouncedresize': {
            deps: ['jquery']
        },
        'saksZoomPlayer': {
            deps: ['jquery', 'jwplayer', 'underscore',
                'saks.core', 'saks.mediator']
        },
        'saksVideoPlayer': {
            deps: ['jquery', 'jwplayer', 'underscore',
                'saks.core', 'saks.mediator']
        },
        'saks.mediator': {
            deps: ['saks.core']
        },
        'saks.location': {
            deps: ['saks.core']
        }
    },
    paths: {
        'spec': '../test/spec',

        'es5shim': '../bower_components/es5-shim/es5-shim.min',
        'es5sham': '../bower_components/es5-shim/es5-sham.min',
        'es5sham.map': '../bower_components/es5-shim/es5-sham.map.min',

        'amplify.store': '../bower_components/amplify/lib/amplify.store',
        'backbone': '../bower_components/backbone-amd/backbone',
        'backbone.marionette': '../bower_components/backbone.marionette/lib/core/amd/backbone.marionette',
        'backbone.wreqr': '../bower_components/backbone.wreqr/lib/amd/backbone.wreqr',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/amd/backbone.babysitter',

        'text': '../bower_components/requirejs-text/text',
        'tmpl': "../templates",

        'json2': '../bower_components/require-handlebars-plugin/hbs/json2',
        'jquery': '../bower_components/jquery/jquery',
        'jquery-ui': '../bower_components/jquery-ui/ui/jquery-ui',
        'jquery.mousewheel': '../bower_components/jquery-mousewheel/jquery.mousewheel',
        'jquery.saksSelectable': 'common/jquery-plugins/jquery-saks-selectable/jquery.saksSelectable',
        'jquery.saksScrollPane': 'common/jquery-plugins/jquery-saks-scrollpane/jquery.saksScrollPane',
        'jquery.saksSimpleTabs': 'common/jquery-plugins/jquery-saks-simpletabs/jquery.saksSimpleTabs',
        'jquery.debouncedresize': '../bower_components/jquery-smartresize/jquery.debouncedresize',

        'jwplayer': '../../../static/js/lib/jwplayer6/jwplayer',
        'jui-commons': '../../../static/js/lib/jui-commons/jui-commons',
        'mustache': '../bower_components/mustache/mustache',
        'modernizr': '../bower_components/modernizr/modernizr',
        'phpjs': '../bower_components/phpjs/phpjs-shim',
        'stache': '../bower_components/requirejs-mustache/stache',
        'TweenMax': '../../../static/js/lib/TweenMax.min',
        'underscore': '../bower_components/underscore-amd/underscore',
        'underscore.string': '../bower_components/underscore.string/lib/underscore.string',

        'saks.core': '../../../static/js/lib/saks/Core',
        'saks.mediator': '../../../static/js/lib/saks/Mediator',
        'saks.location': '../../../static/js/lib/saks/Location',
        'saksZoomPlayer': '../../../static/js/lib/sakszoomplayer/sakszoomplayer',
        'saksVideoPlayer': '../../../static/js/lib/saksvideoplayer/saksvideoplayer'
    }
});

function testDefaultsOnModel(defaults, model, valTypesLabel) {

    'use strict';

    valTypesLabel = valTypesLabel || 'defaults';

    Object.keys(defaults).forEach(function (key) {
        it('should have a ' + valTypesLabel + ': "' + key +
            '" property with a value of "' + String(defaults[key])
            + '"',
            function () {
                var hasKey = model.attributes.hasOwnProperty(key),
                    val = model.get(key);
                if (isset(val) && !$.isPlainObject(val)
                    && !$.isArray(val)) {
                    expect(hasKey).to.equal(true);
                    expect(val).to.eq(defaults[key]);
                }
                else if (val === null) {
                    expect(hasKey).to.equal(true);
                    expect(val).to.be.null;
                }
                else if (val === undefined) {
                    expect(hasKey).to.equal(true);
                    expect(val).to.be.undefined;
                }
            });
    });
}

// Quickbootstrap static data for tests
var pdpPayload = {
        mainProducts: [{"smallImage": "http://localhost:3000/static/images/staging/recently-viewed-1.png", "backOrderable":true, "videoPlayer": {  "videoSrc": "http://image.s5a.com/e2/saks/Videos/0474133372905_V396x528.mp4",  "autoStart": true  },  "zoomPlayer": {  "imagesResourcePath": "saks/0475556816359_IS"  },"brandName":"Nespresso","colors":[{"colorId":1,"label":"AliceBlue","value":"#F0F8FF","selected":false,"complex":false},{"colorId":2,"label":"BLACK","value":"BLACK","selected":true,"complex":false, imagesResource: "saks/0475556816359_BLACK"},{"colorId":3,"label":"ULTRAMARINE","value":"ULTRAMARINE","selected":false,"complex":false, imagesResource: "saks/0475556816359_ULTRAMARINE"},{"colorId":4,"label":"Aquamarine","value":"#7FFFD4","selected":false,"complex":false},{"colorId":5,"label":"Azure","value":"#F0FFFF","selected":false,"complex":false},{"colorId":6,"label":"Beige","value":"#F5F5DC","selected":false,"complex":false},{"colorId":7,"label":"Bisque","value":"#FFE4C4","selected":false,"complex":false},{"colorId":8,"label":"Black","value":"#000000","selected":false,"complex":false},{"colorId":9,"label":"BlanchedAlmond","value":"#FFEBCD","selected":false,"complex":false},{"colorId":10,"label":"Blue","value":"#0000FF","selected":false,"complex":false},{"colorId":11,"label":"BlueViolet","value":"#8A2BE2","selected":false,"complex":false},{"colorId":12,"label":"Brown","value":"#A52A2A","selected":false,"complex":false},{"colorId":13,"label":"BurlyWood","value":"#DEB887","selected":false,"complex":false},{"colorId":14,"label":"CadetBlue","value":"#5F9EA0","selected":false,"complex":false},{"colorId":15,"label":"Chartreuse","value":"#7FFF00","selected":false,"complex":false},{"colorId":16,"label":"Chocolate","value":"#D2691E","selected":false,"complex":false},{"colorId":17,"label":"Coral","value":"#FF7F50","selected":false,"complex":false},{"colorId":18,"label":"CornflowerBlue","value":"#6495ED","selected":false,"complex":false},{"colorId":19,"label":"Cornsilk","value":"#FFF8DC","selected":false,"complex":false},{"colorId":20,"label":"Crimson","value":"#DC143C","selected":false,"complex":false},{"colorId":22,"label":"DarkBlue","value":"#00008B","selected":false,"complex":false},{"colorId":23,"label":"DarkCyan","value":"#008B8B","selected":false,"complex":false}],"egc":false,"fashionFix":false,"fitPredictor":{"fitPredictorEnabled":true,"itemNumber":"0457177853319","libUrl":"//dr538r33javqm.cloudfront.net/saks-fifth-avenue/fitpredictor.js"},"gwp":false,"hideAddToBag":false,"offFifth":false,"offPrice":false,"outlet":false,"price":{"alternatePriceCopy":"","listLabel":"Was","listPrice":" &#36;699.00","saleLabel":"Now","salePrice":" &#36;699.00","salePriceDisplayable":false},"productCode":"0457177853319","productId":"845524446496270","productVariants":[],"reviewable":false,"shortDesc":"Gran Maestria Espresso Maker with Aeroccino Automatic Milk Frother","shortDescription":"Gran Maestria Espresso Maker with Aeroccino Automatic Milk Frother","sizes":[{"sizeId":1,"label":"XXXSmall","value":"xxxsmall","selected":false},{"sizeId":2,"label":"XXSmall","value":"xxsmall","selected":false},{"sizeId":3,"label":"XSmall","value":"xsmall","selected":false},{"sizeId":4,"label":"Small","value":"small","selected":false}],"skus":[{"skuCode":777326859301,"colorId":1,"sizeId":1,"price":"$1970.92","status":"AV"},{"skuCode":651536733844,"colorId":2,"sizeId":1,"price":"$1646.42","status":"UA"},{"skuCode":611298403703,"colorId":3,"sizeId":1,"price":"$1177.95","status":"SO"},{"skuCode":433821995743,"colorId":4,"sizeId":1,"price":"$1589.36","status":"AV"},{"skuCode":631552905776,"colorId":5,"sizeId":1,"price":"$1146.00","status":"AV"},{"skuCode":938663392794,"colorId":6,"sizeId":1,"price":"$1739.07","status":"AV"},{"skuCode":684212746099,"colorId":7,"sizeId":1,"price":"$1130.87","status":"SO"},{"skuCode":1231616778765,"colorId":8,"sizeId":1,"price":"$1734.33","status":"AV"},{"skuCode":664530994371,"colorId":9,"sizeId":1,"price":"$1605.48","status":"AV"},{"skuCode":1204643364298,"colorId":10,"sizeId":1,"price":"$1356.31","status":"AV"},{"skuCode":299519329565,"colorId":11,"sizeId":1,"price":"$1704.44","status":"SO"},{"skuCode":1135820867029,"colorId":12,"sizeId":1,"price":"$1253.14","status":"AV"},{"skuCode":302954920335,"colorId":13,"sizeId":1,"price":"$1387.36","status":"AV"},{"skuCode":764930478531,"colorId":14,"sizeId":2,"price":"$1166.01","status":"AV"},{"skuCode":358486455633,"colorId":15,"sizeId":2,"price":"$1195.54","status":"SO"},{"skuCode":456077854615,"colorId":16,"sizeId":2,"price":"$1125.91","status":"AV"},{"skuCode":310198065127,"colorId":17,"sizeId":2,"price":"$1725.14","status":"AV"},{"skuCode":573433819460,"colorId":18,"sizeId":2,"price":"$1902.90","status":"AV"},{"skuCode":1008860846283,"colorId":19,"sizeId":2,"price":"$1156.55","status":"SO"},{"skuCode":331590018468,"colorId":20,"sizeId":2,"price":"$1340.21","status":"AV"},{"skuCode":590508899186,"colorId":22,"sizeId":2,"price":"$1851.72","status":"AV"},{"skuCode":593850447098,"colorId":23,"sizeId":2,"price":"$1649.20","status":"UA"}],"waitlistable":true}],
        stlProducts: [{"smallImage": "http://localhost:3000/static/images/staging/recently-viewed-3.png", "backOrderable":true,"brandName":"Nespresso","colors":[{"colorId":1,"label":"AliceBlue","value":"#F0F8FF","selected":false,"complex":false},{"colorId":2,"label":"AntiqueWhite","value":"#FAEBD7","selected":false,"complex":false},{"colorId":3,"label":"Aqua","value":"#00FFFF","selected":false,"complex":false},{"colorId":4,"label":"Aquamarine","value":"#7FFFD4","selected":false,"complex":false},{"colorId":5,"label":"Azure","value":"#F0FFFF","selected":false,"complex":false},{"colorId":6,"label":"Beige","value":"#F5F5DC","selected":false,"complex":false},{"colorId":7,"label":"Bisque","value":"#FFE4C4","selected":false,"complex":false},{"colorId":8,"label":"Black","value":"#000000","selected":false,"complex":false},{"colorId":9,"label":"BlanchedAlmond","value":"#FFEBCD","selected":false,"complex":false},{"colorId":10,"label":"Blue","value":"#0000FF","selected":false,"complex":false},{"colorId":11,"label":"BlueViolet","value":"#8A2BE2","selected":false,"complex":false},{"colorId":12,"label":"Brown","value":"#A52A2A","selected":false,"complex":false},{"colorId":13,"label":"BurlyWood","value":"#DEB887","selected":false,"complex":false},{"colorId":14,"label":"CadetBlue","value":"#5F9EA0","selected":false,"complex":false},{"colorId":15,"label":"Chartreuse","value":"#7FFF00","selected":false,"complex":false}],"egc":false,"fashionFix":false,"fitPredictor":{"fitPredictorEnabled":true,"itemNumber":"0457177853319","libUrl":"//dr538r33javqm.cloudfront.net/saks-fifth-avenue/fitpredictor.js"},"gwp":false,"hideAddToBag":false,"offFifth":false,"offPrice":false,"outlet":false,"price":{"alternatePriceCopy":"","listLabel":"Was","listPrice":" &#36;699.00","saleLabel":"Now","salePrice":" &#36;699.00","salePriceDisplayable":false},"productCode":"0457177853319","productId":"845524446496270","productVariants":[],"reviewable":false,"shortDesc":"Gran Maestria Espresso Maker with Aeroccino Automatic Milk Frother","shortDescription":"Gran Maestria Espresso Maker with Aeroccino Automatic Milk Frother","sizes":[{"sizeId":1,"label":"XXXSmall","value":"xxxsmall","selected":false},{"sizeId":2,"label":"XXSmall","value":"xxsmall","selected":false},{"sizeId":3,"label":"XSmall","value":"xsmall","selected":false},{"sizeId":4,"label":"Small","value":"small","selected":false},{"sizeId":5,"label":"Medium","value":"medium","selected":false},{"sizeId":6,"label":"Large","value":"large","selected":false},{"sizeId":7,"label":"XLarge","value":"xlarge","selected":false},{"sizeId":8,"label":"XXLarge","value":"xxlarge","selected":false},{"sizeId":9,"label":"XXXLarge","value":"xxxlarge","selected":false},{"sizeId":10,"label":"0","value":"0","selected":false},{"sizeId":11,"label":"1","value":"1","selected":false},{"sizeId":12,"label":"2","value":"2","selected":false},{"sizeId":13,"label":"3","value":"3","selected":false},{"sizeId":14,"label":"4","value":"4","selected":false},{"sizeId":15,"label":"5","value":"5","selected":false},{"sizeId":16,"label":"6","value":"6","selected":false},{"sizeId":17,"label":"7","value":"7","selected":false},{"sizeId":18,"label":"8","value":"8","selected":false}],"skus":[{"skuCode":807995600859,"colorId":1,"sizeId":1,"price":"$1158.75","status":"AV"},{"skuCode":696190070129,"colorId":2,"sizeId":1,"price":"$1220.50","status":"AV"},{"skuCode":539756456158,"colorId":3,"sizeId":1,"price":"$1197.21","status":"SO"},{"skuCode":1023271136452,"colorId":4,"sizeId":1,"price":"$1265.19","status":"AV"},{"skuCode":654928863049,"colorId":5,"sizeId":1,"price":"$1644.21","status":"AV"},{"skuCode":521072072210,"colorId":6,"sizeId":1,"price":"$1706.75","status":"AV"},{"skuCode":1218490255531,"colorId":7,"sizeId":1,"price":"$1470.56","status":"SO"},{"skuCode":386812199373,"colorId":8,"sizeId":1,"price":"$1962.31","status":"AV"},{"skuCode":350329401438,"colorId":9,"sizeId":1,"price":"$1347.81","status":"AV"},{"skuCode":611860276899,"colorId":10,"sizeId":1,"price":"$1874.16","status":"AV"},{"skuCode":429360216018,"colorId":11,"sizeId":1,"price":"$1641.09","status":"SO"},{"skuCode":521674651653,"colorId":12,"sizeId":1,"price":"$1549.91","status":"AV"},{"skuCode":415211722022,"colorId":13,"sizeId":6,"price":"$1378.27","status":"AV"},{"skuCode":1083099434618,"colorId":14,"sizeId":18,"price":"$1862.75","status":"SO"},{"skuCode":269962281455,"colorId":15,"sizeId":18,"price":"$1647.41","status":"AV"}],"waitlistable":true}, {"smallImage": "http://localhost:3000/static/images/staging/recently-viewed-1.png", "backOrderable":true,"brandName":"Nespresso","colors":[{"colorId":1,"label":"AliceBlue","value":"#F0F8FF","selected":false,"complex":false},{"colorId":2,"label":"AntiqueWhite","value":"#FAEBD7","selected":false,"complex":false},{"colorId":3,"label":"Aqua","value":"#00FFFF","selected":false,"complex":false},{"colorId":4,"label":"Aquamarine","value":"#7FFFD4","selected":false,"complex":false},{"colorId":5,"label":"Azure","value":"#F0FFFF","selected":false,"complex":false},{"colorId":6,"label":"Beige","value":"#F5F5DC","selected":false,"complex":false},{"colorId":7,"label":"Bisque","value":"#FFE4C4","selected":false,"complex":false},{"colorId":8,"label":"Black","value":"#000000","selected":false,"complex":false},{"colorId":9,"label":"BlanchedAlmond","value":"#FFEBCD","selected":false,"complex":false},{"colorId":10,"label":"Blue","value":"#0000FF","selected":false,"complex":false},{"colorId":11,"label":"BlueViolet","value":"#8A2BE2","selected":false,"complex":false},{"colorId":12,"label":"Brown","value":"#A52A2A","selected":false,"complex":false},{"colorId":13,"label":"BurlyWood","value":"#DEB887","selected":false,"complex":false},{"colorId":14,"label":"CadetBlue","value":"#5F9EA0","selected":false,"complex":false},{"colorId":15,"label":"Chartreuse","value":"#7FFF00","selected":false,"complex":false},{"colorId":16,"label":"Chocolate","value":"#D2691E","selected":false,"complex":false},{"colorId":17,"label":"Coral","value":"#FF7F50","selected":false,"complex":false},{"colorId":18,"label":"CornflowerBlue","value":"#6495ED","selected":false,"complex":false},{"colorId":19,"label":"Cornsilk","value":"#FFF8DC","selected":false,"complex":false},{"colorId":20,"label":"Crimson","value":"#DC143C","selected":false,"complex":false},{"colorId":22,"label":"DarkBlue","value":"#00008B","selected":false,"complex":false},{"colorId":23,"label":"DarkCyan","value":"#008B8B","selected":false,"complex":false},{"colorId":24,"label":"DarkGoldenRod","value":"#B8860B","selected":false,"complex":false},{"colorId":25,"label":"DarkGray","value":"#A9A9A9","selected":false,"complex":false},{"colorId":26,"label":"DarkGreen","value":"#006400","selected":false,"complex":false},{"colorId":27,"label":"DarkKhaki","value":"#BDB76B","selected":false,"complex":false},{"colorId":28,"label":"DarkMagenta","value":"#8B008B","selected":false,"complex":false},{"colorId":29,"label":"DarkOliveGreen","value":"#556B2F","selected":false,"complex":false},{"colorId":30,"label":"DarkOrange","value":"#FF8C00","selected":false,"complex":false},{"colorId":31,"label":"DarkOrchid","value":"#9932CC","selected":false,"complex":false}],"egc":false,"fashionFix":false,"fitPredictor":{"fitPredictorEnabled":true,"itemNumber":"0457177853319","libUrl":"//dr538r33javqm.cloudfront.net/saks-fifth-avenue/fitpredictor.js"},"gwp":false,"hideAddToBag":false,"offFifth":false,"offPrice":false,"outlet":false,"price":{"alternatePriceCopy":"","listLabel":"Was","listPrice":" &#36;699.00","saleLabel":"Now","salePrice":" &#36;699.00","salePriceDisplayable":false},"productCode":"0457177853320","productId":"845524446496270","productVariants":[],"reviewable":false,"shortDesc":"Gran Maestria Espresso Maker with Aeroccino Automatic Milk Frother","shortDescription":"Gran Maestria Espresso Maker with Aeroccino Automatic Milk Frother","sizes":[{"sizeId":1,"label":"XXXSmall","value":"xxxsmall","selected":false},{"sizeId":2,"label":"XXSmall","value":"xxsmall","selected":false},{"sizeId":3,"label":"XSmall","value":"xsmall","selected":false},{"sizeId":4,"label":"Small","value":"small","selected":false},{"sizeId":5,"label":"Medium","value":"medium","selected":false},{"sizeId":6,"label":"Large","value":"large","selected":false},{"sizeId":7,"label":"XLarge","value":"xlarge","selected":false},{"sizeId":8,"label":"XXLarge","value":"xxlarge","selected":false},{"sizeId":9,"label":"XXXLarge","value":"xxxlarge","selected":false},{"sizeId":10,"label":"0","value":"0","selected":false},{"sizeId":11,"label":"1","value":"1","selected":false}],"skus":[{"skuCode":1160020542332,"colorId":1,"sizeId":1,"price":"$1073.40","status":"AV"},{"skuCode":429736048449,"colorId":2,"sizeId":1,"price":"$1772.15","status":"UA"},{"skuCode":265611329349,"colorId":3,"sizeId":1,"price":"$1225.69","status":"SO"},{"skuCode":817080210429,"colorId":4,"sizeId":1,"price":"$1590.09","status":"AV"},{"skuCode":485720654019,"colorId":5,"sizeId":1,"price":"$1185.81","status":"AV"},{"skuCode":558167511598,"colorId":6,"sizeId":1,"price":"$1549.77","status":"UA"},{"skuCode":687011350645,"colorId":7,"sizeId":1,"price":"$1407.61","status":"SO"},{"skuCode":532363923733,"colorId":8,"sizeId":1,"price":"$1392.02","status":"AV"},{"skuCode":1073326908984,"colorId":9,"sizeId":1,"price":"$1367.55","status":"AV"},{"skuCode":715295447503,"colorId":10,"sizeId":1,"price":"$1594.70","status":"AV"},{"skuCode":269243932795,"colorId":11,"sizeId":1,"price":"$1146.10","status":"SO"},{"skuCode":313536596951,"colorId":12,"sizeId":1,"price":"$1327.09","status":"AV"},{"skuCode":649394248147,"colorId":13,"sizeId":1,"price":"$1196.57","status":"AV"},{"skuCode":654621586670,"colorId":14,"sizeId":1,"price":"$1811.95","status":"AV"},{"skuCode":442518716911,"colorId":15,"sizeId":1,"price":"$1889.28","status":"SO"},{"skuCode":480630147970,"colorId":16,"sizeId":1,"price":"$1896.18","status":"AV"},{"skuCode":792883285089,"colorId":17,"sizeId":1,"price":"$1844.84","status":"AV"},{"skuCode":799368042034,"colorId":18,"sizeId":1,"price":"$1185.06","status":"AV"},{"skuCode":264102429385,"colorId":19,"sizeId":1,"price":"$1061.69","status":"SO"},{"skuCode":596200282220,"colorId":20,"sizeId":1,"price":"$1820.31","status":"AV"},{"skuCode":900731280679,"colorId":22,"sizeId":1,"price":"$1102.70","status":"AV"},{"skuCode":587400060846,"colorId":23,"sizeId":1,"price":"$1180.17","status":"AV"},{"skuCode":1193466781639,"colorId":24,"sizeId":1,"price":"$1789.14","status":"SO"},{"skuCode":415644902504,"colorId":25,"sizeId":1,"price":"$1272.79","status":"AV"},{"skuCode":623031682103,"colorId":26,"sizeId":1,"price":"$1783.65","status":"AV"},{"skuCode":406350846170,"colorId":27,"sizeId":1,"price":"$1068.37","status":"AV"},{"skuCode":1123942781473,"colorId":28,"sizeId":1,"price":"$1753.20","status":"SO"},{"skuCode":753571921029,"colorId":29,"sizeId":1,"price":"$1648.57","status":"AV"},{"skuCode":747162046377,"colorId":30,"sizeId":1,"price":"$1677.71","status":"AV"},{"skuCode":562496663072,"colorId":31,"sizeId":1,"price":"$1737.21","status":"UA"}],"waitlistable":true}, {"smallImage": "http://localhost:3000/static/images/staging/recently-viewed-2.png", "backOrderable":true,"brandName":"Nespresso","colors":[{"colorId":1,"label":"AliceBlue","value":"#F0F8FF","selected":false,"complex":false},{"colorId":2,"label":"AntiqueWhite","value":"#FAEBD7","selected":false,"complex":false},{"colorId":3,"label":"Aqua","value":"#00FFFF","selected":false,"complex":false},{"colorId":4,"label":"Aquamarine","value":"#7FFFD4","selected":false,"complex":false},{"colorId":5,"label":"Azure","value":"#F0FFFF","selected":false,"complex":false},{"colorId":6,"label":"Beige","value":"#F5F5DC","selected":false,"complex":false},{"colorId":7,"label":"Bisque","value":"#FFE4C4","selected":false,"complex":false},{"colorId":8,"label":"Black","value":"#000000","selected":false,"complex":false},{"colorId":9,"label":"BlanchedAlmond","value":"#FFEBCD","selected":false,"complex":false},{"colorId":10,"label":"Blue","value":"#0000FF","selected":false,"complex":false},{"colorId":11,"label":"BlueViolet","value":"#8A2BE2","selected":false,"complex":false},{"colorId":12,"label":"Brown","value":"#A52A2A","selected":false,"complex":false},{"colorId":13,"label":"BurlyWood","value":"#DEB887","selected":false,"complex":false},{"colorId":14,"label":"CadetBlue","value":"#5F9EA0","selected":false,"complex":false},{"colorId":15,"label":"Chartreuse","value":"#7FFF00","selected":false,"complex":false},{"colorId":16,"label":"Chocolate","value":"#D2691E","selected":false,"complex":false},{"colorId":17,"label":"Coral","value":"#FF7F50","selected":false,"complex":false},{"colorId":18,"label":"CornflowerBlue","value":"#6495ED","selected":false,"complex":false},{"colorId":19,"label":"Cornsilk","value":"#FFF8DC","selected":false,"complex":false},{"colorId":20,"label":"Crimson","value":"#DC143C","selected":false,"complex":false},{"colorId":22,"label":"DarkBlue","value":"#00008B","selected":false,"complex":false},{"colorId":23,"label":"DarkCyan","value":"#008B8B","selected":false,"complex":false},{"colorId":24,"label":"DarkGoldenRod","value":"#B8860B","selected":false,"complex":false},{"colorId":25,"label":"DarkGray","value":"#A9A9A9","selected":false,"complex":false},{"colorId":26,"label":"DarkGreen","value":"#006400","selected":false,"complex":false},{"colorId":27,"label":"DarkKhaki","value":"#BDB76B","selected":false,"complex":false},{"colorId":28,"label":"DarkMagenta","value":"#8B008B","selected":false,"complex":false},{"colorId":29,"label":"DarkOliveGreen","value":"#556B2F","selected":false,"complex":false},{"colorId":30,"label":"DarkOrange","value":"#FF8C00","selected":false,"complex":false},{"colorId":31,"label":"DarkOrchid","value":"#9932CC","selected":false,"complex":false},{"colorId":32,"label":"DarkRed","value":"#8B0000","selected":false,"complex":false},{"colorId":33,"label":"DarkSalmon","value":"#E9967A","selected":false,"complex":false},{"colorId":34,"label":"DarkSeaGreen","value":"#8FBC8F","selected":false,"complex":false},{"colorId":35,"label":"DarkSlateBlue","value":"#483D8B","selected":false,"complex":false},{"colorId":36,"label":"DarkSlateGray","value":"#2F4F4F","selected":false,"complex":false},{"colorId":37,"label":"DarkTurquoise","value":"#00CED1","selected":false,"complex":false}],"egc":false,"fashionFix":false,"fitPredictor":{"fitPredictorEnabled":true,"itemNumber":"0457177853319","libUrl":"//dr538r33javqm.cloudfront.net/saks-fifth-avenue/fitpredictor.js"},"gwp":false,"hideAddToBag":false,"offFifth":false,"offPrice":false,"outlet":false,"price":{"alternatePriceCopy":"","listLabel":"Was","listPrice":" &#36;699.00","saleLabel":"Now","salePrice":" &#36;699.00","salePriceDisplayable":false},"productCode":"0457177853321","productId":"845524446496270","productVariants":[],"reviewable":false,"shortDesc":"Gran Maestria Espresso Maker with Aeroccino Automatic Milk Frother","shortDescription":"Gran Maestria Espresso Maker with Aeroccino Automatic Milk Frother","sizes":[{"sizeId":1,"label":"XXXSmall","value":"xxxsmall","selected":false},{"sizeId":2,"label":"XXSmall","value":"xxsmall","selected":false},{"sizeId":3,"label":"XSmall","value":"xsmall","selected":false}],"skus":[{"skuCode":778102119221,"colorId":1,"sizeId":1,"price":"$1950.21","status":"AV"},{"skuCode":1108764492907,"colorId":2,"sizeId":1,"price":"$1398.46","status":"UA"},{"skuCode":464934342541,"colorId":3,"sizeId":1,"price":"$1854.20","status":"SO"},{"skuCode":1180097204866,"colorId":4,"sizeId":1,"price":"$1316.94","status":"AV"},{"skuCode":316550440155,"colorId":5,"sizeId":1,"price":"$1946.29","status":"AV"},{"skuCode":733348382637,"colorId":6,"sizeId":1,"price":"$1926.77","status":"UA"},{"skuCode":1021679766942,"colorId":7,"sizeId":1,"price":"$1771.45","status":"SO"},{"skuCode":704009968555,"colorId":8,"sizeId":1,"price":"$1101.11","status":"AV"},{"skuCode":1147332326742,"colorId":9,"sizeId":1,"price":"$1207.34","status":"AV"},{"skuCode":966090806528,"colorId":10,"sizeId":1,"price":"$1475.56","status":"AV"},{"skuCode":596644699341,"colorId":11,"sizeId":1,"price":"$1302.16","status":"SO"},{"skuCode":942873823224,"colorId":12,"sizeId":1,"price":"$1792.30","status":"AV"},{"skuCode":414622902638,"colorId":13,"sizeId":1,"price":"$1613.06","status":"AV"},{"skuCode":850120382151,"colorId":14,"sizeId":1,"price":"$1937.96","status":"AV"},{"skuCode":1151472698665,"colorId":15,"sizeId":1,"price":"$1973.11","status":"SO"},{"skuCode":1060768857133,"colorId":16,"sizeId":1,"price":"$1342.90","status":"AV"},{"skuCode":844373736764,"colorId":17,"sizeId":1,"price":"$1086.95","status":"AV"},{"skuCode":805672640214,"colorId":18,"sizeId":1,"price":"$1761.44","status":"AV"},{"skuCode":543923915364,"colorId":19,"sizeId":1,"price":"$1267.10","status":"SO"},{"skuCode":1118937694235,"colorId":20,"sizeId":1,"price":"$1413.69","status":"AV"},{"skuCode":755882904633,"colorId":22,"sizeId":1,"price":"$1812.89","status":"AV"},{"skuCode":1180318147410,"colorId":23,"sizeId":1,"price":"$1910.03","status":"UA"},{"skuCode":783584597055,"colorId":24,"sizeId":1,"price":"$1731.95","status":"SO"},{"skuCode":662204900757,"colorId":25,"sizeId":1,"price":"$1059.00","status":"AV"},{"skuCode":634827983333,"colorId":26,"sizeId":1,"price":"$1402.67","status":"AV"},{"skuCode":921187758912,"colorId":27,"sizeId":1,"price":"$1823.79","status":"UA"},{"skuCode":828945985297,"colorId":28,"sizeId":1,"price":"$1908.08","status":"SO"},{"skuCode":998476016336,"colorId":29,"sizeId":1,"price":"$1828.76","status":"AV"},{"skuCode":493353393395,"colorId":30,"sizeId":1,"price":"$1813.46","status":"AV"},{"skuCode":469232687029,"colorId":31,"sizeId":1,"price":"$1161.66","status":"UA"},{"skuCode":1112798228860,"colorId":32,"sizeId":1,"price":"$1055.33","status":"SO"},{"skuCode":682271441212,"colorId":33,"sizeId":1,"price":"$1951.40","status":"AV"},{"skuCode":675166543341,"colorId":34,"sizeId":1,"price":"$1106.09","status":"AV"},{"skuCode":590477407212,"colorId":35,"sizeId":1,"price":"$1278.57","status":"UA"},{"skuCode":439085481456,"colorId":36,"sizeId":1,"price":"$1436.61","status":"SO"},{"skuCode":656750953757,"colorId":37,"sizeId":1,"price":"$1342.34","status":"AV"}],"waitlistable":true}],
        recentlyViewed: []
    },
    Saks = Saks || {},
    flash9Installed=true;

pdpPayload.mainProducts[0]["videoPlayer"] = {  "videoSrc": "http://image.s5a.com/e2/saks/Videos/0474133372905_V396x528.mp4",  "autoStart": true  };
pdpPayload.mainProducts[0]["zoomPlayer"] =  {  "imagesResourcePath": "saks/0474133372905_IS"  };

require([
    'spec/testSuite',
    'underscore',
    'underscore.string'
],
    function (testSuite, _, _s) {

        'use strict';

        // underscore.string
        _.str = _s;

        $(function () {
            require(testSuite.specs, function () {

                if (window.mochaPhantomJS) {
                    mochaPhantomJS.run();
                }
                else {
                    mocha.run();
                }
            });
        });

    });
  