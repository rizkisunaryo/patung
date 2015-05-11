define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');

  var WINDOW_WIDTH = window.innerWidth;
  var WINDOW_HEIGHT = window.innerHeight;

  function GameView() {
    View.apply(this, arguments);

    _createBackground.call(this);
    _test.call(this);
  }

  GameView.prototype = Object.create(View.prototype);
  GameView.prototype.constructor = GameView;

  GameView.DEFAULT_OPTIONS = {};

  function _createBackground() {
    var backgroundSurface = new Surface({
      size: [WINDOW_WIDTH, WINDOW_HEIGHT],
      origin: [0, 0],
      align : [0, 0],
      properties: {
        backgroundColor: 'blue',
      }
    });

    this.add(backgroundSurface);
  }

  function _test() {
  	var surface = new Surface({
  		content: 'TEST',
  	});

  	this.add(surface);
  }

  module.exports = GameView;
});