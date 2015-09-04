
xively.controller('menuController', ['$scope', 'Socket','localStorageService' ,'$http','API_URL', 'Orders','FIREBASE_URI_ORDERS',function($scope, Socket,localStorageService,$http,API_URL,Orders, FIREBASE_URI_ORDERS){
    
    Socket.connect();
    $scope.currentPerson;
    $scope.serveOrders=[];
    $scope.orders=[];
    $scope.totalOrders=0;
    $scope.currentIndex;
    
    Orders(FIREBASE_URI_ORDERS).$bindTo($scope, "fbBind");
    $scope.$watch('fbBind', function() {
        refreshFb();
    });    
    
    var currentPersonOld=localStorageService.get('currentPerson');
    $scope.currentPerson=currentPersonOld ||  [];
    $scope.$watch('currentPerson',function(){
         $http.post(API_URL + '/weather',$scope.getPlace($scope.currentPerson))
        	.success(function(data){
        		$scope.weather=data.query.results.channel;
            });
        localStorageService.set('currentPerson',$scope.currentPerson);
    },true);
    
    var currentIndexOld=localStorageService.get('currentIndex');
    $scope.currentIndex=currentIndexOld || 0;
    $scope.$watch('currentIndex',function(){
        localStorageService.set('currentIndex',$scope.currentIndex);
    },true);
    
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
      $scope.getPlace=function(person){
         $scope.place ={"city":person.city,"state":person.state};
         return $scope.place;
    };
    
    function refreshFb(){
	    var total = 0;
	    $scope.totalOrdersActive=0;
		$scope.orders = [];
		angular.forEach($scope.fbBind, function(order){
			if (!order || !order.name) {
				return;
			}
	        $scope.orders.push(order);
	        if (order.active==1 &&  $scope.baristaTagID==order.masterId ) {
	            $scope.totalOrdersActive++;
	        }
        	total++;
		}); 
		$scope.totalOrders = total;
		$scope.orders.sort(compare);
		if($scope.totalOrdersActive==1 ){
		    for(var i=0;i<$scope.totalOrders;i++){
		        if($scope.orders[i].active==1){
		            $scope.currentIndex=i;
		            $scope.currentPerson=$scope.orders[i];
		        }
		    }
		}
	}
    function compare(a,b) {
        if (a.timeStamp < b.timeStamp)
            return -1;
        if (a.timeStamp > b.timeStamp)
            return 1;
    return 0;
    }
     
}]);