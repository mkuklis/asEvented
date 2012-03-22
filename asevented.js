/**
 * asEvented v0.3 - an event emitter mixin which provides the observer pattern to JavaScript object.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/

var asEvented = (function () {
  
  var SLICE = [].slice;

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
      fn.apply(this, SLICE.call(arguments));
      this.unbind(event, fnc);
    });
    
  }

  function unbind(event, fn) {
    var events = this.events, eventName;

    if (!events) return;

    var parts = event.split(/\s+/);
    for (var i = 0, num = parts.length; i < num; i++) {
      if ((eventName = parts[i]) in events !== false) {
        events[eventName].splice(events[eventName].indexOf(fn), 1);
      }
    }
  }

  function trigger(event) {
    var events = this.events, i;

    if (!events || event in events === false) return;
    for (i = (event = events[event]).length - 1; i >= 0; i--) {
      event[i].apply(this, SLICE.call(arguments, 1));
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
