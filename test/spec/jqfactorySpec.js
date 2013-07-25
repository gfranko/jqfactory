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
    describe('Non-enforced Namespace Plugin', function() {
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
                    },
                    randomOption: true
                },
                randomMethod: function() {}
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
            spyOn(pluginProps, 'randomMethod').andCallThrough();
            spyOn($.jqfactory.common, 'disable').andCallThrough();
            spyOn(events, '_onClickEvent').andCallThrough();
            spyOn(events, '_onBlurEvent').andCallThrough();
            pluginInstance = $('.test').plugin().data('example-plugin');
            spyOn(pluginInstance._super, 'disable').andCallThrough();
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
                    expect(pluginInstance.element).toBe($('.test')[0]);
                });
                it('should create an $element property', function() {
                    expect(pluginInstance.$element).toBeDefined();
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
                beforeEach(function() {
                    pluginInstance._superMethod('disable', { randomArg: true });
                });
                it('should call the corresponding jqfactory method', function() {
                    expect(pluginInstance._super.disable).toHaveBeenCalled();
                });
                it('should pass the correct arguments', function() {
                    expect(pluginInstance._super.disable.mostRecentCall.args[0]).toEqual({ randomArg: true });
                    expect(pluginInstance._super.disable.mostRecentCall.args.length).toBe(1);
                });
            });
            describe('delay', function() {
                it('should call the appropriate method after x seconds', function() {
                    var x = 0,
                        timeout = 50;
                    pluginInstance.delay(pluginInstance.randomMethod, timeout);
                    waitsFor(function() {
                        x += 1;
                        return x === timeout;
                    }, 'The random method should be called', 1000);

                    runs(function() {
                        expect(pluginProps.randomMethod).toHaveBeenCalled();
                    });
                });
            });
            describe('disable', function() {
                beforeEach(function() {
                    pluginInstance.disable();
                });
                it('should set the disabled option to true', function() {
                    expect(pluginInstance.option('disabled')).toBe(true);
                });
                it('should trigger the disable event', function() {
                    expect(pluginProps._events.disable).toHaveBeenCalled();
                });
            });
            describe('enable', function() {
                beforeEach(function() {
                    pluginInstance.enable();
                });
                it('should set the disabled option to true', function() {
                    expect(pluginInstance.option('disabled')).toBe(false);
                });
                it('should trigger the disable event', function() {
                    expect(pluginProps._events.enable).toHaveBeenCalled();
                });
            });
            describe('destroy', function() {
                beforeEach(function() {
                    pluginInstance.destroy();
                });
                it('should remove event handlers', function() {
                    $('.testing').click();
                    $(window).click();
                    pluginInstance._trigger('.testing', 'click', { randomArg: true });
                    pluginInstance._trigger('window', 'click');
                    pluginInstance._trigger('enable');
                    pluginInstance._trigger('disable');
                    pluginInstance._trigger('destroy');
                    expect(events.delegatedEvent).not.toHaveBeenCalled();
                    expect(events.directEvent).not.toHaveBeenCalled();
                    expect(pluginProps._events.enable).not.toHaveBeenCalled();
                    expect(pluginProps._events.disable).not.toHaveBeenCalled();
                    expect(pluginProps._events.destroy).toHaveBeenCalled();
                });
                it('should trigger the destroy event', function() {
                    expect(pluginProps._events.destroy).toHaveBeenCalled();
                });
                it('should remove all jQuery data with the example-plugin key', function() {
                    expect($.isEmptyObject($('.test').data('example-plugin'))).toBe(true);
                });
            });
            describe('option', function() {
                var options, option;
                describe('getOptions', function() {
                    beforeEach(function() {
                        options = pluginInstance.option();
                    });
                    it('should return all current options if no argument are passed', function() {
                        expect(options).toEqual(pluginInstance.options);
                    });
                    it('should trigger a getOptions event', function() {
                        expect(pluginProps._events.getOptions).toHaveBeenCalled();
                    });
                });
                describe('getOption', function() {
                    describe('first-level option', function() {
                        beforeEach(function() {
                            option = pluginInstance.option('person');
                        });
                        it('should return the person option', function() {
                            expect(option).toEqual(pluginInstance.options.person);
                        });
                        it('should trigger a getOption event', function() {
                            expect(pluginProps._events.getOption).toHaveBeenCalled();
                        });
                    });
                    describe('second-level option', function() {
                        beforeEach(function() {
                            option = pluginInstance.option('person.name');
                        });
                        it('should return the person.name option', function() {
                            expect(option).toEqual(pluginInstance.options.person.name);
                        });
                        it('should trigger a getOption event', function() {
                            expect(pluginProps._events.getOption).toHaveBeenCalled();
                        });
                    });
                    describe('third-level option', function() {
                        beforeEach(function() {
                            option = pluginInstance.option('person.name.first');
                        });
                        it('should return the person.name option', function() {
                            expect(option).toEqual(pluginInstance.options.person.name.first);
                        });
                        it('should trigger a getOption event', function() {
                            expect(pluginProps._events.getOption).toHaveBeenCalled();
                        });
                    });
                });
                describe('setOption', function() {
                    describe('first-level option', function() {
                        beforeEach(function() {
                            pluginInstance.option('occupation', 'tennis');
                        });
                        it('should return all current options if no argument are passed', function() {
                            expect(pluginInstance.options.occupation).toEqual('tennis');
                        });
                        it('should trigger a setOption event', function() {
                            expect(pluginProps._events.setOption).toHaveBeenCalled();
                        });
                    });
                    describe('second-level option', function() {
                        beforeEach(function() {
                            pluginInstance.option('person.name', {first: 'Gregory', middle: 'Paul', last: 'Franko'});
                        });
                        it('should return all current options if no argument are passed', function() {
                            expect(pluginInstance.options.person.name).toEqual({first: 'Gregory', middle: 'Paul', last: 'Franko'});
                        });
                        it('should trigger a setOption event', function() {
                            expect(pluginProps._events.setOption).toHaveBeenCalled();
                        });
                    });
                    describe('third-level option', function() {
                        beforeEach(function() {
                            pluginInstance.option('person.name.first', 'Gregory');
                        });
                        it('should return all current options if no argument are passed', function() {
                            expect(pluginInstance.options.person.name.first).toEqual('Gregory');
                        });
                        it('should trigger a setOption event', function() {
                            expect(pluginProps._events.setOption).toHaveBeenCalled();
                        });
                    });
                });
                describe('setOptions', function() {
                    describe('object-form', function() {
                        describe('first-level option', function() {
                            beforeEach(function() {
                                pluginInstance.option({ randomOption: false });
                            });
                            it('should return all current options if no argument are passed', function() {
                                expect(pluginInstance.options.randomOption).toBe(false);
                            });
                            it('should trigger a setOption event', function() {
                                expect(pluginProps._events.setOptions).toHaveBeenCalled();
                            });
                        });
                        describe('second-level option', function() {
                            beforeEach(function() {
                                pluginInstance.option({ person: { name: { first: 'Gregory', middle: 'Paul', last: 'Franko'} }});
                            });
                            it('should return all current options if no argument are passed', function() {
                                expect(pluginInstance.options.person.name).toEqual({first: 'Gregory', middle: 'Paul', last: 'Franko'});
                            });
                            it('should trigger a setOption event', function() {
                                expect(pluginProps._events.setOptions).toHaveBeenCalled();
                            });
                        });
                    });
                    describe('short-form', function() {
                        describe('first and second-level option', function() {
                            beforeEach(function() {
                                pluginInstance.option({ 'randomOption': false, 'person.name': { first: 'Gregory', middle: 'Paul', last: 'Franko'} });
                            });
                            it('should return all current options if no argument are passed', function() {
                                expect(pluginInstance.options.randomOption).toBe(false);
                            });
                            it('should return all current options if no argument are passed', function() {
                                expect(pluginInstance.options.person.name).toEqual({first: 'Gregory', middle: 'Paul', last: 'Franko'});
                            });
                            it('should trigger a setOption event', function() {
                                expect(pluginProps._events.setOptions).toHaveBeenCalled();
                            });
                        });
                    });
                });
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