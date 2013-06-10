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
