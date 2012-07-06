/**
 * asEvented v0.3.3 - an event emitter mixin which provides the observer pattern to JavaScript object.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/

var asEvented = (function (slice) {

  function bind(event, fn) {
    var events = this.events = this.events || {},
        parts = event.split(/\s+/),
        i = 0,
        num = parts.length,
        part;

    for (; i < num; i++) {
      events[(part = parts[i])] = events[part] || [];
      events[part].push(fn);
    }
  }

  function one(event, fn) {
    this.bind(event, function fnc() {
      fn.apply(this, slice.call(arguments));
      this.unbind(event, fnc);
    });
  }

  function unbind(event, fn) {
    var events = this.events, eventName, i, parts, num;

    if (!events) return;

    parts = event.split(/\s+/);
    for (i = 0, num = parts.length; i < num; i++) {
      if ((eventName = parts[i]) in events !== false) {
        events[eventName].splice(events[eventName].indexOf(fn), 1);
      }
    }
  }

  function trigger(event) {
    var events = this.events, i, args;

    if (!events || event in events === false) return;

    args = slice.call(arguments, 1);
    for (i = events[event].length - 1; i >= 0; i--) {
      events[event][i].apply(this, args);
    }
  }

  return function () {
    this.bind = this.on = bind;
    this.unbind = this.off = unbind;
    this.trigger = trigger;
    this.one = one;

    return this;
  };
})([].slice);

// add support for server side
if ('undefined' !== typeof module && module.exports) {
  module.exports = asEvented;
}
