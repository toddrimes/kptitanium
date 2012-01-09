exports.KPClient = function() {
	
	var debug = false;
	
	// var isAndroid = (Ti.Platform.osname=='android') ? true : false;
	var host = (debug) ? "http://karmapoints.local" : "http://www.karmapoints.org";
	var sessionURL = host + "/rest/system/connect";
	var loginURL = host + "/rest/user/login";
	var readyCoordinatorURL = host + "/coordinatorsession.php";
	var eventsURL = host + "/rest/views/view_mobile_coordinator_events.json";
	// var checkinURL = host + "/rest/views/view_event_volunteer_checkin";
	var checkinURL = host + "/event/checkin";
	// var checkinURL = host + "/event/checkin/{VOLUNTEER_ID}?ajax=1";
	var logoutURL = host + "/logout";

	var xhr = Ti.Network.createHTTPClient({
	    onerror: function(e) {
	    statusMsg = "STATUS: " + this.status;
	    Ti.API.debug(statusMsg);
	    textMsg = "TEXT:   " + this.responseText;
	    Ti.API.debug(textMsg);
	    errorMsg = "ERROR:  " + e.error;
	    Ti.API.debug(errorMsg);
	    alert(statusMsg + "; " + textMsg + "; " + errorMsg);
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
	 xhr.onload = function() {
			// parse the response
			json = JSON.parse(xhr.responseText);
			xhr.sessid = json.sessid;
		};
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
		xhr.onload = function() {
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
		};
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
	
	xhr.readyCoordinator = function(event_id,event_title,caller) {
		xhr.onload = function() {
			caller['readyEventScan'](event_title);
			return true;
		};
		var params = {
			'sessid':xhr.sessid,
		    'event_id':event_id
		};
		xhr.open("GET",readyCoordinatorURL,false);
		xhr.send(params);
		params = null;
	}
	
	xhr.fetchEvents = function() {
		xhr.onload = function() {
			// parse the response
			json = JSON.parse(xhr.responseText);
			xhr.caller['addPicker'](json);
		};
		var params = {
			'sessid':xhr.sessid
		};
		// all parameters come from session and are already set
		xhr.open("GET",eventsURL,false);
		xhr.send(params);
		params = null;
	}
	
	xhr.checkinVolunteer = function(volunteer_id, caller) {
		xhr.onload = function() {
			caller['updateView'](xhr.responseText);
		};
		var params = {
			'sessid':xhr.sessid,
			'args':volunteer_id,
			'ajax':1,
			'display_id':'page_view_event_volunteer_checkin'
		};
		alert("checking in to " + checkinURL + "/" + volunteer_id);
		xhr.open("GET",checkinURL + "/" + volunteer_id,false);
		xhr.send(params);
		params = null;
	}
	
	xhr.fetchLogout = function(caller) {
		var params = {
			'sessid':xhr.sessid
		}
		xhr.onload = function() {
			caller['logoff']();
		};
		xhr.open("GET",logoutURL);
	}
	
	return xhr;
};
