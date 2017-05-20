app.controller('welcomeController', function($scope, $rootScope, $location){

	$scope.welcome = function(){
		$location.path('/start');
	};

});