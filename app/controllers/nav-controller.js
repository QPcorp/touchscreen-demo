app.controller('navController', function($scope, $location, $rootScope, $cookieStore){
	

	$scope.user = $rootScope.user.info;


	if($scope.user.user_type == 'master' || $scope.user.user_type == 'admin'){
		$scope.admin_show = true;
	}

	$scope.logout = function(){
		$cookieStore.remove('user');
		$location.path("/");
		window.location.reload(true);
	};

	$scope.reports = function(){
		$('.sub-reports').toggleClass('active-list');
		$('.nav-expand').toggleClass('chevron-down');
		$('.reports-link').toggleClass('down');
	};
	
});