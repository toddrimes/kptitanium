//require the UI components necessary to drive the test
var NavigationController = require('NavigationController').NavigationController,
	SessionWindow = require('SessionWindow').SessionWindow,
	KPClient = require('KPClient').KPClient;

//create NavigationController which will drive our simple application
var controller = new NavigationController();

var xhr = new KPClient(); // extends Ti.Network.HttpClient
xhr.fetchSession('trash','trash'); // inits the client with a server-sourced sessid

//open initial window
controller.open(new SessionWindow(this.controller,xhr));