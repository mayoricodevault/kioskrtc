var xively = angular.module('xively', [
    'ngRoute',
    'ui.bootstrap',
    'chart.js',
    'ngAnimate',
    'btford.socket-io',
    'infinite-scroll',
    'ui.odometer',
    'LocalStorageModule'])
    .config(['localStorageServiceProvider',function(localStorageServiceProvider){
        localStorageServiceProvider.setPrefix('xy')
    }])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        
        //typical routes... when someone navigates to a given directory, load the partial, and use the controller
        $routeProvider.when('/home', {templateUrl: '/partials/home.html', controller: 'homeController'});
        $routeProvider.when('/projects', {templateUrl: '/partials/projects.html', controller: 'projectsController'});
        $routeProvider.when('/projects/generic', {templateUrl: '/partials/projects/generic.html', controller: 'genericController'});
        $routeProvider.when('/projects/openmenu', {templateUrl: '/partials/projects/openmenu.html', controller: 'openmenuController'});
        $routeProvider.when('/projects/greetingh1', {templateUrl: '/partials/projects/greetingh1.html', controller: 'greetingh1Controller'});
        $routeProvider.when('/projects/greetingh2', {templateUrl: '/partials/projects/greetingh2.html', controller: 'greetingh2Controller'});
        $routeProvider.when('/projects/expressmenu', {templateUrl: '/partials/projects/expressmenu.html', controller: 'expressmenuController'});
        $routeProvider.when('/projects/dashboard', {templateUrl: '/partials/projects/dashboard.html', controller: 'dashboardController'});
        $routeProvider.when('/projects/dashboardop1', {templateUrl: '/partials/projects/dashboardop1.html', controller: 'dashboardop1Controller'});
        $routeProvider.when('/projects/dashboardop2', {templateUrl: '/partials/projects/dashboardop2.html', controller: 'dashboardop2Controller'});
        $routeProvider.when('/projects/coffeemenu', {templateUrl: '/partials/projects/coffeemenu.html', controller: 'coffeemenuController'});
        $routeProvider.when('/projects/kiosk1', {templateUrl: '/partials/projects/kiosk1.html', controller: 'kiosk1Controller'});
        $routeProvider.when('/projects/kioskfavorite', {templateUrl: '/partials/projects/kioskfavorite.html', controller: 'kioskfavoriteController'});
        $routeProvider.when('/projects/kioskmenu', {templateUrl: '/partials/projects/kioskmenu.html', controller: 'kioskmenuController'});
        $routeProvider.when('/projects/kioskthankyou', {templateUrl: '/partials/projects/kioskthankyou.html', controller: 'kioskthankyouController'});
        $routeProvider.when('/projects/splash', {templateUrl: '/partials/projects/splash.html', controller: 'kiosksplashController'});
        $routeProvider.when('/projects/baristafavorite', {templateUrl: '/partials/projects/baristafavorite.html', controller: 'baristaController'});
        $routeProvider.when('/projects/baristamenu', {templateUrl: '/partials/projects/baristamenu.html', controller: 'baristamenuController'});
        $routeProvider.when('/projects/list', {templateUrl: '/partials/projects/list.html', controller: 'listController'});
        $routeProvider.when('/projects/kioskname', {templateUrl: '/partials/projects/kioskname.html', controller: 'kiosknameController'});
        $routeProvider.when('/projects/kiosknameop2', {templateUrl: '/partials/projects/kiosknameop2.html', controller: 'kiosknameop2Controller'});
        
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
    
    