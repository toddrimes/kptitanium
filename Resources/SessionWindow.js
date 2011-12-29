exports.SessionWindow = function(navController,kpClient) {
	
	var isAndroid = (Ti.Platform.osname=='android') ? true : false;
	var scanner = require('ScanWindow').ScanWindow;

	var win = Ti.UI.createWindow({
		title:'Window '+navController.windowStack.length,
		backgroundColor:'#fff',
		layout:'vertical'
	});
	
	var headerLbl = Titanium.UI.createLabel({
	    text:'Login is a Coordinator',
	    height:'auto',
	    width:'auto',
	    shadowColor:'#aaa',
	    shadowOffset:{x:5,y:5},
	    color:'#900',
	    font:{fontSize:16},
	    textAlign:'center',
	    top:'10dp'
	});
	
	var usernameFld = Titanium.UI.createTextField({
    	hintText : 'email or username',
	    color:'#336699',
	    height:'35dp',
	    top:'10dp',
	    left:'35dp',
	    width:'250dp',
	    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	var passwordFld = Titanium.UI.createTextField({
    	hintText : 'password',
    	passwordMask: true,
	    color:'#336699',
	    height:'35dp',
	    top:'10dp',
	    left:'35dp',
	    width:'250dp',
	    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});

	var loginBtn = Ti.UI.createButton({
		title:'Login',
		height:'35dp',
		width:'100dp',
		top:'10dp'
	});
	
	var loginSuccess = function() {

	}
	
	var loginFailure = function() {

	}

	loginBtn.addEventListener('click', function() {
		// use the entered credentials to attempt login
		kpClient.postLogin(usernameFld.value, passwordFld.value,win);
	});
	
	win.readyEventScan = function(event_title){
		alert('ta da!');
	}
	
	win.add(headerLbl);
	win.add(usernameFld);
	win.add(passwordFld);
	win.add(loginBtn);

	return win;
};