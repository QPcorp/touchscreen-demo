app.controller('dashboardController', function($scope, $location, $http, appConfig, $rootScope){
	
	$scope.domain = appConfig.domain;

	$scope.user = $rootScope.user.info;
	console.log($scope.user);

	var days = [];
	var days_data = [];
	var chart_data = [];
	var count = 0;
	$scope.loaded = false;

	next_day(0);

    function daysInMonth(month,year) {
    	return new Date(year, month, 0).getDate();
	}

	function next_day(i){
		var today = new Date();
	    var dd = today.getDate();
	    var mm = today.getMonth()+1; //January is 0!

	    var yyyy = today.getFullYear();
	    if(dd<10){
	        dd='0'+dd;
	    } 
	    if(mm<10){
	        mm='0'+mm;
	    }
	    dd = Number(dd - i);
	    if(dd < 1){
	    	var dx = (dd * -1);
	    	mm = today.getMonth();
	    	dd = daysInMonth(mm,yyyy);
	    	dd = Number(dd - dx);
	    }
	    today = mm+'/'+dd+'/'+yyyy;
	    var unix_date = (new Date(today.split("/").join("-")).getTime())/1000;

    	days_data.push(unix_date);
    	days.push(today);	

	    get_data(unix_date);
	}

	function get_data(unix_date){
		console.log(unix_date);
		$http({
			    method: 'GET',
			    url: 'https://'+ appConfig.domain + '/permit/day/' + unix_date + '/' + $scope.user.uid,
			    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
		})
		.success(function(data, status, headers, config) {
			//console.log(data);
			var permits = data.length;
			//console.log(permits);
			chart_data.push(permits);
			//console.log(chart_data);
		})
		.error(function(data, status, headers, config) {
			console.log(data);
		})
		.finally(function(data) {
			if(days_data.length == 6){
				$scope.loaded = true;
				build_chart(chart_data);
			} else {
				count ++;
				next_day(count);
			}
		});
      
	}

	function build_chart(chart_data){
		var data = {
		    labels: days,
		    datasets: [
		        {
		            label: "Permits",
		            fillColor: "rgba(151,187,205,0.2)",
		            strokeColor: "rgba(151,187,205,1)",
		            pointColor: "rgba(151,187,205,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: chart_data//[2, 4, 1, 0, 2, 2, 4, 1, 0, 2, 2, 4, 1, 0, 2, 2, 4, 1, 0, 2, 2, 4, 1, 0, 2, 2, 4, 1, 0, 2]
		        }
		    ]
		};

		var options = {showScale: true, scaleOverride: false, maintainAspectRatio: true, responsive: true};

		var ctx = document.getElementById("myChart").getContext("2d");
		var myBarChart = new Chart(ctx).Bar(data, options);
	}

	$scope.currentPermits = function(){
		var location_id = 'avani';
		var unix_time = Math.round(new Date().getTime()/1000);
		console.log(unix_time);

		$http({
			    method: 'GET',
			    //url: 'https://'+ appConfig.domain + '/permit_property/' + location_id,
			    url: 'https://'+ appConfig.domain + '/permit/current/' + $scope.user.uid + '/' + unix_time,
			    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
		})
		.success(function(data_parked, status, headers, config) {
			$scope.permit_number = data_parked.data.length;
			console.log(data_parked.data);
		})
		.error(function(data, status, headers, config) {
			console.log(data);
		});
	};

	$scope.currentPermits();
	//$scope.permit_number = 10;
	


});