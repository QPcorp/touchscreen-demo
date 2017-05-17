app.controller('payController', function($scope, $rootScope, $location){
	
	$scope.paid = false;

	$scope.payAction = function(){
		$scope.paid = true;
	};

	$scope.goHome = function(){
		$location.path('/');
	};


});