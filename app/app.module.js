//Configuration
var config = {
	api: "api",
	reports: "reports",
	domain: "partner-lechoix.locomobi.com"
};

//Starting the Angular app
var app = angular.module('partner-qpme', ['ngRoute','ngSanitize']);

//Sets the App Configuration
app.constant("appConfig", config);

//Cookie & Login Check
app.run(function ($rootScope, $location, $http, locationService) {
    console.log('app running');
});