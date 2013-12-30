/*! jui-commons 2013-12-30 */
$.widget("jui.juiBase", {
    options: {
        defaultTimelineClass: "TimelineLite",
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
            if ("string" == typeof c[a] && (c[a] = c[a] = $(c[a], b.element)), $.isPlainObject(c[a])) {
                if (isset(c[a].elm) && c[a].elm.length > 0) return;
                c[a].elm = b._getElementFromOptions(c[a]);
            }
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
        var b = this.options, c = null;
        return isset(b.ui[a]) && (c = b.ui[a].elm, c instanceof $ && c.length > 0) ? c : this._getElementFromOptions("ui." + a);
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
}), $.widget("jui.juiAbstractPaginator", $.jui.juiBase, {
    options: {
        pages: {
            prev: 0,
            pointer: 0,
            next: 0,
            last: 0,
            length: 0,
            direction: 1
        },
        onGotoPageNum: null
    },
    _create: function() {
        this._gotoPageNum(this.options.pages.pointer);
    },
    _nextPage: function() {
        var a = this.options;
        a.pages.pointer_direction = 1, a.pages.pointer < a.pages.length - 1 ? a.pages.pointer += 1 : a.pages.pointer = 0, 
        this._gotoPageNum(a.pages.pointer), this.element.trigger(this.widgetName + ":nextPage", {
            pointer: a.pages.pointer
        });
    },
    _prevPage: function() {
        var a = this.options;
        a.pages.pointer > 0 ? a.pages.pointer -= 1 : a.pages.pointer = a.pages.length - 1, 
        a.pages.pointer_direction = -1, this._gotoPageNum(a.pages.pointer), this.element.trigger(this.widgetName + ":prevPage", {
            pointer: a.pages.pointer
        });
    },
    _gotoPageNum: function(a) {
        var b = this.options;
        b.pages.prev = a - 1, b.pages.next = a + 1, a > b.pages.length - 1 && (a = b.pages.length - 1), 
        0 > a && (a = 0), b.pages.pointer = a, this.getValueFromOptions("onGotoPageNum"), 
        this.element.trigger(this.widgetName + ":gotoPageNum", {
            pointer: a
        });
    },
    getPointer: function() {
        return this.options.pages.pointer;
    }
}), $.widget("jui.juiAffix", $.jui.juiBase, {
    options: {
        "class": "jui-afix",
        scrollableElm: $("html,body"),
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
            top: c.position().top,
            right: c.position().right,
            bottom: c.position().bottom,
            left: c.position().left
        }), f = b.scrollableElm, g = {
            top: a.getValueFromOptions("offset.top"),
            right: a.getValueFromOptions("offset.right"),
            bottom: a.getValueFromOptions("offset.bottom"),
            left: a.getValueFromOptions("offset.left")
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
}), $.widget("jui.juiBasicPaginator", $.jui.juiAbstractPaginator, {
    options: {
        template: null,
        className: "jui-basic-paginator",
        ui: {
            firstBtn: {
                elm: null,
                selector: "> .first-btn.btn",
                attribs: {
                    "class": "first-btn btn",
                    href: "#"
                },
                appendTo: "this.element",
                enabled: !0,
                html: "<a>&#124;&lt; First</a>",
                create: !0
            },
            prevBtn: {
                elm: null,
                selector: "> .prev-btn.btn",
                attribs: {
                    "class": "prev-btn btn",
                    href: "#"
                },
                appendTo: "this.element",
                enabled: !0,
                html: "<a>&lt;&lt; Prev</a>",
                create: !0
            },
            nextBtn: {
                elm: null,
                selector: "> .next-btn.btn",
                attribs: {
                    "class": "next-btn btn",
                    href: "#"
                },
                appendTo: "this.element",
                enabled: !0,
                html: "<a>Next &gt;&gt;</a>",
                create: !0
            },
            lastBtn: {
                elm: null,
                selector: "> .last-btn.btn",
                attribs: {
                    "class": "last-btn btn",
                    href: "#"
                },
                appendTo: "this.element",
                enabled: !0,
                html: "<a>Last &gt;&#124;</a>",
                create: !0
            },
            itemsContainer: {
                selector: "> .items"
            },
            items: {
                elm: null,
                selector: "> .items > .item",
                firstInRange: 0,
                lastInRange: 0,
                perPage: 0
            }
        },
        skipPagesCalculation: !1
    },
    _create: function() {
        var a = this, b = a.options;
        "string" == typeof b.className && b.className.length > 0 && a.element.addClass(b.className), 
        "string" == typeof b.template && b.template.length > 0 && a.element.append(b.template), 
        a._populateUiElementsFromOptions(b), a._addEventListeners(), empty(b.skipPagesCalculation) && a._calculateNumberOfPages(b), 
        a._super();
    },
    _addEventListeners: function() {
        var a = this, b = a.getFirstBtnElm(), c = a.getNextBtnElm(), d = a.getPrevBtnElm(), e = a.getLastBtnElm();
        isset(b) && b.length > 0 && b.on("click", function(b) {
            b.preventDefault(), a.firstPage();
        }), isset(d) && d.length > 0 && d.on("click", function(b) {
            b.preventDefault(), a.prevPage();
        }), isset(c) && c.length > 0 && c.on("click", function(b) {
            b.preventDefault(), a.nextPage();
        }), isset(e) && e.length > 0 && e.on("click", function(b) {
            b.preventDefault(), a.lastPage();
        });
    },
    _calculateNumberOfPages: function(a) {
        var b, c = a || this.options, d = this.getItemsElm();
        b = this.getValueFromHash("ui.items.perPage", c), c.pages.length = Math.ceil(d.length / b), 
        c.pages.length = 0/0 !== c.pages.length ? c.pages.length : 0, this.element.trigger(this.widgetName + ":numbersCalculated", {
            pointer: c.pages.pointer
        });
    },
    firstPage: function() {
        this._gotoPageNum(0), this.element.trigger(this.widgetName + ":firstPage");
    },
    prevPage: function() {
        this._prevPage(), this.element.trigger(this.widgetName + ":prevPage", this.options.pages);
    },
    nextPage: function() {
        this._nextPage(), this.element.trigger(this.widgetName + ":nextPage", this.options.pages);
    },
    lastPage: function() {
        this._gotoPageNum(this.options.pages.length - 1), this.element.trigger(this.widgetName + ":lastPage");
    },
    getFirstBtnElm: function() {
        return this.getUiElement("firstBtn");
    },
    getPrevBtnElm: function() {
        return this.getUiElement("prevBtn");
    },
    getNextBtnElm: function() {
        return this.getUiElement("nextBtn");
    },
    getLastBtnElm: function() {
        return this.getUiElement("lastBtn");
    },
    getItemsElm: function() {
        return this.getUiElement("items");
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
                appendTo: "prepend to this.element",
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
        $(window).on("resize", function() {
            var b = a.getUiElement("inidicatorsNeededElms"), c = a.getUiElement("indicatorElms");
            b.each(function(a, b) {
                c.eq(a).css("top", $(b).offset().top);
            });
        });
    },
    _createInidicators: function() {
        var a, b, c = this, d = c.options, e = d.ui.inidicatorsNeededElms, f = c.getUiElement("wrapperElm"), g = c.getUiElement("scrollableElm");
        e.elm = a = $(e.selector, this.element), 0 !== a.length && (a.each(function(b, c) {
            c = $(c);
            var d = $('<div class="indicator" title="' + c.text() + '"' + 'data-index="' + b + '"></div>');
            f.append(d), $(".indicator", f).eq(b).css("top", c.offset().top), d.juiAffix({
                scrollableElm: g,
                offset: {
                    top: (b + 1) * d.height(),
                    bottom: -((a.length - b) * d.height())
                }
            });
        }), b = d.ui.indicatorElms.elm = $(d.ui.indicatorElms.selector, f), b.click(function() {
            var b = $(this), c = a.eq(b.attr("data-index")), e = parseInt(c.offset().top);
            TweenMax.to(g, d.animation.duration, {
                scrollTo: e
            });
        }));
    }
}), $.widget("jui.juiPaginatorWithTextField", $.jui.juiBasicPaginator, {
    options: {
        template: '<a href="#" class="first-btn btn">&#124;&lt; First</a><a href="#" class="prev-btn btn">&lt; Prev</a><input type="text" size="4" class="text-field btn" /><a href="#" class="next-btn btn">Next &gt;</a><a href="#" class="last-btn btn">Last &gt;&#124;</a>',
        className: "jui-paginator-with-text-field jui-basic-paginator",
        ui: {
            items: {
                elm: null,
                selector: "> .items > .item",
                perPage: 12,
                create: !1
            },
            textField: {
                elm: null,
                selector: "> .text-field",
                enabled: !0,
                create: !1
            },
            firstBtn: {
                create: !1
            },
            prevBtn: {
                create: !1
            },
            nextBtn: {
                create: !1
            },
            lastBtn: {
                create: !1
            }
        }
    },
    _create: function() {
        var a = this;
        a.options, a.element.addClass(a.options.className), a._super();
    },
    _addEventListeners: function() {
        var a = this, b = a.options, c = a.getUiElement("textField");
        a.element.on("juiPaginatorWithTextField:gotoPageNum", function(a, b) {
            parseInt(c.val(), 10) !== parseInt(b.pointer, 10) + 1 && c.val(b.pointer + 1);
        }), a.getTextFieldElm().bind("keyup", function(c) {
            var d = ($(this), {});
            if (13 == c.keyCode) {
                var e = $(this), f = e.val();
                if (/\d+/.test(f)) {
                    if (f - 1 > b.pages.length) throw new Error("Range Exception: Paginator value entered is out of range.  Value entered: " + f + "\n\n" + "proceeding to last page.");
                    if (0 > f - 1) throw new Error("Range Exception: Paginator value entered is out of range.  Value entered: " + f + "\n\n" + "Proceeding to first page.");
                    a._gotoPageNum(f - 1);
                } else d.messages = [ "Only numbers are allowed in the paginator textfield." ];
                "function" == typeof b.ui.textField.callback && (d.items = b.ui.items, d.pages = b.pages, 
                b.ui.textField.callback(d));
            }
        }), a._super();
    },
    getTextFieldElm: function() {
        return this.getUiElement("textField");
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
        b.mousewheel(function(c, d, g, h) {
            if (c.preventDefault(), d = void 0 !== d || null !== d ? d : h, null !== d && void 0 !== d) {
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
                selector: "> .content"
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
        e === d ? this.element.on(e, function() {
            a.options.state === b.COLLAPSED ? (a.ensureAnimationFunctionality(), c.timeline.play(), 
            a.options.state = b.EXPANDED) : (a.ensureAnimationFunctionality(), c.timeline.reverse(), 
            a.options.state = b.COLLAPSED);
        }) : this.element.on(e, function() {
            a.ensureAnimationFunctionality(), c.timeline.play(), a.options.state = b.EXPANDED;
        }).on(d, function() {
            a.ensureAnimationFunctionality(), c.timeline.reverse(), a.options.state = b.COLLAPSED;
        }), $(window).on("click", function(d) {
            $.contains(a.element, $(d.target)) === !1 && 1 === c.timeline.progress() && a.options.state === b.EXPANDED && (a.ensureAnimationFunctionality(), 
            c.timeline.reverse(), a.options.state = b.COLLAPSED);
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
    },
    getState: function() {
        return this.options.state;
    }
}), $.widget("jui.juiSelectPicker", $.jui.juiBase, {
    options: {
        className: "jui-select-picker",
        animation: {
            duration: .3
        },
        labelText: "",
        skipFirstOptionItem: !1,
        ui: {
            wrapperElm: {
                elm: null,
                attribs: {
                    "class": "jui-select-picker"
                },
                appendTo: "after this.element",
                selector: ".jui-select-picker",
                html: "<div></div>",
                create: !0,
                timeline: new TimelineMax()
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
            bodyElm: {
                elm: null,
                attribs: {
                    "class": "body"
                },
                selector: "> .body",
                html: "<div></div>",
                appendTo: "wrapperElm",
                create: !0
            },
            optionsElm: {
                elm: null,
                attribs: {
                    "class": "options"
                },
                selector: ".options",
                html: "<div></div>",
                appendTo: "bodyElm",
                create: !0,
                optionSelectedClassName: "selected"
            }
        }
    },
    _create: function() {
        this.options, $("html").hasClass("touch");
    },
    _init: function() {
        var a = this, b = this.options, c = a.getValueFromHash("className", b), d = a.getValueFromHash("ui.wrapperElm.attribs", b)["class"];
        empty(c) || (empty(d) || "string" != typeof d ? b.ui.wrapperElm.attribs["class"] = c : b.ui.wrapperElm.attribs["class"] += " " + c), 
        this.options.timeline = new TimelineMax({
            paused: !0
        }), this.element.attr("hidden", "hidden").css("display", "none"), this._populateUiElementsFromOptions(), 
        this.setLabelText(), this._drawSelectOptions(), this._initScrollableDropDown(), 
        this._addEventListeners();
    },
    _drawSelectOptions: function() {
        var a = this, b = a.getUiElement("optionsElm"), c = a.element.find("option"), d = $("<ul></ul>"), e = a.options;
        c.each(function(a, b) {
            if (b = $(b), 0 !== a || !e.skipFirstOptionItem) {
                var f = b.attr("value"), g = b.attr("data-value"), h = b.attr("class");
                h = empty(h) ? "" : 'class="' + h + '" ', f = empty(f) ? empty(g) ? "" : 'data-value="' + g + '" ' : ' data-value="' + f + '"';
                var i = $("<li><a " + h + 'href="javascript: void(0);"' + f + ">" + b.text() + "</a></li>");
                0 !== a || empty(e.ui.buttonElm.text) ? 1 === a && empty(e.ui.buttonElm.text) && i.addClass("first") : i.addClass("first"), 
                a === c.length - 1 && i.addClass("last"), d.append(i);
            }
        }), b.append(d);
    },
    _addEventListeners: function() {
        var a = this, b = this.options, c = a.getUiElement("wrapperElm");
        c.on("mouseup", function() {
            var b = c.juiScrollableDropDown("getState").indexOf("collapsed") > -1 ? !0 : !1;
            b ? a.playAnimation() : a.reverseAnimation();
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
        var a, b, c, d, e = this, f = e.options, g = e.getUiElement("wrapperElm"), h = e.getUiElement("optionsElm"), i = f.animation.duration;
        d = {
            state: "collapsed",
            ui: {
                contentElm: {
                    elm: this.getUiElement("optionsElm"),
                    attribs: f.ui.optionsElm.attribs,
                    selector: f.ui.optionsElm.selector + ""
                }
            }
        }, isset(f.expandOn) && (d.expandOn = f.expandOn), isset(f.collapseOn) && (d.collapseOn = f.collapseOn), 
        c = g.juiScrollableDropDown(d), b = c.juiScrollableDropDown("getAnimationTimeline"), 
        b.seek(0), b.clear(), b.pause(), a = $(".vertical.scrollbar", g), [ TweenLite.to(g, i, {
            height: g.css("max-height")
        }), TweenLite.to(h, i, {
            height: h.css("max-height"),
            autoAlpha: 1,
            delay: -.3
        }), TweenLite.to(a, i, {
            autoAlpha: 1,
            delay: -.2
        }) ].forEach(function(a) {
            b.add(a);
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
        b = b || "text", a = a || (empty(this.options.ui.buttonElm.text) ? empty(this.options.labelText) ? this.element.find("option").eq(0).text() : this.options.labelText : this.options.ui.buttonElm.text), 
        this.getUiElement("labelElm").eq(0)[b](a);
    },
    setSelected: function(a) {
        a.parent().addClass(this.options.ui.optionsElm.optionSelectedClassName), 
        this.element.val(a.attr("data-value")).trigger("change");
    },
    clearSelected: function() {
        this.getUiElement("optionsElm").find("> ul > li").removeClass(this.options.ui.optionsElm.optionSelectedClassName);
    },
    playAnimation: function() {
        var a = this, b = a.options;
        b.timeline.play();
    },
    reverseAnimation: function() {
        var a = this, b = a.options;
        b.timeline.reverse();
    }
});