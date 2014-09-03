!function(e,t){"use strict";var i={},n=function(t){var n=i[t]||e[t];if(!n)throw new Error("Requested module '"+t+"' has not been defined.");return n},r=function(t,n,r){r?e[t]=n:i[t]=n};!function(e,t){var i=function(){var i=e.getComputedStyle(t.documentElement,""),n=(Array.prototype.slice.call(i).join("").match(/-(moz|webkit|ms)-/)||""===i.OLink&&["","o"])[1],r="WebKit|Moz|MS|O".match(new RegExp("("+n+")","i"))[1];return{dom:r,lowercase:n,css:"-"+n+"-",js:n[0].toUpperCase()+n.substr(1)}}(),n=function(e,n){return n||(n=t.documentElement),n[e]?n[e]:i.js+(e[0].toUpperCase()+e.substr(1))},s=/\.([0-9a-z]+)$/i,o=n("transition"),a={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",MsTransition:"MSTransitionEnd",transition:"transitionend"}[o],l=e.devicePixelRatio&&e.devicePixelRatio>1;r("util/detective",{requestAnimationFrame:n("requestAnimationFrame",e),transform:n("transform"),transition:o,transitionEnd:a,isHistory:!(!e.history||!e.history.pushState),isHDPI:l,isTouch:!!("ontouchstart"in e),isMobile:function(){var e={Android:function(){return navigator.userAgent.match(/Android/i)},BlackBerry:function(){return navigator.userAgent.match(/BlackBerry/i)},iOS:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)},Opera:function(){return navigator.userAgent.match(/Opera Mini/i)},Windows:function(){return navigator.userAgent.match(/IEMobile/i)}};return e.Android()||e.BlackBerry()||e.iOS()||e.Opera()||e.Windows()}(),HDPIImgSrc:function(e){return l?e.replace(s,"@2x.$1"):e}})}(e,t),function(e,t,i){var s=n("$"),o=n("util/detective"),a=o.transform,l=o.transition,d=o.transitionEnd,c=o.isMobile,u=s(e),v=function(e,t){var i=this;i.$b=s(e),i.$b.length&&(t||(t={}),i.$cover=i.$b.find(".presenteer-cover"),i.$c=i.$b.find(".presenteer-slides"),i.$slides=i.$b.find(".slide"),i.onSlide=t.onSlide,i.slideRatio=t.slideRatio||.5,i.currentSlide=t.startSlide,i.vertical=t.vertical,i.cover=t.cover||0,i.moving=!1,c?i.buildMobile():i.buildDesktop(),u.on("resize.presenteer",function(){var e=i.$b.width();i.slideWidth=e,i.slideHeight=e*i.slideRatio,i.$c.css({width:e,height:i.slideHeight})}).trigger("resize.presenteer"),i.show(i.currentSlide,!0))};v.prototype={show:function(e,t){if(!this.moving){var n=this;e===i&&(e=n.currentSlide||0),0>e||e>=n.$slides.length||(n.$slides.eq(n.currentSlide).removeClass("active").end().eq(e).addClass("active"),e===n.cover?n.$cover.addClass("active"):n.$cover.removeClass("active"),n.moveStart(e,t),c||n.activateCtrl(e),n.onSlide&&n.onSlide(n.$slides.eq(e)))}},activateCtrl:function(e){var t=this;0===e?(t.$leftCtrl.removeClass("active"),t.$rightCtrl.addClass("active")):e===t.$slides.length-1?(t.$rightCtrl.removeClass("active"),t.$leftCtrl.addClass("active")):(t.$leftCtrl.addClass("active"),t.$rightCtrl.addClass("active"))},moveEnd:function(e){var t=this,i=t.$slides.eq(e),n=t.$slides.eq(t.currentSlide);n.hasClass("slide-vimeo")&&t.videoAPI(s("iframe",n),"pause",!0),i.hasClass("slide-vimeo")&&t.videoAPI(s("iframe",i),"play",!0),t.currentSlide=e,t.moving=!1},moveStart:function(e,t){var i=this;i.moving=!0,t?setTimeout(function(){i.moveEnd(e)},0):i.$slides.eq(e).one(d,function(){i.moveEnd(e)}),i.$slides.each(function(n,r){r.style[l]=t?"none":"";var s=n-e;s=-1>=s?"-101%":s>=1?"101%":"0",r.style[a]="translate3d("+(i.vertical?"0,"+s+",0":s+",0,0")+")"})},update:function(){var e,t=this;t.$slides=t.$b.find(".slide"),e=t.$slides.length-1,t.currentSlide>e&&(t.currentSlide=e),t.show(i,!0)},buildControls:function(){var e=this;e.$rightCtrl=s('<div class="presenteer-right"><a href="#/right" class="icon-right"></a></div>').prependTo(e.$b),e.$leftCtrl=s('<div class="presenteer-left"><a href="#/left" class="icon-left"></a></div>').prependTo(e.$b),e.$b.on("click",".presenteer-left, .presenteer-right",function(t){t.preventDefault();var i=e.currentSlide+(s(this).hasClass("presenteer-left")?-1:1);e.show(i)})},buildDesktop:function(){var e=this;e.buildControls(),u.on("keydown.presenteer",function(t){if(!this.moving){var i=e.$b.offset().top,n=u.scrollTop(),r=i+e.slideHeight,s=n+u.height();(i>=n&&s>=r||n>=i&&r>=n||s>=i&&r>=s||n>=i&&r>=s)&&(37===t.keyCode&&(t.preventDefault(),e.show(e.currentSlide-1)),(39===t.keyCode||32===t.keyCode)&&(t.preventDefault(),e.show(e.currentSlide+1)))}})},buildMobile:function(){var t,n,r,s,o=this,d=[];o.$b.addClass("touch").on({"touchstart.slider":function(e){o.moving=!1;var i=e.originalEvent.touches[0];t=i.pageX,r=i.pageY},"touchmove.slider":function(i){var c=i.originalEvent.touches[0];n=c.pageX-t,s=c.pageY-r,(Math.abs(n)>5&&!o.vertical||Math.abs(s)>5&&o.vertical)&&(i.preventDefault(),o.$slides.each(function(t,i){var r=t-o.currentSlide;if(r>=-1&&1>=r){if(!d[t]){var c=new e.WebKitCSSMatrix(getComputedStyle(i).webkitTransform);d[t]=o.vertical?c.m42:c.m41}i.style[l]="none",i.style[a]="translate3d("+(o.vertical?"0,"+(d[t]+s)+"px,0":d[t]+n+"px,0,0")+")"}}))},"touchend.slider":function(){var e=o.vertical?s:n;if(Math.abs(e)>o.slideWidth/4){var a=o.currentSlide+(e>0?-1:1);a>=0&&a<o.$slides.length?o.show(a):o.show()}else o.show();t=n=i,r=s=i,d=[]},"touchcancel.slider":function(){t=n=i,r=s=i,d=[]}})},videoAPI:function(e,t,i){if(e.length){var n="http:"+e.attr("src").split("?")[0],r={method:t};i&&(r.value=i),e[0].contentWindow.postMessage(JSON.stringify(r),n)}}},r("ui/presenteer",v,!0)}(e,t)}(window,document);