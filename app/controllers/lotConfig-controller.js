app.controller('lotConfigController', function($scope, $location, $http, appConfig, $rootScope, $cookieStore, locationService){
	
	// console.log($rootScope.user);
	// $scope.user = $rootScope.user.info;

  $scope.lot_list = [];
  $scope.lot_maxx = 0;
  $scope.permit = {};
  $scope.lot_hold = '';

  $scope.lots = function(){

    $http({
          method: 'GET',
          url: 'https://'+ appConfig.domain + '/property/jtyhp3dwgs3j6v8cl2zl/lots',
          headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
    })
    .success(function(lot_data, status, headers, config) {
      console.log(lot_data);
      $scope.lot_list = lot_data;
    })
    .error(function(data, status, headers, config) {
      console.log(data);
    });
  };

  $scope.lot_max_permit = function(lot_id){
    console.log(lot_id);
    $scope.lot_hold = lot_id;
    $http({
          method: 'GET',
          url: 'https://'+ appConfig.domain + '/property/jtyhp3dwgs3j6v8cl2zl/lots/'+lot_id,
          headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
    })
    .success(function(lot_data, status, headers, config) {
      console.log(lot_data);
      $scope.lot_max = lot_data[0].MaxPermits;
      console.log($scope.lot_max);
      $scope.permit = {
        "max": lot_data[0].MaxPermits
      };
    })
    .error(function(data, status, headers, config) {
      console.log(data);
    });
  };

  $scope.lots();


	$scope.max_permits = function(){
    console.log('test');
    console.log($scope.permit);
    $scope.permit.max = $scope.lot_max;
    console.log($scope.permit);
    $http({
            method: 'PUT',
            url: 'https://'+ appConfig.domain + '/lot/'+$scope.lot_hold + '/max_permits',
            data: $scope.permit,
            headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
      })
      .success(function(data, status) {
            console.log(data);
      })
      .error(function(data, status, headers, config) {
            console.log(data);
      });
	};



});