app.controller('userProfileController', function($scope, $location, $http, appConfig, $rootScope, $cookieStore, locationService){
	
	console.log($rootScope.user);
	$scope.user = $rootScope.user.info;
      $scope.reset = {};
      $scope.reset.uid = $scope.user.uid;

	$scope.save_profile = function(){
		//Put endpoint for profile
		//var url = 'https://'+ appConfig.domain + '/user';
		//$http.put(url, $scope.user, config)
            $http({
                method: 'PUT',
                url: 'https://'+ appConfig.domain + '/user',
                data: $scope.user,
                headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
            })
            .success(function (data, status, headers, config) {
            	console.log(data);
            	$scope.user = data.data;
            	$rootScope.user.info = data.data;
                  $cookieStore.put("user", $rootScope.user);
            	console.log($rootScope.user.info);
            })
            .error(function (data, status, header, config) {
            	console.log(data);
            })
            .finally(function(){
            	location.reload();
            });
	};

      $scope.passwordSet = function(){
            console.log($scope.activate);
            //Put endpoint for profile
            var url = 'https://'+ appConfig.domain + '/user/password';
            $http.put(url, $scope.reset, config)
            .success(function (data, status, headers, config) {
                  console.log(data);
            })
            .error(function (data, status, header, config) {
                  console.log(data);
            })
            .finally(function(){
                  $scope.password_input = false;
            

              var auth = Base64.encode($scope.user.user + ':' + $scope.reset.password);

              $http({
                  method: 'GET',
                  url: 'https://'+ appConfig.domain +'/login',
                  headers: {'Content-Type': 'application/json', "Authorization": "Basic " + auth}
              })
              .success(function(data, status, headers, config) {
                console.log(data);

                // $scope.user = data.data;
                // $rootScope.user.info = data.data;
                // $cookieStore.put("user", $rootScope.user);
                // console.log($rootScope.user.info);

                $rootScope.user.basicAuth = auth;
                $cookieStore.put("user", $rootScope.user);

              })
              .error(function(data, status, headers, config) {
                console.log(data);
              });
          });
      };

});