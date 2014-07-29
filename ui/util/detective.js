/*jshint
	strict: false,
	browser:true
*/
/* global Modernizr*/

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

	transition = prefixed("transition"),
	transitionEnd = {
		'WebkitTransition' : 'webkitTransitionEnd',
		'MozTransition'    : 'transitionend',
		'MsTransition'     : 'MSTransitionEnd',
		'transition'       : 'transitionend'
	}[transition],

	isHDPI = window.devicePixelRatio && window.devicePixelRatio > 1;

exports('util/detective', {
	requestAnimationFrame: prefixed('requestAnimationFrame', window),
	transform: prefixed('transform'),
	transition: transition,
	transitionEnd: transitionEnd,
	isHistory: !!(window.history && window.history.pushState),
	isHDPI: isHDPI,
	isTouch: !!('ontouchstart' in window),
	isMobile: (function() {
		var platformIdentifier = {
			Android: function() { return navigator.userAgent.match(/Android/i); },
			BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },
			iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
			Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },
			Windows: function() { return navigator.userAgent.match(/IEMobile/i); }
		};
		return (platformIdentifier.Android() || platformIdentifier.BlackBerry() || platformIdentifier.iOS() || platformIdentifier.Opera() || platformIdentifier.Windows());
	})(),

	HDPIImgSrc: function(src) {
		return isHDPI ? src.replace(rxExtension, "@2x.$1") : src;
	}
});
