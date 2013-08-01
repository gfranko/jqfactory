/* jqfactory - v0.3.0 - 2013-7-26
* Copyright (c) 2013 Greg Franko; Licensed MIT */
;(function (jqfactory) {
    // Strict Mode
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // An AMD loader is on the page. Register jqfactory as a named AMD module.
        define('jqfactory', ['jquery'], function() {
            jqfactory(window.jQuery, window, document);
        });
    } else {
        // An AMD loader is not on the page.
        jqfactory(window.jQuery, window, document);
    }
} (function ($, window, document, undefined) {
    // Strict mode
    'use strict';
    var slice = Array.prototype.slice,
        jqfactory = {
        create: function(name, props, enforceNamespace) {
            var parentWidget = props._super,
                names = name.split('.'),
                namespace = names[0],
                basename = names[1],
                fullname = namespace + '-' + basename,
                eventnamespace = '.' + fullname,
                widgetProps = {
                    jqfactory: jqfactory.common,
                    namespace: namespace,
                    basename: basename,
                    fullname: fullname,
                    eventnamespace: eventnamespace
                },
                instanceProps = props,
                protoProps = $.extend({}, ($.isPlainObject(parentWidget) && !$.isEmptyObject(parentWidget) ? $.extend(true, {}, jqfactory.common, parentWidget) : jqfactory.common), widgetProps),
                setup,
                namespaceObj = {},
                currentNamespace = $.fn[namespace],
                Plugin,
                args;
            if(!namespace || !basename || !$.isPlainObject(props) || $.isEmptyObject(props) || ($[namespace] && $[namespace][basename])) {
                return;
            }
            Plugin = function(props) {
                for(var x in props) {
                    if(props.hasOwnProperty(x)) {
                        this[x] = props[x];
                    }
                }
            };
            Plugin.prototype = protoProps;
            $[namespace] = $[namespace] || {};
            $[namespace][basename] = instanceProps;
            if(enforceNamespace) {
                namespaceObj[basename] = function(options) {
                    args = arguments;
                    return this.each(function() {
                        setup.apply(this, args);
                    });
                };
                jqfactory.utils.createNamespace(namespace, namespaceObj);
            } else {
                $.fn[basename] = function(options) {
                    args = arguments;
                    return this.each(function() {
                        setup.apply(this, args);
                    });
                };
            }
            setup = function() {
                var args = slice.call(arguments),
                    firstArg = args[0],
                    options = $.isPlainObject(firstArg) ? firstArg : {},
                    existingElem = props.element,
                    callingElement = this,
                    elem = existingElem ? $(existingElem)[0] : callingElement,
                    $elem = $(elem),
                    existingInstance = $.data(elem, fullname),
                    obj = {},
                    widget,
                    defaultOptions = instanceProps.options || {},
                    created,
                    rendered;
                if (existingInstance) {
                    existingInstance._init.apply(existingInstance, arguments);
                    if($.type(firstArg) === 'string') {
                        args.shift();
                        if($.isFunction(existingInstance[firstArg])) {
                            existingInstance[firstArg].apply(existingInstance, args);
                        }
                    }
                    return;
                }
                widget = new Plugin(instanceProps);
                widget.options = $.extend(true, {}, defaultOptions, options);
                widget._super = protoProps;
                widget.callingElement = callingElement;
                widget.$callingElement = $(callingElement);
                widget.element = elem;
                widget.$element = $elem;
                $.data(elem, widget.fullname, widget);
                obj[fullname] = function(elem) {
                    return $(elem).data(fullname) !== undefined;
                };
                $.extend($.expr[":"], obj);
                created = widget._create() || {};
                if(widget.isDeferred(created)) {
                    created.done(function() {
                        rendered = widget._render.apply(widget, arguments) || {};
                        jqfactory.utils.postRender.call(widget, rendered, arguments);
                    });
                } else {
                    rendered = widget._render() || {};
                    jqfactory.utils.postRender.call(widget, rendered);
                }
            };
        },
        utils: {
            createNamespace: function(namespaceName, namespaceFuncs) {
                if (!$.fn[namespaceName]) {
                    $.fn[namespaceName] = function Namespace(context) {
                        if (this instanceof Namespace) {
                            this.__namespace_context__ = context;
                        }
                        else {
                            return new Namespace(this);
                        }
                    };
                }
                $.each(namespaceFuncs, function(closureName, closure) {
                    $.fn[namespaceName].prototype[closureName] = function() {
                        return closure.apply(this.__namespace_context__, arguments);
                    };
                });
            },
            postRender: function(rendered, args) {
                var widget = this;
                if(widget.isDeferred(rendered)) {
                    rendered.done(function() {
                        widget._on(widget._events);
                        widget._postevents.apply(widget, args);
                    });
                } else {
                    widget._on(widget._events);
                    widget._postevents();
                }
            }
        },
        common: {
            _create: $.noop,
            _init: $.noop,
            _render: $.noop,
            _events: {},
            _postevents: $.noop,
            _on: function(selector, fn) {
                var obj = {};
                if($.isPlainObject(selector)) {
                    obj = selector;
                } else if($.type(selector) === 'string' && $.isFunction(fn)) {
                    obj[selector] = fn;
                }
                this._eventBindings(obj);
                this._events = $.extend(true, {}, this._events, obj);
                return this;
            },
            _off: function(selector) {
                var obj = {}, i = -1, len;
                if($.isArray(selector)) {
                    len = selector.length;
                    while (++i < len) {
                        obj[selector[i]] = 0;
                    }
                } else if($.isPlainObject(selector)) {
                    obj = selector;
                } else {
                    obj[selector] = 0;
                }
                this._eventBindings(obj, 'off');
                return this;
            },
            _trigger: function(elem, ev, data) {
                elem = elem === 'window' ? $(window) : elem === 'document' ? $(document) : elem;
                var elemLength = $(elem).length;
                data = elemLength ? data : ev;
                ev = elemLength ? ev : elem;
                elem = elem ? elem.jquery ? elem : elemLength ? $(elem) : this.$element : this.$element;
                elem.trigger(ev + this.eventnamespace, data);
                return this;
            },
            _superMethod: function() {
                var args = slice.call(arguments),
                    method = args.shift(),
                    proto = this._super;
                if(proto[method]) {
                    return proto[method].apply(this, args);
                }
            },
            delay: function(handler, delay) {
                function handlerProxy() {
                    return ($.type(handler) === 'string' ? instance[ handler ] : handler).apply(instance, arguments);
                }
                var instance = this;
                return setTimeout(handlerProxy, delay || 0);
            },
            disable: function() {
                this.option('disabled', true);
                this._trigger('disable');
                return this;
            },
            enable: function() {
                this.option('disabled', false);
                this._trigger('enable');
                return this;
            },
            destroy: function() {
                this._trigger('destroy');
                $.removeData(this.callingElement, this.fullname);
                this._off(this._events, 'off');
                return this;
            },
            option: function(key, val) {
                var self = this,
                    keys,
                    keyLen,
                    hasVal = val !== undefined,
                    options = self.options;
                if(arguments.length === 0) {
                    this._trigger('getOptions', options);
                    return options;
                }
                if($.type(key) === 'string' && !key.length) return;
                if($.isPlainObject(key)) {
                    for(var prop in key) {
                        if(key.hasOwnProperty(prop)) {
                            nestedOption(prop, key[prop]);
                        }
                    }
                    this._trigger('setOptions', key);
                } else {
                    keys = key.split('.');
                    keyLen = keys.length;
                    if(keyLen === 1 && !hasVal) {
                        this._trigger('getOption', { key: key, val: options[key] });
                        return options[key];
                   }
                   else if(keyLen === 1 && hasVal) {
                       options[key] = val;
                       this._trigger('setOption', { key: key, val: val });
                   }
                   else {
                       if(val) {
                            nestedOption(key, val);
                            this._trigger('setOption', { key: key, val: val });
                       } else {
                            this._trigger('getOption', { key: key, val: val });
                            return nestedOption(key);
                       }
                   }
               }
               function nestedOption (key, value) {
                   var i = -1,
                       keys = key.split('.'),
                       keyLen = keys.length,
                       currentOptions = options,
                       currentOption;
                   while (++i < keyLen) {
                       currentOption = keys[i];
                       if(currentOptions[currentOption]) {
                           if(keyLen - 1 === i) {
                               if(value !== undefined) {
                                   currentOptions[currentOption] = value;
                                   return;
                               } else {
                                    return currentOptions[currentOption];
                               }
                           }
                           currentOptions = currentOptions[currentOption];
                       }
                   }
               }
               return this;
            },
            _eventBindings: function(pluginEvents, type) {
                var widget = this,
                    widgetElem = widget.$element,
                    spacePos = 0,
                    ev,
                    callback,
                    currentCallback,
                    currentEvent,
                    directElemBinding,
                    elem,
                    $elem;
                type = type || 'on';
                if(type === 'off') {
                    widgetElem.off(widget.eventnamespace);
                }
                for(ev in pluginEvents) {
                    spacePos = ev.lastIndexOf(' ');
                    callback = pluginEvents[ev];
                    currentCallback = $.proxy(($.isFunction(callback) ? callback : $.type(callback) === 'string' && widget[callback] ? widget[callback] : $.noop), widget);
                    directElemBinding = ev.charAt(0) === '!';
                    currentEvent = ev.substring(spacePos + 1) + widget.eventnamespace;
                    if(spacePos === -1) {
                        if(type === 'on') widgetElem.on(currentEvent, currentCallback);
                    } else {
                        if(directElemBinding) {
                            elem = ev.substring(1, spacePos);
                            $elem = elem === 'window' ? $(window) : elem === 'document' ? $(document) : $(elem);
                            if(type === 'on') $elem.on(currentEvent, currentCallback);
                            else if(type === 'off') $elem.off(currentEvent);
                        } else {
                            elem = ev.substring(0, spacePos);
                            if(type === 'on') widgetElem.on(currentEvent, elem, currentCallback);
                        }
                    }
                }
                return this;
            },
            isDeferred: function(def) {
                return $.isPlainObject(def) && $.isFunction(def.promise) && $.isFunction(def.done);
            }
        }
    };
    if($.jqfactory === undefined) {
        $.jqfactory = function() {
            jqfactory.create.apply(this, arguments);
        };
        $.jqfactory.common = jqfactory.common;
        $.jqfactory.VERSION = '0.3.0';
    }
}));