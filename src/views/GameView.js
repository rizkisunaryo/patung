define(function(require, exports, module) {
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Modifier = require('famous/core/Modifier');
  var ContainerSurface  = require('famous/surfaces/ContainerSurface');
  var Transitionable = require('famous/transitions/Transitionable');

  var WINDOW_WIDTH = window.innerWidth;
  var WINDOW_HEIGHT = window.innerHeight;
  var bubbleSize = 50;

  var centerModifier;

  var timerTransitionable = new Transitionable(1.0);

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
        left: '-75px',
        textAlign: 'center',
        backgroundColor: 'white',
        lineHeight: bubbleSize+'px',
        borderRadius: bubbleSize+'px',
      }
  	});

  	this.mainNode.add(surface);
  }

  function _createOperator() {
    var surface = new Surface({
      content: operatorString,
      size: [35,35],
      properties: {
        color: 'white',
        fontFamily: 'Arial',
        left: '-35px',
        textAlign: 'center',
        fontSize: '35px',
        lineHeight: '35px',
      }
    });

    this.mainNode.add(surface);
  }

  function _createNumber2() {
    var surface = new Surface({
      content: number2+'',
      size: [bubbleSize,bubbleSize],
      properties: {
        fontFamily: 'Arial',
        left: '5px',
        textAlign: 'center',
        backgroundColor: 'white',
        lineHeight: bubbleSize+'px',
        borderRadius: bubbleSize+'px',
      }
    });

    this.mainNode.add(surface);
  }

  function _createEqualSign() {
    var surface = new Surface({
      content: '=',
      size: [35,35],
      properties: {
        color: 'white',
        fontFamily: 'Arial',
        left: '45px',
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
        left: '85px',
        textAlign: 'center',
        backgroundColor: 'white',
        lineHeight: bubbleSize+'px',
        borderRadius: bubbleSize+'px',
        fontWeight: 'bold',
      }
    });

    this.mainNode.add(surface);
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

    this.on('startGame', function() {
      timerTransitionable.set(0.0, {
        duration: 2000
      });
    });
  }

  module.exports = GameView;
});