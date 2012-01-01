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
	
	var headerLbl = Titanium.UI.createLabel({
	    text:'Login is a Coordinator',
	    height:'auto',
	    width:'auto',
	    shadowColor:'#000',
	    shadowOffset:{x:5,y:5},
	    color:'#fff',
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
	
	readyEventScan = function(event_title){
		navController.open(new ScanWindow(navController,kpClient,event_title));
	}
	
	var rowTitles = [];
	var rowIds = [];
	
	win.addPicker = function(rowData){
		var picker = Titanium.UI.createPicker({useSpinner:true});
		data = [];
		for (var i in rowData) {
			title = rowData[i].node_title;
			rowTitles[i] = title;
			rowIds[i] = rowData[i].nid;
			data[i]=Titanium.UI.createPickerRow({title:title})
		}
		picker.add(data);
		picker.addEventListener('change', function(e) {
			title = rowTitles[e.rowIndex];
			// use the entered credentials to attempt login
			kpClient.readyCoordinator(rowIds[e.rowIndex]);
			readyEventScan(title);
		});
		win.add(picker);
	}
	
	// handle physical back button press
	// set up confirmation dialog
	var a = Ti.UI.createAlertDialog();
	 
	a.message = 'Exit karmapoints app?';
	a.buttonNames = ['Yes','No'];
	a.cancel = 1;
	 
	a.addEventListener('click', function(e)
	{
	    if (e.index == 0) {
			kpClient.fetchLogout();
			win.close();
	    }
	});
	 
	win.add(a);
	
	win.addEventListener('android:back',function(e) {
	    a.show();
	    return false;
	});
	
	win.add(headerLbl);
	win.add(usernameFld);
	win.add(passwordFld);
	win.add(loginBtn);

	return win;
};