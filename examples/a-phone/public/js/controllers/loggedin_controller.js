angular.module("app").controller('LoggedinController', function($scope, $rootScope, $location) {

	function Call(initState) {

		this.setState(initState || "idle");
		this.slogan = callStateSlogans[this.state];
		this.legAddress = null;
		this.call = null;
		this.stream = null;
		this.videoActive=false;
		this.makeCall = true;
	};

	Call.prototype.setState = function(s) {
		var newStateSlogan = callStateSlogans[s];
		if(newStateSlogan) {
			this.slogan = newStateSlogan;
			this.state = s;
		} else {
			this.state = "error";
			this.slogan = callStateSlogans[this.state];
			throw "BadState";
		}

		if(this.state === "idle") {
			this.dial = true;
			this.hangup = false;
		} else if(this.state === "calling") {
			this.dial = false;
			this.hangup = true;
		} else if(this.state === "ringing") {
			this.dial = false;
			this.hangup = true;
		} else if(this.state === "speaking") {
			this.dial = false;
			this.hangup = true;
		};
	};

	var callStateSlogans = {
		error: "Bad State Passed...",
		me : "Me Console",
		idle : "Make a call..",
		calling : " Calling ",
		ringing : "Ringing...",
		speaking : "Speaking"
	};

	var me = new Call("me");
	me.makeCall = false;
	$scope.calls = [me, new Call()];
	var callsIndex = [];

	var outgoingCallRequest = null;

	if(!window.accessToken) {
		$location.path('/login');
	} else if (!$rootScope.att) {

		var att = new ATT({
			accessToken: accessToken,
			server: "iip"
		});

		att.on('init', function () {
		    console.log("att init");
		});

		att.on('user', function (user) {
		    console.log("on user event in LoggedinController");			
			$rootScope.user = user;
			$rootScope.loginState = "Logout " + user.first_name;
			$scope.callStatus = "Make a Call";
			$scope.$apply();
		});

		att.on('outgoingCall', function (call) {
		    console.log("outgoingCall");
		    $scope.calls[outgoingCallRequest].call = call;
		    callsIndex[call] = outgoingCallRequest;
		    outgoingCallRequest = null;
		});

		att.on('ring', function () {
		    console.log("ring");
		});

		att.on('callBegin', function (call) {
		    console.log("callBegin: " + call);
		    var leg = callsIndex[call];
		    $scope.calls[leg].setState("speaking");
		    $scope.$apply();
    	});


		att.on('callEnd', function (call) {
		    console.log("callEnd: " + call);
			var index = callsIndex[call];
			var leg = $scope.calls[index];
		    if(leg.call) {
				leg.call.hangup();
			}
 			showalert("Call End", "alert-info");
 			$scope.calls.splice(index,1);
 			delete callsIndex[call];
 			$scope.calls.push(new Call());
		    $scope.$apply();
		});

		att.on('incomingCall', function (call) {
		    console.log("callBegin: " + call);
		    if($rootScope.call) {
		    	console.warn("call already active - overwritten");
				showalert("Incoming Call Not Answered: ", "alert-info");
		    } else {
	    		$rootScope.call = call;
				$rootScope.changePage('/answering');		    	
		    }
		});

		att.on('phoneError', function (eventData) {
		    console.log("phoneError: " + eventData);
			showalert("phoneError: " + eventData, "alert-error");
		    $rootScope.hangup();
		});

		att.on('callError', function (eventData) {
		    console.log("callError: " + eventData);
			showalert("callError: " + eventData, "alert-error");
		    $rootScope.hangup();
		});

		att.on('phoneClose', function () {
		    console.log("phoneClose");
		    $rootScope.login();
		});

		att.on('localVideo', function(stream) {

			console.log("on localVideo");

			var url = webkitURL.createObjectURL(stream);

			var video = $('localVideo');
			video.src = url;
			$scope.localVideoActive = true;
		});

		att.on('remoteVideo', function(stream) {

			console.log("on remoteVideo");

			var url = webkitURL.createObjectURL(stream);

			var video = $('remoteVideo');
			video.src = url;
			$scope.remoteVideoActive = true;			
		});		

   		$rootScope.att = att;
   		$scope.localVideoActive = false;
   		$scope.remoteVideoActive = false;
	};

	$scope.addVideo = function(leg) {

		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		if (navigator.getUserMedia) {
			navigator.getUserMedia({audio: true, video: true}, function(stream) {
				$scope.calls[leg].videoActive = true;
				$scope.$apply();
				var url = window.URL.createObjectURL(stream);
				var video = $('#video-' + leg);
				video.attr("src", url);
				console.log("streamUrl: " + url);
			}, function(err){
				alert(err);
			});
		} else {
		  alert("Video not working");
		}
	};

	$scope.dial = function(leg) {

		if(outgoingCallRequest) {
			showalert("Not Allowed - Call Already Being Made", "alert-error");
		} else {
			outgoingCallRequest = leg;
			var call = $scope.calls[leg];
			// if(pn.indexOf(":") !== -1) {
			// 	$rootScope.phoneNumber = pn;		 			
			// } else {
			// 	$rootScope.phoneNumber = $rootScope.att.phoneNumber.stringify(pn);		 			
			// }
			$rootScope.att.dial(call.leg, call.video);
			call.setState("calling");		
		}
	};

	$scope.answer = function() {
	    $scope.call.answer();
		$location.path('/speaking');
	}

	$scope.hangup = function(index) {
		outgoingCallRequest = null;
		var call = $scope.calls[index];
		if(call){
			if(call.video) {
				call.video.stream.stop();
			}
			if(call.call) {
				call.call.hangup();
				// delete $scope.calls[index];
				// delete callsIndex[call.call];				
			}
		};
	};

	$scope.safeApply = function(fn) {
	  var phase = this.$root.$$phase;
	  if(phase == '$apply' || phase == '$digest')
	    this.$eval(fn);
	  else
	    this.$apply(fn);
	};

	$scope.changePage = function(page) {
		$scope.safeApply( function() {
			$location.path(page);
		});
	};	

	$scope.makeBig = function(video)
	{ 
		var videoObj=$('#' + video);
		videoObj.attr("width", "100%");
		console.log(videoObj); 
		return false;
	} 

	$scope.makeSmall = function(video)
	{ 
		var videoObj=$('#' + video);
		videoObj.attr("width", "25%");
		console.log(videoObj); 
		return false;
	} 

	$scope.makeNormal = function(video)
	{ 
		var videoObj=$('#' + video);
		videoObj.attr("width", "50%");
		console.log(videoObj); 
		return false;
	} 	

	/**
	  Bootstrap Alerts -
	  Function Name - showalert()
	  Inputs - message,alerttype
	  Example - showalert("Invalid Login","alert-error")
	  Types of alerts -- "alert-error","alert-success","alert-info"
	  Required - You only need to add a alert_placeholder div in your html page wherever you want to display these alerts "<div id="alert_placeholder"></div>"
	  Written On - 14-Jun-2013
	**/

	  function showalert(message,alerttype) {

	    $('#alert_placeholder').append('<div id="alertdiv" class="alert ' +  alerttype + '"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>')

	    window.setTimeout(function() { // this will automatically close the alert and remove this if the users doesnt close it in 5 secs

		    $("#alertdiv").fadeTo(500, 0).slideUp(500, function(){
		        $(this).remove(); 
		    });

	    }, 2000);
	  };

});
