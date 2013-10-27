#asEvented

[![build status](https://secure.travis-ci.org/mkuklis/asEvented.png)](http://travis-ci.org/mkuklis/asEvented)

## Description

asEvented is a micro event emitter which provides the observer pattern to JavaScript object.
It works in the browser and server (node.js). The code follows a functional mixins pattern described by Angus Croll [a-fresh-look-at-javascript-mixins](http://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins).


## Usage

In browser include single JavaScript file:

    <script src="asevented.js"></script>

On server install asEvented via npm first:

    npm install asEvented

and then include it in your project with:

    var asEvented = require('asEvented');


##Example Usage
Define the constructor which will make use of asEvented:

    function Model() {
      this.id = 0;
    }

Add (mixin) asEvented functionality to Model with:

    asEvented.call(Model.prototype);

model has now access to **trigger**, **bind**/**on**, **one** and **unbind**/**off** functions

Add some functions to Model:

    Model.prototype.setId = function (id) {
      this.id = id;
      this.trigger('change:id', id); // Model has now access to trigger
    }

Create a new object and bind to `change:id` event:

    var model = new Model();
    model.bind('change:id', function (id) {
      console.log('id changed to: ' +  id);
    });

Set a few model ids in order to trigger `change:id` event:

    model.setId(1);
    model.setId(2);
    model.setId(3);

A single handler can be bound to multiple events by separating the events by spaces, though it will be ignorant of the triggering event:

    model.bind('change:id change:pass', function() {
      console.log('Event called.');
    });

And multiple events can be unbound in one call:

    model.unbind('onload onready');


##Contributors

* [@mkuklis](http://github.com/mkuklis)
* [@rk](http://github.com/rk)
* [@scarsick](http://github.com/scarsick)
* [@mpdaugherty](http://github.com/mpdaugherty)
* [@zspencer](http://github.com/zspencer)
* [@travishorn](http://github.com/travishorn)
* [@KenPowers](http://github.com/KenPowers)
* [@nazomikan](http://github.com/nazomikan)
* [@whiteinge](http://github.com/whiteinge)
* [@michaelrhodes](http://github.com/michaelrhodes)

##License:
<pre>
(The MIT License)

Copyright (c) 2011 Michal Kuklis

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
</pre>
