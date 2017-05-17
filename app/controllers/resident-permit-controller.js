app.controller('residentPermitController', function($scope, $location, $http, appConfig, $rootScope, $cookieStore, locationService){
	
	console.log($rootScope.user);

	$scope.user = $rootScope.user.info;

	$scope.visitorPermit = {};
	$scope.visitorPermit.data = {};
	$scope.visitorPermit.views = ['visitor', 'vehicle', 'time'];
	$scope.visitorPermit.vehicleSearch = false;
	$scope.visitorPermit.data.user = 0;
	$scope.visitorPermit.lots = [
		{"id":"b06memz7ms39wo2tnyl5", "name":"Main Lot - Visitor"}, 
		{"id":"xcic6y0b0a04oygof2va", "name":"P1"},
		{"id":"q09l3yp0tspr0u3v2r7x", "name":"Level 2"}
	];
	$scope.visitorPermit.data.lot = 0;
	$scope.resident_check = [];
	$scope.visitorPermit.data.selected_lots = [];
	//Main Lot, lot A, Lot B

	$scope.pushLot = function(lot){
		var index = $scope.visitorPermit.data.selected_lots.indexOf(lot);
		if(index > -1){
			$scope.visitorPermit.data.selected_lots.splice(index, 1);
		} else {
			$scope.visitorPermit.data.selected_lots.push(lot);
		}
		console.log($scope.visitorPermit.data.selected_lots);
	};

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

			//Used to check if user is in array before next
			for(z = 0; z < resident_data.length; z ++){
				$scope.resident_check.push(resident_data[z].user);
			}

			$( "#residents" ).autocomplete({
		      source: function (request, response) {
			           //data :: JSON list defined
			           response($.map(resident_data, function (value, key) {
			           	console.log(value);
			           	console.log(key);
			                return {
			                    label: value.user,
			                    value: value.user,
			                    uid: value.uid
			                };
			            }));
			          
			    },
			    select: function(event, ui){
			    	console.log(event);
			    	console.log(ui);

			    	$http({
						    method: 'GET',
						    url: 'https://'+ appConfig.domain + '/user/'+ui.item.uid,
						    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
					})
					.success(function(info, status, headers, config) {
						console.log(info);
						$scope.resident = info;


						$scope.visitorPermit.data.first_name = $scope.resident.first_name;
						$scope.visitorPermit.data.last_name = $scope.resident.last_name;
						$scope.visitorPermit.data.email = $scope.resident.email;
						$scope.visitorPermit.data.phone = $scope.resident.phone;
						$scope.visitorPermit.data.user = $scope.resident.user;
						$scope.visitorPermit.data.vistor_suite = $scope.resident.suite_id;




			    	})
			    	.error(function(data, status, headers, config) {
						console.log(data);
					});
				}
		      // select: function(event, ui) { 
		      //   console.log(ui.item ? "Selected: " + ui.item.value + " aka " + ui.item.id : "Nothing selected, input was " + this.value); 
		      // } 
		    });

			$scope.residents = resident_data;
		})
		.error(function(data, status, headers, config) {
			console.log(data);
		});
	};


	//Get residents for the Visitor Window
	$scope.residents();


	//Tracking for Window Status
	var i = 0;
	$scope.visitorPermit.window = $scope.visitorPermit.views[i];

	$scope.visitorPermit.visitorNext = function(){
		console.log($scope.visitorPermit.data);
		console.log($scope.visitorPermit.window);
		$scope.visitorPermit.next = true;
		i ++;
		$scope.visitorPermit.window = $scope.visitorPermit.views[i];
		if($scope.visitorPermit.window == 'time'){
			$scope.custom_click();
		}
		console.log($scope.visitorPermit.window);
	};

	$scope.visitorPermit.visitorPrevious = function(){
		$scope.visitorPermit.next = false;
		i --;
		$scope.visitorPermit.window = $scope.visitorPermit.views[i];
	};

	$scope.visitorPermit.next = true;

	$scope.$watch('visitorPermit.data', function(){
		// console.log('data changed');
		console.log($scope.visitorPermit.window);

		//Visitor Window Validity
		if($scope.visitorPermit.window == 'visitor'){
			if($scope.resident !== 0 && $scope.visitorPermit.data.vistor_suite && $scope.visitorPermit.data.first_name && $scope.visitorPermit.data.last_name && $scope.visitorPermit.data.phone && $scope.visitorPermit.data.email && $scope.visitorPermit.data.selected_lots.length > 0){
				$scope.visitorPermit.next = false;
			} else {
				$scope.visitorPermit.next = true;
			}
		} 

		//Vehicle Window Validity
		if($scope.visitorPermit.window == 'vehicle'){
			if($scope.visitorPermit.data.vehicle_license && $scope.visitorPermit.data.vehicle_make && $scope.visitorPermit.data.vehicle_model && $scope.visitorPermit.data.vehicle_color){
				$scope.visitorPermit.next = false;
			} else {
				$scope.visitorPermit.next = true;
			}
		}

		//Time Window Validity
		// if($scope.visitorPermit.window == 'time'){
		// 	if($scope.visitorPermit.data.permit_type && $scope.visitorPermit.data.permit_type != 'custom_permit'){
		// 		$scope.visitorPermit.next = false;
		// 	} else if($scope.visitorPermit.data.permit_type == 'custom_permit'){
		// 			$scope.visitorPermit.next = true;
		// 			if($scope.visitorPermit.data.permit_start_date && $scope.visitorPermit.data.permit_start_time && $scope.visitorPermit.data.permit_end_date && $scope.visitorPermit.data.permit_end_time){
		// 				$scope.visitorPermit.next = false;
		// 			} else {
		// 				$scope.visitorPermit.next = true;
		// 			}
		// 	} else {
		// 		$scope.visitorPermit.next = true;
		// 	}
		// }

		
	}, true);

	$scope.custom_click = function(){
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
	    today = mm+'/'+dd+'/'+yyyy;
		$scope.visitorPermit.data.permit_start_date = today;
		$scope.visitorPermit.data.permit_start_time = "8:00am";
		$scope.visitorPermit.data.permit_end_date = today;
		$scope.visitorPermit.data.permit_end_time = "8:00pm";
		$scope.visitorPermit.next = false;
	};



	Date.prototype.yyyymmdd = function() {
	   var yyyy = this.getFullYear().toString();
	   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	   var dd  = this.getDate().toString();
	   return yyyy + '-'+ (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
	};

	Date.prototype.addDays = function(days)
	{
	    var dat = new Date(this.valueOf());
	    dat.setDate(dat.getDate() + days);
	    return dat;
	};



	$scope.visitorPermit.visitorCreate = function(){

		// var d = '';
		// var bd = '';
		// var begin_time = '';
		// var ed = '';
		// var expire_time = '';

		$scope.visitorPermit.next = true;

		$http({
			    method: 'GET',
			    //url: 'https://'+ appConfig.domain + '/permit_property/' + location_id,
			    url: 'https://'+ appConfig.domain + '/timezone/jtyhp3dwgs3j6v8cl2zl',
			    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
		})
		.success(function(datax, status, headers, config) {
			console.log(datax[0].UTCOffset);
			var offset = datax[0].UTCOffset;

			begin_date = convertDate($scope.visitorPermit.data.permit_start_date);
			end_date = convertDate($scope.visitorPermit.data.permit_end_date);

			var new_day = 0;

			var start_hour = 0 + (Number(offset) * -1);
			if(start_hour < 10){
				start_hour = "0" + start_hour.toString();
			}

			var end_hour = 24 + (Number(offset) * -1);
			if(end_hour > 24){
				var x = new Date(end_date);
				x = x.addDays(2);
				x = x.yyyymmdd();
				console.log('value:' + x);
				end_date = x;

				end_hour = 0 + (Number(offset) * -1);
				if(end_hour < 10){
					end_hour = "0" + end_hour.toString();
				}
			}
			//var y = new Date('2013-05-23');

			if(begin_date > end_date){
				$scope.date_error = true;
			} else {

				$scope.date_error = false;
			
				console.log(begin_date);
				console.log(end_date);

				for(n = 0; n < $scope.visitorPermit.data.selected_lots.length; n ++){

					var data = { "creator_uid": $scope.user.uid, "company_id": $scope.user.company_id, "property_id": "jtyhp3dwgs3j6v8cl2zl", "lot_id": $scope.visitorPermit.data.selected_lots[n], "suite_number": $scope.visitorPermit.data.vistor_suite, "first_name": $scope.visitorPermit.data.first_name, "last_name": $scope.visitorPermit.data.last_name, "phone": $scope.visitorPermit.data.phone, "email": $scope.visitorPermit.data.email, "license_number": $scope.visitorPermit.data.vehicle_license, "car_make": $scope.visitorPermit.data.vehicle_make, "car_model": $scope.visitorPermit.data.vehicle_model, "car_color": $scope.visitorPermit.data.vehicle_color, "begin_time": begin_date + " " + start_hour + ":00:00", "expire_time":end_date + " " + end_hour +":00:00", "role":"resident", "permit_class":"Resident" };


					console.log(data);
					createPermit(data, n);
					//$http.post('https://'+ appConfig.domain + '/permit', data)
					
				}
			}
		})
		.error(function(data, status, headers, config) {
			console.log(data);
		});

	};

	function createPermit(data, n){
		$http({
		    method: 'POST',
		    url: 'https://'+ appConfig.domain + '/permit',
		    data: data,
		    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
		})
		.success(function(data, status) {
            console.log(data);
        })
        .error(function(data, status, headers, config) {
			console.log(data);
		})
		.finally(function(){
			if(n == ($scope.visitorPermit.data.selected_lots.length -1)){
				$location.path("/current-permits");
			} 
		});
	}

	// jquery not triggering update for scope

	var convertDate = function(usDate) {
		var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
		return dateParts[3] + "-" + dateParts[1] + "-" + dateParts[2];
	};

	// var timeConvert = function(time){
	// 	var time_pre = time.substring(0, 5);
	// 	var time_set = time_pre.split(":");
	// 	var hours = Number(time_set[0]);
	// 	var minutes = Number(time_set[1]);
	// 	var AMPM = time_pre.slice(-2); //match(/\s(.*)$/)[1];
	// 	if(AMPM == "pm" && hours<12) hours = hours+12;
	// 	if(AMPM == "am" && hours==12) hours = hours-12;
	// 	var sHours = hours.toString();
	// 	var sMinutes = minutes.toString();
	// 	if(hours<10) sHours = "0" + sHours;
	// 	if(minutes<10) sMinutes = "0" + sMinutes;
	// 	return sHours + ":" + sMinutes + ":00";
	// };

	function permit_custom_enable(){
		if($("#datepicker").val() !== '' && $("#datepicker2").val() !== '' && $('#timepicker').val() !== '' && $('#timepicker2').val() !== ''){
			$scope.visitorPermit.next = false;
		} else {
			$scope.visitorPermit.next = true;
		}
		// if($('#timepicker').val() !== '' && $('#timepicker2').val() !== ''){
		// 	$scope.visitorPermit.next = false;
		// }
	}

	//Date Picker
    $( "#datepicker" ).datepicker({
        onSelect: function(dateText) {
            console.log(dateText + " " + this.value);
            var datestr = dateText;
            var start = (new Date(datestr.split("/").join("-")).getTime());///1000;
            console.log(start);
            $scope.$apply(function() {
			    $scope.visitorPermit.data.permit_start_date = dateText;
			});
			permit_custom_enable();
        }
    });

    //Date Picker 2
    $( "#datepicker2" ).datepicker({
        onSelect: function(dateText) {
            console.log(dateText + " " + this.value);
            var datestr = dateText;
            var end = convertDate(dateText);//dateText.split("/").join("-");//.getTime());///1000;
            console.log(end);
            $scope.$apply(function() {
			    $scope.visitorPermit.data.permit_end_date = dateText;
			});
			permit_custom_enable();
        }
    });

 //    $('#timepicker').timepicker();
 //    $('#timepicker').on('changeTime', function() {
 //    	    $scope.$apply(function() {
	// 		    $scope.visitorPermit.data.permit_start_time = $('#timepicker').val();
	// 		});
	// 		//permit_custom_enable();

	// });

 //    $('#timepicker2').timepicker();
 //    $('#timepicker2').on('changeTime', function() {
	//     $scope.$apply(function() {
	// 	    $scope.visitorPermit.data.permit_end_time = $('#timepicker2').val();
	// 	});
	// 	//permit_custom_enable();
	// });


});