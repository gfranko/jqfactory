jqfactory
=========

> A jQuery Plugin Factory that provides a consistent foundation and API for building stateful jQuery widgets.  

##Notable Features
 - Supports jQuery prototype namespacing and event namespacing
 - Includes an elegant, promises-based, solution for plugins that rely on asynchronous behavior on initialization
 - Implements a simple inheritance paradigm that allows you to reuse methods/properties from other jqfactory plugins using mixins and prototypal inheritance to reuse jqfactory common methods
 - Supports privately scoping instance properties to easily construct a public API
 - Provides over 10 public/private convenience methods/properties that are useful for plugin development
 - Supports automatic event binding/delegation and event removal
 - Prevents multiple plugin initializations per element
 - Provides a jQuery plugin pseudo selector to query for all DOM elements that have called the plugin

##Requirements
jQuery 1.7+

##Browser support
IE8+

##Quick Start
 1.  Download **jQuery** and **jqfactory**, create your plugin file, and include them all as `script` tags on an HTML page
        ```html
    <script src="http://code.jquery.com/jquery-1.9.1.js"></script>

    <script src="./jqfactory.js"></script>

    <script src="./myawesomeplugin.js"></script>
        ```
2.  Start building your jQuery plugin with **jqfactory**!

##Developer Guide
 1.  Wrap your entire plugin in an immediately invoked function expression (IIFE)

    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
    }(jQuery, window, document));
    ```

 ##Changelog
 > 0.1.0 - June 10, 2013
  - Initial release!

 ##Contributors
 Greg Franko

 ##License
 Copyright (c) 2013 Greg Franko Licensed under the MIT license.


