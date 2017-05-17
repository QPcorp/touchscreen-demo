// configure our routes
app.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'app/templates/code.html',
            controller  : 'mainController'
        })

        .when('/pay', {
            templateUrl : 'app/templates/pay.html',
            controller  : 'payController'
        })  

        .when('/success', {
            templateUrl : 'app/templates/dashboard.html'
        });

});