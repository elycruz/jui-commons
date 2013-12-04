/*! jui-commons 2013-12-04 */
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
        a.attribs && b.attr(a.attribs), delete a.create), b);
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
        return isset(b.ui[a]) && (a = b.ui[a].elm, a instanceof $ && a.length > 0) ? a : this._getElementFromOptions("ui." + a);
    },
    getAnimationTimeline: function() {
        var a = this.options;
        return empty(a.timeline) && (a.timeline = new TimelineMax()), a.timeline;
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
        animations: [ {
            type: "from",
            duration: .3,
            elmAlias: "contentElm",
            props: {
                css: {
                    height: 0
                },
                ease: Power1.easeOut
            }
        }, {
            type: "from",
            duration: .3,
            elmAlias: "scrollbar",
            props: {
                css: {
                    autoAlpha: 0
                },
                delay: -.1
            }
        } ],
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
                    autoAlpha: 0
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
        var a = this, b = a.options.states, c = (this.options, this._getCollapseOnEventStringName()), d = this._getExpandOnEventStringName();
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
                html: "<button></button>",
                appendTo: "wrapperElm",
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
            }
        },
        autoUpdateSelectedItemLabel: !0,
        closeOnOptionClick: !0
    },
    _create: function() {
        this.options, $("html").hasClass("touch") || ($("html").hasClass("lt-ie9") && console.log("** Note ** -- jquery.juiSelectPicker.js doesn't support anything less than Ie9 at the moment."), 
        this.element.attr("hidden", "hidden").css("display", "none"), this._populateUiElementsFromOptions(), 
        this._drawSelectOptions(), this.setLabelText(), this._initScrollableDropDown(), 
        this._addEventListeners());
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
        var a = this, b = this.options;
        a.getUiElement("wrapperElm").on("click", "a[data-value]", function(c) {
            b.closeOnOptionClick || c.stopPropagation();
            var d = $(c.currentTarget);
            a.clearSelected(), a.setSelected(d);
        }), b.autoUpdateSelectedItemLabel && this.element.on("change", function() {
            var b = $(this);
            isset(b.val()) && a.setSelectedItemLabelText(b.val());
        });
    },
    _removeCreatedOptions: function() {
        this.getUiElement("optionsElm").find("ul").remove();
    },
    _initScrollableDropDown: function() {
        var a = this.options, b = this._namespace("ui.scrollbar");
        !empty(b.elm) && b.elm.length > 0 || (this.getUiElement("wrapperElm").juiScrollableDropDown({
            ui: {
                contentElm: {
                    elm: this.getUiElement("optionsElm"),
                    attribs: a.ui.optionsElm.attribs,
                    selector: a.ui.optionsElm.selector + ""
                }
            }
        }), b.elm = $(".scrollbar", this.element));
    },
    destroy: function() {
        this.element.removeAttr("hidden"), this._removeCreatedOptions(), this._destroy();
    },
    refreshOptions: function() {
        this._removeCreatedOptions(), this._drawSelectOptions(), this.setLabelText(), 
        this.element.val(null).trigger("change");
    },
    refresh: function() {
        this.refreshOptions();
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
        b = b || "text", a = a || (empty(this.options.ui.labelElm.text) ? empty(this.options.labelText) ? this.element.find("option[value]").eq(0).text() : this.options.labelText : this.options.ui.labelElm.text), 
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