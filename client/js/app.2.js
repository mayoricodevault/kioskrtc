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
    'luegg.directives'
    ])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
        
        //typical routes... when someone navigates to a given directory, load the partial, and use the controller
        
        $routeProvider.when('/settings', {
                templateUrl: '/partials/setup.html', 
                controller: 'setupController'
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
                controller: 'splashController'
            
        });
        
        $routeProvider.when('/barista', {
                templateUrl: '/partials/barista/select.html', 
                controller: 'baristaController'
            
        });
        
        
          $routeProvider.when('/dashboard', {
                templateUrl: '/partials/dashboard/dashboard.html', 
                controller: 'dashboardController'
         
            
        });
        $routeProvider.when('/welcome', {
            templateUrl: '/partials/welcome/welcome.html'
           
            
        });

        $routeProvider.when('/barista/menu', {templateUrl: '/partials/barista/menu.html', controller: 'menuController'});
        $routeProvider.when('/barista/register', {templateUrl: '/partials/barista/register.html', controller: 'registerController'});
        $routeProvider.when('/kiosk/thankyou', {templateUrl: '/partials/kiosk/thankyou.html', controller: 'thankyouController'});
        $routeProvider.when('/kiosk/register', {templateUrl: '/partials/kiosk/register.html', controller: 'registerController'});
        $routeProvider.when('/kiosk/select', {templateUrl: '/partials/kiosk/select.html', controller: 'selectController' });
        
        
       
     
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
                    } else {
                        
                    }
                    if (devType=="barista" && $.inArray(path, baristaRoutes) != -1) {
                        return $q.when();
                    } else {
                         $location.path('/barista');
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
                  }
                  if (devType=="kiosk") {
                      $location.path('/splash');
                  }
                  if (devType=="barista") {
                      $location.path('/barista');
                  }
                   if (devType=="welcome") {
                      $location.path('/welcome');
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
    .constant('FIREBASE_URI_ROOT', 'https://kxively.firebaseio.com')
    .constant("API_URL", 'https://kiosk-mmayorivera.c9.io');
    