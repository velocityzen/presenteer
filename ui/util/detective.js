/*jshint
	strict: false,
	browser:true
*/

var prefix = (function () {
		var styles = window.getComputedStyle(document.documentElement, ''),
		pre = (Array.prototype.slice
			.call(styles)
			.join('')
			.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
			)[1],
		dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
		return {
			dom: dom,
			lowercase: pre,
			css: '-' + pre + '-',
			js: pre[0].toUpperCase() + pre.substr(1)
		};
	})(),

	prefixed = function(prop, ctx) {
		if(!ctx) {
			ctx = document.documentElement;
		}

		return ctx[prop] ? ctx[prop] : prefix.js + (prop[0].toUpperCase() + prop.substr(1));
	},

	rxExtension = /\.([0-9a-z]+)$/i,

	transform = prefixed('transform'),
	transition = prefixed("transition"),
	transitionEnd = {
		'WebkitTransition' : 'webkitTransitionEnd',
		'MozTransition'    : 'transitionend',
		'MsTransition'     : 'transitionend',
		'transition'       : 'transitionend'
	}[transition],

	isHDPI = window.devicePixelRatio && window.devicePixelRatio > 1;

exports('util/detective', {
	transform: transform === "MsTransform" ? "msTransform" : transform,
	transition: transition,
	transitionEnd: transitionEnd,

	isHistory: !!(window.history && window.history.pushState),
	isHDPI: isHDPI,
	isTouch: !!('ontouchstart' in window),
	hdpiImgSrc: function(src) {
		return isHDPI ? src.replace(rxExtension, "@2x.$1") : src;
	}
});
