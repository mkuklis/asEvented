/**
 * asEvented v0.2 - an event emitter mixin which provides the observer pattern to JavaScript object.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/

var asEvented = (function () {

  function bind(event, fn) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(fn);
  }

  function unbind(event, fn) {
    if (event in this.events === false) return;
    this.events[event].splice(this.events[event].indexOf(fn), 1);
  }

  function trigger(event) {
    if (event in this.events === false) return;
    for (var i = this.events[event].length - 1; i >= 0; i--) {
      this.events[event][i].apply(this, [].slice.call(arguments, 1));
    }
  }

  return function () {

    this.events = {};
    this.bind = bind;
    this.unbind = unbind;
    this.trigger = trigger;

    return this;
  };
})();

// add support for server side
if ('undefined' !== typeof module && module.exports) {
  module.exports = asEvented;
}
