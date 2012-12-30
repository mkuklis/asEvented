$(function() {
  module("asEvented", {
    setup: function () {},
    teardown: function () {}
  });

  test("bind and trigger", function () {
    var obj = { counter: 0 };
    asEvented.call(obj);
    obj.bind('event', function () { obj.counter += 1; });
    obj.trigger('event');
    equals(obj.counter, 1, 'counter should be incremented.');
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    equals(obj.counter, 5, 'counter should be incremented five times.');
  });

  test("on and trigger", function() {
    var obj = { counter: 0 };
    asEvented.call(obj);
    obj.on('event', function () { obj.counter += 1; });
    obj.trigger('event');
    equals(obj.counter, 1, 'counter should be incremented.');
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    equals(obj.counter, 5, 'counter should be incremented five times.');
  });

  test("bind, unbind, trigger", function () {
    var obj = { counter: 0 };
    asEvented.call(obj);
    var callback = function () { obj.counter += 1; };
    obj.bind('event', callback);
    obj.trigger('event');
    obj.unbind('event');
    obj.trigger('event');
    equals(obj.counter, 1, 'counter should have only been incremented once.');
  });

  test("bind two counters", function () {
    var obj = { counterA: 0, counterB: 0 };
    asEvented.call(obj);
    var callback = function () { obj.counterA += 1; };
    obj.bind('event', callback);
    obj.bind('event', function () { obj.counterB += 1; });
    obj.trigger('event');
    obj.unbind('event', callback);
    obj.trigger('event');
    equals(obj.counterA, 1, 'counterA should have only been incremented once.');
    equals(obj.counterB, 2, 'counterB should have been incremented twice.');
  });

  test("unbind non-existent callback", function () {
    var obj = { counter: 0 };
    asEvented.call(obj);
    var callback = function () { obj.counter +=1 };
    var fakeCallback = function () {};
    obj.bind('event', callback);
    obj.trigger('event');
    equals(obj.counter, 1, 'counter should be incremented.');
    obj.unbind('event', fakeCallback);
    obj.trigger('event');
    equals(obj.counter, 2, 'counter should be incremented twice.');
  });

  test("unbind inside callback", function () {
    var obj = {counter: 0};
    asEvented.call(obj);
    var callback = function () {
      obj.counter += 1;
      obj.unbind('event', callback);
    };
    obj.bind('event', callback);
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    equals(obj.counter, 1, 'the callback should have been unbound.');
  });

  test("unbind multiple counters inside callbacks", function () {

    var obj = { count1: 0, count2: 0, count3: 0 };
    asEvented.call(obj);

    var incr1 = function () { obj.count1 += 1; obj.unbind('event', incr1); };
    var incr2 = function () { obj.count2 += 1; obj.unbind('event', incr2); };
    var incr3 = function () { obj.count3 += 1; obj.unbind('event', incr3); };

    obj.bind('event', incr1);
    obj.bind('event', incr2);
    obj.bind('event', incr3);

    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');

    equals(obj.count1, 1, 'count1 should have only been incremented once.');
    equals(obj.count2, 1, 'count2 should have only been incremented once.');
    equals(obj.count3, 1, 'count3 should have only been incremented once.');

  });

  test("bind same event to multiple objects", function () {
    var obj1 = { count: 0 };
    var obj2 = { count: 0 };
    asEvented.call(obj1);
    asEvented.call(obj2);

    var inc = function (obj) { obj.count += 1; };
    obj1.bind('event', inc);
    obj2.bind('event', inc);

    obj1.trigger('event', obj1);
    obj1.trigger('event', obj1);
    obj2.trigger('event', obj2);

    equals(obj1.count, 2, 'obj1.count should have only been incremented twice.');
    equals(obj2.count, 1, 'obj2.count should only have been incremented once.');
  });

  test("bind same event to multiple objects from the same constructor", function () {
    function A() {
      this.count = 0;
    }

    asEvented.call(A.prototype);

    var obj1 = new A();
    var obj2 = new A();

    var inc = function (obj) { obj.count += 1; };
    obj1.bind('event', inc);
    obj2.bind('event', inc);

    obj1.trigger('event', obj1);
    obj1.trigger('event', obj1);
    obj2.trigger('event', obj2);

    equals(obj1.count, 2, 'obj1.count should have only been incremented twice.');
    equals(obj2.count, 1, 'obj2.count should only have been incremented once.');
  });

  test("one", function () {
    var obj = { count: 0 };
    var callback = function () { obj.count += 1; };

    asEvented.call(obj);
    obj.one('event', callback);

    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');

    equals(obj.count, 1, 'obj.count should only have been incremented once.');

  });

  test("one call passes arguments", function () {
    var obj = { count: 0 };
    var callback = function (arg) { obj.count = arg; };
    asEvented.call(obj);

    obj.one('event', callback);

    obj.trigger('event', 3.14);

    equals(obj.count, 3.14, 'obj.count should be PI.');
  });

  test('bind multiple events to one handler', function() {
    var obj = { count: 0 };
    var callback = function() { obj.count += 1; };
    asEvented.call(obj);

    obj.bind('load ready whatever', callback);

    obj.trigger('load');
    obj.trigger('ready');
    obj.trigger('whatever');

    equals(obj.count, 3, 'obj.count should have been incremented thrice.')
  });

  test('bind multiple events to one handler callable only once', function() {
    var obj = { count: 0 };
    var callback = function() { obj.count += 1; };
    asEvented.call(obj);

    obj.one('load ready whatever', callback);

    obj.trigger('load');
    obj.trigger('ready');
    obj.trigger('whatever');

    equals(obj.count, 1, 'obj.count should have been incremented once.')
  });

  test('bind multiple events and unbind only one', function() {
    var obj = { count: 0 };
    var callback = function() { obj.count += 1; };
    asEvented.call(obj);

    obj.bind('load ready whatever', callback);
    obj.unbind('ready');

    obj.trigger('load');
    obj.trigger('ready');
    obj.trigger('whatever');

    equals(obj.count, 2, 'obj.count should have been incremented twice.')
  });

  test('bind multiple events and unbind all', function() {
    var obj = { count: 0 };
    var callback = function() { obj.count += 1; };
    asEvented.call(obj);

    obj.bind('load ready whatever', callback);
    obj.unbind('ready load whatever');

    obj.trigger('load');
    obj.trigger('ready');
    obj.trigger('whatever');

    equals(obj.count, 0, 'obj.count should have been incremented twice.')
  });

});
