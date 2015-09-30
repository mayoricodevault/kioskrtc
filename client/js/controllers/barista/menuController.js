
xively.controller('menuController', ['$scope', 'Socket','localStorageService' ,'$http','API_URL', 'Orders','FIREBASE_URI_ORDERS','OrdersService','LSFactory','VisitorsService','$window','$timeout','$location',function($scope, Socket,localStorageService,$http,API_URL,Orders, FIREBASE_URI_ORDERS,OrdersService,LSFactory,VisitorsService,$window,$timeout,$location){
    $scope.currentPerson;
    $scope.serveOrders=[];
    $scope.orders=[];
    $scope.totalOrders=0;
    $scope.currentIndex;
    $scope.esp=false;
    $scope.cap=false;
    $scope.ame=false;
    $scope.reg=false;
    $scope.dec=false;
    $scope.tea=false;
    $scope.isFavorite=localStorageService.get('isFavorite');
    $scope.$watch('isFavorite',function(){
        localStorageService.set('isFavorite',$scope.isFavorite);
    },true);
    var currentPersonOld=localStorageService.get('currentPerson');
    $scope.currentPerson=currentPersonOld ||  [];
    if($scope.currentPerson){
        $scope.orders=OrdersService.getOrdersArray();  
        var orderPerson = _.find($scope.orders, function(findord) {
            return findord.id === $scope.currentPerson.id ; 
        });
        if (orderPerson) {
            $scope.currentPerson = orderPerson;
        } 
         $scope.currentPerson.zonefrom = "Barista";
        $scope.currentPerson.zoneto=LSFactory.getTagId();
        $scope.currentPerson.tagId=LSFactory.getTagId();
        $scope.currentPerson.masterId=LSFactory.getMasterId();     
    }
    localStorageService.set('currentPerson',$scope.currentPerson);
    selectCoffee(complementCoffeePrefix($scope.currentPerson.favcoffee));
    $scope.selected = $scope.currentPerson;
    var currentIndexOld=localStorageService.get('currentIndex');
    $scope.currentIndex=currentIndexOld || 0;
    $scope.$watch('currentIndex',function(){
        localStorageService.set('currentIndex',$scope.currentIndex);
    },true);
    
    $scope.served=function(){
        var orderPerson=$scope.currentPerson;
        $scope.currentPerson=undefined;
        orderPerson.active=0;
        orderPerson.timeStamp = new Date().getTime();     
        orderPerson.favcoffee=$scope.favcoffee;	
        OrdersService.updateOrderStatus(orderPerson, 0);
        var bodyOrder = {
            "name": orderPerson.thingid,
            "serial": orderPerson.id
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
		$timeout(function() {
            $location.path("/barista");
        }, 1000);
    };

    $scope.getPlace=function(person){
         $scope.place ={"city":person.city,"state":person.state};
         return $scope.place;
    };
    
    function complementCoffeePrefix(coffee){
        var prefIndex=0;
        if(coffee==="Espresso"){
            prefIndex = 1;
        }
        if(coffee==="Cappuccino"){
            prefIndex = 2;
        }
        if(coffee==="Regular Coffee"){
            prefIndex = 4;
        }
        if(coffee==="Tea"){
            prefIndex = 6;
        }
        if(coffee==="Decaf Coffee"){
            prefIndex = 5;
        }
        if(coffee==="Americano"){
            prefIndex = 3;
        }
        return prefIndex;
    }
    
    function selectCoffee(coffee){
        $scope.esp=false;
        $scope.cap=false;
        $scope.ame=false;
        $scope.reg=false;
        $scope.dec=false;
        $scope.tea=false;
      switch (coffee) {
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
        selectCoffee(coffee);
    };    
    
}]);