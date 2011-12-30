exports.KPClient = function() {
	
	var debug = false;
	
	// var isAndroid = (Ti.Platform.osname=='android') ? true : false;
	var host = (debug) ? "http://karmapoints.local" : "http://www.karmapoints.org";
	var sessionURL = host + "/rest/system/connect";
	var loginURL = host + "/rest/user/login";
	var readyCoordinatorURL = host + "/coordinatorsession.php";
	var eventsURL = host + "/rest/views/view_mobile_coordinator_events.json";
	var checkinURL = host + "/event/checkin/{VOLUNTEER_ID}?ajax=1";
	var logoutURL = host + "/logout";

	var xhr = Ti.Network.createHTTPClient({
	    onerror: function(e) {
	    Ti.API.debug("STATUS: " + this.status);
	    Ti.API.debug("TEXT:   " + this.responseText);
	    Ti.API.debug("ERROR:  " + e.error);
	    alert('There was an error retrieving the remote data. Try again.');
	    },
	    timeout:5000
	});
	
	
	xhr.sessid = "";
	xhr.cookie = "";
	xhr.userid = 0;
	xhr.caller = null;
	xhr.pickerDataIds = new Array();
	xhr.pickerDataTitles = new Array();
	xhr.loggedIn = function() {
		return (xhr.userid > 0);
	}
	
	xhr.fetchSession = function(user,pass) {
		xhr.setOnload(function() {
			// parse the response
			json = JSON.parse(xhr.responseText);
			xhr.sessid = json.sessid;
		});
		var params = {  
		    'user':user,  
		    'pass':pass
		};
		xhr.open("POST",sessionURL,false);
		xhr.send(params);
		params = null;
	}
	
	xhr.postLogin = function(username,password,caller) {
		xhr.caller = caller;
		xhr.setOnload(function() {
			// parse the response
			xhr.cookie = xhr.getResponseHeader("Set-Cookie");
			json = JSON.parse(xhr.responseText);
			xhr.sessid = json.sessid;
			xhr.userid = parseInt(json.user.uid);
			if(xhr.userid>0) {
				var alertDialog = Titanium.UI.createAlertDialog({
				    title: 'Success',
				    message: 'You are now logged in.  To logout, quit the app.',
				    buttonNames: ['OK']
				});
				alertDialog.show();
				xhr.fetchEvents();
			} else {
				var alertDialog = Titanium.UI.createAlertDialog({
				    title: 'Error',
				    message: 'Unsuccessful login.',
				    buttonNames: ['OK']
				});
				alertDialog.show();
			}
		});
		var params = {  
		    'sessid':xhr.sessid,  
		    'username':username,  
		    'password':password
		};
		xhr.open("POST",loginURL,false);
		xhr.setRequestHeader("Cookie", xhr.cookie);
		xhr.send(params);
		params = null;
	}
	
	xhr.readyCoordinator = function(event_id) {
		xhr.setOnload(function() {
			return true;
		});
		var params = {
			'sessid':xhr.sessid,
		    'event_id':event_id
		};
		xhr.open("GET",readyCoordinatorURL,false);
		xhr.send(params);
		params = null;
	}
	
	xhr.fetchEvents = function() {
		xhr.setOnload(function() {
			// parse the response
			json = JSON.parse(xhr.responseText);
			for(var index in json){
				item = json[index];
				xhr.pickerDataIds.push(item.nid);
				xhr.pickerDataTitles.push(Titanium.UI.createPickerRow({title:item.node_title}));
			}
			var picker = Titanium.UI.createPicker({useSpinner:true});
			picker.add(xhr.pickerDataTitles);
			picker.addEventListener('change', function(e) {
				// use the entered credentials to attempt login
				xhr.readyCoordinator(xhr.pickerDataIds[e.rowIndex]);
				xhr.caller['readyEventScan'](xhr.pickerDataTitles[e.rowIndex]);
			});
			xhr.caller['add'](picker);
		});
		var params = {
			'sessid':xhr.sessid
		};
		// all parameters come from session and are already set
		xhr.open("GET",eventsURL,false);
		xhr.send(params);
		params = null;
	}
	
	xhr.checkinVolunteer = function(volunteer_id) {
		var newCheckinURL = checkinURL.replace("{VOLUNTEER_ID}", volunteer_id);
		xhr.setOnload(function() {
			return xhr.responseText;
		});
		var params = {
			'sessid':xhr.sessid
		};
		xhr.open("GET",newCheckinURL,false);
		xhr.send(params);
		params = null;
	}
	
	xhr.fetchLogout = function() {
		var params = {
			'sessid':xhr.sessid
		}
		xhr.setOnload(function() {
			return true;
		});
		xhr.open("GET",logoutURL);
	}
	
	return xhr;
};
