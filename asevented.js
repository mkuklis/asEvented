/**
 * asEvented v0.4.0 - an event emitter mixin which provides the observer pattern to JavaScript object.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/
(function (name, global, definition) {
  if (typeof module !== 'undefined') {
    module.exports = definition();
  } else if (typeof require !== 'undefined' && typeof require.amd === 'object') {
    define(definition);
  } else {
    global[name] = definition();
  }
})('asEvented', this, function () {
  return (function (slice) {
    var nativeIndexOf = Array.prototype.indexOf;

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
      // [notice] The value of fn and fn1 is not equivalent in the case of the following MSIE.
      // var fn = function fn1 () { alert(fn === fn1) } ie.<9 false
      var fnc = function () {
        fn.apply(this, slice.call(arguments));
        this.unbind(event, fnc);
      };
      this.bind(event, fnc);
    }

    function unbind(event, fn) {
      var events = this.events, eventName, i, parts, num, index;

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
    }

    function trigger(event) {
      var events = this.events, i, args;

      if (!events || event in events === false) return;

      args = slice.call(arguments, 1);
      for (i = events[event].length - 1; i >= 0; i--) {
        events[event][i].apply(this, args);
      }
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
      this.unbind = this.off = unbind;
      this.trigger = trigger;
      this.one = one;

      return this;
    };
  })([].slice);
});
