
xively.controller('menuController', ['$scope', 'Socket','localStorageService' ,'$http','OrdersService','API_URL',function($scope, Socket,localStorageService,$http,OrdersService,API_URL){
    
    Socket.connect();
    $scope.currentPerson;
    $scope.serveOrders=[];
    $scope.orders=[];
    $scope.totalOrders=0;
    $scope.currentIndex;
    
    var currentPersonOld=localStorageService.get('currentPerson');
    $scope.currentPerson=currentPersonOld ||  [];
    $scope.$watch('currentPerson',function(){
        localStorageService.set('currentPerson',$scope.currentPerson);
    },true);
    
    var currentIndexOld=localStorageService.get('currentIndex');
    $scope.currentIndex=currentIndexOld || 0;
    $scope.$watch('currentIndex',function(){
        localStorageService.set('currentIndex',$scope.currentIndex);
    },true);
    
    var fbBind =  OrdersService.getOrders();
    fbBind.$bindTo($scope, "serveOrders").then(function() {
        var total = 0;
		$scope.orders = [];
		angular.forEach($scope.serveOrders, function(order){
			if (!order || !order.name) {
				return;
			}
            $scope.orders.push(order);
			total++;
		});
		$scope.totalOrders = total;        
		
    });    
    
    $scope.isActiveOrder=function(index){
 	    if(index==$scope.currentIndex)
 	        return true;
 	    return false;
 	};
 	$scope.isActiveName=function(index){
 	    if(index==$scope.currentIndex)
 	        return true;
 	    return false;
 	};
 	
 	 $scope.$watch('serveOrders',function(){
        var total = 0;
		$scope.orders = [];
		angular.forEach($scope.serveOrders, function(order){
			if (!order || !order.name) {
				return;
			}
            $scope.orders.push(order);
            if(total===$scope.currentIndex){
                if($scope.orders[total].active===1)
                {
                    $scope.currentPerson=$scope.orders[total];       
                }
                else
                    $scope.currentIndex;
            }
			total++;
		});
		$scope.totalOrders = total;        
		
    },true);
    $scope.served=function(){
        var people=$scope.currentPerson;
		people.active="0";
        $http.post(API_URL + '/add-order', {people:people}).
            then(function(response) {
        }, function(response) {
        }); 
        for(var i=0;i<	$scope.orders.length;i++){
            $scope.currentIndex=i;
            $scope.currentPerson=	$scope.orders[i];
            if(	$scope.orders[i].active==1)
                break;
        }
    };
    
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
                $scope.black = true;  $scope.currentPerson.favcoffee="Espresso";
                break;
            case 2: $scope.mocha = true; $scope.currentPerson.favcoffee="Cappuccino";
                 break;
            case 3: $scope.iced = true; $scope.currentPerson.favcoffee="Americano";
                 break;
            case 4: $scope.latte = true; $scope.currentPerson.favcoffee="Regular Coffee";
                break;
            case 5: $scope.cappuccino = true; $scope.currentPerson.favcoffee="Decaf Coffee";
                 break;
            case 6: $scope.other = true; $scope.currentPerson.favcoffee="Tea";
                 break;
            default:
                // code
                break;
                
            console.log($scope.currentPerson.favcoffee);
        }
        
    };
    /*
    $scope.zip ={"zipcode":$scope.currentPerson.zipcode};
    $http.post('https://kiosk-mmayorivera.c9.io/weather',$scope.zip)
    .success(function(data){
    	$scope.weather=data.query.results.channel;
    
    });
    function subsError(response) {
    alert("error" + response.data);
    }
    */
     
}]);