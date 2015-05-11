define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Transitionable = require('famous/transitions/Transitionable');
  var Easing = require('famous/transitions/Easing');
  var Modifier = require('famous/core/Modifier');

  var OpeningView = require('views/OpeningView');
  var StartView = require('views/StartView');
  var GameView = require('views/GameView');

  var WINDOW_WIDTH = window.innerWidth;
  var WINDOW_HEIGHT = window.innerHeight;

  var startTransitionable = new Transitionable(1.0);
  var startOpacity = new Transitionable(1.0);

  function AppView() {
    View.apply(this, arguments);

    _createOpeningView.call(this);
    _createStartView.call(this);
    _createGameView.call(this);
    
    _setListeners.call(this);
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {};

  function _setListeners() {
    this.openingView.on('openingDone', this.openingDone.bind(this));
    this.startView.on('startBtnClick', this.startBtnClick.bind(this));
  }

  function _createOpeningView() {
    this.openingView = new OpeningView();

    var menuModifier = new Modifier({
      transform: Transform.behind,
      transform: function() {
        return Transform.translate(WINDOW_WIDTH*(startTransitionable.get()-1), 0, 0);
      },
      opacity: function() {
        return startOpacity.get();
      }
    });

    this.add(menuModifier).add(this.openingView);
  }

  function _createStartView() {
    this.startView = new StartView({
      properties: {
        zIndex: 10,
      }
    });

    var menuModifier = new Modifier({
      transform: function() {
        return Transform.translate(WINDOW_WIDTH*startTransitionable.get(), 0, 0);
      },
      opacity: function() {
        return startOpacity.get();
      }
    });

    this.add(menuModifier).add(this.startView);
  }

  function _createGameView() {
    this.gameView = new GameView();

    this.gameModifier = new Modifier({
      transform: function() {
        return Transform.translate(WINDOW_WIDTH,0,0);
      },
      opacity: function() {
        return (1.0-startOpacity.get());
      }
    });

    this
    .add(this.gameModifier)
    .add(this.gameView);
  }

  AppView.prototype.openingDone = function() {
    startTransitionable.set(0.0, {
      duration: 1500
    });
  };

  AppView.prototype.startBtnClick = function() {
    this.gameModifier.setTransform(
      Transform.translate(0, 0, 0)
    );
    startOpacity.set(0.0, {
      duration: 500
    });
  };

  module.exports = AppView;
});
