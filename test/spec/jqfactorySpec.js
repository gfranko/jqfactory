describe('jqfactory Test Suite', function () {
    var pluginProps = {}, pluginInstance = {}, events = {
        delegatedEvent: function(){},
        directEvent: function(){},
        destroyEvent: function(){},
        getOptionEvent: function(){},
        getOptionsEvent: function(){},
        setOptionEvent: function(){},
        setOptionsEvent: function(){},
        disableEvent: function(){},
        enableEvent: function(){},
        _onClickEvent: function(){},
        _onBlurEvent: function(){}
    };
    beforeEach(function() {
        setFixtures('<div class="test"><span class="testing"></span></div>');
        $.jqfactory('example.plugin', {
            _create: function(){},
            _init: function(){},
            _render: function(){},
            _events: {
                '.testing click': function() { events.delegatedEvent.apply(arguments); },
                '!window click': function() { events.directEvent.apply(arguments); },
                'destroy': function() { events.destroyEvent.apply(arguments); },
                'getOption': function() { events.getOptionEvent.apply(arguments); },
                'getOptions': function() { events.getOptionsEvent.apply(arguments); },
                'setOption': function() { events.setOptionEvent.apply(arguments); },
                'setOptions': function() { events.setOptionsEvent.apply(arguments); },
                'disable': function() { events.disableEvent.apply(arguments); },
                'enable': function() { events.enableEvent.apply(arguments); }
            },
            _postevents: function(){},
            options: {
                person: {
                    name: {
                        first: 'Greg',
                        middle: 'Paul',
                        last: 'Franko'
                    },
                    occupation: 'JavaScript Engineer',
                    hobbies: 'golf'
                }
            }
        });
        pluginProps = $.example.plugin;
        spyOn(pluginProps, '_create').andCallThrough();
        spyOn(pluginProps, '_init').andCallThrough();
        spyOn(pluginProps, '_render').andCallThrough();
        spyOn(pluginProps, '_postevents').andCallThrough();
        spyOn(events, 'delegatedEvent').andCallThrough();
        spyOn(events, 'directEvent').andCallThrough();
        spyOn(pluginProps._events, 'destroy').andCallThrough();
        spyOn(pluginProps._events, 'getOption').andCallThrough();
        spyOn(pluginProps._events, 'getOptions').andCallThrough();
        spyOn(pluginProps._events, 'setOption').andCallThrough();
        spyOn(pluginProps._events, 'setOptions').andCallThrough();
        spyOn(pluginProps._events, 'disable').andCallThrough();
        spyOn(pluginProps._events, 'enable').andCallThrough();
        spyOn($.jqfactory.common, 'disable').andCallThrough();
        spyOn(events, '_onClickEvent').andCallThrough();
        spyOn(events, '_onBlurEvent').andCallThrough();
    });
    describe('Non-enforced Namespace Plugin', function() {
        beforeEach(function() {
            pluginInstance = $('.test').plugin().data('example-plugin');
        });
        describe("initialization", function() {
            describe('methods', function() {
                it('should call the _create method', function() {
                    expect(pluginProps._create).toHaveBeenCalled();
                });
                it('should not call the _init method', function() {
                    expect(pluginProps._init).not.toHaveBeenCalled();
                });
                it('should call the _init method on re-initialization', function() {
                    $('.test').plugin();
                    expect(pluginProps._init).toHaveBeenCalled();
                });
                it('should call the _render method', function() {
                    expect(pluginProps._render).toHaveBeenCalled();
                });
                it('should call the _postevents method', function() {
                    expect(pluginProps._postevents).toHaveBeenCalled();
                });
            });
            describe('properties', function() {
                it('should create an options property', function() {
                    expect(pluginInstance.options).toBeDefined();
                    expect($.isEmptyObject(pluginInstance.options)).toBe(false);
                    expect($.isPlainObject(pluginInstance.options)).toBe(true);
                });
                it('should create a _super property', function() {
                    expect(pluginInstance._super).toBeDefined();
                    expect($.isPlainObject(pluginInstance._super)).toBe(true);
                    expect(pluginInstance._super).toEqual($.jqfactory.common);
                });
                it('should create a callingElement property', function() {
                    expect(pluginInstance.callingElement).toBeDefined();
                });
                it('should create a $callingElement property', function() {
                    expect(pluginInstance.$callingElement).toBeDefined();
                    expect(pluginInstance.$callingElement).toBe($('.test'));
                });
                it('should create an element property', function() {
                    expect(pluginInstance.element).toBeDefined();
                    expect(pluginInstance.$element).toBe($('.test'));
                });
                it('should create a namespace property', function() {
                    expect(pluginInstance.namespace).toBeDefined();
                    expect(pluginInstance.namespace).toBe('example');
                });
                it('should create a basename property', function() {
                    expect(pluginInstance.basename).toBeDefined();
                    expect(pluginInstance.basename).toBe('plugin');
                });
                it('should create a fullname property', function() {
                    expect(pluginInstance.fullname).toBeDefined();
                    expect(pluginInstance.fullname).toBe('example-plugin');
                });
                it('should create an eventnamespace property', function() {
                    expect(pluginInstance.eventnamespace).toBeDefined();
                    expect(pluginInstance.eventnamespace).toBe('.example-plugin');
                });
            });
            describe('jQuery', function() {
                it('should create a jQuery pseudo selector', function() {
                    expect($.expr[":"]['example-plugin']).toBeDefined();
                    expect($(':example-plugin').length).toBe(1);
                });
                it('should save the plugin instance in the jQuery data method', function() {
                    expect($('.test').data('example-plugin')).toBeDefined();
                    expect($('.test').data('example-plugin')).toEqual(pluginInstance);
                });
            });
        });
        describe('API methods', function() {
            describe('_on', function() {
                it('should work for multiple event handlers', function() {
                    pluginInstance._on({
                        'click': function() {
                            events._onClickEvent();
                        },
                        '.testing blur': function() {
                            events._onBlurEvent();
                        }
                    });
                    $('.test').click();
                    $('.testing').blur();
                    expect(events._onClickEvent).toHaveBeenCalled();
                    expect(events._onBlurEvent).toHaveBeenCalled();
                });
                it('should work for single event handler', function() {
                    pluginInstance._on('click', function() {
                            events._onClickEvent();
                    });
                    pluginInstance._on('.testing blur', function() {
                            events._onBlurEvent();
                    });
                    $('.test').click();
                    $('.testing').blur();
                    expect(events._onClickEvent).toHaveBeenCalled();
                    expect(events._onBlurEvent).toHaveBeenCalled();
                });
            });
            describe('_off', function() {
                it('should work for multiple event handlers', function() {
                    pluginInstance._off(['.testing click', '!window click']);
                    $('.testing').click();
                    $(window).click();
                    expect(events.delegatedEvent).not.toHaveBeenCalled();
                    expect(events.directEvent).not.toHaveBeenCalled();
                });
                it('should work for single event handler', function() {
                    pluginInstance._off('.testing click');
                    pluginInstance._off('!window click');
                    $('.testing').click();
                    $(window).click();
                    expect(events.delegatedEvent).not.toHaveBeenCalled();
                    expect(events.directEvent).not.toHaveBeenCalled();
                });
            });
            describe('_trigger', function() {
                it('should work for triggering events on the widget element', function() {
                    pluginInstance._trigger('enable', { randomArg: true });
                    pluginInstance._trigger('disable');
                    expect(pluginProps._events.enable).toHaveBeenCalled();
                    expect(pluginProps._events.disable).toHaveBeenCalled();
                    expect(pluginProps._events.enable.mostRecentCall.args.length).toBe(2);
                    expect(pluginProps._events.enable.mostRecentCall.args[1]).toEqual({ randomArg: true });
                    expect(pluginProps._events.disable.mostRecentCall.args.length).toBe(1);
                });
                it('should work for triggering events on any element using a string selector', function() {
                    pluginInstance._trigger('.testing', 'click', { randomArg: true });
                    pluginInstance._trigger('window', 'click');
                    expect(events.delegatedEvent).toHaveBeenCalled();
                    expect(events.directEvent).toHaveBeenCalled();
                });
            });
            describe('_superMethod', function() {
                it('should call the corresponding jqfactory method', function() {
                    pluginInstance._superMethod('disable', { randomArg: true });
                    expect($.jqfactory.common.disable).toHaveBeenCalled();
                    expect($.jqfactory.common.disable.mostRecentCall.args[0]).toEqual({ randomArg: true });
                    expect($.jqfactory.common.disable.mostRecentCall.args.length).toBe(1);
                });
            });
            describe('delay', function() {

            });
        });
        describe('Delegated DOM Event Handlers', function() {
            it('should trigger a delegated click handler', function() {
                $('.testing').click();
                expect(events.delegatedEvent).toHaveBeenCalled();
            });
        });
        describe('Direct DOM Event Handlers', function() {
            it('should trigger a direct click handler', function() {
                $(window).click();
                expect(events.directEvent).toHaveBeenCalled();
            });
        });
    });
});