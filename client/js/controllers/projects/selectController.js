
xively.controller('selectController', ['$scope','$rootScope','Socket','localStorageService','sharedProperties','VisitorsService','storeService','$http','$location','SubscriptionFactory', 'LSFactory', 'API_URL','$window',function($scope,$rootScope, Socket,localStorageService,sharedProperties,VisitorsService,storeService,$http,$location,SubscriptionFactory, LSFactory, API_URL,$window){
    
    
    Socket.on('sync', function(data){
        if (LSFactory.getSessionId() === data.sessionid) {
            if (data.action === 'reset') {
                SubscriptionFactory.unsubscribe(data.socketid).
            		then(function success(response){
                        LSFactory.setData("sessionid");
                        LSFactory.setData("socketid");
                        LSFactory.setData("serverUrl");
                        LSFactory.setData("deviceName");
                        $rootScope.user = null;
                        $rootScope.socketidSession = null;
                        Socket.disconnect(true);
            			$window.location.href = API_URL+"/splash";
            		}, subsError);
            }
        }
         
    });
    
    $scope.paneSelected = storeService.jsonRead('paneSelected');
    $scope.currentPerson=storeService.jsonRead('dataActual');
    $scope.isFavorite=false;
    
    $scope.selected = undefined;
    
    /// GET INFORMATION PERSON
        //get current Person of Local Storage 
        $scope.currentPerson=sharedProperties.getPerson();
        if($scope.currentPerson===undefined)
        {
             var oldPerson=localStorageService.get('currentPerson');
             $scope.currentPerson=oldPerson || [];
             
        }
        
        //Save current Person in Local Storage
        $scope.$watch('currentPerson',function(){
                localStorageService.set('currentPerson',$scope.currentPerson);
        },true);
        
    /// END GET INFORMATION PERSON
    
    
    
    
    
    /// WELCOME CONTROLLER 
    
        //function "NO" button redirect MenuBar
        $scope.menuBar=function(){
           $scope.isFavorite=true;
           $scope.paneSelected = {id:'3'};
           storeService.jsonWrite('paneSelected',$scope.paneSelected);
        };
        
    /// END WELCOME CONTROLLER
    
    
    /*-------------------- REGISTER CONTROLLER -----------------------*/
    
        $scope.cleanVisitors = VisitorsService.getVisitors();
        $scope.visitors = [];
    
        $scope.$watch('cleanVisitors', function () {
            visitorsToArray($scope.cleanVisitors);
    	}, true);
        
        Socket.on('sync', function(data){
            if (data.action == 'restart') {
                // goto to splacj
            }
        });
        
        $scope.reset = function () {
            $scope.visitors = null;
            $scope.visitors = VisitorsService.getVisitors();
        };
        
        function visitorsToArray(oVisitors) {
            var total = 0;
    		$scope.visitors = [];
    		oVisitors.forEach(function (visitor) {
    			// Skip invalid entries so they don't break the entire app.
    			if (!visitor || !visitor.name) {
    				return;
    			}
                $scope.visitors.push(visitor);    
    			total++;
    		});
    		$scope.totalCount = total;
        }
        
        $scope.selectUser = function(){
             
             $scope.isFavorite=false;
             
             if($scope.selected===undefined)
                return false;
            
            $scope.paneSelected = {id:'3'};
            storeService.jsonWrite('dataActual',$scope.selected);
            $scope.currentPerson = storeService.jsonRead('dataActual');
            storeService.jsonWrite('paneSelected',$scope.paneSelected);
        
            return true;
        };
    
    /*-------------------- END REGISTER CONTROLLER -----------------------*/
    
    
    /*-------------------- MENU BAR CONTROLLER ----------------------------*/
    
    $scope.oldFavorite=$scope.currentPerson;
    
    $scope.black = false;
    $scope.mocha = false;
    $scope.iced = false;
    $scope.latte = false;
    $scope.cappuccino = false;
    $scope.other = false;
    
    
    $scope.defaultValues = function() {
       $scope.blacks = true; 
    };
    
    $scope.isActive = function(value) {
        switch (value) {
            case 1: return $scope.black;
            case 2: return $scope.mocha;
            case 3: return $scope.iced;
            case 4: return $scope.latte;
            case 5: return $scope.cappuccino;
            case 6: return $scope.other;
            
            default:
                // code
                break;
        }
    };
    
    $scope.activate = function(value) {
        $scope.black = false;
        $scope.mocha = false;
        $scope.iced = false;
        $scope.latte = false;
        $scope.cappuccino = false;
        $scope.other = false;
           
        switch (value) {
            case 1:
                $scope.black = true;  $scope.currentPerson.favcoffe="black";
                break;
            case 2: $scope.mocha = true; $scope.currentPerson.favcoffe="mocha";
                 break;
            case 3: $scope.iced = true; $scope.currentPerson.favcoffe="iced coffee";
                 break;
            case 4: $scope.latte = true; $scope.currentPerson.favcoffe="latte";
                break;
            case 5: $scope.cappuccino = true; $scope.currentPerson.favcoffe="cappuccino";
                 break;
            case 6: $scope.other = true; $scope.currentPerson.favcoffe="other";
                 break;
            default:
                // code
                break;
        }
        
    };
    
    // Start SideMenu

        $scope.people = [];
    
        //watch change local Storage;
        var oldPeople=localStorageService.get('people');
        $scope.people=oldPeople || [];
        
        $scope.$watch('people',function(){
            localStorageService.set('people',$scope.people);
        },true);
        //function "Order" send mensaje to server and queue 
        $scope.order=function(){
             $scope.people.push($scope.currentPerson);
             
             //send server 
             
        };
         //function "CANCEL" button 1 FAVORITE 2 REGISTER
        $scope.cancelMenuBar = function(){
            $scope.currentPerson=$scope.oldFavorite;
            if($scope.isFavorite===true)
                $scope.paneSelected = {id:'1'};
            else
                $scope.paneSelected = {id:'2'};
            storeService.jsonWrite('paneSelected',$scope.paneSelected);
        };
    // End SideMenu
    
    /*-------------------- END MENU BAR CONTROLLER ----------------------------*/
    
    
    /*---------------------Weather controller---------------------------------*/

	
	$scope.zip =$scope.currentPerson.zipcode;
	$http.get('https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20weather.forecast%20WHERE%20location%3D%22' + $scope.zip + '%22&format=json&diagnostics=true&callback=')
		.success(function(data){
			$scope.weather = data.query.results.channel
			$scope.forecast = data.query.results.channel.item.forecast
			$scope.tempIndex = (parseInt($scope.weather.item.condition.temp) - parseInt($scope.forecast[0].low)) / (parseInt($scope.forecast[0].high) - parseInt($scope.forecast[0].low)) * 100
			
	})
	/*-----------------End Weather ********************************************/
	
}]);