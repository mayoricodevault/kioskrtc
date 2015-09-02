xively.controller('baristaController', ['$scope','$location','localStorageService','Socket','$http','OrdersService','API_URL', 'LSFactory', function ($scope, $location,localStorageService,Socket,$http,OrdersService,API_URL, LSFactory) {
    
    $scope.currentPerson;
    $scope.serveOrders=[];
    $scope.orders=[];
    $scope.totalOrders=0;
    $scope.totalOrdersActive=0;
    $scope.currentIndex;
    $scope.currentfavcoffee;
    
    var currentPersonOld=localStorageService.get('currentPerson');
    $scope.currentPerson=currentPersonOld || [];
    
    var currentIndexOld=localStorageService.get('currentIndex');
    $scope.currentIndex=currentIndexOld || 0;
    
    $scope.$watch('currentPerson',function(){
        $scope.zip ={"zipcode":$scope.currentPerson.zipcode};
        $http.post('https://kiosk-mmayorivera.c9.io/weather',$scope.zip)
        	.success(function(data){
        		$scope.weather=data.query.results.channel;
        });
        $scope.coffee($scope.currentPerson.favcoffee);
        localStorageService.set('currentPerson',$scope.currentPerson);
    },true);
    $scope.$watch('currentIndex',function(){
        localStorageService.set('currentIndex',$scope.currentIndex);
    },true);

    var fbBind =  OrdersService.getOrders();
    fbBind.$bindTo($scope,"serveOrders").then(function() {
        refreshFb();
    });    
    
    $scope.$watch('serveOrders',function(){
        refreshFb();
    },true);
    
    $scope.served=function(){
        var people=$scope.currentPerson;
		people.active="0";
		people.zonefrom = LSFactory.getSessionId();
        $http.post(API_URL + '/add-order', {people:people}).
            then(function(response) {
        }, function(response) {
        }); 
        $scope.orders.sort(compare);
        for(var i=0;i<$scope.orders.length;i++){
            console.log(i+$scope.orders[i].name);
            $scope.currentIndex=i;
            $scope.currentPerson=$scope.orders[i];
            if($scope.orders[i].active==1)
                break;
        }
        $scope.totalOrdersActive--;
    };
    
    $scope.isActiveOrder=function(active)
    {
        if(active==1)
            return true;
        return false;
    };
    
    $scope.isActive=function(index){
 	    if(index==$scope.currentIndex && $scope.totalOrdersActive>0){
 	        return true;
 	    }
 	        
 	    return false;
 	};
    
    $scope.active=function(person,index) {
         $scope.currentPerson=person;
         $scope.currentIndex=index;
        $scope.coffee($scope.currentPerson.favcoffee);
         
    };

   
	
	function refreshFb(){
	    var total = 0;
		$scope.orders = [];
		angular.forEach($scope.serveOrders, function(order){
			if (!order || !order.name) {
				return;
			}
	        $scope.orders.push(order);
	        if (order.active==1) {
	            $scope.totalOrdersActive++;
	        }
        	total++;
		}); 
		$scope.totalOrders = total;
		$scope.orders.sort(compare);
		if($scope.totalOrdersActive==1 ){
		    console.log("Asdas");
		    for(var i=0;i<$scope.totalOrders;i++){
		        if($scope.orders[i].active==1){
		            $scope.currentIndex=i;
		            $scope.currentPerson=$scope.orders[i];
		        }
		    }
		}
	}
    $scope.coffee= function(coffee){
   
        if(coffee==="Espresso")
            $scope.currentfavcoffee="esp";
        if(coffee==="Cappuccino")
            $scope.currentfavcoffee="cap";
        if(coffee==="Regular Coffee")
            $scope.currentfavcoffee="reg";
        if(coffee==="Tea")
            $scope.currentfavcoffee="tea";
        if(coffee==="Decaf Coffee")
            $scope.currentfavcoffee="dec";
        if(coffee==="Americano")
            $scope.currentfavcoffee="amer";
    };
    
    function compare(a,b) {
        if (a.timeStamp < b.timeStamp)
            return -1;
        if (a.timeStamp > b.timeStamp)
            return 1;
    return 0;
    }

    
}]);