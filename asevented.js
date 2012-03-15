/**
 * asEvented v0.2.1 - an event emitter mixin which provides the observer pattern to JavaScript object.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/

var asEvented = (function () {

  function bind(event, fn) {
    var events = this.events = this.events || {};
    events[event] = events[event] || [];
    events[event].push(fn);
  }

  function one(event, fn) {
    var fnc = function () {
      fn.call(this);
      this.unbind(event, fnc);
    }

    this.bind(event, fnc);
  }

  function unbind(event, fn) {
    var events = this.events;

    if (!events || event in events === false) return;
    events[event].splice(events[event].indexOf(fn), 1);
  }

  function trigger(event) {
    var events = this.events;

    if (!events || event in events === false) return;
    for (var i = events[event].length - 1; i >= 0; i--) {
      events[event][i].apply(this, [].slice.call(arguments, 1));
    }
  }

  return function () {
    this.bind = bind;
    this.unbind = unbind;
    this.trigger = trigger;
    this.one = one;

    return this;
  };
})();

// add support for server side
if ('undefined' !== typeof module && module.exports) {
  module.exports = asEvented;
}
