/*! jui-commons 2013-12-06 */
$.widget("jui.juiBase", {
    options: {
        defaultTimelineClass: "TimelineMax",
        timeline: null,
        ui: {}
    },
    _namespace: function(a, b) {
        var c, d = a.split("."), e = isset(b) ? b : this.options;
        for (c = 0; c < d.length; c += 1) "undefined" == typeof e[d[c]] && (e[d[c]] = {}), 
        e = e[d[c]];
        return e;
    },
    _populateUiElementsFromOptions: function(a) {
        var b = this, c = isset(a) ? a : this.options;
        isset(c.ui) || (c.ui = {}), c = c.ui, Object.keys(c).forEach(function(a) {
            "string" == typeof c[a] && (c[a] = c[a] = $(c[a], b.element)), $.isPlainObject(c[a]) && (c[a].elm = b._getElementFromOptions(c[a]));
        });
    },
    _getElementFromOptions: function(a) {
        var b, c = this, d = c.options, e = a;
        return "string" == typeof e && (e = c._namespace(e, d)), "function" == typeof e && (e = e()), 
        empty(e) ? null : e instanceof $ && e.length > 0 ? e : isset(e.elm) && e.elm instanceof $ && e.length > 0 ? e.elm : (isset(e.selector) && empty(e.create) && "string" == typeof e.selector && (e.elm = "string" == typeof e.appendTo && e.appendTo.length > 0 && -1 === e.appendTo.indexOf("this") ? $(e.selector, c.getUiElement(e.appendTo)) : $(e.selector, c.element)), 
        !empty(e.html) && e.create && "string" == typeof e.html && (e.elm = this._createElementFromOptions(e), 
        isset(e.appendTo) && "string" == typeof e.appendTo && (b = this.element.parent(), 
        "this.element" === e.appendTo ? e.elm = this.element.append(e.elm).find(e.selector) : "after this.element" === e.appendTo ? (this.element.after(e.elm), 
        e.elm = b.find(this.element.get(0).nodeName + " ~ " + e.selector)) : "before this.element" === e.appendTo ? (this.element.before(e.elm), 
        e.elm = b.find(e.selector + " ~ " + this.element.get(0).nodeName)) : "prepend to this.element" === e.appendTo ? (this.element.prepend(e.elm), 
        e.elm = this.element.children().first()) : e.elm = this.getUiElement(e.appendTo).append(e.elm).find(e.selector)), 
        delete e.create), empty(e.elm) ? null : e.elm);
    },
    _createElementFromOptions: function(a) {
        var b = null;
        return isset(a) && "string" == typeof a && (a = this._namespace(a)), empty(a) ? null : (a.html && (b = $(a.html), 
        isset(a.attribs) && $.isPlainObject(a.attribs) && b.attr(a.attribs), delete a.create), 
        b);
    },
    _removeCreatedElements: function() {
        var a = this, b = a.options;
        b.ui.keys.forEach(function() {
            b.ui[key].elm instanceof $ && b.ui[key].create && b.ui[key].elm.remove();
        });
    },
    getUiElement: function(a) {
        var b = this.options;
        return isset(b.ui[a]) && (a = b.ui[a].elm, a instanceof $ && a.length > 0) ? a : this._getElementFromOptions("ui." + a);
    },
    setCssOnUiElement: function(a, b) {
        var c = this.getUiElement(a);
        c && c.css(b);
    },
    getAnimationTimeline: function() {
        var a = this.options.timeline;
        return empty(a) && (a = this.options.timeline = new window[this.options.defaultTimelineClass]()), 
        a;
    },
    _initAnimationTimeline: function(a, b, c) {
        var d, e, f, g, h, i, j, k = this;
        if (a = isset(a) ? a : this.getAnimationTimeline(), c = c || k.options, 
        b = b || null, d = c, isset(d.defaultAnimations) && d.defaultAnimations instanceof Array && (j = d.defaultAnimations), 
        isset(d.animations) && d.animations instanceof Array && isset(j) && (j = isset(b) ? $.extend(!0, j, d.animations) : d.animations), 
        isset(b) && isset(j)) b = $.extend(!0, j, b); else {
            if (!isset(j)) return;
            b = j;
        }
        for (e = 0; e < b.length; e += 1) f = b[e], g = k.getUiElement(f.elmAlias), 
        h = f.duration, i = f.props, isset(f.preInit) && "function" == typeof f.preInit && f.preInit.apply(this), 
        a[f.type](g, h, i), isset(f.postInit) && "function" == typeof f.postInit && f.postInit.apply(this);
    },
    getValueFromOptions: function(a, b, c) {
        return this.getValueFromHash(a, this.options, b, c);
    },
    getValueFromHash: function(a, b, c, d) {
        var e = null;
        return "string" == typeof a && $.isPlainObject(b) && (e = this._namespace(a, b), 
        "function" == typeof e && empty(d) && (e = e.apply(this, c))), e;
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
            top: a.getValueFromOptions("offset.top"),
            right: a.getValueFromOptions("offset.right"),
            bottom: a.getValueFromOptions("offset.bottom"),
            left: a.getValueFromOptions("offset.left")
        };
        c.addClass(b["class"]), f.bind("scroll resize orientationchange load", function() {
            {
                var a = $(this), b = a.scrollTop(), h = (a.scrollLeft(), f.height() + g.bottom);
                f.width() + g.right;
            }
            d && (b > e.top - g.top && c.offset().top - b < h ? c.css({
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
            easing: Power3.easeOut,
            duration: 1
        },
        ui: {
            scrollableElm: {
                elm: $("body")
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
        var a, b, c = this, d = c.options, e = d.ui.inidicatorsNeededElms, f = c.getUiElement("wrapperElm"), g = c.getUiElement("scrollableElm");
        e.elm = a = $(e.selector, this.element), 0 !== a.length && (a.each(function(b, c) {
            c = $(c);
            var d = $('<div class="indicator" title="' + c.text() + '"data-index="' + b + '"></div>');
            f.append(d), $(".indicator", f).eq(b).css("top", c.offset().top), d.juiAffix({
                offset: {
                    top: (b + 1) * d.height(),
                    bottom: -((a.length - b) * d.height())
                }
            });
        }), b = d.ui.indicatorElms.elm = $(d.ui.indicatorElms.selector, f), b.click(function() {
            var b = $(this), c = a.eq(b.attr("data-index")), e = parseInt(c.offset().top);
            console.log(g, e, d.animation), TweenMax.to(g, d.animation.duration, {
                scrollTo: e
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
        var a = this.options, b = this.getUiElement("contentHolder"), c = b.get(0).scrollWidth, d = b.get(0).scrollHeight, e = this.getUiElement("vertHandle"), f = this;
        "hidden" !== b.css("overflow") && b.css("overflow", "hidden"), f.element.addClass("jui-scroll-pane"), 
        d > b.height() && f.initScrollbar(a.scrollbarOriented.VERTICALLY), c > b.width() ? f.initScrollbar(a.scrollbarOriented.HORIZONTALLY) : this.getUiElement("horizScrollbar").css("display", "none"), 
        f.element.mousewheel(function(c, d, g, h) {
            if (c.stopPropagation(), d = void 0 !== d || null !== d ? d : h, null !== d && void 0 !== d) {
                var i = 1 > d ? 10 : -10, j = (b.scrollTop() + i, e.position().top + i);
                e.css("top", j), f.constrainHandle(a.scrollbarOriented.VERTICALLY), f.constrainHandle(a.scrollbarOriented.HORIZONTALLY), 
                f.scrollContentHolder(a.scrollbarOriented.VERTICALLY), f.scrollContentHolder(a.scrollbarOriented.HORIZONTALLY);
            }
        });
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
        e.initScrollbarHandle(a), c.draggable({
            containment: "parent",
            cursor: "s-resize",
            axis: g,
            drag: function(a, c) {
                var e = c.position[h] / b[i]();
                d["scroll" + ucaseFirst(h)](e * f.scrollAmountTotal);
            }
        }), b.bind("click", function(b) {
            b.stopPropagation(), c.css(h, b["offset" + g.toUpperCase()] - c[i]() / 2), 
            e.constrainHandle(a), e.scrollContentHolder(a);
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
            type: "to",
            duration: .3,
            elmAlias: "scrollbar",
            props: {
                css: {
                    opacity: 1
                },
                delay: -.1
            }
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
        this._populateUiElementsFromOptions();
    },
    _init: function() {
        var a = this.options;
        this._addEventListeners(), a.state = a.state || a.states.COLLAPSED, this.ensureAnimationFunctionality(), 
        a.state === a.states.COLLAPSED ? a.timeline.reverse() : a.timeline.play();
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
        var a = this, b = a.options.states, c = this.options, d = this._getCollapseOnEventStringName(), e = this._getExpandOnEventStringName();
        console.log(c.timeline), e === d ? this.element.on(e, function() {
            a.options.state === b.COLLAPSED ? (a.ensureAnimationFunctionality(), c.timeline.play(), 
            a.options.state = b.EXPANDED) : (a.ensureAnimationFunctionality(), c.timeline.reverse(), 
            a.options.state = b.COLLAPSED);
        }) : this.element.on(e, function() {
            a.ensureAnimationFunctionality(), c.timeline.play(), a.options.state = b.EXPANDED;
        }).on(d, function() {
            a.ensureAnimationFunctionality(), c.timeline.reverse(), a.options.state = b.COLLAPSED;
        });
    },
    _removeEventListeners: function() {
        this.element.off(this._getCollapseOnEventStringName()).off(this._getExpandOnEventStringName());
    },
    _initScrollbar: function() {
        var a = this.options, b = this._namespace("ui.scrollbar");
        !empty(b.elm) && b.elm.length > 0 || (this.element.juiScrollPane({
            ui: {
                contentHolder: {
                    elm: this.getUiElement("contentElm"),
                    selector: a.ui.contentElm.selector + ""
                }
            }
        }), b.elm = $(".scrollbar", this.element));
    },
    initAnimationTimeline: function() {
        this._initAnimationTimeline();
    },
    _initTimeline: function() {
        empty(this.options.timeline) && this.initAnimationTimeline();
    },
    ensureAnimationFunctionality: function() {
        this._initScrollbar(), this._initTimeline();
    },
    destroy: function() {
        this._removeCreatedElements(), this._removeEventListeners(), this._super();
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
                    "class": "jui-select-picker"
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
                selector: "> .button",
                html: "<div></div>",
                appendTo: "wrapperElm",
                create: !0
            },
            buttonArrowElm: {
                elm: null,
                attribs: {
                    "class": "arrow"
                },
                selector: "> .arrow",
                html: "<div></div>",
                appendTo: "buttonElm",
                create: !0
            },
            labelElm: {
                elm: null,
                attribs: {
                    "class": "label"
                },
                text: "",
                selector: "> .label",
                html: "<span></span>",
                appendTo: "buttonElm",
                create: !0
            },
            selectedItemLabelElm: {
                elm: null,
                attribs: {
                    "class": "selected-item-label selected"
                },
                prefixText: "You've chosen \"",
                suffixText: '"',
                selector: "> .selected-item-label",
                html: "<span></span>",
                appendTo: "buttonElm",
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
            },
            footerElm: {
                elm: null,
                attribs: {
                    "class": "footer"
                },
                selector: "> .footer",
                html: "<div></div>",
                create: !0,
                appendTo: "wrapperElm"
            }
        },
        labelText: ""
    },
    _create: function() {
        this.options;
        $("html").hasClass("touch");
    },
    _init: function() {
        this.options.timeline = new TimelineMax({
            paused: !0
        }), this.element.attr("hidden", "hidden").css("display", "none"), this._populateUiElementsFromOptions(), 
        this.setLabelText(), this._drawSelectOptions(), this._initScrollableDropDown(), 
        this._addEventListeners();
    },
    _drawSelectOptions: function() {
        var a = this, b = a.getUiElement("optionsElm"), c = a.element.find("option"), d = $("<ul></ul>"), e = a.options;
        c.each(function(a, b) {
            if (b = $(b), 0 !== a || !empty(e.ui.buttonElm.text)) {
                var f = $('<li><a href="javascript: void(0);" data-value="' + b.attr("value") + '">' + b.text() + "</a></li>");
                0 !== a || empty(e.ui.buttonElm.text) ? 1 === a && empty(e.ui.buttonElm.text) && f.addClass("first") : f.addClass("first"), 
                a === c.length - 1 && f.addClass("last"), d.append(f);
            }
        }), b.append(d);
    },
    _addEventListeners: function() {
        var a = this, b = this.options, c = a.getUiElement("wrapperElm");
        c.on("click", function() {
            b.timeline.play();
        }), c.on("click", "a[data-value]", function(c) {
            var d = $(c.currentTarget);
            a.clearSelected(), a.setSelected(d), b.timeline.reverse();
        }), this.element.on("change", function() {
            var b = $(this);
            isset(b.val()) && a.setSelectedItemLabelText(b.val());
        });
    },
    _removeCreatedOptions: function() {
        this.getUiElement("optionsElm").find("ul").remove();
    },
    _initScrollableDropDown: function() {
        var a, b, c = this.options, d = this._namespace("ui.scrollbar"), e = this.getUiElement("wrapperElm");
        !empty(d.elm) && d.elm.length > 0 || (b = {
            state: "collapsed",
            ui: {
                contentElm: {
                    elm: this.getUiElement("optionsElm"),
                    attribs: c.ui.optionsElm.attribs,
                    selector: c.ui.optionsElm.selector + ""
                }
            }
        }, isset(c.expandOn) && (b.expandOn = c.expandOn), isset(c.collapseOn) && (b.collapseOn = c.collapseOn), 
        a = e.juiScrollableDropDown(b), a.juiScrollableDropDown("getAnimationTimeline").seek(0), 
        d.elm = $(".scrollbar", this.element));
    },
    _initArrowAnimation: function() {
        var a = this, b = a.options, c = b.timeline, d = a.getUiElement("buttonArrowElm"), e = .38;
        c.to(d, e, {
            rotation: -180,
            top: -d.height() / 2 + "px"
        });
    },
    destroy: function() {
        this.element.removeAttr("hidden"), this._removeCreatedOptions(), this._super();
    },
    refreshOptions: function() {
        this._removeCreatedOptions(), this._drawSelectOptions(), this.setLabelText(), 
        this.element.val(null).trigger("change");
    },
    setSelectedItemLabelText: function(a, b, c) {
        a = a || "", b = b || "text", c = c || !0;
        var d = this.options.ui.selectedItemLabelElm, e = this.getUiElement("selectedItemLabelElm").eq(0);
        c && (a = d.prefixText + a + d.suffixText), TweenMax.to(e, .16, {
            opacity: 0,
            onCompleteParams: [ a, b, e ],
            onComplete: function() {
                var a = arguments, b = a[0], c = a[1], d = a[2];
                d[c](b), TweenMax.to(d, .16, {
                    opacity: 1
                });
            }
        });
    },
    setLabelText: function(a, b) {
        b = b || "text", a = a || (empty(this.options.ui.buttonElm.text) ? empty(this.options.labelText) ? this.element.find("option[value]").eq(0).text() : this.options.labelText : this.options.ui.buttonElm.text), 
        this.getUiElement("labelElm").eq(0)[b](a);
    },
    setSelected: function(a) {
        a.parent().addClass(this.options.ui.optionsElm.optionSelectedClassName), 
        this.element.val(a.attr("data-value")).trigger("change"), console.log(this.element.val());
    },
    clearSelected: function() {
        this.getUiElement("optionsElm").find("> ul > li").removeClass(this.options.ui.optionsElm.optionSelectedClassName);
    }
});