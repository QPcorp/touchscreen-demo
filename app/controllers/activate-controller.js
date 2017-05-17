app.controller('activateController', function($scope, $location, $routeParams, $http, $rootScope, appConfig, $cookieStore){
	
	// $scope.login = {};
	// $rootScope.user = {};

	// setTimeout(function(){
	// 	$scope.submit_disabled = true;
	// }, 5000);
	

	var uid = $routeParams.uid;
	console.log(uid);

	$scope.activate = {};
	$scope.activate.uid = uid;
	$scope.activate.password = '';
	$scope.submit_disabled = true;

	$scope.$watch('activate', function(){
		console.log('changed');
		//console.log($scope.activate);
		if($scope.activate.password.length < 7 && $scope.activate.password.length > 0){
			$scope.login_error = true;
			$scope.error_txt = 'Password is too short (Minimum 8).';
			$scope.submit_disabled = true;
		} else if($scope.activate.password != $scope.activate.new_password && $scope.activate.password.length > 7){
			$scope.login_error = true;
			$scope.error_txt = 'Passwords do not match.';
			$scope.submit_disabled = true;
		} else {
			$scope.login_error = false;
			$scope.submit_disabled = false;
		}
	}, true);

	$scope.passwordSet = function(){
		//console.log($scope.activate);
		if($scope.submit_disabled !== false){
			$scope.activate.login_error = true;
		} else {
			//Put endpoint for profile
			var url = 'https://'+ appConfig.domain + '/user/password';
			$http.put(url, $scope.activate, config)
	            .success(function (data, status, headers, config) {
	            	console.log(data);
	            })
	            .error(function (data, status, header, config) {
	            	console.log(data);
	            });

	        var url2 ='https://'+ appConfig.domain + '/user/activate'; 
	        $http.put(url2, $scope.activate, config)
	            .success(function (data, status, headers, config) {
	            	console.log(data);
	            })
	            .error(function (data, status, header, config) {
	            	console.log(data);
	            })
	            .finally(function(){
	            	$cookieStore.remove('user');
	            	$location.path("/");
	            });
	    }
	};

});