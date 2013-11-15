/*! jui-commons 2013-11-15 */
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
        a = a || this.options.ui, isset(b.ui) || (b.ui = {}), Object.keys(a).forEach(function(c) {
            "string" == typeof a[c] && (b.ui[c] = a[c] = $(a[c], b.element)), $.isPlainObject(a[c]) && (b.ui[c] = b._getElementFromOptions(a[c]));
        });
    },
    _getElementFromOptions: function(a) {
        var b = this, c = (b.options, a);
        return "string" == typeof c && (c = b._namespace(c)), "function" == typeof c && (c = c()), 
        empty(c) ? null : c instanceof $ && c.length > 0 ? c : (isset(c.selector) && empty(c.create) && "string" == typeof c.selector && (c.elm = "string" == typeof c.appendTo && c.appendTo.length > 0 && -1 === c.appendTo.indexOf("this") ? $(c.selector, b.getUiElement(c.appendTo)) : $(c.selector, b.element)), 
        !empty(c.html) && c.create && "string" == typeof c.html && (c.elm = this._createElementFromOptions(c), 
        isset(c.appendTo) && "string" == typeof c.appendTo && ("this.element" === c.appendTo ? c.elm = this.element.append(c.elm).find(c.selector) : "after this.element" === c.appendTo ? this.element.after(c.elm) : "before this.element" === c.appendTo ? this.element.before(c.elm) : "prepend to this.element" === c.appendTo ? this.element.prepend(c.elm) : "append to this.element" === c.appendTo ? this.element.append(c.elm) : this.getUiElement(c.appendTo).append(c.elm).find(c.selector))), 
        empty(c.elm) ? null : c.elm);
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
        return isset(this.ui[a]) && this.ui[a] instanceof $ && this.ui[a].length > 0 ? this.ui[a] : this._getElementFromOptions("ui." + a);
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
}), $.widget("jui.juiFloatingScrollIndicators", $.jui.juiBase, {
    options: {
        "class": "jui-floating-scroll-indicator",
        ui: {
            scrollableElm: {
                elm: $("body").eq(0)
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
        $(window).scroll(function() {});
    },
    _addScrollListeners: function() {},
    _createInidicators: function() {
        var a, b, c = this, d = c.options, e = d.ui.inidicatorsNeededElms, f = c.getUiElement("wrapperElm");
        a = $(e.selector, this.element), 0 !== a.length && (a.each(function(a, b) {
            b = $(b), f.append('<div class="indicator" title="' + b.text() + '"' + 'data-index="' + a + '"></div>');
        }), b = d.ui.indicatorElms.elm = $(d.ui.indicatorElms.selector, f), b.click(function() {
            var b = $(this), d = a.eq(b.attr("data-index"));
            c.ui.scrollableElm.animate({
                scrollTop: d.offset().top
            }, 300);
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
        this._populateUiElementsFromOptions(), console.log("hello");
        var a = this.options, b = (this.element, this.ui.vertScrollbar, this.ui.contentHolder), c = b.get(0).scrollWidth, d = b.get(0).scrollHeight, e = (this.ui.vertHandle, 
        this);
        "hidden" !== b.css("overflow") && b.css("overflow", "hidden"), e.element.addClass("jui-scroll-pane"), 
        d > b.height() && e.initScrollbar(a.scrollbarOriented.VERTICALLY), c > b.width() ? e.initScrollbar(a.scrollbarOriented.HORIZONTALLY) : this.ui.horizScrollbar.css("display", "none");
    },
    _scrollByOrientation: function(a, b) {
        var c, d = (this.options, this.ui.contentHolder), e = b, f = this.getScrollDirVars(e), g = f.scrollAmountTotal, h = this.getScrollbarHandleByOrientation(e), i = this.getScrollbarByOrientation(e), j = f.cssCalcDir, k = "outer" + ucaseFirst(f.scrollbarDimProp);
        d[f.scrollbarDimProp]() >= g || (g >= a && a >= 0 ? (d.scrollTop(a), c = a / g, 
        h.css(j, i[k]() * c)) : a > g ? h.css(j, i[k]() - h[k]()) : 0 > a && h.css(j, 0), 
        this.scrollContentHolder(e), this.constrainHandle(e));
    },
    scrollContentHolder: function(a) {
        var b = this.getScrollbarHandleByOrientation(a), c = this.getScrollbarByOrientation(a), d = this.ui.contentHolder, e = this.getScrollDirVars(a), f = e.scrollAmountTotal, g = e.cssCalcDir, h = e.scrollbarDimProp, i = b.position()[g] / c[h](), j = i * f, k = "scroll" + ucaseFirst(g);
        j >= 0 && f >= j ? d[k](i * f) : 0 > j ? d[k](0) : j > f && d[k](f);
    },
    constrainHandle: function(a) {
        var b = this.getScrollbarHandleByOrientation(a), c = this.getScrollbarByOrientation(a), d = this.getScrollDirVars(a), e = d.scrollbarDimProp, f = d.cssCalcDir;
        b.position()[f] < 0 ? b.css(f, 0) : b.position()[f] + b[e]() > c[e]() && b.css(f, c[e]() - b[e]());
    },
    initScrollbar: function(a) {
        var b = this.getScrollbarByOrientation(a), c = this.getScrollbarHandleByOrientation(a), d = this.ui.contentHolder, e = (this.options, 
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
            c.css(h, b["offset" + g.toUpperCase()] - c[i]() / 2), e.constrainHandle(a), 
            e.scrollContentHolder(a);
        });
    },
    initScrollbarHandle: function(a) {
        var b = this.ui.contentHolder, c = this.getScrollbarByOrientation(a), d = this.getScrollbarHandleByOrientation(a), e = this.getScrollDirVars(a), f = e.scrollbarDimProp, g = b[f](), h = b.get(0)["scroll" + ucaseFirst(f)], i = c[f]();
        d[f](g * i / h);
    },
    getScrollDirVars: function(a) {
        var b, c = this, d = (c.options, this.ui.contentHolder);
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
        return a === b.scrollbarOriented.VERTICALLY ? this.ui.vertScrollbar : this.ui.horizScrollbar;
    },
    getScrollbarHandleByOrientation: function(a) {
        var b = this.options;
        return a === b.scrollbarOriented.VERTICALLY ? this.ui.vertHandle : this.ui.horizHandle;
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