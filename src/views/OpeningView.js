define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var ImageSurface  = require('famous/surfaces/ImageSurface');
  var ContainerSurface  = require('famous/surfaces/ContainerSurface');
  var Transform     = require('famous/core/Transform');
  var Modifier = require('famous/core/Modifier');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Easing = require('famous/transitions/Easing');
  var Transitionable = require('famous/transitions/Transitionable');
  var Timer         = require('famous/utilities/Timer');

  var centerModifier;
  var initialRotationXModifier;
  var initialRotationYModifier;
  var initialRotationZModifier;
  var initialResizeTransitionable = new Transitionable(0);

  var WINDOW_WIDTH = window.innerWidth;
  var WINDOW_HEIGHT = window.innerHeight;
  var translateAnimationDuration = 500;
  var rotationAnimationTime = 500;
  var patungTextDelay = rotationAnimationTime + 500;
  var poweredByStartDelay = patungTextDelay + translateAnimationDuration + 500;
  var poweredByDuration = 3000;
  var leftIconDelay = poweredByStartDelay + poweredByDuration - 2000;
  var rightIconDelay = leftIconDelay + translateAnimationDuration + 500;
  var bottomIconDelay = rightIconDelay + translateAnimationDuration + 500;
  var openingDoneDelay = bottomIconDelay + translateAnimationDuration + 500;

  function OpeningView() {
    View.apply(this, arguments);

    _prepareInitialAnimations.call(this);
    _createBackground.call(this);
    _createTitleText.call(this);
    _initialAnimations.call(this);

    _createPoweredByText.call(this);
    _createLeftIcon.call(this);
    _createRightIcon.call(this);
    _createBottomIcon.call(this);

    _setListeners.call(this);
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
	    duration: rotationAnimationTime
		});

  	initialRotationXModifier.transformFrom(rotateX);
    initialRotationYModifier.transformFrom(rotateY);
    initialRotationZModifier.transformFrom(rotateZ);

    var angleX = 0;
    var angleY = 0;
		var angleZ = 0;
		var angleAdd = Math.PI/30;
		var limit = Math.PI*2;

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
      }
    });

    var backgroundModifier = new Modifier({
	    size: [WINDOW_WIDTH, WINDOW_HEIGHT],
      transform: Transform.behind,
	    transform: function() {
        var scale = initialResizeTransitionable.get();
        return Transform.scale(scale, scale, scale);
	    }
		});

    this.mainNode.add(backgroundModifier).add(backgroundSurface);
  }

  function _createTitleText() {
    var textSurface = new Surface({
      size : [200,200],
      content : 'Cepat Berhitung',
      pointerEvents : 'none',
      properties : {
        top: (-WINDOW_HEIGHT/2.0)+'px',
      	textAlign: 'center',
        fontSize: '21px',
        fontFamily: 'Arial',
      }
    });

    var textModifier = new Modifier({
	    size : [200,200],
      origin: [0.5, 0.5],
      align : [0.5, 0.5],
		});

    this
    .add(textModifier)
    .add(textSurface);

    Timer.setTimeout(function(translateAnimationDuration) {
      textModifier.setTransform(
        Transform.translate(0, WINDOW_HEIGHT/2.0, 0),
        { duration : translateAnimationDuration, curve: Easing.outBounce }
      );
    }.bind(this, translateAnimationDuration), patungTextDelay);
  }

  function _createPoweredByText() {
    var textSurface = new Surface({
      content : 'Powered by:',
      pointerEvents : 'none',
      properties : {
        zIndex: 2,
        textAlign: 'center',
        fontFamily: 'Arial',
        fontWeight: 'bold',
      }
    });

    var transitionable = new Transitionable(0);

    var textModifier = new Modifier({
      size : [130,130],
      origin: [0.5, 0.5],
      align : [0.5, 0.5],
      opacity: function() {
        return transitionable.get();
      }
    });

    this.add(textModifier)
    .add(textSurface);

    Timer.setTimeout(function(poweredByDuration) {
      transitionable.set(1, {
        duration: poweredByDuration, curve: Easing.outBack
      });
    }.bind(this,poweredByDuration), poweredByStartDelay);
  }

  function _createLeftIcon() {
    var iconSurface = new ImageSurface({
      size: [100, 100],
      content : 'img/requirejs.png',
      properties : {
        top: '10px',
        left: ((-WINDOW_WIDTH/2.0)-60)+'px'
      }
    });

    var iconModifier = new StateModifier({
      origin: [0.5, 0.5],
      align : [0.5, 0.5]
    });

    this.add(iconModifier).add(iconSurface);

    Timer.setTimeout(function(translateAnimationDuration) {
      iconModifier.setTransform(
        Transform.translate(WINDOW_WIDTH/2.0+20, 0, 0),
        { duration : translateAnimationDuration, curve: Easing.outBounce }
      );
    }.bind(this, translateAnimationDuration), leftIconDelay);
  }

  function _createRightIcon() {
    var iconSurface = new ImageSurface({
      size: [75, 100],
      content : 'img/famous.png',
      properties : {
        top: '10px',
        left: ((WINDOW_WIDTH/2.0)+60)+'px'
      }
    });

    var iconModifier = new StateModifier({
      origin: [0.5, 0.5],
      align : [0.5, 0.5]
    });

    this.add(iconModifier).add(iconSurface);

    Timer.setTimeout(function(translateAnimationDuration) {
      iconModifier.setTransform(
        Transform.translate(-WINDOW_WIDTH/2.0, 0, 0),
        { duration : translateAnimationDuration, curve: Easing.outBounce }
      );
    }.bind(this, translateAnimationDuration), rightIconDelay);
  }

  function _createBottomIcon() {
    var iconSurface = new ImageSurface({
      size: [250, 74],
      content : 'img/cordova.png',
      properties : {
        left: '10px',
        top: (WINDOW_HEIGHT/2.0+37)+'px',
      }
    });

    var iconModifier = new StateModifier({
      origin: [0.5, 0.5],
      align : [0.5, 0.5]
    });

    this
    .add(iconModifier)
    .add(iconSurface);

    Timer.setTimeout(function(translateAnimationDuration) {
      iconModifier.setTransform(
        Transform.translate(0, -(WINDOW_HEIGHT/2.0-(105-37)), 0),
        { duration : translateAnimationDuration, curve: Easing.outBounce }
      );
    }.bind(this, translateAnimationDuration), bottomIconDelay);
  }

  function _setListeners() {
    Timer.setTimeout(function() {
      this._eventOutput.emit('openingDone');
    }.bind(this), openingDoneDelay);
  }

  module.exports = OpeningView;
});
