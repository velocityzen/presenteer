"use strict";!function(e,t,i){var n={},r=function(t){var i=n[t]||e[t];if(!i)throw new Error("Requested module '"+t+"' has not been defined.");return i},s=function(t,i,r){r?e[t]=i:n[t]=i};!function(e,t,i){s("$",jQuery.noConflict())}(e,t),function(e,t,i){var n=function(){var i=e.getComputedStyle(t.documentElement,""),n=(Array.prototype.slice.call(i).join("").match(/-(moz|webkit|ms)-/)||""===i.OLink&&["","o"])[1],r="WebKit|Moz|MS|O".match(new RegExp("("+n+")","i"))[1];return{dom:r,lowercase:n,css:"-"+n+"-",js:n[0].toUpperCase()+n.substr(1)}}(),r=function(e,i){return i||(i=t.documentElement),i[e]?i[e]:n.js+(e[0].toUpperCase()+e.substr(1))},o=/\.([0-9a-z]+)$/i,a=r("transform"),d=r("transition"),l={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",MsTransition:"transitionend",transition:"transitionend"}[d],c=e.devicePixelRatio&&e.devicePixelRatio>1;s("util/detective",{transform:"MsTransform"===a?"msTransform":a,transition:d,transitionEnd:l,isHistory:!(!e.history||!e.history.pushState),isHDPI:c,isTouch:!!("ontouchstart"in e),hdpiImgSrc:function(e){return c?e.replace(o,"@2x.$1"):e}})}(e,t),function(e,t,i){var n=r("$"),o=r("util/detective"),a=o.transform,d=o.transition,l=o.transitionEnd+".presenteer",c=o.isTouch,u=n(e),v=function(e,t){var i=this;i.$b=n(e),i.$b.length&&(t||(t={}),i.$cover=i.$b.find(".presenteer-cover"),i.$c=i.$b.find(".presenteer-slides"),i.$slides=i.$b.find(".slide"),i.onSlide=t.onSlide,i.slideRatio=t.slideRatio||.5,i.currentSlide=t.startSlide,i.vertical=t.vertical,i.activeSlides=t.activeSlides||1,i.cover=t.cover||0,i.moving=!1,c?(i.$b.addClass("touch"),i.bindTouch()):(i.buildControls(),t.keyboard&&i.bindKeyboard()),u.on("resize.presenteer",function(){var e=getComputedStyle(i.$c[0]),t=i.$b.width()-parseInt(e.marginLeft,10)-parseInt(e.marginRight,10);i.slideWidth=t,i.slideHeight=t*i.slideRatio,i.$c.css({width:t,height:i.slideHeight})}).trigger("resize.presenteer"),i.show(i.currentSlide,!0))};v.prototype={show:function(e,t){if(!this.moving){var n=this,r=n.currentSlide;e===i&&(e=r<n.$slides.length&&r>=0?r:0),0>e||e>=n.$slides.length-n.activeSlides+1||(n.$slides.eq(r).removeClass("active").end().eq(e).addClass("active"),e===n.cover?n.$cover.addClass("active"):n.$cover.removeClass("active"),n.moveStart(e,t),c||n.activateCtrl(e),n.onSlide&&n.onSlide(n.$slides.eq(e)))}},activateCtrl:function(e){var t=this.$slides.length-this.activeSlides;this.$leftCtrl[(0===e||1>t?"remove":"add")+"Class"]("active"),this.$rightCtrl[(e===t||1>t?"remove":"add")+"Class"]("active")},moveEnd:function(e){var t=this,i=t.$slides.eq(t.currentSlide),r=t.$slides.eq(e);r.hasClass("slide-vimeo")&&t.videoAPI(n("iframe",r),"pause",!0),i.hasClass("slide-vimeo")&&t.videoAPI(n("iframe",i),"play",!0),t.moving=!1},moveStart:function(e,t){var i=this,n=i.currentSlide;i.currentSlide=e,i.moving=!0,t?setTimeout(function(){i.moveEnd(n)},0):i.$slides.eq(e).one(l,function(){i.moveEnd(n)}),i.$slides.each(function(n,r){r.style[d]=t?"none":"";var s=n-e;s=i.activeSlides>1&&s>=1?100*s+"%":-1>=s?"-101%":s>=1?"101%":"0",r.style[a]="translate3d("+(i.vertical?"0,"+s+",0":s+",0,0")+")"})},moveStop:function(){this.moving=!1,this.$slides.eq(this.currentSlide).off(l)},update:function(){var e,t=this;t.$slides=t.$b.find(".slide"),e=t.$slides.length-1,t.currentSlide>e&&(t.currentSlide=e),t.show(i,!0)},buildControls:function(){var e=this;e.$rightCtrl=n('<div class="presenteer-right"><a href="#/right"></a></div>').prependTo(e.$b),e.$leftCtrl=n('<div class="presenteer-left"><a href="#/left"></a></div>').prependTo(e.$b),e.$b.on("click",".presenteer-left, .presenteer-right",function(t){t.preventDefault();var i=e.currentSlide+(n(this).hasClass("presenteer-left")?-1:1);e.show(i)})},bindKeyboard:function(){var e=this;u.on("keydown.presenteer",function(t){if(!this.moving){var i=e.$b.offset().top,n=u.scrollTop(),r=i+e.slideHeight,s=n+u.height();(i>=n&&s>=r||n>=i&&r>=n||s>=i&&r>=s||n>=i&&r>=s)&&(37===t.keyCode&&e.show(e.currentSlide-1),(39===t.keyCode||32===t.keyCode)&&e.show(e.currentSlide+1))}})},unbindKeyboard:function(){u.off(".presenteer")},bindTouch:function(){var t,n,r,s,o=this,l=[];o.$b.addClass("presenteer-touch").on({"touchstart.presenteer":function(e){o.moveStop(),l=[];var i=e.originalEvent.touches[0];t=i.pageX,r=i.pageY},"touchmove.presenteer":function(i){var c=i.originalEvent.touches[0];n=c.pageX-t,s=c.pageY-r,(Math.abs(n)>5&&!o.vertical||Math.abs(s)>5&&o.vertical)&&(i.preventDefault(),o.$slides.each(function(t,i){var r=t-o.currentSlide;if(r>=-1&&1>=r){if(!l[t]){var c=new e.WebKitCSSMatrix(getComputedStyle(i).webkitTransform);l[t]=o.vertical?c.m42:c.m41}i.style[d]="none",i.style[a]="translate3d("+(o.vertical?"0,"+(l[t]+s)+"px,0":l[t]+n+"px,0,0")+")"}}))},"touchend.presenteer":function(){var e=o.vertical?s:n;if(Math.abs(e)>o.slideWidth/4){var a=o.currentSlide+(e>0?-1:1);a>=0&&a<o.$slides.length?o.show(a):o.show()}else o.show();t=n=i,r=s=i},"touchcancel.presenteer":function(){t=n=i,r=s=i}})},unbindTouch:function(){this.$b.off(".presenteer")},videoAPI:function(e,t,i){if(e.length){var n="http:"+e.attr("src").split("?")[0],r={method:t};i&&(r.value=i),e[0].contentWindow.postMessage(JSON.stringify(r),n)}}},s("ui/presenteer",v)}(e,t),function(e,t,i){var n=r("$"),s=r("ui/presenteer");n(t).ready(function(){new s(".presenteer")})}(e,t)}(window,document);