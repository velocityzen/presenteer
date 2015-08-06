"use strict";!function(e,t,n){var i={},r=function(t){var n=i[t]||e[t];if(!n)throw new Error("Requested module '"+t+"' has not been defined.");return n},o=function(t,n,r){r?e[t]=n:i[t]=n};!function(e,t,n){o("$",jQuery.noConflict())}(e,t),function(e,t,n){var i=function(){var n=e.getComputedStyle(t.documentElement,""),i=(Array.prototype.slice.call(n).join("").match(/-(moz|webkit|ms)-/)||""===n.OLink&&["","o"])[1];return i[0].toUpperCase()+i.substr(1)}(),r=function(e,n){return n||(n=t.documentElement),n[e]?n[e]:i+(e[0].toUpperCase()+e.substr(1))},s=r("transform"),a=r("transition"),l={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",MsTransition:"transitionend",transition:"transitionend"}[a];o("util/detective",{transform:"MsTransform"===s?"msTransform":s,transition:a,transitionEnd:l,isTouch:!!("ontouchstart"in e)})}(e,t),function(e,t,n){var i=r("$"),s=r("util/detective"),a=s.transform,l=s.transition,c=s.transitionEnd+".presenteer",u=s.isTouch,d=i(e),h=function(e,t){var r=this;r.$b=i(e),r.$b.length&&(t||(t={}),r.ratio=t.ratio||.5,r.vertical=t.vertical,r.currentSlide=t.start,r.activeSlides=t.active||1,r.cover=t.cover||0,r.autoplay=t.autoplay||0,r.cb=t.cb,r.moving=!1,r.$cover=r.$b.find(".presenteer-cover"),r.$c=r.$b.find(".presenteer-slides"),u?r.bindTouch():((t.controls===n||t.controls)&&r.buildControls(),t.keyboard&&r.bindKeyboard()),r.bindWindow().update(),r.autoplay&&(r.autoplayIncr=r.currentSlide<=r.length?-1:1,r.autoplayFunc=function(){-1===r.autoplayIncr&&0===r.currentSlide&&(r.autoplayIncr=1),1===r.autoplayIncr&&r.currentSlide===r.length-1&&(r.autoplayIncr=-1),r.show(r.currentSlide+r.autoplayIncr)}))};h.prototype={play:function(){var e=this;return!e.autoplayInterval&&e.length>1&&(e.autoplayInterval=setInterval(e.autoplayFunc,e.autoplay)),e},pause:function(){return this.autoplayInterval&&(clearInterval(this.autoplayInterval),this.autoplayInterval=n),self},show:function(e,t){if(this.moving)return this;var i=this;return e===n&&(e=i.currentSlide||0),0>e||e>=i.length?i:(i.$slides.eq(i.currentSlide).removeClass("active").end().eq(e).addClass("active"),i.$cover.toggleClass("active",e===i.cover),i.moveStart(e,t),i.controls&&i.activateCtrl(e),i.cb&&i.cb(i.$slides.eq(e)),i)},activateCtrl:function(e){var t=this.length;this.$leftCtrl.toggleClass("active",!(0===e||1>=t)),this.$rightCtrl.toggleClass("active",!(e===t-1||1>=t))},moveEnd:function(e){var t=this,n=t.$slides.eq(t.currentSlide),r=t.$slides.eq(e);r.hasClass("slide-vimeo")&&t.videoAPI(i("iframe",r),"pause",!0),n.hasClass("slide-vimeo")&&t.videoAPI(i("iframe",n),"play",!0),t.moving=!1},moveStart:function(e,t){var n=this,i=n.currentSlide;n.currentSlide=e,n.moving=!0,t?setTimeout(function(){n.moveEnd(i)},0):n.$slides.eq(e).one(c,function(){n.moveEnd(i)}),n.$slides.each(function(i,r){r.style[l]=t?"none":"";var o=i-e;o=n.activeSlides>1&&o>=1?100*o+"%":-1>=o?"-101%":o>=1?"101%":"0",r.style[a]="translate3d("+(n.vertical?"0,"+o+",0":o+",0,0")+")"})},moveStop:function(){this.moving=!1,this.$slides.eq(this.currentSlide).off(c)},update:function(){var e=this;return e.$slides=e.$b.find(".slide"),e.length=e.$slides.length-e.activeSlides+1,e.currentSlide>=e.length?e.currentSlide=e.length-1:e.currentSlide<0&&(e.currentSlide=0),e.show(n,!0),e},buildControls:function(){var e=this;return e.controls=!0,e.$rightCtrl=i('<div class="presenteer-right"><a href="#/right" class="icon-right"></a></div>').prependTo(e.$b),e.$leftCtrl=i('<div class="presenteer-left"><a href="#/left" class="icon-left"></a></div>').prependTo(e.$b),e.$b.on("click.presenteer",".presenteer-left, .presenteer-right",function(t){t.preventDefault();var n=e.currentSlide+(i(this).hasClass("presenteer-left")?-1:1);e.show(n)}),this},bindWindow:function(){var e=this;return e.onResize=function(){clearTimeout(e.onResizeTimeout),e.onResizeTimeout=setTimeout(function(){var t=getComputedStyle(e.$c[0]),n=e.$b.width()-parseInt(t.marginLeft,10)-parseInt(t.marginRight,10);e.slideWidth=n,e.slideHeight=n*e.ratio,e.$c.css({width:n,height:e.slideHeight})},250)},d.on("resize.presenteer",e.onResize).trigger("resize.presenteer"),this},unbindWindow:function(){return d.off("resize orientationchange",this.onResize),this},bindKeyboard:function(){var e=this;return e.onKeyDown=function(t){if(!e.moving){var n=e.$b.offset().top,i=d.scrollTop(),r=n+e.slideHeight,o=i+d.height();(n>=i&&o>=r||i>=n&&r>=i||o>=n&&r>=o||i>=n&&r>=o)&&(37===t.keyCode&&e.show(e.currentSlide-1),(39===t.keyCode||32===t.keyCode)&&e.show(e.currentSlide+1))}},d.on("keydown.presenteer",e.onKeyDown),this},unbindKeyboard:function(){return d.off("keydown",this.onKeyDown),this},bindTouch:function(){var t,i,r,o,s=this,c=[];return s.$b.addClass("presenteer-touch").on({"touchstart.presenteer":function(e){s.moveStop(),c=[];var n=e.originalEvent.touches[0];t=n.pageX,r=n.pageY},"touchmove.presenteer":function(n){var u=n.originalEvent.touches[0];i=u.pageX-t,o=u.pageY-r,(Math.abs(i)>5&&!s.vertical||Math.abs(o)>5&&s.vertical)&&(n.preventDefault(),s.$slides.each(function(t,n){var r=t-s.currentSlide;if(r>=-1&&1>=r){if(!c[t]){var u=new e.WebKitCSSMatrix(getComputedStyle(n).webkitTransform);c[t]=s.vertical?u.m42:u.m41}n.style[l]="none",n.style[a]="translate3d("+(s.vertical?"0,"+(c[t]+o)+"px,0":c[t]+i+"px,0,0")+")"}}))},"touchend.presenteer":function(){var e=s.vertical?o:i;if(Math.abs(e)>s.slideWidth/4){var a=s.currentSlide+(e>0?-1:1);a>=0&&a<s.length?s.show(a):s.show()}else s.show();t=i=n,r=o=n},"touchcancel.presenteer":function(){t=i=n,r=o=n}}),this},unbindTouch:function(){return this.$b.removeClass("presenteer-touch").off(".touch"),this},videoAPI:function(e,t,n){if(e.length){var i={method:t};n&&(i.value=n),e[0].contentWindow.postMessage(JSON.stringify(i),"https://player.vimeo.com")}},remove:function(){return this.unbindWindow().unbindKeyboard().unbindTouch()}},o("ui/presenteer",h)}(e,t),function(e,t,n){var i=r("$"),o=r("ui/presenteer");i(t).ready(function(){new o(".presenteer")})}(e,t)}(window,document);