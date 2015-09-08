xively.controller('registerController', ['$scope','$location','localStorageService','Socket','$http','OrdersService','API_URL','ngToast','VisitorsService','LSFactory','$window', function ($scope, $location,localStorageService,Socket,$http,OrdersService,API_URL,ngToast,VisitorsService,LSFactory,$window) {
    
    $scope.currentPerson;
    $scope.serveOrders=[];
    $scope.orders=[];
    $scope.totalOrders=0;
    $scope.currentIndex;
    $scope.visitors = [];
    $scope.cleanVisitorsT = VisitorsService.getVisitors();
    $scope.urlbarista="#";
    $scope.isFavorite=localStorageService.get('isFavorite');
    
    $scope.$watch('isFavorite',function(){
        localStorageService.set('isFavorite',$scope.isFavorite);
    },true);
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
    
     $scope.$watch('cleanVisitorsT', function () {
        visitorsToArray($scope.cleanVisitorsT);
    }, true);
    
    function visitorsToArray(oVisitors) {
    	$scope.visitors = oVisitors;
    }
    

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
                    $scope.currentPerson=$scope.orders[total];       
                else
                    $scope.currentIndex;
            }
			total++;
		});
		$scope.totalOrders = total;        
		
    },true);
    $scope.selectUser = function(){
        $scope.isFavorite=false;
        if($scope.selected===undefined) {
            ngToast.create({
            className: 'danger',
            content: 'Select full name.'
            });
            $scope.trySelect=true;
            return false;
        }
        if($scope.selected==="") {
            ngToast.create({
            className: 'danger',
            content: 'Select full name.'
            });
            $scope.trySelect=true;
            return false;
        }
        if(typeof $scope.selected!=='object') {
            ngToast.create({
            className: 'danger',
            content: 'Full name incorrect.'
            });
            $scope.trySelect=true;
            return false;
        }
        
        $scope.currentPerson = $scope.selected;
        $scope.urlbarista="/barista/menu";
        $scope.isFavorite=false;
        return true;
    }; 
    function getFavCoffeePerson(personSelected){
        var peopleTbl=VisitorsService.getVisitors();
        var favoriteCoffee="";
        
        var arrayLength = peopleTbl.length;
        for (var i = 0; i < arrayLength; i++) {
            if(peopleTbl[i].email===personSelected.email){
                favoriteCoffee =peopleTbl[i].favcoffee;
                break;
            }    
        return favoriteCoffee;
    } // end function getFavCoffeePerson
    }
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
    
	function getOrderCoffee(orders,obj) {
            var coffee="";
    		orders.forEach(function (order) {
    		   var active = parseInt(order.active);
    			if (order.email === obj.email && active===1) {
    			    if(order.favcoffee==="Regular Coffee"){
    			        order.favcoffee="Regular_Coffee";
    			    }
    			     if(order.favcoffee==="Decaf Coffee"){
    			        order.favcoffee="Decaf_Coffee";
    			    }
    				coffee=order.favcoffee; 
    				return coffee;      
    			}
    		});
    		return coffee;
    } // end function 
    $scope.cancel = function(){
        $scope.currentPerson=undefined;
    };
}]);