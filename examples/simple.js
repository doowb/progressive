'use strict';

// get Progressive library
var Progressive = require('../');

// setup some options
var options = {

  // template using the built in `status` helper and a custom piece of data
  template: 'Downloading <%= status() %> <%= percentage %>',

  // 40 units
  total: 40
}

// create a new instance
var bar = new Progressive(options);

// make up some locals to pass in (these are custom data)
var locals = {
  percentage: '0%'
};

// do some logic in a loop to keep writing stuff out
var count = 0;
var timer = setInterval(function () {

  // default to incrementing by 1
  var inc = 1;

  // if we've hit the limit, stop the timer so the program stops
  if (count++ >= 39) {
    clearInterval(timer);
  }

  // to make it more interesting increase the count by 5 sometimes
  if (count % 10 === 0) {
    count += 5;
    inc = 5;
  }

  // smooth out our percentage calculation
  if (count > 40) count = 40;

  // calculate the current percentage done (this might move internally)
  locals.percentage = Math.round((count / options.total) * 100) + '%';

  // update the progress bar with the increment amount and the local data
  bar.update(inc, locals);

}, 300);
