var asEvented = require('asEvented');

function Model() {
  this.id = 0;
}

Model.prototype.setId = function (id) {
  this.id = id;
  this.trigger('change:id', id);
}

// mixin asEvented with Model
asEvented.call(Model.prototype);

var m = new Model();

m.bind('change:id', function (id) {
  console.log('id changed to: ' + id);
});

m.setId(1);
m.setId(2);
m.setId(3);
m.setId(4);
