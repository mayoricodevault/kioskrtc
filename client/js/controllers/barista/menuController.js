
xively.controller('menuController', ['$scope', 'Socket','localStorageService' ,'$http','API_URL', 'Orders','FIREBASE_URI_ORDERS','OrdersService','LSFactory','VisitorsService','$window','$timeout',function($scope, Socket,localStorageService,$http,API_URL,Orders, FIREBASE_URI_ORDERS,OrdersService,LSFactory,VisitorsService,$window,$timeout){
    
    Socket.connect();
    $scope.currentPerson;
    $scope.serveOrders=[];
    $scope.orders=[];
    $scope.totalOrders=0;
    $scope.currentIndex;
    $scope.isFavorite=localStorageService.get('isFavorite');
    
    
    $scope.$watch('isFavorite',function(){
        localStorageService.set('isFavorite',$scope.isFavorite);
    },true);
            
    var currentPersonOld=localStorageService.get('currentPerson');
    $scope.currentPerson=currentPersonOld ||  [];
    $scope.$watch('currentPerson',function(){
        if($scope.currentPerson){
        $scope.selectFavCoffee();
        $http.post(API_URL + '/weather',$scope.getPlace($scope.currentPerson))
    	.success(function(data){
        		$scope.weather=data.query.results.channel;
        });
        }
        localStorageService.set('currentPerson',$scope.currentPerson);
       
    },true);
    $scope.selected = $scope.currentPerson;
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
        console.log("entra served");
        var person=$scope.currentPerson;
		person.zonefrom = LSFactory.getSessionId();

		
        var timeStamp = Math.floor(Date.now() / 1000);
        person.active="0"; //served
        person.timeStamp=timeStamp;
        var tagId=LSFactory.getTagId();
        person.tagId=tagId;
        person.favcoffee=$scope.favcoffee;	
        person.masterId="";
        person.tagId=LSFactory.getTagId();
		
        //Save Order
        $timeout(function(){
            $http.post(API_URL + '/add-order', { people: person }).
                then(function(response) {
                }, function(response) {
            },1000);                
        });		
		
		
		/*
		OrdersService.updateOrderStatus(person, 0);
		*/
		Socket.emit("served", person);
		$scope.currentPerson=undefined;
		
    };

    
    
    $scope.getPlace=function(person){
         $scope.place ={"city":person.city,"state":person.state};
         return $scope.place;
    };
    
    $scope.esp=false;
    $scope.cap=false;
    $scope.ame=false;
    $scope.reg=false;
    $scope.dec=false;
    $scope.tea=false;
    $scope.selectFavCoffee = function(){
        //**find orders or putting favorite coffee
        var favorite = {Espresso:1, Cappuccino:2, Americano:3,
                        Regular_Coffee:4, Decaf_Coffee:5, Tea:6};
        var orders=[];
        orders=OrdersService.getOrdersArray();        
        //find favorite coffee of seleted person
        var orderCoffeeOld=getOrderCoffee(orders,$scope.currentPerson);
        var outCoffee="";
         if(orderCoffeeOld!=""){
             outCoffee=favorite[orderCoffeeOld];
         }else{
             outCoffee=favorite[$scope.currentPerson.favcoffee.replace(" ","_")];
         }
        LSFactory.setData("favcoffee",outCoffee);    
        // *************  init beverages
        var currCoffee=LSFactory.getFavCoffee();
        //if(currCoffee!="null"){
        $scope.selectCoffee(currCoffee);        
        
    };
    $scope.selectCoffee=function(coffee){
        var cof = parseInt(coffee)
        $scope.esp=false;
        $scope.cap=false;
        $scope.ame=false;
        $scope.reg=false;
        $scope.dec=false;
        $scope.tea=false;
      switch (cof) {
        case 1: 
            $scope.esp=true;
            $scope.favcoffee="Espresso";
            break;
        case 2: 
            $scope.cap=true;
            $scope.favcoffee="Cappuccino";
            break;
        case 3: 
            $scope.ame=true;
            $scope.favcoffee="Americano";
            break;
        case 4: 
            $scope.reg=true;
            $scope.favcoffee="Regular Coffee";
            break;
        case 5: 
            $scope.dec=true;
            $scope.favcoffee="Decaf Coffee";
            break;
        case 6: 
            $scope.tea=true;
            $scope.favcoffee="Tea";
            break;                
        default: 
           $scope.esp=true;
           $scope.favcoffee="Espresso";
        }
    };     
    //select coffee button
    $scope.activeGlass = function(coffee){
        $scope.selectCoffee(coffee);
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
     
     
    function getFavCoffeePerson(personSelected){
        var peopleTbl=VisitorsService.getVisitors();
        var favoriteCoffee="";
        
        var arrayLength = peopleTbl.length;
        for (var i = 0; i < arrayLength; i++) {
            if(peopleTbl[i].email===personSelected.email){
                
                favoriteCoffee =peopleTbl[i].favcoffee;
                break;
            }    
            //Do something
        }
        return favoriteCoffee;
    } // end function getFavCoffeePerson     
}]);