/*! jui-commons 2013-10-19 */
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
        isset(c.appendTo) && "string" == typeof c.appendTo && ("this.element" === c.appendTo ? c.elm = this.element.append(c.elm).find(c.selector) : "after this.element" === c.appendTo ? this.element.after(c.elm) : this.getUiElement(c.appendTo).append(c.elm).find(c.selector))), 
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
        orientation: "vertical",
        ui: {
            contentHolder: {
                elm: null,
                selector: ".content",
                html: "<div></div>",
                attribs: {
                    "class": "content"
                }
            },
            scrollbar: {
                elm: null,
                selector: ".scrollbar",
                html: "<div></div>",
                appendTo: "this.element",
                attribs: {
                    "class": "scrollbar"
                },
                create: !0
            },
            handle: {
                elm: null,
                selector: ".handle",
                html: "<div></div>",
                appendTo: "scrollbar",
                attribs: {
                    "class": "handle"
                },
                create: !0
            }
        },
        scrollableDist: 0,
        debug: !1
    },
    _create: function() {
        this._populateUiElementsFromOptions();
        var a = this.options, b = (this.element, this.ui.scrollbar), c = this.ui.contentHolder, d = (c.get(0).scrollHeight, 
        this.ui.handle, this);
        "hidden" !== c.css("overflow") && c.css("overflow", "hidden"), d.element.addClass("jui-scroll-pane"), 
        a.scrollableDist = b.height(), d.initScrollbar();
    },
    scrollContentHolder: function() {
        var a = this.ui.handle, b = this.ui.contentHolder, c = b.get(0).scrollHeight, d = a.position().top / this.options.scrollableDist, e = d * c;
        e >= 0 && c >= e ? b.scrollTop(d * c) : 0 > e ? b.scrollTop(0) : e > c && b.scrollTop(c);
    },
    constrainHandle: function() {
        var a = this.ui.handle, b = this.ui.scrollbar;
        a.position().top < 0 ? a.css("top", 0) : a.position().top + a.height() > b.height() && a.css("top", b.height() - a.height());
    },
    initScrollbar: function() {
        var a = this.ui.scrollbar, b = this.ui.handle, c = this.ui.contentHolder, d = c.get(0).scrollHeight, e = this.options, f = this;
        f.initScrollbarHandle(), b.draggable({
            containment: "parent",
            cursor: "s-resize",
            axis: "y",
            drag: function(a, b) {
                var f = b.position.top / e.scrollableDist;
                c.scrollTop(f * d), e.debug && console.log("top: " + b.position.top, "left: " + b.position.left);
            }
        }), a.bind("click", function(a) {
            b.css({
                top: a.offsetY - b.height() / 2
            }), f.constrainHandle(), f.scrollContentHolder();
        });
    },
    initScrollbarHandle: function() {
        var a = this.ui.contentHolder, b = this.ui.scrollbar, c = this.ui.handle, d = a.height(), e = a.get(0).scrollHeight, f = b.height();
        c.height(d * f / e);
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
                html: "<button></button>",
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
        this.element.attr("hidden", "hidden"), this._populateUiElementsFromOptions(), 
        this.ui.wrapperElm.addClass(this._getExpandOnClassName()).addClass(this._getCollapseOnClassName()), 
        this.setLabelText(), this._drawSelectOptions(), this._addEventListeners(), 
        a.state = a.states.COLLAPSED;
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
        }).find(".scrollbar"), this.ui.scrollbar.css("bottom", 0);
    },
    _initAnimationTimeline: function() {
        var a = .3, b = this.timeline = new TimelineMax();
        TweenLite.to(this.ui.optionsElm, a, {
            css: {
                opacity: 1
            }
        }), b.from(this.ui.optionsElm, a, {
            css: {
                height: 0
            }
        }), b.from(this.ui.scrollbar, a, {
            css: {
                opacity: 0
            },
            delay: -.1
        }), b.reverse();
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
        this.getUiElement("buttonElm")[b](a);
    },
    setSelected: function(a) {
        a.parent().addClass(this.options.ui.optionsElm.optionSelectedClassName), 
        this.element.val(a.attr("data-value")).trigger("change"), console.log(this.element.val());
    },
    clearSelected: function() {
        this.getUiElement("optionsElm").find("> ul > li").removeClass(this.options.ui.optionsElm.optionSelectedClassName);
    }
});