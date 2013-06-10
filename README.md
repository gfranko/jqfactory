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
1.  Download **jQuery 1.7+** and **jqfactory**, create your plugin file, and include them all as `script` tags on an HTML page
    ```html
    <script src="http://code.jquery.com/jquery-1.9.1.js"></script>

    <script src="./jqfactory.js"></script>

    <script src="./myawesomeplugin.js"></script>
    ```

2.  Start building your jQuery plugin with **jqfactory**!

##Developer Guide

**Note:** All methods used in this section are referenced in the _API_ documentation (further down)

1.  Wrap your entire plugin in an immediately invoked function expression (IIFE)

    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
    }(jQuery, window, document));
    ```

2.  Use the `$.jqfactory()` method to start creating your jQuery plugin.

    **Note:** `jqfactory` requires a namespace and base name.
    
    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
        $.jqfactory('person.greg', {
            // Your plugin instance properties will go here
        });
    }(jQuery, window, document));
    ```

3.  Include an `options` object that will store your default plugin options

    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
        $.jqfactory('person.greg', {
            // Your plugin instance properties will go here
            // Default plugin options
            option: {
                occupation: 'JavaScript Engineer',
                age: 24
            }
        });
    }(jQuery, window, document));
    ```

4.  Include a `_create` method that will act as your plugin constructor.  This method is only called once per element.

    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
        $.jqfactory('person.greg', {
            // Your plugin instance properties will go here
            // Default plugin options
            option: {
                occupation: 'JavaScript Engineer',
                age: 24
            },
            // Plugin Constructor
            _create: function() {
                // This is where you can set plugin instance properties
                this.fullname = 'Greg Franko';
            }
        });
    }(jQuery, window, document));
    ```

5.  Include a `_render` method that will handle all of your plugin dom manipulation on initialization (e.g. creating, appending, etc).  This method is called after the `_create()` method and only called once per element.

    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
        $.jqfactory('person.greg', {
            // Your plugin instance properties will go here
            // Default plugin options
            option: {
                occupation: 'JavaScript Engineer',
                age: 24
            },
            // Plugin Constructor
            _create: function() {
                // This is where you can set plugin instance properties
                this.fullname = 'Greg Franko';
            },
            // Dom manipulation goes here
            _render: function() {
                // This is a perfect spot for creating and appending your plugin dom elements to the page
                $('.greg').appendTo('body');
            }
        });
    }(jQuery, window, document));
    ```

6.  Include an `_events` object that will hold all of the event bindings for your plugin.  These events are bound after the `_render()` method is called and only called bound once per element.

    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
        $.jqfactory('person.greg', {
            // Your plugin instance properties will go here
            // Default plugin options
            option: {
                occupation: 'JavaScript Engineer',
                age: 24
            },
            // Plugin Constructor
            _create: function() {
                // This is where you can set plugin instance properties
            },
            // Dom manipulation goes here
            _render: function() {
                // This is a perfect spot for creating and appending your plugin dom elements to the page
                $('.greg').appendTo('body');
            },
            // Plugin event bindings
            _events: {
                // Delegated event that assumes the .face element is inside of the element that called the plugin
                '.face click': function (ev) {
                },
                // The exclamation point tells jqfactory that this event should be directly bound (not delegated)
                '!window click': function() {
                },
                // Special event
                'disable': function() {
                }
            }
        });
    }(jQuery, window, document));
    ```

##API
 **$.jqfactory(String namespace.name, Object properties, Boolean enforceNamespace)** -

 - The jqfactory is a simple function on the global jQuery object - jQuery.jqfactory - that accepts 2 or 3 arguments.  The first argument to jqfactory is a string containing a namespace and the widget name, separated by a dot.

 - The namespace is mandatory, and it refers to the location on the global jQuery object where the widget instance properties will be stored. If the namespace does not exist, jqfactory will create it for you.

 - The second argument is an object that is used to set the plugin instance properties.

 - The third argument is a boolean that determines if the namespace, provided in the first argument, is included on the jQuery prototype along with the plugin name.  (eg: $('.example').bootstrap().tooltip())

 ##Changelog
 > 0.1.0 - June 10, 2013
  - Initial release!

 ##Contributors
 Greg Franko

 ##License
 Copyright (c) 2013 Greg Franko Licensed under the MIT license.


