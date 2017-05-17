app.controller('visitorPermitController', function($scope, $location, $http, appConfig, $rootScope, $cookieStore, locationService, notifications){
	
	console.log($rootScope.user);

	$scope.user = $rootScope.user.info;

	$scope.visitorPermit = {};
	$scope.visitorPermit.data = {};
	$scope.visitorPermit.views = ['visitor', 'vehicle', 'time'];
	$scope.visitorPermit.vehicleSearch = false;
	$scope.loaded = false;

	if($scope.user.user_type == 'resident'){
		$scope.visitorPermit.data.vistor_suite = $scope.user.suite_id;
		$http({
			    method: 'GET',
			    url: 'https://'+ appConfig.domain + '/permit/resident/' + $scope.user.suite_id,
			    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
		})
		.success(function(data, status, headers, config) {
			console.log(data);
			$scope.resident_permits = data;
			
		})
		.error(function(data, status, headers, config) {
			console.log(data);
		});
	}


	$scope.visitorPermit.data.phone = '';
	$scope.visitorPermit.data.email = '';
	$scope.visitorPermit.data.vehicle_model = '';

	$scope.visitorPermit.status = false;

	var date = new Date();
	$scope.visitorPermit.data.permit_start_date = ((date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear());

	$scope.visitorPermit.statusCheck = function(){
		var unix = Math.floor(Date.now() / 1000);

		$http({
			    method: 'GET',
			    //url: 'https://'+ appConfig.domain + '/permit_property/' + location_id,
			    url: 'https://'+ appConfig.domain + '/permit/status/'+ $scope.user.uid + '/' + unix,
			    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
		})
		.success(function(data, status, headers, config) {
			console.log(data);
			if(data.limit_error === true){
				$scope.visitorPermit.limit_error = true;
				$scope.loaded = true;
			} else {
				$scope.visitorPermit.limit_error = false;
				$scope.loaded = true;
			}
		})
		.error(function(data, status, headers, config) {
			console.log(data);
		});
	};
	$scope.visitorPermit.statusCheck();


	var i = 0;
	$scope.visitorPermit.window = $scope.visitorPermit.views[i];

	$scope.visitorPermit.visitorNext = function(){
		console.log($scope.visitorPermit.data);
		$scope.visitorPermit.next = true;
		
		if($scope.visitorPermit.window == 'vehicle'){
			console.log('ran resident permit check');
			if($scope.user.user_type == 'resident' && $scope.resident_permits.length > 0){
				for(z = 0; z < $scope.resident_permits.length; z ++){
					console.log('looped through resident lpns');
					if($scope.visitorPermit.data.vehicle_license == $scope.resident_permits[z].LPN){
						console.log('INVALID LPN');
						$scope.lpn_invalid = true;
						return;
					}
					console.log(z, $scope.resident_permits.length);
					if(z == ($scope.resident_permits.length -1)){
						console.log('no issue - move forward');
						$scope.lpn_invalid = false;
						i ++;
						$scope.visitorPermit.window = $scope.visitorPermit.views[i];
					}
				}
			} else {
				i ++;
				$scope.visitorPermit.window = $scope.visitorPermit.views[i];
			}
		} else {
			i ++;
			$scope.visitorPermit.window = $scope.visitorPermit.views[i];
		}
	};

	$scope.visitorPermit.visitorPrevious = function(){
		$scope.visitorPermit.next = false;
		i --;
		$scope.visitorPermit.window = $scope.visitorPermit.views[i];
	};


	$scope.visitorPermit.next = true;

	$scope.$watch('visitorPermit.data', function(){
		//console.log('data changed');
		//console.log($scope.visitorPermit.window);

		//Visitor Window Validity
		if($scope.visitorPermit.window == 'visitor'){
			if($scope.visitorPermit.data.vistor_suite && $scope.visitorPermit.data.first_name && $scope.visitorPermit.data.last_name && $scope.visitorPermit.data.phone){
				$scope.visitorPermit.next = false;
			} else {
				$scope.visitorPermit.next = true;
			}
		} 

		//Vehicle Window Validity
		if($scope.visitorPermit.window == 'vehicle'){
			if($scope.visitorPermit.data.vehicle_license && $scope.visitorPermit.data.vehicle_make && $scope.visitorPermit.data.vehicle_color){
				$scope.visitorPermit.next = false;
			} else {
				$scope.visitorPermit.next = true;
			}
		}

		//Time Window Validity
		if($scope.visitorPermit.window == 'time'){
			if($scope.visitorPermit.data.permit_type == 'custom_permit'){
				$scope.visitorPermit.next = false;
				if($scope.visitorPermit.data.permit_start_date && $scope.visitorPermit.data.permit_start_time && $scope.visitorPermit.data.permit_end_date && $scope.visitorPermit.data.permit_end_time){
					$scope.visitorPermit.next = false;
				} else {
					$scope.visitorPermit.next = true;
				}
			} else if($scope.visitorPermit.data.permit_type == 'extended_permit'){
					$scope.visitorPermit.next = true;
					// if($scope.visitorPermit.data.permit_start_date && $scope.visitorPermit.data.permit_start_time && $scope.visitorPermit.data.permit_end_date && $scope.visitorPermit.data.permit_end_time){
					// 	$scope.visitorPermit.next = false;
					// } else {
					// 	$scope.visitorPermit.next = true;
					// }
			} else {
				$scope.visitorPermit.next = false;
			}
		}

		
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
	};


	Date.prototype.yyyymmdd = function(days) {
	   var yyyy = this.getFullYear().toString();
	   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	   var dd  = (this.getDate()).toString();
	   console.log(dd);
	   return yyyy + '-'+ (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
	};

	Date.prototype.addDays = function(days)
	{
	    var dat = new Date(this.valueOf());
	    dat.setDate(dat.getDate() + days);
	    return dat;
	};

	var dat = new Date();
	console.log(dat);
	
	var xx = dat.addDays(1);
	console.log(xx);

	var z = xx.yyyymmdd();
	console.log(z);



	$scope.visitorPermit.visitorCreate = function(){

		// var dat = new Date();
		// console.log(dat);

		// var xx = dat.addDays(45);
		// console.log(xx);

		// var z = xx.yyyymmdd();
		// console.log(z);

		$scope.visitorPermit.next = true;

		$http({
			    method: 'GET',
			    //url: 'https://'+ appConfig.domain + '/permit_property/' + location_id,
			    url: 'https://'+ appConfig.domain + '/timezone/jtyhp3dwgs3j6v8cl2zl',
			    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
		})
		.success(function(datax, status, headers, config) {
			console.log(datax[0].UTCOffset);
			var offset = (Number(datax[0].UTCOffset) * -1);
		
			var d = '';
			var bd = '';
			var begin_time = '';
			var ed = '';
			var expire_time = '';
			var begin_hour = 0;
			var end_hour = 0;

			if($scope.visitorPermit.data.permit_type == 'custom_permit'){
				begin_time = convertDate($scope.visitorPermit.data.permit_start_date);
				end_time = convertDate($scope.visitorPermit.data.permit_end_date);
			} else if($scope.visitorPermit.data.permit_type == 'day_permit'){


				
				d = new Date();
				bd = d.yyyymmdd();

				bd = convertDate($scope.visitorPermit.data.permit_start_date);

				console.log(offset);
				begin_hour = 7 + offset;
				if(begin_hour < 10){
					begin_hour = "0" + begin_hour.toString();
				} else {
					begin_hour = begin_hour.toString();
				}

				begin_time = bd + ' ' + begin_hour + ':00:00';//07:00:00
				
				var end_d = new Date($scope.visitorPermit.data.permit_start_date);
				var xd = end_d.addDays(1);
				ed = xd.yyyymmdd();
				end_hour = 2 + offset;
				if(end_hour < 10){
					end_hour = "0" + end_hour.toString();
				} else {
					end_hour = end_hour.toString();
				}
				expire_time = ed + ' '+ end_hour +':00:00';//02:00:00
				console.log(bd + ' ' + ed);

			} else if($scope.visitorPermit.data.permit_type == 'overnight_permit'){

				//Date Setup
				d = new Date();

				//Begin Time
				bd = d.yyyymmdd();
				console.log('bd:'+bd);
				bd = convertDate($scope.visitorPermit.data.permit_start_date);

				begin_hour = 7 + offset;
				if(begin_hour < 10){
					begin_hour = "0" + begin_hour.toString();
				} else {
					begin_hour = begin_hour.toString();
				}
				begin_time = bd + ' ' + begin_hour + ':00:00';//07:00:00

				//End time
				var end_dd = new Date($scope.visitorPermit.data.permit_start_date);
				var cd = end_dd.addDays(1);
				ed = cd.yyyymmdd();
				end_hour = 11 + offset;
				if(end_hour < 10){
					end_hour = "0" + end_hour.toString();
				} else {
					end_hour = end_hour.toString();
				}
				expire_time = ed + ' '+ end_hour +':00:00';//11:00:00
				

			} else if($scope.visitorPermit.data.permit_type == 'three_permit'){

				d = new Date();

				bd = d.yyyymmdd();
				bd = convertDate($scope.visitorPermit.data.permit_start_date);
				begin_hour = 7 + offset;
				if(begin_hour < 10){
					begin_hour = "0" + begin_hour.toString();
				} else {
					begin_hour = begin_hour.toString();
				}

				begin_time = bd + ' ' + begin_hour + ':00:00';//07:00:00

				var end_ddd = new Date($scope.visitorPermit.data.permit_start_date);
				var xxd = end_ddd.addDays(3);
				ed = xxd.yyyymmdd();
				end_hour = 11 + offset;
				if(end_hour < 10){
					end_hour = "0" + end_hour.toString();
				} else {
					end_hour = end_hour.toString();
				}
				expire_time = ed + ' '+ end_hour +':00:00';//11:00:00

				console.log(begin_time + ' ' + expire_time);

			} else {

				d = new Date();
				bd = d.yyyymmdd();
				begin_time = bd + ' 00:00:00';

				d.addDays(14);
				ed = d.yyyymmdd();
				expire_time = ed + ' 23:59:00';
				console.log(bd + ' ' + ed);
			}
			

			var data = { "creator_uid": $scope.user.uid, "company_id": "t37rjido2qcxpnihkb3w", "property_id": "jtyhp3dwgs3j6v8cl2zl", "lot_id": "b06memz7ms39wo2tnyl5", "suite_number": $scope.visitorPermit.data.vistor_suite, "first_name": $scope.visitorPermit.data.first_name, "last_name": $scope.visitorPermit.data.last_name, "phone": $scope.visitorPermit.data.phone, "email": $scope.visitorPermit.data.email, "license_number": $scope.visitorPermit.data.vehicle_license, "car_make": $scope.visitorPermit.data.vehicle_make, "car_model": $scope.visitorPermit.data.vehicle_model, "car_color": $scope.visitorPermit.data.vehicle_color, "begin_time": begin_time, "expire_time":expire_time, "role":"visitor", "permit_class":"Visitor"};
			//"begin_time": $scope.visitorPermit.data.begin_time_set, "expire_time": $scope.visitorPermit.data.expire_time_set };

			console.log(data);

			$http({
			    method: 'POST',
			    url: 'https://'+ appConfig.domain + '/permit',
			    data: data,
			    headers: {'Content-Type': 'application/json', "Authorization": "Basic " + $rootScope.user.basicAuth}
			})
			.success(function(data, status) {
	            console.log(data);
	            notifications.showSuccess({
					message: 'Visitor Permit Created Successfully.',
			        hideDelay: 2000, //ms
			        hide: true //bool
				});
	            $location.path("/current-permits");
	        })
	        .error(function(data, status, headers, config) {
				console.log(data);
			});
		})
		.error(function(data, status, headers, config) {
			console.log(data);
		});

	};

	// jquery not triggering update for scope

	var convertDate = function(usDate) {
		var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
		return dateParts[3] + "-" + dateParts[1] + "-" + dateParts[2];
	};

	var timeConvert = function(time){
		var time_pre = time.substring(0, 5);
		var time_set = time_pre.split(":");
		var hours = Number(time_set[0]);
		var minutes = Number(time_set[1]);
		var AMPM = time_pre.slice(-2); //match(/\s(.*)$/)[1];
		if(AMPM == "pm" && hours<12) hours = hours+12;
		if(AMPM == "am" && hours==12) hours = hours-12;
		var sHours = hours.toString();
		var sMinutes = minutes.toString();
		if(hours<10) sHours = "0" + sHours;
		if(minutes<10) sMinutes = "0" + sMinutes;
		return sHours + ":" + sMinutes + ":00";
	};

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
    	"setDate": new Date(),
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

    $('#timepicker').timepicker();
    $('#timepicker').on('changeTime', function() {
    	    $scope.$apply(function() {
			    $scope.visitorPermit.data.permit_start_time = $('#timepicker').val();
			});
			//permit_custom_enable();

	});

    $('#timepicker2').timepicker();
    $('#timepicker2').on('changeTime', function() {
	    $scope.$apply(function() {
		    $scope.visitorPermit.data.permit_end_time = $('#timepicker2').val();
		});
		//permit_custom_enable();
	});


});