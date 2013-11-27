/*! jui-commons 2013-11-27 */
$.widget("jui.juiBase", {
    options: {
        defaultTimelineClass: "TimelineMax",
        ui: {}
    },
    _namespace: function(a, b) {
        var c, d = a.split("."), e = b || this.options;
        for (c = 0; c < d.length; c += 1) "undefined" == typeof e[d[c]] && (e[d[c]] = {}), 
        e = e[d[c]];
        return e;
    },
    _populateUiElementsFromOptions: function(a) {
        var b = this;
        a = a || this.options, isset(a.ui) || (a.ui = {}), Object.keys(a).forEach(function(c) {
            "string" == typeof a[c] && (a[c] = a[c] = $(a[c], b.element)), $.isPlainObject(a[c]) && (a[c].elm = b._getElementFromOptions(a[c]));
        });
    },
    _getElementFromOptions: function(a) {
        var b = this, c = b.options, d = a;
        return "string" == typeof d && (d = b._namespace(d, c)), "function" == typeof d && (d = d()), 
        empty(d) ? null : d instanceof $ && d.length > 0 ? d : (isset(d.selector) && empty(d.create) && "string" == typeof d.selector && (d.elm = "string" == typeof d.appendTo && d.appendTo.length > 0 && -1 === d.appendTo.indexOf("this") ? $(d.selector, b.getUiElement(d.appendTo)) : $(d.selector, b.element)), 
        !empty(d.html) && d.create && "string" == typeof d.html && (d.elm = this._createElementFromOptions(d), 
        isset(d.appendTo) && "string" == typeof d.appendTo && ("this.element" === d.appendTo ? d.elm = this.element.append(d.elm).find(d.selector) : "after this.element" === d.appendTo ? this.element.after(d.elm) : "before this.element" === d.appendTo ? this.element.before(d.elm) : "prepend to this.element" === d.appendTo ? this.element.prepend(d.elm) : "append to this.element" === d.appendTo ? this.element.append(d.elm) : this.getUiElement(d.appendTo).append(d.elm).find(d.selector))), 
        empty(d.elm) ? null : d.elm);
    },
    _createElementFromOptions: function(a) {
        var b = null;
        return isset(a) && "string" == typeof a && (a = this._namespace(a)), empty(a) ? null : (a.html && (b = $(a.html), 
        a.attribs && b.attr(a.attribs), a.create = !1), b);
    },
    _removeCreatedElements: function() {
        var a = this, b = a.options;
        b.ui.keys.forEach(function() {
            b.ui[key].elm instanceof $ && b.ui[key].create && b.ui[key].elm.remove();
        });
    },
    getFromOptions: function(a, b, c) {
        var d = null;
        return "string" == typeof a && (d = this._namespace(a)), "function" == typeof d && empty(c) && (d = d.apply(this, b)), 
        d;
    },
    getUiElement: function(a) {
        var b = this.options;
        if (isset(b.ui[a])) {
            var c = b.ui[a];
            if (c instanceof $ && c.length > 0) return c;
        }
        return this._getElementFromOptions("ui." + a);
    },
    getAnimationTimeline: function() {
        var a = this.options;
        return empty(a.timeline) && (a.timeline = new window[this.options.defaultTimelineClass]()), 
        a.timeline;
    },
    initAnimationTimeline: function(a) {
        a = a || this.getAnimationTimeline();
        var b, c, d, e, f, g = this, h = g.options;
        if (!(empty(h.animations) || !h.animations instanceof Array)) for (b = 0; b < h.animations.length; b += 1) c = h.animations[b], 
        d = g.getUiElement(c.elmAlias), e = c.duration, f = c.props, a[c.type](d, e, f);
    },
    getOptionValue: function(a) {
        var b = this._namespace(a);
        return "function" == typeof b ? b.call(this) : b;
    }
}), $.widget("jui.splitText", {
    options: {
        states: {
            unsplit: "unsplit",
            split: "split"
        },
        state: null,
        eventsPrefix: "split-text"
    },
    _splitStrToSpans: function(a) {
        for (var b, c = 0, d = ""; c < a.length; ) b = /\s/.test(a[c]) ? "&nbsp;" : a[c], 
        d += "<span>" + b + "</span>", c += 1;
        return d;
    },
    _create: function() {
        var a = this, b = a.options;
        b.state = b.state || b.states.unsplit, b.originalText = a.element.text().replace(/\s{3,}/gim, "  "), 
        a.toggleSplitText(), a.element.trigger(b.eventsPrefix + ":complete");
    },
    toggleSplitText: function(a) {
        var b = this, c = b.options;
        a = a || c.state, a === c.states.unsplit ? (c.state = c.states.split, b.element.html(b._splitStrToSpans(c.originalText))) : (c.state = c.states.unsplit, 
        b.element.text(c.originalText)), this.element.trigger(c.eventsPrefix + ":toggle", {
            states: c.states,
            state: c.state
        });
    },
    getOriginalText: function() {
        return this.options.originalText;
    }
}), $.widget("jui.juiAffix", $.jui.juiBase, {
    options: {
        "class": "jui-afix",
        scrollableElm: $(window),
        affixVertically: !0,
        affixHorizontally: !1,
        offset: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        _isPositionFixedSupported: !1
    },
    _create: function() {
        var a = this, b = a.options, c = a.element, d = b.affixVertically, e = (b.affixHorizontally, 
        {
            position: c.css("position"),
            top: c.offset().top,
            right: c.offset().right,
            bottom: c.offset().bottom,
            left: c.offset().left
        }), f = b.scrollableElm, g = {
            top: a.getOptionValue("offset.top"),
            right: a.getOptionValue("offset.right"),
            bottom: a.getOptionValue("offset.bottom"),
            left: a.getOptionValue("offset.left")
        };
        c.addClass(b["class"]), f.bind("scroll resize orientationchange load", function() {
            var a = $(this), b = a.scrollTop(), h = (a.scrollLeft(), f.height() + g.bottom);
            f.width() + g.right, d && (b > e.top - g.top && c.offset().top - b < h ? c.css({
                position: "fixed",
                top: g.top,
                bottom: "auto"
            }) : b <= e.top && (c.css("position", e.position), c.css("top", e.top), 
            c.css("bottom", "auto")), e.top - b >= h && c.css({
                position: "fixed",
                top: "auto",
                bottom: -g.bottom
            }));
        }), f.scroll();
    }
}), $.widget("jui.juiFloatingScrollIndicators", $.jui.juiBase, {
    options: {
        "class": "jui-floating-scroll-indicator",
        animation: {
            easing: Power3.easeInOut,
            duration: .38
        },
        ui: {
            scrollableElm: {
                elm: $(window).eq(0)
            },
            wrapperElm: {
                elm: null,
                attribs: {
                    "class": "indicator-wrapper"
                },
                append: !1,
                prepend: !0,
                appendTo: "this.element",
                selector: "> .indicator-wrapper",
                html: "<div></div>",
                create: !0
            },
            indicatorElms: {
                elm: null,
                attribs: {
                    "class": "indicator"
                },
                appendTo: "wrapperElm",
                selector: "> .indicator",
                html: "<div></div>",
                create: !1
            },
            inidicatorsNeededElms: {
                elm: null,
                selector: "h2"
            }
        }
    },
    _create: function() {
        var a = this, b = a.options;
        a.element.addClass(b["class"]), a._populateUiElementsFromOptions(), a._createInidicators(), 
        a.getUiElement("scrollableElm").on("debouncedresize", function() {
            var c = a.getUiElement("wrapperElm"), d = b.ui.inidicatorsNeededElms.elm, e = $(".indicator", c);
            d.each(function(a, b) {
                b = $(b), e.eq(a).css("top", b.offset().top);
            });
        });
    },
    _createInidicators: function() {
        var a, b, c = this, d = c.options, e = d.ui.inidicatorsNeededElms, f = c.getUiElement("wrapperElm");
        e.elm = a = $(e.selector, this.element), 0 !== a.length && (a.each(function(b, c) {
            c = $(c);
            var d = $('<div class="indicator" title="' + c.text() + '"' + 'data-index="' + b + '"></div>');
            f.append(d), $(".indicator", f).eq(b).css("top", c.offset().top), d.juiAffix({
                offset: {
                    top: (b + 1) * d.height(),
                    bottom: -((a.length - b) * d.height())
                }
            });
        }), b = d.ui.indicatorElms.elm = $(d.ui.indicatorElms.selector, f), b.click(function() {
            var b = $(this), e = a.eq(b.attr("data-index"));
            TweenMax.to(c.ui.scrollableElm, d.animation.duration, {
                scrollTop: parseInt(e.offset().top),
                easing: d.animation.easing
            });
        }));
    }
}), $.widget("jui.paginator", $.jui.juiBase, {
    options: {
        items: {
            elm: null,
            selector: "> .items > .item",
            firstInRange: 0,
            lastInRange: 0,
            perPage: 0
        },
        pages: {
            prev: 0,
            pointer: 0,
            next: 0,
            last: 0,
            length: 0,
            direction: 1
        },
        eventsPrefix: "jui.paginator",
        onGotoPageNum: null,
        debug_output: "",
        debug: !0
    },
    _create: function() {
        this._gotoPageNum(this.options.pages.pointer);
    },
    _nextPage: function() {
        var a = this.options;
        a.pages.pointer_direction = 1, a.pages.pointer < a.pages.length - 1 ? a.pages.pointer += 1 : a.pages.pointer = 0, 
        this._gotoPageNum(a.pages.pointer);
    },
    _prevPage: function() {
        var a = this.options;
        a.pages.pointer > 0 ? a.pages.pointer -= 1 : a.pages.pointer = a.pages.length - 1, 
        a.pages.pointer_direction = -1, this._gotoPageNum(a.pages.pointer);
    },
    _gotoPageNum: function(a) {
        var b = this.options;
        b.pages.prev = a - 1, b.pages.next = a + 1, b.pages.pointer = a, this.element.trigger(b.eventsPrefix + ":gotoPageNum", {
            pointer: a
        }), null !== b.onGotoPageNum && "function" == typeof b.onGotoPageNum && b.onGotoPageNum.call(this, {
            pointer: a
        });
    },
    _calculateNumberOfPages: function() {
        var a, b = this.options, c = this.getItems();
        a = "function" == typeof b.items.perPage ? a = b.items.perPage.apply(this) : b.items.PerPage, 
        b.pages.length = Math.ceil(c.length / a), b.pages.length = 0/0 !== b.pages.length ? b.pages.length : 0;
    },
    getItems: function() {
        return this._getElementFromOptions("items");
    },
    getItemsContainer: function() {
        return this._getElementFromOptions("itemsContainer");
    },
    getPointer: function() {
        return this.options.pages.pointer;
    }
}), $.widget("jui.paginatorWithTextField", $.jui.paginator, {
    options: {
        pages: {
            selector: null,
            length: 100
        },
        items: {
            elm: null,
            selector: "> .items > .item",
            perPage: 1
        },
        firstBtn: {
            elm: null,
            selector: "> .controls > .first-btn",
            enabled: !0,
            html: ""
        },
        prevBtn: {
            elm: null,
            selector: "> .controls > .prev-btn",
            enabled: !0,
            html: ""
        },
        textField: {
            elm: null,
            selector: "> .controls > .text-field",
            enabled: !0,
            html: ""
        },
        nextBtn: {
            elm: null,
            selector: "> .controls > .next-btn",
            enabled: !0,
            html: ""
        },
        lastBtn: {
            elm: null,
            selector: "> .controls > .last-btn",
            enabled: !0,
            html: ""
        },
        eventsPrefix: "jui.paginatorWithTextField"
    },
    _create: function() {
        this._super();
    },
    firstPage: function() {
        this._gotoPageNum(0), console.log("Page: " + this.getPointer());
    },
    prevPage: function() {
        this._prevPage(), console.log("Page: " + this.getPointer());
    },
    nextPage: function() {
        this._nextPage(), console.log("Page: " + this.getPointer());
    },
    lastPage: function() {
        this._gotoPageNum(this.options.pages.length - 1), console.log("Page: " + this.getPointer());
    },
    getFirstBtn: function() {
        return this._getElementFromOptions("firstBtn");
    },
    getPrevBtn: function() {
        return this._getElementFromOptions("prevBtn");
    },
    getNextBtn: function() {
        return this._getElementFromOptions("nextBtn");
    },
    getLastBtn: function() {
        return this._getElementFromOptions("lastBtn");
    },
    getTextField: function() {
        return this._getElementFromOptions("textField");
    }
}), $.widget("jui.juiScrollPane", $.jui.juiBase, {
    options: {
        ui: {
            contentHolder: {
                elm: null,
                selector: ".content",
                html: "<div></div>",
                attribs: {
                    "class": "content"
                }
            },
            vertScrollbar: {
                elm: null,
                selector: ".vertical.scrollbar",
                html: "<div></div>",
                appendTo: "this.element",
                attribs: {
                    "class": "vertical scrollbar"
                },
                create: !0
            },
            vertHandle: {
                elm: null,
                selector: ".handle",
                html: "<div></div>",
                appendTo: "vertScrollbar",
                attribs: {
                    "class": "handle"
                },
                create: !0
            },
            horizScrollbar: {
                elm: null,
                selector: ".horizontal.scrollbar",
                html: "<div></div>",
                appendTo: "this.element",
                attribs: {
                    "class": "horizontal scrollbar"
                },
                create: !0
            },
            horizHandle: {
                elm: null,
                selector: ".handle",
                html: "<div></div>",
                appendTo: "horizScrollbar",
                attribs: {
                    "class": "handle"
                },
                create: !0
            }
        },
        scrollbarOriented: {
            VERTICALLY: "vertical",
            HORIZONTALLY: "horizontal"
        },
        autoHide: !1,
        debug: !1
    },
    _create: function() {
        this._populateUiElementsFromOptions();
        var a = this.options, b = this.getUiElement("contentHolder"), c = b.get(0).scrollWidth, d = b.get(0).scrollHeight, e = this;
        "hidden" !== b.css("overflow") && b.css("overflow", "hidden"), e.element.addClass("jui-scroll-pane"), 
        d > b.height() && e.initScrollbar(a.scrollbarOriented.VERTICALLY), c > b.width() ? e.initScrollbar(a.scrollbarOriented.HORIZONTALLY) : this.getUiElement("horizScrollbar").css("display", "none");
    },
    _scrollByOrientation: function(a, b) {
        var c, d = (this.options, this.getUiElement("contentHolder")), e = b, f = this.getScrollDirVars(e), g = f.scrollAmountTotal, h = this.getScrollbarHandleByOrientation(e), i = this.getScrollbarByOrientation(e), j = f.cssCalcDir, k = "outer" + ucaseFirst(f.scrollbarDimProp);
        d[f.scrollbarDimProp]() >= g || (g >= a && a >= 0 ? (d.scrollTop(a), c = a / g, 
        h.css(j, i[k]() * c)) : a > g ? h.css(j, i[k]() - h[k]()) : 0 > a && h.css(j, 0), 
        this.scrollContentHolder(e), this.constrainHandle(e));
    },
    scrollContentHolder: function(a) {
        var b = this.getScrollbarHandleByOrientation(a), c = this.getScrollbarByOrientation(a), d = this.getUiElement("contentHolder"), e = this.getScrollDirVars(a), f = e.scrollAmountTotal, g = e.cssCalcDir, h = e.scrollbarDimProp, i = b.position()[g] / c[h](), j = i * f, k = "scroll" + ucaseFirst(g);
        j >= 0 && f >= j ? d[k](i * f) : 0 > j ? d[k](0) : j > f && d[k](f);
    },
    constrainHandle: function(a) {
        var b = this.getScrollbarHandleByOrientation(a), c = this.getScrollbarByOrientation(a), d = this.getScrollDirVars(a), e = d.scrollbarDimProp, f = d.cssCalcDir;
        b.position()[f] < 0 ? b.css(f, 0) : b.position()[f] + b[e]() > c[e]() && b.css(f, c[e]() - b[e]());
    },
    initScrollbar: function(a) {
        var b = this.getScrollbarByOrientation(a), c = this.getScrollbarHandleByOrientation(a), d = this.getUiElement("contentHolder"), e = (this.options, 
        this), f = e.getScrollDirVars(a), g = f.dragAxis, h = f.cssCalcDir, i = f.scrollbarDimProp;
        console.log(b.length, c.length, d), e.initScrollbarHandle(a), c.draggable({
            containment: "parent",
            cursor: "s-resize",
            axis: g,
            drag: function(a, c) {
                var e = c.position[h] / b[i]();
                d["scroll" + ucaseFirst(h)](e * f.scrollAmountTotal);
            }
        }), b.bind("click", function(b) {
            c.css(h, b["offset" + g.toUpperCase()] - c[i]() / 2), e.constrainHandle(a), 
            e.scrollContentHolder(a);
        });
    },
    initScrollbarHandle: function(a) {
        var b = this.getUiElement("contentHolder"), c = this.getScrollbarByOrientation(a), d = this.getScrollbarHandleByOrientation(a), e = this.getScrollDirVars(a), f = e.scrollbarDimProp, g = b[f](), h = b.get(0)["scroll" + ucaseFirst(f)], i = c[f]();
        d[f](g * i / h);
    },
    getScrollDirVars: function(a) {
        var b, c = this, d = (c.options, this.getUiElement("contentHolder"));
        return b = a === c.options.scrollbarOriented.VERTICALLY ? {
            dragAxis: "y",
            cssCalcDir: "top",
            scrollbarDimProp: "height",
            scrollAmountTotal: d.get(0).scrollHeight
        } : {
            dragAxis: "x",
            cssCalcDir: "left",
            scrollbarDimProp: "width",
            scrollAmountTotal: d.get(0).scrollWidth
        };
    },
    getScrollbarByOrientation: function(a) {
        var b = this.options;
        return a === b.scrollbarOriented.VERTICALLY ? this.getUiElement("vertScrollbar") : this.getUiElement("horizScrollbar");
    },
    getScrollbarHandleByOrientation: function(a) {
        var b = this.options;
        return a === b.scrollbarOriented.VERTICALLY ? this.getUiElement("vertHandle") : this.getUiElement("horizHandle");
    },
    scrollVertically: function(a) {
        this._scrollByOrientation(a, this.options.scrollbarOriented.VERTICALLY);
    },
    scrollHorizontally: function(a) {
        this._scrollByOrientation(a, this.options.scrollbarOriented.HORIZONTALLY);
    }
}), $.widget("jui.juiScrollableDropDown", $.jui.juiBase, {
    options: {
        className: "jui-scrollable-drop-down",
        ui: {
            contentElm: {
                elm: null,
                attribs: {
                    "class": "content"
                },
                selector: "> .content",
                html: "<div></div>",
                appendTo: "this.element"
            }
        },
        defaultAnimations: [ {
            type: "from",
            duration: .3,
            elmAlias: "contentElm",
            props: {
                css: {
                    height: 0
                }
            }
        }, {
            type: "from",
            duration: .3,
            elmAlias: "scrollbar",
            props: {
                css: {
                    opacity: 0
                }
            },
            delay: -.1
        } ],
        expandOn: "click",
        expandOnClassNamePrefix: "expands-on",
        collapseOn: "click",
        collapseOnClassNamePrefix: "collapses-on",
        states: {
            COLLAPSED: "collapsed",
            EXPANDED: "expanded"
        },
        state: null
    },
    _create: function() {
        var a = this.options;
        this.element.addClass(a.className).addClass(this._getExpandOnClassName()).addClass(this._getCollapseOnClassName()), 
        this._populateUiElementsFromOptions(), this._addEventListeners(), a.state = a.states.COLLAPSED;
    },
    _getExpandOnClassName: function() {
        var a = this.options;
        return a.expandOnClassNamePrefix + a.expandOn;
    },
    _getExpandOnEventStringName: function() {
        return this.options.expandOn;
    },
    _getCollapseOnClassName: function() {
        var a = this.options;
        return a.collapseOnClassNamePrefix + a.collapseOn;
    },
    _getCollapseOnEventStringName: function() {
        return this.options.collapseOn;
    },
    _addEventListeners: function() {
        var a = this, b = a.options.states, c = this._getCollapseOnEventStringName(), d = this._getExpandOnEventStringName();
        d === c ? this.element.on(d, function() {
            a.options.state === b.COLLAPSED ? (a.ensureAnimationFunctionality(), a.options.timeline.play(), 
            a.options.state = b.EXPANDED) : (a.ensureAnimationFunctionality(), a.options.timeline.reverse(), 
            a.options.state = b.COLLAPSED);
        }) : this.element.on(d, function() {
            a.ensureAnimationFunctionality(), a.options.timeline.play(), a.options.state = b.EXPANDED;
        }).on(c, function() {
            a.ensureAnimationFunctionality(), a.options.timeline.reverse(), a.options.state = b.COLLAPSED;
        });
    },
    _removeEventListeners: function() {
        this.element.off(this._getCollapseOnEventStringName()).off(this._getExpandOnEventStringName());
    },
    _removeCreatedOptions: function() {
        this.getUiElement("contentElm").find("ul").remove();
    },
    _initScrollbar: function() {
        this.ui.scrollbar = this.element.juiScrollPane({
            ui: {
                contentHolder: {
                    elm: this.getUiElement("contentElm"),
                    selector: this.options.ui.contentElm.selector + ""
                }
            }
        }).find(".scrollbar");
    },
    _initAnimationTimeline: function() {
        var a = this.getAnimationTimeline();
        this.initAnimationTimeline(a);
    },
    _initTimeline: function() {
        empty(this.options.timeline) && this._initAnimationTimeline();
    },
    ensureAnimationFunctionality: function() {
        this._initScrollbar(), this._initTimeline();
    },
    destroy: function() {
        this._removeCreatedElements(), this._removeEventListeners(), this._destroy();
    },
    refreshOptions: function() {
        this._removeEventListeners(), this._addEventListeners();
    }
}), $.widget("jui.juiSelectPicker", $.jui.juiBase, {
    options: {
        ui: {
            wrapperElm: {
                elm: null,
                attribs: {
                    "class": "jui-select-picker jui-select-picker-example-1"
                },
                appendTo: "after this.element",
                selector: ".jui-select-picker",
                html: "<div></div>",
                create: !0
            },
            buttonElm: {
                elm: null,
                attribs: {
                    "class": "button"
                },
                text: "",
                selector: "> .button",
                html: '<div><div class="label"></div></div>',
                appendTo: "wrapperElm",
                create: !0
            },
            optionsElm: {
                elm: null,
                attribs: {
                    "class": "options"
                },
                selector: "> .options",
                html: "<div></div>",
                appendTo: "wrapperElm",
                create: !0,
                optionSelectedClassName: "selected"
            }
        },
        labelText: "",
        expandOn: "click",
        expandOnClassNamePrefix: "expands-on",
        collapseOn: "click",
        collapseOnClassNamePrefix: "collapses-on",
        states: {
            COLLAPSED: "collapsed",
            EXPANDED: "expanded"
        },
        state: null
    },
    _create: function() {
        var a = this.options;
        $("html").hasClass("touch") || ($("html").hasClass("lt-ie9") && console.log("** Note ** -- jquery.juiSelectPicker.js doesn't support anything less than Ie9 at the moment."), 
        this.element.attr("hidden", "hidden").css("display", "none"), this._populateUiElementsFromOptions(), 
        this.ui.wrapperElm.addClass(this._getExpandOnClassName()).addClass(this._getCollapseOnClassName()), 
        this.setLabelText(), this._drawSelectOptions(), this._addEventListeners(), 
        this.ensureAnimationFunctionality(), a.state = a.states.COLLAPSED);
    },
    _drawSelectOptions: function() {
        var a = this, b = a.getUiElement("optionsElm"), c = a.element.find("option"), d = $("<ul></ul>");
        c.each(function(b, e) {
            if (e = $(e), 0 !== b || !empty(a.options.ui.buttonElm.text)) {
                var f = $('<li><a href="javascript: void(0);" data-value="' + e.attr("value") + '">' + e.text() + "</a></li>");
                0 !== b || empty(a.options.ui.buttonElm.text) ? 1 === b && empty(a.options.ui.buttonElm.text) && f.addClass("first") : f.addClass("first"), 
                b === c.length - 1 && f.addClass("last"), d.append(f);
            }
        }), b.append(d);
    },
    _getExpandOnClassName: function() {
        var a = this.options;
        return a.expandOnClassNamePrefix + a.expandOn;
    },
    _getExpandOnEventStringName: function() {
        return this.options.expandOn;
    },
    _getCollapseOnClassName: function() {
        var a = this.options;
        return a.collapseOnClassNamePrefix + a.collapseOn;
    },
    _getCollapseOnEventStringName: function() {
        return this.options.collapseOn;
    },
    _addEventListeners: function() {
        var a = this, b = a.options.states, c = this._getCollapseOnEventStringName(), d = this._getExpandOnEventStringName();
        this.ui.wrapperElm.on("click", "a[data-value]", function(c) {
            c.stopPropagation();
            var d = $(c.currentTarget);
            a.clearSelected(), a.setSelected(d), a.timeline.reverse(), a.options.state = b.COLLAPSED;
        }), d === c ? this.ui.wrapperElm.on(d, function() {
            a.options.state === b.COLLAPSED ? (a.ensureAnimationFunctionality(), a.timeline.play(), 
            a.options.state = b.EXPANDED) : (a.ensureAnimationFunctionality(), a.timeline.reverse(), 
            a.options.state = b.COLLAPSED);
        }) : this.ui.wrapperElm.on(d, function() {
            a.ensureAnimationFunctionality(), a.timeline.play(), a.options.state = b.EXPANDED;
        }).on(c, function() {
            a.ensureAnimationFunctionality(), a.timeline.reverse(), a.options.state = b.COLLAPSED;
        });
    },
    _removeEventListeners: function() {
        this.ui.wrapperElm.off("click", "a").off(this._getCollapseOnEventStringName()).off(this._getExpandOnEventStringName());
    },
    _removeCreatedOptions: function() {
        this.getUiElement("optionsElm").find("ul").remove();
    },
    _initScrollbar: function() {
        this.ui.scrollbar = this.ui.wrapperElm.juiScrollPane({
            ui: {
                contentHolder: {
                    elm: this.getUiElement("optionsElm"),
                    selector: this.options.ui.optionsElm.selector + ""
                }
            }
        }).find(".scrollbar");
    },
    _initAnimationTimeline: function() {
        var a, b = .3, c = this.timeline = new TimelineMax();
        c.from(this.ui.optionsElm, b, {
            css: {
                height: 0
            }
        }), c.from(this.ui.scrollbar, b, {
            css: {
                opacity: 0
            },
            delay: -.1
        }), a = setInterval(function() {
            c.reverse(), clearInterval(a);
        }, 400);
    },
    _initTimeline: function() {
        empty(this.timeline) && this._initAnimationTimeline();
    },
    ensureAnimationFunctionality: function() {
        this._initScrollbar(), this._initTimeline();
    },
    destroy: function() {
        this.element.removeAttr("hidden"), this._removeCreatedElements(), this._removeEventListeners(), 
        this._destroy();
    },
    refreshOptions: function() {
        this._removeEventListeners(), this._removeCreatedOptions(), this._drawSelectOptions(), 
        this._addEventListeners(), this.setLabelText(), this.element.val(null).trigger("change");
    },
    setLabelText: function(a, b) {
        b = b || "text", a = a || (empty(this.options.ui.buttonElm.text) ? empty(this.options.labelText) ? this.element.find("option[value]").eq(0).text() : this.options.labelText : this.options.ui.buttonElm.text), 
        $(".label", this.getUiElement("buttonElm")).eq(0)[b](a);
    },
    setSelected: function(a) {
        a.parent().addClass(this.options.ui.optionsElm.optionSelectedClassName), 
        this.element.val(a.attr("data-value")).trigger("change"), console.log(this.element.val());
    },
    clearSelected: function() {
        this.getUiElement("optionsElm").find("> ul > li").removeClass(this.options.ui.optionsElm.optionSelectedClassName);
    }
});