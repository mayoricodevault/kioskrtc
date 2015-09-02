xively.controller('registerController', ['$scope','$location','localStorageService','Socket','$http','OrdersService','API_URL', function ($scope, $location,localStorageService,Socket,$http,OrdersService,API_URL) {
    
    $scope.currentPerson;
    $scope.serveOrders=[];
    $scope.orders=[];
    $scope.totalOrders=0;
    $scope.currentIndex;

    var currentPersonOld=localStorageService.get('currentPerson');
    $scope.currentPerson=currentPersonOld || [];
    $scope.$watch('currentPerson',function(){
        localStorageService.set('currentPerson',$scope.currentPerson);
    },true);

    var currentIndexOld=localStorageService.get('currentIndex');
    $scope.currentIndex=currentIndexOld || 0;
    $scope.$watch('currentIndex',function(){
        localStorageService.set('currentIndex',$scope.currentIndex);
    },true);

    var fbBind =  OrdersService.getOrders();
    fbBind.$bindTo($scope,"serveOrders").then(function() {
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
		
    });    
    
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
    
    $scope.isActiveOrder=function(active)
    {
        if(active===1)
            return true;
        return false;
    };
    
    $scope.isActive=function(index){
 	    if(index==$scope.currentIndex)
 	        return true;
 	    return false;
 	};
    
    $scope.active=function(person,index) {
         $scope.currentPerson=person;
         $scope.currentIndex=index;
    };

    $scope.zip ={"zipcode":$scope.currentPerson.zipcode};
	$http.post('https://kiosk-mmayorivera.c9.io/weather',$scope.zip)
		.success(function(data){
			$scope.weather=data.query.results.channel;
	});

}]);