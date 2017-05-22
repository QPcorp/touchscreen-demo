app.controller('payController', function($scope, $rootScope,$timeout, $location){
	
	$scope.paid = false;

	$scope.payAction = function(){
		$scope.paid = true;
	};

	$timeout(function(){
		$scope.paid = true;
	}, 4000);

	$scope.goHome = function(){
		$location.path('/');
	};


});