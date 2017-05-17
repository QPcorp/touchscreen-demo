app.controller('mainController', function($scope, $rootScope, $location){
	$scope.message = 'This is a homepage message';
	this.booger = function(){
		alert('Uses the "this"');
	};
	$scope.booger = function(){
		alert('Uses the "$scope"');
		$('.boogerTitle').html('Changed by Jquery');
	};

	$scope.pin = '';

	$scope.addNumber = function(num){
		$scope.pin = $scope.pin + num.toString();
	};

	function addNumber(e){
		//document.getElementById('PINbox').value = document.getElementById('PINbox').value+element.value;
		var v = $( "#PINbox" ).val();
		$( "#PINbox" ).val( v + e.value );
	}
	function clearForm(e){
		//document.getElementById('PINbox').value = "";
		$( "#PINbox" ).val( "" );
	}

	$scope.submitPin = function(){
		$location.path("/pay");
	};

	document.getElementById('PINbox').addEventListener('input', function (e) {
		e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
	});

});