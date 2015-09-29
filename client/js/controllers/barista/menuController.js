
xively.controller('menuController', ['$scope', 'Socket','localStorageService' ,'$http','API_URL', 'Orders','FIREBASE_URI_ORDERS','OrdersService','LSFactory','VisitorsService','$window','$timeout','$location',function($scope, Socket,localStorageService,$http,API_URL,Orders, FIREBASE_URI_ORDERS,OrdersService,LSFactory,VisitorsService,$window,$timeout,$location){
    
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
              localStorageService.set('currentPerson',$scope.currentPerson);
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
		
        var person=$scope.currentPerson;
        console.log(person);
        $scope.currentPerson=undefined;
        
		person.zonefrom = LSFactory.getSessionId();

		
        var timeStamp = Math.floor(Date.now());
        person.active="0"; //served
        person.timeStamp=timeStamp;
        var tagId=LSFactory.getTagId();
        person.tagId=tagId;
        person.favcoffee=$scope.favcoffee;	
        if(!person.masterId)
            person.masterId=LSFactory.getTagId();
        		if(!person.region){
		    person.region="";
		}
		if(!person.state){
		    person.state="";
		}
		if(!person.favcoffee){
		    person.favcoffee="";
		}
		if(!person.city)
		    person.city="";
        person.tagId=LSFactory.getTagId();
        person.companyname="";
        if(!person.zoneto)
        person.zoneto=person.masterId;
		
        //Save Order
        
        OrdersService.updateOrderStatus(person, 0);
        
        var bodyOrder = {
            "name": person.thingid,
            "serial": person.id
        };
        $http.post(API_URL + '/vizix-order', bodyOrder)
            .then(function(response) {
                console.log("Response message1: ");
                console.log(response);
            }, function( response ){
                  console.log("Response message2: ");
                console.log(response);
                
            }
        );       
		
		Socket.emit("served", person);
		$timeout(function() {
            $location.path("/barista");
        }, 1000);
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