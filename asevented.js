/**
 * asEvented - an event emitter mixin which provides the observer pattern to JavaScript object.
 * 
 * - supports browser and server
 * - based on a new approach to mixins
 *
 */
 
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
    var events = {};
    this.bind = bind.bind({ events: events });
    this.unbind = unbind.bind({ events: events });
    this.trigger = trigger.bind({ events: events });
    return this;
  };
})();

// add support for server side
if ('undefined' !== typeof module && module.exports) {
  module.exports = asEvented;
}
