# Presenteer
Adaptive slideshow with touch support and auto play/pause for Vimeo slides

## Dependencies
jQuery 1.10+

## Usage
Include presenteer scripts and css/less style.

Simple html example:
```html
<div class="presenteer">
    <div class="presenteer-slides">
        <div class="slide slide-image"><img src="https://farm6.staticflickr.com/5584/14439854738_17a1fa7401_h.jpg" /></div>
        <div class="slide slide-image"><img src="https://farm3.staticflickr.com/2921/14603461936_4cc392d375_h.jpg" /></div>
        <div class="slide slide-image"><img src="https://farm4.staticflickr.com/3887/14624368984_44962a9f28_h.jpg" /></div>
        <div class="slide slide-vimeo"><iframe src='//player.vimeo.com/video/97916693?api=1&color=ffffff' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>
    </div>
</div>
```

Then just:
```js
var presenteer = new Presenteer('.presenteer', options);
```

###Options
Options can be omitted.

* **ratio** — slide aspect ratio, default is 0.5;
* **active** — number of slides to be shown;
* **start** — number of slide to start from, default is 0;
* **vertical** — for vertical slides transition, default is false;
* **keyboard** — use arrow keys and spacebar for slides navigation, default is false
* **cover** — number of slide when presenteer should show the cover, default is 0;
* **on** — callback function, will be called when slide changes and get current slide jQuery object.

If you want to add cover to your slideshow just add
```html
<div class="presenteer">
    <div class="presenteer-cover">
        <div>
            <!-- put your cover content here -->
        </div>
    </div>
    <div class="presenteer-slides">
        <div class="slide slide-image"><img src="https://farm6.staticflickr.com/5584/14439854738_17a1fa7401_h.jpg" /></div>
        <div class="slide slide-image"><img src="https://farm3.staticflickr.com/2921/14603461936_4cc392d375_h.jpg" /></div>
        <div class="slide slide-image"><img src="https://farm4.staticflickr.com/3887/14624368984_44962a9f28_h.jpg" /></div>
        <div class="slide slide-vimeo"><iframe src='//player.vimeo.com/video/97916693?api=1&color=ffffff' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>
    </div>
</div>
```

Thats it!
Tested on Chrome, Safari, Firefox, IE, Mobile Safari.
License: MIT.
