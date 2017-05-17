app.controller('loginController', function($scope, $location, $http, $rootScope, appConfig, $cookieStore){
	
	$scope.login = {};
	$rootScope.user = {};
	$scope.password_email = false;

	$scope.auth = function(login){
		console.log(login);
		
		var auth = Base64.encode(login.username + ':' + login.password);

		$http({
		    method: 'GET',
		    url: 'https://'+ appConfig.domain +'/login',
		    //data: login,
		    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + auth}
		})
		.success(function(data, status, headers, config) {
			console.log(data);
			$scope.login_error = false;

			
			var username = login.username;

			$rootScope.user.basicAuth = auth;
			$rootScope.user.info = data[0];
			$rootScope.user.login = username;

			//Get Operator Locations
			//var locations = $scope.getLocations();
			//console.log(locations);
			//$rootScope.user.locations = locations;

			//Store as Cookie
			$cookieStore.put("user", $rootScope.user);

			console.log($rootScope.user);

			//Direct User to Dashboard
			//$location.path("/dashboard");
			if($rootScope.user.info.user_type == 'resident'){
				$location.path("/visitor-permit");
			} else {
				$location.path("/dashboard");
			}
			

			$('#top-nav').show();
		})
		.error(function(data, status, headers, config) {
			$scope.login_error = true;
		});
		// .finally(function(data){
		// 	if(data.code == "401"){
		// 		$scope.login_error = true;
		// 		alert('wtf');
		// 	}
		// });

		//$location.path("/dashboard");
	};

	$scope.forgot_password = function(){
		
		var url = 'https://'+ appConfig.domain + '/user/password_reset';
		$http.post(url, $scope.login_forgot, config)
            .success(function (data, status, headers, config) {
            	console.log(data);
            	if(data.user === false){
            		$scope.user_error = true;
            	} else {
            		$scope.user_error = false;
            		$scope.password_email = true;
            	}
            })
            .error(function (data, status, header, config) {
            	console.log(data);
            });
            
	};

	$scope.reload = function(){
		location.reload();
	};

});