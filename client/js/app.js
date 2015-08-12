var xively = angular.module('xively', [
    'ngRoute',
    'ui.bootstrap',
    'ngResource',
    'ngAnimate',
    'btford.socket-io',
    'ui.odometer']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        
        //typical routes... when someone navigates to a given directory, load the partial, and use the controller
        $routeProvider.when('/home', {templateUrl: '/partials/home.html', controller: 'homeController'});
        $routeProvider.when('/projects', {templateUrl: '/partials/projects.html', controller: 'projectsController'});
        $routeProvider.when('/projects/generic', {templateUrl: '/partials/projects/generic.html', controller: 'genericController'});
         $routeProvider.when('/projects/openmenu', {templateUrl: '/partials/projects/openmenu.html', controller: 'openmenuController'});
        //if no valid routes are found, redirect to /home
        $routeProvider.otherwise({redirectTo: '/home'});
        //new comment
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    }])
    .filter('startFrom', function(){
        return function(data, start){
            return data.slice(start);
        }
    });
    