exports.ScanWindow = function(navController,kpClient,event_title) {
	
	var isAndroid = (Ti.Platform.osname=='android') ? true : false;
	var titaniumBarcode = require('com.mwaysolutions.barcode');

	var win = Ti.UI.createWindow({
		title:'Scanning badges for: ',
		color:'#0cc',
		backgroundColor:'#cc9',
		layout:'vertical',
		navBarHidden: false
	});
	
	win.orientationModes = [Ti.UI.PORTRAIT];
	
	var headerLbl = Titanium.UI.createLabel({
	    text:event_title,
	    height:'auto',
	    width:'auto',
	    shadowColor:'#ccc',
	    shadowOffset:{x:10,y:10},
	    color:'#1397A5',
	    font:{fontSize:24},
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
    
    win.updateView = function(contents) {
    	webview.html = contents;
    }
    
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
	          	var source = data.barcode;
	          	var lastSlash = source.lastIndexOf('/');
	          	var volunteerid = source.substring(lastSlash + 1);
	          	// alert("volunteerid is " + volunteerid);
	            alert(JSON.stringify(data));
	          	kpClient.checkinVolunteer(volunteerid,win);
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
	 
	 /* scanBtn.addEventListener("click", function(e) {
		  var intent = Ti.Android.createIntent({
		    action: "com.google.zxing.client.android.SCAN"
		  });
		  intent.putExtra("SCAN_MODE", "QR_SCAN_MODE");
		  var activity = Ti.Android.currentActivity;
		  activity.startActivityForResult(intent, function(e) {
		    if (e.resultCode == Ti.Android.RESULT_OK) {
		      var contents = e.intent.getStringExtra("SCAN_RESULT");
		      var format = e.intent.getStringExtra("SCAN_RESULT_FORMAT");
		      Ti.UI.createNotification({
		        message: "Contents: " + contents + ", Format: " + format
		      }).show();
		    } else if (e.resultCode == Ti.Android.RESULT_CANCELED) {
		      Ti.UI.createNotification({
		        message: "Scan canceled!"
		      }).show();
		    }
		  });
		});
	*/
	
	win.add(scanBtn);
    
	win.addEventListener('android:back',function(e) {
	    navController.home(); // go back to the login screen
	    return false;
	});

	return win;
};