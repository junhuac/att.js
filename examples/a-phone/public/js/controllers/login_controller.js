angular.module("app").controller('LoginController', function($scope, $rootScope, $location) {

	if(window.accessToken) {
		$location.path('/loggedin');
	} else {

		$rootScope.loginState = "Login";
		// $rootScope.loginUrl = "/auth";

	};

	$rootScope.login = function() {

		if( $rootScope.att) {
			$rootScope.att.logout();
			delete $rootScope.att;
			window.location = "/logout";
		} else {
			window.location = "/auth";		
		}
	};

});
