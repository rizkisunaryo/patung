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
  var timerTime = 5000;
  var isClickable = false;
  var endingAnimationDuration = 1000;

  var number1Txt;
  var operatorTxt;
  var number2Txt;
  var resultTxt;
  var scoreLbl;
  var scoreTxt;
  var highestLbl;
  var highestTxt;
  var livesTxt;
  var trueTxt;
  var trueBasicColor;
  var trueCorrectColor;
  var trueWrongColor;
  var falseTxt;
  var falseBasicColor;
  var falseCorrectColor;
  var falseWrongColor;
  var replayBtn;
  var highScoresBtn;

  var centerModifier;
  var number1Modifier;
  var operatorModifier;
  var number2Modifier;
  var resultModifier;
  var trueCorrectModifier;
  var trueWrongModifier;
  var falseCorrectModifier;
  var falseWrongModifier;
  var scoreTranslateModifier;

  var timerTransitionable = new Transitionable(0.0);
  var operatorTransitionable = new Transitionable(0.0);
  var trueCorrectTransitionable = new Transitionable(0.0);
  var trueWrongTransitionable = new Transitionable(0.0);
  var falseCorrectTransitionable = new Transitionable(0.0);
  var falseWrongTransitionable = new Transitionable(0.0);
  var endingTransitionable = new Transitionable(0.0);

  function GameView() {
    View.apply(this, arguments);

    _createCenterModifier.call(this);

    _createBackground.call(this);
    _createNumber1.call(this);
    _createOperator.call(this);
    _createNumber2.call(this);
    _createEqualSign.call(this);
    _createResult.call(this);

    _createTimer.call(this);
    _createScoreLabel.call(this);
    _createScoreText.call(this);
    _createHighestScoreLabel.call(this);
    _createHighestScoreText.call(this);
    _createLivesText.call(this);
    _createTrueBtn.call(this);
    _createFalseBtn.call(this);
    _createReplayBtn.call(this);
    _createHighScoresBtn.call(this);

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

  var INITIAL_LIVES=10;
  var lives = INITIAL_LIVES;
  var score = 0;
  var isCorrect = 0;
  var number1 = 11;
  var number2 = 11;
  var operator = 0;
  var operatorString='';
  var result = 0.0;
  function _createLogic() {
    isCorrect = Math.floor(Math.random() * 2);

    number1 = Math.floor((Math.random()*30) + 1);
    number2 = Math.floor((Math.random()*30) + 1);

    operator = getOperator(score);

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
      result = pNumber1 / pNumber2;
    }

    if (isCorrect==0) {
      if (pOperator==3) result+=0.5;
      else result+=10;
    }

    return result;
  }

  function getOperator(pScore) {
    if (pScore<25) {
      return Math.floor(Math.random()*4);
    }
    else if (pScore<50) {
      return Math.floor((Math.random()*3) + 1);
    }
    else {
      return Math.floor((Math.random()*2) + 2);
    }
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
  	number1Txt = new Surface({
  		content: number1+'',
      size: [bubbleSize,bubbleSize],
      properties: {
        fontFamily: 'Arial',
        left: (-WINDOW_WIDTH/2-80)+'px',
        textAlign: 'center',
        backgroundColor: 'white',
        lineHeight: bubbleSize+'px',
        borderRadius: bubbleSize+'px',
      }
  	});

    number1Modifier = new Modifier();

  	this.mainNode.add(number1Modifier).add(number1Txt);
  }

  function _createOperator() {
    operatorTxt = new Surface({
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

    this.mainNode.add(operatorModifier).add(operatorTxt);
  }

  function _createNumber2() {
    number2Txt = new Surface({
      content: number2+'',
      size: [bubbleSize,bubbleSize],
      properties: {
        fontFamily: 'Arial',
        top: (WINDOW_HEIGHT/2+bubbleSize)+'px',
        left: '0px',
        textAlign: 'center',
        backgroundColor: 'white',
        lineHeight: bubbleSize+'px',
        borderRadius: bubbleSize+'px',
      }
    });

    number2Modifier = new Modifier();

    this.mainNode.add(number2Modifier).add(number2Txt);
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

    var modifier = new Modifier({
      opacity: function function_name (argument) {
        return 1-endingTransitionable.get();
      },
    });

    this.mainNode.add(modifier).add(surface);
  }

  function _createResult() {
    resultTxt = new Surface({
      content: result+'',
      size: [bubbleSize,bubbleSize],
      properties: {
        fontFamily: 'Arial',
        left: (WINDOW_WIDTH/2+80)+'px',
        textAlign: 'center',
        backgroundColor: 'white',
        lineHeight: bubbleSize+'px',
        borderRadius: bubbleSize+'px',
        fontWeight: 'bold',
      }
    });

    resultModifier = new Modifier();

    this.mainNode.add(resultModifier).add(resultTxt);
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

  function _createScoreLabel() {
    scoreLbl = new Surface({
      size: [undefined, true],
      content: 'SCORE&nbsp;&nbsp;:',
      properties: {
        left: '-100px',
        fontFamily: 'Consolas,monaco,monospace',
        fontSize: 'bold',
        fontSize: '42px',
        top: '-30px',
        color: 'white',
      }
    });

    var modifier = new Modifier({
      origin: [0, 0.5],
      align : [0.5, 0.5],
      transform: function() {
        return Transform.scale(0.6,0.6,1);
      },
      opacity: function() {
        return endingTransitionable.get();
      }
    });

    this.add(modifier).add(scoreLbl);
  }

  function _createScoreText() {
    scoreTxt = new Surface({
      size: [undefined, true],
      content: ''+score,
      properties: {
        fontFamily: 'Consolas,monaco,monospace',
        fontSize: 'bold',
        fontSize: '42px',
        textAlign: 'center',
        top: '-120px',
        color: 'white',
      }
    });

    var modifier = new Modifier({
      origin: [0.5, 0.5],
      align : [0.5, 0.5],
      transform: function() {
        return Transform.scale(1-0.4*endingTransitionable.get(),1-0.4*endingTransitionable.get(),1);
      },
    });

    scoreTranslateModifier = new Modifier({
      transform: function() {
        return Transform.translate(92*endingTransitionable.get(),150*endingTransitionable.get(),1);
      },
    })

    this.add(modifier).add(scoreTranslateModifier).add(scoreTxt);
  }

  function _createHighestScoreLabel() {
    highestLbl = new Surface({
      size: [undefined, true],
      content: 'HIGHEST:',
      properties: {
        left: '-100px',
        fontFamily: 'Consolas,monaco,monospace',
        fontSize: 'bold',
        fontSize: '42px',
        top: '5px',
        color: 'white',
      }
    });

    var modifier = new Modifier({
      origin: [0, 0.5],
      align : [0.5, 0.5],
      transform: function() {
        return Transform.scale(0.6,0.6,1);
      },
      opacity: function() {
        return endingTransitionable.get();
      },
    });

    this.add(modifier).add(highestLbl);
  }

  function _createHighestScoreText() {
    highestTxt = new Surface({
      size: [undefined, true],
      properties: {
        left: '55px',
        fontFamily: 'Consolas,monaco,monospace',
        fontSize: 'bold',
        fontSize: '42px',
        textAlign: 'center',
        top: '5px',
        color: 'white',
      }
    });

    var modifier = new Modifier({
      origin: [0.5, 0.5],
      align : [0.5, 0.5],
      transform: function() {
        return Transform.scale(0.6,0.6,1);
      },
      opacity: function() {
        return endingTransitionable.get();
      },
    });

    this.add(modifier).add(highestTxt);
  }

  function _createLivesText() {
    livesTxt = new Surface({
      content: 'Lives: '+lives,
      size: [undefined, true],
      properties: {
        padding: '5px',
        color: 'white',
        fontWeight: 'bold',
      }
    });

    this.add(livesTxt);
  }

  function _createFalseBtn() {
    falseTxt = new Surface({
      content: '✖',
      size: [bubbleSize,bubbleSize],
      properties: {
        fontFamily: 'Arial',
        top: '80px',
        left: '-80px',
        textAlign: 'center',
        lineHeight: bubbleSize+'px',
        fontWeight: 'bold',
        fontSize: '21px',
        cursor: 'pointer',
      }
    });

    falseBasicColor = new Surface({
      size: [bubbleSize,bubbleSize],
      properties: {
        top: '80px',
        left: '-80px',
        backgroundColor: 'white',
        borderRadius: bubbleSize+'px',
      }
    });

    falseCorrectColor = new Surface({
      size: [bubbleSize,bubbleSize],
      properties: {
        top: '80px',
        left: '-80px',
        backgroundColor: 'green',
        borderRadius: bubbleSize+'px',
      }
    });

    falseWrongColor = new Surface({
      size: [bubbleSize,bubbleSize],
      properties: {
        top: '80px',
        left: '-80px',
        backgroundColor: 'red',
        borderRadius: bubbleSize+'px',
      }
    });

    var modifier = new Modifier({
      origin: [0.5, 0.5],
      align : [0.5, 0.5],
      transform: function() {
        return Transform.scale(1-endingTransitionable.get(),1-endingTransitionable.get(),1-endingTransitionable.get());
      }
    });

    var textModifier = new Modifier({
      transform: function() {
        return Transform.translate(0, 0, 3);
      }
    });

    var correctWrongModifier = new Modifier({
      transform: function() {
        return Transform.translate(0, 0, 2);
      }
    });

    falseCorrectModifier = new Modifier({
      opacity: function() {
        return falseCorrectTransitionable.get();
      }
    });

    falseWrongModifier = new Modifier({
      opacity: function() {
        return falseWrongTransitionable.get();
      }
    });

    var theNode = this.add(modifier);
    theNode.add(falseBasicColor);
    var correctWrongNode = theNode.add(correctWrongModifier);
    correctWrongNode.add(falseCorrectModifier).add(falseCorrectColor);
    correctWrongNode.add(falseWrongModifier).add(falseWrongColor);
    theNode.add(textModifier).add(falseTxt);
  }

  function _createTrueBtn() {
    trueTxt = new Surface({
      content: '✔',
      size: [bubbleSize,bubbleSize],
      properties: {
        fontFamily: 'Arial',
        top: '80px',
        left: '80px',
        textAlign: 'center',
        lineHeight: bubbleSize+'px',
        fontWeight: 'bold',
        fontSize: '21px',
        cursor: 'pointer',
      }
    });

    trueBasicColor = new Surface({
      size: [bubbleSize,bubbleSize],
      properties: {
        top: '80px',
        left: '80px',
        backgroundColor: 'white',
        borderRadius: bubbleSize+'px',
      }
    });

    trueCorrectColor = new Surface({
      size: [bubbleSize,bubbleSize],
      properties: {
        top: '80px',
        left: '80px',
        backgroundColor: 'green',
        borderRadius: bubbleSize+'px',
      }
    });

    trueWrongColor = new Surface({
      size: [bubbleSize,bubbleSize],
      properties: {
        top: '80px',
        left: '80px',
        backgroundColor: 'red',
        borderRadius: bubbleSize+'px',
      }
    });

    var modifier = new Modifier({
      origin: [0.5, 0.5],
      align : [0.5, 0.5],
      transform: function() {
        return Transform.scale(1-endingTransitionable.get(),1-endingTransitionable.get(),1-endingTransitionable.get());
      }
    });

    var textModifier = new Modifier({
      transform: function() {
        return Transform.translate(0, 0, 3);
      }
    });

    var correctWrongModifier = new Modifier({
      transform: function() {
        return Transform.translate(0, 0, 2);
      }
    });

    trueCorrectModifier = new Modifier({
      opacity: function() {
        return trueCorrectTransitionable.get();
      }
    });

    trueWrongModifier = new Modifier({
      opacity: function() {
        return trueWrongTransitionable.get();
      }
    });

    var theNode = this.add(modifier);
    theNode.add(trueBasicColor);
    var correctWrongNode = theNode.add(correctWrongModifier);
    correctWrongNode.add(trueCorrectModifier).add(trueCorrectColor);
    correctWrongNode.add(trueWrongModifier).add(trueWrongColor);
    theNode.add(textModifier).add(trueTxt);
  }

  function _createReplayBtn() {
    replayBtn = new Surface({
      size: [100,55],
      content: 'replay',
      properties: {
        left: '-55px',
        top: '70px',
        fontFamily: 'Arial',
        fontSize: '21px',
        backgroundColor: 'white',
        borderRadius: '100px',
        lineHeight: '55px',
        textAlign: 'center',
        cursor: 'pointer',
      },
    });

    var modifier = new Modifier({
      origin: [0.5, 0.5],
      align: [0.5, 0.5],
      transform: function() {
        return Transform.translate(-WINDOW_WIDTH/2*(1-endingTransitionable.get()),WINDOW_WIDTH/2*(1-endingTransitionable.get()),1);
      }
    });

    this.add(modifier).add(replayBtn);
  }

  function _createHighScoresBtn() {
    highScoresBtn = new Surface({
      size: [100,55],
      content: 'high<br />scores',
      properties: {
        left: '55px',
        top: '70px',
        fontFamily: 'Arial',
        fontSize: '21px',
        backgroundColor: 'white',
        borderRadius: '100px',
        lineHeight: '20px',
        textAlign: 'center',
        paddingTop: '6px',
        cursor: 'pointer',
      }
    });

    var modifier = new Modifier({
      origin: [0.5, 0.5],
      align: [0.5, 0.5],
      transform: function() {
        return Transform.translate(WINDOW_WIDTH/2*(1-endingTransitionable.get()),WINDOW_WIDTH/2*(1-endingTransitionable.get()),1);
      }
    });

    this.add(modifier).add(highScoresBtn);
  }

  function _setListeners() {
    this.on('startGame', _newQuestion);

    falseTxt.on('click', function() {
      if (isClickable) {
        if (isCorrect==0) {
          falseCorrectTransitionable.set(1.0);
          score++;
          if (score%10==0) lives+=3;
        }
        else {
          falseWrongTransitionable.set(1.0);
          lives--;
        }
        _dismissQuestion();
      }
    });

    trueTxt.on('click', function() {
      if (isClickable) {
        if (isCorrect==1) {
          trueCorrectTransitionable.set(1.0);
          score++;
          if (score%10==0) lives+=3;
        }
        else {
          trueWrongTransitionable.set(1.0);
          lives--;
        }
        _dismissQuestion();
      }
    });

    replayBtn.on('click', function() {
      _replay();
    });
  }

  function _newQuestion() {
    _createLogic();

    number1Txt.setContent(''+number1);
    operatorTxt.setContent(operatorString);
    number2Txt.setContent(''+number2);
    resultTxt.setContent(''+(+result.toFixed(2)));


    number1Modifier.setTransform(
      Transform.translate(WINDOW_WIDTH/2.0, 0, 0),
      { duration : translateAnimationDuration, curve: Easing.outBounce }
    );

    operatorTransitionable.set(1.0, {
      duration: translateAnimationDuration
    });

    number2Modifier.setTransform(
      Transform.translate(0, -WINDOW_HEIGHT/2-bubbleSize, 0),
      { duration : translateAnimationDuration, curve: Easing.outBounce }
    );

    resultModifier.setTransform(
      Transform.translate(-WINDOW_WIDTH/2.0, 0, 0),
      { duration : translateAnimationDuration, curve: Easing.outBounce }
    );

    trueCorrectTransitionable.set(0.0, {
      duration: translateAnimationDuration
    });
    trueWrongTransitionable.set(0.0, {
      duration: translateAnimationDuration
    });
    falseCorrectTransitionable.set(0.0, {
      duration: translateAnimationDuration
    });
    falseWrongTransitionable.set(0.0, {
      duration: translateAnimationDuration
    });


    Timer.setTimeout(function(timerTime) {
      isClickable=true;
      timerTransitionable.set(1.0);
      timerTransitionable.set(0.0, {
        duration: timerTime
      },function(){
        lives--;
        _dismissQuestion();
      });
    }.bind(this, timerTime), translateAnimationDuration);
  }

  function _dismissQuestion() {
    isClickable = false;
    scoreTxt.setContent(''+score);
    livesTxt.setContent('Lives: '+lives);

    number1Modifier.halt();
    operatorTransitionable.halt();
    number2Modifier.halt();
    resultModifier.halt();

    trueCorrectTransitionable.halt();
    trueWrongTransitionable.halt();
    falseCorrectTransitionable.halt();
    falseWrongTransitionable.halt();

    timerTransitionable.halt();
    timerTransitionable.set(0.0);

    number1Modifier.setTransform(
      Transform.translate(-WINDOW_WIDTH/2.0, 0, 0),
      { duration : translateAnimationDuration, curve: Easing.outBounce }
    );

    operatorTransitionable.set(0.0, {
      duration: translateAnimationDuration
    });

    number2Modifier.setTransform(
      Transform.translate(0, WINDOW_HEIGHT/2+bubbleSize, 0),
      { duration : translateAnimationDuration, curve: Easing.outBounce }
    );

    resultModifier.setTransform(
      Transform.translate(WINDOW_WIDTH/2.0, 0, 0),
      { duration : translateAnimationDuration, curve: Easing.outBounce }
    );

    Timer.setTimeout(function() {
      if (lives>0) {
        _newQuestion();
      }
      else {
        _gameEnds();
      }
    }.bind(this), translateAnimationDuration);
  }

  function _gameEnds() {
    var prevHighScore = window.localStorage.getItem("score");
    if (score>prevHighScore) {
      window.localStorage.setItem("score",score);
    }
    highestTxt.setContent(''+window.localStorage.getItem("score"));

    Timer.setTimeout(function() {
      endingTransitionable.set(1.0, {
        duration: endingAnimationDuration,
      });
    }.bind(this), translateAnimationDuration);
  }

  function _replay() {
    score=0;
    lives=INITIAL_LIVES;
    scoreTxt.setContent(score);
    livesTxt.setContent('Lives: '+lives);
    endingTransitionable.set(0.0, {
      duration: endingAnimationDuration,
    });
    Timer.setTimeout(function() {
      _newQuestion();
    }.bind(this), endingAnimationDuration);
  }

  module.exports = GameView;
});