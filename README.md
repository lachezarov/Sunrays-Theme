# Sunrays Theme

A modern Apache2 index theme.

![Sunrays Light](http://i63.tinypic.com/dctoxd.png)

### Key Features

 - Custom rendered HTML5 DOM tree using XSL transformation.
 - Responsive - suitable for all device sizes.
 - **autoDrillDown** automatically opens single sub-directories until multiple choice is available.
 - **quickSearch** - just start typing. Combined with **autoDrillDown** this feature saves a lot of clicks and time.
 - Light and Dark color schemes available
 - Basic keyboard navigation

### Compatibility

Tested with Apache 2.2. Should run smoothly on all modern browsers.

### Installation

Place the `/sunrays-theme` directory and the accompanying `.htaccess` file in your server root directory.

### Known Issues

In some instances, if browser-sync script is included at the beginning of the `body` tag, the theme's XML code is broken so it just shows a blank screen.