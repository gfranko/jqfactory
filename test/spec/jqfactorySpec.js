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
                '.testing click': function() { events.delegatedEvent(); },
                '!window click': function() { events.directEvent(); },
                'destroy': function() { events.destroyEvent(); },
                'getOption': function() { events.getOptionEvent(); },
                'getOptions': function() { events.getOptionsEvent(); },
                'setOption': function() { events.setOptionEvent(); },
                'setOptions': function() { events.setOptionsEvent(); },
                'disable': function() { events.disableEvent(); },
                'enable': function() { events.enableEvent(); }
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
        spyOn(events, 'destroyEvent').andCallThrough();
        spyOn(events, 'getOptionEvent').andCallThrough();
        spyOn(events, 'getOptionsEvent').andCallThrough();
        spyOn(events, 'setOptionEvent').andCallThrough();
        spyOn(events, 'setOptionsEvent').andCallThrough();
        spyOn(events, 'disableEvent').andCallThrough();
        spyOn(events, 'enableEvent').andCallThrough();
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
                it('multiple handlers', function() {
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
                it('single handler', function() {
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