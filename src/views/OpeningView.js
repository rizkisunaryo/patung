define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var Modifier = require('famous/core/Modifier');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Easing = require('famous/transitions/Easing');
  var Transitionable = require('famous/transitions/Transitionable');

  var centerModifier;
  var initialRotationXModifier;
  var initialRotationYModifier;
  var initialRotationZModifier;
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
    centerModifier = new Modifier({
      origin: [0.5, 0.5],
      align : [0.5, 0.5],
    });

  	initialRotationXModifier = new Modifier({});
    initialRotationYModifier = new Modifier({});
    initialRotationZModifier = new Modifier({});

  	this.mainNode = this.add(centerModifier).add(initialRotationXModifier).add(initialRotationYModifier).add(initialRotationZModifier);
  }

  function _initialAnimations() {
  	initialResizeTransitionable.set(1, {
	    duration: 2500
		});

  	initialRotationXModifier.transformFrom(rotateX);
    initialRotationYModifier.transformFrom(rotateY);
    initialRotationZModifier.transformFrom(rotateZ);

    var angleX = 0;
    var angleY = 0;
		var angleZ = 0;
		var angleAdd = Math.PI/40;
		var limit = Math.PI*4;

    function rotateX() {
        angleX += angleAdd;
        if (angleX<=limit)
          return Transform.rotateX(angleX);
    }
    function rotateY() {
        angleY += angleAdd;
        if (angleY<=limit)
          return Transform.rotateY(angleY);
    }
		function rotateZ() {
		    angleZ += angleAdd;
		    if (angleZ<=limit)
		    	return Transform.rotateZ(angleZ);
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
      transform: Transform.behind,
	    transform: function() {
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
      	textAlign: 'center',
        fontSize: '1.5em',
        fontFamily: 'Arial',
        fontWeight: 'bold'
      }
    });

    var iconModifier = new Modifier({
	    size : [200,200],
	    transform: function() {
        var scale = initialResizeTransitionable.get();
        return Transform.scale(scale, scale);
	    }
		});

    var translator = new Modifier({
      transform: function() {
        return Transform.translate(0,0,27);
      }
    });

    this.mainNode.add(iconModifier)
    .add(translator)
    .add(iconSurface);
  }

  module.exports = OpeningView;
});
