var xively = angular.module('xively', ['ng.deviceDetector',
    'ngRoute',
    'ngMessages',
    'ngResource',
    'ui.bootstrap',
    'chart.js',
    'ngAnimate',
    'luegg.directives',
    'btford.socket-io',
    'infinite-scroll',
    'LocalStorageModule',
    'firebase',
    'ngToast',
    'ngQueue'
    ])
    .config(['ngToastProvider', function(ngToast) {
    ngToast.configure({
      verticalPosition: 'top',
      horizontalPosition: 'center',
      maxNumber: 2,
      additionalClasses: 'xively-animation'
    });
    }])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
        
        //typical routes... when someone navigates to a given directory, load the partial, and use the controller
        
        $routeProvider.when('/settings', {
                templateUrl: '/partials/setup.html', 
                controller: 'setupController',
                resolve: {isauthenticate: isauthenticate}
                // resolve: {
                //     app: function($q) {
                //         var  defer = $q.defer();
                //         defer.resolve();
                //         return defer.promise;
                //     }
                // }
            
        });
        
        $routeProvider.when('/splash', {
                templateUrl: '/partials/splash.html', 
                controller: 'splashController',
                resolve: {authenticate: authenticate}
            
        });
        
        $routeProvider.when('/barista', {
                templateUrl: '/partials/barista/select.html', 
                controller: 'baristaController',
                resolve: {authenticate: authenticate}
            
        });
        
        
          $routeProvider.when('/dashboard', {
                templateUrl: '/partials/dashboard/dashboard.html', 
                controller: 'dashboardController',
                resolve: {authenticate: authenticate}
            
        });
        $routeProvider.when('/welcome', {
            templateUrl: '/partials/welcome/welcome.html', 
            controller: 'welcomeController',
            resolve: {authenticate: authenticate} 
            
        });

        $routeProvider.when('/barista/menu', {templateUrl: '/partials/barista/menu.html', controller: 'menuController', resolve: {authenticate: authenticate}});
        $routeProvider.when('/barista/register', {templateUrl: '/partials/barista/register.html', controller: 'registerController', resolve: {authenticate: authenticate}});
        $routeProvider.when('/kiosk/thankyou', {templateUrl: '/partials/kiosk/thankyou.html', controller: 'thankyouController', resolve: {authenticate: authenticate}});
        $routeProvider.when('/kiosk/register', {templateUrl: '/partials/kiosk/register.html', controller: 'registerController', resolve: {authenticate: authenticate}});
        $routeProvider.when('/kiosk/select', {templateUrl: '/partials/kiosk/select.html', controller: 'selectController', resolve: {authenticate: authenticate} });
        //if no valid routes are found, redirect to /home
        $routeProvider.otherwise({redirectTo: '/settings'});

        $locationProvider.html5Mode({enabled: true, requireBase: false});
        $httpProvider.interceptors.push('AuthInterceptor');
        
        function authenticate($q, LSFactory , $timeout, $location, AuthTokenFactory) {
              var path = $location.path();
                var baristaRoutes = ["/barista/menu", "/barista/register", "/barista"];
                var dashboardRoutes = ["/dashboard"];
                var welcomeRoutes = ["/welcome"];
                var kioskRoutes = ["/kiosk/thankyou", "/kiosk/register", '/kiosk/select', '/splash'];              
              if (LSFactory.getSessionId() && AuthTokenFactory.getToken() ) {
                    var devType = LSFactory.getDeviceType();
                    if (devType=="dashboard" && $.inArray(path, dashboardRoutes) != -1) {
                        return $q.when();
                    } 
                    if (devType=="welcome" && $.inArray(path, welcomeRoutes) != -1) {
                        return $q.when();
                    } 
                    if (devType=="kiosk" && $.inArray(path, kioskRoutes) != -1) {
                        return $q.when();
                    } 
                    if (devType=="barista" && $.inArray(path, baristaRoutes) != -1) {
                        return $q.when();
                    } 
                    return $q.reject();
              } else {
                $timeout(function() {
                  	 $location.path('/settings');
                });

                return $q.reject();
              }
        }
        
        function isauthenticate($q, LSFactory , $timeout, $location, AuthTokenFactory) {
              if (LSFactory.getSessionId() && AuthTokenFactory.getToken() ) {
                  var devType = LSFactory.getDeviceType();
                  if (devType=="dashboard") {
                      $location.path('/dashboard');
                      return $q.when();
                  }
                  if (devType=="kiosk") {
                      $location.path('/splash');
                      return $q.when();
                  }
                  if (devType=="barista") {
                      $location.path('/barista');
                  }
                   if (devType=="welcome") {
                      $location.path('/welcome');
                      return $q.when();
                  }
                  return $q.reject();
              } else {
                    return $q.when();

              }
        }
        
    }])
    .filter('startFrom', function(){
        return function(data, start){
            return data.slice(start);
        };
    })
   
    .constant('FIREBASE_URI', 'https://kxively.firebaseio.com/people')
    .constant('FIREBASE_URI_ORDERS', 'https://kxively.firebaseio.com/orders')
    .constant('FIREBASE_URI_MSGS', 'https://kxively.firebaseio.com/messages')
    .constant('FIREBASE_URI_ROOT', 'https://kxively.firebaseio.com')
    .constant("API_URL", 'https://kiosk-mmayorivera.c9.io');
    