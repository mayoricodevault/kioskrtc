xively.controller('registerController', ['$scope','$location','localStorageService','Socket','$http','OrdersService','API_URL','ngToast','VisitorsService','LSFactory', function ($scope, $location,localStorageService,Socket,$http,OrdersService,API_URL,ngToast,VisitorsService,LSFactory) {
    
    $scope.currentPerson;
    $scope.serveOrders=[];
    $scope.orders=[];
    $scope.totalOrders=0;
    $scope.currentIndex;
    $scope.visitors = [];
    $scope.cleanVisitorsT = VisitorsService.getVisitors();
    
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
    
    $scope.selectUser = function(){
        $scope.isFavorite=false;
        if($scope.selected===undefined) {
            ngToast.create('a toast message...');
            $scope.trySelect=true;
            return false;
        }
        if($scope.selected==="") {
            ngToast.create('a toast message...');
            $scope.trySelect=true;
            return false;
        }
        if(typeof $scope.selected!=='object') {
            ngToast.create('a toast message...');
            $scope.trySelect=true;
            return false;
        }
        
        $scope.currentPerson = $scope.selected;
        //**find orders or putting favorite coffee
        
        var favorite = {Espresso:1, Cappuccino:2, Americano:3,
                        Regular_Coffee:4, Decaf_Coffee:5, Tea:6};
                        
        // Get Orders
        var orders=[];
        orders=OrdersService.getOrdersArray();        
         //find favorite coffee of seleted person
         
        var orderCoffeeOld=getOrderCoffee(orders,$scope.currentPerson);
        var outCoffee="";
         if(orderCoffeeOld!=""){
             console.info("*** NO ES VACIO" +orderCoffeeOld+"value");
             outCoffee=favorite[orderCoffeeOld];
         }else{
             console.info("*** SI ES VACIO");
            // console.info("FAVOTITE VIDEO "+getFavCoffeePerson($scope.selected));
             $scope.currentPerson.favcoffee=getFavCoffeePerson($scope.selected);            
             outCoffee=favorite[$scope.currentPerson.favcoffee.replace(" ","_")];
         }
        console.info(">>>> FAV COFFEE "+ outCoffee); 
        LSFactory.setData("favcoffee",outCoffee);    
        
        // *************  init beverages
        var currCoffee=LSFactory.getFavCoffee();
        //console.info(">>>> ARIEL COFFEE "+currCoffee);
        //if(currCoffee!="null"){
          $scope.selectCoffee(currCoffee);
        //}//end if
        
    
        return true;
    }; 
    
    function getFavCoffeePerson(personSelected){
        var peopleTbl=VisitorsService.getVisitors();
        var favoriteCoffee="";
        
        var arrayLength = peopleTbl.length;
        for (var i = 0; i < arrayLength; i++) {
            console.info("**********************");
            console.info(JSON.stringify(peopleTbl[i]));
            console.info(" >>AA: "+peopleTbl[i].email);
            console.info(" >>BB:"+personSelected.email);
            console.info(" >>COFF"+peopleTbl[i].favcoffee);
            console.info("**********************");
            if(peopleTbl[i].email===personSelected.email){
                
                favoriteCoffee =peopleTbl[i].favcoffee;
                console.log("SI "+favoriteCoffee);
                break;
            }    
            //Do something
        }
        /*
        peopleTbl.forEach(function(p){
            if(p.email===personSelected.email){
                console.info("** IGUAL COFFE FOR "+p.favcoffee+" NEW "+ personSelected.favcoffee);
                favoriteCoffee = p.favcoffee;
                console.log("FAVORITE COFFEEAA "+favoriteCoffee);
                return favoriteCoffee;
            }
        });*/
        console.log("FAVORITE COFFEE "+favoriteCoffee);
        return favoriteCoffee;
    } // end function getFavCoffeePerson
    
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
    		/*
    		if(coffee===""){
    		    console.log("NOT ENCONTRADO");
			    if(obj.favcoffee==="Regular Coffee"){
			        obj.favcoffee="Regular_Coffee";
			    }
			     if(obj.favcoffee==="Decaf Coffee"){
			        obj.favcoffee="Decaf_Coffee";
			    }    		    
    		    coffee=obj.favcoffee;
    		}*/
    		console.info(">> RETURN "+coffee +"<<");
    		return coffee;
        } // end function 

}]);