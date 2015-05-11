define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');

  var OpeningView = require('views/OpeningView');
  var StartView = require('views/StartView');

  function AppView() {
    View.apply(this, arguments);

    _createOpeningView.call(this);

    
    this.openingView.on('openingDone', this.openingDone.bind(this));
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {};

  function _createOpeningView() {
    this.openingView = new OpeningView();

    var menuModifier = new StateModifier({
      transform: Transform.behind
    });

    this.add(menuModifier).add(this.openingView);
  }

  AppView.prototype.openingDone = function() {
    console.log('openingDone');
  };

  module.exports = AppView;
});
