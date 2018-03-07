# Scroll Shadow Plugin
This package contains the Scroll Shadow Plugin. 

Check the [demo](https://rcdd.github.io/PluginScrollShadow/).

## Table of Contents
1. Introduction
	* [What is Scroll Shadow Plugin](#intro)
2. How install
	* [Prerequisites](#requisites)
	* [Installation](#installation)
3. Examples
	* [Base](#base)
	* [With external header and footer](#external)
	* [With shadow height of 20px](#height)
	* [With shadow color salmon pale (RGBA)](#color-rgba)
	* [With shadow color red (HEX)](#color-hex)
	* [With shadow initial color blue sky darkest to final color blue sky light (RGBA)](#color-initial-final-rgba)
4. Classes
	* [Elements](#elements)
5. How to use
	* [Initialize module](#init-module)
6. Properties
	* [HTML attributes](#html-attributes)
7. Notes
	* [Important](#notes)

---
## <a name="intro"></a>Introduction
The Scroll Shadow Plugin applies shadows to a scrollable container upper and lower boundaries. 
This gives the user a visual information that there is hidden content above or below the container visible area. 
The shadows are only visible when there is hidden content.

## <a name="requisites"> Test Prerequisites

### [Node.js](https://nodejs.org/en/download/)

#### Node installation

Please, read the [Node.js official installation guide](https://github.com/nodejs/node/wiki/Installation).

### [Gulp](https://gulpjs.com/)

Gulp uses Node for core processing, npm to manage project dependencies, and gulp.js to run tasks and interface with the core library. Node
version 8 or higher suffices. You can follow the directions for installing Node on the Node website if you haven't done so already.
Installation of Node will include npm. In order to run this project gulp tasks it is highly recommended that you install gulp globally.

#### Gulp installation

From the command line (Windows, Mac or Linux), please execute the following command:

```sh
npm install --global gulp-cli
```

## <a name="installation"> Installation

Clone or download this project. From the project directory run the command `npm install`.

## Local Development

To run the project in development mode, from the project directory run the command `npm run dev`. Your default
browser should open a window with the project running from [http://localhost:3000/](http://localhost:3000/).


## Examples
### <a name="base"></a>Base

```html
<div data-plugin-init="PluginScrollShadow"
	style="height: 100px; overflow: auto">
	<div class="ncpp-plugin-scroll-shadow_wrapper">
		THIS<br />
		IS<br />
		A<br/>
		TEST<br />
		WITH<br />
		SCROLLER<br />
		SHADOW<br />
	</div>
</div>
```

### <a name="external"></a> With external header and footer

```html
<div class="ncpp-plugin-scroll-header">
<b>HEADER</b>
</div>
<div data-plugin-init="PluginScrollShadow"
	data-plugin-shadow-header="ncpp-plugin-scroll-header"
	data-plugin-shadow-footer="ncpp-plugin-scroll-footer"
	style="height: 100px; overflow: auto">
	<div class="ncpp-plugin-scroll-shadow_wrapper">
		THIS<br />
		IS<br />
		A<br/>
		TEST<br />
		WITH<br />
		SCROLLER<br />
		SHADOW<br />
	</div>
</div>
<div class="ncpp-plugin-scroll-footer">
<b>FOOTER</b>
</div>
```

### <a name="height"></a> With shadow height of 20px 

```html
<div data-plugin-init="PluginScrollShadow"
	data-plugin-shadow-height="20"
	style="height: 100px; overflow: auto">
	<div class="ncpp-plugin-scroll-shadow_wrapper">
		THIS<br />
		IS<br />
		A<br/>
		TEST<br />
		WITH<br />
		SCROLLER<br />
		SHADOW<br />
	</div>
</div>
```

### <a name="color-rgba"></a> With shadow color salmon pale (RGBA = rgba(255, 198, 157, .5))

```html
<div data-plugin-init="PluginScrollShadow"
	data-plugin-shadow-initial-color="rgba(255, 198, 157, .5)"
	style="height: 100px; overflow: auto">
	<div class="ncpp-plugin-scroll-shadow_wrapper">
		THIS<br />
		IS<br />
		A<br/>
		TEST<br />
		WITH<br />
		SCROLLER<br />
		SHADOW<br />
	</div>
</div>
```

### <a name="color-hex"></a> With shadow color red (HEX = #de3723)

```html
<div data-plugin-init="PluginScrollShadow"
	data-plugin-shadow-initial-color="#de3723"
	style="height: 100px; overflow: auto">
	<div class="ncpp-plugin-scroll-shadow_wrapper">
		THIS<br />
		IS<br />
		A<br/>
		TEST<br />
		WITH<br />
		SCROLLER<br />
		SHADOW<br />
	</div>
</div>
```

### <a name="color-initial-final-rgba"></a> With shadow initial color blue sky darkest to final color blue sky light (RGBA)

```html
<div data-plugin-init="PluginScrollShadow"
	data-plugin-shadow-initial-color="rgba(50, 129, 232, .5)"
	data-plugin-shadow-final-color="rgba(50, 129, 232, .1)"
	style="height: 100px; overflow: auto">
	<div class="ncpp-plugin-scroll-shadow_wrapper">
		THIS<br />
		IS<br />
		A<br/>
		TEST<br />
		WITH<br />
		SCROLLER<br />
		SHADOW<br />
	</div>
</div>
```

## Classes

###  <a name="elements"></a> Elements

| Class | Description |
| --- | --- |
| `ncpp-plugin-scroll-shadow` | Scroll Shadow Plugin root element. |
| `ncpp-plugin-scroll-shadow__scroller` | Scrollable container content wrapper element. |
| `ncpp-plugin-scroll-shadow__scroller__before` | Top scroll shadow element. |
| `ncpp-plugin-scroll-shadow__scroller__after` | Bottom scroll shadow element. |
| `ncpp-plugin-scroll-shadow__header` | Header scroll shadow element (When defined in an HTML Attribute). |
| `ncpp-plugin-scroll-shadow__footer` | Footer scroll shadow element (When defined in an HTML Attribute). |

## Javascript ES2015

###  <a name="init-module"></a> Init module

To apply this plugin, simply set the `data-plugin-init="PluginScrollShadow"` attribute to any container element.

```markup
<div id="container-1" data-plugin-init="PluginScrollShadow">
</div>
```

### Properties
Properties can be defined through HTML data attributes.

####  <a name="html-attributes"></a> HTML attributes

| Attribute | Description |
| --- | --- |
| `data-plugin-init`: string | Scroll Shadow plugin initializer. |
| `data-plugin-shadow-height`: number | Shadow height property. |
| `data-plugin-shadow-initial-color`: string | Initial shadow color. It can be expressed in HEX or RGBA. |
| `data-plugin-shadow-final-color`: string | Final shadow color. It can be expressed in HEX or RGBA. |
| `data-plugin-shadow-header`: string | External header element class to apply the scroller top shadow. |
| `data-plugin-shadow-footer`: string | External footer element class to apply the scroller bottom shadow. |
| `data-plugin-shadow-mobile`: boolean | Property to enable or disable shadow in mobile. (Default: true) |

##  <a name="notes"></a>  Notes
When is used external header and/or footer, this parent element position will be converted to 'relative'.
## Contributing

1. Fork this project: [https://github.com/Mteixeira88/css-variables-IE-script](https://github.com/Mteixeira88/css-variables-IE-script)
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request


## Author
**Miguel Teixeira**
* <https://github.com/Mteixeira88>

### Contributors
**Mauro Reis**
* <https://github.com/maurovieirareis>

**Abel Lopes**
* <https://github.com/abelflopes>

### Project forked from
* <https://github.com/andreros/typescript-boilerplate>

**André Rosa**
* <https://github.com/andreros/>

## License

This is free and unencumbered software released into the [public domain](UNLICENSE.txt). For more information,
please refer to [http://unlicense.org](http://unlicense.org).
