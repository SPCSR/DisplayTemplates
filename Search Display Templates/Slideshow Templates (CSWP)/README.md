Slideshow Display Templates (CSWP)
================

This folder contains the display templates to create a slideshow for pages with a roll-up images. 
The slideshow has a width of 860px and a height of 310px. This can be changed in the **slider.css** file.

In the **Item_Slideshow.html** file, an image rendition of 800px width and 310px height is used. You will need to configure this image rendition in order to render a correct slideshow.

File | Desciption
--- | ---
__Control_Slideshow.html__ | This is the control template for the slideshow.
__Item_Slideshow.html__ | This is the item template for the slideshow.
__jquery.cycle2.min.js__ | This a jQuery plugin that is used for the slideshow: http://jquery.malsup.com/cycle2/.
__slider.css__ | This is the CSS that is needed for the slideshow.


**Usage**
These files need to be uploaded to the following location: **http://your-site/_catalogs/masterpage/slideshow/**.

**Configuration**

The only thing that needs to be configured in the CSWP is the query itself and selecting the following display templates.

![Content Search Web Part Configuration](https://raw.githubusercontent.com/SPCSR/DisplayTemplates/master/Search%20Display%20Templates/Slideshow%20Templates%20(CSWP)/images/slideshow1.PNG)

_The following managed properties are used: 'Path', 'Title', 'Description', 'PublishingImage;PictureURL;PictureThumbnailURL'_

**Output**

![Slideshow](https://raw.githubusercontent.com/SPCSR/DisplayTemplates/master/Search%20Display%20Templates/Slideshow%20Templates%20(CSWP)/images/slideshow2.PNG)