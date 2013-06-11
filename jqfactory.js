/* jqfactory - v0.1.0 - 2013-6-10
* Copyright (c) 2013 Greg Franko; Licensed MIT */

;(function (jqfactory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as a named module.
        define('jqfactory', ['jquery'], function() {
            jqfactory(window.jQuery, window, document);
        });
    } else {
        // Browser globals
        jqfactory(window.jQuery, window, document);
    }
}
(function ($, window, document, undefined) {
    'use strict';
    var slice = Array.prototype.slice,
        $fnProps,
        jqfactory = {
        create: function(name, props, enforceNamespace) {
            var names = name.split('.'),
                namespace = names[0],
                basename = names[1],
                fullname = namespace + '-' + basename,
                eventnamespace = '.' + basename,
                instanceProps = props,
                protoProps = jqfactory.common,
                setup,
                namespaceObj = {},
                currentNamespace = $.fn[namespace],
                Plugin;
            $[namespace] = $[namespace] || {};
            if(!namespace || !basename || !$.isPlainObject(props) || $.isEmptyObject(props) || $[namespace][basename]) {
                return;
            }
            enforceNamespace = (function() {
                if(enforceNamespace === true) {
                    return true;
                }
                return false;
            }());
            Plugin = function(props) {
                for(var x in props) {
                    if(hasOwnProperty.call(props, x)) {
                        this[x] = props[x];
                    }
                }
            };
            Plugin.prototype = protoProps;
            $[namespace][basename] = $fnProps = instanceProps;
            if(enforceNamespace) {
                namespaceObj[basename] = function(options) {
                    return this.each(function() {
                        setup(this, options);
                    });
                };
                jqfactory.utils.createNamespace(namespace, namespaceObj);
            } else {
                $.fn[basename] = function(options) {
                    this.each(function() {
                        setup(this, options);
                    });
                };
            }
            setup = function(elem, options) {
                var existingInstance = $.data(elem, fullname),
                    obj = {},
                    widget,
                    defaultOptions = instanceProps.options || {},
                    $elem = $(elem),
                    created,
                    rendered;
                if (existingInstance) {
                    return;
                }
                options = $.extend(true, {}, defaultOptions, options);
                widget = new Plugin(instanceProps);
                widget._super = jqfactory.common,
                widget.element = $elem;
                widget.namespace = namespace;
                widget.basename = basename;
                widget.fullname = fullname;
                widget.eventnamespace = eventnamespace;
                $.data(elem, widget.fullname, jqfactory.utils.publicApi(widget));
                obj[fullname] = function(elem) {
                    return $(elem).data(fullname) !== undefined;
                };
                $.extend($.expr[":"], obj);
                created = widget._create() || {};
                if(jqfactory.utils.isDeferred(created)) {
                    created.done(function() {
                        rendered = widget._render.apply(widget, arguments) || {};
                        jqfactory.utils.setEvents(rendered, widget, arguments);
                    });
                } else {
                    rendered = widget._render() || {};
                    jqfactory.utils.setEvents(rendered, widget);
                }
            };
        },
        utils: {
            publicApi: function(api) {
                var method,
                    publicApi = {};
                for(method in api) {
                    if(method.charAt(0) !== '_') {
                        publicApi[method] = api[method];
                    }
                }
                return publicApi;
            },
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
            isDeferred: function(def) {
                return def.promise && def.done;
            },
            setEvents: function(rendered, widget, args) {
                if(jqfactory.utils.isDeferred(rendered)) {
                    rendered.done(function() {
                        widget._eventBindings(widget._events);
                        widget._postevents.apply(widget, args);
                    });
                } else {
                    widget._eventBindings(widget._events);
                    widget._postevents();
                }
            }
        },
        common: {
            _create: $.noop,
            _render: $.noop,
            _events: {},
            _postevents: $.noop,
            _on: function(selector, fn) {
                var obj = {};
                if($.isPlainObject(selector)) {
                    this._eventBindings(selector);
                } else if($.type(selector) === 'string' && $.isFunction(fn)) {
                    obj[selector] = fn;
                    this._eventBindings(obj);
                }
                return this;
            },
            _off: function(selector) {
                var obj = {}, i = -1, len;
                if($.isArray(selector)) {
                    len = selector.length;
                    while (++i < len) {
                        obj[selector[i]] = 0;
                    }
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
                elem = elem ? elem.jquery ? elem : elemLength ? $(elem) : this.element : this.element;
                elem.trigger(ev + this.eventnamespace, data);
                return this;
            },
            _superMethod: function() {
                var args = slice.call(arguments,0),
                    method = args.shift();
                return jqfactory.common[method].apply(this, args);
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
                jqfactory.common._trigger.call(this, 'disable');
                return this;
            },
            enable: function() {
                this.option('disabled', false);
                jqfactory.common._trigger.call(this, 'enable');
                return this;
            },
            destroy: function() {
                jqfactory.common._trigger.call(this, 'destroy');
                this.element.off(this.eventnamespace).removeData(this.fullname);
                jqfactory.common._eventBindings.call(this, $fnProps._events, 'off');
                return this;
            },
            option: function(key, val) {
                if($.isPlainObject(key)) {
                    options = $.extend(true, {}, options, key);
                    jqfactory.common._trigger.call(this, 'setOptions', key);
                    return;
                }
                if($.type(key) === 'string' && !key.length) return;
                var self = this,
                    args = arguments,
                    i = -1,
                    keys = key.split('.'),
                    keyLen = keys.length,
                    options = self.options,
                    currentOptions = options,
                    currentOption,
                    hasVal = val !== undefined;
                if(keyLen === 1 && !hasVal) {
                    return options[key];
                }
                else if(keyLen === 1 && hasVal) {
                    options[key] = val;
                    jqfactory.common._trigger.call(this, 'setOption', { key: key, val: val });
                    return;
                }
                else {
                    while (++i < keyLen) {
                        currentOption = keys[i];
                        if(currentOptions[currentOption]) {
                            if(keyLen - 1 === i) {
                                if(hasVal) {
                                    currentOptions[currentOption] = val;
                                    jqfactory.common._trigger.call(this, 'setOption', { key: key, val: val });
                                    return;
                                }
                            }
                            currentOptions = currentOptions[currentOption];
                        }
                    }
                    return currentOptions;
                }
            },
            _eventBindings: function(pluginEvents, type) {
                var widget = this,
                    widgetElem = widget.element,
                    spacePos = 0,
                    ev,
                    currentCallback,
                    currentEvent,
                    directElemBinding,
                    elem,
                    $elem;
                type = type || 'on';
                for(ev in pluginEvents) {
                    spacePos = ev.lastIndexOf(' ');
                    currentCallback = $.proxy(pluginEvents[ev], widget);
                    directElemBinding = ev.charAt(0) === '!';
                    currentEvent = ev.substring(spacePos + 1) + widget.eventnamespace;
                    if(spacePos === -1) {
                        if(type === 'on') widgetElem[type](currentEvent, currentCallback);
                        else if(type === 'off') widgetElem[type](currentEvent);
                    } else {
                        if(directElemBinding) {
                            elem = ev.substring(1, spacePos);
                            $elem = elem === 'window' ? $(window) : elem === 'document' ? $(document) : $(elem);
                            if(type === 'on') $elem[type](currentEvent, currentCallback);
                            else if(type === 'off') $elem[type](currentEvent);
                        } else {
                            elem = ev.substring(0, spacePos);
                            if(type === 'on') widgetElem[type](currentEvent, elem, currentCallback);
                            else if(type === 'off') widgetElem[type](currentEvent, elem);
                        }
                    }
                }
                return this;
            }
        }
    };
    $.jqfactory = function() {
        jqfactory.create.apply(this, arguments);
    };
    $.jqfactory.common = jqfactory.common;
}));