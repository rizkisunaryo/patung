/*** main.js ***/

define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var AppView = require('views/AppView');

    var mainContext = Engine.createContext();
    var appView = new AppView();

    // console.log(mainContext.getSize()[0]+" : "+mainContext.getSize()[1]);

    mainContext.add(appView);
});
