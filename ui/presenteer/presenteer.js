/*jshint
    browser:true,
    strict: false
*/

var $ = require('$'),
    detective = require('util/detective'),
    transform = detective.transform,
    transition = detective.transition,
    transitionEnd = detective.transitionEnd,
    isMobile = detective.isMobile,
    $w = $(window);

var Presenteer = function (selector, options) {
    var self = this;

    self.$b = $(selector);
    if(!self.$b.length) {
        return;
    }

    if(!options) {
        options = {};
    }

    self.$cover = self.$b.find(".presenteer-cover");
    self.$c = self.$b.find(".presenteer-slides");
    self.$slides = self.$b.find(".slide");

    self.onSlide = options.onSlide;
    self.slideRatio = options.slideRatio || 0.5;
    self.currentSlide = options.startSlide;
    self.vertical = options.vertical;
    self.cover = options.cover || 0;
    self.moving = false;

    if (isMobile) {
        self.buildMobile();
    } else {
        self.buildDesktop();
    }

    $w.on("resize", function() {
        var width =  self.$b.width();

         self.slideWidth = width;
         self.slideHeight =  width * self.slideRatio;

        self.$c.css({
            width: width,
            height: self.slideHeight
         });
    }).trigger("resize");

    self.show(self.currentSlide, true);
};

Presenteer.prototype = {
    show: function (id, isSimple) {
        if(this.moving) { return; }

        var self = this;

        if (id === undefined) {
            id = self.currentSlide || 0;
        }

        if (id < 0 || id >= self.$slides.length) {
            return;
        }

        self.$slides
            .eq(self.currentSlide)
                .removeClass("active")
                .end()
            .eq(id)
                .addClass("active");

        if(id === self.cover) {
            self.$cover.addClass("active");
        } else {
            self.$cover.removeClass("active");
        }

        self.moveStart(id, isSimple);

        if(!isMobile) {
            self.activateCtrl(id);
        }

         self.onSlide && self.onSlide(self.$slides.eq(id));
    },

    activateCtrl: function (id) {
        var self = this;

        if (id === 0) {
            self.$leftCtrl.removeClass("active");
            self.$rightCtrl.addClass("active");
        } else if (id === self.$slides.length - 1) {
            self.$rightCtrl.removeClass("active");
            self.$leftCtrl.addClass("active");
        } else {
            self.$leftCtrl.addClass("active");
            self.$rightCtrl.addClass("active");
        }
    },

    moveEnd: function(id) {
        var self = this,
            $next = self.$slides.eq(id),
            $current = self.$slides.eq(self.currentSlide);

        if ($current.hasClass("slide-vimeo")) {
            self.videoAPI($('iframe', $current), 'pause', true);
        }

        if ($next.hasClass("slide-vimeo")) {
            self.videoAPI($('iframe', $next), 'play', true);
        }

        self.currentSlide = id;
        self.moving = false;
    },

    moveStart: function(id, isSimple) {
        var self = this;
        self.moving = true;

        if(isSimple) {
            setTimeout(function () {
                self.moveEnd(id);
            }, 0);
        } else {
            self.$slides.eq(id).one(transitionEnd, function() {
                self.moveEnd(id);
            });
        }

        self.$slides.each(function(i, el) {
            el.style[transition] = isSimple ? "none" : "";

            var pos = i - id;
            pos = pos <= -1 ? "-101%" : pos >= 1 ? "101%" : "0";

            el.style[transform] = "translate3d("+ (self.vertical ? "0,"+pos+",0" : pos+",0,0") +")";
        });

    },

    update: function() {
        var self = this, l;
        self.$slides = self.$b.find(".slide");
        l = self.$slides.length -1;

        if(self.currentSlide > l) {
            self.currentSlide = l;
        }

        self.show(undefined, true);
    },


    buildControls: function() {
        var self = this;

        self.$rightCtrl = $('<div class="presenteer-right"><a href="#/right" class="icon-right"></a></div>').prependTo(self.$b);
        self.$leftCtrl = $('<div class="presenteer-left"><a href="#/left" class="icon-left"></a></div>').prependTo(self.$b);

        self.$b.on("click", ".presenteer-left, .presenteer-right", function(e) {
            e.preventDefault();
            var slide = self.currentSlide + ($(this).hasClass("presenteer-left") ? -1 : 1);
            self.show(slide);
        });
    },

    buildDesktop: function() {
        var self = this;

        self.buildControls();

        $w.on("keydown", function(e) {
            if(!this.moving) {
                var st = self.$b.offset().top,
                    wt = $w.scrollTop(),
                    sb = st + self.slideHeight,
                    wb = wt + $w.height();

                if ((st >= wt && sb <= wb) || (st <= wt && sb >= wt) || (st <= wb && sb >= wb) || (st <= wt && sb >= wb)) {
                    if (e.keyCode === 37) {
                        e.preventDefault();
                        self.show(self.currentSlide - 1);
                    }
                    if (e.keyCode === 39 || e.keyCode === 32) {
                        e.preventDefault();
                        self.show(self.currentSlide + 1);
                    }
                }
            }
        });
    },

    buildMobile: function() {
        var self = this,
            x1, shiftX, y1, shiftY,
            currentPos = [];

        self.$b.addClass('touch')
            .on({
                'touchstart.slider': function(e) {
                    e.preventDefault();
                    self.moving = false;
                    var eo = e.originalEvent.touches[0];
                    x1 = eo.pageX;
                    y1 = eo.pageY;
                },

                'touchmove.slider': function(e) {
                    var eo = e.originalEvent.touches[0];
                    shiftX = eo.pageX - x1;
                    shiftY = eo.pageY - y1;

                    self.$slides.each(function(i, el) {
                        var pos = i - self.currentSlide;
                        if(pos >= -1 && pos <= 1) {
                            if(!currentPos[i]) {
                                var matrix = new window.WebKitCSSMatrix(getComputedStyle(el).webkitTransform);
                                currentPos[i] = self.vertical ? matrix.m42 : matrix.m41;
                            }

                            el.style[transition] = "none";
                            el.style[transform] = "translate3d("+ (self.vertical ? "0,"+(currentPos[i] + shiftY ) +"px,0" : (currentPos[i] + shiftX )+"px,0,0") +")";
                        }
                    });

                    if(Math.abs(shiftX) > 5 && Math.abs(shiftY) > 5) {
                        e.preventDefault();
                    }
                },

                'touchend.slider': function(e) {
                        var shift = self.vertical ? shiftY : shiftX;

                        if (Math.abs(shift) > self.slideWidth / 4) {
                            var newSlide = self.currentSlide + (shift > 0 ? -1 : 1);
                            if(newSlide >= 0 && newSlide < self.$slides.length) {
                                self.show(newSlide);
                            } else {
                                self.show();
                            }
                        } else {
                            self.show();
                        }

                        x1 = shiftX = undefined;
                        y1 = shiftY = undefined;
                        currentPos = [];
                },

                'touchcancel.slider': function(e) {
                    x1 = shiftX = undefined;
                    y1 = shiftY = undefined;
                    currentPos = [];
                }
            });
    },

    videoAPI: function($iframeSelector, action, value) {
        if($iframeSelector.length) {
            var url = "http:"+$iframeSelector.attr('src').split('?')[0],
                data = { method: action };

                if (value) {
                    data.value = value;
                }

            $iframeSelector[0].contentWindow.postMessage(JSON.stringify(data), url);
        }
    }
};

exports('ui/presenteer', Presenteer, true);
