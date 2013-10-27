/**
 * asEvented v0.4.3 - an event emitter mixin which provides the observer pattern to JavaScript object.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/
(function (name, global, definition) {
  if (typeof module !== 'undefined') {
    module.exports = definition();
  } else if (typeof require !== 'undefined' && typeof define.amd === 'object') {
    define(definition);
  } else {
    global[name] = definition();
  }
})('asEvented', this, function () {
  return (function () {

    var ArrayProto = Array.prototype;
    var nativeIndexOf = ArrayProto.indexOf;
    var slice = ArrayProto.slice;

    function bind(event, fn) {
      var i, part;
      var events = this.events = this.events || {};
      var parts = event.split(/\s+/);
      var num = parts.length;

      for (i = 0; i < num; i++) {
        events[(part = parts[i])] = events[part] || [];
        events[part].push(fn);
      }
      return this;
    }

    function one(event, fn) {
      // [notice] The value of fn and fn1 is not equivalent in the case of the following MSIE.
      // var fn = function fn1 () { alert(fn === fn1) } ie.<9 false
      var fnc = function () {
        fn.apply(this, slice.call(arguments));
        this.unbind(event, fnc);
      };
      this.bind(event, fnc);
      return this;
    }

    function unbind(event, fn) {
      var eventName, i, index, num, parts;
      var events = this.events;

      if (!events) return;

      parts = event.split(/\s+/);
      for (i = 0, num = parts.length; i < num; i++) {
        if ((eventName = parts[i]) in events !== false) {
          index = (fn) ? _indexOf(events[eventName], fn) : 0;
          if (index !== -1) {
            events[eventName].splice(index, 1);
          }
        }
      }
      return this;
    }

    function trigger(event) {
      var args, i;
      var events = this.events;

      if (!events || event in events === false) return;

      args = slice.call(arguments, 1);
      for (i = events[event].length - 1; i >= 0; i--) {
        events[event][i].apply(this, args);
      }
      return this;
    }

    function _indexOf(array, needle) {
      var i, l;

      if (nativeIndexOf && array.indexOf === nativeIndexOf) {
        return array.indexOf(needle);
      }

      for (i = 0, l = array.length; i < l; i++) {
        if (array[i] === needle) {
          return i;
        }
      }
      return -1;
    }

    return function () {
      this.bind = this.on = bind;
      this.unbind = this.off = this.removeListener = unbind;
      this.trigger = this.emit = trigger;
      this.one = this.once = one;

      return this;
    };
  })();
});
