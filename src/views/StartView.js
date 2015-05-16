define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Modifier = require('famous/core/Modifier');
  var FastClick       = require('famous/inputs/FastClick');

  var WINDOW_WIDTH = window.innerWidth;
  var WINDOW_HEIGHT = window.innerHeight;

  var debugBox;

  function StartView() {
    View.apply(this, arguments);

    _createCenterModifier.call(this);
    _createBackground.call(this);
    _createStartButton.call(this);
  }

  StartView.prototype = Object.create(View.prototype);
  StartView.prototype.constructor = StartView;

  StartView.DEFAULT_OPTIONS = {};

  function _createCenterModifier() {
    var centerModifier = new Modifier({
      origin: [0.5, 0.5],
      align : [0.5, 0.5],
    });
    this.mainNode = this.add(centerModifier);
  }

  function _createBackground() {
    var backgroundSurface = new Surface({
      size: [WINDOW_WIDTH, WINDOW_HEIGHT],
      origin: [0, 0],
      align : [0, 0],
      properties: {
        backgroundColor: 'green',
      }
    });

    this.add(backgroundSurface);
  }

  function _createStartButton() {
    var startBtn = new Surface({
      content: 'S T A R T',
      size: [100,true],
      properties: {
        backgroundColor: 'white',
        textAlign: 'center',
        borderRadius: '200px',
        fontWeight: 'bold',
        fontFamily: 'Arial',
        cursor: 'pointer',
      }
    });

    this.mainNode.add(startBtn);

    startBtn.on('click', function() {
      this._eventOutput.emit('startBtnClick');
    });
    startBtn.pipe(this._eventOutput);
  }

  module.exports = StartView;
});
