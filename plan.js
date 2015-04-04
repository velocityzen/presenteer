"use strict";

var less = {
	"demo/css/style.css": "demo/less/style.less"
};

var js = {
	"demo/js/script.js": [
		"demo/js/jquery.js",
		"ui/util/detective.js",
		"ui/presenteer/presenteer.js",
		"demo/js/index.js"
	],

	"build/presenteer.js": [
		"ui/util/detective.js",
		"ui/presenteer/presenteer.js"
	]
};

module.exports = {
	options: {
		src: "./",
		dst: "./"
	},

	"default": {
		js: js,
		css: less
	},

	"belt:js": {
		tools: ["src-files", "common-js", "uglify", "dst-file"]
	},

	"belt:css": {
		tools: ["src-file", "less", "dst-file"]
	}
};
