define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var Modifier = require('famous/core/Modifier');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Easing = require('famous/transitions/Easing');
  var Transitionable = require('famous/transitions/Transitionable');

  var initialRotationModifier;
  var initialResizeTransitionable = new Transitionable(0);

  function OpeningView() {
    View.apply(this, arguments);

    _prepareInitialAnimations.call(this);
    _createBackground.call(this);
    _createOpeningText.call(this);
    _initialAnimations.call(this);
  }

  OpeningView.prototype = Object.create(View.prototype);
  OpeningView.prototype.constructor = OpeningView;

  OpeningView.DEFAULT_OPTIONS = {};

  function _prepareInitialAnimations() {
  	initialRotationModifier = new Modifier({
		  origin: [0.5, 0.5],
		  align : [0.5, 0.5],
		});

  	this.mainNode = this.add(initialRotationModifier);
  }

  function _initialAnimations() {
  	initialResizeTransitionable.set(1, {
	    duration: 1000
		});

  	initialRotationModifier.transformFrom(rotate);

		var angle = 0;
		var angleAdd = Math.PI/10;
		var limit = Math.PI*6;
		function rotate() {
		    angle += angleAdd;
		    if (angle<=limit)
		    	return Transform.rotateZ(angle);
		}
  }

  function _createBackground() {
    var backgroundSurface = new Surface({
      properties: {
        backgroundColor: 'yellow',
        boxShadow: '0 0 1px yellow'
      }
    });

    var backgroundModifier = new Modifier({
	    size: [window.innerWidth, window.innerHeight],
	    transform: function() {
        // cache the value of transitionable.get()
        // to optimize for performance
        var scale = initialResizeTransitionable.get();
        return Transform.scale(scale, scale, 1);
	    }
		});

    this.mainNode.add(backgroundModifier).add(backgroundSurface);
  }

  function _createOpeningText() {
    var iconSurface = new Surface({
      content : 'Cepat Berhitung',
      pointerEvents : 'none',
      properties : {
      	zIndex: 2,
      	lineHeight: '200px',
      	textAlign: 'center'
      }
    });

    var iconModifier = new Modifier({
	    size : [200,200],
	    transform: function() {
        // cache the value of transitionable.get()
        // to optimize for performance
        var scale = initialResizeTransitionable.get();
        return Transform.scale(scale, scale, 1);
	    }
		});

    this.mainNode.add(iconModifier).add(iconSurface);
  }

  module.exports = OpeningView;
});
