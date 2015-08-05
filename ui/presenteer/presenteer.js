/*eslint-disable strict */
var $ = require("$");
var detective = require("util/detective");

var transform = detective.transform,
	transition = detective.transition,
	transitionEnd = detective.transitionEnd + ".presenteer",
	isTouch = detective.isTouch,
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

	self.ratio = options.ratio || 0.5;
	self.activeSlides = options.active || 1;
	self.currentSlide = options.start;
	self.vertical = options.vertical;
	self.cover = options.cover || 0;
	self.autoplay = options.autoplay || 0;
	self.cb = options.cb;
	self.moving = false;

	self.$cover = self.$b.find(".presenteer-cover");
	self.$c = self.$b.find(".presenteer-slides");

	if (isTouch) {
		self.bindTouch();
	} else {
		if(options.controls === undefined || options.controls) {
			self.buildControls();
		}
		options.keyboard && self.bindKeyboard();
	}

	self
		.bindWindow()
		.update();

	if(self.autoplay) {
		self.autoplayIncr = self.currentSlide <= self.length ? -1 : 1;
		self.autoplayFunc = function () {
			if(self.autoplayIncr === -1 && self.currentSlide === 0) {
				self.autoplayIncr = 1;
			}

			if(self.autoplayIncr === 1 && self.currentSlide === self.length - 1) {
				self.autoplayIncr = -1;
			}

			self.show(self.currentSlide + self.autoplayIncr);
		};

		self.play();
	}
};

Presenteer.prototype = {
	play: function() {
		var self = this;
		if(!self.autoplayInterval && self.length > 1) {
			self.autoplayInterval = setInterval(self.autoplayFunc, self.autoplay);
		}
	},

	pause: function() {
		if(this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
			this.autoplayInterval = undefined;
		}
	},

	show: function (id, isSimple) {
		if(this.moving) { return; }

		var self = this;

		if (id === undefined) {
			id = self.currentSlide || 0;
		}

		if (id < 0 || id >= self.length) {
			return;
		}

		self.$slides
			.eq(self.currentSlide)
				.removeClass("active")
				.end()
			.eq(id)
				.addClass("active");

		self.$cover.toggleClass("active", id === self.cover);
		self.moveStart(id, isSimple);
		self.controls && self.activateCtrl(id);
		self.cb && self.cb(self.$slides.eq(id));
	},

	activateCtrl: function (id) {
		var length = this.length;

		this.$leftCtrl.toggleClass("active", !( id === 0 || length <= 1 ) );
		this.$rightCtrl.toggleClass("active", !( id === length - 1 || length <= 1 ) );
	},

	moveEnd: function(prevId) {
		var self = this,
			$next = self.$slides.eq(self.currentSlide),
			$current = self.$slides.eq(prevId);

		if ($current.hasClass("slide-vimeo")) {
			self.videoAPI($("iframe", $current), "pause", true);
		}

		if ($next.hasClass("slide-vimeo")) {
			self.videoAPI($("iframe", $next), "play", true);
		}

		self.moving = false;
	},

	moveStart: function(id, isSimple) {
		var self = this,
			prevId = self.currentSlide;

		self.currentSlide = id;
		self.moving = true;

		if(isSimple) {
			setTimeout(function () {
				self.moveEnd(prevId);
			}, 0);
		} else {
			self.$slides.eq(id).one(transitionEnd, function() {
				self.moveEnd(prevId);
			});
		}

		self.$slides.each(function(i, el) {
			el.style[transition] = isSimple ? "none" : "";

			var pos = i - id;

			if(self.activeSlides > 1 && (pos >= 1)) {
				pos = pos * 100 + "%";
			} else {
				pos = pos <= -1 ? "-101%" : pos >= 1 ? "101%" : "0";
			}

			el.style[transform] = "translate3d(" + (self.vertical ? "0," + pos + ",0" : pos + ",0,0") + ")";
		});
	},

	moveStop: function() {
		this.moving = false;
		this.$slides.eq(this.currentSlide).off(transitionEnd);
	},

	update: function() {
		var self = this;
		self.$slides = self.$b.find(".slide");
		self.length = self.$slides.length - self.activeSlides + 1;
		if(self.currentSlide >= self.length) {
			self.currentSlide = self.length - 1;
		} else if(self.currentSlide < 0) {
			self.currentSlide = 0;
		}

		self.show(undefined, true);
	},

	buildControls: function() {
		var self = this;

		self.controls = true;
		self.$rightCtrl = $('<div class="presenteer-right"><a href="#/right" class="icon-right"></a></div>').prependTo(self.$b);
		self.$leftCtrl = $('<div class="presenteer-left"><a href="#/left" class="icon-left"></a></div>').prependTo(self.$b);

		self.$b.on("click.presenteer", ".presenteer-left, .presenteer-right", function(e) {
			e.preventDefault();
			var slide = self.currentSlide + ($(this).hasClass("presenteer-left") ? -1 : 1);
			self.show(slide);
		});

		return this;
	},

	bindWindow: function() {
		var self = this;
		self.onResize = function() {
			clearTimeout(self.onResizeTimeout);
			self.onResizeTimeout = setTimeout(function () {
				var style = getComputedStyle(self.$c[0]),
					width = self.$b.width() - parseInt(style.marginLeft, 10) - parseInt(style.marginRight, 10);

				self.slideWidth = width;
				self.slideHeight = width * self.ratio;

				self.$c.css({
					width: width,
					height: self.slideHeight
				});
			}, 250);
		};

		$w.on("resize.presenteer", self.onResize).trigger("resize.presenteer");
		return this;
	},

	unbindWindow: function() {
		$w.off("resize orientationchange", this.onResize);
		return this;
	},

	bindKeyboard: function() {
		var self = this;

		self.onKeyDown = function(e) {
			if(!self.moving) {
				var top = self.$b.offset().top,
					wt = $w.scrollTop(),
					bottom = top + self.slideHeight,
					wb = wt + $w.height();

				if ((top >= wt && bottom <= wb) || (top <= wt && bottom >= wt) || (top <= wb && bottom >= wb) || (top <= wt && bottom >= wb)) {
					if (e.keyCode === 37) {
						// e.preventDefault();
						self.show(self.currentSlide - 1);
					}
					if (e.keyCode === 39 || e.keyCode === 32) {
						// e.preventDefault();
						self.show(self.currentSlide + 1);
					}
				}
			}
		};

		$w.on("keydown.presenteer", self.onKeyDown);
		return this;
	},

	unbindKeyboard: function() {
		$w.off("keydown", this.onKeyDown);
		return this;
	},

	bindTouch: function() {
		var self = this,
			x1, shiftX, y1, shiftY,
			currentPos = [];

		self.$b.addClass("presenteer-touch")
			.on({
				"touchstart.presenteer": function(e) {
					// e.preventDefault();
					self.moveStop();
					currentPos = [];
					var eo = e.originalEvent.touches[0];
					x1 = eo.pageX;
					y1 = eo.pageY;
				},

				"touchmove.presenteer": function(e) {
					var eo = e.originalEvent.touches[0];
					shiftX = eo.pageX - x1;
					shiftY = eo.pageY - y1;

					if((Math.abs(shiftX) > 5 && !self.vertical) || (Math.abs(shiftY) > 5 && self.vertical) ) {
						e.preventDefault();
						self.$slides.each(function(i, el) {
							var pos = i - self.currentSlide;
							if(pos >= -1 && pos <= 1) {
								if(!currentPos[i]) {
									var matrix = new window.WebKitCSSMatrix(getComputedStyle(el).webkitTransform);
									currentPos[i] = self.vertical ? matrix.m42 : matrix.m41;
								}

								el.style[transition] = "none";
								el.style[transform] = "translate3d(" + (self.vertical ? "0," + (currentPos[i] + shiftY ) + "px,0" : (currentPos[i] + shiftX ) + "px,0,0") + ")";
							}
						});
					}
				},

				"touchend.presenteer": function() {
					var shift = self.vertical ? shiftY : shiftX;

					if (Math.abs(shift) > self.slideWidth / 4) {
						var newSlide = self.currentSlide + (shift > 0 ? -1 : 1);
						if(newSlide >= 0 && newSlide < self.length) {
							self.show(newSlide);
						} else {
							self.show();
						}
					} else {
						self.show();
					}

					x1 = shiftX = undefined;
					y1 = shiftY = undefined;
				},

				"touchcancel.presenteer": function() {
					x1 = shiftX = undefined;
					y1 = shiftY = undefined;
				}
			});
		return this;
	},

	unbindTouch: function() {
		this.$b
			.removeClass("presenteer-touch")
			.off(".touch");
		return this;
	},

	videoAPI: function($iframe, action, value) {
		if($iframe.length) {
			var data = { method: action };

			if (value) {
				data.value = value;
			}

			$iframe[0].contentWindow.postMessage(JSON.stringify(data), "https://player.vimeo.com");
		}
	},

	remove: function() {
		this
			.unbindWindow()
			.unbindKeyboard()
			.unbindTouch();
	}
};

exports("ui/presenteer", Presenteer);
