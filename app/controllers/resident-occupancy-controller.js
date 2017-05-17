app.controller('residentOccupancyController', function($scope, $location, $http, appConfig, $rootScope, $cookieStore, locationService){

	console.log($rootScope.user);
	$scope.user = $rootScope.user.info;

	// locationService.getLocations().then(function (data){
 	//  $scope.locations = $rootScope.user.locations;
	// });

	$scope.currentPermits = function(){
		var unix_time = Math.round(new Date().getTime()/1000);
		console.log(unix_time);
		console.log(unix_time - 14400);
		unix_time = unix_time - 14400;


		var t = new Date(unix_time * 1000);

		$scope.current_unit_time = t;

		$http({
			    method: 'GET',
			    //url: 'https://'+ appConfig.domain + '/permit_property/' + location_id,
			    url: 'https://'+ appConfig.domain + '/occupancy/resident',
			    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
		})
		.success(function(data_parked, status, headers, config) {
			//$scope.parked = data_parked;
			console.log(data_parked);

			if(data_parked.length < 1){
				$scope.no_permits = true;
			}

			var columns = [
				{"sTitle":"Entry Time", "mData": 'InTime'},
				{"sTitle":"LPN", "mData":"LPN"},
				{"sTitle":"Exit Time", "mData":"OutTime"},
				{"sTitle":"Lot Id", "mData":"LotId"},
				{"sTitle":"Color", "mData":"Color"},
				{"sTitle":"Event Id", "mData":"EventId"}
				//{"sTitle":"Remove", "sClass": "remove-location"}

			];

			//CreateTime, Begin Time, ExpiryTime, Suite ID, First Name, Last Name, Phone, Email, LPN, Make, Model, Color, PermitTag
			$('#current-permits-table').dataTable({
		        "data": data_parked.data,
		        "columns":columns,
                "columnDefs": [
                	{
		            	"targets": 1,
						"data": function ( row, type, val, meta ) {
		            		var x = row.BeginTime;
							x = x.slice(-8);
							x = Number(x.substring(0,2));
							x = x - 4;
							x = '0' + x + ':00:00';

							var y = row.BeginTime;
							y = y.substring(0,10);
							y = y +' '+ x;

							console.log(y);

		            		return y;
		            	},
		            },
		            {
		            	"targets": 2,
						"data": function ( row, type, val, meta ) {
							var x = row.ExpiryTime;
							x = x.slice(-8);
							x = Number(x.substring(0,2));
							x = x - 4;
							x = '0' + x + ':00:00';

							var y = row.ExpiryTime;
							y = y.substring(0,10);
							y = y +' '+ x;

							console.log(y);

		            		return y;
		            	}
		        	},
		        	{
		        		"targets": 3,
		        		"type": "numeric-comma"
		        	},
		        ],
		    });
		})
		.error(function(data, status, headers, config) {
			console.log(data);
		});
	};

	$scope.currentPermits();

	jQuery.extend( jQuery.fn.dataTableExt.oSort, {
		"numeric-comma-pre": function ( a ) {
			var x = (a == "-") ? 0 : a.replace( /,/, "." );
			return parseFloat( x );
		},

		"numeric-comma-asc": function ( a, b ) {
			return ((a < b) ? -1 : ((a > b) ? 1 : 0));
		},

		"numeric-comma-desc": function ( a, b ) {
			return ((a < b) ? 1 : ((a > b) ? -1 : 0));
		}
	} );

});