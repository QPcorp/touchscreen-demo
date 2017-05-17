//Basic Controller
app.controller('basicController', function($scope, $log){
	this.product = gem;
	this.items = item;

	//Error Messages and examples of functions - ng-click = "$log.log(log_message)"
	$scope.$log = $log;
	$scope.log_message = 'This is a logged message';
	$scope.info_message = 'This is an info message';
	$scope.warn_message = 'This is a warning message';
	$scope.error_message = 'This is an error form message';
	
	$log.log($scope.log_message);
	$log.info($scope.info_message);
	$log.warn($scope.warn_message);
	$log.error($scope.error_message);

});