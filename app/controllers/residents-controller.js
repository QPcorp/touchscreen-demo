app.controller('residentsController', function($scope, $location, $http, appConfig, $rootScope, $cookieStore, locationService){

	console.log($rootScope.user);
	$scope.user = $rootScope.user.info;

	// locationService.getLocations().then(function (data){
 	//  $scope.locations = $rootScope.user.locations;
	// });

	var tap = 0;

	$scope.residents = function(){

		$http({
			    method: 'GET',
			    //url: 'https://'+ appConfig.domain + '/permit_property/' + location_id,
			    url: 'https://'+ appConfig.domain + '/residents',
			    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
		})
		.success(function(resident_data, status, headers, config) {
			//$scope.parked = resident_data;
			console.log(resident_data);

			if(resident_data.length < 1){
				$scope.no_permits = true;
			}

			var columns = [
				{"sTitle":"Suite Id", "mData": 'suite_id'},
				{"sTitle":"Username", "mData": 'user'},
				{"sTitle":"First Name", "mData":"first_name"},
				{"sTitle":"Last Name", "mData":"last_name"},
				{"sTitle":"Email", "mData":"email"},
				{"sTitle":"Phone", "mData":"phone"},
				{"sTitle":"Created Date", "mData":"created"},
				{"sTitle":"Active", "mData":"active"},
				//{"sTitle":"Uid", "mData":"uid", "sClass":"uid"},
				{"sTitle":"Parking Spot", "mData":"parking_spot", "sClass":"parking_spot"},
				{"sTitle":"Edit", "sClass": "edit-resident"},
				{"sTitle":"Remove", "sClass": "remove-resident"}
			];

			$('#residents-table').dataTable({
		        "data": resident_data,
		        "columns":columns,
                "columnDefs": [{
		            "targets": -1,
		            "data": function ( row, type, val, meta ) {
		            		var user = row.uid; 
		        //     		var el = '<button class="btn btn-success btn-sm edit-resident" ng-click="editResident('+user+');">Edit</button>';
						    // var element = angular.element(document.querySelector('#edit-resident'));
						    // var generated = element.html(el);
						    // $compile(generated)($scope);

		            		return '<button class="btn btn-danger btn-sm delete-resident" data-uid="'+user+'" ng-click="editResident('+user+');">Remove</button>';
		            	}
		            //"defaultContent": '<button class="btn btn-danger btn-sm delete-resident">Remove</button>'
		        },
		        {
		            "targets": -2,
		            "data": function ( row, type, val, meta ) {
		            		var user = row.uid; 
		        //     		var el = '<button class="btn btn-success btn-sm edit-resident" ng-click="editResident('+user+');">Edit</button>';
						    // var element = angular.element(document.querySelector('#edit-resident'));
						    // var generated = element.html(el);
						    // $compile(generated)($scope);

		            		return '<button class="btn btn-success btn-sm edit-resident" data-uid="'+user+'" ng-click="editResident('+user+');">Edit</button>';
		            	}
		        }],
		        responsive: true
		    });

		    $('#content').on('click','.delete-resident', function(){
		    	//var uid = $(this).parent().parent().find('.uid').text();
		    	var uid = $(this).data('uid');
		    	console.log(uid);

		    	$http({
				    method: 'DELETE',
				    //url: 'https://'+ appConfig.domain + '/permit_property/' + location_id,
				    url: 'https://'+ appConfig.domain + '/user/remove/' + uid,
				    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
				})
				.success(function(resident_data, status, headers, config) {
					console.log(resident_data);
					location.reload();

				})
				.error(function(data, status, headers, config) {
					console.log(data);
				});
		    });

		    //edit resident
	        $('#residents-table').on('click','.edit-resident', function(){
		    	var uid = $(this).data('uid');//$(this).parent().parent().find('.uid').text();
		    	console.log(uid);
		    	//This prevents a double redirect - not sure how or why.
		    	tap ++;
		    	if(tap == 1){
		    		window.location = '/#/edit-resident/'+uid;
		    	} else {
		    		//window.location = '/#/edit-resident/'+uid;
		    		console.log('no redirect');
		    	}
		    });

		})
		.error(function(data, status, headers, config) {
			console.log(data);
		});

	};

	$scope.residents();

	$scope.editResident = function(x){
		console.log(x);
		alert('test');
	};



	// $scope.dropdown_selected = function(location_id){
	// 	if($('#currently-parked-table tr').length > 1){
	// 		$('#currently-parked-table').DataTable().destroy();
	// 	}
	// 	$('.dropdown').removeClass('active');
		
	// 	$http({
	// 		    method: 'GET',
	// 		    url: 'https://reports.qpme.com/operator/'+ $rootScope.user.info.operator_id + '/opensessions/' + location_id,
	// 		    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
	// 	})
	// 	.success(function(resident_data, status, headers, config) {
	// 		$scope.parked = resident_data;

	// 		var columns = [];
	// 		for (var key in resident_data[0]) {
	// 		  if (resident_data[0].hasOwnProperty(key)) {
	// 		    columns.push({"sTitle":key, "mData":key});
	// 		  }
	// 		}
	// 		if(resident_data.length === 0){
	// 			$('.error').html("No cars are currently parked at the selected location.");
	// 			$('#currently-parked-table').hide();
	// 			$('.error').show();
	// 		} else {
	// 			$('.error').hide();
	// 			$('#currently-parked-table').show();

	// 			console.log(columns);
	// 			$('#currently-parked-table').dataTable({
	// 		        "data": resident_data,
	// 		        "columns":columns
	// 		    });
	// 		}
	// 	})
	// 	.error(function(data, status, headers, config) {
	// 		console.log(data);
	// 	});
	// };

	// $scope.expandDropdown = function(){
	// 	$('.dropdown').toggleClass('active');
	// };

});