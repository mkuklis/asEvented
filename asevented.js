/**
 * asEvented - an event emitter mixin which provides the observer pattern to JavaScript object.
 * 
 * - supports browser and server
 * - based on a new approach to mixins
 *
 */
 
var asEvented = (function () {

  var events = {};
 
  function bind(event, fn) {
    events[event] = events[event] || [];
    events[event].push(fn);
  }

  function unbind(event, fn) {
    if (event in events === false) return;
    events[event].splice(events[event].indexOf(fn), 1);
  }

  function trigger(event) {
    if (event in events === false) return;
    for (var i = events[event].length - 1; i >= 0; i--) {
      events[event][i].apply(this, [].slice.call(arguments, 1));
    }
  }

  return function () {
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
