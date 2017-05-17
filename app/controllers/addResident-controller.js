app.controller('addResidentController', function($scope, $location, $http, appConfig, $rootScope, $cookieStore, locationService){
	
	// console.log($rootScope.user);
	// $scope.user = $rootScope.user.info;

      $scope.resident = {};
      $scope.resident.level = 3;
      $scope.resident.user_type = 'resident';
      $scope.resident.password = "123456";
      $scope.resident.company_id = 't37rjido2qcxpnihkb3w';
      $scope.resident.active = 0;

	$scope.add_resident = function(){
		//Put endpoint for profile
	      $http({
                method: 'POST',
                url: 'https://'+ appConfig.domain + '/user',
                data: $scope.resident,
                headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
            })
            .success(function(data, status) {
                  console.log(data);
                  if(data.error){
                    $scope.error_text = data.msg;
                  } else {
                    $location.path("/residents");
                  }
                  //$location.path("/current-permits");
            })
            .error(function(data, status, headers, config) {
                  console.log(data);
            });
	};



});