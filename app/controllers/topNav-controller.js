app.controller('topNavController', function($scope, $location, $rootScope, $cookieStore){
	
	$scope.logout = function(){
		$cookieStore.remove('user');
		$location.path("/");
		window.location.reload(true);
	};

	$scope.menu = function(){
		$("#wrapper").toggleClass("toggled");
		$('.menu-open').toggleClass('closed');
	};

	if($location.path() === '/' || $location.path() === '/activate'){
		$('#top-nav').hide();
	}
});