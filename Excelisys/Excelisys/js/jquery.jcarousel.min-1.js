/*!
 * jCarousel - Riding carousels with jQuery
 *   http://sorgalla.com/jcarousel/
 *
 * Copyright (c) 2006 Jan Sorgalla (http://sorgalla.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Built on top of the jQuery library
 *   http://jquery.com
 *
 * Inspired by the "Carousel Component" by Bill Scott
 *   http://billwscott.com/carousel/
 */
(function (a) {
    var b = {
        vertical: !1,
        rtl: !1,
        start: 1,
        offset: 1,
        size: null,
        scroll: 1,
        visible: 1,
        animation: 2000,
        easing: "swing",
        auto: 3,
        wrap: null,
        initCallback: null,
        setupCallback: null,
        reloadCallback: null,
        itemLoadCallback: null,
        itemFirstInCallback: null,
        itemFirstOutCallback: null,
        itemLastInCallback: null,
        itemLastOutCallback: null,
        itemVisibleInCallback: null,
        itemVisibleOutCallback: null,
        animationStepCallback: null,
        buttonNextHTML: "<div></div>",
        buttonPrevHTML: "<div></div>",
        buttonNextEvent: "click",
        buttonPrevEvent: "click",
        buttonNextCallback: null,
        buttonPrevCallback: null,
        itemFallbackDimension: null
    }, c = !1;
    a(window).bind("load.jcarousel", function () {
        c = !0
    }), a.jcarousel = function (e, f) {
        this.options = a.extend({}, b, f || {}), this.locked = !1, this.autoStopped = !1, this.container = null, this.clip = null, this.list = null, this.buttonNext = null, this.buttonPrev = null, this.buttonNextState = null, this.buttonPrevState = null, f && void 0 !== f.rtl || (this.options.rtl = "rtl" == (a(e).attr("dir") || a("html").attr("dir") || "").toLowerCase()), this.wh = this.options.vertical ? "height" : "width", this.lt = this.options.vertical ? "top" : this.options.rtl ? "right" : "left";
        for (var g = "", h = e.className.split(" "), i = 0; h.length > i; i++)
            if (-1 != h[i].indexOf("jcarousel-skin")) {
                a(e).removeClass(h[i]), g = h[i];
                break
            }
            "UL" == e.nodeName.toUpperCase() || "OL" == e.nodeName.toUpperCase() ? (this.list = a(e), this.clip = this.list.parents(".jcarousel-clip"), this.container = this.list.parents(".jcarousel-container")) : (this.container = a(e), this.list = this.container.find("ul,ol").eq(0), this.clip = this.container.find(".jcarousel-clip")), 0 === this.clip.size() && (this.clip = this.list.wrap("<div></div>").parent()), 0 === this.container.size() && (this.container = this.clip.wrap("<div></div>").parent()), "" !== g && -1 == this.container.parent()[0].className.indexOf("jcarousel-skin") && this.container.wrap('<div class=" ' + g + '"></div>'), this.buttonPrev = a(".jcarousel-prev", this.container), 0 === this.buttonPrev.size() && null !== this.options.buttonPrevHTML && (this.buttonPrev = a(this.options.buttonPrevHTML).appendTo(this.container)), this.buttonPrev.addClass(this.className("jcarousel-prev")), this.buttonNext = a(".jcarousel-next", this.container), 0 === this.buttonNext.size() && null !== this.options.buttonNextHTML && (this.buttonNext = a(this.options.buttonNextHTML).appendTo(this.container)), this.buttonNext.addClass(this.className("jcarousel-next")), this.clip.addClass(this.className("jcarousel-clip")).css({
            position: "relative"
        }), this.list.addClass(this.className("jcarousel-list")).css({
            overflow: "hidden",
            position: "relative",
            top: 0,
            margin: 0,
            padding: 0
        }).css(this.options.rtl ? "right" : "left", 0), this.container.addClass(this.className("jcarousel-container")).css({
            position: "relative"
        }), !this.options.vertical && this.options.rtl && this.container.addClass("jcarousel-direction-rtl").attr("dir", "rtl");
        var j = null !== this.options.visible ? Math.ceil(this.clipping() / this.options.visible) : null,
            k = this.list.children("li"),
            l = this;
        if (k.size() > 0) {
            var m = 0,
                n = this.options.offset;
            k.each(function () {
                l.format(this, n++), m += l.dimension(this, j)
            }), this.list.css(this.wh, m + 100 + "px"), f && void 0 !== f.size || (this.options.size = k.size())
        }
        this.container.css("display", "block"), this.buttonNext.css("display", "block"), this.buttonPrev.css("display", "block"), this.funcNext = function () {
            return l.next(), !1
        }, this.funcPrev = function () {
            return l.prev(), !1
        }, this.funcResize = function () {
            l.resizeTimer && clearTimeout(l.resizeTimer), l.resizeTimer = setTimeout(function () {
                l.reload()
            }, 100)
        }, null !== this.options.initCallback && this.options.initCallback(this, "init"), !c && d.isSafari() ? (this.buttons(!1, !1), a(window).bind("load.jcarousel", function () {
            l.setup()
        })) : this.setup()
    };
    var d = a.jcarousel;
    d.fn = d.prototype = {
        jcarousel: "0.2.9"
    }, d.fn.extend = d.extend = a.extend, d.fn.extend({
        setup: function () {
            if (this.first = null, this.last = null, this.prevFirst = null, this.prevLast = null, this.animating = !1, this.timer = null, this.resizeTimer = null, this.tail = null, this.inTail = !1, !this.locked) {
                this.list.css(this.lt, this.pos(this.options.offset) + "px");
                var b = this.pos(this.options.start, !0);
                this.prevFirst = this.prevLast = null, this.animate(b, !1), a(window).unbind("resize.jcarousel", this.funcResize).bind("resize.jcarousel", this.funcResize), null !== this.options.setupCallback && this.options.setupCallback(this)
            }
        },
        reset: function () {
            this.list.empty(), this.list.css(this.lt, "0px"), this.list.css(this.wh, "10px"), null !== this.options.initCallback && this.options.initCallback(this, "reset"), this.setup()
        },
        reload: function () {
            if (null !== this.tail && this.inTail && this.list.css(this.lt, d.intval(this.list.css(this.lt)) + this.tail), this.tail = null, this.inTail = !1, null !== this.options.reloadCallback && this.options.reloadCallback(this), null !== this.options.visible) {
                var a = this,
                    b = Math.ceil(this.clipping() / this.options.visible),
                    c = 0,
                    e = 0;
                this.list.children("li").each(function (d) {
                    c += a.dimension(this, b), a.first > d + 1 && (e = c)
                }), this.list.css(this.wh, c + "px"), this.list.css(this.lt, -e + "px")
            }
            this.scroll(this.first, !1)
        },
        lock: function () {
            this.locked = !0, this.buttons()
        },
        unlock: function () {
            this.locked = !1, this.buttons()
        },
        size: function (a) {
            return void 0 !== a && (this.options.size = a, this.locked || this.buttons()), this.options.size
        },
        has: function (a, b) {
            void 0 !== b && b || (b = a), null !== this.options.size && b > this.options.size && (b = this.options.size);
            for (var c = a; b >= c; c++) {
                var d = this.get(c);
                if (!d.length || d.hasClass("jcarousel-item-placeholder")) return !1
            }
            return !0
        },
        get: function (b) {
            return a(">.jcarousel-item-" + b, this.list)
        },
        add: function (b, c) {
            var e = this.get(b),
                f = 0,
                g = a(c);
            if (0 === e.length) {
                var h, i = d.intval(b);
                for (e = this.create(b);;)
                    if (h = this.get(--i), 0 >= i || h.length) {
                        0 >= i ? this.list.prepend(e) : h.after(e);
                        break
                    }
            } else f = this.dimension(e);
            "LI" == g.get(0).nodeName.toUpperCase() ? (e.replaceWith(g), e = g) : e.empty().append(c), this.format(e.removeClass(this.className("jcarousel-item-placeholder")), b);
            var j = null !== this.options.visible ? Math.ceil(this.clipping() / this.options.visible) : null,
                k = this.dimension(e, j) - f;
            return b > 0 && this.first > b && this.list.css(this.lt, d.intval(this.list.css(this.lt)) - k + "px"), this.list.css(this.wh, d.intval(this.list.css(this.wh)) + k + "px"), e
        },
        remove: function (a) {
            var b = this.get(a);
            if (b.length && !(a >= this.first && this.last >= a)) {
                var c = this.dimension(b);
                this.first > a && this.list.css(this.lt, d.intval(this.list.css(this.lt)) + c + "px"), b.remove(), this.list.css(this.wh, d.intval(this.list.css(this.wh)) - c + "px")
            }
        },
        next: function () {
            null === this.tail || this.inTail ? this.scroll("both" != this.options.wrap && "last" != this.options.wrap || null === this.options.size || this.last != this.options.size ? this.first + this.options.scroll : 1) : this.scrollTail(!1)
        },
        prev: function () {
            null !== this.tail && this.inTail ? this.scrollTail(!0) : this.scroll("both" != this.options.wrap && "first" != this.options.wrap || null === this.options.size || 1 != this.first ? this.first - this.options.scroll : this.options.size)
        },
        scrollTail: function (a) {
            if (!this.locked && !this.animating && this.tail) {
                this.pauseAuto();
                var b = d.intval(this.list.css(this.lt));
                b = a ? b + this.tail : b - this.tail, this.inTail = !a, this.prevFirst = this.first, this.prevLast = this.last, this.animate(b)
            }
        },
        scroll: function (a, b) {
            this.locked || this.animating || (this.pauseAuto(), this.animate(this.pos(a), b))
        },
        pos: function (a, b) {
            var c = d.intval(this.list.css(this.lt));
            if (this.locked || this.animating) return c;
            "circular" != this.options.wrap && (a = 1 > a ? 1 : this.options.size && a > this.options.size ? this.options.size : a);
            for (var m, e = this.first > a, f = "circular" != this.options.wrap && 1 >= this.first ? 1 : this.first, g = e ? this.get(f) : this.get(this.last), h = e ? f : f - 1, i = null, j = 0, k = !1, l = 0; e ? --h >= a : a > ++h;) i = this.get(h), k = !i.length, 0 === i.length && (i = this.create(h).addClass(this.className("jcarousel-item-placeholder")), g[e ? "before" : "after"](i), null !== this.first && "circular" == this.options.wrap && null !== this.options.size && (0 >= h || h > this.options.size) && (m = this.get(this.index(h)), m.length && (i = this.add(h, m.clone(!0))))), g = i, l = this.dimension(i), k && (j += l), null !== this.first && ("circular" == this.options.wrap || h >= 1 && (null === this.options.size || this.options.size >= h)) && (c = e ? c + l : c - l);
            var n = this.clipping(),
                o = [],
                p = 0,
                q = 0;
            for (g = this.get(a - 1), h = a; ++p;) {
                if (i = this.get(h), k = !i.length, 0 === i.length && (i = this.create(h).addClass(this.className("jcarousel-item-placeholder")), 0 === g.length ? this.list.prepend(i) : g[e ? "before" : "after"](i), null !== this.first && "circular" == this.options.wrap && null !== this.options.size && (0 >= h || h > this.options.size) && (m = this.get(this.index(h)), m.length && (i = this.add(h, m.clone(!0))))), g = i, l = this.dimension(i), 0 === l) throw Error("jCarousel: No width/height set for items. This will cause an infinite loop. Aborting...");
                if ("circular" != this.options.wrap && null !== this.options.size && h > this.options.size ? o.push(i) : k && (j += l), q += l, q >= n) break;
                h++
            }
            for (var r = 0; o.length > r; r++) o[r].remove();
            j > 0 && (this.list.css(this.wh, this.dimension(this.list) + j + "px"), e && (c -= j, this.list.css(this.lt, d.intval(this.list.css(this.lt)) - j + "px")));
            var s = a + p - 1;
            if ("circular" != this.options.wrap && this.options.size && s > this.options.size && (s = this.options.size), h > s)
                for (p = 0, h = s, q = 0; ++p && (i = this.get(h--), i.length) && (q += this.dimension(i), !(q >= n)););
            var t = s - p + 1;
            if ("circular" != this.options.wrap && 1 > t && (t = 1), this.inTail && e && (c += this.tail, this.inTail = !1), this.tail = null, "circular" != this.options.wrap && s == this.options.size && s - p + 1 >= 1) {
                var u = d.intval(this.get(s).css(this.options.vertical ? "marginBottom" : "marginRight"));
                q - u > n && (this.tail = q - n - u)
            }
            for (b && a === this.options.size && this.tail && (c -= this.tail, this.inTail = !0); a-- > t;) c += this.dimension(this.get(a));
            return this.prevFirst = this.first, this.prevLast = this.last, this.first = t, this.last = s, c
        },
        animate: function (b, c) {
            if (!this.locked && !this.animating) {
                this.animating = !0;
                var d = this,
                    e = function () {
                        if (d.animating = !1, 0 === b && d.list.css(d.lt, 0), !d.autoStopped && ("circular" == d.options.wrap || "both" == d.options.wrap || "last" == d.options.wrap || null === d.options.size || d.last < d.options.size || d.last == d.options.size && null !== d.tail && !d.inTail) && d.startAuto(), d.buttons(), d.notify("onAfterAnimation"), "circular" == d.options.wrap && null !== d.options.size)
                            for (var a = d.prevFirst; d.prevLast >= a; a++) null === a || a >= d.first && d.last >= a || !(1 > a || a > d.options.size) || d.remove(a)
                    };
                if (this.notify("onBeforeAnimation"), this.options.animation && c !== !1) {
                    var f = this.options.vertical ? {
                        top: b
                    } : this.options.rtl ? {
                        right: b
                    } : {
                        left: b
                    }, g = {
                            duration: this.options.animation,
                            easing: this.options.easing,
                            complete: e
                        };
                    a.isFunction(this.options.animationStepCallback) && (g.step = this.options.animationStepCallback), this.list.animate(f, g)
                } else this.list.css(this.lt, b + "px"), e()
            }
        },
        startAuto: function (a) {
            if (void 0 !== a && (this.options.auto = a), 0 === this.options.auto) return this.stopAuto();
            if (null === this.timer) {
                this.autoStopped = !1;
                var b = this;
                this.timer = window.setTimeout(function () {
                    b.next()
                }, 1e3 * this.options.auto)
            }
        },
        stopAuto: function () {
            this.pauseAuto(), this.autoStopped = !0
        },
        pauseAuto: function () {
            null !== this.timer && (window.clearTimeout(this.timer), this.timer = null)
        },
        buttons: function (a, b) {
            null == a && (a = !this.locked && 0 !== this.options.size && (this.options.wrap && "first" != this.options.wrap || null === this.options.size || this.last < this.options.size), this.locked || this.options.wrap && "first" != this.options.wrap || null === this.options.size || !(this.last >= this.options.size) || (a = null !== this.tail && !this.inTail)), null == b && (b = !this.locked && 0 !== this.options.size && (this.options.wrap && "last" != this.options.wrap || this.first > 1), this.locked || this.options.wrap && "last" != this.options.wrap || null === this.options.size || 1 != this.first || (b = null !== this.tail && this.inTail));
            var c = this;
            this.buttonNext.size() > 0 ? (this.buttonNext.unbind(this.options.buttonNextEvent + ".jcarousel", this.funcNext), a && this.buttonNext.bind(this.options.buttonNextEvent + ".jcarousel", this.funcNext), this.buttonNext[a ? "removeClass" : "addClass"](this.className("jcarousel-next-disabled")).attr("disabled", a ? !1 : !0), null !== this.options.buttonNextCallback && this.buttonNext.data("jcarouselstate") != a && this.buttonNext.each(function () {
                c.options.buttonNextCallback(c, this, a)
            }).data("jcarouselstate", a)) : null !== this.options.buttonNextCallback && this.buttonNextState != a && this.options.buttonNextCallback(c, null, a), this.buttonPrev.size() > 0 ? (this.buttonPrev.unbind(this.options.buttonPrevEvent + ".jcarousel", this.funcPrev), b && this.buttonPrev.bind(this.options.buttonPrevEvent + ".jcarousel", this.funcPrev), this.buttonPrev[b ? "removeClass" : "addClass"](this.className("jcarousel-prev-disabled")).attr("disabled", b ? !1 : !0), null !== this.options.buttonPrevCallback && this.buttonPrev.data("jcarouselstate") != b && this.buttonPrev.each(function () {
                c.options.buttonPrevCallback(c, this, b)
            }).data("jcarouselstate", b)) : null !== this.options.buttonPrevCallback && this.buttonPrevState != b && this.options.buttonPrevCallback(c, null, b), this.buttonNextState = a, this.buttonPrevState = b
        },
        notify: function (a) {
            var b = null === this.prevFirst ? "init" : this.prevFirst < this.first ? "next" : "prev";
            this.callback("itemLoadCallback", a, b), this.prevFirst !== this.first && (this.callback("itemFirstInCallback", a, b, this.first), this.callback("itemFirstOutCallback", a, b, this.prevFirst)), this.prevLast !== this.last && (this.callback("itemLastInCallback", a, b, this.last), this.callback("itemLastOutCallback", a, b, this.prevLast)), this.callback("itemVisibleInCallback", a, b, this.first, this.last, this.prevFirst, this.prevLast), this.callback("itemVisibleOutCallback", a, b, this.prevFirst, this.prevLast, this.first, this.last)
        },
        callback: function (b, c, d, e, f, g, h) {
            if (null != this.options[b] && ("object" == typeof this.options[b] || "onAfterAnimation" == c)) {
                var i = "object" == typeof this.options[b] ? this.options[b][c] : this.options[b];
                if (a.isFunction(i)) {
                    var j = this;
                    if (void 0 === e) i(j, d, c);
                    else if (void 0 === f) this.get(e).each(function () {
                        i(j, this, e, d, c)
                    });
                    else
                        for (var k = function (a) {
                            j.get(a).each(function () {
                                i(j, this, a, d, c)
                            })
                        }, l = e; f >= l; l++) null === l || l >= g && h >= l || k(l)
                }
            }
        },
        create: function (a) {
            return this.format("<li></li>", a)
        },
        format: function (b, c) {
            b = a(b);
            for (var d = b.get(0).className.split(" "), e = 0; d.length > e; e++) - 1 != d[e].indexOf("jcarousel-") && b.removeClass(d[e]);
            return b.addClass(this.className("jcarousel-item")).addClass(this.className("jcarousel-item-" + c)).css({
                "float": this.options.rtl ? "right" : "left",
                "list-style": "none"
            }).attr("jcarouselindex", c), b
        },
        className: function (a) {
            return a + " " + a + (this.options.vertical ? "-vertical" : "-horizontal")
        },
        dimension: function (b, c) {
            var e = a(b);
            if (null == c) return this.options.vertical ? e.innerHeight() + d.intval(e.css("margin-top")) + d.intval(e.css("margin-bottom")) + d.intval(e.css("border-top-width")) + d.intval(e.css("border-bottom-width")) || d.intval(this.options.itemFallbackDimension) : e.innerWidth() + d.intval(e.css("margin-left")) + d.intval(e.css("margin-right")) + d.intval(e.css("border-left-width")) + d.intval(e.css("border-right-width")) || d.intval(this.options.itemFallbackDimension);
            var f = this.options.vertical ? c - d.intval(e.css("marginTop")) - d.intval(e.css("marginBottom")) : c - d.intval(e.css("marginLeft")) - d.intval(e.css("marginRight"));
            return a(e).css(this.wh, f + "px"), this.dimension(e)
        },
        clipping: function () {
            return this.options.vertical ? this.clip[0].offsetHeight - d.intval(this.clip.css("borderTopWidth")) - d.intval(this.clip.css("borderBottomWidth")) : this.clip[0].offsetWidth - d.intval(this.clip.css("borderLeftWidth")) - d.intval(this.clip.css("borderRightWidth"))
        },
        index: function (a, b) {
            return null == b && (b = this.options.size), Math.round(((a - 1) / b - Math.floor((a - 1) / b)) * b) + 1
        }
    }), d.extend({
        defaults: function (c) {
            return a.extend(b, c || {})
        },
        intval: function (a) {
            return a = parseInt(a, 10), isNaN(a) ? 0 : a
        },
        windowLoaded: function () {
            c = !0
        },
        isSafari: function () {
            var a = navigator.userAgent.toLowerCase(),
                b = /(chrome)[ \/]([\w.]+)/.exec(a) || /(webkit)[ \/]([\w.]+)/.exec(a) || [],
                c = b[1] || "";
            return "webkit" === c
        }
    }), a.fn.jcarousel = function (b) {
        if ("string" == typeof b) {
            var c = a(this).data("jcarousel"),
                e = Array.prototype.slice.call(arguments, 1);
            return c[b].apply(c, e)
        }
        return this.each(function () {
            var c = a(this).data("jcarousel");
            c ? (b && a.extend(c.options, b), c.reload()) : a(this).data("jcarousel", new d(this, b))
        })
    }
})(jQuery);