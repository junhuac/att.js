angular.module("app").controller('LoginController', function($scope, $rootScope, $location) {

	if(window.accessToken) {
		$location.path('/loggedin');
	} else {

		$rootScope.loginState = "Start";
		// $rootScope.loginUrl = "/auth";

	};

	$rootScope.login = function() {

		if( $rootScope.loginState === "Start") {
			window.location = "/start";		
		} else if( $rootScope.loginState === "Login") {
			window.location = "/auth";		
		} else {
			if($rootScope.att) {
				$rootScope.att.logout();
				delete $rootScope.att;				
			}
			window.location = "/logout";
		}
	};

});
