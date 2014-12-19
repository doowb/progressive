/*!
 * progressive <https://github.com/doowb/progressive>
 *
 * Copyright (c) 2014 Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var ansi = require('ansi');
var cursor = ansi(process.stdout);

var chalk = require('chalk');
var Template = require('template');
var repeat = require('repeat-string');
var extend = require('extend-shallow');

module.exports = Progressive;

/**
 * Create a new instance of a progress bar with the given options.
 *
 * ```js
 * var bar = new Progressive();
 * ```
 *
 * @param {Object} `options` Configuration options for the progress bar.
 * @api public
 */

function Progressive (options) {
  this.options = options || {};
  this.template = new Template();
  this.template.option(this.options);
  this.template.create('bar', { isRenderable: true }, function (args, options) {
    var name = args[0];
    var str = args[1];
    var o = {};
    o[name] = { path: name + '.tmpl', content: str };
    return o;
  });
  this.template.bar('default', this.options.template);
  this.template.helper('status', function () {
    var app = this.app;
    var options = this.options;
    var context = this.context;

    var str = chalk.green(repeat('#', context.current));
    str += chalk.yellow(repeat('-', context.total - context.current));

    return '[' + str + ']';
  });

  this.total = this.options.total || 10;
  this.current = this.options.start || 0;
  this.inc = this.options.inc || 1;
  this.delta = cursor.newlines;
}

/**
 * Update the progress bar passing in an increment and/or local data.
 *
 * ```js
 * bar.update(2, { foo: 'bar' });
 * ```
 *
 * @param  {Object} `inc` Integer to increment the progress bar by.
 * @param  {Object} `locals` Additional data to pass to the progress bar template
 * @api public
 */

Progressive.prototype.update = function (inc, locals) {
  if (typeof inc === 'object') {
    locals = inc;
    inc = null;
  }
  locals = extend({}, locals);
  locals.inc = inc || locals.inc || this.inc;
  locals.current = locals.current || (this.current = this.current + locals.inc);
  locals.total = this.total;
  var self = this;
  this.template.render('default', locals, function (err, content) {
    if (err) return console.log(err);
    var delta = cursor.newlines - self.delta;
    if (delta > 0) {
      cursor.up(delta);
      self.delta = cursor.newlines;
    }
    cursor.horizontalAbsolute(0)
      .eraseLine(2)
      .write(content)
      .write('\n');
  });

};

