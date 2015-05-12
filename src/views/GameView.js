define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Modifier = require('famous/core/Modifier');
  var ContainerSurface  = require('famous/surfaces/ContainerSurface');
  var Transitionable = require('famous/transitions/Transitionable');
  var Easing = require('famous/transitions/Easing');
  var Timer         = require('famous/utilities/Timer');
  var FastClick       = require('famous/inputs/FastClick');

  var WINDOW_WIDTH = window.innerWidth;
  var WINDOW_HEIGHT = window.innerHeight;
  var bubbleSize = 50;
  var translateAnimationDuration = 500;
  var timerTime = 2000;

  var centerModifier;
  var number1Modifier;
  var operatorModifier;
  var number2Modifier;
  var resultModifier;

  var timerTransitionable = new Transitionable(0.0);
  var operatorTransitionable = new Transitionable(0.0);

  function GameView() {
    View.apply(this, arguments);

    _createCenterModifier.call(this);

    _createLogic.call(this);

    _createBackground.call(this);
    _createNumber1.call(this);
    _createOperator.call(this);
    _createNumber2.call(this);
    _createEqualSign.call(this);
    _createResult.call(this);

    _createTimer.call(this);
    _createScoreText.call(this);
    _createTrueBtn.call(this);
    _createFalseBtn.call(this);

    _setListeners.call(this);
  }

  GameView.prototype = Object.create(View.prototype);
  GameView.prototype.constructor = GameView;

  GameView.DEFAULT_OPTIONS = {};

  function _createCenterModifier() {
    centerModifier = new Modifier({
      origin: [0.5, 0.5],
      align : [0.5, 0.5],
    });
    this.mainNode = this.add(centerModifier);
  }

  var score = 0;
  var isCorrect = 0;
  var number1 = 11;
  var number2 = 11;
  var operator = 0;
  var operatorString='';
  var result = 0.0;
  function _createLogic() {
    isCorrect = Math.floor(Math.random() * 2);

    number1 = Math.floor((Math.random()*20) + 11);
    number2 = Math.floor((Math.random()*20) + 11);

    operator = Math.floor(Math.random()*4);

    result = getResult(number1,number2,operator);
    operatorString = getOperatorString(operator);
  }

  function getResult(pNumber1,pNumber2,pOperator) {
    if (pOperator==0) {
      result = pNumber1 + pNumber2;
    }
    else if (pOperator==1) {
      result = pNumber1 - pNumber2;
    }
    else if (pOperator==2) {
      result = pNumber1 * pNumber2;
    }
    else {
      result = pNumber1 / pNumber2 * 1.0;
      result = result==Math.floor(result)? result.toFixed(0) : result.toFixed(2);
    }

    if (isCorrect==0) result+=10;

    return result;
  }

  function getOperatorString(pOperator) {
    if (pOperator==0) {
      return '+';
    }
    else if (pOperator==1) {
      return '-';
    }
    else if (pOperator==2) {
      return 'x';
    }
    else {
      return ':';
    }
  }

  function _createBackground() {
    var backgroundSurface = new Surface({
      size: [WINDOW_WIDTH, WINDOW_HEIGHT],
      properties: {
        backgroundColor: 'blue',
      }
    });

    this.add(backgroundSurface);
  }

  function _createNumber1() {
  	var surface = new Surface({
  		content: number1+'',
      size: [bubbleSize,bubbleSize],
      properties: {
        fontFamily: 'Arial',
        // left: '-75px',
        left: (-WINDOW_WIDTH/2-80)+'px',
        textAlign: 'center',
        backgroundColor: 'white',
        lineHeight: bubbleSize+'px',
        borderRadius: bubbleSize+'px',
      }
  	});

    number1Modifier = new Modifier();

  	this.mainNode.add(number1Modifier).add(surface);
  }

  function _createOperator() {
    var surface = new Surface({
      content: operatorString,
      size: [35,35],
      properties: {
        color: 'white',
        fontFamily: 'Arial',
        left: '-40px',
        textAlign: 'center',
        fontSize: '35px',
        lineHeight: '35px',
      }
    });

    operatorModifier = new Modifier({
      transform: function() {
        return Transform.rotateZ(Math.PI*operatorTransitionable.get());
      },
      opacity: function() {
        return operatorTransitionable.get();
      }
    });

    this.mainNode.add(operatorModifier).add(surface);
  }

  function _createNumber2() {
    var surface = new Surface({
      content: number2+'',
      size: [bubbleSize,bubbleSize],
      properties: {
        fontFamily: 'Arial',
        top: (-WINDOW_HEIGHT/2-bubbleSize)+'px',
        left: '0px',
        textAlign: 'center',
        backgroundColor: 'white',
        lineHeight: bubbleSize+'px',
        borderRadius: bubbleSize+'px',
      }
    });

    number2Modifier = new Modifier();

    this.mainNode.add(number2Modifier).add(surface);
  }

  function _createEqualSign() {
    var surface = new Surface({
      content: '=',
      size: [35,35],
      properties: {
        color: 'white',
        fontFamily: 'Arial',
        left: '40px',
        textAlign: 'center',
        fontSize: '35px',
        lineHeight: '35px',
      }
    });

    this.mainNode.add(surface);
  }

  function _createResult() {
    var surface = new Surface({
      content: result+'',
      size: [bubbleSize,bubbleSize],
      properties: {
        fontFamily: 'Arial',
        // left: '80px',
        left: (WINDOW_WIDTH/2+80)+'px',
        textAlign: 'center',
        backgroundColor: 'white',
        lineHeight: bubbleSize+'px',
        borderRadius: bubbleSize+'px',
        fontWeight: 'bold',
      }
    });

    resultModifier = new Modifier();

    this.mainNode.add(resultModifier).add(surface);
  }

  function _createTimer() {
    var surface = new Surface({
      size: [150,20],
      properties: {
        top: '-50px',
        left: '-75px',
        backgroundColor: 'white',
        borderRadius: '20px',
      }
    });

    var modifier = new Modifier({
      origin: [0, 0.5],
      align : [0.5, 0.5],
      transform: function() {
        return Transform.scale(timerTransitionable.get(),1,1);
      },
    });

    this.add(modifier).add(surface);
  }

  function _createScoreText() {
    var surface = new Surface({
      size: [undefined, true],
      content: 'score: '+score,
      properties: {
        fontFamily: 'Arial',
        fontSize: 'bold',
        paddingLeft: '5px',
        backgroundColor: 'white',
      }
    });

    var modifier = new Modifier({
      origin: [0, 0],
      align : [0, 0],
    });

    this.add(modifier).add(surface);
  }

  function _createFalseBtn() {
    var surface = new Surface({
      content: '✖',
      size: [bubbleSize,bubbleSize],
      properties: {
        fontFamily: 'Arial',
        top: '80px',
        left: '-80px',
        textAlign: 'center',
        backgroundColor: 'white',
        lineHeight: bubbleSize+'px',
        borderRadius: bubbleSize+'px',
        fontWeight: 'bold',
        fontSize: '1.5em',
      }
    });

    var modifier = new Modifier({
      origin: [0.5, 0.5],
      align : [0.5, 0.5],
    });

    this.add(modifier).add(surface);
  }

  function _createTrueBtn() {
    var surface = new Surface({
      content: '✔',
      size: [bubbleSize,bubbleSize],
      properties: {
        fontFamily: 'Arial',
        top: '80px',
        left: '80px',
        textAlign: 'center',
        backgroundColor: 'white',
        lineHeight: bubbleSize+'px',
        borderRadius: bubbleSize+'px',
        fontWeight: 'bold',
        fontSize: '1.5em',
      }
    });

    var modifier = new Modifier({
      origin: [0.5, 0.5],
      align : [0.5, 0.5],
    });

    this.add(modifier).add(surface);
  }

  function _setListeners() {
    this.on('startGame', _newQuestion);
  }

  function _newQuestion() {
    number1Modifier.setTransform(
      Transform.translate(WINDOW_WIDTH/2.0, 0, 0),
      { duration : translateAnimationDuration, curve: Easing.outBounce }
    );

    operatorTransitionable.set(1.0, {
      duration: translateAnimationDuration
    });

    number2Modifier.setTransform(
      Transform.translate(0, WINDOW_HEIGHT/2+bubbleSize, 0),
      { duration : translateAnimationDuration, curve: Easing.outBounce }
    );

    resultModifier.setTransform(
      Transform.translate(-WINDOW_WIDTH/2.0, 0, 0),
      { duration : translateAnimationDuration, curve: Easing.outBounce }
    );

    Timer.setTimeout(function(timerTime) {
      timerTransitionable.set(1.0);
      timerTransitionable.set(0.0, {
        duration: timerTime
      });
    }.bind(this, timerTime), translateAnimationDuration);
  }

  module.exports = GameView;
});