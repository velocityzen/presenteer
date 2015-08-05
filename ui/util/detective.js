/*eslint-disable strict */

var prefix = (function () {
		var styles = window.getComputedStyle(document.documentElement, ""),
		pre = (Array.prototype.slice
			.call(styles)
			.join("")
			.match(/-(moz|webkit|ms)-/) || (styles.OLink === "" && ["", "o"])
			)[1];
		return pre[0].toUpperCase() + pre.substr(1);
	})(),

	prefixed = function(prop, ctx) {
		if(!ctx) {
			ctx = document.documentElement;
		}

		return ctx[prop] ? ctx[prop] : prefix + (prop[0].toUpperCase() + prop.substr(1));
	},

	transform = prefixed("transform"),
	transition = prefixed("transition"),
	transitionEnd = {
		"WebkitTransition": "webkitTransitionEnd",
		"MozTransition": "transitionend",
		"MsTransition": "transitionend",
		"transition": "transitionend"
	}[transition];

exports("util/detective", {
	transform: transform === "MsTransform" ? "msTransform" : transform,
	transition: transition,
	transitionEnd: transitionEnd,
	isTouch: !!("ontouchstart" in window)
});
