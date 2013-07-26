angular.module("app").controller('LoggedinController', function($scope, $rootScope, $location) {

	function Call(initState) {

		this.setState(initState || "idle");
		this.slogan = callStateSlogans[this.state];
		this.call = null;
		this.localVideoStream = null;
		this.remoteVideoStream = null;
		this.remoteVideoActive = false;
		this.localVideoActive = false;
		this.makeCall = true;
		this.talky = null;
		this.talkyAddress = null;
		this.remoteAddress = "12147178973";
		this.video = false;
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

		this.talkyExit = false;
		this.answer = false;

		if(this.state === "idle") {
			this.dial = true;
			this.hangup = false;
			this.answer = false;
		} else if(this.state === "calling") {
			this.dial = false;
			this.hangup = true;
		} else if(this.state === "answering") {
			this.dial = false;
			this.hangup = true;
			this.answer = true;
		} else if(this.state === "ringing") {
			this.dial = false;
			this.hangup = true;
		} else if(this.state === "speaking") {
			this.dial = false;
			this.hangup = true;
		} else if(this.state === "talky") {
			this.dial = false;
			this.hangup = false;
			this.talkyExit = true;
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

	$scope.calls = [new Call()];
	var callsIndex = [];

	var newCallRequest = null;

	if(!window.accessToken) {
		$location.path('/login');
	} else {

		if(window.userName) {
			if(window.userName === 'anon') {
				$rootScope.loginState = "Logout";							
			} else {
				$rootScope.loginState = "Logout " + window.userName;
				$rootScope.loggedIn = true;							
			}
		} else {
			$rootScope.loginState = "Login";						
		}

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
			$scope.callStatus = "Make a Call";
			$scope.$apply();
		});

		att.on('outgoingCall', function (call) {
		    console.log("outgoingCall");
		    $scope.calls[newCallRequest].call = call;
		    callsIndex[call] = newCallRequest;
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
		    newCallRequest = null;
		});

		att.on('incomingCall', function (call) {
		    console.log("callBegin: " + call);
		    var call = new Call('ringing');
		    newCallRequest = calls.length;
		    $scope.calls.push(call);
		});

		att.on('phoneError', function (eventData) {
		    console.log("phoneError: " + eventData);
			showalert("phoneError: " + eventData, "alert-error");
		    $rootScope.hangup();
		    newCallRequest = null;
		});

		att.on('callError', function (eventData) {
		    console.log("callError: " + eventData);
			showalert("callError: " + eventData, "alert-error");
		    $rootScope.hangup();
		    newCallRequest = null;
		});

		// att.on('phoneClose', function () {
		//     console.log("phoneClose");
		//     $rootScope.login();
		// });

		att.on('localVideo', function(stream) {

			console.log("on localVideo");

			var url = webkitURL.createObjectURL(stream);

			var call = $scope.calls[newCallRequest];
			call.localVideoActive = true;
			call.localVideoStream = stream;

			var video = $('#localVideo-' + newCallRequest);
			video.attr("src", url);
			$scope.$apply();
		});

		att.on('remoteVideo', function(stream) {

			console.log("on remoteVideo");

			var url = webkitURL.createObjectURL(stream);

			var call = $scope.calls[newCallRequest];
			call.remoteVideoActive = true;
			call.remoteVideoStream = stream;

			var video = $('#remoteVideo-' + newCallRequest);
			video.attr("src", url);
			$scope.$apply();
		});		

   		$rootScope.att = att;
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

		if(newCallRequest) {
			showalert("Not Allowed - Call Already Being Made", "alert-error");
		} else {

			var call = $scope.calls[leg];
			if(call.talkyAddress) {
				call.talky = new WebRTC({
				    // the id/element dom element that will hold "our" video
				    localVideoEl: 'localVideoFrame-' + leg,
				    // the id/element dom element that will hold remote videos
				    remoteVideosEl: 'remoteVideoFrame-' + leg,
				    // immediately ask for camera access
				    autoRequestMedia: true
				});
				call.talky.on('readyToCall', function () {
				    webrtc.joinRoom(call.remoteAddress, true);
					call.setState("talky", call.remoteAddress);						
				})
			} else {
				newCallRequest = leg;
				$rootScope.att.dial(call.remoteAddress, call.video);
				call.setState("calling", call.remoteAddress);						
			}
		}
	};

	$scope.answer = function(index) {
		var call = $scope.calls[index];
	    $call.answer();
	    call.setState('speaking');
	}

	$scope.hangup = function(index) {
		newCallRequest = null;
		var call = $scope.calls[index];
		if(call){
			if(call.localVideoStream) {
				call.localVideoStream.stop();
			}
			if(call.call) {
				call.call.hangup();
			}
		// $scope.calls.splice[index,1];
		// delete callsIndex[call.call];				
		};
		call.setState('idle');
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
