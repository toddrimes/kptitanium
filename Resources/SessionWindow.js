exports.SessionWindow = function(navController,kpClient) {
	
	var isAndroid = (Ti.Platform.osname=='android') ? true : false;
	var ScanWindow = require('ScanWindow').ScanWindow;
	var rowData = [];

	var win = Ti.UI.createWindow({
		title:'karmapoints',
		color:'#0cc',
		backgroundColor:'#cc9',
		layout:'vertical',
		exitOnClose: true,
		navBarHidden: false
	});
	
	win.orientationModes = [Ti.UI.PORTRAIT];
	
	var headerLbl = Titanium.UI.createLabel({
	    text:'Login as a Coordinator',
	    height:'auto',
	    width:'auto',
	    shadowColor:'#000',
	    shadowOffset:{x:10,y:10},
	    color:'#1397A5',
	    font:{fontSize:24},
	    textAlign:'center',
	    top:'10dp'
	});
	
	var usernameFld = Titanium.UI.createTextField({
    	hintText : 'email or username',
	    color:'#336699',
	    height:'65dp',
	    top:'10dp',
	    left:'35dp',
	    width:'250dp',
	    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	var passwordFld = Titanium.UI.createTextField({
    	hintText : 'password',
    	passwordMask: true,
	    color:'#336699',
	    height:'65dp',
	    top:'10dp',
	    left:'35dp',
	    width:'250dp',
	    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});

	var loginBtn = Ti.UI.createButton({
		title:'Login',
		height:'35dp',
		width:'100dp',
		top:'10dp',
		softKeyboardOnFocus:Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS
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
		navController.open(new ScanWindow(navController,kpClient,event_title));
	}
	
	var rowTitles = [];
	var rowIds = [];
	var selectedRow = 0; // no change in the selection of "picker" below
	
	win.addPicker = function(rowData){	
	
		var eventsLbl = Titanium.UI.createLabel({
		    text:'Choose an event',
		    height:'auto',
		    width:'auto',
		    shadowColor:'#000',
		    shadowOffset:{x:10,y:10},
		    color:'#1397A5',
		    font:{fontSize:16},
		    textAlign:'center',
		    top:'10dp'
		});

		var picker = Titanium.UI.createPicker();
		for (var i in rowData) {
			title = rowData[i].node_title;
			rowTitles[i] = title;
			rowIds[i] = rowData[i].nid;
			var row = Titanium.UI.createPickerRow({title:title});
			picker.add(row);
		}

		picker.addEventListener('change', function(e) {
			selectedRow = e.rowIndex;
		});

		var continueBtn = Titanium.UI.createButton({
			title:'Continue',
			height:'35dp',
			width:'150dp',
			top:'10dp',
			softKeyboardOnFocus:Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS	
		});
		continueBtn.addEventListener('click', function(e) {
			title = rowTitles[selectedRow];
			// use the entered credentials to attempt login
			kpClient.readyCoordinator(rowIds[selectedRow],title,win);
		});
		
		win.add(eventsLbl);
		win.add(picker);
		win.add(continueBtn);
		win.remove(loginBtn);
	}
	
	// handle physical back button press
	// set up confirmation dialog
	var a = Ti.UI.createAlertDialog({
	    message: 'Exit karmapoints app?',
	    buttonNames: ['No','Yes'],
	    cancel: 0
	});
	 
	//a.message = 'Exit karmapoints app?';
	//a.buttonNames = ['Yes','No'];
	//a.cancel = 1;
	 
	a.addEventListener('click', function(e)
	{
	    if (e.index == 1) {
			kpClient.fetchLogout(win);
			//win.close();
	    }
	});
	
	win.logoff = function() {
		win.close();
	}
	 
	win.add(a);
	
	win.addEventListener('android:back',function(e) {
	    a.show();
	});
	
	win.add(headerLbl);
	win.add(usernameFld);
	win.add(passwordFld);
	win.add(loginBtn);

	return win;
};