exports.ScanWindow = function(navController,kpClient,event_title) {
	
	var isAndroid = (Ti.Platform.osname=='android') ? true : false;
	var titaniumBarcode = require('com.mwaysolutions.barcode');

	var win = Ti.UI.createWindow({
		title:'Scan'+navController.windowStack.length,
		backgroundColor:'#fff',
		layout:'vertical',
		navBarHidden: false
	});
	
	var headerLbl = Titanium.UI.createLabel({
	    text:event_title,
	    height:'auto',
	    width:'auto',
	    shadowColor:'#aaa',
	    shadowOffset:{x:5,y:5},
	    color:'#900',
	    font:{fontSize:16},
	    textAlign:'center',
	    top:'10dp'
	});
	
	win.add(headerLbl);
	
	var webview = Titanium.UI.createWebView({
		url:'http://www.karmapoints.org/nothingscanned.html',
		height:'150dp',
		width:'300dp',
		bottom:'10dp'
	});

    win.add(webview);
    
	var scanBtn = Ti.UI.createButton({
		title:'Scan',
		height:'50dp',
		width:'200dp',
		top:'20dp'
	});
	
	scanBtn.addEventListener('click', function (e) {
	   titaniumBarcode.scan({
	        success: function (data) {
	          if(data && data.barcode) {
	            webview.setURL(data.barcode);
	          } else {
	            alert(JSON.stringify(data));
	          }
	        },
	
	        error: function (err) {
	          alert('Error while scanning: ' + err);
	        },
	
	        cancel: function () {
	          alert('Scan cancelled');
	        }
	      });
	  });
	
	win.add(scanBtn);
    
	win.addEventListener('android:back',function(e) {
	    navController.home(); // go back to the login screen
	    return false;
	});

	return win;
};