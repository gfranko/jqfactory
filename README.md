jqfactory
=========

<img src="http://0.tqn.com/d/webclipart/1/0/J/t/4/Construction-Hat.png" width="100px;">

> A jQuery Plugin Factory that provides a consistent foundation and API for building stateful jQuery widgets. Inspired by the jQueryUI Widget Factory.

[![Build Status](https://travis-ci.org/gfranko/jqfactory.png?branch=master)](https://travis-ci.org/gfranko/jqfactory)

##Notable Features
 - Supports jQuery prototype namespacing and event namespacing
 - Includes an elegant, promises-based, solution for plugins that rely on asynchronous behavior on initialization
 - AMD support
 - Implements a simple prototypal inheritance paradigm that allows you to reuse methods/properties from objects and jqfactory itself
 - Saves all instances within the jQuery `data()` method and allows you to call plugin methods by passing a string to the plugin method to easily construct a public API
 - Provides over 10 public/private convenience methods/properties that are useful for plugin development
 - Supports easy event binding/delegation (similar to Backbone.js views) and event removal
 - Prevents multiple plugin initializations per element
 - Provides a jQuery plugin pseudo selector to query for all DOM elements that have called the plugin

##Requirements
jQuery 1.8.3+

##Browser support
IE8+, Modern Browsers

##Quick Start
1.  Download **jQuery 1.8.3+** and **jqfactory**, create your plugin file, and include them all as `script` tags on an HTML page
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

    **Note:** The first argument of the `$.jqfactory()` method requires a namespace **and** base name.
    
    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
        // namespace - person
        // name - greg
        $.jqfactory('person.greg', {
            // Your plugin instance properties will go here
        });
    }(jQuery, window, document));
    ```

3.  Include an `options` object that will store your default plugin options

    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
        // namespace - person
        // name - greg
        $.jqfactory('person.greg', {
            // Your plugin instance properties will go here
            // Default plugin options
            options: {
                occupation: 'JavaScript Engineer',
                age: 24
            }
        });
    }(jQuery, window, document));
    ```

4.  Include a `_create` method that will act as your plugin constructor.  This method is only called once per element.

    **Note:** You can also create an `_init` method that will be called when your plugin is reinitialized

    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
        // namespace - person
        // name - greg
        $.jqfactory('person.greg', {
            // Your plugin instance properties will go here
            // Default plugin options
            options: {
                occupation: 'JavaScript Engineer',
                age: 24
            },
            // Plugin Constructor
            _create: function() {
                // This is where you can set plugin instance properties
                this.fullname = 'Greg Franko';
            },
            // Plugin re-initialized
            _init: function() {
                // You can include any logic that you like when your plugin constructor is re-called
            }
        }
        });
    }(jQuery, window, document));
    ```

5.  Include a `_render` method that will handle all of your plugin dom manipulation on initialization (e.g. creating, appending, etc).  The `_render()` method is called after the `_create()` method and only called once per element.

    **Note:** If the previous `_create()` method had returned a jQuery Deferred object, then the `_render()` method would wait to be called until after the Deferred object was resolved.

    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
        // namespace - person
        // name - greg
        $.jqfactory('person.greg', {
            // Your plugin instance properties will go here
            // Default plugin options
            options: {
                occupation: 'JavaScript Engineer',
                age: 24
            },
            // Plugin Constructor
            _create: function() {
                // This is where you can set plugin instance properties
                this.fullname = 'Greg Franko';
            },
            // Plugin re-initialized
            _init: function() {
                // You can include any logic that you like when your plugin constructor is re-called
            },
            // Dom manipulation goes here
            _render: function() {
                // This is a perfect spot for creating and appending your plugin dom elements to the page
                var greg = $('<div/>', {
                    'class': 'developer'
                });
                greg.appendTo('body');
            }
        });
    }(jQuery, window, document));
    ```

6.  Include an `_events` object that will hold all of the event bindings for your plugin.  These events are bound after the `_render()` method is called and only called bound once per element.

    **Note:** If the previous `_render()` method had returned a jQuery Deferred object, then the `_events` object would have bound all events after the Deferred object was resolved.

    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
        // namespace - person
        // name - greg
        $.jqfactory('person.greg', {
            // Your plugin instance properties will go here
            // Default plugin options
            options: {
                occupation: 'JavaScript Engineer',
                age: 24
            },
            // Plugin Constructor
            _create: function() {
                // This is where you can set plugin instance properties
            },
            // Plugin re-initialized
            _init: function() {
                // You can include any logic that you like when your plugin constructor is re-called
            },
            // Dom manipulation goes here
            _render: function() {
                // This is a perfect spot for creating and appending your plugin dom elements to the page
                var greg = $('<div/>', {
                    'class': 'developer'
                });
                greg.appendTo('body');
            },
            // Plugin event bindings
            _events: {
                // Delegated event that assumes the .face element is inside of the element that called the plugin
                '.face click': function (ev) {
                },
                // The exclamation point tells jqfactory that this event should be directly bound (not delegated)
                '!.developer click': 'somePluginMethod',
                // Click event that is triggered on the element that called the plugin
                'click': function() {
                },
                // Special event that is triggered on the element that called the plugin
                'disable': function() {
                }
            }
        });
    }(jQuery, window, document));
    ```

7.  Include a `_postevents` method that will be called after all events within the `_events` object are bound.  Within the `_postevents()` method you are now free to trigger any events that are directly bound to elements.  The `_postevents()` method is only called once per element.

    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
        // namespace - person
        // name - greg
        $.jqfactory('person.greg', {
            // Your plugin instance properties will go here
            // Default plugin options
            options: {
                occupation: 'JavaScript Engineer',
                age: 24
            },
            // Plugin Constructor
            _create: function() {
                // This is where you can set plugin instance properties
            },
            // Plugin re-initialized
            _init: function() {
                // You can include any logic that you like when your plugin constructor is re-called
            },
            // Dom manipulation goes here
            _render: function() {
                // This is a perfect spot for creating and appending your plugin dom elements to the page
                var greg = $('<div/>', {
                    'class': 'developer'
                });
                greg.appendTo('body');
            },
            // Plugin event bindings
            _events: {
                // Delegated event that assumes the .face element is inside of the element that called the plugin
                '.face click': function (ev) {
                },
                // The exclamation point tells jqfactory that this event should be directly bound (not delegated)
                '!.developer click': 'somePluginMethod',
                // Click event that is triggered on the element that called the plugin
                'click': function() {
                },
                // Special event that is triggered on the element that called the plugin
                'disable': function() {
                }
            },
            // All event listeners are now bound
            _postevents: function() {
                // You can now manually trigger directly bound events using the jqfactory _trigger() method
                this._trigger('.developer', 'click');
            }
        });
    }(jQuery, window, document));
    ```

8.  Include any custom methods/properties that you like to complete your plugin!  Remember that jqfactory provides you a bunch of helper methods including `_on()`, `_off()`, `_trigger()`, `_superMethod()`, `delay()`, `disable()`, `enable()`, `destroy()`, and `option()` that you can use throughout your plugin.

    **Note:** If you override a default jqfactory method, you can still use the jqfactory method by using `_superMethod()` 

    ```javascript
    (function($, window, document, undefined) {
        // Your plugin will go here
        // namespace - person
        // name - greg
        $.jqfactory('person.greg', {
            // Your plugin instance properties will go here
            // Default plugin options
            options: {
                occupation: 'JavaScript Engineer',
                age: 24
            },
            // Plugin Constructor
            _create: function() {
                // This is where you can set plugin instance properties
            },
            // Plugin re-initialized
            _init: function() {
                // You can include any logic that you like when your plugin constructor is re-called
            },
            // Dom manipulation goes here
            _render: function() {
                // This is a perfect spot for creating and appending your plugin dom elements to the page
                var greg = $('<div/>', {
                    'class': 'developer'
                });
                greg.appendTo('body');
            },
            // Plugin event bindings
            _events: {
                // Delegated event that assumes the .face element is inside of the element that called the plugin
                '.face click': function (ev) {
                },
                // The exclamation point tells jqfactory that this event should be directly bound (not delegated)
                '!.developer click': 'somePluginMethod',
                // Click event that is triggered on the element that called the plugin
                'click': function() {
                },
                // Special event that is triggered on the element that called the plugin
                'disable': function() {
                }
            },
            // All event listeners are now bound
            _postevents: function() {
                // You can now manually trigger directly bound events
                this._trigger('.developer', 'click');
            },
            // Overriding the destroy method
            destroy: function() {
                // Calling the jqfactory `destroy()` method
                this._superMethod('destroy');
            },
            // Example of a custom method that I added to my plugin
            customMethod: function() {
                // Binding another event manually
                this._on('.hand click', function(ev) {
                    console.log('hand clicked!');
                });
            }
        });
    }(jQuery, window, document));
    ```

9.  You can now call your plugin like this:

    ```javascript
    $('.test').greg();
    ```

    If you had added a `true` third parameter (the **enforceNamespace** parameter) to the `$.jqfactory()` method, then you would call your plugin like this:

    ```javascript
    $('.test').person().greg();
    ```

    To call API methods, you have two options:

    **Option 1**

    Retrieve the plugin instance using the jQuery `data()` method.

    Example:

    ```javascript
    $('.test').greg().data('person-greg').someMethod();
    ```

    **Option 2**

    Pass a string to the plugin after it is initialized

    Example:

    ```javascript
    $('.test').greg();
    $('.test').greg('someMethod');
    ```

    Continue building on top of jqfactory and make great plugins!


##API

###Properties

**_super** - A reference to the parent widget object (can be overriden)

**callingElement** - The native DOM element that calls your plugin

**$callingElement** - The native DOM element that calls your plugin, wrapped in a jQuery object

**element** - The native DOM element that is used for all delegated events (Can be overriden)

**$element** - The native DOM element, wrapped in a jQuery object, that is used for all delegated events

**options** - The currently used plugin options

**namespace** - Used internally (e.g. `'person')

**basename** - Used internally (e.g. 'greg')

**fullname** - Used internally (e.g. 'person-greg')

**eventnamespace** - Used internally (e.g. '.person-greg')

**jqfactory** - A convenience property that contains the $.jqfactory.common object


###Methods

 **$.jqfactory(String namespace.name, Object properties, Boolean enforceNamespace)**

 - The jqfactory is a simple function on the global jQuery object - jQuery.jqfactory - that accepts 2 or 3 arguments.  The first argument to jqfactory is a string containing a namespace and name, separated by a period.

 - The namespace is mandatory, and it refers to the location on the global jQuery object where the widget instance properties will be stored. If the namespace does not already exist, jqfactory will create it for you.

 - The second argument is an object that is used to set the plugin instance properties.

 - The third argument is a boolean that determines if the namespace, provided in the first argument, is included on the jQuery prototype along with the plugin name.  (eg: $('.example').bootstrap().tooltip())

**_create()** - Function

_Description:_
- The first method called when your jQuery plugin is initialized.  Acts as your plugin constructor function.  Supports deferred/promise objects.

**_init(arguments)** - Function

_Description:_
- The method called when your jQuery plugin is re-initialized.  All user arguments are passed.

**_render()** - Function

_Description:_
- Called after the `_create()` method.  Meant to be where all of your plugin dom manipulation initialization happens.  Supports deferred/promise objects.

**_events** - Object

_Description:_
- All events within this object are bound after the `_render()` method is called.

_Examples:_
- Supports event delegation:

```javascript
'.test click': function(){}
```

- Supports direct event binding:

```javascript
'!.test click': function(){}
```

- Supports special events: 

```javascript
'superfantastic': function(){}
```

- Supports automatic binding that corresponds to the this.$element property:

```javascript
'click': function(){}
```

**_postevents()** - Function

_Description:_
- Called after all events from the `_events` object are bound.

**_on(String selector or Object, Function)** - Function

_Description:_
- Binds/Delegates event handlers using the correct event namespace and binds the correct this context within the callback function

_Examples:_

- Single event binding :

```javascript
this._on('.test click', function(){});
```

- Multiple event binding:

```javascript
this.on({
    '.test click': function(){},
    '.test mouseenter': 'someMethod'
});
```

**_off(String selector or Array)** - Function

_Description:_
- Unbinds/Undelegates event handlers using the correct event namespace

_Examples:_

- Single event unbinding :

```javascript
this._off('.test click');
```

- Multiple event unbinding (array):

```javascript
this.off(['.test click', '.test mouseenter']);
```

- Multiple event unbinding (object):

```javascript
this.off({ '.test click': function(){}, '.test mouseenter': function(){} });
```

**_trigger(String selector or Array)** - Function

_Description:_
- Triggers an event using the correct event namespace

_Examples:_

- Element Event Trigger:

```javascript
this._trigger('.test', 'click');
```

- This.element Event Trigger:

```javascript
this._trigger('click');
```

**_superMethod(String methodName, arguments)** - Function

_Description:_
- Call's a jqfactory method and correctly sets the context to the plugin instance

_Examples:_

- Method with no arguments:

```javascript
this._superMethod('destroy');
```

- Method with one argument:

```javascript
this._superMethod('option', 'exampleOption');
```

- Method with two arguments:

```javascript
this._superMethod('option', 'exampleOption', true);
```

**delay(String methodName or Function method, Number delay)** - Function

_Description:_

Delays the execution of a method by the number of milliseconds specified in the second argument (essentially setTimeout). Defaults to 0.

_Examples:_

- Specifying a method with a string:

```javascript
this.delay('destroy', 2000);
```

- Specifying a method with a function:

```javascript
this.delay(this.destroy, 2000);
```

**disable()** - Function

_Description:_
Set's the `disabled` option to to `true` and triggers a special `disable` event on the element that called the plugin.  This method is meant to be overriden and then called within the overriden method.  Like this:

_Examples:_

```javascript
disable: function() {
    // Your custom disable logic goes here
    this._superMethod('disable');
}
```

**enable()** - Function

_Description:_
Set's the `disabled` option to to `false` and triggers a special `enable` event on the element that called the plugin.  This method is meant to be overriden and then called within the overriden method.  Like this:

_Examples:_

```javascript
enable: function() {
    // Your custom disable logic goes here
    this._superMethod('enable');
}
```

**destroy()** - Function

_Description:_
Helps with memory clean-up of your plugin by unbinding all events with your plugin's event namespace and removing all event handlers bound in the `_events` object.  Also triggers a special `destroy` event on the element that called the plugin.  This method is meant to be overriden and then called within the overriden method.  Like this:

_Examples:_

```javascript
destroy: function() {
    // Your custom disable logic goes here
    this._superMethod('destroy');
}
```

**option()** - Function

_Description:_
This  method combines the functionality of `setOption(String key, String val)`, `setOptions(Object props)`, and `getOption(String key)` methods.  Depending on which functionality is used, a `getOption`, `setOption`, or `setOptions` event is triggered on the element that called the plugin.

_Examples:_


- Get a single option:
```javascript
this.option('someOption');
```

- Get a single nested option:
```javascript
this.option('someOption.someNestedOption');
```

- Set a single option:
```javascript
this.option('someOption', 'example');
```

- Set a single nested option (short-form):
```javascript
this.option('someOption.someNestedOption', 'example');
```

- Set a single nested option (object-form):
```javascript
this.option('someOption': { 'someNestedOption': 'example' });
```

- Set multiple options:

```javascript
this.option({ 'someOption': 'example', 'someOtherOption': 'anotherExample' });
```

- Set multiple nested options (short-form):

```javascript
this.option({ 'someOption': 'example', 'someOtherOption.someNestedOption': 'anotherExample' });
```

- Set multiple nested options (object-form):

```javascript
this.option({ 'someOption': 'example', 'someOtherOption': { 'someNestedOption': 'anotherExample' } });
```

###Default Events

**Note**: All events are triggered with the event namespace (e.g. `setOption.person-greg`)

**disable** - Triggered when the `disable()` method is called

**enable** - Triggered when the `enable()` method is called

**destroy** - Triggered when the `destroy()` method is called

**getOptions** - Triggered when the `option()` method is called with zero arguments

**getOption** - Triggered when the `option()` method is called to retrieve a single option

**setOptions** - Triggered when the `option()` method is called with an object literal argument

**setOption** - Triggered when the `option()` method is called to set a single option

##FAQ

__Should I use this instead of the jQueryUI Widget Factory?__

 - It depends.  Both are great solutions, but here are some of the differences:

  **Namespacing**:

   _jQueryUI Widget Factory_ - Does not support jQuery prototype namespacing.  All plugins are place on the jQuery prototype using just their base name.
   
   _jqfactory_ - Supports jQuery prototype namespacing using the namespace and basename, or just basename.

  **Initialization**:

   _jQueryUI Widget Factory_ - Calls the `_create()` method once and calls the `_init()` method on successive calls to the widget with no arguments.
   
   _jqfactory_ - First the `_create()` method is called, then the `_render()` method is called, `_events` are bound, and then the `_postaction()` method is called.  Also supports returning promises inside of the `_create()` and/or `_render()` methods for plugins that depend on an asynchronous action during initialization.  Calls the `init()` method on successive calls to the plugin and passes all arguments.

  **Inheritance**:

   _jQueryUI Widget Factory_ - Allows an individual widget to inherit from a function.  By default, inherits from `$.Widget`
   
   _jqfactory_ - Allows an individual widget to inherit from an object.  By default, inherits from `$.jqfactory.common`.

  **AMD**:

   _jQueryUI Widget Factory_ - Does not provide AMD support.  **Note:** I talked to the jQueryUI Widget Factory core developer, Scott Gonzalez, recently and he said AMD support will be coming in a future release.
   
   _jqfactory_ - AMD is supported.  The named AMD module, `jqfactory`, is exported.

  **Events**:

   _jQueryUI Widget Factory_ - Allows you to add and remove plugin event handlers using the `_on()` and `_off()` methods.  Also allows you to trigger events and their associated option callbacks by using the `_trigger()` method.
   
   _jqfactory_ - Allows you to easily group the majority of your event handlers inside of an `_events` object (similar to Backbone.js Views).  Event handlers can also be added and removed at different times using the `_on()` and `_off()` methods, and events can be triggered using the `_trigger()` method.  **It is important to note that jqfactory does not natively support passing an event callback as an option.**

__How do I change which DOM element my _events property delegates from?__

 - If you would like your event handlers to delegate from a different element than one that called your plugin, then you can overwrite the `element` instance property.  If you overwrite the `element` property, then you can still find out which element called your plugin by using the `callingElement` property.

 __How do I get my widget to inherit from an object?__

 - By default jqfactory widgets inherit from the $.jqfactory.common object.  If you would like to inherit from a different object, then you can override the `_super` property like this:

 ```javascript
$.jqfactory.create('example.plugin', {
    _super: {
        exampleMethod: function() {}
    }
    // The rest of your plugin goes here
});
 ```

 When you override the `_super` property, the `$.jqfactory.common` object is merged with the `_super` object.  If your `_super` object overrides a jqfactory method, you can still access the jqfactory method using the `jqfactory` shortcut property.

 __What do I do if my plugin depends on asynchronous code to start?__

 - Both the `_create()` and `_render()` methods support returning a jQuery deferred/promise object.  The `render()` method will make sure to wait until the promise object returned by the `_create()` method is resolved to be called.  Similarly, all events will wait to be bound and the `_postevents()` method will wait to be called until after the jQuery deferred/promise object returned by the `render()` method is resolved.

  __What is the point of the _on() method if all events inside of the _events property are already bound on initialization?__

 - There are use cases for dynamically binding event handlers only when certain conditions are met in your plugin.  The `_on()` method allows developers to bind later, which can improve page load performance.  Internally, the `_on()` method will keep track of which dynamic events are bound, making sure that they get destroyed if the jqfactory `destroy()` method is called.

__When would I use the _superMethod method?__

 - jqfactory provides you a bunch of helpful convenience methods such as `destroy()`, `disable()`, and more.  If you want to overwrite one of the helper methods to provide your own implementation, then inside of your overridden method you can call the jqfactory parent method using the `_superMethod()` method.

 __Why would you use jQuery prototype namespacing?__

 - If you are creating more than one jQuery plugin, then you can place all of your plugins under one top-level namespace function on the jQuery prototype object.  This greatly reduces the possibility of running into a naming collision with another jQuery plugin.  A great example would be the Twitter Bootstrap library; it would be great if the Bootstrap library placed all of their individual jQuery plugins under a common bootstrap() function namespace.

  __Do you provide AMD support?__

 - Yes!  jqfactory exports a named AMD module called, `jqfactory`, that allows plugin developers to provide AMD support by doing the following:

 ```javascript
    if (typeof define === 'function' && define.amd) {
        // An AMD loader is on the page. List jquery and the jqfactory as dependencies and register your plugin as an anonymous AMD module.
        define(['jquery', 'jqfactory'], function() {
            // Call your plugin
        });
    } else {
        // An AMD loader is not on the page.  Call your plugin.
    }
 ```

##Changelog

`0.3.0` - July 26, 2013

 - Inheritance - Widgets are now able to inherit from an object.
 - API Methods - Methods can now be called by passing a string to the plugin method (jQueryUI Widget Factory style)
 - Support string method names in the `events` object and `_on()` methods (Similar to Backbone.js Views)
 - Triggered handy default events (e.g. disable, enable, destroy, setOptions, etc)
 - All widgets now have a **jqfactory** property (useful if you are inheriting from an object that has overriden a jqfactory method)

`0.2.0` - July 7, 2013

 - First stable release - **PRODUCTION READY**
 - Added Jasmine unit tests

`0.1.0` - June 10, 2013

 - Initial Release!

##Contributors
 [Greg Franko](https://github.com/gfranko)

##License
 Copyright (c) 2013 Greg Franko Licensed under the MIT license.


