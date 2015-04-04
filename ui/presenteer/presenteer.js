/*eslint-disable strict */

var $ = require("$"),
	detective = require("util/detective");

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

	self.$cover = self.$b.find(".presenteer-cover");
	self.$c = self.$b.find(".presenteer-slides");
	self.$slides = self.$b.find(".slide");

	self.onSlide = options.onSlide;
	self.slideRatio = options.slideRatio || 0.5;
	self.currentSlide = options.startSlide;
	self.vertical = options.vertical;
	self.activeSlides = options.activeSlides || 1;
	self.cover = options.cover || 0;
	self.moving = false;

	if (isTouch) {
		self.$b.addClass("touch");
		self.bindTouch();
	} else {
		self.buildControls();
		options.keyboard && self.bindKeyboard();
	}

	$w.on("resize.presenteer", function() {
		var style = getComputedStyle(self.$c[0]),
			width = self.$b.width() - parseInt(style.marginLeft, 10) - parseInt(style.marginRight, 10);

		self.slideWidth = width;
		self.slideHeight = width * self.slideRatio;

		self.$c.css({
			width: width,
			height: self.slideHeight
		});
	}).trigger("resize.presenteer");

	self.show(self.currentSlide, true);
};

Presenteer.prototype = {
	show: function (id, isSimple) {
		if(this.moving) { return; }

		var self = this,
			cSlide = self.currentSlide;

		if (id === undefined) {
			id = (cSlide < self.$slides.length && cSlide >= 0) ? cSlide : 0;
		}

		if (id < 0 || id >= self.$slides.length - self.activeSlides + 1) {
			return;
		}

		self.$slides
			.eq(cSlide)
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

		if(!isTouch) {
			self.activateCtrl(id);
		}

		self.onSlide && self.onSlide(self.$slides.eq(id));
	},

	activateCtrl: function (id) {
		var length = this.$slides.length - this.activeSlides;

		this.$leftCtrl[ ( id === 0 || length < 1 ? "remove" : "add") + "Class"]("active");
		this.$rightCtrl[ ( id === length || length < 1 ? "remove" : "add") + "Class"]("active");
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
		var self = this, l;
		self.$slides = self.$b.find(".slide");
		l = self.$slides.length - 1;

		if(self.currentSlide > l) {
			self.currentSlide = l;
		}

		self.show(undefined, true);
	},


	buildControls: function() {
		var self = this;

		self.$rightCtrl = $('<div class="presenteer-right"><a href="#/right"></a></div>').prependTo(self.$b);
		self.$leftCtrl = $('<div class="presenteer-left"><a href="#/left"></a></div>').prependTo(self.$b);

		self.$b.on("click", ".presenteer-left, .presenteer-right", function(e) {
			e.preventDefault();
			var slide = self.currentSlide + ($(this).hasClass("presenteer-left") ? -1 : 1);
			self.show(slide);
		});
	},

	bindKeyboard: function() {
		var self = this;

		$w.on("keydown.presenteer", function(e) {
			if(!this.moving) {
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
		});
	},

	unbindKeyboard: function() {
		$w.off(".presenteer");
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
				},

				"touchcancel.presenteer": function() {
					x1 = shiftX = undefined;
					y1 = shiftY = undefined;
				}
			});
	},

	unbindTouch: function() {
		this.$b.off(".presenteer");
	},

	videoAPI: function($iframeSelector, action, value) {
		if($iframeSelector.length) {
			var url = "http:" + $iframeSelector.attr("src").split("?")[0],
				data = { method: action };

			if (value) {
				data.value = value;
			}

			$iframeSelector[0].contentWindow.postMessage(JSON.stringify(data), url);
		}
	}
};

exports("ui/presenteer", Presenteer);
