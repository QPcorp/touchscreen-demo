app.controller('editResidentController', function($scope,$routeParams, $location, $http, appConfig, $rootScope, $cookieStore, locationService){

  $scope.resident_id = $routeParams.id;
  console.log($scope.resident_id);
	
	// console.log($rootScope.user);
	// $scope.user = $rootScope.user.info;

  $scope.resident = {};

	$scope.get_resident = function(){
		//Put endpoint for profile
	      $http({
                method: 'GET',
                url: 'https://'+ appConfig.domain + '/user/' + $scope.resident_id,
                data: $scope.resident,
                headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
            })
            .success(function(data, status) {
                  console.log(data);
                  $scope.resident.first_name = data.first_name;
                  $scope.resident.last_name = data.last_name;
                  $scope.resident.user = data.user;
                  $scope.resident.phone = data.phone;
                  $scope.resident.email = data.email;
                  $scope.resident.suite_id = data.suite_id;
                  $scope.resident.parking_spot = data.parking_spot;
                  $scope.resident.permits_allowed = Number(data.permits_allowed);
                  $scope.resident.user_type = data.user_type;
            })
            .error(function(data, status, headers, config) {
                  console.log(data);
            });
	};

  $scope.get_resident();

  $scope.edit_resident = function(){
    //Put endpoint for profile
        $http({
                method: 'PUT',
                url: 'https://'+ appConfig.domain + '/user/' + $scope.resident_id,
                data: $scope.resident,
                headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
            })
            .success(function(data, status) {
                  console.log(data);
            })
            .error(function(data, status, headers, config) {
                  console.log(data);
            }).finally(function(){
              $location.path('/residents');
            });
  };

});